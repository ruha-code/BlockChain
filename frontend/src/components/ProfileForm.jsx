import { useState } from "react";

export default function ProfileForm({ title, initialUsername = "", initialEmail = "", onSubmit, loading, submitLabel }) {
  const [uname, setUname] = useState(initialUsername);
  const [mail, setMail] = useState(initialEmail);
  const valid = uname.trim().length > 0 && mail.trim().length > 0;

  return (
    <div>
      {title && <h4 className="text-sm font-semibold text-gray-700 mb-4">{title}</h4>}
      <div className="grid grid-cols-2 gap-4 mb-5">
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1.5">Username</label>
          <input
            type="text"
            placeholder="gymuser"
            value={uname}
            maxLength={32}
            onChange={(e) => setUname(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1.5">Email</label>
          <input
            type="email"
            placeholder="user@gym.com"
            value={mail}
            maxLength={64}
            onChange={(e) => setMail(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
          />
        </div>
      </div>
      <button
        onClick={() => valid && onSubmit(uname.trim(), mail.trim())}
        disabled={loading || !valid}
        className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-200 disabled:cursor-not-allowed text-white disabled:text-gray-400 rounded-xl text-sm font-semibold transition-all flex items-center gap-2"
      >
        {loading ? (
          <>
            <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            Processing...
          </>
        ) : submitLabel}
      </button>
    </div>
  );
}
