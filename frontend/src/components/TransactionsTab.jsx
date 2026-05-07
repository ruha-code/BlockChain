import { useState } from "react";
import { SEPOLIA_EXPLORER } from "../constants";

const FILTERS = ["All", "Buy", "Sell", "Transfer", "Received"];

const TYPE_CONFIG = {
  buy:      { badge: "bg-emerald-50 text-emerald-700 border-emerald-100", icon: <path d="M12 5v14M5 12l7 7 7-7" />, stroke: "#059669", bg: "bg-emerald-50", positive: true },
  sell:     { badge: "bg-red-50 text-red-600 border-red-100",             icon: <path d="M12 19V5M5 12l7-7 7 7" />, stroke: "#ef4444", bg: "bg-red-50",     positive: false },
  transfer: { badge: "bg-blue-50 text-blue-700 border-blue-100",          icon: <path d="M5 12h14M14 6l6 6-6 6" />, stroke: "#2563eb", bg: "bg-blue-50",    positive: false },
  received: { badge: "bg-violet-50 text-violet-700 border-violet-100",    icon: <path d="M12 5v14M5 12l7 7 7-7" />, stroke: "#7c3aed", bg: "bg-violet-50",  positive: true },
};

const FILTER_ACCENT = {
  All:      "bg-gray-900 text-white",
  Buy:      "bg-emerald-600 text-white",
  Sell:     "bg-red-500 text-white",
  Transfer: "bg-blue-600 text-white",
  Received: "bg-violet-600 text-white",
};

function shortAddr(a) { return a ? `${a.slice(0, 6)}…${a.slice(-4)}` : ""; }

