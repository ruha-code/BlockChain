import { SEPOLIA_EXPLORER } from "../constants";

const PAGE_META = {
  dashboard:    { title: "Dashboard",          sub: "Overview of your GC activity" },
  buy:          { title: "Buy GC",             sub: "Exchange ETH for Gym Coin" },
  sell:         { title: "Sell GC",            sub: "Exchange Gym Coin for ETH" },
  transfer:     { title: "Transfer GC",        sub: "Send GC to any address" },
  transactions: { title: "Transaction History",sub: "All your on-chain activity" },
  profile:      { title: "Profile",            sub: "Your account details" },
  treasury:     { title: "Treasury",           sub: "Contract liquidity and stats" },
  owner:        { title: "Admin Panel",        sub: "Manage contract settings" },
  membership:   { title: "Membership",         sub: "Activate your gym membership" },
  leaderboard:  { title: "Leaderboard",        sub: "Top GC token holders" },
  market:       { title: "Market",             sub: "Live ETH price and GC rates" },
};

export default function Header({ account, ethBalance, activeTab, isPaused }) {
  const meta = PAGE_META[activeTab] || { title: "Gym Coin", sub: "" };

  return (
    <header className="h-14 flex items-center justify-between px-6 bg-white border-b border-gray-100 sticky top-0 z-50">
      {/* Left: page title */}
      <div className="flex items-center gap-3">
        <div>
          <p className="text-sm font-bold text-gray-900 leading-none">{meta.title}</p>
          {meta.sub && <p className="text-[11px] text-gray-400 mt-0.5">{meta.sub}</p>}
        </div>
      </div>

      {/* Right: pills */}
      <div className="flex items-center gap-2">
        {/* Paused badge */}
        {isPaused && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 border border-red-200 rounded-full text-xs font-bold text-red-600 animate-pulse">
            ⏸ Paused
          </div>
        )}
        {/* Network */}
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 border border-emerald-100 rounded-full text-xs font-semibold text-emerald-700">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          Sepolia
        </div>

        {/* ETH balance */}
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-full text-xs font-semibold text-gray-600">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" /><path d="M3 7v13h18v-5" /><path d="M18 12a2 2 0 0 0 0 4h4v-4z" />
          </svg>
          {ethBalance} ETH
        </div>

        {/* Wallet address */}
        <a
          href={`${SEPOLIA_EXPLORER}/address/${account}`}
          target="_blank"
          rel="noreferrer"
          title="View on Etherscan"
          className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-full text-xs font-semibold text-gray-600 hover:border-gray-300 hover:bg-gray-100 transition-all font-mono"
        >
          {account.slice(0, 6)}…{account.slice(-4)}
          <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-50">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" />
          </svg>
        </a>
      </div>
    </header>
  );
}
