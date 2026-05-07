import { useState } from "react";
import { SEPOLIA_EXPLORER } from "../constants";

function ProfileForm({ initialUsername = "", initialEmail = "", onSubmit, loading, submitLabel }) {
  const [uname, setUname] = useState(initialUsername);
  const [mail,  setMail]  = useState(initialEmail);

  const unameOk = uname.trim().length >= 2;
  const emailOk = mail.trim().includes("@") && mail.trim().includes(".");
  const valid   = unameOk && emailOk;
  const changed = uname.trim() !== initialUsername || mail.trim() !== initialEmail;

  return (
    <div className="space-y-4">
      {/* Username */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-xs font-semibold text-gray-700 flex items-center gap-1.5">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
            </svg>
            Username
          </label>
          <span className="text-[10px] text-gray-400">{uname.length}/32</span>
        </div>
        <div className="relative">
          <input
            type="text"
            value={uname}
            placeholder="e.g. ruslan_gym"
            maxLength={32}
            onChange={(e) => setUname(e.target.value)}
            className={`w-full px-4 py-3 bg-white border rounded-xl text-sm text-gray-900 placeholder:text-gray-300 focus:outline-none focus:ring-3 transition-all cursor-text pr-12 ${
              uname && !unameOk
                ? "border-red-200 focus:border-red-400 focus:ring-red-500/10"
                : uname && unameOk
                ? "border-emerald-300 focus:border-emerald-400 focus:ring-emerald-500/10"
                : "border-gray-200 hover:border-gray-300 focus:border-emerald-500 focus:ring-emerald-500/10"
            }`}
          />
          {uname && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              {unameOk ? (
                <div className="w-6 h-6 bg-emerald-50 border border-emerald-100 rounded-full flex items-center justify-center">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
              ) : (
                <div className="w-6 h-6 bg-red-50 border border-red-100 rounded-full flex items-center justify-center">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" />
                  </svg>
                </div>
              )}
            </div>
          )}
        </div>
        {uname && !unameOk && <p className="text-[11px] text-red-500 mt-1 font-medium">Minimum 2 characters</p>}
      </div>

      {/* Email */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-xs font-semibold text-gray-700 flex items-center gap-1.5">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" />
            </svg>
            Email Address
          </label>
          <span className="text-[10px] text-gray-400">Used for notifications</span>
        </div>
        <div className="relative">
          <input
            type="email"
            value={mail}
            placeholder="e.g. you@example.com"
            maxLength={64}
            onChange={(e) => setMail(e.target.value)}
            className={`w-full px-4 py-3 bg-white border rounded-xl text-sm text-gray-900 placeholder:text-gray-300 focus:outline-none focus:ring-3 transition-all cursor-text pr-12 ${
              mail && !emailOk
                ? "border-red-200 focus:border-red-400 focus:ring-red-500/10"
                : mail && emailOk
                ? "border-emerald-300 focus:border-emerald-400 focus:ring-emerald-500/10"
                : "border-gray-200 hover:border-gray-300 focus:border-emerald-500 focus:ring-emerald-500/10"
            }`}
          />
          {mail && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              {emailOk ? (
                <div className="w-6 h-6 bg-emerald-50 border border-emerald-100 rounded-full flex items-center justify-center">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
              ) : (
                <div className="w-6 h-6 bg-red-50 border border-red-100 rounded-full flex items-center justify-center">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" />
                  </svg>
                </div>
              )}
            </div>
          )}
        </div>
        {mail && !emailOk && <p className="text-[11px] text-red-500 mt-1 font-medium">Please enter a valid email address</p>}
      </div>

      {/* Submit */}
      <button
        onClick={() => valid && changed && onSubmit(uname.trim(), mail.trim())}
        disabled={loading || !valid || !changed}
        className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer text-white rounded-xl text-sm font-bold transition-all shadow-sm shadow-emerald-600/20 hover:-translate-y-px active:translate-y-0 mt-2"
      >
        {loading ? (
          <>
            <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            Saving…
          </>
        ) : (
          <>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            {submitLabel}
          </>
        )}
      </button>
      {!changed && valid && (
        <p className="text-[11px] text-gray-400 text-center">No changes to save</p>
      )}
    </div>
  );
}

