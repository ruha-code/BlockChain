export default function StatusMessage({ message }) {
  if (!message) return null;
  const isError = message.type === "error";
  return (
    <div className={`flex items-center gap-3 px-4 py-3 rounded-xl mb-6 text-sm font-medium border ${
      isError
        ? "bg-red-50 border-red-200 text-red-700"
        : "bg-emerald-50 border-emerald-200 text-emerald-700"
    }`}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
        {isError
          ? <><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></>
          : <><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></>
        }
      </svg>
      {message.text}
    </div>
  );
}
