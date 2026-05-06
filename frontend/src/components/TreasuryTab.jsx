import { SEPOLIA_EXPLORER, GYM_COIN_ADDRESS } from "../constants";

export default function TreasuryTab({ balance, ethBalance, txHistory, rates }) {
  const totalBought = txHistory.filter((t) => t.type === "buy").reduce((s, t) => s + parseFloat(t.ethAmount), 0);
  const totalSold = txHistory.filter((t) => t.type === "sell").reduce((s, t) => s + parseFloat(t.ethAmount), 0);
  const buyCount = txHistory.filter((t) => t.type === "buy").length;
  const sellCount = txHistory.filter((t) => t.type === "sell").length;

  const recentActivity = txHistory.slice(0, 8);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-900 to-blue-800 rounded-2xl p-7 text-white relative overflow-hidden">
        <div className="absolute right-0 top-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/4 translate-x-1/4" />
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xs font-semibold bg-white/20 px-3 py-1 rounded-full">Treasury Overview</span>
        </div>
        <div className="grid grid-cols-4 gap-6 relative">
          {[
            { label: "Contract Balance", value: `${parseFloat(balance).toFixed(2)} GC`, sub: "Owner holdings" },
            { label: "ETH Treasury", value: `${ethBalance} ETH`, sub: "Available liquidity" },
            { label: "Buy Volume", value: `${totalBought.toFixed(4)} ETH`, sub: `${buyCount} purchases` },
            { label: "Sell Volume", value: `${totalSold.toFixed(4)} ETH`, sub: `${sellCount} sales` },
          ].map(({ label, value, sub }) => (
            <div key={label}>
              <p className="text-blue-200 text-xs mb-1">{label}</p>
              <p className="text-xl font-bold">{value}</p>
              <p className="text-blue-300 text-xs mt-0.5">{sub}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-4 gap-4">
        {[
          {
            label: "Buy Rate",
            value: `${rates.sell} ETH`,
            sub: "per GC token",
            icon: <path d="M12 5v14M5 12l7 7 7-7" />,
            color: { bg: "bg-emerald-50", border: "border-emerald-100", stroke: "#059669", text: "text-emerald-700" },
          },
          {
            label: "Sell Rate",
            value: `${rates.buy} ETH`,
            sub: "per GC token",
            icon: <path d="M12 19V5M5 12l7-7 7 7" />,
            color: { bg: "bg-red-50", border: "border-red-100", stroke: "#dc2626", text: "text-red-700" },
          },
          {
            label: "Total Transactions",
            value: txHistory.length,
            sub: "all time",
            icon: <><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" /><rect x="9" y="3" width="6" height="4" rx="1" /></>,
            color: { bg: "bg-blue-50", border: "border-blue-100", stroke: "#1d4ed8", text: "text-blue-700" },
          },
          {
            label: "Net Flow",
            value: `${(totalBought - totalSold).toFixed(4)} ETH`,
            sub: "in treasury",
            icon: <><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></>,
            color: { bg: "bg-violet-50", border: "border-violet-100", stroke: "#7c3aed", text: "text-violet-700" },
          },
        ].map(({ label, value, sub, icon, color }) => (
          <div key={label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className={`w-9 h-9 ${color.bg} border ${color.border} rounded-xl flex items-center justify-center mb-4`}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color.stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                {icon}
              </svg>
            </div>
            <p className="text-xs text-gray-400 mb-1">{label}</p>
            <p className={`text-lg font-bold ${color.text}`}>{value}</p>
            <p className="text-xs text-gray-400 mt-0.5">{sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-5">
        {/* Activity table */}
        <div className="col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-50 flex justify-between items-center">
            <h3 className="text-sm font-semibold text-gray-900">Treasury Activity</h3>
            <a
              href={`${SEPOLIA_EXPLORER}/address/${GYM_COIN_ADDRESS}`}
              target="_blank"
              rel="noreferrer"
              className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
            >
              View Contract
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" />
              </svg>
            </a>
          </div>
          {recentActivity.length === 0 ? (
            <div className="py-12 text-center text-sm text-gray-400">No activity yet</div>
          ) : (
            <div className="divide-y divide-gray-50">
              {recentActivity.map((tx, i) => (
                <div key={i} className="flex items-center gap-4 px-6 py-3.5 hover:bg-gray-50/50 transition-colors">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    tx.type === "buy" ? "bg-emerald-50" : tx.type === "sell" ? "bg-red-50" : "bg-blue-50"
                  }`}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                      stroke={tx.type === "buy" ? "#059669" : tx.type === "sell" ? "#dc2626" : "#1d4ed8"}
                      strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      {tx.type === "buy" ? <path d="M12 5v14M5 12l7 7 7-7" /> :
                       tx.type === "sell" ? <path d="M12 19V5M5 12l7-7 7 7" /> :
                       <path d="M5 12h14M14 6l6 6-6 6" />}
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-700 capitalize">{tx.type} · {parseFloat(tx.gcAmount).toFixed(2)} GC</p>
                    <p className="text-xs text-gray-400">{tx.timestamp}</p>
                  </div>
                  {(tx.type === "buy" || tx.type === "sell") && (
                    <span className={`text-sm font-bold ${tx.type === "buy" ? "text-emerald-600" : "text-red-500"}`}>
                      {tx.type === "buy" ? "+" : "-"}{parseFloat(tx.ethAmount).toFixed(5)} ETH
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Statistics */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Statistics</p>
            <div className="space-y-4">
              {[
                { label: "Buy Transactions", value: buyCount, pct: txHistory.length ? Math.round(buyCount / txHistory.length * 100) : 0, color: "bg-emerald-500" },
                { label: "Sell Transactions", value: sellCount, pct: txHistory.length ? Math.round(sellCount / txHistory.length * 100) : 0, color: "bg-red-400" },
                { label: "Transfers", value: txHistory.filter(t => t.type === "transfer").length, pct: txHistory.length ? Math.round(txHistory.filter(t => t.type === "transfer").length / txHistory.length * 100) : 0, color: "bg-blue-500" },
              ].map(({ label, value, pct, color }) => (
                <div key={label}>
                  <div className="flex justify-between mb-1.5">
                    <span className="text-xs text-gray-500">{label}</span>
                    <span className="text-xs font-bold text-gray-700">{value}</span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full ${color} rounded-full transition-all`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Contract</p>
            <p className="text-[11px] text-gray-500 font-mono break-all leading-relaxed">{GYM_COIN_ADDRESS}</p>
            <div className="mt-3 pt-3 border-t border-gray-50">
              <p className="text-xs text-gray-400">Network: <span className="font-semibold text-gray-600">Sepolia Testnet</span></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
