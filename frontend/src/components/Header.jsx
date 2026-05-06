import { SEPOLIA_EXPLORER } from "../constants";

export default function Header({ account, ethBalance, activeTab }) {
  const PAGE_TITLES = {
    dashboard: "Dashboard",
    buy: "Buy GC",
    sell: "Sell GC",
    transfer: "Transfer GC",
    transactions: "Transaction History",
    profile: "Profile",
    treasury: "Treasury Overview",
    owner: "Admin Panel",
  };

  return (
    <header className="h-14 flex items-center justify-between px-8 bg-white border-b border-gray-100 sticky top-0 z-50">
      <div>
        <h1 className="text-sm font-semibold text-gray-900">{PAGE_TITLES[activeTab] || "Gym Coin"}</h1>
      </div>
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 border border-emerald-100 rounded-full text-xs font-medium text-emerald-700">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          Sepolia
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-full text-xs font-medium text-gray-600">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" /><path d="M3 7v13h18v-5" /><path d="M18 12a2 2 0 0 0 0 4h4v-4z" />
          </svg>
          {ethBalance} ETH
        </div>
        <a
          href={`${SEPOLIA_EXPLORER}/address/${account}`}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-full text-xs font-medium text-gray-600 hover:border-gray-300 transition-colors font-mono"
        >
          {account.slice(0, 6)}...{account.slice(-4)}
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" />
          </svg>
        </a>
      </div>
    </header>
  );
}
