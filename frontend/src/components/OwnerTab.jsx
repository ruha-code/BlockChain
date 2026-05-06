import { useState } from "react";
import { Spinner } from "./BuyTab";

export default function OwnerTab({ rates, isOwner, onUpdateRates, loading }) {
  const [newSell, setNewSell] = useState("");
  const [newBuy, setNewBuy] = useState("");

  if (!isOwner) {
    return (
      <div className="max-w-lg">
        <div className="bg-white rounded-2xl border border-red-100 shadow-sm p-8 text-center">
          <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </div>
          <h3 className="text-base font-semibold text-gray-900 mb-2">Access Denied</h3>
          <p className="text-sm text-gray-500">Only the contract owner can access the admin panel.</p>
        </div>
      </div>
    );
  }

  const isValid = parseFloat(newSell) > 0 && parseFloat(newBuy) > 0;

  return (
    <div className="max-w-2xl space-y-5 animate-fade-up">
      {/* Admin badge */}
      <div className="flex items-center gap-3 p-4 bg-amber-50 border border-amber-200 rounded-2xl">
        <div className="w-9 h-9 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
        </div>
        <div>
          <p className="text-sm font-semibold text-amber-900">Admin Access</p>
          <p className="text-xs text-amber-700">You are the contract owner. Changes are permanent on-chain.</p>
        </div>
        <span className="ml-auto text-xs font-bold bg-amber-200 text-amber-800 px-2.5 py-1 rounded-full">OWNER</span>
      </div>

      {/* Current rates */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h3 className="text-sm font-semibold text-gray-900 mb-4">Current Exchange Rates</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl">
            <p className="text-xs text-emerald-600 font-medium mb-1">Buy Rate (Users Pay)</p>
            <p className="text-2xl font-extrabold text-emerald-700">{rates.sell}</p>
            <p className="text-xs text-emerald-500 mt-0.5">ETH per GC token</p>
          </div>
          <div className="p-4 bg-red-50 border border-red-100 rounded-xl">
            <p className="text-xs text-red-500 font-medium mb-1">Sell Rate (Users Receive)</p>
            <p className="text-2xl font-extrabold text-red-600">{rates.buy}</p>
            <p className="text-xs text-red-400 mt-0.5">ETH per GC token</p>
          </div>
        </div>
      </div>

      {/* Update rates form */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h3 className="text-sm font-semibold text-gray-900 mb-1">Update Rates</h3>
        <p className="text-xs text-gray-400 mb-5">Set new exchange rates for GC token trading</p>

        <div className="grid grid-cols-2 gap-4 mb-5">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">
              New Buy Rate <span className="text-gray-400">(ETH/GC)</span>
            </label>
            <input
              type="number"
              step="0.0001"
              placeholder={rates.sell}
              value={newSell}
              onChange={(e) => setNewSell(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
            />
            <p className="text-[11px] text-gray-400 mt-1">Price users pay per GC</p>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">
              New Sell Rate <span className="text-gray-400">(ETH/GC)</span>
            </label>
            <input
              type="number"
              step="0.0001"
              placeholder={rates.buy}
              value={newBuy}
              onChange={(e) => setNewBuy(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
            />
            <p className="text-[11px] text-gray-400 mt-1">Price users receive per GC</p>
          </div>
        </div>

        {/* Security note */}
        <div className="flex items-start gap-3 p-3.5 bg-blue-50 border border-blue-100 rounded-xl mb-5">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1d4ed8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 mt-0.5">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
          <div>
            <p className="text-xs font-semibold text-blue-900">Security Notice</p>
            <p className="text-xs text-blue-700 mt-0.5">Only the contract owner can update rates. This action writes to the blockchain and requires gas.</p>
          </div>
        </div>

        <button
          onClick={() => isValid && onUpdateRates(newSell, newBuy)}
          disabled={loading || !isValid}
          className="px-6 py-3 bg-gray-900 hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl text-sm font-bold transition-all flex items-center gap-2 shadow-sm hover:-translate-y-px active:translate-y-0"
        >
          {loading ? <><Spinner /> Updating...</> : "Update Rates"}
        </button>
      </div>
    </div>
  );
}
