import { useState } from "react";
import { Spinner } from "./BuyTab";

export default function SellTab({ rates, balance, onSell, loading }) {
  const [amount, setAmount] = useState("");
  const maxGc = Math.floor(parseFloat(balance));
  const gcInt = Math.min(Math.max(0, Math.floor(Number(amount) || 0)), maxGc);
  const ethReceive = gcInt > 0 ? gcInt * parseFloat(rates.buy) : 0;
  const networkFee = 0.0001;

  return (
    <div className="max-w-xl">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-50">
          <h2 className="text-base font-semibold text-gray-900">Sell Gym Coin</h2>
          <p className="text-sm text-gray-500 mt-0.5">Exchange GC tokens for ETH on Sepolia</p>
        </div>

        <div className="p-6 space-y-4">
          {/* Amount */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-medium text-gray-500">Amount in GC</label>
              <button
                onClick={() => setAmount(maxGc.toString())}
                className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
              >
                MAX {maxGc} GC
              </button>
            </div>
            <div className="relative">
              <input
                type="number"
                placeholder="100"
                min="1"
                max={maxGc}
                step="1"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-4 py-3.5 bg-white border border-gray-200 rounded-xl text-gray-900 text-base font-semibold placeholder:text-gray-300 placeholder:font-normal focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-400 transition-all pr-14"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-gray-400">GC</span>
            </div>
            {Number(amount) > maxGc && (
              <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                Exceeds available balance
              </p>
            )}
          </div>

          {/* You receive */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">You Receive (ETH)</label>
            <div className="relative">
              <input
                type="text"
                value={gcInt > 0 ? ethReceive.toFixed(6) : ""}
                readOnly
                placeholder="0.000000"
                className="w-full px-4 py-3.5 bg-gray-50 border border-gray-100 rounded-xl text-gray-700 text-base font-semibold placeholder:text-gray-300 placeholder:font-normal cursor-default pr-14"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-gray-400">ETH</span>
            </div>
          </div>

          {/* Rate */}
          <div className="flex items-center justify-between px-4 py-3 bg-red-50 border border-red-100 rounded-xl">
            <div className="flex items-center gap-2 text-xs text-red-600 font-medium">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
              Exchange Rate
            </div>
            <span className="text-xs font-bold text-red-600">1 GC = {rates.buy} ETH</span>
          </div>

          {/* Warning */}
          <div className="flex items-start gap-3 px-4 py-3 bg-amber-50 border border-amber-100 rounded-xl">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 mt-0.5">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
            <p className="text-xs text-amber-700">Minimum sell amount: <span className="font-bold">1 GC</span>. Contract must have sufficient ETH liquidity.</p>
          </div>
        </div>

        {/* Summary */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 space-y-2">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Transaction Summary</p>
          {[
            { label: "You Sell", value: `${gcInt > 0 ? gcInt : "—"} GC` },
            { label: "You Receive", value: gcInt > 0 ? `${ethReceive.toFixed(6)} ETH` : "—" },
            { label: "Network Fee (est.)", value: `~${networkFee} ETH` },
            { label: "Net Received", value: gcInt > 0 ? `${(ethReceive - networkFee).toFixed(6)} ETH` : "—", bold: true },
          ].map(({ label, value, bold }) => (
            <div key={label} className="flex justify-between items-center">
              <span className="text-xs text-gray-400">{label}</span>
              <span className={`text-xs ${bold ? "font-bold text-gray-900" : "font-medium text-gray-600"}`}>{value}</span>
            </div>
          ))}
        </div>

        <div className="px-6 pb-6 pt-4">
          <button
            onClick={() => gcInt > 0 && onSell(gcInt.toString())}
            disabled={loading || gcInt <= 0 || Number(amount) > maxGc}
            className="w-full py-3.5 bg-red-500 hover:bg-red-600 disabled:bg-gray-100 disabled:cursor-not-allowed text-white disabled:text-gray-400 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 shadow-sm shadow-red-500/20"
          >
            {loading ? <><Spinner /> Processing...</> : "Sell GC"}
          </button>
        </div>
      </div>
    </div>
  );
}
