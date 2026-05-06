import { useState } from "react";
import { ethers } from "ethers";
import { Spinner } from "./BuyTab";

export default function TransferTab({ balance, account, onTransfer, loading }) {
  const [to, setTo] = useState("");
  const [amount, setAmount] = useState("");

  const isValidAddress = to.startsWith("0x") && to.length === 42 && ethers.isAddress(to);
  const numAmount = parseFloat(amount) || 0;
  const maxGc = parseFloat(balance);
  const isValid = isValidAddress && numAmount > 0 && numAmount <= maxGc;
  const networkFee = 0.0001;

  const handleTransfer = () => {
    if (!isValid) return;
    onTransfer(to, amount);
    setTo("");
    setAmount("");
  };

  const shortAddr = (a) => a ? `${a.slice(0, 6)}…${a.slice(-4)}` : "";

  return (
    <div className="max-w-xl">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-50">
          <h2 className="text-base font-semibold text-gray-900">Transfer Gym Coin</h2>
          <p className="text-sm text-gray-500 mt-0.5">Send GC tokens to any Ethereum address</p>
        </div>

        <div className="p-6 space-y-4">
          {/* Wallet preview */}
          {(isValidAddress || amount) && (
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
              <div className="flex-1 text-center">
                <p className="text-[10px] text-gray-400 mb-1">From</p>
                <p className="text-xs font-mono font-semibold text-gray-700">{shortAddr(account)}</p>
              </div>
              <div className="flex items-center gap-1 text-gray-300">
                <div className="w-8 h-px bg-gray-200" />
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M14 6l6 6-6 6" />
                </svg>
                <div className="w-8 h-px bg-gray-200" />
              </div>
              <div className="flex-1 text-center">
                <p className="text-[10px] text-gray-400 mb-1">To</p>
                <p className="text-xs font-mono font-semibold text-gray-700">{isValidAddress ? shortAddr(to) : "..."}</p>
              </div>
            </div>
          )}

          {/* Recipient */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">Recipient Address</label>
            <input
              type="text"
              placeholder="0x..."
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className={`w-full px-4 py-3.5 bg-white border rounded-xl text-gray-900 text-sm font-mono placeholder:text-gray-300 placeholder:font-sans focus:outline-none focus:ring-2 transition-all ${
                to && !isValidAddress
                  ? "border-red-300 focus:ring-red-500/20 focus:border-red-400"
                  : isValidAddress
                  ? "border-emerald-300 focus:ring-emerald-500/20 focus:border-emerald-400"
                  : "border-gray-200 focus:ring-blue-500/20 focus:border-blue-400"
              }`}
            />
            {to && !isValidAddress && (
              <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                Invalid Ethereum address
              </p>
            )}
            {isValidAddress && (
              <p className="text-xs text-emerald-600 mt-1.5 flex items-center gap-1">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
                </svg>
                Valid address
              </p>
            )}
          </div>

          {/* Amount */}
          <div>
            <div className="flex justify-between mb-1.5">
              <label className="text-xs font-medium text-gray-500">Amount in GC</label>
              <span className="text-xs text-gray-400">Available: <span className="font-semibold text-gray-600">{parseFloat(balance).toFixed(2)} GC</span></span>
            </div>
            <div className="relative">
              <input
                type="number"
                placeholder="0.00"
                min="0.000001"
                step="any"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-4 py-3.5 bg-white border border-gray-200 rounded-xl text-gray-900 text-base font-semibold placeholder:text-gray-300 placeholder:font-normal focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all pr-14"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-gray-400">GC</span>
            </div>
            {numAmount > maxGc && (
              <p className="text-xs text-red-500 mt-1.5">Amount exceeds available balance</p>
            )}
          </div>
        </div>

        {/* Summary */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 space-y-2">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Transfer Summary</p>
          {[
            { label: "Amount", value: numAmount > 0 ? `${numAmount} GC` : "—" },
            { label: "Recipient", value: isValidAddress ? shortAddr(to) : "—" },
            { label: "Network Fee (est.)", value: `~${networkFee} ETH` },
          ].map(({ label, value }) => (
            <div key={label} className="flex justify-between items-center">
              <span className="text-xs text-gray-400">{label}</span>
              <span className="text-xs font-medium text-gray-600 font-mono">{value}</span>
            </div>
          ))}
        </div>

        <div className="px-6 pb-6 pt-4">
          <button
            onClick={handleTransfer}
            disabled={loading || !isValid}
            className="w-full py-3.5 bg-blue-800 hover:bg-blue-900 disabled:bg-gray-100 disabled:cursor-not-allowed text-white disabled:text-gray-400 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 shadow-sm"
          >
            {loading ? <><Spinner /> Processing...</> : "Transfer GC"}
          </button>
        </div>
      </div>
    </div>
  );
}
