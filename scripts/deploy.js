const hre = require("hardhat");

async function main() {
  console.log("Deploying contracts to Sepolia...\n");

  const initialSupply = 1_000_000;
  const sellRate      = hre.ethers.parseEther("0.0001");   // user pays 0.0001 ETH per GC
  const buyRate       = hre.ethers.parseEther("0.00005");  // user receives 0.00005 ETH per GC
  const maxBuyAmount  = 10_000n;
  const maxSellAmount = 5_000n;

  // Deploy GymCoin
  console.log("Deploying GymCoin...");
  const GymCoin = await hre.ethers.getContractFactory("GymCoin");
  const gymCoin = await GymCoin.deploy(
    initialSupply,
    sellRate,
    buyRate,
    maxBuyAmount,
    maxSellAmount,
  );
  await gymCoin.waitForDeployment();
  const gymCoinAddress = await gymCoin.getAddress();
  console.log("GymCoin deployed to:", gymCoinAddress);

  // Deploy UserProfile
  console.log("\nDeploying UserProfile...");
  const UserProfile = await hre.ethers.getContractFactory("UserProfile");
  const userProfile = await UserProfile.deploy();
  await userProfile.waitForDeployment();
  const userProfileAddress = await userProfile.getAddress();
  console.log("UserProfile deployed to:", userProfileAddress);

  // Print addresses to paste into constants.js
  console.log("\n--- Update frontend/src/constants.js with these addresses ---");
  console.log(`export const GYM_COIN_ADDRESS     = "${gymCoinAddress}";`);
  console.log(`export const USER_PROFILE_ADDRESS = "${userProfileAddress}";`);
  console.log("--------------------------------------------------------------");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
