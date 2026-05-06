import { useState, useEffect } from "react";
import { ethers } from "ethers";
import "./App.css";

const GYM_COIN_ADDRESS = "0x969ACbDaA87BeF8DA6eD2a071a593c93eBf2d5c4";
const USER_PROFILE_ADDRESS = "0x442B63C25Aa9feC42a0FCD2dBb7eB1E845273Ee2";
const SEPOLIA_CHAIN_ID = "0xaa36a7";

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
  const [loadingAction, setLoadingAction] = useState(null);
  const [txHistory, setTxHistory] = useState([]);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isOwner, setIsOwner] = useState(false);
  const [newSellRate, setNewSellRate] = useState("");
  const [newBuyRate, setNewBuyRate] = useState("");

  const formatError = (err) => {
    const msg = err.message.toLowerCase();
    if (msg.includes("user rejected") || msg.includes("rejected by user")) return "Transaction cancelled";
    if (msg.includes("insufficient funds")) return "Insufficient ETH for gas fees";
    if (msg.includes("insufficient balance") || msg.includes("insufficient token balance")) return "Insufficient balance";
    if (msg.includes("transfer amount exceeds balance")) return "Transfer amount exceeds balance";
    if (msg.includes("owner has insufficient tokens")) return "Owner has insufficient GC tokens";
    if (msg.includes("contract has insufficient eth")) return "Contract has insufficient ETH";
    if (msg.includes("execution reverted")) return "Transaction failed (check contract requirements)";
    return err.message;
  };

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", () => window.location.reload());
      window.ethereum.on("chainChanged", () => window.location.reload());
    }
  }, []);

  const switchToSepolia = async () => {
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: SEPOLIA_CHAIN_ID }],
      });
    } catch (switchError) {
      if (switchError.code === 4902) {
        await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [{
            chainId: SEPOLIA_CHAIN_ID,
            chainName: "Sepolia",
            rpcUrls: ["https://rpc.sepolia.org"],
            nativeCurrency: { name: "Sepolia ETH", symbol: "ETH", decimals: 18 },
            blockExplorerUrls: ["https://sepolia.etherscan.io"],
          }],
        });
      }
    }
  };

  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        setMessage("MetaMask not installed");
        return;
      }

      await switchToSepolia();

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

      const owner = await gc.owner();
      setIsOwner(owner.toLowerCase() === addr.toLowerCase());

      setMessage("Wallet connected");

      const history = await loadTransactionHistory(gc, addr);
      setTxHistory(history);
    } catch (err) {
      setMessage("Connection failed: " + formatError(err));
    }
  };

  const loadTransactionHistory = async (gc, addr) => {
    try {
      const filterBought = gc.filters.TokensBought(addr);
      const filterSold = gc.filters.TokensSold(addr);
      const filterTransfer = gc.filters.Transfer(addr, null);
      const filterReceived = gc.filters.Transfer(null, addr);

      const [bought, sold, transfers, received] = await Promise.all([
        gc.queryFilter(filterBought),
        gc.queryFilter(filterSold),
        gc.queryFilter(filterTransfer),
        gc.queryFilter(filterReceived),
      ]);

      const history = [];

      for (const event of bought) {
        const args = event.args;
        history.push({
          type: "buy",
          gcAmount: ethers.formatUnits(args.gcAmount, await gc.decimals()),
          ethAmount: ethers.formatUnits(args.ethAmount, 18),
          block: event.blockNumber,
          timestamp: new Date().toLocaleString(),
        });
      }

      for (const event of sold) {
        const args = event.args;
        history.push({
          type: "sell",
          gcAmount: ethers.formatUnits(args.gcAmount, await gc.decimals()),
          ethAmount: ethers.formatUnits(args.ethAmount, 18),
          block: event.blockNumber,
          timestamp: new Date().toLocaleString(),
        });
      }

      for (const event of transfers) {
        const args = event.args;
        history.push({
          type: "transfer",
          gcAmount: ethers.formatUnits(args.value, await gc.decimals()),
          to: args.to,
          block: event.blockNumber,
          timestamp: new Date().toLocaleString(),
        });
      }

      for (const event of received) {
        const args = event.args;
        if (args.from !== "0x0000000000000000000000000000000000000000") {
          history.push({
            type: "received",
            gcAmount: ethers.formatUnits(args.value, await gc.decimals()),
            from: args.from,
            block: event.blockNumber,
            timestamp: new Date().toLocaleString(),
          });
        }
      }

      history.sort((a, b) => b.block - a.block);
      return history.slice(0, 10);
    } catch {
      return [];
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
    setIsOwner(false);
    setMessage("Wallet disconnected");
    setActiveTab("dashboard");
  };

  const registerUser = async () => {
    try {
      setLoadingAction("register");
      if (!username || !email) {
        setMessage("Enter username and email");
        return;
      }
      const tx = await userProfile.registerUser(username, email);
      await tx.wait();
      setIsRegistered(true);
      setMessage("User registered successfully");
    } catch (err) {
      setMessage("Registration failed: " + formatError(err));
    } finally {
      setLoadingAction(null);
    }
  };

  const buyTokens = async () => {
    try {
      setLoadingAction("buy");
      if (!buyAmount || parseFloat(buyAmount) <= 0) {
        setMessage("Enter valid amount");
        return;
      }
      const amount = parseFloat(buyAmount);
      const ethNeeded = (BigInt(Math.floor(amount * 1e18)) * BigInt(Math.floor(parseFloat(rates.sell) * 1e18))) / BigInt(10 ** 18) / BigInt(10 ** 18);

      const tx = await gymCoin.buy(amount, { value: ethNeeded });
      await tx.wait();

      const newBal = await gymCoin.balanceOf(account);
      setBalance(ethers.formatUnits(newBal, await gymCoin.decimals()));
      setMessage("Tokens bought successfully");
      const history = await loadTransactionHistory(gymCoin, account);
      setTxHistory(history);
      setBuyAmount("");
    } catch (err) {
      setMessage("Buy failed: " + formatError(err));
    } finally {
      setLoadingAction(null);
    }
  };

  const sellTokens = async () => {
    try {
      setLoadingAction("sell");
      if (!sellAmount || parseFloat(sellAmount) <= 0) {
        setMessage("Enter valid amount");
        return;
      }
      const amount = parseFloat(sellAmount);

      const tx = await gymCoin.sell(amount);
      await tx.wait();

      const newBal = await gymCoin.balanceOf(account);
      setBalance(ethers.formatUnits(newBal, await gymCoin.decimals()));
      setMessage("Tokens sold successfully");
      const history = await loadTransactionHistory(gymCoin, account);
      setTxHistory(history);
      setSellAmount("");
    } catch (err) {
      setMessage("Sell failed: " + formatError(err));
    } finally {
      setLoadingAction(null);
    }
  };

  const transferTokens = async () => {
    try {
      setLoadingAction("transfer");
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
      const history = await loadTransactionHistory(gymCoin, account);
      setTxHistory(history);
      setTransferTo("");
      setTransferAmount("");
    } catch (err) {
      setMessage("Transfer failed: " + formatError(err));
    } finally {
      setLoadingAction(null);
    }
  };

  const updateRates = async () => {
    try {
      setLoadingAction("rates");
      if (!newSellRate || !newBuyRate) {
        setMessage("Enter both rates");
        return;
      }
      const sellRateWei = ethers.parseUnits(newSellRate, 18);
      const buyRateWei = ethers.parseUnits(newBuyRate, 18);

      const tx = await gymCoin.setRates(sellRateWei, buyRateWei);
      await tx.wait();

      setRates({ sell: newSellRate, buy: newBuyRate });
      setMessage("Rates updated successfully");
      setNewSellRate("");
      setNewBuyRate("");
    } catch (err) {
      setMessage("Update rates failed: " + formatError(err));
    } finally {
      setLoadingAction(null);
    }
  };

  if (!account) {
    return (
      <div className="login-container">
        <div className="login-box">
          <h1 className="login-title">Gym Coin System</h1>
          <p className="login-subtitle">Decentralized Gym Credit Token</p>
          <button className="connect-btn-large" onClick={connectWallet}>
            Connect MetaMask
          </button>
          {message && <p className="message error">{message}</p>}
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <>
            <div className="welcome-banner">
              <div>
                <h2>Welcome back!</h2>
                <p>Manage your Gym Coin (GC) balance and transactions.</p>
              </div>
              <div className="balance-display">
                <span>Your Balance</span>
                <div className="balance-amount">{parseFloat(balance).toFixed(2)} GC</div>
              </div>
            </div>

            <div className="info-cards">
              <div className="info-card">
                <div className="info-icon">👤</div>
                <div>
                  <span className="info-label">Username</span>
                  <span className="info-value">{isRegistered ? username : "Not registered"}</span>
                </div>
              </div>
              <div className="info-card">
                <div className="info-icon">📧</div>
                <div>
                  <span className="info-label">Email</span>
                  <span className="info-value">{isRegistered ? email : "Not registered"}</span>
                </div>
              </div>
              <div className="info-card">
                <div className="info-icon">💰</div>
                <div>
                  <span className="info-label">GC Balance</span>
                  <span className="info-value">{parseFloat(balance).toFixed(2)} GC</span>
                </div>
              </div>
            </div>

            {!isRegistered && (
              <div className="card">
                <h3>Register Profile</h3>
                <div className="form-row">
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
                </div>
                <button className="btn-primary" onClick={registerUser} disabled={loadingAction === "register"}>
                  {loadingAction === "register" ? "Processing..." : "Register"}
                </button>
              </div>
            )}

            {txHistory.length > 0 && (
              <div className="card">
                <h3>Recent Transactions</h3>
                <table className="tx-table">
                  <thead>
                    <tr>
                      <th>Type</th>
                      <th>Amount</th>
                      <th>Details</th>
                      <th>Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {txHistory.map((tx, index) => (
                      <tr key={index}>
                        <td>
                          <span className={`tx-badge ${tx.type}`}>
                            {tx.type === "buy" ? "Buy" : tx.type === "sell" ? "Sell" : tx.type === "transfer" ? "Sent" : "Received"}
                          </span>
                        </td>
                        <td className={tx.type === "buy" || tx.type === "received" ? "positive" : "negative"}>
                          {tx.type === "buy" || tx.type === "received" ? "+" : "-"}{tx.gcAmount} GC
                        </td>
                        <td>
                          {tx.type === "buy" || tx.type === "sell" ? `${tx.ethAmount} ETH` : ""}
                          {tx.type === "transfer" ? `To: ${tx.to?.slice(0, 6)}...${tx.to?.slice(-4)}` : ""}
                          {tx.type === "received" ? `From: ${tx.from?.slice(0, 6)}...${tx.from?.slice(-4)}` : ""}
                        </td>
                        <td>{tx.timestamp}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        );

      case "buy":
        return (
          <div className="card">
            <h3>Buy Gym Coin (GC)</h3>
            <p className="subtitle">Exchange ETH for Gym Coin</p>
            <div className="form-group">
              <label>Amount in GC</label>
              <input
                type="number"
                placeholder="10"
                value={buyAmount}
                onChange={(e) => setBuyAmount(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>You pay (ETH)</label>
              <div className="input-with-suffix">
                <input
                  type="text"
                  value={buyAmount ? (parseFloat(buyAmount) * parseFloat(rates.sell)).toFixed(6) : "0"}
                  readOnly
                />
                <span className="suffix">ETH</span>
              </div>
            </div>
            <div className="rate-info">
              <span>Rate</span>
              <span>1 GC = {rates.sell} ETH</span>
            </div>
            <button className="btn-buy" onClick={buyTokens} disabled={loadingAction === "buy"}>
              {loadingAction === "buy" ? "Processing..." : "Buy GC"}
            </button>
          </div>
        );

      case "sell":
        return (
          <div className="card">
            <h3>Sell Gym Coin (GC)</h3>
            <p className="subtitle">Exchange Gym Coin for ETH</p>
            <div className="form-group">
              <label>Amount in GC</label>
              <input
                type="number"
                placeholder="10"
                value={sellAmount}
                onChange={(e) => setSellAmount(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>You receive (ETH)</label>
              <div className="input-with-suffix">
                <input
                  type="text"
                  value={sellAmount ? (parseFloat(sellAmount) * parseFloat(rates.buy)).toFixed(6) : "0"}
                  readOnly
                />
                <span className="suffix">ETH</span>
              </div>
            </div>
            <div className="rate-info">
              <span>Rate</span>
              <span>1 GC = {rates.buy} ETH</span>
            </div>
            <button className="btn-sell" onClick={sellTokens} disabled={loadingAction === "sell"}>
              {loadingAction === "sell" ? "Processing..." : "Sell GC"}
            </button>
          </div>
        );

      case "transfer":
        return (
          <div className="card">
            <h3>Transfer Gym Coin (GC)</h3>
            <p className="subtitle">Send Gym Coin to another address</p>
            <div className="form-group">
              <label>Recipient Address</label>
              <input
                type="text"
                placeholder="0x..."
                value={transferTo}
                onChange={(e) => setTransferTo(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Amount in GC</label>
              <input
                type="number"
                placeholder="10"
                value={transferAmount}
                onChange={(e) => setTransferAmount(e.target.value)}
              />
            </div>
            <button className="btn-transfer" onClick={transferTokens} disabled={loadingAction === "transfer"}>
              {loadingAction === "transfer" ? "Processing..." : "Transfer GC"}
            </button>
          </div>
        );

      case "profile":
        return (
          <div className="card">
            <h3>Your Profile</h3>
            {isRegistered ? (
              <>
                <div className="profile-info">
                  <div className="profile-row">
                    <span className="profile-label">Username</span>
                    <span className="profile-value">{username}</span>
                  </div>
                  <div className="profile-row">
                    <span className="profile-label">Email</span>
                    <span className="profile-value">{email}</span>
                  </div>
                  <div className="profile-row">
                    <span className="profile-label">Wallet Address</span>
                    <span className="profile-value">{account}</span>
                  </div>
                  <div className="profile-row">
                    <span className="profile-label">GC Balance</span>
                    <span className="profile-value highlight">{parseFloat(balance).toFixed(2)} GC</span>
                  </div>
                </div>
              </>
            ) : (
              <>
                <p className="not-registered">You are not registered yet.</p>
                <div className="form-group">
                  <label>Username</label>
                  <input
                    type="text"
                    placeholder="Enter username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    placeholder="Enter email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <button className="btn-primary" onClick={registerUser} disabled={loadingAction === "register"}>
                  {loadingAction === "register" ? "Processing..." : "Register"}
                </button>
              </>
            )}
          </div>
        );

      case "owner":
        return isOwner ? (
          <div className="card">
            <h3>Owner Panel</h3>
            <p className="subtitle">Manage token rates</p>
            <div className="form-group">
              <label>New Sell Rate (ETH per GC)</label>
              <input
                type="number"
                step="0.0001"
                placeholder="0.01"
                value={newSellRate}
                onChange={(e) => setNewSellRate(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>New Buy Rate (ETH per GC)</label>
              <input
                type="number"
                step="0.0001"
                placeholder="0.005"
                value={newBuyRate}
                onChange={(e) => setNewBuyRate(e.target.value)}
              />
            </div>
            <div className="rate-info">
              <span>Current Rates</span>
              <span>Sell: {rates.sell} ETH | Buy: {rates.buy} ETH</span>
            </div>
            <button className="btn-primary" onClick={updateRates} disabled={loadingAction === "rates"}>
              {loadingAction === "rates" ? "Processing..." : "Update Rates"}
            </button>
          </div>
        ) : (
          <div className="card">
            <h3>Access Denied</h3>
            <p>Only the contract owner can access this panel.</p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="app-layout">
      <aside className="sidebar">
        <div className="sidebar-header">
          <h2>GYM COIN</h2>
          <span>Gym Credit Token System</span>
        </div>
        <nav className="sidebar-nav">
          <button
            className={`nav-item ${activeTab === "dashboard" ? "active" : ""}`}
            onClick={() => setActiveTab("dashboard")}
          >
            <span className="nav-icon">🏠</span>
            Dashboard
          </button>
          <button
            className={`nav-item ${activeTab === "buy" ? "active" : ""}`}
            onClick={() => setActiveTab("buy")}
          >
            <span className="nav-icon">🛒</span>
            Buy GC
          </button>
          <button
            className={`nav-item ${activeTab === "sell" ? "active" : ""}`}
            onClick={() => setActiveTab("sell")}
          >
            <span className="nav-icon">💵</span>
            Sell GC
          </button>
          <button
            className={`nav-item ${activeTab === "transfer" ? "active" : ""}`}
            onClick={() => setActiveTab("transfer")}
          >
            <span className="nav-icon">📤</span>
            Transfer GC
          </button>
          <button
            className={`nav-item ${activeTab === "profile" ? "active" : ""}`}
            onClick={() => setActiveTab("profile")}
          >
            <span className="nav-icon">👤</span>
            Profile
          </button>
          {isOwner && (
            <button
              className={`nav-item ${activeTab === "owner" ? "active" : ""}`}
              onClick={() => setActiveTab("owner")}
            >
              <span className="nav-icon">⚙️</span>
              Owner Panel
            </button>
          )}
        </nav>
        <div className="sidebar-footer">
          <button className="btn-disconnect" onClick={disconnectWallet}>
            Disconnect Wallet
          </button>
        </div>
      </aside>

      <main className="main-content">
        <header className="top-header">
          <div className="network-badge">
            <span className="dot green"></span>
            Sepolia Testnet
          </div>
          <div className="account-badge">
            <span className="dot purple"></span>
            {account.slice(0, 6)}...{account.slice(-4)}
          </div>
        </header>

        <div className="content-area">
          {message && (
            <div className={`message-banner ${message.includes("failed") || message.includes("cancelled") ? "error" : "success"}`}>
              {message}
            </div>
          )}
          {renderContent()}
        </div>
      </main>
    </div>
  );
}

export default App;