function fmtExpiry(ts) {
  const n = Number(ts);
  if (!n) return null;
  return new Date(n * 1000).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

function QRCode({ address }) {
  const url = `https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=${encodeURIComponent(address)}&bgcolor=ffffff&color=000000&margin=2`;
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      <p className="text-sm font-bold text-gray-900 mb-1">Receive GC</p>
      <p className="text-xs text-gray-400 mb-4">Scan this QR code to send GC to your wallet</p>
      <div className="flex justify-center">
        <div className="p-3 bg-white border border-gray-100 rounded-xl shadow-sm">
          <img src={url} alt="QR Code" width={140} height={140} className="rounded-lg" />
        </div>
      </div>
      <p className="text-[10px] text-gray-400 text-center mt-3 font-mono">{address.slice(0, 20)}…</p>
    </div>
  );
}

export default function ProfileTab({
  account, balance, username, email, isRegistered, txCount,
  isMember, membershipExpiry,
  loadingAction, onRegister, onUpdate,
}) {
  const [copied, setCopied] = useState(false);

  const copyAddr = () => {
    navigator.clipboard.writeText(account);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const shortAddr = (a) => a ? `${a.slice(0, 6)}…${a.slice(-4)}` : "";

  return (
    <div className="max-w-5xl animate-fade-up">
      <div className="grid grid-cols-5 gap-5">

        {/* ── Left (wider) ── */}
        <div className="col-span-3 space-y-4">

          {/* Profile card */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {/* Green banner */}
            <div className="relative h-24 bg-gradient-to-br from-emerald-600 to-emerald-700 overflow-hidden">
              <div className="absolute right-0 top-0 w-40 h-40 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
              <div className="absolute left-1/3 bottom-0 w-24 h-24 bg-white/5 rounded-full translate-y-1/2" />
            </div>

            {/* Avatar + info row */}
            <div className="px-6 pb-5 relative z-10">
              <div className="flex items-end justify-between -mt-8 mb-4">
                <div className="w-16 h-16 rounded-full bg-white border-4 border-white shadow-xl flex items-center justify-center flex-shrink-0">
                  <div className="w-full h-full rounded-full bg-emerald-100 flex items-center justify-center overflow-hidden">
                    {isRegistered && username ? (
                      <span className="text-2xl font-extrabold text-emerald-700 select-none leading-none">
                        {username.charAt(0).toUpperCase()}
                      </span>
                    ) : (
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="#059669" stroke="none">
                        <path d="M12 12c2.761 0 5-2.239 5-5s-2.239-5-5-5-5 2.239-5 5 2.239 5 5 5zm0 2c-3.33 0-10 1.68-10 5v2h20v-2c0-3.32-6.67-5-10-5z"/>
                      </svg>
                    )}
                  </div>
                </div>
                <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
                  isRegistered
                    ? "bg-emerald-50 border-emerald-100 text-emerald-700"
                    : "bg-gray-50 border-gray-200 text-gray-400"
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${isRegistered ? "bg-emerald-500" : "bg-gray-300"}`} />
                  {isRegistered ? "Active" : "Unregistered"}
                </span>
              </div>
              <h2 className="text-lg font-extrabold text-gray-900 leading-tight truncate">
                {isRegistered ? username : "Anonymous User"}
              </h2>
              <p className="text-xs text-gray-400 mt-0.5 truncate">
                {isRegistered ? email : "Not registered yet"}
              </p>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-3 border-t border-gray-50">
              {[
                {
                  icon: <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />,
                  stroke: "#059669", bg: "bg-emerald-50",
                  value: parseFloat(balance).toLocaleString(undefined, { maximumFractionDigits: 0 }),
                  label: "GC Balance", sub: "GC Tokens",
                  violet: false,
                },
                {
                  icon: <><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" /><rect x="9" y="3" width="6" height="4" rx="1" /></>,
                  stroke: "#6366f1", bg: "bg-violet-50",
                  value: txCount,
                  label: "Transactions", sub: "On-chain",
                  violet: false,
                },
                {
                  icon: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />,
                  stroke: isMember ? "#7c3aed" : "#9ca3af", bg: isMember ? "bg-violet-50" : "bg-gray-50",
                  value: isMember ? "PRO ✦" : "None",
                  label: "Membership", sub: "Status",
                  violet: isMember,
                },
              ].map(({ icon, stroke, bg, value, label, sub, violet }) => (
                <div key={label} className="flex items-center gap-3 px-5 py-4 border-r border-gray-50 last:border-r-0">
                  <div className={`w-9 h-9 rounded-xl ${bg} flex items-center justify-center flex-shrink-0`}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      {icon}
                    </svg>
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold text-gray-400 mb-0.5">{label}</p>
                    <p className={`text-lg font-extrabold leading-none ${violet ? "text-violet-600" : "text-gray-900"}`}>
                      {value}
                    </p>
                    <p className="text-[10px] text-gray-400 mt-0.5">{sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Form card */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="mb-5">
              <h3 className="text-sm font-bold text-gray-900">
                {isRegistered ? "Update Profile" : "Create Profile"}
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">
                {isRegistered ? "Update your on-chain profile information" : "Register to unlock all features"}
              </p>
            </div>
            <ProfileForm
              initialUsername={username}
              initialEmail={email}
              onSubmit={isRegistered ? onUpdate : onRegister}
              loading={loadingAction === (isRegistered ? "update" : "register")}
              submitLabel={isRegistered ? "Save Changes" : "Register Now"}
            />
          </div>
        </div>

        {/* ── Right sidebar ── */}
        <div className="col-span-2 space-y-4">

          {/* Wallet Information */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <p className="text-sm font-bold text-gray-900 mb-4">Wallet Information</p>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">Network</span>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span className="text-xs font-semibold text-gray-700">Sepolia Testnet</span>
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-1.5">Wallet Address</p>
                <div className="flex items-center gap-2 bg-gray-50 border border-gray-100 rounded-xl px-3 py-2.5">
                  <p className="text-[11px] font-mono text-gray-600 break-all leading-relaxed flex-1">{account}</p>
                  <button
                    onClick={copyAddr}
                    className="w-7 h-7 rounded-lg hover:bg-gray-200 flex items-center justify-center transition-colors cursor-pointer flex-shrink-0"
                  >
                    {copied ? (
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    ) : (
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
              <a
                href={`${SEPOLIA_EXPLORER}/address/${account}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-emerald-600 hover:text-emerald-700 font-semibold transition-colors cursor-pointer"
              >
                View on Etherscan
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" />
                </svg>
              </a>
            </div>
          </div>

          {/* Account Information */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <p className="text-sm font-bold text-gray-900 mb-4">Account Information</p>
            <div className="space-y-3">
              {[
                { label: "Username", value: isRegistered ? username : "—" },
                { label: "Email",    value: isRegistered ? email    : "—" },
                { label: "Network",  value: "Sepolia Testnet" },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-center justify-between gap-4">
                  <span className="text-xs text-gray-400 flex-shrink-0">{label}</span>
                  <span className="text-xs font-semibold text-gray-700 truncate text-right">{value}</span>
                </div>
              ))}
              <div className="flex items-center justify-between gap-4">
                <span className="text-xs text-gray-400 flex-shrink-0">Status</span>
                <span className={`text-xs font-bold px-2.5 py-1 rounded-lg border ${
                  isRegistered
                    ? "bg-emerald-50 border-emerald-100 text-emerald-700"
                    : "bg-amber-50 border-amber-100 text-amber-600"
                }`}>
                  {isRegistered ? "Active" : "Pending"}
                </span>
              </div>
            </div>
          </div>

          {/* QR Code */}
          <QRCode address={account} />

          {/* Membership status */}
          {isMember && (
            <div className="bg-violet-50 border border-violet-100 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2 h-2 rounded-full bg-violet-500 animate-pulse" />
                <p className="text-xs font-bold text-violet-700 uppercase tracking-wider">Active Member</p>
              </div>
              <p className="text-sm font-bold text-violet-900 mb-1">Gym Anywhere ✦ PRO</p>
              <p className="text-xs text-violet-600">Expires {fmtExpiry(membershipExpiry)}</p>
            </div>
          )}

          {/* Your Benefits */}
          <div className="relative bg-emerald-50 border border-emerald-100 rounded-2xl p-5 overflow-hidden">
            {/* Shield illustration */}
            <div className="absolute right-3 bottom-2 opacity-20">
              <svg width="72" height="72" viewBox="0 0 24 24" fill="#059669" stroke="none">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>

            <p className="text-xs font-bold text-emerald-700 uppercase tracking-widest mb-3">Your Benefits</p>
            <div className="space-y-2.5 relative">
              {[
                "Full transaction history",
                "Custom username & email",
                "On-chain identity",
              ].map((item) => (
                <div key={item} className="flex items-center gap-2.5">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${isRegistered ? "bg-emerald-600" : "bg-gray-200"}`}>
                    <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <span className={`text-xs font-medium ${isRegistered ? "text-emerald-800" : "text-gray-400"}`}>{item}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
