import { useState, useEffect, useCallback, useRef } from "react";
import { ethers } from "ethers";
import {
  GYM_COIN_ADDRESS,
  USER_PROFILE_ADDRESS,
  SEPOLIA_CHAIN_ID,
  GYM_COIN_ABI,
  USER_PROFILE_ABI,
} from "../constants";

const DEFAULT_ADMIN_ROLE = "0x0000000000000000000000000000000000000000000000000000000000000000";
export { DEFAULT_ADMIN_ROLE };

const formatError = (err) => {
  const msg = (err.message || "").toLowerCase();
  if (msg.includes("user rejected") || msg.includes("rejected by user")) return "Transaction cancelled by user";
  if (msg.includes("insufficient funds"))          return "Insufficient ETH for gas fees";
  if (msg.includes("insufficient token balance"))  return "Insufficient GC balance";
  if (msg.includes("insufficient balance"))        return "Insufficient balance";
  if (msg.includes("owner has insufficient tokens")) return "Owner has insufficient GC tokens";
  if (msg.includes("contract has insufficient eth")) return "Contract has insufficient ETH";
  if (msg.includes("exceeds max buy"))             return "Amount exceeds max buy limit";
  if (msg.includes("exceeds max sell"))            return "Amount exceeds max sell limit";
  if (msg.includes("blacklisted"))                 return "Address is blacklisted";
  if (msg.includes("contract is paused"))          return "Contract is currently paused";
  if (msg.includes("membership not configured"))   return "Membership is not configured yet";
  if (msg.includes("execution reverted"))          return "Transaction failed — check contract requirements";
  return err.shortMessage || err.message || "Unknown error";
};

