const hre = require("hardhat");

async function main() {
  console.log("Deploying contracts to Sepolia...");

  const initialSupply = 10000;
  const sellRate = hre.ethers.parseEther("0.01");
  const buyRate = hre.ethers.parseEther("0.005");

  const GymCoin = await hre.ethers.getContractFactory("GymCoin");
  const gymCoin = await GymCoin.deploy(initialSupply, sellRate, buyRate);
  await gymCoin.waitForDeployment();
  const gymCoinAddress = await gymCoin.getAddress();
  console.log("GymCoin deployed to:", gymCoinAddress);

  const UserProfile = await hre.ethers.getContractFactory("UserProfile");
  const userProfile = await UserProfile.deploy();
  await userProfile.waitForDeployment();
  const userProfileAddress = await userProfile.getAddress();
  console.log("UserProfile deployed to:", userProfileAddress);

  console.log("\nUpdate these addresses in frontend/src/App.jsx:");
  console.log(`const GYM_COIN_ADDRESS = "${gymCoinAddress}";`);
  console.log(`const USER_PROFILE_ADDRESS = "${userProfileAddress}";`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
