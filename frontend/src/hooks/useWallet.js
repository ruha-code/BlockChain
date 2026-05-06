import { useState, useEffect, useCallback } from "react";
import { ethers } from "ethers";
import {
  GYM_COIN_ADDRESS,
  USER_PROFILE_ADDRESS,
  SEPOLIA_CHAIN_ID,
  GYM_COIN_ABI,
  USER_PROFILE_ABI,
} from "../constants";

const formatError = (err) => {
  const msg = (err.message || "").toLowerCase();
  if (msg.includes("user rejected") || msg.includes("rejected by user")) return "Transaction cancelled by user";
  if (msg.includes("insufficient funds")) return "Insufficient ETH for gas fees";
  if (msg.includes("insufficient token balance")) return "Insufficient GC balance";
  if (msg.includes("insufficient balance")) return "Insufficient balance";
  if (msg.includes("owner has insufficient tokens")) return "Owner has insufficient GC tokens";
  if (msg.includes("contract has insufficient eth")) return "Contract has insufficient ETH";
  if (msg.includes("execution reverted")) return "Transaction failed — check contract requirements";
  return err.shortMessage || err.message || "Unknown error";
};

export function useWallet() {
  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null);
  const [gymCoin, setGymCoin] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [balance, setBalance] = useState("0");
  const [ethBalance, setEthBalance] = useState("0");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [isRegistered, setIsRegistered] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [rates, setRates] = useState({ sell: "0", buy: "0" });
  const [txHistory, setTxHistory] = useState([]);
  const [txCount, setTxCount] = useState(0);
  const [loadingAction, setLoadingAction] = useState(null);
  const [message, setMessage] = useState(null);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [modal, setModal] = useState(null); // { type: 'loading'|'success', txHash, amount, action }

  const showMessage = useCallback((text, type = "success") => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 5000);
  }, []);

  useEffect(() => {
    if (!window.ethereum) return;
    const reload = () => window.location.reload();
    window.ethereum.on("accountsChanged", reload);
    window.ethereum.on("chainChanged", reload);
    return () => {
      window.ethereum.removeListener("accountsChanged", reload);
      window.ethereum.removeListener("chainChanged", reload);
    };
  }, []);

  const switchToSepolia = async () => {
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: SEPOLIA_CHAIN_ID }],
      });
    } catch (err) {
      if (err.code === 4902) {
        await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [{
            chainId: SEPOLIA_CHAIN_ID,
            chainName: "Sepolia Testnet",
            rpcUrls: ["https://rpc.sepolia.org"],
            nativeCurrency: { name: "Sepolia ETH", symbol: "ETH", decimals: 18 },
            blockExplorerUrls: ["https://sepolia.etherscan.io"],
          }],
        });
      } else throw err;
    }
  };

  const loadTransactionHistory = async (gc, addr, prov) => {
    try {
      const [bought, sold, sent, received] = await Promise.all([
        gc.queryFilter(gc.filters.TokensBought(addr)),
        gc.queryFilter(gc.filters.TokensSold(addr)),
        gc.queryFilter(gc.filters.Transfer(addr, null)),
        gc.queryFilter(gc.filters.Transfer(null, addr)),
      ]);

      const allEvents = [...bought, ...sold, ...sent, ...received];
      const blockNums = [...new Set(allEvents.map((e) => e.blockNumber))];
      const blocks = await Promise.all(blockNums.map((n) => prov.getBlock(n)));
      const blockTs = {};
      blocks.forEach((b) => { if (b) blockTs[b.number] = b.timestamp; });

      const decimals = await gc.decimals();
      const ZERO = "0x0000000000000000000000000000000000000000";
      const history = [];

      for (const ev of bought) {
        history.push({
          type: "buy",
          gcAmount: ethers.formatUnits(ev.args.gcAmount * 10n ** BigInt(decimals), decimals),
          ethAmount: ethers.formatEther(ev.args.ethAmount),
          block: ev.blockNumber,
          txHash: ev.transactionHash,
          status: "success",
          timestamp: blockTs[ev.blockNumber]
            ? new Date(blockTs[ev.blockNumber] * 1000).toLocaleString()
            : "—",
        });
      }

      for (const ev of sold) {
        history.push({
          type: "sell",
          gcAmount: ethers.formatUnits(ev.args.gcAmount * 10n ** BigInt(decimals), decimals),
          ethAmount: ethers.formatEther(ev.args.ethAmount),
          block: ev.blockNumber,
          txHash: ev.transactionHash,
          status: "success",
          timestamp: blockTs[ev.blockNumber]
            ? new Date(blockTs[ev.blockNumber] * 1000).toLocaleString()
            : "—",
        });
      }

      for (const ev of sent) {
        if (ev.args.to.toLowerCase() === addr.toLowerCase()) continue;
        history.push({
          type: "transfer",
          gcAmount: ethers.formatUnits(ev.args.value, decimals),
          ethAmount: "0",
          to: ev.args.to,
          block: ev.blockNumber,
          txHash: ev.transactionHash,
          status: "success",
          timestamp: blockTs[ev.blockNumber]
            ? new Date(blockTs[ev.blockNumber] * 1000).toLocaleString()
            : "—",
        });
      }

      for (const ev of received) {
        if (ev.args.from === ZERO) continue;
        if (ev.args.from.toLowerCase() === addr.toLowerCase()) continue;
        history.push({
          type: "received",
          gcAmount: ethers.formatUnits(ev.args.value, decimals),
          ethAmount: "0",
          from: ev.args.from,
          block: ev.blockNumber,
          txHash: ev.transactionHash,
          status: "success",
          timestamp: blockTs[ev.blockNumber]
            ? new Date(blockTs[ev.blockNumber] * 1000).toLocaleString()
            : "—",
        });
      }

      history.sort((a, b) => b.block - a.block);
      return history;
    } catch {
      return [];
    }
  };

  const refreshBalance = useCallback(async (gc, addr, prov) => {
    const [bal, ethBal, decimals] = await Promise.all([
      gc.balanceOf(addr),
      prov.getBalance(addr),
      gc.decimals(),
    ]);
    setBalance(ethers.formatUnits(bal, decimals));
    setEthBalance(parseFloat(ethers.formatEther(ethBal)).toFixed(4));
  }, []);

  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        showMessage("MetaMask not installed", "error");
        return;
      }
      await switchToSepolia();
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      const addr = accounts[0];
      setAccount(addr);

      const prov = new ethers.BrowserProvider(window.ethereum);
      const signer = await prov.getSigner();
      setProvider(prov);

      const gc = new ethers.Contract(GYM_COIN_ADDRESS, GYM_COIN_ABI, signer);
      const up = new ethers.Contract(USER_PROFILE_ADDRESS, USER_PROFILE_ABI, signer);
      setGymCoin(gc);
      setUserProfile(up);

      const [registered, owner, sellRate, buyRate] = await Promise.all([
        up.isRegistered(addr),
        gc.owner(),
        gc.sellRate(),
        gc.buyRate(),
      ]);

      setIsRegistered(registered);
      setIsOwner(owner.toLowerCase() === addr.toLowerCase());
      setRates({
        sell: ethers.formatUnits(sellRate, 18),
        buy: ethers.formatUnits(buyRate, 18),
      });

      if (registered) {
        const info = await up.getUserInfo(addr);
        setUsername(info[0]);
        setEmail(info[1]);
      }

      await refreshBalance(gc, addr, prov);
      const history = await loadTransactionHistory(gc, addr, prov);
      setTxHistory(history);
      setTxCount(history.length);
      showMessage("Wallet connected successfully");
    } catch (err) {
      showMessage("Connection failed: " + formatError(err), "error");
    }
  };

  const disconnectWallet = () => {
    setAccount(null); setProvider(null); setGymCoin(null); setUserProfile(null);
    setBalance("0"); setEthBalance("0"); setUsername(""); setEmail("");
    setIsRegistered(false); setIsOwner(false);
    setRates({ sell: "0", buy: "0" }); setTxHistory([]); setTxCount(0);
    setActiveTab("dashboard");
  };

  const registerUser = async (uname, mail) => {
    try {
      setLoadingAction("register");
      const tx = await userProfile.registerUser(uname, mail);
      await tx.wait();
      setIsRegistered(true); setUsername(uname); setEmail(mail);
      showMessage("Registered successfully!");
    } catch (err) {
      showMessage("Registration failed: " + formatError(err), "error");
    } finally { setLoadingAction(null); }
  };

  const updateUser = async (uname, mail) => {
    try {
      setLoadingAction("update");
      const tx = await userProfile.updateUser(uname, mail);
      await tx.wait();
      setUsername(uname); setEmail(mail);
      showMessage("Profile updated!");
    } catch (err) {
      showMessage("Update failed: " + formatError(err), "error");
    } finally { setLoadingAction(null); }
  };

  const buyTokens = async (amount) => {
    try {
      setLoadingAction("buy");
      const gcInt = BigInt(Math.floor(Number(amount)));
      if (gcInt <= 0n) throw new Error("Amount must be greater than 0");
      const sellRateWei = await gymCoin.sellRate();
      const ethNeeded = (gcInt * sellRateWei) / (10n ** 18n);

      setModal({ type: "loading", action: "buy", amount });
      const tx = await gymCoin.buy(gcInt, { value: ethNeeded });
      await tx.wait();

      await refreshBalance(gymCoin, account, provider);
      const history = await loadTransactionHistory(gymCoin, account, provider);
      setTxHistory(history); setTxCount(history.length);
      setModal({ type: "success", action: "buy", amount, txHash: tx.hash });
    } catch (err) {
      setModal(null);
      showMessage("Buy failed: " + formatError(err), "error");
    } finally { setLoadingAction(null); }
  };

  const sellTokens = async (amount) => {
    try {
      setLoadingAction("sell");
      const gcInt = BigInt(Math.floor(Number(amount)));
      if (gcInt <= 0n) throw new Error("Amount must be greater than 0");

      setModal({ type: "loading", action: "sell", amount });
      const tx = await gymCoin.sell(gcInt);
      await tx.wait();

      await refreshBalance(gymCoin, account, provider);
      const history = await loadTransactionHistory(gymCoin, account, provider);
      setTxHistory(history); setTxCount(history.length);
      setModal({ type: "success", action: "sell", amount, txHash: tx.hash });
    } catch (err) {
      setModal(null);
      showMessage("Sell failed: " + formatError(err), "error");
    } finally { setLoadingAction(null); }
  };

  const transferTokens = async (to, amount) => {
    try {
      setLoadingAction("transfer");
      if (!ethers.isAddress(to)) throw new Error("Invalid address");
      const decimals = await gymCoin.decimals();
      const amountWei = ethers.parseUnits(amount, decimals);

      setModal({ type: "loading", action: "transfer", amount });
      const tx = await gymCoin.transfer(to, amountWei);
      await tx.wait();

      await refreshBalance(gymCoin, account, provider);
      const history = await loadTransactionHistory(gymCoin, account, provider);
      setTxHistory(history); setTxCount(history.length);
      setModal({ type: "success", action: "transfer", amount, txHash: tx.hash });
    } catch (err) {
      setModal(null);
      showMessage("Transfer failed: " + formatError(err), "error");
    } finally { setLoadingAction(null); }
  };

  const updateRates = async (newSell, newBuy) => {
    try {
      setLoadingAction("rates");
      const sellWei = ethers.parseUnits(newSell, 18);
      const buyWei = ethers.parseUnits(newBuy, 18);
      const tx = await gymCoin.setRates(sellWei, buyWei);
      await tx.wait();
      setRates({ sell: newSell, buy: newBuy });
      showMessage("Rates updated successfully!");
    } catch (err) {
      showMessage("Update rates failed: " + formatError(err), "error");
    } finally { setLoadingAction(null); }
  };

  const closeModal = () => setModal(null);

  return {
    account, balance, ethBalance, username, email,
    isRegistered, isOwner, rates, txHistory, txCount,
    loadingAction, message, modal, closeModal,
    activeTab, setActiveTab,
    connectWallet, disconnectWallet,
    buyTokens, sellTokens, transferTokens,
    registerUser, updateUser, updateRates,
  };
}
