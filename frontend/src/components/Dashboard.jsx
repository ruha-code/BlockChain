import { useState, useEffect } from "react";
import { SEPOLIA_EXPLORER } from "../constants";

function useEthPrice() {
  const [price, setPrice]   = useState(null);
  const [change, setChange] = useState(null);
  useEffect(() => {
    fetch("https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd&include_24hr_change=true")
      .then((r) => r.json())
      .then((d) => { setPrice(d.ethereum?.usd); setChange(d.ethereum?.usd_24h_change); })
      .catch(() => {});
  }, []);
  return { price, change };
}

const TYPE_BADGE  = {
  buy:      "bg-emerald-50 text-emerald-700 border-emerald-100",
  sell:     "bg-red-50 text-red-600 border-red-100",
  transfer: "bg-blue-50 text-blue-700 border-blue-100",
  received: "bg-violet-50 text-violet-700 border-violet-100",
};
const TYPE_LABEL  = { buy: "Buy", sell: "Sell", transfer: "Sent", received: "Received" };
const TYPE_AMOUNT = { buy: true, sell: false, transfer: false, received: true };

function shortAddr(a) { return a ? `${a.slice(0, 6)}…${a.slice(-4)}` : ""; }

const ACTIONS = [
  { id: "buy",          label: "Buy GC",       sub: "Exchange ETH for GC",      color: "emerald", icon: <path d="M12 5v14M5 12l7 7 7-7" /> },
  { id: "sell",         label: "Sell GC",       sub: "Exchange GC for ETH",      color: "red",     icon: <path d="M12 19V5M5 12l7-7 7 7" /> },
  { id: "transfer",     label: "Transfer",      sub: "Send GC to another wallet",color: "blue",    icon: <path d="M5 12h14M14 6l6 6-6 6" /> },
  { id: "membership",   label: "Membership",    sub: "Activate gym membership",  color: "violet",  icon: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /> },
];

const ACTION_COLORS = {
  emerald: { bg: "bg-emerald-50", border: "border-emerald-100", stroke: "#059669" },
  red:     { bg: "bg-red-50",     border: "border-red-100",     stroke: "#ef4444" },
  blue:    { bg: "bg-blue-50",    border: "border-blue-100",    stroke: "#2563eb" },
  violet:  { bg: "bg-violet-50",  border: "border-violet-100",  stroke: "#7c3aed" },
};

const FEATURES = [
  { color: "emerald", label: "Secure & Transparent", sub: "All transactions recorded on Sepolia", icon: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /> },
  { color: "blue",    label: "Non-Custodial",         sub: "You own your keys, you own your tokens", icon: <><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></> },
  { color: "violet",  label: "Built for Gyms",        sub: "Powering fitness communities with blockchain", icon: <><path d="M18 8h1a4 4 0 0 1 0 8h-1" /><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" /></> },
];

// Compute balance history from txHistory (newest-first) + current balance
function buildChartData(txHistory, currentBalance) {
  if (!txHistory || txHistory.length === 0) return [];
  let bal = parseFloat(currentBalance) || 0;
  const points = [{ label: "Now", balance: parseFloat(bal.toFixed(2)) }];
  for (const tx of txHistory) {
    const amt = parseFloat(tx.gcAmount) || 0;
    if (tx.type === "buy" || tx.type === "received") bal -= amt;
    else if (tx.type === "sell" || tx.type === "transfer") bal += amt;
    points.push({ label: tx.timestamp, balance: Math.max(0, parseFloat(bal.toFixed(2))) });
  }
  return points.reverse();
}

function BalanceChart({ txHistory, balance }) {
  const data = buildChartData(txHistory, balance);
  if (data.length < 2) return (
    <div className="h-20 flex items-center justify-center">
      <p className="text-xs text-gray-400">Not enough data for chart</p>
    </div>
  );

  const values = data.map((d) => d.balance);
  const minV = Math.min(...values);
  const maxV = Math.max(...values);
  const range = maxV - minV || 1;
  const W = 400, H = 80;

  const pts = data.map((d, i) => {
    const x = (i / (data.length - 1)) * W;
    const y = H - ((d.balance - minV) / range) * (H - 10) - 5;
    return `${x},${y}`;
  });
  const polyline = pts.join(" ");
  const area     = `0,${H} ${polyline} ${W},${H}`;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-20" preserveAspectRatio="none">
      <defs>
        <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#059669" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#059669" stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={area} fill="url(#chartGrad)" />
      <polyline points={polyline} fill="none" stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      {/* Last dot */}
      <circle cx={W} cy={pts[pts.length - 1].split(",")[1]} r="3" fill="#059669" />
    </svg>
  );
}

