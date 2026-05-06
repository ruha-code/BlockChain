import { useState } from "react";
import { SEPOLIA_EXPLORER } from "../constants";

const FILTERS = ["All", "Buy", "Sell", "Transfer", "Received"];

const TYPE_BADGE = {
  buy: "bg-emerald-50 text-emerald-700 border-emerald-100",
  sell: "bg-red-50 text-red-700 border-red-100",
  transfer: "bg-blue-50 text-blue-700 border-blue-100",
  received: "bg-purple-50 text-purple-700 border-purple-100",
};
const TYPE_LABEL = { buy: "Buy", sell: "Sell", transfer: "Transfer", received: "Received" };

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

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-base font-semibold text-gray-900">Transaction History</h2>
          <p className="text-sm text-gray-400 mt-0.5">{txHistory.length} total transactions</p>
        </div>
        {/* Search */}
        <div className="relative">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3 top-1/2 -translate-y-1/2">
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
          </svg>
          <input
            type="text"
            placeholder="Search by hash or address..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 w-64 transition-all"
          />
        </div>
      </div>

      {/* Filters */}
      <div className="px-6 py-3 border-b border-gray-50 flex gap-1">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filter === f
                ? "bg-gray-900 text-white"
                : "text-gray-500 hover:bg-gray-100 hover:text-gray-700"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="py-16 text-center">
          <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" /><rect x="9" y="3" width="6" height="4" rx="1" />
            </svg>
          </div>
          <p className="text-sm font-medium text-gray-500">No transactions found</p>
          <p className="text-xs text-gray-400 mt-1">Try a different filter or search term</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-50">
                {["Type", "Amount (GC)", "ETH Value", "Details", "Date", "Status", "Tx Hash"].map((h) => (
                  <th key={h} className="px-5 py-3.5 text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((tx, i) => (
                <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-5 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold border ${TYPE_BADGE[tx.type]}`}>
                      {TYPE_LABEL[tx.type]}
                    </span>
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap">
                    <span className={`text-sm font-bold ${tx.type === "buy" || tx.type === "received" ? "text-emerald-600" : "text-red-500"}`}>
                      {tx.type === "buy" || tx.type === "received" ? "+" : "-"}
                      {parseFloat(tx.gcAmount).toFixed(4)}
                    </span>
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-500">
                    {(tx.type === "buy" || tx.type === "sell") ? `${parseFloat(tx.ethAmount).toFixed(6)} ETH` : "—"}
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap text-xs text-gray-400 font-mono">
                    {tx.type === "transfer" && `→ ${shortAddr(tx.to)}`}
                    {tx.type === "received" && `← ${shortAddr(tx.from)}`}
                    {(tx.type === "buy" || tx.type === "sell") && "Contract"}
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap text-xs text-gray-400">{tx.timestamp}</td>
                  <td className="px-5 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-lg text-xs font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      Success
                    </span>
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap">
                    {tx.txHash ? (
                      <a
                        href={`${SEPOLIA_EXPLORER}/tx/${tx.txHash}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 font-mono font-medium"
                      >
                        {tx.txHash.slice(0, 8)}…{tx.txHash.slice(-6)}
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" />
                        </svg>
                      </a>
                    ) : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
