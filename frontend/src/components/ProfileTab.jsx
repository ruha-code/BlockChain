import { SEPOLIA_EXPLORER } from "../constants";
import ProfileForm from "./ProfileForm";

export default function ProfileTab({
  account, balance, username, email, isRegistered, txCount,
  loadingAction, onRegister, onUpdate,
}) {
  return (
    <div className="max-w-2xl space-y-5">
      {/* Profile card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="h-24 bg-gradient-to-br from-emerald-500 to-emerald-700 relative">
          <div className="absolute -bottom-8 left-6">
            <div className="w-16 h-16 rounded-2xl bg-white border-4 border-white shadow-md flex items-center justify-center">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </div>
          </div>
        </div>
        <div className="px-6 pt-12 pb-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">{isRegistered ? username : "Anonymous User"}</h2>
              <p className="text-sm text-gray-500 mt-0.5">{isRegistered ? email : "Not registered"}</p>
              <div className="flex items-center gap-1.5 mt-2">
                <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${
                  isRegistered
                    ? "bg-emerald-50 border-emerald-100 text-emerald-700"
                    : "bg-gray-50 border-gray-100 text-gray-500"
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${isRegistered ? "bg-emerald-500" : "bg-gray-300"}`} />
                  {isRegistered ? "Active Member" : "Unregistered"}
                </span>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            {[
              { label: "GC Balance", value: `${parseFloat(balance).toFixed(2)} GC`, icon: "#059669" },
              { label: "Transactions", value: txCount, icon: "#1d4ed8" },
              { label: "Member Since", value: isRegistered ? "2024" : "—", icon: "#7c3aed" },
            ].map(({ label, value }) => (
              <div key={label} className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                <p className="text-xs text-gray-400 mb-1">{label}</p>
                <p className="text-base font-bold text-gray-900">{value}</p>
              </div>
            ))}
          </div>

          {/* Wallet */}
          <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
            <p className="text-xs font-medium text-gray-400 mb-2">Wallet Address</p>
            <div className="flex items-center justify-between gap-4">
              <p className="text-xs font-mono text-gray-700 truncate">{account}</p>
              <a
                href={`${SEPOLIA_EXPLORER}/address/${account}`}
                target="_blank"
                rel="noreferrer"
                className="flex-shrink-0 text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
              >
                View
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Edit/Register form */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h3 className="text-sm font-semibold text-gray-900 mb-5">{isRegistered ? "Update Profile" : "Register Profile"}</h3>
        <ProfileForm
          initialUsername={username}
          initialEmail={email}
          onSubmit={isRegistered ? onUpdate : onRegister}
          loading={loadingAction === (isRegistered ? "update" : "register")}
          submitLabel={isRegistered ? "Save Changes" : "Register"}
        />
      </div>
    </div>
  );
}
