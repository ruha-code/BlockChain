export default function ErrorPage({ onBack }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-8">
      {/* Dumbbell illustration */}
      <div className="relative mb-10">
        <div className="w-36 h-36 bg-gray-100 rounded-full flex items-center justify-center">
          <svg width="72" height="72" viewBox="0 0 64 64" fill="none">
            {/* Dumbbell */}
            <rect x="8" y="27" width="8" height="10" rx="2" fill="#e5e7eb" />
            <rect x="4" y="24" width="6" height="16" rx="2" fill="#d1d5db" />
            <rect x="48" y="27" width="8" height="10" rx="2" fill="#e5e7eb" />
            <rect x="54" y="24" width="6" height="16" rx="2" fill="#d1d5db" />
            <rect x="16" y="29" width="32" height="6" rx="3" fill="#9ca3af" />
            {/* Question mark */}
            <text x="26" y="38" fontSize="14" fontWeight="bold" fill="#6b7280">?</text>
          </svg>
        </div>
        {/* Floating elements */}
        <div className="absolute -top-2 -right-2 w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center animate-bounce">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
          </svg>
        </div>
        <div className="absolute -bottom-1 -left-3 w-6 h-6 bg-blue-100 rounded-full animate-pulse" />
      </div>

      <div className="mb-2">
        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Error 404</span>
      </div>
      <h1 className="text-4xl font-extrabold text-gray-900 mb-3">Page Not Found</h1>
      <p className="text-base text-gray-500 max-w-sm leading-relaxed mb-8">
        Looks like this page took a rest day. The page you're looking for doesn't exist or has been moved.
      </p>

      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold transition-all shadow-sm shadow-emerald-600/20"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
          </svg>
          Go Back Home
        </button>
        <button
          onClick={onBack}
          className="px-6 py-3 bg-white border border-gray-200 hover:border-gray-300 text-gray-700 rounded-xl text-sm font-semibold transition-all"
        >
          Dashboard
        </button>
      </div>
    </div>
  );
}
