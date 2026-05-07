# Final Project 1 - Gym Credit Token System

This project implements a gym credit platform on Ethereum Sepolia using two smart contracts and a React frontend.

Users can:
- connect with MetaMask
- register a profile with `username`, `email`, and wallet address
- view their profile and `GC` balance
- buy `Gym Coin (GC)` with `ETH`
- sell `GC` back for `ETH`
- transfer `GC` to another wallet
- disconnect their wallet

The system is based on an ERC-20 token and is designed to keep credit transfers transparent and tamper-resistant.

## Current Status

Checked on May 7, 2026:

- frontend build works
- frontend lint works
- live deployment URL provided by the project owner: [block-chain-nu-one.vercel.app](https://block-chain-nu-one.vercel.app/)

Current local verification result:

- `npm run build` in `frontend/`: passed
- `npm run lint` in `frontend/`: passed

Important:
- this means the frontend is buildable right now
- the contract layer is not fully verified locally right now
- from this environment, direct HTTP access to the live Vercel deployment could not be confirmed because the connection was refused during the check

## Stack

- Smart contracts: Solidity `0.8.20`
- Framework: Hardhat
- Token library: OpenZeppelin ERC-20
- Frontend: React + Vite + ethers.js
- Network: Sepolia

## Project Structure

```text
BlockChain/
├── contracts/
│   ├── GymCoin.sol
│   └── UserProfile.sol
├── scripts/
│   └── deploy.js
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── .env.local.example
├── hardhat.config.js
├── package.json
└── .env.example
```

## Smart Contracts

### `UserProfile.sol`

Stores one profile per wallet address.

Main functions:

```solidity
registerUser(string username, string email)
updateUser(string username, string email)
getUserInfo(address account) returns (string, string, address)
isRegistered(address account) returns (bool)
```

Current behavior:
- registration is tied to `msg.sender`
- one wallet can register only once
- username must be `2-32` characters
- email must be `1-64` characters

### `GymCoin.sol`

Implements the `Gym Coin (GC)` ERC-20 token.

Main functions:

```solidity
buy(uint256 gcAmount) payable
sell(uint256 gcAmount)
transfer(address to, uint256 amount)
setRates(uint256 sellRate, uint256 buyRate)
setLimits(uint256 maxBuy, uint256 maxSell)
withdraw()
```

Current behavior:
- total initial supply is minted to the contract owner
- users buy tokens from the owner's balance
- users sell tokens back and receive ETH from the contract
- the contract must hold enough ETH for sell operations
- only the owner can update rates, limits, or withdraw ETH

## Default Deployment Values

These values come from [scripts/deploy.js](/C:/Users/ruha/BlockChain/scripts/deploy.js):

| Parameter | Value |
|---|---|
| Initial supply | `1,000,000 GC` |
| Sell rate | `0.0001 ETH` per `1 GC` |
| Buy rate | `0.00005 ETH` per `1 GC` |
| Max buy amount | `10,000 GC` |
| Max sell amount | `5,000 GC` |

Rate meaning in the current contract:
- `sellRate`: price a user pays in ETH to buy `GC`
- `buyRate`: ETH a user receives when selling `GC` back

## Frontend Features

The frontend currently includes:
- MetaMask connect and network switch
- profile registration
- profile view with username, email, address, and balances
- buy `GC`
- sell `GC`
- transfer `GC`
- owner tools for updating rates, updating limits, funding the contract, and withdrawing ETH
- transaction history and additional dashboard views

## Sepolia Contracts Used by the Frontend

The current frontend constants point to:

- `GymCoin`: `0x39d2035722ea88e5547076B6FCd83ce8f517d050`
- `UserProfile`: `0xa8a12f46E237F227A35f6DE65dd2d9dB5eEaFB10`

Live frontend deployment:

- [https://block-chain-nu-one.vercel.app/](https://block-chain-nu-one.vercel.app/)

If you deploy new contracts, update the frontend configuration before rebuilding or running the app.

## Setup

### 1. Install dependencies

At the project root:

```bash
npm install
```

For the frontend:

```bash
cd frontend
npm install
```

### 2. Configure environment variables

Create `.env` in the project root:

```env
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_KEY
PRIVATE_KEY=your_private_key_without_0x
```

### 3. Compile contracts

```bash
npm run compile
```

### 4. Deploy to Sepolia

```bash
npm run deploy
```

### 5. Run the frontend

```bash
cd frontend
npm run dev
```

Then open `http://localhost:5173`.

## Important Notes

- Users need Sepolia ETH for gas fees.
- Selling only works if the contract has enough ETH liquidity.
- Buying only works if the owner still holds enough GC tokens.
- Automated tests were removed from this repository.

## Security Rules Implemented in the Current Contract

- users cannot buy `0` tokens
- users cannot sell `0` tokens
- users cannot buy above `maxBuyAmount`
- users cannot sell above `maxSellAmount`
- users cannot sell more GC than they own
- users cannot sell if the contract lacks ETH
- users cannot buy if the owner lacks tokens
- only the owner can call admin functions

## Known Gaps

Relative to the assignment brief, the current repository still has a few things to review further:
- the frontend contains extra dashboard/admin screens beyond the minimum assignment scope
- contract addresses are currently managed directly in [frontend/src/constants.js](/C:/Users/ruha/BlockChain/frontend/src/constants.js)

## License

MIT
