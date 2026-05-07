import { useState } from "react";

export function Spinner({ className = "w-4 h-4" }) {
  return (
    <svg className={`animate-spin ${className}`} viewBox="0 0 24 24" fill="none">
      <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-80" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
    </svg>
  );
}

export function PrimaryButton({ onClick, disabled, loading, children, color = "emerald" }) {
  const colors = {
    emerald: "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20 focus:ring-emerald-500/30",
    red:     "bg-red-500 hover:bg-red-600 shadow-red-500/20 focus:ring-red-500/30",
    blue:    "bg-blue-600 hover:bg-blue-700 shadow-blue-600/20 focus:ring-blue-500/30",
  };
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`w-full py-4 rounded-xl text-sm font-bold text-white transition-all flex items-center justify-center gap-2 shadow-md focus:outline-none focus:ring-3 disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none disabled:translate-y-0 hover:-translate-y-px active:translate-y-0 cursor-pointer ${colors[color]}`}
    >
      {loading ? <><Spinner /> Processing…</> : children}
    </button>
  );
}

const QUICK = [10, 50, 100, 250, 500];

const STEPS = [
  "Enter the amount of GC you want to purchase",
  "Review the ETH cost and network fee",
  "Click Buy and confirm in MetaMask",
];

export default function BuyTab({ rates, balance, ethBalance, limits, onBuy, loading }) {
  const [amount, setAmount] = useState("");
  const [selected, setSelected] = useState(null);

  const gcInt   = Math.max(0, Math.floor(Number(amount) || 0));
  const ethCost = gcInt > 0 ? gcInt * parseFloat(rates.sell) : 0;
  const fee     = 0.0001;
  const total   = ethCost + fee;

  const pick = (n) => {
    setAmount(n.toString());
    setSelected(n);
  };

  const handleChange = (e) => {
    setAmount(e.target.value);
    setSelected(null);
  };

  return (
    <div className="max-w-5xl animate-fade-up">
      <div className="grid grid-cols-5 gap-5">

        {/* ── Left: Form ── */}
        <div className="col-span-3 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {/* Header */}
          <div className="px-6 pt-6 pb-5 border-b border-gray-50">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 5v14M5 12l7 7 7-7" />
                </svg>
              </div>
              <div>
                <h2 className="text-base font-bold text-gray-900">Buy Gym Coin</h2>
                <p className="text-xs text-gray-400 mt-0.5">Exchange ETH for GC tokens on Sepolia Testnet</p>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-4">
            {/* You Get */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-gray-600">You Get</label>
                <span className="text-[11px] text-gray-400">
                  Balance: <span className="font-semibold text-gray-600">{parseFloat(balance).toFixed(2)} GC</span>
                </span>
              </div>
              <div className="relative">
                <input
                  type="number"
                  value={amount}
                  onChange={handleChange}
                  placeholder="0"
                  min="1"
                  step="1"
                  className="w-full px-4 py-3.5 bg-white border border-gray-200 rounded-xl text-xl font-bold pr-20 transition-all placeholder:font-normal placeholder:text-gray-300 focus:outline-none hover:border-gray-300 focus:border-emerald-500 focus:ring-3 focus:ring-emerald-500/10 text-gray-900 cursor-text"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 bg-emerald-50 border border-emerald-100 rounded-lg px-2.5 py-1">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                  </svg>
                  <span className="text-xs font-bold text-emerald-700">GC</span>
                </div>
              </div>

              {/* Quick-select pills */}
              <div className="flex gap-2 mt-2.5 flex-wrap">
                {QUICK.map((n) => (
                  <button
                    key={n}
                    onClick={() => pick(n)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer hover:-translate-y-px ${
                      selected === n
                        ? "bg-emerald-600 text-white border-emerald-600 shadow-sm shadow-emerald-600/20"
                        : "bg-white text-gray-500 border-gray-200 hover:border-emerald-300 hover:text-emerald-600"
                    }`}
                  >
                    {n} GC
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

            {/* You Pay */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-gray-600">You Pay</label>
                <span className="text-[11px] text-gray-400">
                  Balance: <span className="font-semibold text-gray-600">{parseFloat(ethBalance || 0).toFixed(4)} ETH</span>
                </span>
              </div>
              <div className="relative">
                <input
                  type="text"
                  value={gcInt > 0 ? ethCost.toFixed(6) : ""}
                  readOnly
                  placeholder="0.000000"
                  className="w-full px-4 py-3.5 bg-gray-50 border border-gray-100 rounded-xl text-xl font-bold text-gray-500 pr-20 cursor-default placeholder:font-normal placeholder:text-gray-300"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 bg-blue-50 border border-blue-100 rounded-lg px-2.5 py-1">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" /><path d="M3 7v13h18v-5" /><path d="M18 12a2 2 0 0 0 0 4h4v-4z" />
                  </svg>
                  <span className="text-xs font-bold text-blue-700">ETH</span>
                </div>
              </div>
            </div>

            {/* Exchange Rate pill */}
            <div className="flex items-center justify-between px-4 py-3 bg-emerald-50 border border-emerald-100 rounded-xl">
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700">
                <div className="w-6 h-6 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                  </svg>
                </div>
                Exchange Rate
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-emerald-700">1 GC = {rates.sell} ETH</span>
                {/* Mini wave chart */}
                <svg width="48" height="20" viewBox="0 0 48 20" fill="none">
                  <polyline points="0,14 8,10 16,13 24,6 32,11 40,8 48,10" stroke="#059669" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.5" />
                </svg>
              </div>
            </div>
          </div>

          {/* Transaction Summary */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 space-y-2.5">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Transaction Summary</p>
            {[
              { label: "Amount",              value: `${gcInt > 0 ? gcInt.toLocaleString() : "0"} GC` },
              { label: "Cost",                value: `${ethCost.toFixed(4)} ETH` },
              { label: "Network Fee (est.)",  value: `~${fee} ETH` },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between">
                <span className="text-xs text-gray-400">{label}</span>
                <span className="text-xs font-semibold text-gray-600">{value}</span>
              </div>
            ))}
            <div className="h-px bg-gray-200 my-1" />
            <div className="flex justify-between">
              <span className="text-xs font-bold text-gray-700">Total</span>
              <span className="text-xs font-extrabold text-emerald-600">
                {gcInt > 0 ? `${total.toFixed(4)} ETH` : "0.0000 ETH"}
              </span>
            </div>
          </div>

          {/* CTA */}
          <div className="px-6 py-5 space-y-3">
            <PrimaryButton
              onClick={() => gcInt > 0 && onBuy(gcInt.toString())}
              disabled={gcInt <= 0}
              loading={loading}
              color="emerald"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 5v14M5 12l7 7 7-7" />
              </svg>
              Buy GC
            </PrimaryButton>
            <div className="flex items-center justify-center gap-1.5">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <span className="text-[11px] text-gray-400">Secure transaction via MetaMask</span>
            </div>
            {limits?.maxBuy && limits.maxBuy !== "0" && (
              <p className="text-[11px] text-gray-400 text-center">Max per transaction: <span className="font-semibold text-gray-600">{limits.maxBuy} GC</span></p>
            )}
          </div>
        </div>

        {/* ── Right: Info panel ── */}
        <div className="col-span-2 space-y-4">

          {/* How it works */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">How it works</p>
            <div className="space-y-4">
              {STEPS.map((text, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-600 text-white text-[11px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                    {i + 1}
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed">{text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Current Rate */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Current Rate</p>
            <div className="text-center py-2">
              <p className="text-4xl font-extrabold text-emerald-600">{rates.sell}</p>
              <p className="text-xs text-gray-400 mt-1">ETH per 1 GC token</p>
            </div>
            <div className="h-px bg-gray-100 my-3" />
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">Your Balance</span>
                <span className="font-bold text-gray-700">{parseFloat(balance).toFixed(2)} GC</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">Your ETH Balance</span>
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
                  Minimum purchase is <span className="font-bold">1 GC</span>. Make sure you have enough ETH to cover the gas fee.
                </p>
              </div>
            </div>
          </div>

          {/* Secure & Transparent */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>
              <div>
                <p className="text-xs font-bold text-gray-800 mb-0.5">Secure & Transparent</p>
                <p className="text-xs text-gray-400 leading-relaxed">All transactions are recorded on the Sepolia Testnet blockchain.</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
