const NAV_ITEMS = [
  {
    id: "dashboard", label: "Dashboard",
    icon: <><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></>,
  },
  { id: "buy",      label: "Buy GC",       accent: "emerald", icon: <><path d="M12 5v14"/><path d="M5 12l7 7 7-7"/></> },
  { id: "sell",     label: "Sell GC",      accent: "red",     icon: <><path d="M12 19V5"/><path d="M5 12l7-7 7 7"/></> },
  { id: "transfer", label: "Transfer",     accent: "blue",    icon: <><path d="M5 12h14"/><path d="M14 6l6 6-6 6"/></> },
  {
    id: "transactions", label: "Transactions",
    icon: <><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/><path d="M9 12h6M9 16h4"/></>,
  },
  {
    id: "leaderboard", label: "Leaderboard", accent: "amber",
    icon: <><path d="M8 6L3 12l5 6"/><path d="M16 6l5 6-5 6"/><path d="M12 3v18"/></>,
  },
  {
    id: "market", label: "Market", accent: "indigo",
    icon: <><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></>,
  },
  {
    id: "profile", label: "Profile",
    icon: <><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></>,
  },
];

const ADMIN_ITEMS = [
  {
    id: "treasury", label: "Treasury",
    icon: <><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/><line x1="12" y1="12" x2="12" y2="16"/><line x1="10" y1="14" x2="14" y2="14"/></>,
  },
  {
    id: "owner", label: "Admin Panel",
    icon: <><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></>,
  },
];

const ACCENT_HOVER = {
  emerald: "hover:text-emerald-600 hover:bg-emerald-50",
  red:     "hover:text-red-500 hover:bg-red-50",
  blue:    "hover:text-blue-600 hover:bg-blue-50",
  amber:   "hover:text-amber-600 hover:bg-amber-50",
  indigo:  "hover:text-indigo-600 hover:bg-indigo-50",
};

function NavItem({ item, active, onClick }) {
  const accentHover = item.accent ? ACCENT_HOVER[item.accent] : "hover:text-gray-800 hover:bg-gray-100";
  return (
    <button
      onClick={onClick}
      className={`relative w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 text-left group ${
        active
          ? "bg-emerald-600 text-white shadow-sm shadow-emerald-600/30"
          : `text-gray-400 ${accentHover}`
      }`}
    >
      {active && <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-white/50 rounded-full" />}
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        className={`flex-shrink-0 transition-transform duration-150 ${!active ? "group-hover:scale-110" : ""}`}>
        {item.icon}
      </svg>
      <span className="truncate flex-1">{item.label}</span>
      {!active && (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          className="ml-auto opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all duration-150 flex-shrink-0">
          <path d="M9 18l6-6-6-6" />
        </svg>
      )}
    </button>
  );
}

export default function Sidebar({
  activeTab, setActiveTab,
  isOwner,
  onDisconnect, txCount, username, isRegistered,
}) {
  return (
    <aside className="w-[220px] bg-white border-r border-gray-100 flex flex-col fixed h-screen z-[100]">

      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 h-14 border-b border-gray-100 flex-shrink-0">
        <div className="w-7 h-7 bg-emerald-600 rounded-lg flex items-center justify-center shadow-sm shadow-emerald-600/25">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
          </svg>
        </div>
        <div>
          <p className="text-[13px] font-bold text-gray-900 leading-none">Gym Coin</p>
          <p className="text-[10px] text-gray-400 mt-0.5">Token System</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
        <div>
          <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest px-3 mb-1.5">Main</p>
          <div className="space-y-0.5">
            {NAV_ITEMS.map((item) => (
              <NavItem
                key={item.id}
                item={item}
                active={activeTab === item.id}
                onClick={() => setActiveTab(item.id)}
              />
            ))}
          </div>
        </div>

        {isOwner && (
          <div>
            <p className="text-[10px] font-bold text-amber-400 uppercase tracking-widest px-3 mb-1.5 flex items-center gap-1.5">
              <svg width="8" height="8" viewBox="0 0 24 24" fill="#f59e0b" stroke="none">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              Admin
            </p>
            <div className="space-y-0.5">
              {ADMIN_ITEMS.map((item) => (
                <NavItem
                  key={item.id}
                  item={item}
                  active={activeTab === item.id}
                  onClick={() => setActiveTab(item.id)}
                />
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* User section */}
      <div className="px-3 py-3 border-t border-gray-100 flex-shrink-0 space-y-1">
        <button
          onClick={() => setActiveTab("profile")}
          className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-all duration-150 group text-left"
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform duration-150">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="white" stroke="none">
              <path d="M12 12c2.761 0 5-2.239 5-5s-2.239-5-5-5-5 2.239-5 5 2.239 5 5 5zm0 2c-3.33 0-10 1.68-10 5v2h20v-2c0-3.32-6.67-5-10-5z"/>
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-gray-900 truncate leading-none mb-0.5">{username || "Anonymous"}</p>
            <div className="flex items-center gap-1.5">
              <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${isRegistered ? "bg-emerald-500" : "bg-gray-300"}`} />
              <p className="text-[10px] text-gray-400 truncate">{txCount} transactions</p>
            </div>
          </div>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 group-hover:stroke-gray-500 group-hover:translate-x-0.5 transition-all duration-150">
            <path d="M9 18l6-6-6-6"/>
          </svg>
        </button>

        <button
          onClick={onDisconnect}
          className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-gray-400 hover:bg-red-50 hover:text-red-500 transition-all duration-150 group"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 group-hover:translate-x-0.5 transition-transform duration-150">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>
          </svg>
          <span className="text-sm font-medium">Disconnect</span>
        </button>
      </div>
    </aside>
  );
}
