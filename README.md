# Gym Coin — Blockchain Token System

A gym credit system built on Ethereum Sepolia with a React frontend and Solidity smart contracts.

Users can:
- register an on-chain profile
- buy `Gym Coin (GC)` with `ETH`
- sell `GC` back to the contract for `ETH`
- transfer `GC` to other users
- activate a membership using `GC`

The project also includes an owner panel for rates, limits, liquidity, blacklist, and pause controls.

## Features

- MetaMask connect and network switch to Sepolia
- On-chain user profile with `username`, `email`, and wallet `address`
- ERC-20 token flows: `buy`, `sell`, `transfer`
- Membership purchase in `GC`
- Owner-only admin actions
- Transaction history, leaderboard, and market view in the frontend
- Local `Hardhat` development mode with high-balance test accounts

## Tech Stack

- Frontend: React 19, Vite, ethers.js v6
- Contracts: Solidity 0.8.20, OpenZeppelin v5
- Dev tooling: Hardhat
- Public testnet: Sepolia

## Project Structure

```text
BlockChain/
├── contracts/
│   ├── GymCoin.sol
│   └── UserProfile.sol
├── scripts/
│   └── deploy.js
├── test/
│   └── GymCoin.test.js
├── frontend/
│   ├── src/
│   ├── public/
│   ├── .env.local.example
│   └── package.json
├── hardhat.config.js
├── package.json
└── .env.example
```

## Live Demo

- Production: [https://block-chain-nu-one.vercel.app/](https://block-chain-nu-one.vercel.app/)
- Network: Sepolia

Current production contract addresses:

- `GymCoin`: [`0x833a676dD16D8f5FA5F696ff1DC41ea9Bd3EB425`](https://sepolia.etherscan.io/address/0x833a676dD16D8f5FA5F696ff1DC41ea9Bd3EB425)
- `UserProfile`: [`0xAB2C9BDB09a4692eC9a2B00AD2a4C160F763ADc9`](https://sepolia.etherscan.io/address/0xAB2C9BDB09a4692eC9a2B00AD2a4C160F763ADc9)

## Smart Contracts

### `UserProfile.sol`

Stores a simple user profile per wallet address.

Key functions:

```solidity
registerUser(string username, string email)
updateUser(string username, string email)
getUserInfo(address account) returns (string, string, address)
isRegistered(address account) returns (bool)
```

Validation rules:

- username length must be `1-32`
- email length must be `1-64`
- a wallet can only register once, then update its profile later

### `GymCoin.sol`

Custom ERC-20 token contract for gym credits.

Important behavior:

- users buy `GC` from the owner's balance
- users sell `GC` back for `ETH`
- the contract must hold enough `ETH` liquidity to pay sellers
- owner-only functions are restricted to `adminAddress`
- the owner cannot exploit `sell()` to withdraw `ETH` without losing tokens

Key functions:

```solidity
buy(uint256 gcAmount) payable
sell(uint256 gcAmount)
transfer(address to, uint256 amount)
buyMembership()
setRates(uint256 sellRate, uint256 buyRate)
setLimits(uint256 maxBuy, uint256 maxSell)
setMembershipConfig(uint256 price, uint256 duration)
blacklistAddress(address account)
unblacklistAddress(address account)
pause()
unpause()
withdraw()
```

## Current Default Token Config

These values come from [scripts/deploy.js](C:/Users/ruha/BlockChain/scripts/deploy.js):

| Parameter | Value |
|---|---|
| Initial supply | `1,000,000 GC` |
| User pays buy rate | `0.0001 ETH / GC` |
| User receives sell rate | `0.00005 ETH / GC` |
| Max buy | `10,000 GC` |
| Max sell | `5,000 GC` |
| Membership price | `500 GC` |
| Membership duration | `30 days` |

Notes:

- In the code, `sellRate` means the rate used when a user buys `GC`
- In the code, `buyRate` means the rate used when a user sells `GC`

## Security / Rules

- users cannot buy `0`
- users cannot sell `0`
- users cannot buy above `maxBuyAmount`
- users cannot sell above `maxSellAmount`
- users cannot sell more `GC` than they own
- users cannot sell if the contract has insufficient `ETH`
- users cannot buy if the owner has insufficient `GC`
- only the owner can update rates, limits, membership config, blacklist, pause, or withdraw
- blacklisted addresses cannot send or receive tokens
- paused state blocks token movement

## Local Development

### 1. Install dependencies

From the project root:

```bash
npm install
cd frontend
npm install
```

### 2. Configure Sepolia deploy credentials

Create `.env` in the project root:

```env
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_KEY
PRIVATE_KEY=your_private_key_without_0x
```

### 3. Run tests

From the root:

```bash
npm test
```

### 4. Start the frontend only

If you want to use the already deployed Sepolia contracts:

```bash
cd frontend
npm run dev
```

Open `http://localhost:5173`.

## Local Hardhat Mode

This project also supports local development with a local chain and large test balances.

### 1. Start a local Hardhat node

From the root:

```bash
npm run node
```

This gives you local dev accounts with very large test `ETH` balances.

### 2. Deploy contracts to localhost

In another terminal:

```bash
npm run deploy:local
```

The script prints addresses like:

```env
VITE_NETWORK=localhost
VITE_GYM_COIN_ADDRESS=0x...
VITE_USER_PROFILE_ADDRESS=0x...
```

### 3. Configure the frontend for localhost

Create `frontend/.env.local` from the example:

```bash
cd frontend
copy .env.local.example .env.local
```

Then fill in the deployed local addresses.

Example:

```env
VITE_NETWORK=localhost
VITE_GYM_COIN_ADDRESS=0x5FbDB2315678afecb367f032d93F642f64180aa3
VITE_USER_PROFILE_ADDRESS=0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512
```

### 4. Run the frontend

```bash
cd frontend
npm run dev
```

Then connect MetaMask to `Localhost 8545`.

Important:

- if you restart the local Hardhat node, contract addresses reset
- after a node reset, run `npm run deploy:local` again and update `frontend/.env.local`

## Sepolia Deployment

Deploy contracts to Sepolia from the root:

```bash
npm run deploy
```

Then update the frontend addresses in [frontend/src/constants.js](C:/Users/ruha/BlockChain/frontend/src/constants.js) or in your deployment environment before rebuilding.

Build the frontend:

```bash
cd frontend
npm run build
```

## Frontend Capabilities

The frontend includes:

- wallet connect / disconnect
- user registration and profile editing
- `GC` balance and `ETH` balance display
- buy / sell / transfer flows
- membership purchase
- owner panel for rates, limits, blacklist, pause, funding, and withdrawal
- transaction history and leaderboard

## Known Practical Constraints

- selling requires the contract to have enough `ETH` liquidity
- public production runs on Sepolia, so users still need Sepolia test `ETH` for gas
- local `Hardhat` mode is better for stress-testing and large-balance demos

## Troubleshooting

**MetaMask not detected**

- Install and enable MetaMask in your browser

**Wrong network**

- The app should prompt a network switch to Sepolia or localhost, depending on mode

**Insufficient ETH for gas**

- On Sepolia, get faucet ETH
- On localhost, import a Hardhat dev account into MetaMask

**Contract has insufficient ETH**

- Fund the contract first so users can sell `GC`

**Frontend shows old contract data**

- Rebuild after changing addresses
- If using localhost, verify `frontend/.env.local`

**Local chain stopped working**

- Restart `npm run node`
- Redeploy with `npm run deploy:local`
- Refresh `frontend/.env.local`

## License

MIT
