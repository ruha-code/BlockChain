import { useState } from "react";

const BENEFITS = [
  {
    icon: <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />,
    color: { bg: "bg-emerald-50", border: "border-emerald-100", stroke: "#059669" },
    label: "Fast", desc: "Transactions confirmed in seconds",
  },
  {
    icon: <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></>,
    color: { bg: "bg-blue-50", border: "border-blue-100", stroke: "#2563eb" },
    label: "Transparent", desc: "Every action is publicly on-chain",
  },
  {
    icon: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />,
    color: { bg: "bg-violet-50", border: "border-violet-100", stroke: "#7c3aed" },
    label: "Secure", desc: "Non-custodial, your keys only",
  },
];

function Logo() {
  return (
    <div className="flex items-center gap-2.5">
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
  );
}

function SepoliaBadge() {
  return (
    <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-100 rounded-full">
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
      </span>
      <span className="text-xs font-semibold text-emerald-700">Sepolia Testnet</span>
    </div>
  );
}

/* ── State: Connecting (loading) ── */
function ConnectingState() {
  return (
    <div className="w-full max-w-[400px] flex flex-col items-center animate-fade-up">
      <div className="relative mb-6">
        {/* Spinning ring */}
        <div className="w-20 h-20 rounded-full border-4 border-emerald-100 border-t-emerald-600 animate-spin" />
        {/* Center icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-600/30">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
            </svg>
          </div>
        </div>
      </div>
      <h2 className="text-xl font-extrabold text-gray-900 mb-2">Connecting wallet…</h2>
      <p className="text-sm text-gray-500 text-center">Please check MetaMask and approve the connection request.</p>

      {/* Steps */}
      <div className="mt-8 w-full bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-3">
        {[
          { label: "Switching to Sepolia Testnet", done: false },
          { label: "Requesting account access", done: false },
          { label: "Loading your profile", done: false },
        ].map(({ label }, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="w-5 h-5 rounded-full border-2 border-emerald-200 border-t-emerald-600 animate-spin flex-shrink-0" style={{ animationDelay: `${i * 0.2}s` }} />
            <span className="text-xs text-gray-500">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── State: Registration form ── */
function RegisterState({ account, onRegister, loading, message }) {
  const [uname, setUname] = useState("");
  const [mail,  setMail]  = useState("");

  const unameOk = uname.trim().length >= 2;
  const emailOk = mail.trim().includes("@") && mail.trim().includes(".");
  const valid   = unameOk && emailOk;

  const shortAddr = (a) => a ? `${a.slice(0, 6)}…${a.slice(-4)}` : "";

  return (
    <div className="w-full max-w-[440px] space-y-4 animate-fade-up">
      {/* Header */}
      <div className="text-center">
        <div className="w-16 h-16 bg-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-600/25">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
          </svg>
        </div>
        <h2 className="text-2xl font-extrabold text-gray-900 mb-1">Create your profile</h2>
        <p className="text-sm text-gray-500">One last step — set up your on-chain identity</p>
      </div>

      {/* Wallet connected pill */}
      <div className="flex items-center gap-2.5 bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-2.5">
        <span className="relative flex h-2 w-2 flex-shrink-0">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
        </span>
        <span className="text-xs font-semibold text-emerald-700">Wallet connected</span>
        <span className="text-gray-300">·</span>
        <span className="text-xs font-mono text-gray-500">{shortAddr(account)}</span>
      </div>

      {/* Error */}
      {message && (
        <div className="flex items-center gap-2.5 px-4 py-3 bg-red-50 border border-red-100 rounded-xl animate-slide-right">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
            <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <p className="text-xs font-semibold text-red-600">{message.text}</p>
        </div>
      )}

      {/* Form card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
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
                <div className={`w-6 h-6 rounded-full border flex items-center justify-center ${unameOk ? "bg-emerald-50 border-emerald-100" : "bg-red-50 border-red-100"}`}>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={unameOk ? "#059669" : "#ef4444"} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    {unameOk ? <polyline points="20 6 9 17 4 12" /> : <><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></>}
                  </svg>
                </div>
              </div>
            )}
          </div>
          {uname && !unameOk && <p className="text-[11px] text-red-500 mt-1">Minimum 2 characters</p>}
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
            <span className="text-[10px] text-gray-400">For notifications</span>
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
                <div className={`w-6 h-6 rounded-full border flex items-center justify-center ${emailOk ? "bg-emerald-50 border-emerald-100" : "bg-red-50 border-red-100"}`}>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={emailOk ? "#059669" : "#ef4444"} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    {emailOk ? <polyline points="20 6 9 17 4 12" /> : <><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></>}
                  </svg>
                </div>
              </div>
            )}
          </div>
          {mail && !emailOk && <p className="text-[11px] text-red-500 mt-1">Enter a valid email address</p>}
        </div>

        {/* Submit */}
        <button
          onClick={() => valid && onRegister(uname.trim(), mail.trim())}
          disabled={loading || !valid}
          className="w-full flex items-center justify-center gap-2 py-3.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer text-white rounded-xl text-sm font-bold transition-all shadow-sm shadow-emerald-600/20 hover:-translate-y-px active:translate-y-0 mt-1"
        >
          {loading ? (
            <>
              <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              Creating profile…
            </>
          ) : (
            <>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
              </svg>
              Create Profile
            </>
          )}
        </button>
      </div>

      {/* Features */}
      <div className="grid grid-cols-3 gap-2">
        {[
          { icon: <><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" /><rect x="9" y="3" width="6" height="4" rx="1" /></>, label: "Transaction history" },
          { icon: <><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></>, label: "Custom identity" },
          { icon: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />, label: "On-chain profile" },
        ].map(({ icon, label }) => (
          <div key={label} className="bg-white rounded-xl border border-gray-100 p-3 text-center">
            <div className="w-7 h-7 bg-emerald-50 border border-emerald-100 rounded-lg flex items-center justify-center mx-auto mb-1.5">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{icon}</svg>
            </div>
            <p className="text-[10px] font-semibold text-gray-600 leading-tight">{label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── State: Connect ── */
function ConnectState({ onConnect, message }) {
  return (
    <div className="w-full max-w-[400px] space-y-4 animate-fade-up">
      <div className="text-center pb-2">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 border border-emerald-100 rounded-full text-[11px] font-bold text-emerald-700 mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          Web3 Fitness Platform
        </span>
        <h1 className="text-[1.75rem] font-extrabold text-gray-900 tracking-tight leading-[1.2] mb-2">
          Buy, sell & transfer<br />Gym Credits on-chain
        </h1>
        <p className="text-sm text-gray-500">Connect your wallet to get started — no signup needed.</p>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {BENEFITS.map(({ icon, color, label, desc }) => (
          <div key={label} className="bg-white rounded-xl border border-gray-100 shadow-sm p-3.5 text-center">
            <div className={`w-8 h-8 ${color.bg} border ${color.border} rounded-xl flex items-center justify-center mx-auto mb-2`}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={color.stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{icon}</svg>
            </div>
            <p className="text-[11px] font-bold text-gray-800 mb-0.5">{label}</p>
            <p className="text-[10px] text-gray-400 leading-relaxed">{desc}</p>
          </div>
        ))}
      </div>

      {message && (
        <div className="flex items-center gap-2.5 px-4 py-3 bg-red-50 border border-red-100 rounded-xl animate-slide-right">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
            <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <p className="text-xs font-semibold text-red-600">{message.text}</p>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 pt-4 pb-2 flex items-center justify-between">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Select wallet</p>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span className="text-[10px] font-semibold text-emerald-600">Detected</span>
          </div>
        </div>
        <div className="px-3 pb-3">
          <button
            onClick={onConnect}
            className="w-full flex items-center gap-3.5 px-3.5 py-3 rounded-xl border border-gray-100 hover:border-emerald-300 hover:bg-emerald-50/40 group transition-all duration-200 text-left cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-100 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform duration-200">
              <svg width="22" height="22" viewBox="0 0 35 33" fill="none">
                <path d="M32.9582 1L19.8241 10.7183L22.2665 4.99099L32.9582 1Z" fill="#E17726" stroke="#E17726" strokeWidth="0.25" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2.04858 1L15.0707 10.809L12.7402 4.99099L2.04858 1Z" fill="#E27625" stroke="#E27625" strokeWidth="0.25" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M28.2292 23.5334L24.7346 28.872L32.2175 30.9323L34.3611 23.6501L28.2292 23.5334Z" fill="#E27625" stroke="#E27625" strokeWidth="0.25" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M0.651855 23.6501L2.78262 30.9323L10.2655 28.872L6.77087 23.5334L0.651855 23.6501Z" fill="#E27625" stroke="#E27625" strokeWidth="0.25" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M9.89415 14.5149L7.79004 17.6507L15.2061 17.9927L14.9557 9.96289L9.89415 14.5149Z" fill="#E27625" stroke="#E27625" strokeWidth="0.25" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M25.1127 14.5149L19.9847 9.87109L19.8242 17.9927L27.2236 17.6507L25.1127 14.5149Z" fill="#E27625" stroke="#E27625" strokeWidth="0.25" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M10.2656 28.872L14.7842 26.7283L10.8732 23.7002L10.2656 28.872Z" fill="#E27625" stroke="#E27625" strokeWidth="0.25" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M20.2227 26.7283L24.7346 28.872L24.1337 23.7002L20.2227 26.7283Z" fill="#E27625" stroke="#E27625" strokeWidth="0.25" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-gray-900">MetaMask</p>
              <p className="text-xs text-gray-400 mt-0.5">Browser extension</p>
            </div>
            <div className="w-7 h-7 rounded-full bg-gray-50 border border-gray-200 group-hover:bg-emerald-600 group-hover:border-emerald-600 flex items-center justify-center transition-all duration-200 flex-shrink-0">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:stroke-white transition-colors">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </div>
          </button>
        </div>
        <div className="h-px bg-gray-50 mx-5" />
        <div className="p-3">
          <button
            onClick={onConnect}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-xl transition-all hover:-translate-y-px active:translate-y-0 shadow-sm shadow-emerald-600/25 flex items-center justify-center gap-2 cursor-pointer"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
            </svg>
            Connect Wallet
          </button>
        </div>
      </div>

      <div className="flex items-center justify-center gap-4 pt-1">
        {["100% On-chain", "ERC-20", "Non-custodial"].map((t) => (
          <div key={t} className="flex items-center gap-1">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <span className="text-[10px] font-semibold text-gray-400">{t}</span>
          </div>
        ))}
      </div>
      <p className="text-[11px] text-gray-400 text-center">
        By connecting you agree to our{" "}
        <span className="text-gray-600 underline underline-offset-2 cursor-pointer hover:text-gray-800 transition-colors">Terms</span>
        {" & "}
        <span className="text-gray-600 underline underline-offset-2 cursor-pointer hover:text-gray-800 transition-colors">Privacy Policy</span>
      </p>
    </div>
  );
}

/* ── Main ── */
export default function ConnectScreen({ onConnect, onRegister, account, connecting, loadingAction, message }) {
  const showRegister = account && !connecting;
  const showLoading  = connecting;

  return (
    <div className="min-h-screen bg-[#F7F7F5] flex flex-col">
      <header className="h-14 flex items-center justify-between px-6 bg-white border-b border-gray-100 flex-shrink-0">
        <Logo />
        <SepoliaBadge />
      </header>

      <div className="flex-1 flex items-center justify-center px-6 py-10">
        {showLoading  && <ConnectingState />}
        {showRegister && <RegisterState account={account} onRegister={onRegister} loading={loadingAction === "register"} message={message} />}
        {!showLoading && !showRegister && <ConnectState onConnect={onConnect} message={message} />}
      </div>
    </div>
  );
}
