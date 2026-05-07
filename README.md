# 🏋️ Gym Coin — Blockchain Token System

A decentralized credit system for gym networks built on **Ethereum (Sepolia Testnet)**.  
Users can register profiles, buy/sell **Gym Coin (GC)** tokens using ETH, transfer tokens, and activate on-chain gym memberships.

**Live demo:** [gym-coin.vercel.app](https://gym-coin.vercel.app) *(replace with your actual URL)*

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Quick Start — Just Use the App](#-quick-start--just-use-the-app)
- [Local Development Setup](#-local-development-setup)
- [Deploy Your Own Contracts](#-deploy-your-own-contracts)
- [Smart Contract Details](#-smart-contract-details)
- [Troubleshooting](#-troubleshooting)

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 👤 **User Profiles** | Register with username & email, stored on-chain |
| 💰 **Buy GC** | Pay ETH → receive Gym Coin tokens |
| 💸 **Sell GC** | Return GC tokens → receive ETH |
| 🔄 **Transfer** | Send GC to any Ethereum address |
| 🏆 **Leaderboard** | Top GC holders ranked by balance |
| 🛡️ **Membership** | On-chain gym membership with expiry date |
| 📊 **Market** | Live ETH/USD price and GC price history |
| ⚙️ **Admin Panel** | Owner-only: set rates, limits, blacklist, pause |

---

## 🛠 Tech Stack

**Frontend**
- React 19 + Vite
- Tailwind CSS v4
- ethers.js v6

**Blockchain**
- Solidity 0.8.20
- Hardhat
- OpenZeppelin Contracts v5
- Sepolia Testnet

---

## 📁 Project Structure

```
BlockChain/
├── contracts/
│   ├── GymCoin.sol          # ERC-20 token with buy/sell/membership logic
│   └── UserProfile.sol      # On-chain user registration
├── scripts/
│   └── deploy.js            # Deployment script
├── test/                    # Contract tests
├── hardhat.config.js        # Hardhat configuration
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/      # All UI components
│   │   ├── hooks/
│   │   │   └── useWallet.js # All blockchain logic
│   │   └── constants.js     # Contract addresses & ABIs
│   ├── vercel.json          # Vercel deployment config
│   └── vite.config.js
└── .env.example             # Environment variables template
```

---

## 🚀 Quick Start — Just Use the App

**No installation needed.** Anyone can use the live app:

### Requirements
- 🦊 **MetaMask** browser extension — [install here](https://metamask.io/download/)
- 💧 **Sepolia ETH** for gas fees — get free test ETH from a faucet:
  - [sepoliafaucet.com](https://sepoliafaucet.com)
  - [faucet.sepolia.dev](https://faucet.sepolia.dev)
  - [alchemy.com/faucets/ethereum-sepolia](https://www.alchemy.com/faucets/ethereum-sepolia)

### Steps
1. Open the live app
2. Click **"Connect MetaMask"** — approve the connection in MetaMask
3. The app auto-switches to **Sepolia Testnet**
4. Click **"Register"** — enter username & email → confirm transaction
5. Start using **Buy / Sell / Transfer / Membership**

---

## 💻 Local Development Setup

### 1. Prerequisites

Install the following if you don't have them:

| Tool | Version | Download |
|------|---------|----------|
| **Node.js** | v18+ | [nodejs.org](https://nodejs.org) |
| **Git** | any | [git-scm.com](https://git-scm.com) |
| **MetaMask** | browser ext | [metamask.io](https://metamask.io/download/) |

Check your versions:
```bash
node --version   # should be v18 or higher
npm --version    # should be v9 or higher
git --version
```

---

### 2. Clone the Repository

```bash
git clone https://github.com/ruha-code/BlockChain.git
cd BlockChain
```

---

### 3. Install Frontend Dependencies

```bash
cd frontend
npm install
```

---

### 4. Run the Development Server

```bash
npm run dev
```

Open **http://localhost:5173** in your browser.

> ✅ The contracts are already deployed on Sepolia — no extra setup needed to use the app!

---

### 5. Build for Production (optional)

```bash
npm run build       # creates frontend/dist/
npm run preview     # preview the production build locally
```

---

## 🔧 Deploy Your Own Contracts

Only needed if you want to deploy your **own version** of the contracts.

### 1. Install Root Dependencies

```bash
# from the BlockChain/ root folder
npm install
```

### 2. Configure Environment Variables

```bash
cp .env.example .env
```

Edit `.env` with your values:
```env
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_KEY
PRIVATE_KEY=your_wallet_private_key_without_0x
```

**How to get these:**
- **SEPOLIA_RPC_URL** — create a free project at [infura.io](https://infura.io) or [alchemy.com](https://alchemy.com)
- **PRIVATE_KEY** — in MetaMask: click account icon → Account Details → Export Private Key

> ⚠️ **Never share your private key or commit `.env` to git!**

### 3. Get Sepolia ETH

Your deployer wallet needs ETH for gas:
- [sepoliafaucet.com](https://sepoliafaucet.com) — paste your wallet address
- [faucet.sepolia.dev](https://faucet.sepolia.dev)

### 4. Compile Contracts

```bash
npm run compile
```

Expected output:
```
Compiled 2 Solidity files successfully
```

### 5. Run Tests (optional but recommended)

```bash
npm test
```

### 6. Deploy to Sepolia

```bash
npm run deploy
```

Expected output:
```
Deploying contracts to Sepolia...

Deploying GymCoin...
✅ GymCoin deployed to: 0xABC...

Deploying UserProfile...
✅ UserProfile deployed to: 0xDEF...

─────────────────────────────────────────
✅ Deployment complete! Update constants.js with:
─────────────────────────────────────────
export const GYM_COIN_ADDRESS     = "0xABC...";
export const USER_PROFILE_ADDRESS = "0xDEF...";
```

### 7. Update Frontend Contract Addresses

Open `frontend/src/constants.js` and replace the addresses:

```js
export const GYM_COIN_ADDRESS     = "0xYOUR_NEW_GYMCOIN_ADDRESS";
export const USER_PROFILE_ADDRESS = "0xYOUR_NEW_USERPROFILE_ADDRESS";
```

Then rebuild the frontend:
```bash
cd frontend
npm run build
```

---

## 📜 Smart Contract Details

### GymCoin.sol

| Parameter | Default Value | Description |
|-----------|--------------|-------------|
| Initial Supply | 10,000 GC | Minted to deployer on deploy |
| Buy Rate | 0.01 ETH/GC | ETH user pays per 1 GC |
| Sell Rate | 0.005 ETH/GC | ETH user receives per 1 GC |
| Max Buy | 1,000 GC | Per single transaction |
| Max Sell | 500 GC | Per single transaction |
| Membership Price | 100 GC | Cost to activate membership |
| Membership Duration | 30 days | How long membership lasts |

**Key functions:**
```solidity
buy(uint256 gcAmount)             // payable — buy GC with ETH
sell(uint256 gcAmount)            // sell GC for ETH
transfer(address to, uint256 amt) // ERC-20 transfer
buyMembership()                   // activate gym membership
pause() / unpause()               // admin only
setRates(sell, buy)               // admin only
blacklistAddress(addr)            // admin only
withdraw()                        // admin — withdraw contract ETH
```

### UserProfile.sol

```solidity
registerUser(string username, string email)   // register new profile
updateUser(string username, string email)     // update existing profile
getUserInfo(address) returns (string, string) // read profile data
isRegistered(address) returns (bool)          // check registration
```

### Deployed Contracts (Sepolia)

| Contract | Address |
|----------|---------|
| GymCoin | [`0x48D5ACe97Cc78AC3AF721e662B81C5B3A25ad9d8`](https://sepolia.etherscan.io/address/0x48D5ACe97Cc78AC3AF721e662B81C5B3A25ad9d8) |
| UserProfile | [`0xCDf651b1B127c9d8468797B58C62e3eA8Ca9e44c`](https://sepolia.etherscan.io/address/0xCDf651b1B127c9d8468797B58C62e3eA8Ca9e44c) |

---

## ❓ Troubleshooting

**MetaMask not detected**
> Make sure MetaMask extension is installed and enabled in your browser.

**Wrong network error**
> The app will automatically prompt you to switch to Sepolia. Click "Switch Network" in MetaMask.

**Transaction fails with "insufficient funds"**
> You need Sepolia ETH for gas fees. Get free test ETH from the faucets above.

**"Contract has insufficient ETH" when selling**
> The contract needs ETH liquidity to pay sellers. Ask the admin to deposit ETH by buying GC tokens.

**Page shows blank / errors in console**
> Make sure you're on `http://localhost:5173` (not a different port) and ran `npm install` first.

**`npm install` fails**
> Make sure Node.js v18+ is installed: `node --version`

---

## 📄 License

MIT — free to use, modify, and distribute.
