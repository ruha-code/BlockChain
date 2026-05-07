import { useState } from "react";
import { PrimaryButton } from "./BuyTab";

const QUICK = [100, 500, 1000, 5000, 10000];

const STEPS = [
  "Enter how many GC tokens you want to sell",
  "Review the ETH you will receive after fees",
  "Click Sell and confirm in MetaMask",
];

export default function SellTab({ rates, balance, ethBalance, limits, onSell, loading }) {
  const [amount, setAmount]   = useState("");
  const [selected, setSelected] = useState(null);

  const maxGc        = Math.floor(parseFloat(balance));
  const gcInt        = Math.max(0, Math.floor(Number(amount) || 0));
  const ethReceive   = gcInt > 0 ? gcInt * parseFloat(rates.buy) : 0;
  const fee          = 0.0001;
  const netReceive   = Math.max(0, ethReceive - fee);
  const overMax      = gcInt > maxGc && gcInt > 0;
  const exceedsLimit = gcInt > parseInt(limits?.maxSell || 0) && gcInt > 0;

  const pick = (n) => { setAmount(n.toString()); setSelected(n); };
  const handleChange = (e) => { setAmount(e.target.value); setSelected(null); };

  return (
    <div className="max-w-5xl animate-fade-up">
      <div className="grid grid-cols-5 gap-5">

        {/* ── Left: Form ── */}
        <div className="col-span-3 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {/* Header */}
          <div className="px-6 pt-6 pb-5 border-b border-gray-50">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-red-50 border border-red-100 rounded-xl flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 19V5M5 12l7-7 7 7" />
                </svg>
              </div>
              <div>
                <h2 className="text-base font-bold text-gray-900">Sell Gym Coin</h2>
                <p className="text-xs text-gray-400 mt-0.5">Exchange GC tokens for ETH on Sepolia Testnet</p>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-4">
            {/* You Sell */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-gray-600">You Sell</label>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-gray-400">
                    Balance: <span className="font-semibold text-gray-600">{parseFloat(balance).toFixed(2)} GC</span>
                  </span>
                  <button
                    onClick={() => pick(maxGc)}
                    className="text-[10px] font-bold text-red-600 bg-red-50 border border-red-200 px-2 py-0.5 rounded-md hover:bg-red-100 transition-colors cursor-pointer"
                  >
                    MAX
                  </button>
                </div>
              </div>
              <div className="relative">
                <input
                  type="number"
                  value={amount}
                  onChange={handleChange}
                  placeholder="0"
                  min="1"
                  max={maxGc}
                  step="1"
                  className={`w-full px-4 py-3.5 border rounded-xl text-xl font-bold pr-20 transition-all placeholder:font-normal placeholder:text-gray-300 focus:outline-none cursor-text ${
                    overMax
                      ? "border-red-300 bg-red-50/30 focus:border-red-400 focus:ring-3 focus:ring-red-500/10"
                      : "bg-white border-gray-200 text-gray-900 hover:border-gray-300 focus:border-red-400 focus:ring-3 focus:ring-red-500/10"
                  }`}
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 bg-emerald-50 border border-emerald-100 rounded-lg px-2.5 py-1">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                  </svg>
                  <span className="text-xs font-bold text-emerald-700">GC</span>
                </div>
              </div>
              {overMax && (
                <p className="flex items-center gap-1.5 text-xs text-red-500 font-medium mt-1.5">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  Exceeds available balance ({maxGc.toLocaleString()} GC)
                </p>
              )}
              {exceedsLimit && !overMax && (
                <p className="flex items-center gap-1.5 text-xs text-amber-600 font-medium mt-1.5">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
                  </svg>
                  Exceeds max sell limit ({limits?.maxSell} GC per transaction)
                </p>
              )}

              {/* Quick-select pills */}
              <div className="flex gap-2 mt-2.5 flex-wrap">
                {QUICK.map((n) => (
                  <button
                    key={n}
                    onClick={() => pick(n)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer hover:-translate-y-px ${
                      selected === n
                        ? "bg-red-500 text-white border-red-500 shadow-sm shadow-red-500/20"
                        : "bg-white text-gray-500 border-gray-200 hover:border-red-300 hover:text-red-500"
                    }`}
                  >
                    {n.toLocaleString()} GC
                  </button>
                ))}
              </div>
            </div>

            {/* Arrow */}
            <div className="flex justify-center">
              <div className="w-8 h-8 bg-gray-50 border border-gray-200 rounded-full flex items-center justify-center">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 5v14M5 12l7 7 7-7" />
                </svg>
              </div>
            </div>

            {/* You Receive */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-gray-600">You Receive (est.)</label>
                <span className="text-[11px] text-gray-400">
                  Balance: <span className="font-semibold text-gray-600">{parseFloat(ethBalance || 0).toFixed(4)} ETH</span>
                </span>
              </div>
              <div className="relative">
                <input
                  type="text"
                  value={gcInt > 0 ? ethReceive.toFixed(6) : ""}
                  readOnly
                  placeholder="0.000000"
                  className="w-full px-4 py-3.5 bg-gray-50 border border-gray-100 rounded-xl text-xl font-bold text-gray-500 pr-24 cursor-default placeholder:font-normal placeholder:text-gray-300"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 bg-blue-50 border border-blue-100 rounded-lg px-2.5 py-1">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" /><path d="M3 7v13h18v-5" /><path d="M18 12a2 2 0 0 0 0 4h4v-4z" />
                  </svg>
                  <span className="text-xs font-bold text-blue-700">ETH</span>
                </div>
              </div>
            </div>

            {/* Sell Rate pill */}
            <div className="flex items-center justify-between px-4 py-3 bg-red-50 border border-red-100 rounded-xl">
              <div className="flex items-center gap-2 text-xs font-semibold text-red-600">
                <div className="w-6 h-6 bg-red-100 rounded-lg flex items-center justify-center">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                  </svg>
                </div>
                Sell Rate
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-red-600">1 GC = {rates.buy} ETH</span>
                <svg width="48" height="20" viewBox="0 0 48 20" fill="none">
                  <polyline points="0,8 8,13 16,10 24,15 32,11 40,14 48,12" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.5" />
                </svg>
              </div>
            </div>
          </div>

          {/* Transaction Summary */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 space-y-2.5">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Transaction Summary</p>
            {[
              { label: "You Sell",           value: `${gcInt > 0 ? gcInt.toLocaleString() : "0"} GC` },
              { label: "You Receive (est.)", value: `${ethReceive.toFixed(4)} ETH` },
              { label: "Network Fee (est.)", value: `~${fee} ETH` },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between">
                <span className="text-xs text-gray-400">{label}</span>
                <span className="text-xs font-semibold text-gray-600">{value}</span>
              </div>
            ))}
            <div className="h-px bg-gray-200 my-1" />
            <div className="flex justify-between">
              <span className="text-xs font-bold text-gray-700">Net Received</span>
              <span className="text-xs font-extrabold text-gray-900">
                {gcInt > 0 ? `${netReceive.toFixed(4)} ETH` : "0.0000 ETH"}
              </span>
            </div>
          </div>

          {/* CTA */}
          <div className="px-6 py-5 space-y-3">
            <PrimaryButton
              onClick={() => !overMax && !exceedsLimit && gcInt > 0 && onSell(gcInt.toString())}
              disabled={gcInt <= 0 || overMax || exceedsLimit}
              loading={loading}
              color="red"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 19V5M5 12l7-7 7 7" />
              </svg>
              Sell GC
            </PrimaryButton>
            <div className="flex items-center justify-center gap-1.5">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <span className="text-[11px] text-gray-400">Secure transaction via MetaMask</span>
            </div>
          </div>
        </div>

        {/* ── Right: Info panel ── */}
        <div className="col-span-2 space-y-4">

          {/* How it works */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <p className="text-sm font-bold text-gray-900 mb-4">How it works</p>
            <div className="space-y-4">
              {STEPS.map((text, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-red-500 text-white text-[11px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                    {i + 1}
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed">{text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Current Rate */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center gap-1.5 mb-4">
              <p className="text-sm font-bold text-gray-900">Current Rate</p>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
            <div className="text-center py-2">
              <p className="text-4xl font-extrabold text-red-500">{rates.buy}</p>
              <p className="text-xs text-gray-400 mt-1">ETH per 1 GC token</p>
            </div>
            <div className="h-px bg-gray-100 my-3" />
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">Available to sell</span>
                <span className="font-bold text-gray-700">{maxGc.toLocaleString()}.00 GC</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">Your ETH balance</span>
                <span className="font-bold text-gray-700">{parseFloat(ethBalance || 0).toFixed(4)} ETH</span>
              </div>
            </div>
          </div>

          {/* Warning */}
          <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5">
            <div className="flex items-start gap-2.5">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 mt-0.5">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
              <div>
                <p className="text-xs font-bold text-amber-800 mb-1">Important</p>
                <p className="text-xs text-amber-700 leading-relaxed">
                  Minimum sell is <span className="font-bold">1 GC</span>.<br />Contract must have sufficient ETH liquidity.
                </p>
              </div>
            </div>
          </div>

          {/* Secure & Transparent */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>
              <p className="text-sm font-bold text-gray-900">Secure & Transparent</p>
            </div>
            <div className="space-y-2.5">
              {[
                "All transactions are recorded on Sepolia Testnet",
                "Your funds are never held by us",
                "Powered by smart contracts",
              ].map((item) => (
                <div key={item} className="flex items-center gap-2.5">
                  <div className="w-4 h-4 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                    <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <span className="text-xs text-gray-500">{item}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
