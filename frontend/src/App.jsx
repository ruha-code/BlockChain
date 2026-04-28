import { useState, useEffect } from "react";
import { ethers } from "ethers";
import "./App.css";

const GYM_COIN_ADDRESS = "0x14edb910e383fa5d862fd4eac50c296537f4f7bf";
const USER_PROFILE_ADDRESS = "0x1749Cc96376B84890bCC4BB327Faf976E212a1B4";

const GYM_COIN_ABI = [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
  "function totalSupply() view returns (uint256)",
  "function balanceOf(address) view returns (uint256)",
  "function transfer(address to, uint256 amount) returns (bool)",
  "function buy(uint256 gcAmount) payable",
  "function sell(uint256 gcAmount)",
  "function setRates(uint256 _sellRate, uint256 _buyRate)",
  "function sellRate() view returns (uint256)",
  "function buyRate() view returns (uint256)",
  "function owner() view returns (address)",
  "event TokensBought(address buyer, uint256 gcAmount, uint256 ethAmount)",
  "event TokensSold(address seller, uint256 gcAmount, uint256 ethAmount)",
];

const USER_PROFILE_ABI = [
  "function registerUser(string _username, string _email)",
  "function getUserInfo(address _account) view returns (string, string, address)",
  "function isRegistered(address _account) view returns (bool)",
  "event UserRegistered(address account, string username, string email)",
];

