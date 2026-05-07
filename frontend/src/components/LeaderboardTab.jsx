import { useState, useEffect } from "react";

const MEDAL = {
  0: { emoji: "🥇", bg: "bg-amber-50",   border: "border-amber-200",  text: "text-amber-700"  },
  1: { emoji: "🥈", bg: "bg-gray-50",    border: "border-gray-200",   text: "text-gray-600"   },
  2: { emoji: "🥉", bg: "bg-orange-50",  border: "border-orange-200", text: "text-orange-700" },
};

function shortAddr(a) {
  return `${a.slice(0, 8)}…${a.slice(-6)}`;
}

function BalanceBar({ balance, max }) {
  const pct = max > 0 ? Math.max(4, (parseFloat(balance) / parseFloat(max)) * 100) : 4;
  return (
    <div className="w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden">
      <div className="h-full bg-emerald-500 rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
    </div>
  );
}

export default function LeaderboardTab({ account, loadLeaderboard }) {
  const [entries, setEntries]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [refreshed, setRefreshed] = useState(false);

  const fetch = async () => {
    setLoading(true);
    const data = await loadLeaderboard();
    setEntries(data);
    setLoading(false);
  };

  useEffect(() => { fetch(); }, []);

  const handleRefresh = async () => {
    setRefreshed(true);
    await fetch();
    setTimeout(() => setRefreshed(false), 2000);
  };

  const myRank = entries.findIndex((e) => e.address.toLowerCase() === account?.toLowerCase());
  const max    = entries[0] ? parseFloat(entries[0].balance) : 1;

  return (
    <div className="max-w-2xl space-y-5 animate-fade-up">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-extrabold text-gray-900">Leaderboard</h2>
          <p className="text-xs text-gray-400 mt-0.5">Top GC token holders on Sepolia</p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 hover:border-gray-300 rounded-xl text-xs font-semibold text-gray-600 transition-all hover:-translate-y-px active:translate-y-0 disabled:opacity-50"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={loading || refreshed ? "animate-spin" : ""}>
            <polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/>
            <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
          </svg>
          {refreshed ? "Refreshed!" : "Refresh"}
        </button>
      </div>

      {/* Your rank badge */}
      {!loading && myRank >= 0 && (
        <div className="flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-100 rounded-2xl">
          <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center text-lg font-extrabold text-emerald-700 flex-shrink-0">
            #{myRank + 1}
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold text-emerald-900">Your position</p>
            <p className="text-xs text-emerald-600">{shortAddr(account)} · {parseFloat(entries[myRank].balance).toFixed(2)} GC</p>
          </div>
          {myRank < 3 && <span className="text-2xl">{MEDAL[myRank].emoji}</span>}
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-3 border-b border-gray-50 flex items-center gap-3">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex-1">Rank</p>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex-1">Address</p>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right w-32">Balance</p>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest w-24 text-right">Share</p>
        </div>

        {loading ? (
          <div className="py-16 flex flex-col items-center gap-3">
            <svg className="w-8 h-8 animate-spin text-emerald-400" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
            </svg>
            <p className="text-sm text-gray-400">Loading holders…</p>
            <p className="text-xs text-gray-300">Querying blockchain events</p>
          </div>
        ) : entries.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-3xl mb-3">🏆</p>
            <p className="text-sm font-semibold text-gray-600">No holders found</p>
            <p className="text-xs text-gray-400 mt-1">Buy some GC to be first on the board!</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {entries.map((entry, i) => {
              const isMe = entry.address.toLowerCase() === account?.toLowerCase();
              const medal = MEDAL[i];
              return (
                <div
                  key={entry.address}
                  className={`flex items-center gap-3 px-5 py-3.5 transition-colors ${isMe ? "bg-emerald-50/60" : "hover:bg-gray-50/60"}`}
                >
                  {/* Rank */}
                  <div className="w-8 flex-shrink-0">
                    {medal ? (
                      <span className="text-lg">{medal.emoji}</span>
                    ) : (
                      <span className="text-sm font-bold text-gray-400">#{i + 1}</span>
                    )}
                  </div>

                  {/* Address */}
                  <div className="flex-1 min-w-0 flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center flex-shrink-0 text-[10px] font-bold text-gray-500">
                      {entry.address.slice(2, 4).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-mono font-semibold text-gray-700 truncate">{shortAddr(entry.address)}</p>
                      {isMe && <p className="text-[10px] text-emerald-600 font-bold">You</p>}
                    </div>
                  </div>

                  {/* Balance */}
                  <div className="w-32 text-right">
                    <p className="text-sm font-bold text-gray-900">{parseFloat(entry.balance).toLocaleString("en-US", { maximumFractionDigits: 2 })}</p>
                    <p className="text-[10px] text-gray-400">GC</p>
                  </div>

                  {/* Bar */}
                  <div className="w-24 flex justify-end">
                    <BalanceBar balance={entry.balance} max={max} />
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {!loading && entries.length > 0 && (
          <div className="px-5 py-3 border-t border-gray-50 text-center">
            <p className="text-[11px] text-gray-400">Showing top {entries.length} holders · Data from Sepolia blockchain</p>
          </div>
        )}
      </div>
    </div>
  );
}
