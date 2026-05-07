import { useState } from "react";
import { Spinner } from "./BuyTab";
import { PAUSER_ROLE, RATE_MANAGER_ROLE, BLACKLIST_MANAGER_ROLE, DEFAULT_ADMIN_ROLE } from "../hooks/useWallet";

const ROLES = [
  { hash: PAUSER_ROLE,            label: "Pauser",           color: "blue",   desc: "Can pause / unpause contract" },
  { hash: RATE_MANAGER_ROLE,      label: "Rate Manager",     color: "emerald",desc: "Can update exchange rates" },
  { hash: BLACKLIST_MANAGER_ROLE, label: "Blacklist Manager",color: "red",    desc: "Can blacklist addresses" },
  { hash: DEFAULT_ADMIN_ROLE,     label: "Admin",            color: "amber",  desc: "Full access — all roles" },
];

const ROLE_COLORS = {
  blue:    { badge: "bg-blue-100 text-blue-700",    dot: "bg-blue-500" },
  emerald: { badge: "bg-emerald-100 text-emerald-700", dot: "bg-emerald-500" },
  red:     { badge: "bg-red-100 text-red-600",      dot: "bg-red-500" },
  amber:   { badge: "bg-amber-100 text-amber-700",  dot: "bg-amber-500" },
};

function Section({ title, desc, children }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <h3 className="text-sm font-semibold text-gray-900 mb-0.5">{title}</h3>
      {desc && <p className="text-xs text-gray-400 mb-5">{desc}</p>}
      <div className={desc ? "" : "mt-4"}>{children}</div>
    </div>
  );
}

function FieldRow({ label, hint, children }) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-500 mb-1.5">{label}</label>
      {children}
      {hint && <p className="text-[11px] text-gray-400 mt-1">{hint}</p>}
    </div>
  );
}