function App() {
  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [gymCoin, setGymCoin] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [balance, setBalance] = useState("0");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [isRegistered, setIsRegistered] = useState(false);
  const [buyAmount, setBuyAmount] = useState("");
  const [sellAmount, setSellAmount] = useState("");
  const [transferTo, setTransferTo] = useState("");
  const [transferAmount, setTransferAmount] = useState("");
  const [message, setMessage] = useState("");
  const [rates, setRates] = useState({ sell: "0", buy: "0" });

  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        setMessage("MetaMask not installed");
        return;
      }

      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const addr = accounts[0];
      setAccount(addr);

      const web3Provider = new ethers.BrowserProvider(window.ethereum);
      const web3Signer = await web3Provider.getSigner();
      setProvider(web3Provider);
      setSigner(web3Signer);

      const gc = new ethers.Contract(GYM_COIN_ADDRESS, GYM_COIN_ABI, web3Signer);
      setGymCoin(gc);

      const up = new ethers.Contract(USER_PROFILE_ADDRESS, USER_PROFILE_ABI, web3Signer);
      setUserProfile(up);

      const registered = await up.isRegistered(addr);
      setIsRegistered(registered);

      if (registered) {
        const info = await up.getUserInfo(addr);
        setUsername(info[0]);
        setEmail(info[1]);
      }

      const bal = await gc.balanceOf(addr);
      setBalance(ethers.formatUnits(bal, await gc.decimals()));

      const sellRate = await gc.sellRate();
      const buyRate = await gc.buyRate();
      setRates({
        sell: ethers.formatUnits(sellRate, 18),
        buy: ethers.formatUnits(buyRate, 18),
      });

      setMessage("Wallet connected");
    } catch (err) {
      setMessage("Connection failed: " + err.message);
    }
  };

  const disconnectWallet = () => {
    setAccount(null);
    setProvider(null);
    setSigner(null);
    setGymCoin(null);
    setUserProfile(null);
    setBalance("0");
    setUsername("");
    setEmail("");
    setIsRegistered(false);
    setMessage("Wallet disconnected");
  };

  const registerUser = async () => {
    try {
      if (!username || !email) {
        setMessage("Enter username and email");
        return;
      }
      const tx = await userProfile.registerUser(username, email);
      await tx.wait();
      setIsRegistered(true);
      setMessage("User registered successfully");
    } catch (err) {
      setMessage("Registration failed: " + err.message);
    }
  };

  const buyTokens = async () => {
    try {
      if (!buyAmount || parseFloat(buyAmount) <= 0) {
        setMessage("Enter valid amount");
        return;
      }
      const decimals = await gymCoin.decimals();
      const amount = ethers.parseUnits(buyAmount, decimals);
      const ethNeeded = (amount * BigInt(Math.floor(parseFloat(rates.sell) * 1e18))) / BigInt(10 ** 18);

      const tx = await gymCoin.buy(amount, { value: ethNeeded });
      await tx.wait();

      const newBal = await gymCoin.balanceOf(account);
      setBalance(ethers.formatUnits(newBal, decimals));
      setMessage("Tokens bought successfully");
    } catch (err) {
      setMessage("Buy failed: " + err.message);
    }
  };

  const sellTokens = async () => {
    try {
      if (!sellAmount || parseFloat(sellAmount) <= 0) {
        setMessage("Enter valid amount");
        return;
      }
      const decimals = await gymCoin.decimals();
      const amount = ethers.parseUnits(sellAmount, decimals);

      const tx = await gymCoin.sell(amount);
      await tx.wait();

      const newBal = await gymCoin.balanceOf(account);
      setBalance(ethers.formatUnits(newBal, decimals));
      setMessage("Tokens sold successfully");
    } catch (err) {
      setMessage("Sell failed: " + err.message);
    }
  };

  const transferTokens = async () => {
    try {
      if (!transferTo || !transferAmount || parseFloat(transferAmount) <= 0) {
        setMessage("Enter valid address and amount");
        return;
      }
      if (!ethers.isAddress(transferTo)) {
        setMessage("Invalid address");
        return;
      }
      const decimals = await gymCoin.decimals();
      const amount = ethers.parseUnits(transferAmount, decimals);

      const tx = await gymCoin.transfer(transferTo, amount);
      await tx.wait();

      const newBal = await gymCoin.balanceOf(account);
      setBalance(ethers.formatUnits(newBal, decimals));
      setMessage("Tokens transferred successfully");
    } catch (err) {
      setMessage("Transfer failed: " + err.message);
    }
  };

  if (!account) {
    return (
      <div className="container">
        <h1>Gym Coin System</h1>
        <button className="connect-btn" onClick={connectWallet}>
          Connect MetaMask
        </button>
        {message && <p className="message">{message}</p>}
      </div>
    );
  }

  return (
    <div className="container">
      <h1>Gym Coin System</h1>
      <div className="header">
        <p className="address">Connected: {account.slice(0, 6)}...{account.slice(-4)}</p>
        <button className="disconnect-btn" onClick={disconnectWallet}>
          Disconnect
        </button>
      </div>

      {!isRegistered ? (
        <div className="card">
          <h2>Register Profile</h2>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button onClick={registerUser}>Register</button>
        </div>
      ) : (
        <div className="card">
          <h2>Your Profile</h2>
          <p><strong>Username:</strong> {username}</p>
          <p><strong>Email:</strong> {email}</p>
          <p><strong>Address:</strong> {account}</p>
          <p><strong>GC Balance:</strong> {balance}</p>
        </div>
      )}

      <div className="card">
        <h2>Buy Gym Coin</h2>
        <p className="rate">Rate: 1 GC = {rates.sell} ETH</p>
        <input
          type="number"
          placeholder="Amount GC"
          value={buyAmount}
          onChange={(e) => setBuyAmount(e.target.value)}
        />
        <button onClick={buyTokens}>Buy</button>
      </div>

      <div className="card">
        <h2>Sell Gym Coin</h2>
        <p className="rate">Rate: 1 GC = {rates.buy} ETH</p>
        <input
          type="number"
          placeholder="Amount GC"
          value={sellAmount}
          onChange={(e) => setSellAmount(e.target.value)}
        />
        <button onClick={sellTokens}>Sell</button>
      </div>

      <div className="card">
        <h2>Transfer Gym Coin</h2>
        <input
          type="text"
          placeholder="Recipient Address"
          value={transferTo}
          onChange={(e) => setTransferTo(e.target.value)}
        />
        <input
          type="number"
          placeholder="Amount GC"
          value={transferAmount}
          onChange={(e) => setTransferAmount(e.target.value)}
        />
        <button onClick={transferTokens}>Transfer</button>
      </div>

      {message && <p className="message">{message}</p>}
    </div>
  );
}

export default App;
