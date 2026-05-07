const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("GymCoin & UserProfile", function () {
  let gymCoin, userProfile, owner, addr1, addr2;

  const initialSupply = 1_000_000n;
  const sellRate = ethers.parseEther("0.0001");
  const buyRate = ethers.parseEther("0.00005");
  const maxBuyAmount = 10_000n;
  const maxSellAmount = 5_000n;
  const membershipPrice = 500n;
  const membershipDuration = 30n * 24n * 3600n;

  async function deployFixture() {
    [owner, addr1, addr2] = await ethers.getSigners();

    const GymCoin = await ethers.getContractFactory("GymCoin");
    gymCoin = await GymCoin.deploy(
      initialSupply,
      sellRate,
      buyRate,
      maxBuyAmount,
      maxSellAmount,
      membershipPrice,
      membershipDuration,
    );
    await gymCoin.waitForDeployment();

    const UserProfile = await ethers.getContractFactory("UserProfile");
    userProfile = await UserProfile.deploy();
    await userProfile.waitForDeployment();
  }

  async function buyTokens(buyer, gcAmount) {
    const requiredEth = BigInt(gcAmount) * sellRate;
    await gymCoin.connect(buyer).buy(gcAmount, { value: requiredEth });
  }

  beforeEach(async function () {
    await deployFixture();
  });

  it("deploys contracts with the expected defaults", async function () {
    expect(await gymCoin.name()).to.equal("Gym Coin");
    expect(await gymCoin.symbol()).to.equal("GC");
    expect(await gymCoin.adminAddress()).to.equal(owner.address);
    expect(await gymCoin.sellRate()).to.equal(sellRate);
    expect(await gymCoin.buyRate()).to.equal(buyRate);
    expect(await gymCoin.maxBuyAmount()).to.equal(maxBuyAmount);
    expect(await gymCoin.maxSellAmount()).to.equal(maxSellAmount);
    expect(await userProfile.isRegistered(owner.address)).to.equal(false);
  });

  it("allows a user to register and read back their profile", async function () {
    await userProfile.connect(addr1).registerUser("Alice", "alice@test.com");

    expect(await userProfile.isRegistered(addr1.address)).to.equal(true);
    const info = await userProfile.getUserInfo(addr1.address);
    expect(info[0]).to.equal("Alice");
    expect(info[1]).to.equal("alice@test.com");
    expect(info[2]).to.equal(addr1.address);
  });

  it("allows a user to buy tokens from the owner's balance", async function () {
    const buyAmount = 100n;
    const decimals = await gymCoin.decimals();
    const tokenUnits = buyAmount * (10n ** BigInt(decimals));

    const buyerBalanceBefore = await gymCoin.balanceOf(addr1.address);
    const ownerBalanceBefore = await gymCoin.balanceOf(owner.address);

    await buyTokens(addr1, buyAmount);

    const buyerBalanceAfter = await gymCoin.balanceOf(addr1.address);
    const ownerBalanceAfter = await gymCoin.balanceOf(owner.address);

    expect(buyerBalanceAfter - buyerBalanceBefore).to.equal(tokenUnits);
    expect(ownerBalanceBefore - ownerBalanceAfter).to.equal(tokenUnits);
  });

  it("allows a user to sell tokens back for ETH", async function () {
    const buyAmount = 100n;
    const fundAmount = ethers.parseEther("1");

    await owner.sendTransaction({ to: await gymCoin.getAddress(), value: fundAmount });
    await buyTokens(addr1, buyAmount);

    const tokenBalanceBefore = await gymCoin.balanceOf(addr1.address);
    const contractEthBefore = await ethers.provider.getBalance(await gymCoin.getAddress());

    await gymCoin.connect(addr1).sell(buyAmount);

    const tokenBalanceAfter = await gymCoin.balanceOf(addr1.address);
    const contractEthAfter = await ethers.provider.getBalance(await gymCoin.getAddress());

    expect(tokenBalanceBefore - tokenBalanceAfter).to.equal(buyAmount * (10n ** 18n));
    expect(contractEthBefore - contractEthAfter).to.equal(buyAmount * buyRate);
  });

  it("prevents the owner from draining ETH by selling to themselves", async function () {
    await owner.sendTransaction({ to: await gymCoin.getAddress(), value: ethers.parseEther("1") });

    await expect(gymCoin.sell(1n)).to.be.revertedWith("Owner cannot sell tokens");
  });

  it("rejects selling more tokens than the user owns", async function () {
    await expect(gymCoin.connect(addr1).sell(100n)).to.be.revertedWith("Insufficient token balance");
  });

  it("only allows the owner to update rates", async function () {
    await expect(
      gymCoin.connect(addr1).setRates(ethers.parseEther("0.0002"), ethers.parseEther("0.0001"))
    ).to.be.revertedWith("Not owner");

    await gymCoin.setRates(ethers.parseEther("0.0002"), ethers.parseEther("0.0001"));
    expect(await gymCoin.sellRate()).to.equal(ethers.parseEther("0.0002"));
    expect(await gymCoin.buyRate()).to.equal(ethers.parseEther("0.0001"));
  });

  it("does not let another admin-role holder update rates", async function () {
    const defaultAdminRole = await gymCoin.DEFAULT_ADMIN_ROLE();
    await gymCoin.grantRole(defaultAdminRole, addr2.address);

    expect(await gymCoin.hasRole(defaultAdminRole, addr2.address)).to.equal(true);
    await expect(
      gymCoin.connect(addr2).setRates(ethers.parseEther("0.0002"), ethers.parseEther("0.0001"))
    ).to.be.revertedWith("Not owner");
  });
});
