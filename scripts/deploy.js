const hre = require("hardhat");

async function main() {
  console.log("Deploying contracts to Sepolia...\n");

  // ── GymCoin parameters ──────────────────────────────────────────────────────
  // Balanced for Sepolia testnet (users typically have 0.05–0.5 ETH)
  // With 0.05 ETH a user can buy ~500 GC — feels meaningful
  const initialSupply      = 1_000_000;                         // 1,000,000 GC (enough liquidity)
  const sellRate           = hre.ethers.parseEther("0.0001");   // users pay 0.0001 ETH per GC
  const buyRate            = hre.ethers.parseEther("0.00005");  // users receive 0.00005 ETH per GC
  const maxBuyAmount       = 10_000n;                           // max 10,000 GC per buy tx
  const maxSellAmount      = 5_000n;                            // max 5,000 GC per sell tx
  const membershipPrice    = 500n;                              // 500 GC for membership
  const membershipDuration = 30n * 24n * 3600n;                // 30 days in seconds

  // ── Deploy GymCoin ──────────────────────────────────────────────────────────
  console.log("Deploying GymCoin...");
  const GymCoin = await hre.ethers.getContractFactory("GymCoin");
  const gymCoin = await GymCoin.deploy(
    initialSupply,
    sellRate,
    buyRate,
    maxBuyAmount,
    maxSellAmount,
    membershipPrice,
    membershipDuration,
  );
  await gymCoin.waitForDeployment();
  const gymCoinAddress = await gymCoin.getAddress();
  console.log("✅ GymCoin deployed to:", gymCoinAddress);

  // ── Deploy UserProfile ──────────────────────────────────────────────────────
  console.log("\nDeploying UserProfile...");
  const UserProfile = await hre.ethers.getContractFactory("UserProfile");
  const userProfile = await UserProfile.deploy();
  await userProfile.waitForDeployment();
  const userProfileAddress = await userProfile.getAddress();
  console.log("✅ UserProfile deployed to:", userProfileAddress);

  // ── Summary ─────────────────────────────────────────────────────────────────
  console.log("\n─────────────────────────────────────────────────────────");
  console.log("✅ Deployment complete! Update constants.js with:");
  console.log("─────────────────────────────────────────────────────────");
  console.log(`export const GYM_COIN_ADDRESS     = "${gymCoinAddress}";`);
  console.log(`export const USER_PROFILE_ADDRESS = "${userProfileAddress}";`);
  console.log("─────────────────────────────────────────────────────────");
  console.log("\n📋 Initial config:");
  console.log(`  Initial supply:        1,000,000 GC`);
  console.log(`  Sell rate (user pays): 0.0001 ETH/GC`);
  console.log(`  Buy rate (user gets):  0.00005 ETH/GC`);
  console.log(`  Max buy:               ${maxBuyAmount} GC per tx`);
  console.log(`  Max sell:              ${maxSellAmount} GC per tx`);
  console.log(`  Membership price:      ${membershipPrice} GC`);
  console.log(`  Membership duration:   30 days`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
