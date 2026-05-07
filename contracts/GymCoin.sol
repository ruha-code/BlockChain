// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract GymCoin is ERC20, AccessControl, Pausable, ReentrancyGuard {

    address public adminAddress;

    uint256 public sellRate;
    uint256 public buyRate;
    uint256 public maxBuyAmount;
    uint256 public maxSellAmount;

    mapping(address => bool)    public blacklisted;
    mapping(address => uint256) public membershipExpiry;
    uint256 public membershipPrice;
    uint256 public membershipDuration;

    event TokensBought(address indexed buyer, uint256 gcAmount, uint256 ethAmount);
    event TokensSold(address indexed seller, uint256 gcAmount, uint256 ethAmount);
    event RatesUpdated(uint256 newSellRate, uint256 newBuyRate);
    event LimitsUpdated(uint256 maxBuy, uint256 maxSell);
    event Blacklisted(address indexed account);
    event Unblacklisted(address indexed account);
    event MembershipPurchased(address indexed member, uint256 expiry);
    event MembershipConfigUpdated(uint256 price, uint256 duration);

    modifier onlyOwner() {
        require(msg.sender == adminAddress, "Not owner");
        _;
    }

    constructor(
        uint256 initialSupply,
        uint256 _sellRate,
        uint256 _buyRate,
        uint256 _maxBuyAmount,
        uint256 _maxSellAmount,
        uint256 _membershipPrice,
        uint256 _membershipDuration
    ) ERC20("Gym Coin", "GC") {
        adminAddress = msg.sender;
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);

        _mint(msg.sender, initialSupply * 10 ** decimals());

        sellRate           = _sellRate;
        buyRate            = _buyRate;
        maxBuyAmount       = _maxBuyAmount;
        maxSellAmount      = _maxSellAmount;
        membershipPrice    = _membershipPrice;
        membershipDuration = _membershipDuration;
    }

    // ─── Transfer hook: pause + blacklist ─────────────────────────────────────
    function _update(address from, address to, uint256 value) internal override {
        if (from != address(0)) {
            require(!paused(),          "Contract is paused");
            require(!blacklisted[from], "Sender is blacklisted");
        }
        if (to != address(0)) {
            require(!blacklisted[to],   "Recipient is blacklisted");
        }
        super._update(from, to, value);
    }

    // ─── Buy ─────────────────────────────────────────────────────────────────
    function buy(uint256 gcAmount) public payable nonReentrant {
        require(gcAmount > 0,             "Amount must be greater than 0");
        require(gcAmount <= maxBuyAmount, "Exceeds max buy amount");

        uint256 gcWei       = gcAmount * 10 ** decimals();
        uint256 requiredEth = gcAmount * sellRate;

        require(msg.value >= requiredEth,         "Insufficient ETH sent");
        require(balanceOf(adminAddress) >= gcWei, "Owner has insufficient tokens");

        _transfer(adminAddress, msg.sender, gcWei);

        uint256 excess = msg.value - requiredEth;
        if (excess > 0) {
            (bool sent, ) = msg.sender.call{value: excess}("");
            require(sent, "Failed to refund excess ETH");
        }

        emit TokensBought(msg.sender, gcAmount, requiredEth);
    }

    // ─── Sell ────────────────────────────────────────────────────────────────
    function sell(uint256 gcAmount) public nonReentrant {
        require(gcAmount > 0,              "Amount must be greater than 0");
        require(gcAmount <= maxSellAmount, "Exceeds max sell amount");
        require(msg.sender != adminAddress, "Owner cannot sell tokens");

        uint256 gcWei     = gcAmount * 10 ** decimals();
        uint256 ethAmount = gcAmount * buyRate;

        require(balanceOf(msg.sender) >= gcWei,     "Insufficient token balance");
        require(address(this).balance >= ethAmount, "Contract has insufficient ETH");

        _transfer(msg.sender, adminAddress, gcWei);

        (bool sent, ) = msg.sender.call{value: ethAmount}("");
        require(sent, "Failed to send ETH");

        emit TokensSold(msg.sender, gcAmount, ethAmount);
    }

    // ─── Membership ──────────────────────────────────────────────────────────
    function buyMembership() public nonReentrant {
        require(membershipPrice > 0, "Membership not configured");

        uint256 priceWei = membershipPrice * 10 ** decimals();
        require(balanceOf(msg.sender) >= priceWei, "Insufficient GC balance");

        _transfer(msg.sender, adminAddress, priceWei);

        uint256 base = membershipExpiry[msg.sender] > block.timestamp
            ? membershipExpiry[msg.sender]
            : block.timestamp;
        membershipExpiry[msg.sender] = base + membershipDuration;

        emit MembershipPurchased(msg.sender, membershipExpiry[msg.sender]);
    }

    function isMember(address _account) public view returns (bool) {
        return membershipExpiry[_account] > block.timestamp;
    }

    // ─── Admin only ──────────────────────────────────────────────────────────
    function setRates(uint256 _sellRate, uint256 _buyRate) public onlyOwner {
        require(_sellRate > 0 && _buyRate > 0, "Rates must be > 0");
        sellRate = _sellRate;
        buyRate  = _buyRate;
        emit RatesUpdated(_sellRate, _buyRate);
    }

    function setLimits(uint256 _maxBuy, uint256 _maxSell) public onlyOwner {
        require(_maxBuy > 0 && _maxSell > 0, "Limits must be > 0");
        maxBuyAmount  = _maxBuy;
        maxSellAmount = _maxSell;
        emit LimitsUpdated(_maxBuy, _maxSell);
    }

    function setMembershipConfig(uint256 _price, uint256 _duration) public onlyOwner {
        require(_duration > 0, "Duration must be > 0");
        membershipPrice    = _price;
        membershipDuration = _duration;
        emit MembershipConfigUpdated(_price, _duration);
    }

    function blacklistAddress(address _account) public onlyOwner {
        require(_account != adminAddress, "Cannot blacklist admin");
        blacklisted[_account] = true;
        emit Blacklisted(_account);
    }

    function unblacklistAddress(address _account) public onlyOwner {
        blacklisted[_account] = false;
        emit Unblacklisted(_account);
    }

    function pause()   public onlyOwner { _pause();   }
    function unpause() public onlyOwner { _unpause(); }

    function withdraw() public onlyOwner {
        uint256 bal = address(this).balance;
        require(bal > 0, "No ETH to withdraw");
        (bool sent, ) = adminAddress.call{value: bal}("");
        require(sent, "Withdraw failed");
    }

    receive() external payable {}
}