export default function OwnerTab({
  rates, limits, membershipConfig, isPaused,
  isOwner, isPauser, isRateManager, isBlacklistManager,
  onUpdateRates, onUpdateLimits,
  onPause, onUnpause,
  onBlacklist, onUnblacklist,
  onUpdateMembership,
  onGrantRole, onRevokeRole,
  loading,
}) {
  const hasAnyRole = isOwner || isPauser || isRateManager || isBlacklistManager;

  // Rates form
  const [newSell, setNewSell] = useState("");
  const [newBuy,  setNewBuy]  = useState("");

  // Limits form
  const [newMaxBuy,  setNewMaxBuy]  = useState("");
  const [newMaxSell, setNewMaxSell] = useState("");

  // Membership form
  const [mPrice, setMPrice]     = useState("");
  const [mDays,  setMDays]      = useState("");

  // Blacklist form
  const [blAddr,  setBlAddr]    = useState("");
  const [unblAddr, setUnblAddr] = useState("");

  // Role form
  const [roleTarget, setRoleTarget] = useState("");
  const [roleSelected, setRoleSelected] = useState(PAUSER_ROLE);
  const [roleAction, setRoleAction]   = useState("grant");

  if (!hasAnyRole) {
    return (
      <div className="max-w-lg">
        <div className="bg-white rounded-2xl border border-red-100 shadow-sm p-8 text-center">
          <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
          </div>
          <h3 className="text-base font-semibold text-gray-900 mb-2">Access Denied</h3>
          <p className="text-sm text-gray-500">You don't have any admin roles on this contract.</p>
        </div>
      </div>
    );
  }

  const inputCls = "w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all";
  const btnCls   = (color = "gray") => `px-5 py-2.5 bg-${color}-900 hover:bg-${color}-800 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl text-sm font-bold transition-all flex items-center gap-2 shadow-sm hover:-translate-y-px active:translate-y-0`;

  return (
    <div className="max-w-3xl space-y-5 animate-fade-up">

      {/* Role badges */}
      <div className="flex flex-wrap items-center gap-2 p-4 bg-amber-50 border border-amber-200 rounded-2xl">
        <div className="w-9 h-9 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-amber-900">Your Roles</p>
          <p className="text-xs text-amber-700">You can only see sections allowed by your roles</p>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {isOwner         && <span className="text-xs font-bold bg-amber-200 text-amber-800 px-2.5 py-1 rounded-full">ADMIN</span>}
          {isPauser        && <span className="text-xs font-bold bg-blue-100 text-blue-700 px-2.5 py-1 rounded-full">PAUSER</span>}
          {isRateManager   && <span className="text-xs font-bold bg-emerald-100 text-emerald-700 px-2.5 py-1 rounded-full">RATE MANAGER</span>}
          {isBlacklistManager && <span className="text-xs font-bold bg-red-100 text-red-600 px-2.5 py-1 rounded-full">BLACKLIST MGR</span>}
        </div>
      </div>

      {/* ── PAUSE ─────────────────────────────────────────────────────────── */}
      {isPauser && (
        <Section title="Contract Status" desc="Pause all token operations in case of emergency">
          <div className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 bg-gray-50 mb-4">
            <div className={`w-3 h-3 rounded-full ${isPaused ? "bg-red-500 animate-pulse" : "bg-emerald-500"}`} />
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-900">{isPaused ? "Contract is Paused" : "Contract is Active"}</p>
              <p className="text-xs text-gray-500">{isPaused ? "All buy / sell / transfer operations are blocked" : "All operations are running normally"}</p>
            </div>
            <button
              onClick={isPaused ? onUnpause : onPause}
              disabled={loading === "pause"}
              className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 shadow-sm hover:-translate-y-px active:translate-y-0 disabled:opacity-40 disabled:cursor-not-allowed ${
                isPaused
                  ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                  : "bg-red-500 hover:bg-red-600 text-white"
              }`}
            >
              {loading === "pause" ? <><Spinner /> Working...</> : isPaused ? "▶ Unpause" : "⏸ Pause"}
            </button>
          </div>
          <div className="flex items-start gap-2.5 p-3 bg-amber-50 border border-amber-100 rounded-xl">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 mt-0.5">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
            <p className="text-xs text-amber-700">Pausing blocks <strong>all</strong> token movements including transfers between users.</p>
          </div>
        </Section>
      )}

      {/* ── RATES ─────────────────────────────────────────────────────────── */}
      {isRateManager && (
        <Section title="Exchange Rates" desc="Update the buy/sell rates for GC tokens">
          <div className="grid grid-cols-2 gap-3 mb-5">
            <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl">
              <p className="text-xs text-emerald-600 font-medium mb-1">Current Buy Rate</p>
              <p className="text-2xl font-extrabold text-emerald-700">{rates.sell}</p>
              <p className="text-xs text-emerald-500 mt-0.5">ETH per GC</p>
            </div>
            <div className="p-4 bg-red-50 border border-red-100 rounded-xl">
              <p className="text-xs text-red-500 font-medium mb-1">Current Sell Rate</p>
              <p className="text-2xl font-extrabold text-red-600">{rates.buy}</p>
              <p className="text-xs text-red-400 mt-0.5">ETH per GC</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 mb-4">
            <FieldRow label="New Buy Rate (ETH/GC)" hint="Price users pay per GC">
              <input type="number" step="0.0001" placeholder={rates.sell} value={newSell} onChange={(e) => setNewSell(e.target.value)} className={inputCls} />
            </FieldRow>
            <FieldRow label="New Sell Rate (ETH/GC)" hint="Price users receive per GC">
              <input type="number" step="0.0001" placeholder={rates.buy} value={newBuy} onChange={(e) => setNewBuy(e.target.value)} className={inputCls} />
            </FieldRow>
          </div>
          <button
            onClick={() => parseFloat(newSell) > 0 && parseFloat(newBuy) > 0 && onUpdateRates(newSell, newBuy)}
            disabled={loading === "rates" || !(parseFloat(newSell) > 0 && parseFloat(newBuy) > 0)}
            className="px-5 py-2.5 bg-gray-900 hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl text-sm font-bold transition-all flex items-center gap-2 shadow-sm hover:-translate-y-px"
          >
            {loading === "rates" ? <><Spinner /> Updating...</> : "Update Rates"}
          </button>
        </Section>
      )}

      {/* ── LIMITS ────────────────────────────────────────────────────────── */}
      {isOwner && (
        <Section title="Transaction Limits" desc="Set maximum GC amounts per single buy/sell operation">
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="p-3 bg-gray-50 border border-gray-100 rounded-xl">
              <p className="text-xs text-gray-500 mb-1">Current Max Buy</p>
              <p className="text-lg font-bold text-gray-900">{limits.maxBuy} <span className="text-xs font-normal text-gray-400">GC</span></p>
            </div>
            <div className="p-3 bg-gray-50 border border-gray-100 rounded-xl">
              <p className="text-xs text-gray-500 mb-1">Current Max Sell</p>
              <p className="text-lg font-bold text-gray-900">{limits.maxSell} <span className="text-xs font-normal text-gray-400">GC</span></p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 mb-4">
            <FieldRow label="New Max Buy (GC)" hint="Per single transaction">
              <input type="number" step="1" placeholder={limits.maxBuy} value={newMaxBuy} onChange={(e) => setNewMaxBuy(e.target.value)} className={inputCls} />
            </FieldRow>
            <FieldRow label="New Max Sell (GC)" hint="Per single transaction">
              <input type="number" step="1" placeholder={limits.maxSell} value={newMaxSell} onChange={(e) => setNewMaxSell(e.target.value)} className={inputCls} />
            </FieldRow>
          </div>
          <button
            onClick={() => parseInt(newMaxBuy) > 0 && parseInt(newMaxSell) > 0 && onUpdateLimits(newMaxBuy, newMaxSell)}
            disabled={loading === "limits" || !(parseInt(newMaxBuy) > 0 && parseInt(newMaxSell) > 0)}
            className="px-5 py-2.5 bg-gray-900 hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl text-sm font-bold transition-all flex items-center gap-2 shadow-sm hover:-translate-y-px"
          >
            {loading === "limits" ? <><Spinner /> Updating...</> : "Update Limits"}
          </button>
        </Section>
      )}

      {/* ── MEMBERSHIP CONFIG ─────────────────────────────────────────────── */}
      {isOwner && (
        <Section title="Membership Configuration" desc="Set price and duration for user memberships">
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="p-3 bg-violet-50 border border-violet-100 rounded-xl">
              <p className="text-xs text-violet-600 mb-1">Current Price</p>
              <p className="text-lg font-bold text-violet-700">{membershipConfig.price} <span className="text-xs font-normal">GC</span></p>
            </div>
            <div className="p-3 bg-violet-50 border border-violet-100 rounded-xl">
              <p className="text-xs text-violet-600 mb-1">Current Duration</p>
              <p className="text-lg font-bold text-violet-700">
                {membershipConfig.duration === "0" ? "—" : Math.round(Number(membershipConfig.duration) / 86400) + " days"}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 mb-4">
            <FieldRow label="Price (GC)" hint="Cost in GC tokens">
              <input type="number" step="1" placeholder={membershipConfig.price} value={mPrice} onChange={(e) => setMPrice(e.target.value)} className={inputCls} />
            </FieldRow>
            <FieldRow label="Duration (days)" hint="0 = disable membership">
              <input type="number" step="1" placeholder="30" value={mDays} onChange={(e) => setMDays(e.target.value)} className={inputCls} />
            </FieldRow>
          </div>
          <button
            onClick={() => parseInt(mPrice) >= 0 && parseInt(mDays) > 0 && onUpdateMembership(mPrice, mDays)}
            disabled={loading === "membership" || !(parseInt(mPrice) >= 0 && parseInt(mDays) > 0)}
            className="px-5 py-2.5 bg-violet-600 hover:bg-violet-700 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl text-sm font-bold transition-all flex items-center gap-2 shadow-sm hover:-translate-y-px"
          >
            {loading === "membership" ? <><Spinner /> Updating...</> : "Update Membership"}
          </button>
        </Section>
      )}

      {/* ── BLACKLIST ─────────────────────────────────────────────────────── */}
      {isBlacklistManager && (
        <Section title="Blacklist Management" desc="Block or unblock addresses from all token operations">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-3">
              <p className="text-xs font-semibold text-red-600 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-red-500" /> Block Address
              </p>
              <input type="text" placeholder="0x..." value={blAddr} onChange={(e) => setBlAddr(e.target.value)} className={inputCls} />
              <button
                onClick={() => blAddr && onBlacklist(blAddr)}
                disabled={loading === "blacklist" || !blAddr}
                className="w-full px-5 py-2.5 bg-red-500 hover:bg-red-600 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 shadow-sm hover:-translate-y-px"
              >
                {loading === "blacklist" ? <><Spinner /> Working...</> : "🚫 Blacklist"}
              </button>
            </div>
            <div className="space-y-3">
              <p className="text-xs font-semibold text-emerald-600 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" /> Unblock Address
              </p>
              <input type="text" placeholder="0x..." value={unblAddr} onChange={(e) => setUnblAddr(e.target.value)} className={inputCls} />
              <button
                onClick={() => unblAddr && onUnblacklist(unblAddr)}
                disabled={loading === "blacklist" || !unblAddr}
                className="w-full px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 shadow-sm hover:-translate-y-px"
              >
                {loading === "blacklist" ? <><Spinner /> Working...</> : "✅ Unblacklist"}
              </button>
            </div>
          </div>
        </Section>
      )}

      {/* ── ROLE MANAGEMENT ───────────────────────────────────────────────── */}
      {isOwner && (
        <Section title="Role Management" desc="Grant or revoke roles for other addresses">
          {/* Roles reference */}
          <div className="grid grid-cols-2 gap-2 mb-5">
            {ROLES.map((r) => {
              const c = ROLE_COLORS[r.color];
              return (
                <div key={r.hash} className="flex items-center gap-2 p-2.5 bg-gray-50 rounded-xl border border-gray-100">
                  <span className={`w-2 h-2 rounded-full flex-shrink-0 ${c.dot}`} />
                  <div className="min-w-0">
                    <p className={`text-[11px] font-bold ${c.badge.split(" ")[1]}`}>{r.label}</p>
                    <p className="text-[10px] text-gray-400 truncate">{r.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="space-y-3">
            <FieldRow label="Target Address">
              <input type="text" placeholder="0x..." value={roleTarget} onChange={(e) => setRoleTarget(e.target.value)} className={inputCls} />
            </FieldRow>
            <div className="grid grid-cols-2 gap-3">
              <FieldRow label="Role">
                <select value={roleSelected} onChange={(e) => setRoleSelected(e.target.value)} className={inputCls}>
                  {ROLES.map((r) => <option key={r.hash} value={r.hash}>{r.label}</option>)}
                </select>
              </FieldRow>
              <FieldRow label="Action">
                <select value={roleAction} onChange={(e) => setRoleAction(e.target.value)} className={inputCls}>
                  <option value="grant">Grant</option>
                  <option value="revoke">Revoke</option>
                </select>
              </FieldRow>
            </div>
            <button
              onClick={() => roleTarget && (roleAction === "grant" ? onGrantRole(roleSelected, roleTarget) : onRevokeRole(roleSelected, roleTarget))}
              disabled={loading === "role" || !roleTarget}
              className="px-5 py-2.5 bg-gray-900 hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl text-sm font-bold transition-all flex items-center gap-2 shadow-sm hover:-translate-y-px"
            >
              {loading === "role" ? <><Spinner /> Working...</> : roleAction === "grant" ? "Grant Role" : "Revoke Role"}
            </button>
          </div>
        </Section>
      )}
    </div>
  );
}