export default function TransactionsTab({ txHistory }) {
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");

  const filtered = txHistory.filter((tx) => {
    const matchesFilter = filter === "All" || tx.type === filter.toLowerCase();
    const matchesSearch = !search ||
      tx.txHash?.toLowerCase().includes(search.toLowerCase()) ||
      tx.to?.toLowerCase().includes(search.toLowerCase()) ||
      tx.from?.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const counts = FILTERS.reduce((acc, f) => {
    acc[f] = f === "All" ? txHistory.length : txHistory.filter(tx => tx.type === f.toLowerCase()).length;
    return acc;
  }, {});

  return (
    <div className="max-w-5xl animate-fade-up space-y-5">

      {/* ── Header ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-50 border border-gray-100 rounded-xl flex items-center justify-center">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" /><rect x="9" y="3" width="6" height="4" rx="1" /><path d="M9 12h6M9 16h4" />
              </svg>
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900">Transaction History</h2>
              <p className="text-xs text-gray-400 mt-0.5">{txHistory.length} total on-chain transactions</p>
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
            </svg>
            <input
              type="text"
              placeholder="Search by hash or address…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 w-64 transition-all cursor-text"
            />
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-4 gap-3 mt-5">
          {[
            { label: "Total",    value: txHistory.length,                                    color: "gray"    },
            { label: "Buys",     value: txHistory.filter(t => t.type === "buy").length,      color: "emerald" },
            { label: "Sells",    value: txHistory.filter(t => t.type === "sell").length,     color: "red"     },
            { label: "Transfers",value: txHistory.filter(t => t.type === "transfer" || t.type === "received").length, color: "blue" },
          ].map(({ label, value, color }) => {
            const cls = {
              gray:    "bg-gray-50 border-gray-100 text-gray-600",
              emerald: "bg-emerald-50 border-emerald-100 text-emerald-700",
              red:     "bg-red-50 border-red-100 text-red-600",
              blue:    "bg-blue-50 border-blue-100 text-blue-700",
            }[color];
            return (
              <div key={label} className={`rounded-xl border px-4 py-3 ${cls}`}>
                <p className="text-[10px] font-bold uppercase tracking-wider opacity-70 mb-1">{label}</p>
                <p className="text-2xl font-extrabold leading-none">{value}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Table card ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Filter pills */}
        <div className="px-5 py-3.5 border-b border-gray-50 flex items-center gap-2 flex-wrap">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                filter === f
                  ? FILTER_ACCENT[f]
                  : "text-gray-500 hover:bg-gray-100 hover:text-gray-700"
              }`}
            >
              {f}
              {counts[f] > 0 && (
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                  filter === f ? "bg-white/20 text-white" : "bg-gray-100 text-gray-500"
                }`}>
                  {counts[f]}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        {filtered.length === 0 ? (
          <div className="py-20 flex flex-col items-center">
            <div className="relative mb-5">
              <div className="w-16 h-16 bg-gray-50 border border-gray-100 rounded-2xl flex items-center justify-center">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" /><rect x="9" y="3" width="6" height="4" rx="1" /><path d="M9 12h6M9 16h4" />
                </svg>
              </div>
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-gray-200 rounded-full" />
              <span className="absolute -bottom-0.5 -left-1 w-2 h-2 bg-gray-200 rounded-full" />
            </div>
            <p className="text-sm font-bold text-gray-600 mb-1">No transactions found</p>
            <p className="text-xs text-gray-400">
              {search ? "Try a different search term" : filter !== "All" ? `No ${filter.toLowerCase()} transactions yet` : "Your on-chain activity will appear here"}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-50 bg-gray-50/50">
                  {["Type", "Amount", "ETH Value", "Details", "Date", "Status", "Explorer"].map((h) => (
                    <th key={h} className="px-5 py-3 text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((tx, i) => {
                  const cfg = TYPE_CONFIG[tx.type] || TYPE_CONFIG.buy;
                  return (
                    <tr key={i} className="hover:bg-gray-50/60 transition-colors group">
                      {/* Type */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2.5">
                          <div className={`w-7 h-7 rounded-lg ${cfg.bg} flex items-center justify-center flex-shrink-0`}>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={cfg.stroke} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                              {cfg.icon}
                            </svg>
                          </div>
                          <span className={`text-xs font-bold px-2.5 py-1 rounded-lg border ${cfg.badge}`}>
                            {tx.type.charAt(0).toUpperCase() + tx.type.slice(1)}
                          </span>
                        </div>
                      </td>
                      {/* Amount */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        <span className={`text-sm font-extrabold ${cfg.positive ? "text-emerald-600" : "text-red-500"}`}>
                          {cfg.positive ? "+" : "−"}{parseFloat(tx.gcAmount).toFixed(2)} GC
                        </span>
                      </td>
                      {/* ETH Value */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        <span className="text-xs text-gray-500 font-medium">
                          {(tx.type === "buy" || tx.type === "sell") ? `${parseFloat(tx.ethAmount).toFixed(6)} ETH` : "—"}
                        </span>
                      </td>
                      {/* Details */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        <span className="text-xs text-gray-400 font-mono">
                          {tx.type === "transfer" && `→ ${shortAddr(tx.to)}`}
                          {tx.type === "received"  && `← ${shortAddr(tx.from)}`}
                          {(tx.type === "buy" || tx.type === "sell") && "Contract"}
                        </span>
                      </td>
                      {/* Date */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        <span className="text-xs text-gray-400">{tx.timestamp}</span>
                      </td>
                      {/* Status */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-lg text-xs font-bold">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          Success
                        </div>
                      </td>
                      {/* Explorer */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        {tx.txHash ? (
                          <a
                            href={`${SEPOLIA_EXPLORER}/tx/${tx.txHash}`}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-700 font-mono font-medium group/link"
                          >
                            {tx.txHash.slice(0, 6)}…{tx.txHash.slice(-4)}
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover/link:translate-x-px group-hover/link:-translate-y-px transition-transform">
                              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" />
                            </svg>
                          </a>
                        ) : (
                          <span className="text-xs text-gray-300">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* Footer */}
            <div className="px-5 py-3.5 border-t border-gray-50 flex items-center justify-between">
              <p className="text-xs text-gray-400">
                Showing <span className="font-semibold text-gray-600">{filtered.length}</span> of <span className="font-semibold text-gray-600">{txHistory.length}</span> transactions
              </p>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span className="text-xs text-gray-400">Sepolia Testnet</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