export function useWallet() {
  // ── Core state ──────────────────────────────────────────────────────────────
  const [account, setAccount]         = useState(null);
  const [provider, setProvider]       = useState(null);
  const [gymCoin, setGymCoin]         = useState(null);
  const [userProfile, setUserProfile] = useState(null);

  // ── Balances ─────────────────────────────────────────────────────────────────
  const [balance, setBalance]                   = useState("0");
  const [ethBalance, setEthBalance]             = useState("0");
  const [contractEthBalance, setContractEthBalance] = useState("0");

  // ── Profile ──────────────────────────────────────────────────────────────────
  const [username, setUsername]       = useState("");
  const [email, setEmail]             = useState("");
  const [isRegistered, setIsRegistered] = useState(false);

  // ── Roles ────────────────────────────────────────────────────────────────────
  const [isOwner, setIsOwner] = useState(false);

  // ── Contract state ───────────────────────────────────────────────────────────
  const [rates, setRates]             = useState({ sell: "0", buy: "0" });
  const [limits, setLimits]           = useState({ maxBuy: "0", maxSell: "0" });
  const [isPaused, setIsPaused]       = useState(false);

  // ── Membership ───────────────────────────────────────────────────────────────
  const [isMember, setIsMember]                     = useState(false);
  const [membershipExpiry, setMembershipExpiry]     = useState("0");
  const [membershipConfig, setMembershipConfig]     = useState({ price: "0", duration: "0" });

  // ── Transactions ─────────────────────────────────────────────────────────────
  const [txHistory, setTxHistory]   = useState([]);
  const [txCount, setTxCount]       = useState(0);

  // ── UI state ─────────────────────────────────────────────────────────────────
  const [loadingAction, setLoadingAction] = useState(null);
  const [connecting, setConnecting]       = useState(false);
  const [message, setMessage]             = useState(null);
  const [activeTab, setActiveTab]         = useState("dashboard");
  const [modal, setModal]                 = useState(null);

  const isConnectingRef = useRef(false);

  // ── Helpers ──────────────────────────────────────────────────────────────────
  const showMessage = useCallback((text, type = "success") => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 5000);
  }, []);

  // ── Realtime incoming transfer listener ──────────────────────────────────────
  useEffect(() => {
    if (!gymCoin || !account) return;
    const handleTransfer = async (from, to, value) => {
      if (to.toLowerCase() !== account.toLowerCase()) return;
      if (from === ethers.ZeroAddress) return; // minting
      try {
        const decimals = await gymCoin.decimals();
        const amt = parseFloat(ethers.formatUnits(value, decimals)).toFixed(2);
        showMessage(`💸 Received ${amt} GC from ${from.slice(0, 6)}…${from.slice(-4)}`);
        // Refresh balance in background
        const [bal] = await Promise.all([gymCoin.balanceOf(account), gymCoin.runner?.provider?.getBalance(account)]);
        if (bal !== undefined) setBalance(ethers.formatUnits(bal, decimals));
      } catch { /* ignore */ }
    };
    gymCoin.on("Transfer", handleTransfer);
    return () => { gymCoin.off("Transfer", handleTransfer); };
  }, [gymCoin, account, showMessage]);

  // ── MetaMask event listeners ──────────────────────────────────────────────────
  useEffect(() => {
    if (!window.ethereum) return;
    const reload = () => window.location.reload();
    const handleAccountsChanged = () => { if (!isConnectingRef.current) reload(); };
    window.ethereum.on("accountsChanged", handleAccountsChanged);
    window.ethereum.on("chainChanged", reload);
    return () => {
      window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
      window.ethereum.removeListener("chainChanged", reload);
    };
  }, []);

  // ── Network helper ────────────────────────────────────────────────────────────
  const switchToSepolia = async () => {
    try {
      await window.ethereum.request({ method: "wallet_switchEthereumChain", params: [{ chainId: SEPOLIA_CHAIN_ID }] });
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

  // ── Balance refresh ───────────────────────────────────────────────────────────
  const refreshBalance = useCallback(async (gc, addr, prov) => {
    const [bal, ethBal, contractEthBal, decimals] = await Promise.all([
      gc.balanceOf(addr),
      prov.getBalance(addr),
      prov.getBalance(GYM_COIN_ADDRESS),
      gc.decimals(),
    ]);
    setBalance(ethers.formatUnits(bal, decimals));
    setEthBalance(parseFloat(ethers.formatEther(ethBal)).toFixed(4));
    setContractEthBalance(parseFloat(ethers.formatEther(contractEthBal)).toFixed(4));
  }, []);

  // ── Transaction history ───────────────────────────────────────────────────────
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
      const decimals = Number(await gc.decimals());
      const ZERO = "0x0000000000000000000000000000000000000000";
      const history = [];
      const fmtTs = (blockNum) => blockTs[blockNum] ? new Date(blockTs[blockNum] * 1000).toLocaleString() : "—";
      for (const ev of bought) {
        history.push({ type: "buy", gcAmount: ev.args.gcAmount.toString(), ethAmount: ethers.formatEther(ev.args.ethAmount), block: ev.blockNumber, txHash: ev.transactionHash, status: "success", timestamp: fmtTs(ev.blockNumber) });
      }
      for (const ev of sold) {
        history.push({ type: "sell", gcAmount: ev.args.gcAmount.toString(), ethAmount: ethers.formatEther(ev.args.ethAmount), block: ev.blockNumber, txHash: ev.transactionHash, status: "success", timestamp: fmtTs(ev.blockNumber) });
      }
      for (const ev of sent) {
        if (ev.args.to.toLowerCase() === addr.toLowerCase()) continue;
        history.push({ type: "transfer", gcAmount: ethers.formatUnits(ev.args.value, decimals), ethAmount: "0", to: ev.args.to, block: ev.blockNumber, txHash: ev.transactionHash, status: "success", timestamp: fmtTs(ev.blockNumber) });
      }
      for (const ev of received) {
        if (ev.args.from === ZERO) continue;
        if (ev.args.from.toLowerCase() === addr.toLowerCase()) continue;
        history.push({ type: "received", gcAmount: ethers.formatUnits(ev.args.value, decimals), ethAmount: "0", from: ev.args.from, block: ev.blockNumber, txHash: ev.transactionHash, status: "success", timestamp: fmtTs(ev.blockNumber) });
      }
      history.sort((a, b) => b.block - a.block);
      return history;
    } catch { return []; }
  };

  // ── GC Rates history loader ───────────────────────────────────────────────────
  const loadRatesHistory = useCallback(async () => {
    if (!gymCoin || !provider) return [];
    try {
      const events = await gymCoin.queryFilter(gymCoin.filters.RatesUpdated());
      const blockNums = [...new Set(events.map((e) => e.blockNumber))];
      const blocks = await Promise.all(blockNums.map((n) => provider.getBlock(n)));
      const blockTs = {};
      blocks.forEach((b) => { if (b) blockTs[b.number] = b.timestamp; });
      return events.map((ev) => ({
        timestamp: blockTs[ev.blockNumber] ?? 0,
        sellRate: parseFloat(ethers.formatUnits(ev.args.newSellRate, 18)),
        buyRate:  parseFloat(ethers.formatUnits(ev.args.newBuyRate,  18)),
      })).sort((a, b) => a.timestamp - b.timestamp);
    } catch { return []; }
  }, [gymCoin, provider]);

  // ── Leaderboard loader ────────────────────────────────────────────────────────
  const loadLeaderboard = useCallback(async () => {
    if (!gymCoin) return [];
    try {
      const transfers = await gymCoin.queryFilter(gymCoin.filters.Transfer());
      const addresses = new Set();
      for (const ev of transfers) {
        if (ev.args.from !== ethers.ZeroAddress) addresses.add(ev.args.from.toLowerCase());
        if (ev.args.to   !== ethers.ZeroAddress) addresses.add(ev.args.to.toLowerCase());
      }
      const decimals = await gymCoin.decimals();
      const entries = await Promise.all(
        [...addresses].map(async (addr) => {
          const bal = await gymCoin.balanceOf(addr);
          return { address: addr, balance: ethers.formatUnits(bal, decimals) };
        })
      );
      return entries
        .filter((e) => parseFloat(e.balance) > 0)
        .sort((a, b) => parseFloat(b.balance) - parseFloat(a.balance))
        .slice(0, 20);
    } catch { return []; }
  }, [gymCoin]);

  // ── Connect wallet ────────────────────────────────────────────────────────────
  const connectWallet = async () => {
    try {
      if (!window.ethereum) { showMessage("MetaMask not installed", "error"); return; }
      setConnecting(true);
      isConnectingRef.current = true;
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

      const [
        registered,
        isAdmin,
        sellRate, buyRate,
        maxBuy, maxSell,
        mPrice, mDuration,
        mExpiry, memberVal,
        pausedVal,
      ] = await Promise.all([
        up.isRegistered(addr),
        gc.hasRole(DEFAULT_ADMIN_ROLE, addr),
        gc.sellRate(),
        gc.buyRate(),
        gc.maxBuyAmount(),
        gc.maxSellAmount(),
        gc.membershipPrice(),
        gc.membershipDuration(),
        gc.membershipExpiry(addr),
        gc.isMember(addr),
        gc.paused(),
      ]);

      setIsRegistered(registered);
      setIsOwner(isAdmin);
      setRates({ sell: ethers.formatUnits(sellRate, 18), buy: ethers.formatUnits(buyRate, 18) });
      setLimits({ maxBuy: maxBuy.toString(), maxSell: maxSell.toString() });
      setMembershipConfig({ price: mPrice.toString(), duration: mDuration.toString() });
      setMembershipExpiry(mExpiry.toString());
      setIsMember(memberVal);
      setIsPaused(pausedVal);

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
    } finally {
      isConnectingRef.current = false;
      setConnecting(false);
    }
  };

  // ── Disconnect ────────────────────────────────────────────────────────────────
  const disconnectWallet = () => {
    setAccount(null); setProvider(null); setGymCoin(null); setUserProfile(null);
    setBalance("0"); setEthBalance("0"); setUsername(""); setEmail("");
    setIsRegistered(false); setIsOwner(false);
    setContractEthBalance("0");
    setRates({ sell: "0", buy: "0" });
    setLimits({ maxBuy: "0", maxSell: "0" });
    setMembershipConfig({ price: "0", duration: "0" });
    setMembershipExpiry("0"); setIsMember(false); setIsPaused(false);
    setTxHistory([]); setTxCount(0);
    setActiveTab("dashboard");
  };

  // ── Profile ───────────────────────────────────────────────────────────────────
  const registerUser = async (uname, mail) => {
    try {
      setLoadingAction("register");
      const tx = await userProfile.registerUser(uname, mail);
      await tx.wait();
      setIsRegistered(true); setUsername(uname); setEmail(mail);
      showMessage("Registered successfully!");
    } catch (err) { showMessage("Registration failed: " + formatError(err), "error"); }
    finally { setLoadingAction(null); }
  };

  const updateUser = async (uname, mail) => {
    try {
      setLoadingAction("update");
      const tx = await userProfile.updateUser(uname, mail);
      await tx.wait();
      setUsername(uname); setEmail(mail);
      showMessage("Profile updated!");
    } catch (err) { showMessage("Update failed: " + formatError(err), "error"); }
    finally { setLoadingAction(null); }
  };

  // ── Buy / Sell / Transfer ─────────────────────────────────────────────────────
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
    } catch (err) { setModal(null); showMessage("Buy failed: " + formatError(err), "error"); }
    finally { setLoadingAction(null); }
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
    } catch (err) { setModal(null); showMessage("Sell failed: " + formatError(err), "error"); }
    finally { setLoadingAction(null); }
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
    } catch (err) { setModal(null); showMessage("Transfer failed: " + formatError(err), "error"); }
    finally { setLoadingAction(null); }
  };

  // ── Admin: rates ──────────────────────────────────────────────────────────────
  const updateRates = async (newSell, newBuy) => {
    try {
      setLoadingAction("rates");
      const tx = await gymCoin.setRates(ethers.parseUnits(newSell, 18), ethers.parseUnits(newBuy, 18));
      await tx.wait();
      setRates({ sell: newSell, buy: newBuy });
      showMessage("Rates updated!");
    } catch (err) { showMessage("Update rates failed: " + formatError(err), "error"); }
    finally { setLoadingAction(null); }
  };

  // ── Admin: limits ─────────────────────────────────────────────────────────────
  const updateLimits = async (maxBuy, maxSell) => {
    try {
      setLoadingAction("limits");
      const tx = await gymCoin.setLimits(BigInt(maxBuy), BigInt(maxSell));
      await tx.wait();
      setLimits({ maxBuy: maxBuy.toString(), maxSell: maxSell.toString() });
      showMessage("Limits updated!");
    } catch (err) { showMessage("Update limits failed: " + formatError(err), "error"); }
    finally { setLoadingAction(null); }
  };

  // ── Admin: pause ──────────────────────────────────────────────────────────────
  const pauseContract = async () => {
    try {
      setLoadingAction("pause");
      const tx = await gymCoin.pause();
      await tx.wait();
      setIsPaused(true);
      showMessage("Contract paused");
    } catch (err) { showMessage("Pause failed: " + formatError(err), "error"); }
    finally { setLoadingAction(null); }
  };

  const unpauseContract = async () => {
    try {
      setLoadingAction("pause");
      const tx = await gymCoin.unpause();
      await tx.wait();
      setIsPaused(false);
      showMessage("Contract unpaused");
    } catch (err) { showMessage("Unpause failed: " + formatError(err), "error"); }
    finally { setLoadingAction(null); }
  };

  // ── Admin: blacklist ──────────────────────────────────────────────────────────
  const blacklistAddr = async (addr) => {
    try {
      setLoadingAction("blacklist");
      const tx = await gymCoin.blacklistAddress(addr);
      await tx.wait();
      showMessage(`${addr.slice(0, 10)}… blacklisted`);
    } catch (err) { showMessage("Blacklist failed: " + formatError(err), "error"); }
    finally { setLoadingAction(null); }
  };

  const unblacklistAddr = async (addr) => {
    try {
      setLoadingAction("blacklist");
      const tx = await gymCoin.unblacklistAddress(addr);
      await tx.wait();
      showMessage(`${addr.slice(0, 10)}… removed from blacklist`);
    } catch (err) { showMessage("Unblacklist failed: " + formatError(err), "error"); }
    finally { setLoadingAction(null); }
  };

  // ── Admin: membership config ──────────────────────────────────────────────────
  const updateMembershipConfig = async (price, durationDays) => {
    try {
      setLoadingAction("membership");
      const durationSec = BigInt(Math.floor(durationDays * 86400));
      const tx = await gymCoin.setMembershipConfig(BigInt(price), durationSec);
      await tx.wait();
      setMembershipConfig({ price: price.toString(), duration: durationSec.toString() });
      showMessage("Membership config updated!");
    } catch (err) { showMessage("Membership config failed: " + formatError(err), "error"); }
    finally { setLoadingAction(null); }
  };

  // ── Admin: roles ──────────────────────────────────────────────────────────────
  const grantRole = async (roleHash, addr) => {
    try {
      setLoadingAction("role");
      const tx = await gymCoin.grantRole(roleHash, addr);
      await tx.wait();
      showMessage("Role granted!");
    } catch (err) { showMessage("Grant role failed: " + formatError(err), "error"); }
    finally { setLoadingAction(null); }
  };

  const revokeRole = async (roleHash, addr) => {
    try {
      setLoadingAction("role");
      const tx = await gymCoin.revokeRole(roleHash, addr);
      await tx.wait();
      showMessage("Role revoked!");
    } catch (err) { showMessage("Revoke role failed: " + formatError(err), "error"); }
    finally { setLoadingAction(null); }
  };

  // ── User: buy membership ──────────────────────────────────────────────────────
  const buyMembership = async () => {
    try {
      setLoadingAction("membership");
      const tx = await gymCoin.buyMembership();
      await tx.wait();
      const [expiry, memberVal] = await Promise.all([
        gymCoin.membershipExpiry(account),
        gymCoin.isMember(account),
      ]);
      setMembershipExpiry(expiry.toString());
      setIsMember(memberVal);
      await refreshBalance(gymCoin, account, provider);
      const history = await loadTransactionHistory(gymCoin, account, provider);
      setTxHistory(history); setTxCount(history.length);
      showMessage("🎉 Membership activated!");
    } catch (err) { showMessage("Membership failed: " + formatError(err), "error"); }
    finally { setLoadingAction(null); }
  };

  const closeModal = () => setModal(null);

  return {
    // state
    account, balance, ethBalance, contractEthBalance, username, email,
    isRegistered, isOwner,
    rates, limits, isPaused,
    isMember, membershipExpiry, membershipConfig,
    txHistory, txCount,
    connecting, loadingAction, message, modal,
    activeTab,
    // actions
    setActiveTab, closeModal,
    connectWallet, disconnectWallet,
    buyTokens, sellTokens, transferTokens,
    registerUser, updateUser,
    updateRates, updateLimits,
    pauseContract, unpauseContract,
    blacklistAddr, unblacklistAddr,
    updateMembershipConfig, buyMembership,
    grantRole, revokeRole,
    loadLeaderboard, loadRatesHistory,
  };
}
