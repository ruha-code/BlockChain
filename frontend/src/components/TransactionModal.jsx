import { SEPOLIA_EXPLORER } from "../constants";

const ACTION_LABEL = { buy: "purchased", sell: "sold", transfer: "transferred" };

export default function TransactionModal({ modal, onClose, onDashboard }) {
  if (!modal) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={modal.type === "success" ? onClose : undefined} />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl border border-gray-100 shadow-2xl w-full max-w-md mx-4 overflow-hidden">
        {modal.type === "loading" ? (
          <LoadingState modal={modal} />
        ) : (
          <SuccessState modal={modal} onClose={onClose} onDashboard={onDashboard} />
        )}
      </div>
    </div>
  );
}

function LoadingState({ modal }) {
  return (
    <div className="p-8 text-center">
      <div className="relative w-20 h-20 mx-auto mb-6">
        <svg className="w-20 h-20 animate-spin text-gray-100" viewBox="0 0 80 80" fill="none">
          <circle cx="40" cy="40" r="36" stroke="currentColor" strokeWidth="6" />
        </svg>
        <svg className="w-20 h-20 animate-spin absolute inset-0 text-emerald-500" viewBox="0 0 80 80" fill="none" style={{ animationDuration: "1.5s" }}>
          <circle cx="40" cy="40" r="36" stroke="currentColor" strokeWidth="6" strokeDasharray="60 165" strokeLinecap="round" />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
          </svg>
        </div>
      </div>

      <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wider mb-2">Processing</p>
      <h3 className="text-lg font-bold text-gray-900 mb-2">Transaction Pending</h3>
      <p className="text-sm text-gray-500 leading-relaxed mb-6">
        Transaction is being confirmed on Sepolia. Please don't close this window.
      </p>

      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100 text-left mb-4">
        <div>
          <p className="text-xs text-gray-400">Action</p>
          <p className="text-sm font-semibold text-gray-700 capitalize">{modal.action} GC</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-400">Amount</p>
          <p className="text-sm font-semibold text-gray-700">{modal.amount} GC</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-400">Est. Time</p>
          <p className="text-sm font-semibold text-emerald-600">~15 sec</p>
        </div>
      </div>

      <div className="flex items-center gap-2 justify-center text-xs text-gray-400">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
        Waiting for blockchain confirmation...
      </div>
    </div>
  );
}

function SuccessState({ modal, onClose, onDashboard }) {
  return (
    <div className="p-8 text-center">
      {/* Success animation */}
      <div className="relative w-20 h-20 mx-auto mb-6">
        <div className="w-20 h-20 bg-emerald-50 border-4 border-emerald-100 rounded-full flex items-center justify-center">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="animate-[scale-in_0.3s_ease-out]">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
          </svg>
        </div>
        <div className="absolute -top-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
      </div>

      <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wider mb-2">Confirmed</p>
      <h3 className="text-lg font-bold text-gray-900 mb-2">Transaction Successful</h3>
      <p className="text-sm text-gray-500 mb-6">
        <span className="font-semibold text-gray-800">{modal.amount} GC</span> successfully {ACTION_LABEL[modal.action] || modal.action}.
      </p>

      {modal.txHash && (
        <a
          href={`${SEPOLIA_EXPLORER}/tx/${modal.txHash}`}
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-between gap-3 p-3.5 bg-gray-50 rounded-xl border border-gray-100 mb-5 hover:border-gray-200 transition-colors group"
        >
          <div className="text-left">
            <p className="text-xs text-gray-400">Transaction Hash</p>
            <p className="text-xs font-mono font-semibold text-gray-700 mt-0.5">
              {modal.txHash.slice(0, 14)}…{modal.txHash.slice(-8)}
            </p>
          </div>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 group-hover:stroke-blue-500 transition-colors">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" />
          </svg>
        </a>
      )}

      <div className="flex gap-3">
        {modal.txHash && (
          <a
            href={`${SEPOLIA_EXPLORER}/tx/${modal.txHash}`}
            target="_blank"
            rel="noreferrer"
            className="flex-1 py-2.5 bg-white border border-gray-200 hover:border-gray-300 text-gray-700 rounded-xl text-sm font-semibold transition-all text-center"
          >
            View Transaction
          </a>
        )}
        <button
          onClick={() => { onClose(); onDashboard(); }}
          className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold transition-all shadow-sm shadow-emerald-600/20"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}
