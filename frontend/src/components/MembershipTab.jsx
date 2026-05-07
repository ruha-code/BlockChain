import { Spinner } from "./BuyTab";

const PERKS = [
  {
    icon: <><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></>,
    color: "emerald",
    title: "Priority Access",
    desc: "Access all gym locations across the network anytime",
  },
  {
    icon: <><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></>,
    color: "blue",
    title: "Secure Identity",
    desc: "Your membership is stored on-chain and cannot be faked",
  },
  {
    icon: <><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></>,
    color: "violet",
    title: "Auto-Renewal",
    desc: "Renew at any time — duration stacks on top of current expiry",
  },
  {
    icon: <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></>,
    color: "amber",
    title: "Network Access",
    desc: "Valid at any location in the Gym Coin partner network",
  },
];

const COLOR_MAP = {
  emerald: { bg: "bg-emerald-50", border: "border-emerald-100", stroke: "#059669", text: "text-emerald-700" },
  blue:    { bg: "bg-blue-50",    border: "border-blue-100",    stroke: "#2563eb", text: "text-blue-700" },
  violet:  { bg: "bg-violet-50",  border: "border-violet-100",  stroke: "#7c3aed", text: "text-violet-700" },
  amber:   { bg: "bg-amber-50",   border: "border-amber-100",   stroke: "#d97706", text: "text-amber-700" },
};

