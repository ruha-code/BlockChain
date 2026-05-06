// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract GymCoin is ERC20, Ownable, ReentrancyGuard {
    uint256 public sellRate;
    uint256 public buyRate;

    event TokensBought(address buyer, uint256 gcAmount, uint256 ethAmount);
    event TokensSold(address seller, uint256 gcAmount, uint256 ethAmount);
    event RatesUpdated(uint256 newSellRate, uint256 newBuyRate);

    constructor(
        uint256 initialSupply,
        uint256 _sellRate,
        uint256 _buyRate
    ) ERC20("Gym Coin", "GC") Ownable(msg.sender) {
        _mint(msg.sender, initialSupply * 10 ** decimals());
        sellRate = _sellRate;
        buyRate = _buyRate;
    }

    function buy(uint256 gcAmount) public payable nonReentrant {
        require(gcAmount > 0, "Amount must be greater than 0");

        uint256 requiredEth = (gcAmount * sellRate) / (10 ** decimals());
        require(msg.value >= requiredEth, "Insufficient ETH sent");

        uint256 ownerBalance = balanceOf(owner());
        require(ownerBalance >= gcAmount, "Owner has insufficient tokens");

        _transfer(owner(), msg.sender, gcAmount * 10 ** decimals());

        uint256 excessEth = msg.value - requiredEth;
        if (excessEth > 0) {
            (bool sent, ) = msg.sender.call{value: excessEth}("");
            require(sent, "Failed to refund excess ETH");
        }

        emit TokensBought(msg.sender, gcAmount, requiredEth);
    }

    function sell(uint256 gcAmount) public nonReentrant {
        require(gcAmount > 0, "Amount must be greater than 0");
        require(balanceOf(msg.sender) >= gcAmount, "Insufficient token balance");

        uint256 ethAmount = (gcAmount * buyRate) / (10 ** decimals());
        require(address(this).balance >= ethAmount, "Contract has insufficient ETH");

        _transfer(msg.sender, owner(), gcAmount * 10 ** decimals());

        (bool sent, ) = msg.sender.call{value: ethAmount}("");
        require(sent, "Failed to send ETH");

        emit TokensSold(msg.sender, gcAmount, ethAmount);
    }

    function setRates(uint256 _sellRate, uint256 _buyRate) public onlyOwner {
        require(_sellRate > 0, "Sell rate must be greater than 0");
        require(_buyRate > 0, "Buy rate must be greater than 0");
        sellRate = _sellRate;
        buyRate = _buyRate;
        emit RatesUpdated(_sellRate, _buyRate);
    }

    function transfer(address to, uint256 gcAmount) public override returns (bool) {
        require(gcAmount > 0, "Amount must be greater than 0");
        require(balanceOf(msg.sender) >= gcAmount, "Insufficient balance");
        return super.transfer(to, gcAmount);
    }

    receive() external payable {}
}
