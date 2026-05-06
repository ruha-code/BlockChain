import { SEPOLIA_EXPLORER } from "../constants";
import ProfileForm from "./ProfileForm";

const TYPE_BADGE = {
  buy: "bg-emerald-50 text-emerald-700 border-emerald-100",
  sell: "bg-red-50 text-red-700 border-red-100",
  transfer: "bg-blue-50 text-blue-700 border-blue-100",
  received: "bg-purple-50 text-purple-700 border-purple-100",
};
const TYPE_LABEL = { buy: "Buy", sell: "Sell", transfer: "Sent", received: "Received" };

function shortAddr(a) { return a ? `${a.slice(0, 6)}…${a.slice(-4)}` : ""; }

export default function Dashboard({
  account, balance, ethBalance, username, email,
  isRegistered, txHistory, txCount, rates, loadingAction, onRegister,
}) {
  const recentTx = txHistory.slice(0, 6);

  return (
    <div className="space-y-6">
      {/* Greeting + hero */}
      <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-2xl p-8 text-white relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
        <div className="absolute right-20 bottom-0 w-32 h-32 bg-white/5 rounded-full translate-y-1/2" />
        <p className="text-emerald-100 text-sm font-medium mb-1">Welcome back,</p>
        <h2 className="text-3xl font-bold mb-6 relative">{isRegistered ? username : "User"}</h2>
        <div className="flex items-end gap-8 relative">
          <div>
            <p className="text-emerald-200 text-xs uppercase tracking-wider mb-1">GC Balance</p>
            <p className="text-5xl font-extrabold tracking-tight">{parseFloat(balance).toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
            <p className="text-emerald-200 text-sm mt-1">Gym Coins</p>
          </div>
          <div className="h-12 w-px bg-white/20" />
          <div>
            <p className="text-emerald-200 text-xs uppercase tracking-wider mb-1">ETH Balance</p>
            <p className="text-2xl font-bold">{ethBalance}</p>
            <p className="text-emerald-200 text-sm mt-1">Sepolia ETH</p>
          </div>
          <div className="h-12 w-px bg-white/20" />
          <div>
            <p className="text-emerald-200 text-xs uppercase tracking-wider mb-1">Transactions</p>
            <p className="text-2xl font-bold">{txCount}</p>
            <p className="text-emerald-200 text-sm mt-1">Total</p>
          </div>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-4 gap-4">
        <SummaryCard
          label="GC Balance"
          value={`${parseFloat(balance).toFixed(2)} GC`}
          icon={<path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />}
          color="emerald"
        />
        <SummaryCard
          label="ETH Balance"
          value={`${ethBalance} ETH`}
          icon={<><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" /><path d="M3 7v13h18v-5" /><path d="M18 12a2 2 0 0 0 0 4h4v-4z" /></>}
          color="blue"
        />
        <SummaryCard
          label="Transactions"
          value={txCount}
          icon={<><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" /><rect x="9" y="3" width="6" height="4" rx="1" /></>}
          color="violet"
        />
        <SummaryCard
          label="Membership"
          value={isRegistered ? "Active" : "Inactive"}
          icon={<><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></>}
          color={isRegistered ? "emerald" : "gray"}
        />
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Main content */}
        <div className="col-span-2 space-y-5">
          {/* Register prompt */}
          {!isRegistered && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">Complete your profile</p>
                  <p className="text-xs text-gray-500">Register to unlock all features</p>
                </div>
              </div>
              <ProfileForm
                onSubmit={onRegister}
                loading={loadingAction === "register"}
                submitLabel="Register Profile"
              />
            </div>
          )}

          {/* Recent activity */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-50">
              <h3 className="text-sm font-semibold text-gray-900">Recent Activity</h3>
              <span className="text-xs text-gray-400">{recentTx.length} transactions</span>
            </div>
            {recentTx.length === 0 ? (
              <div className="py-12 text-center">
                <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" /><rect x="9" y="3" width="6" height="4" rx="1" />
                  </svg>
                </div>
                <p className="text-sm text-gray-500">No transactions yet</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {recentTx.map((tx, i) => (
                  <div key={i} className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50/50 transition-colors">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      tx.type === "buy" || tx.type === "received" ? "bg-emerald-50" : "bg-red-50"
                    }`}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={tx.type === "buy" || tx.type === "received" ? "#059669" : "#dc2626"} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        {tx.type === "buy" || tx.type === "received"
                          ? <path d="M12 5v14M5 12l7 7 7-7" />
                          : <path d="M12 19V5M5 12l7-7 7 7" />
                        }
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-md border ${TYPE_BADGE[tx.type]}`}>
                          {TYPE_LABEL[tx.type]}
                        </span>
                        {tx.type === "transfer" && <span className="text-xs text-gray-400">to {shortAddr(tx.to)}</span>}
                        {tx.type === "received" && <span className="text-xs text-gray-400">from {shortAddr(tx.from)}</span>}
                      </div>
                      <p className="text-xs text-gray-400 mt-0.5">{tx.timestamp}</p>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-bold ${tx.type === "buy" || tx.type === "received" ? "text-emerald-600" : "text-red-500"}`}>
                        {tx.type === "buy" || tx.type === "received" ? "+" : "-"}{parseFloat(tx.gcAmount).toFixed(2)} GC
                      </p>
                      {(tx.type === "buy" || tx.type === "sell") && (
                        <p className="text-xs text-gray-400">{parseFloat(tx.ethAmount).toFixed(5)} ETH</p>
                      )}
                    </div>
                    {tx.txHash && (
                      <a href={`${SEPOLIA_EXPLORER}/tx/${tx.txHash}`} target="_blank" rel="noreferrer"
                        className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" />
                        </svg>
                      </a>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right widgets */}
        <div className="space-y-4">
          {/* Market rates */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Market Rates</p>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                <div>
                  <p className="text-xs text-emerald-600 font-medium">Buy Rate</p>
                  <p className="text-lg font-bold text-emerald-700">{parseFloat(rates.sell).toFixed(4)}</p>
                  <p className="text-xs text-emerald-500">ETH per GC</p>
                </div>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 5v14M5 12l7 7 7-7" />
                </svg>
              </div>
              <div className="flex justify-between items-center p-3 bg-red-50 rounded-xl border border-red-100">
                <div>
                  <p className="text-xs text-red-500 font-medium">Sell Rate</p>
                  <p className="text-lg font-bold text-red-600">{parseFloat(rates.buy).toFixed(4)}</p>
                  <p className="text-xs text-red-400">ETH per GC</p>
                </div>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 19V5M5 12l7-7 7 7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Network info */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Network</p>
            <div className="space-y-2.5">
              {[
                { label: "Network", value: "Sepolia Testnet" },
                { label: "Wallet", value: shortAddr(account) },
                { label: "Status", value: "Connected" },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between items-center">
                  <span className="text-xs text-gray-400">{label}</span>
                  <span className={`text-xs font-semibold ${value === "Connected" ? "text-emerald-600" : "text-gray-700"}`}>{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Wallet */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Wallet</p>
            <p className="text-[11px] text-gray-500 font-mono break-all leading-relaxed">{account}</p>
            <a
              href={`${SEPOLIA_EXPLORER}/address/${account}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 mt-3 text-xs text-blue-600 hover:text-blue-700 font-medium"
            >
              View on Etherscan
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

function SummaryCard({ label, value, icon, color }) {
  const colors = {
    emerald: { bg: "bg-emerald-50", border: "border-emerald-100", icon: "#059669" },
    blue: { bg: "bg-blue-50", border: "border-blue-100", icon: "#1d4ed8" },
    violet: { bg: "bg-violet-50", border: "border-violet-100", icon: "#7c3aed" },
    gray: { bg: "bg-gray-50", border: "border-gray-100", icon: "#9ca3af" },
  };
  const c = colors[color] || colors.gray;
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      <div className={`w-9 h-9 rounded-xl ${c.bg} border ${c.border} flex items-center justify-center mb-4`}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={c.icon} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          {icon}
        </svg>
      </div>
      <p className="text-xs text-gray-400 font-medium mb-1">{label}</p>
      <p className="text-lg font-bold text-gray-900 leading-none">{value}</p>
    </div>
  );
}