function fmtExpiry(ts) {
  const n = Number(ts);
  if (!n) return null;
  return new Date(n * 1000).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function Dashboard({
  account, balance, ethBalance, username,
  isRegistered, txHistory, txCount, rates, setActiveTab,
  isMember, membershipExpiry, isPaused,
}) {
  const recent = txHistory.slice(0, 6);
  const { price: ethUSD, change: ethChange } = useEthPrice();
  const gcBuyUSD  = ethUSD ? ethUSD * parseFloat(rates?.sell ?? 0) : null;
  const gcSellUSD = ethUSD ? ethUSD * parseFloat(rates?.buy  ?? 0) : null;

  return (
    <div className="space-y-5 animate-fade-up">

      {/* ── Pause banner ── */}
      {isPaused && (
        <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-2xl">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-bold text-red-800">Contract is paused</p>
            <p className="text-xs text-red-600">All buy / sell / transfer operations are currently disabled by the admin.</p>
          </div>
        </div>
      )}

      {/* ── Registration Banner ── */}
      {!isRegistered && (
        <div className="relative bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl p-5 overflow-hidden">
          <div className="absolute right-0 top-0 w-40 h-40 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4 pointer-events-none" />
          <div className="relative flex items-center gap-4">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-bold text-sm">Complete your registration</p>
              <p className="text-white/80 text-xs mt-0.5">Create your on-chain profile to unlock full features.</p>
            </div>
            <button onClick={() => setActiveTab("profile")} className="flex-shrink-0 flex items-center gap-2 bg-white text-orange-600 font-bold text-xs px-4 py-2.5 rounded-xl hover:bg-orange-50 transition-all hover:-translate-y-px cursor-pointer shadow-sm">
              Register Now
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
            </button>
          </div>
        </div>
      )}

      {/* ── Hero Banner ── */}
      <div className="relative bg-gradient-to-br from-emerald-600 via-emerald-600 to-emerald-700 rounded-2xl overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/3 translate-x-1/4 pointer-events-none" />
        <div className="absolute right-32 bottom-0 w-36 h-36 bg-white/5 rounded-full translate-y-1/2 pointer-events-none" />
        <div className="relative flex items-center justify-between px-8 pt-8 pb-0">
          <div className="pb-8">
            <p className="text-emerald-200 text-xs font-medium mb-1">Welcome back,</p>
            <h2 className="text-2xl font-extrabold text-white tracking-tight leading-tight mb-1.5">
              {isRegistered ? username : shortAddr(account)}
            </h2>
            <p className="text-emerald-300 text-xs mb-7">Here's what's happening with your Gym Coin.</p>
            <div className="flex items-center gap-3 flex-wrap">
              <HeroPill icon={<path d="M12 5v14M5 12l7 7 7-7" />} label="GC Balance" value={`${parseFloat(balance).toLocaleString(undefined, { maximumFractionDigits: 2 })} GC`} />
              <HeroPill icon={<><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" /><path d="M3 7v13h18v-5" /><path d="M18 12a2 2 0 0 0 0 4h4v-4z" /></>} label="ETH Balance" value={`${parseFloat(ethBalance || 0).toFixed(4)} ETH`} />
              <HeroPill icon={<><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" /><rect x="9" y="3" width="6" height="4" rx="1" /></>} label="Transactions" value={txCount} />
              <HeroPill icon={<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />} label="Membership" value={isMember ? "PRO ✦" : "Inactive"} />
            </div>
          </div>
          <div className="flex-shrink-0 hidden lg:flex items-end self-end">
            <CoinIllustration />
          </div>
        </div>
      </div>

      {/* ── Quick Actions ── */}
      <div className="grid grid-cols-4 gap-4">
        {ACTIONS.map(({ id, label, sub, color, icon }) => {
          const c = ACTION_COLORS[color];
          return (
            <button key={id} onClick={() => setActiveTab(id)} className="bg-white border border-gray-100 rounded-2xl p-4 flex items-center gap-3 hover:shadow-md hover:-translate-y-0.5 transition-all duration-150 group cursor-pointer text-left">
              <div className={`w-10 h-10 rounded-xl ${c.bg} border ${c.border} flex items-center justify-center flex-shrink-0`}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={c.stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{icon}</svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-gray-900 leading-none mb-0.5">{label}</p>
                <p className="text-[11px] text-gray-400 leading-tight">{sub}</p>
              </div>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 group-hover:stroke-gray-500 group-hover:translate-x-0.5 transition-all duration-150"><path d="M9 18l6-6-6-6" /></svg>
            </button>
          );
        })}
      </div>

      {/* ── Main grid ── */}
      <div className="grid grid-cols-3 gap-5">

        {/* Left: Activity + chart */}
        <div className="col-span-2 space-y-4">

          {/* Balance chart */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center justify-between mb-1">
              <div>
                <p className="text-sm font-bold text-gray-900">Balance History</p>
                <p className="text-xs text-gray-400 mt-0.5">GC token balance over transactions</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-extrabold text-gray-900">{parseFloat(balance).toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
                <p className="text-[10px] text-gray-400">current GC</p>
              </div>
            </div>
            <BalanceChart txHistory={txHistory} balance={balance} />
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
              <div>
                <p className="text-sm font-bold text-gray-900">Recent Activity</p>
                <p className="text-xs text-gray-400 mt-0.5">{recent.length} of {txCount} transactions</p>
              </div>
              <button onClick={() => setActiveTab("transactions")} className="text-xs font-semibold text-gray-500 hover:text-gray-700 bg-gray-50 hover:bg-gray-100 border border-gray-100 px-3 py-1.5 rounded-lg transition-all cursor-pointer">
                View all
              </button>
            </div>
            {recent.length === 0 ? <EmptyActivity /> : (
              <div className="divide-y divide-gray-50">
                {recent.map((tx, i) => {
                  const isPos = TYPE_AMOUNT[tx.type];
                  return (
                    <div key={i} className="flex items-center gap-3.5 px-5 py-3.5 hover:bg-gray-50/60 transition-colors group">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${isPos ? "bg-emerald-50" : "bg-red-50"}`}>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={isPos ? "#059669" : "#dc2626"} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          {isPos ? <path d="M12 5v14M5 12l7 7 7-7" /> : <path d="M12 19V5M5 12l7-7 7 7" />}
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md border ${TYPE_BADGE[tx.type]}`}>{TYPE_LABEL[tx.type]}</span>
                          <span className="text-xs text-gray-400 truncate">
                            {tx.type === "transfer" && `to ${shortAddr(tx.to)}`}
                            {tx.type === "received" && `from ${shortAddr(tx.from)}`}
                            {(tx.type === "buy" || tx.type === "sell") && `${parseFloat(tx.ethAmount).toFixed(5)} ETH`}
                          </span>
                        </div>
                        <p className="text-[11px] text-gray-400">{tx.timestamp}</p>
                      </div>
                      <p className={`text-sm font-bold flex-shrink-0 ${isPos ? "text-emerald-600" : "text-red-500"}`}>
                        {isPos ? "+" : "−"}{parseFloat(tx.gcAmount).toFixed(2)} GC
                      </p>
                      {tx.txHash && (
                        <a href={`${SEPOLIA_EXPLORER}/tx/${tx.txHash}`} target="_blank" rel="noreferrer"
                          className="w-7 h-7 flex items-center justify-center rounded-lg opacity-0 group-hover:opacity-100 hover:bg-gray-100 transition-all flex-shrink-0">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" />
                          </svg>
                        </a>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
            <div className="grid grid-cols-3 border-t border-gray-50">
              {FEATURES.map(({ color, label, sub, icon }) => {
                const c = ACTION_COLORS[color];
                return (
                  <div key={label} className="flex items-start gap-3 px-5 py-4 border-r border-gray-50 last:border-r-0">
                    <div className={`w-7 h-7 rounded-lg ${c.bg} border ${c.border} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={c.stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{icon}</svg>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-700 leading-none mb-1">{label}</p>
                      <p className="text-[11px] text-gray-400 leading-relaxed">{sub}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right widgets */}
        <div className="space-y-4">

          {/* Membership card */}
          <div
            onClick={() => setActiveTab("membership")}
            className={`rounded-2xl p-5 cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-md ${isMember ? "bg-gradient-to-br from-violet-600 to-violet-800" : "bg-white border border-gray-100 shadow-sm"}`}
          >
            <div className="flex items-center justify-between mb-3">
              <p className={`text-xs font-bold uppercase tracking-wider ${isMember ? "text-violet-200" : "text-gray-400"}`}>Membership</p>
              {isMember && <span className="text-[10px] font-bold bg-white/20 text-white px-2 py-0.5 rounded-full">PRO</span>}
            </div>
            {isMember ? (
              <>
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  <p className="text-white font-bold text-sm">Active Member</p>
                </div>
                <p className="text-violet-200 text-xs">Expires {fmtExpiry(membershipExpiry)}</p>
              </>
            ) : (
              <>
                <p className="text-gray-700 font-bold text-sm mb-1">Not a Member</p>
                <p className="text-gray-400 text-xs">Tap to activate gym membership</p>
              </>
            )}
          </div>

          {/* ETH Live Price */}
          <div
            onClick={() => setActiveTab("market")}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 cursor-pointer hover:-translate-y-0.5 hover:shadow-md transition-all"
          >
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">ETH / USD</p>
              <span className="text-[10px] text-indigo-600 font-bold bg-indigo-50 px-2 py-0.5 rounded-full">Live</span>
            </div>
            {ethUSD ? (
              <>
                <p className="text-2xl font-extrabold text-gray-900">${ethUSD.toLocaleString("en-US", { maximumFractionDigits: 2 })}</p>
                <div className={`flex items-center gap-1 mt-1 ${(ethChange ?? 0) >= 0 ? "text-emerald-600" : "text-red-500"}`}>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    {(ethChange ?? 0) >= 0 ? <path d="M12 19V5M5 12l7-7 7 7"/> : <path d="M12 5v14M5 12l7 7 7-7"/>}
                  </svg>
                  <span className="text-xs font-bold">{Math.abs(ethChange ?? 0).toFixed(2)}%</span>
                  <span className="text-xs text-gray-400">24h</span>
                </div>
                <div className="mt-3 pt-3 border-t border-gray-50 space-y-1.5">
                  {gcBuyUSD !== null && <div className="flex justify-between"><span className="text-[11px] text-gray-400">1 GC buy price</span><span className="text-[11px] font-semibold text-emerald-600">${gcBuyUSD.toFixed(4)}</span></div>}
                  {gcSellUSD !== null && <div className="flex justify-between"><span className="text-[11px] text-gray-400">1 GC sell price</span><span className="text-[11px] font-semibold text-red-500">${gcSellUSD.toFixed(4)}</span></div>}
                </div>
              </>
            ) : (
              <div className="space-y-2">
                <div className="h-7 w-32 bg-gray-100 rounded-lg animate-pulse" />
                <div className="h-4 w-20 bg-gray-100 rounded animate-pulse" />
              </div>
            )}
          </div>

          {/* Contract Rates */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center gap-1.5 mb-4">
              <p className="text-sm font-bold text-gray-900">Contract Rates</p>
            </div>
            <div className="space-y-3">
              <RateCard label="Buy Rate" value={parseFloat(rates.sell).toFixed(4)} color="emerald" dir="down" />
              <RateCard label="Sell Rate" value={parseFloat(rates.buy).toFixed(4)} color="red" dir="up" />
            </div>
          </div>

          {/* Wallet */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <p className="text-sm font-bold text-gray-900 mb-3">Wallet</p>
            <div className="flex items-center gap-2 mb-3">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="text-xs font-semibold text-gray-700">Connected</span>
            </div>
            <div className="bg-gray-50 border border-gray-100 rounded-xl px-3 py-2.5 mb-3">
              <p className="text-[11px] font-mono text-gray-600 break-all leading-relaxed">{account}</p>
            </div>
            <a href={`${SEPOLIA_EXPLORER}/address/${account}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-xs text-emerald-600 hover:text-emerald-700 font-semibold transition-colors">
              View on Etherscan
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Sub-components ── */

function HeroPill({ icon, label, value }) {
  return (
    <div className="flex items-center gap-2.5 bg-white/10 backdrop-blur-sm border border-white/15 rounded-xl px-3.5 py-2.5">
      <div className="w-7 h-7 bg-white/15 rounded-lg flex items-center justify-center flex-shrink-0">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{icon}</svg>
      </div>
      <div>
        <p className="text-emerald-200 text-[9px] font-bold uppercase tracking-wider leading-none mb-0.5">{label}</p>
        <p className="text-white text-sm font-extrabold leading-none">{value}</p>
      </div>
    </div>
  );
}

function RateCard({ label, value, color, dir }) {
  const isGreen = color === "emerald";
  return (
    <div className={`flex items-center justify-between p-4 rounded-xl border ${isGreen ? "bg-emerald-50 border-emerald-100" : "bg-red-50 border-red-100"}`}>
      <div>
        <p className={`text-[11px] font-semibold mb-1 ${isGreen ? "text-emerald-600" : "text-red-500"}`}>{label}</p>
        <p className={`text-2xl font-extrabold leading-none ${isGreen ? "text-emerald-700" : "text-red-600"}`}>{value}</p>
        <p className={`text-[10px] mt-1 font-medium ${isGreen ? "text-emerald-400" : "text-red-400"}`}>ETH / GC</p>
      </div>
      <div className="flex items-center gap-2">
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${isGreen ? "bg-emerald-100" : "bg-red-100"}`}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={isGreen ? "#059669" : "#ef4444"} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            {dir === "down" ? <path d="M12 5v14M5 12l7 7 7-7" /> : <path d="M12 19V5M5 12l7-7 7 7" />}
          </svg>
        </div>
        <svg width="52" height="28" viewBox="0 0 52 28" fill="none">
          <polyline points={isGreen ? "0,20 10,16 20,19 30,10 40,15 52,12" : "0,10 10,16 20,12 30,18 40,14 52,18"} stroke={isGreen ? "#059669" : "#ef4444"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.5" />
        </svg>
      </div>
    </div>
  );
}

function EmptyActivity() {
  return (
    <div className="py-16 flex flex-col items-center">
      <div className="w-14 h-14 bg-gray-50 border border-gray-100 rounded-2xl flex items-center justify-center mb-4">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" /><rect x="9" y="3" width="6" height="4" rx="1" />
        </svg>
      </div>
      <p className="text-sm font-semibold text-gray-600 mb-1">No transactions yet</p>
      <p className="text-xs text-gray-400">Your on-chain activity will appear here.</p>
    </div>
  );
}

function CoinIllustration() {
  return (
    <div className="relative w-44 h-44">
      <div className="absolute inset-0 bg-emerald-400/20 rounded-full blur-2xl scale-75 translate-y-4" />
      <svg viewBox="0 0 160 160" fill="none" className="w-full h-full drop-shadow-2xl">
        <ellipse cx="80" cy="75" rx="62" ry="62" fill="url(#coinGrad)" />
        <ellipse cx="80" cy="75" rx="62" ry="62" fill="none" stroke="#86efac" strokeWidth="1.5" opacity="0.3" />
        <ellipse cx="80" cy="75" rx="50" ry="50" fill="none" stroke="#86efac" strokeWidth="1" opacity="0.2" />
        <path d="M88 45L68 78H82L72 108L96 72H81L88 45Z" fill="white" opacity="0.9" />
        <ellipse cx="80" cy="138" rx="50" ry="10" fill="#000" opacity="0.12" />
        <defs>
          <radialGradient id="coinGrad" cx="40%" cy="35%" r="70%">
            <stop offset="0%" stopColor="#34d399" />
            <stop offset="60%" stopColor="#059669" />
            <stop offset="100%" stopColor="#047857" />
          </radialGradient>
        </defs>
      </svg>
    </div>
  );
}
