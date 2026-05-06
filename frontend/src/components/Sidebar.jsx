const NAV_ITEMS = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: <><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></>,
  },
  {
    id: "buy",
    label: "Buy GC",
    icon: <><path d="M12 5v14M5 12l7 7 7-7" /></>,
  },
  {
    id: "sell",
    label: "Sell GC",
    icon: <><path d="M12 19V5M5 12l7-7 7 7" /></>,
  },
  {
    id: "transfer",
    label: "Transfer",
    icon: <><path d="M5 12h14M14 6l6 6-6 6" /></>,
  },
  {
    id: "transactions",
    label: "Transactions",
    icon: <><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" /><rect x="9" y="3" width="6" height="4" rx="1" /><path d="M9 12h6M9 16h4" /></>,
  },
  {
    id: "profile",
    label: "Profile",
    icon: <><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></>,
  },
];

function NavItem({ item, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 text-left group ${
        active
          ? "bg-emerald-600 text-white shadow-sm shadow-emerald-600/20"
          : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
      }`}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
        {item.icon}
      </svg>
      {item.label}
    </button>
  );
}

export default function Sidebar({ activeTab, setActiveTab, isOwner, onDisconnect, txCount }) {
  return (
    <aside className="w-[240px] bg-white border-r border-gray-100 flex flex-col py-5 fixed h-screen z-[100]">
      {/* Logo */}
      <div className="px-5 mb-8">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-bold text-gray-900 leading-none">Gym Coin</p>
            <p className="text-[10px] text-gray-400 mt-0.5">Token System</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto">
        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider px-3 mb-2">Main</p>
        {NAV_ITEMS.map((item) => (
          <NavItem
            key={item.id}
            item={item}
            active={activeTab === item.id}
            onClick={() => setActiveTab(item.id)}
          />
        ))}

        {isOwner && (
          <>
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider px-3 mt-5 mb-2">Admin</p>
            <NavItem
              item={{
                id: "treasury",
                label: "Treasury",
                icon: <><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" /><line x1="12" y1="12" x2="12" y2="16" /><line x1="10" y1="14" x2="14" y2="14" /></>,
              }}
              active={activeTab === "treasury"}
              onClick={() => setActiveTab("treasury")}
            />
            <NavItem
              item={{
                id: "owner",
                label: "Admin Panel",
                icon: <><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" /><circle cx="12" cy="12" r="3" /></>,
              }}
              active={activeTab === "owner"}
              onClick={() => setActiveTab("owner")}
            />
          </>
        )}
      </nav>

      {/* Bottom */}
      <div className="px-3 pt-4 border-t border-gray-100">
        <div className="flex items-center gap-2.5 px-3 py-2.5 mb-2">
          <div className="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
            </svg>
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-gray-900 truncate">ruslan_gym</p>
            <p className="text-[10px] text-gray-400">{txCount} transactions</p>
          </div>
        </div>
        <button
          onClick={onDisconnect}
          className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm text-red-500 hover:bg-red-50 transition-colors font-medium"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
          </svg>
          Disconnect
        </button>
      </div>
    </aside>
  );
}
