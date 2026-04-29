# Gym Credit Token System

A decentralized credit system for a network of gyms, built on the Ethereum blockchain (Sepolia Testnet). Users can register profiles, buy/sell Gym Coins (GC) using ETH, and transfer tokens securely.

## Features

- **User Profiles**: Register with username and email.
- **Gym Coin (GC)**: Custom ERC-20 token.
- **Buy/Sell**: Exchange ETH for GC and vice versa.
- **Transfer**: Send GC to other users.
- **Security**: Role-based access control (Owner only for rates).

## Prerequisites

- **Node.js** installed.
- **MetaMask** browser extension.
- **Sepolia ETH** for gas fees (get from [Sepolia Faucet](https://sepoliafaucet.com)).

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd BlockChain
   ```

2. Install frontend dependencies:
   ```bash
   cd frontend
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open the local URL (e.g., `http://localhost:5173`) in your browser.

## Configuration

The frontend is already configured to connect to the deployed contracts on **Sepolia Testnet**.

- **GymCoin Address**: `0x14edb910e383fa5d862fd4eac50c296537f4f7bf`
- **UserProfile Address**: `0x1749Cc96376B84890bCC4BB327Faf976E212a1B4`

## How to Use

1. **Connect Wallet**: Click "Connect MetaMask" and approve the connection. Ensure you are on the **Sepolia** network.
2. **Register**: Enter your username and email, then click "Register".
3. **Buy GC**: Enter the amount of GC you want to buy and click "Buy". Confirm the transaction in MetaMask.
4. **Sell GC**: Enter the amount of GC to sell and click "Sell". You will receive ETH.
5. **Transfer**: Enter a recipient address and amount, then click "Transfer".

## Smart Contracts

- **GymCoin.sol**: Implements ERC-20 standard with custom buy/sell logic.
- **UserProfile.sol**: Manages user registration and data storage.

## License

MIT