function fmtExpiry(ts) {
  const n = Number(ts);
  if (!n) return null;
  const d = new Date(n * 1000);
  return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

function fmtDuration(sec) {
  const n = Number(sec);
  if (!n) return "—";
  const days = Math.round(n / 86400);
  return days >= 30 ? `${Math.round(days / 30)} month${days >= 60 ? "s" : ""}` : `${days} day${days !== 1 ? "s" : ""}`;
}

function daysLeft(ts) {
  const n = Number(ts);
  if (!n) return 0;
  return Math.max(0, Math.ceil((n - Date.now() / 1000) / 86400));
}

export default function MembershipTab({
  balance, isMember, membershipExpiry, membershipConfig, onBuyMembership, loading,
}) {
  const price    = Number(membershipConfig?.price    ?? 0);
  const duration = Number(membershipConfig?.duration ?? 0);
  const expiry   = fmtExpiry(membershipExpiry);
  const left     = daysLeft(membershipExpiry);
  const canAfford = parseFloat(balance) >= price;
  const configured = duration > 0;

  return (
    <div className="max-w-4xl space-y-6 animate-fade-up">

      {/* Hero / status card */}
      <div className={`relative rounded-2xl p-6 overflow-hidden ${isMember ? "bg-gradient-to-br from-violet-600 to-violet-800" : "bg-gradient-to-br from-gray-700 to-gray-900"}`}>
        {/* BG decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white/5 -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-white/5 translate-y-1/2 -translate-x-1/3" />

        <div className="relative flex items-start justify-between gap-4">
          <div>
            {isMember ? (
              <>
                <div className="flex items-center gap-2 mb-2">
                  <span className="flex items-center gap-1.5 px-2.5 py-1 bg-white/20 rounded-full text-[11px] font-bold text-white">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                    ACTIVE MEMBER
                  </span>
                </div>
                <h2 className="text-2xl font-extrabold text-white mb-1">Gym Anywhere</h2>
                <p className="text-violet-200 text-sm mb-4">Your membership is active and verified on-chain</p>
                <div className="flex items-center gap-4">
                  <div>
                    <p className="text-xs text-violet-300 mb-0.5">Expires</p>
                    <p className="text-sm font-bold text-white">{expiry}</p>
                  </div>
                  <div className="w-px h-8 bg-white/20" />
                  <div>
                    <p className="text-xs text-violet-300 mb-0.5">Days left</p>
                    <p className="text-sm font-bold text-white">{left} days</p>
                  </div>
                  <div className="w-px h-8 bg-white/20" />
                  <div>
                    <p className="text-xs text-violet-300 mb-0.5">Your balance</p>
                    <p className="text-sm font-bold text-white">{parseFloat(balance).toFixed(2)} GC</p>
                  </div>
                </div>
              </>
            ) : (
              <>
                <h2 className="text-2xl font-extrabold text-white mb-1">Gym Anywhere</h2>
                <p className="text-gray-300 text-sm mb-4">Activate your on-chain membership to access all gym locations</p>
                <div className="flex items-center gap-4">
                  <div>
                    <p className="text-xs text-gray-400 mb-0.5">Your balance</p>
                    <p className="text-sm font-bold text-white">{parseFloat(balance).toFixed(2)} GC</p>
                  </div>
                  <div className="w-px h-8 bg-white/20" />
                  <div>
                    <p className="text-xs text-gray-400 mb-0.5">Status</p>
                    <p className="text-sm font-bold text-gray-300">Not a member</p>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Big icon */}
          <div className={`w-20 h-20 rounded-2xl flex items-center justify-center flex-shrink-0 ${isMember ? "bg-white/20" : "bg-white/10"}`}>
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              {isMember && <polyline points="9 12 11 14 15 10"/>}
            </svg>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-5">

        {/* Left: buy card */}
        <div className="col-span-3 space-y-4">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-1">
              {isMember ? "Extend Membership" : "Activate Membership"}
            </h3>
            <p className="text-xs text-gray-400 mb-5">
              {isMember
                ? "Renew now — the new period stacks on top of your current expiry"
                : "Pay with GC tokens to activate your on-chain gym membership"}
            </p>

            {!configured ? (
              <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl text-center">
                <p className="text-sm font-semibold text-amber-700">Membership not configured</p>
                <p className="text-xs text-amber-600 mt-1">The admin hasn't set up membership pricing yet.</p>
              </div>
            ) : (
              <>
                {/* Pricing summary */}
                <div className="flex items-center justify-between p-4 bg-gray-50 border border-gray-100 rounded-xl mb-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-0.5">Price</p>
                    <p className="text-xl font-extrabold text-gray-900">{price} <span className="text-sm font-normal text-gray-400">GC</span></p>
                  </div>
                  <div className="w-px h-10 bg-gray-200" />
                  <div>
                    <p className="text-xs text-gray-500 mb-0.5">Duration</p>
                    <p className="text-xl font-extrabold text-gray-900">{fmtDuration(duration)}</p>
                  </div>
                  <div className="w-px h-10 bg-gray-200" />
                  <div>
                    <p className="text-xs text-gray-500 mb-0.5">Your balance</p>
                    <p className={`text-xl font-extrabold ${canAfford ? "text-emerald-600" : "text-red-500"}`}>{parseFloat(balance).toFixed(2)} GC</p>
                  </div>
                </div>

                {!canAfford && (
                  <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-100 rounded-xl mb-4">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
                      <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                    </svg>
                    <p className="text-xs text-red-600 font-medium">Insufficient GC balance. You need {price - parseFloat(balance).toFixed(0)} more GC.</p>
                  </div>
                )}

                <button
                  onClick={onBuyMembership}
                  disabled={loading || !canAfford}
                  className="w-full flex items-center justify-center gap-2 py-3.5 bg-violet-600 hover:bg-violet-700 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl text-sm font-bold transition-all shadow-sm shadow-violet-600/20 hover:-translate-y-px active:translate-y-0"
                >
                  {loading ? (
                    <><Spinner /> Processing…</>
                  ) : (
                    <>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                      </svg>
                      {isMember ? `Extend for ${price} GC` : `Activate for ${price} GC`}
                    </>
                  )}
                </button>

                <p className="text-xs text-gray-400 text-center mt-3 flex items-center justify-center gap-1.5">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                  </svg>
                  Secured via MetaMask — stored permanently on Sepolia
                </p>
              </>
            )}
          </div>
        </div>

        {/* Right: perks */}
        <div className="col-span-2 space-y-3">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">Member Benefits</h3>
          {PERKS.map(({ icon, color, title, desc }) => {
            const c = COLOR_MAP[color];
            return (
              <div key={title} className={`flex items-start gap-3 p-3.5 ${c.bg} border ${c.border} rounded-xl`}>
                <div className={`w-8 h-8 ${c.bg} border ${c.border} rounded-lg flex items-center justify-center flex-shrink-0`}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={c.stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{icon}</svg>
                </div>
                <div>
                  <p className={`text-xs font-bold ${c.text}`}>{title}</p>
                  <p className="text-[11px] text-gray-500 mt-0.5 leading-relaxed">{desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
