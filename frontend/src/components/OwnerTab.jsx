import { useState } from "react";
import { Spinner } from "./BuyTab";

function Section({ title, desc, children }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <h3 className="text-sm font-semibold text-gray-900 mb-0.5">{title}</h3>
      {desc && <p className="text-xs text-gray-400 mb-5">{desc}</p>}
      <div className={desc ? "" : "mt-4"}>{children}</div>
    </div>
  );
}

function FieldRow({ label, hint, children }) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-500 mb-1.5">{label}</label>
      {children}
      {hint && <p className="text-[11px] text-gray-400 mt-1">{hint}</p>}
    </div>
  );
}

export default function OwnerTab({
  rates, limits,
  isOwner,
  onUpdateRates, onUpdateLimits,
  onFund, onWithdraw, contractEthBalance,
  loading,
}) {
  const [newSell,    setNewSell]    = useState("");
  const [newBuy,     setNewBuy]     = useState("");
  const [newMaxBuy,  setNewMaxBuy]  = useState("");
  const [newMaxSell, setNewMaxSell] = useState("");
  const [fundAmt,    setFundAmt]    = useState("");

  if (!isOwner) {
    return (
      <div className="max-w-lg">
        <div className="bg-white rounded-2xl border border-red-100 shadow-sm p-8 text-center">
          <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
          </div>
          <h3 className="text-base font-semibold text-gray-900 mb-2">Access Denied</h3>
          <p className="text-sm text-gray-500">You don't have admin access to this contract.</p>
        </div>
      </div>
    );
  }

  const inputCls = "w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all";

  return (
    <div className="max-w-3xl space-y-5 animate-fade-up">

      {/* Admin badge */}
      <div className="flex items-center gap-3 p-4 bg-amber-50 border border-amber-200 rounded-2xl">
        <div className="w-9 h-9 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          </svg>
        </div>
        <div>
          <p className="text-sm font-semibold text-amber-900">Admin Panel</p>
          <p className="text-xs text-amber-700">Full control over the GymCoin contract</p>
        </div>
        <span className="ml-auto text-xs font-bold bg-amber-200 text-amber-800 px-3 py-1 rounded-full">OWNER</span>
      </div>

      {/* EXCHANGE RATES */}
      <Section title="Exchange Rates" desc="Update the buy/sell rates for GC tokens">
        <div className="grid grid-cols-2 gap-3 mb-5">
          <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl">
            <p className="text-xs text-emerald-600 font-medium mb-1">User Pays (Buy)</p>
            <p className="text-2xl font-extrabold text-emerald-700">{rates.sell}</p>
            <p className="text-xs text-emerald-500 mt-0.5">ETH per GC</p>
          </div>
          <div className="p-4 bg-red-50 border border-red-100 rounded-xl">
            <p className="text-xs text-red-500 font-medium mb-1">User Receives (Sell)</p>
            <p className="text-2xl font-extrabold text-red-600">{rates.buy}</p>
            <p className="text-xs text-red-400 mt-0.5">ETH per GC</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 mb-4">
          <FieldRow label="New Buy Rate (ETH/GC)" hint="ETH a user pays to buy 1 GC">
            <input type="number" step="0.0001" placeholder={rates.sell} value={newSell} onChange={(e) => setNewSell(e.target.value)} className={inputCls} />
          </FieldRow>
          <FieldRow label="New Sell Rate (ETH/GC)" hint="ETH a user gets when selling 1 GC">
            <input type="number" step="0.0001" placeholder={rates.buy} value={newBuy} onChange={(e) => setNewBuy(e.target.value)} className={inputCls} />
          </FieldRow>
        </div>
        <button
          onClick={() => parseFloat(newSell) > 0 && parseFloat(newBuy) > 0 && onUpdateRates(newSell, newBuy)}
          disabled={loading === "rates" || !(parseFloat(newSell) > 0 && parseFloat(newBuy) > 0)}
          className="px-5 py-2.5 bg-gray-900 hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl text-sm font-bold transition-all flex items-center gap-2 shadow-sm hover:-translate-y-px"
        >
          {loading === "rates" ? <><Spinner /> Updating...</> : "Update Rates"}
        </button>
      </Section>

      {/* TRANSACTION LIMITS */}
      <Section title="Transaction Limits" desc="Set maximum GC amounts per single buy/sell operation">
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="p-3 bg-gray-50 border border-gray-100 rounded-xl">
            <p className="text-xs text-gray-500 mb-1">Current Max Buy</p>
            <p className="text-lg font-bold text-gray-900">{limits.maxBuy} <span className="text-xs font-normal text-gray-400">GC</span></p>
          </div>
          <div className="p-3 bg-gray-50 border border-gray-100 rounded-xl">
            <p className="text-xs text-gray-500 mb-1">Current Max Sell</p>
            <p className="text-lg font-bold text-gray-900">{limits.maxSell} <span className="text-xs font-normal text-gray-400">GC</span></p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 mb-4">
          <FieldRow label="New Max Buy (GC)" hint="Per single transaction">
            <input type="number" step="1" placeholder={limits.maxBuy} value={newMaxBuy} onChange={(e) => setNewMaxBuy(e.target.value)} className={inputCls} />
          </FieldRow>
          <FieldRow label="New Max Sell (GC)" hint="Per single transaction">
            <input type="number" step="1" placeholder={limits.maxSell} value={newMaxSell} onChange={(e) => setNewMaxSell(e.target.value)} className={inputCls} />
          </FieldRow>
        </div>
        <button
          onClick={() => parseInt(newMaxBuy) > 0 && parseInt(newMaxSell) > 0 && onUpdateLimits(newMaxBuy, newMaxSell)}
          disabled={loading === "limits" || !(parseInt(newMaxBuy) > 0 && parseInt(newMaxSell) > 0)}
          className="px-5 py-2.5 bg-gray-900 hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl text-sm font-bold transition-all flex items-center gap-2 shadow-sm hover:-translate-y-px"
        >
          {loading === "limits" ? <><Spinner /> Updating...</> : "Update Limits"}
        </button>
      </Section>

      {/* FUND CONTRACT */}
      <Section title="Fund Contract" desc="Send ETH to the contract so users can sell GC tokens">
        <div className="flex items-center gap-3 p-4 bg-blue-50 border border-blue-100 rounded-xl mb-4">
          <div className="flex-1">
            <p className="text-xs text-blue-600 mb-0.5">Contract ETH Balance</p>
            <p className="text-2xl font-extrabold text-blue-800">{contractEthBalance ?? "0"} <span className="text-sm font-normal text-blue-400">ETH</span></p>
            {parseFloat(contractEthBalance ?? 0) === 0 && (
              <p className="text-xs text-red-500 font-medium mt-1">Empty — users cannot sell GC right now</p>
            )}
          </div>
        </div>
        <div className="flex gap-3 mb-4">
          {["0.01", "0.05", "0.1", "0.5"].map((n) => (
            <button
              key={n}
              onClick={() => setFundAmt(n)}
              className={`px-4 py-2 rounded-xl text-sm font-bold border transition-all cursor-pointer hover:-translate-y-px ${
                fundAmt === n
                  ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                  : "bg-white text-gray-500 border-gray-200 hover:border-blue-300 hover:text-blue-600"
              }`}
            >
              {n} ETH
            </button>
          ))}
          <input
            type="number"
            step="0.01"
            placeholder="Custom"
            value={fundAmt}
            onChange={(e) => setFundAmt(e.target.value)}
            className={inputCls + " flex-1"}
          />
        </div>
        <button
          onClick={() => { const amt = parseFloat(fundAmt); if (amt > 0) onFund(fundAmt); }}
          disabled={!(parseFloat(fundAmt) > 0) || loading === "fund"}
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl text-sm font-bold transition-all flex items-center gap-2 shadow-sm hover:-translate-y-px active:translate-y-0 cursor-pointer"
        >
          {loading === "fund" ? <><Spinner /> Sending...</> : "Fund Contract"}
        </button>
        <p className="text-xs text-gray-400 mt-3">ETH accumulates in the contract when users buy GC. Fund it so sell operations work.</p>
      </Section>

      {/* WITHDRAW */}
      <Section title="Withdraw ETH" desc="Withdraw accumulated ETH from the contract to your wallet">
        <div className="flex items-center gap-4 p-4 bg-gray-50 border border-gray-100 rounded-xl mb-4">
          <div className="flex-1">
            <p className="text-xs text-gray-500 mb-0.5">Contract ETH Balance</p>
            <p className="text-2xl font-extrabold text-gray-900">{contractEthBalance ?? "0"} <span className="text-sm font-normal text-gray-400">ETH</span></p>
          </div>
          <button
            onClick={onWithdraw}
            disabled={loading === "withdraw" || parseFloat(contractEthBalance ?? 0) === 0}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl text-sm font-bold transition-all flex items-center gap-2 shadow-sm hover:-translate-y-px active:translate-y-0"
          >
            {loading === "withdraw" ? <><Spinner /> Withdrawing...</> : "Withdraw All ETH"}
          </button>
        </div>
      </Section>

    </div>
  );
}
