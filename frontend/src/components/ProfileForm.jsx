import { useState } from "react";

function Field({ label, hint, icon, children }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label className="text-xs font-semibold text-gray-700 flex items-center gap-1.5 cursor-default">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {icon}
          </svg>
          {label}
        </label>
        {hint && <span className="text-[10px] text-gray-400">{hint}</span>}
      </div>
      {children}
    </div>
  );
}

export default function ProfileForm({ initialUsername = "", initialEmail = "", onSubmit, loading, submitLabel }) {
  const [uname, setUname] = useState(initialUsername);
  const [mail,  setMail]  = useState(initialEmail);

  const unameOk  = uname.trim().length >= 2;
  const emailOk  = mail.trim().includes("@") && mail.trim().includes(".");
  const valid    = unameOk && emailOk;
  const changed  = uname.trim() !== initialUsername || mail.trim() !== initialEmail;

  return (
    <div className="space-y-4">
      {/* Username */}
      <Field
        label="Username"
        hint={`${uname.length}/32`}
        icon={<><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></>}
      >
        <div className="relative">
          <input
            type="text"
            value={uname}
            placeholder="e.g. ruslan_gym"
            maxLength={32}
            onChange={(e) => setUname(e.target.value)}
            className={`w-full px-4 py-3 bg-white border rounded-xl text-sm text-gray-900 placeholder:text-gray-300 focus:outline-none focus:ring-3 transition-all cursor-text ${
              uname && !unameOk
                ? "border-red-200 focus:border-red-400 focus:ring-red-500/10"
                : uname && unameOk
                ? "border-emerald-200 focus:border-emerald-400 focus:ring-emerald-500/10"
                : "border-gray-200 hover:border-gray-300 focus:border-emerald-500 focus:ring-emerald-500/10"
            }`}
          />
          {uname && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              {unameOk ? (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
                </svg>
              ) : (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" />
                </svg>
              )}
            </div>
          )}
        </div>
        {uname && !unameOk && (
          <p className="text-[11px] text-red-500 mt-1 font-medium">Minimum 2 characters</p>
        )}
      </Field>

      {/* Email */}
      <Field
        label="Email"
        hint="Used for notifications"
        icon={<><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></>}
      >
        <div className="relative">
          <input
            type="email"
            value={mail}
            placeholder="e.g. you@example.com"
            maxLength={64}
            onChange={(e) => setMail(e.target.value)}
            className={`w-full px-4 py-3 bg-white border rounded-xl text-sm text-gray-900 placeholder:text-gray-300 focus:outline-none focus:ring-3 transition-all cursor-text ${
              mail && !emailOk
                ? "border-red-200 focus:border-red-400 focus:ring-red-500/10"
                : mail && emailOk
                ? "border-emerald-200 focus:border-emerald-400 focus:ring-emerald-500/10"
                : "border-gray-200 hover:border-gray-300 focus:border-emerald-500 focus:ring-emerald-500/10"
            }`}
          />
          {mail && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              {emailOk ? (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
                </svg>
              ) : (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" />
                </svg>
              )}
            </div>
          )}
        </div>
        {mail && !emailOk && (
          <p className="text-[11px] text-red-500 mt-1 font-medium">Enter a valid email address</p>
        )}
      </Field>

      {/* Submit */}
      <div className="flex items-center gap-3 pt-1">
        <button
          onClick={() => valid && changed && onSubmit(uname.trim(), mail.trim())}
          disabled={loading || !valid || !changed}
          className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer text-white rounded-xl text-sm font-bold transition-all shadow-sm shadow-emerald-600/20 hover:-translate-y-px active:translate-y-0"
        >
          {loading ? (
            <>
              <svg className="animate-spin w-3.5 h-3.5" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              Saving…
            </>
          ) : (
            <>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              {submitLabel}
            </>
          )}
        </button>
        {!changed && valid && (
          <p className="text-[11px] text-gray-400">No changes to save</p>
        )}
      </div>
    </div>
  );
}
