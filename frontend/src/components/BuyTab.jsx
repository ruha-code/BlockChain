import { useState } from "react";

export function Spinner() {
  return (
    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
    </svg>
  );
}

export default function BuyTab({ rates, balance, onBuy, loading }) {
  const [amount, setAmount] = useState("");
  const gcInt = Math.max(0, Math.floor(Number(amount) || 0));
  const ethCost = gcInt > 0 ? (gcInt * parseFloat(rates.sell)) : 0;
  const networkFee = 0.0001;

  return (
    <div className="max-w-xl">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-50">
          <h2 className="text-base font-semibold text-gray-900">Buy Gym Coin</h2>
          <p className="text-sm text-gray-500 mt-0.5">Exchange ETH for GC tokens on Sepolia</p>
        </div>

        <div className="p-6 space-y-4">
          {/* Amount input */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">Amount in GC</label>
            <div className="relative">
              <input
                type="number"
                placeholder="100"
                min="1"
                step="1"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-4 py-3.5 bg-white border border-gray-200 rounded-xl text-gray-900 text-base font-semibold placeholder:text-gray-300 placeholder:font-normal focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all pr-14"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-gray-400">GC</span>
            </div>
            <p className="text-xs text-gray-400 mt-1.5">Your balance: {parseFloat(balance).toFixed(2)} GC</p>
          </div>

          {/* You pay */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">You Pay (ETH)</label>
            <div className="relative">
              <input
                type="text"
                value={gcInt > 0 ? ethCost.toFixed(6) : ""}
                readOnly
                placeholder="0.000000"
                className="w-full px-4 py-3.5 bg-gray-50 border border-gray-100 rounded-xl text-gray-700 text-base font-semibold placeholder:text-gray-300 placeholder:font-normal cursor-default pr-14"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-gray-400">ETH</span>
            </div>
          </div>

          {/* Rate */}
          <div className="flex items-center justify-between px-4 py-3 bg-emerald-50 border border-emerald-100 rounded-xl">
            <div className="flex items-center gap-2 text-xs text-emerald-700 font-medium">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
              </svg>
              Exchange Rate
            </div>
            <span className="text-xs font-bold text-emerald-700">1 GC = {rates.sell} ETH</span>
          </div>

          {/* Success preview */}
          {gcInt > 0 && (
            <div className="flex items-center gap-3 px-4 py-3 bg-blue-50 border border-blue-100 rounded-xl">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1d4ed8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
              </svg>
              <p className="text-xs text-blue-700 font-medium">You will receive <span className="font-bold">{gcInt} GC</span></p>
            </div>
          )}
        </div>

        {/* Summary */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 space-y-2">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Transaction Summary</p>
          {[
            { label: "Amount", value: `${gcInt > 0 ? gcInt : "—"} GC` },
            { label: "Cost", value: gcInt > 0 ? `${ethCost.toFixed(6)} ETH` : "—" },
            { label: "Network Fee (est.)", value: `~${networkFee} ETH` },
            { label: "Total", value: gcInt > 0 ? `${(ethCost + networkFee).toFixed(6)} ETH` : "—", bold: true },
          ].map(({ label, value, bold }) => (
            <div key={label} className="flex justify-between items-center">
              <span className="text-xs text-gray-400">{label}</span>
              <span className={`text-xs ${bold ? "font-bold text-gray-900" : "font-medium text-gray-600"}`}>{value}</span>
            </div>
          ))}
        </div>

        <div className="px-6 pb-6 pt-4">
          <button
            onClick={() => gcInt > 0 && onBuy(gcInt.toString())}
            disabled={loading || gcInt <= 0}
            className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-100 disabled:cursor-not-allowed text-white disabled:text-gray-400 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 shadow-sm shadow-emerald-600/20"
          >
            {loading ? <><Spinner /> Processing...</> : "Buy GC"}
          </button>
        </div>
      </div>
    </div>
  );
}
