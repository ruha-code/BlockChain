// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract GymCoin is ERC20, ReentrancyGuard {

    address public owner;

    uint256 public sellRate;  // ETH per GC when user buys
    uint256 public buyRate;   // ETH per GC when user sells back
    uint256 public maxBuyAmount;
    uint256 public maxSellAmount;

    event TokensBought(address indexed buyer, uint256 gcAmount, uint256 ethAmount);
    event TokensSold(address indexed seller, uint256 gcAmount, uint256 ethAmount);
    event RatesUpdated(uint256 newSellRate, uint256 newBuyRate);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not the contract owner");
        _;
    }

    constructor(
        uint256 initialSupply,
        uint256 _sellRate,
        uint256 _buyRate,
        uint256 _maxBuyAmount,
        uint256 _maxSellAmount
    ) ERC20("Gym Coin", "GC") {
        owner = msg.sender;
        _mint(msg.sender, initialSupply * 10 ** decimals());
        sellRate = _sellRate;
        buyRate = _buyRate;
        maxBuyAmount = _maxBuyAmount;
        maxSellAmount = _maxSellAmount;
    }

    // Users buy GC tokens by sending ETH
    function buy(uint256 gcAmount) public payable nonReentrant {
        require(gcAmount > 0, "Amount must be greater than 0");
        require(gcAmount <= maxBuyAmount, "Exceeds max buy limit");

        uint256 gcWei = gcAmount * 10 ** decimals();
        uint256 requiredEth = gcAmount * sellRate;

        require(msg.value >= requiredEth, "Not enough ETH sent");
        require(balanceOf(owner) >= gcWei, "Owner has insufficient tokens");

        _transfer(owner, msg.sender, gcWei);

        // refund extra ETH if user sent too much
        uint256 excess = msg.value - requiredEth;
        if (excess > 0) {
            (bool sent,) = msg.sender.call{value: excess}("");
            require(sent, "ETH refund failed");
        }

        emit TokensBought(msg.sender, gcAmount, requiredEth);
    }

    // Users sell GC tokens back and receive ETH
    function sell(uint256 gcAmount) public nonReentrant {
        require(gcAmount > 0, "Amount must be greater than 0");
        require(gcAmount <= maxSellAmount, "Exceeds max sell limit");
        require(msg.sender != owner, "Owner cannot sell tokens");

        uint256 gcWei = gcAmount * 10 ** decimals();
        uint256 ethToSend = gcAmount * buyRate;

        require(balanceOf(msg.sender) >= gcWei, "Insufficient GC balance");
        require(address(this).balance >= ethToSend, "Contract has insufficient ETH");

        _transfer(msg.sender, owner, gcWei);

        (bool sent,) = msg.sender.call{value: ethToSend}("");
        require(sent, "ETH transfer failed");

        emit TokensSold(msg.sender, gcAmount, ethToSend);
    }

    function setRates(uint256 _sellRate, uint256 _buyRate) public onlyOwner {
        require(_sellRate > 0 && _buyRate > 0, "Rates must be greater than 0");
        sellRate = _sellRate;
        buyRate = _buyRate;
        emit RatesUpdated(_sellRate, _buyRate);
    }

    function setLimits(uint256 _maxBuy, uint256 _maxSell) public onlyOwner {
        require(_maxBuy > 0 && _maxSell > 0, "Limits must be greater than 0");
        maxBuyAmount = _maxBuy;
        maxSellAmount = _maxSell;
    }

    function withdraw() public onlyOwner {
        uint256 bal = address(this).balance;
        require(bal > 0, "Nothing to withdraw");
        (bool sent,) = owner.call{value: bal}("");
        require(sent, "Withdraw failed");
    }

    receive() external payable {}
}
