const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("GymCoin & UserProfile", function () {
  let gymCoin, userProfile, owner, addr1;

  beforeEach(async function () {
    [owner, addr1] = await ethers.getSigners();

    const GymCoin = await ethers.getContractFactory("GymCoin");
    gymCoin = await GymCoin.deploy(10000, ethers.parseEther("0.01"), ethers.parseEther("0.005"));
    await gymCoin.waitForDeployment();

    const UserProfile = await ethers.getContractFactory("UserProfile");
    userProfile = await UserProfile.deploy();
    await userProfile.waitForDeployment();
  });

  it("Should deploy contracts", async function () {
    expect(await gymCoin.name()).to.equal("Gym Coin");
    expect(await userProfile.isRegistered(owner.address)).to.equal(false);
  });

  it("Should allow user to register", async function () {
    await userProfile.registerUser("Alice", "alice@test.com");
    expect(await userProfile.isRegistered(owner.address)).to.equal(true);
    const info = await userProfile.getUserInfo(owner.address);
    expect(info[0]).to.equal("Alice");
  });

  it("Should allow user to buy tokens", async function () {
    const buyAmount = 100;
    const sellRate = await gymCoin.sellRate();
    const decimals = await gymCoin.decimals();
    const requiredEth = (BigInt(buyAmount) * sellRate) / (10n ** BigInt(decimals));
    
    const balanceBefore = await gymCoin.balanceOf(addr1.address);
    await gymCoin.connect(addr1).buy(buyAmount, { value: requiredEth });
    const balanceAfter = await gymCoin.balanceOf(addr1.address);
    
    expect(balanceAfter - balanceBefore).to.equal(BigInt(buyAmount) * (10n ** BigInt(decimals)));
  });

  it("Should allow user to sell tokens", async function () {
    const buyAmount = 100;
    const sellRate = await gymCoin.sellRate();
    const decimals = await gymCoin.decimals();
    const requiredEth = (BigInt(buyAmount) * sellRate) / (10n ** BigInt(decimals));
    
    await gymCoin.connect(addr1).buy(buyAmount, { value: requiredEth });
    
    const balanceBefore = await gymCoin.balanceOf(addr1.address);
    await gymCoin.connect(addr1).sell(buyAmount);
    const balanceAfter = await gymCoin.balanceOf(addr1.address);
    
    expect(balanceBefore - balanceAfter).to.equal(BigInt(buyAmount) * (10n ** BigInt(decimals)));
  });

  it("Should fail if user tries to sell more than balance", async function () {
    await expect(gymCoin.connect(addr1).sell(100)).to.be.revertedWith("Insufficient token balance");
  });
});
