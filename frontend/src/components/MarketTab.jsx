import { useState, useEffect, useCallback } from "react";

const BINANCE = "https://api.binance.com/api/v3";
const SYMBOL  = "ETHUSDT";

// ── Fetch helpers (Binance — no key, no rate limits) ──────────────────────────
async function fetchEthPrice() {
  const [ticker, stats] = await Promise.all([
    fetch(`${BINANCE}/ticker/price?symbol=${SYMBOL}`).then((r) => r.json()),
    fetch(`${BINANCE}/ticker/24hr?symbol=${SYMBOL}`).then((r) => r.json()),
  ]);
  return {
    usd:            parseFloat(ticker.price),
    usd_24h_change: parseFloat(stats.priceChangePercent),
    usd_market_cap: 0,   // Binance doesn't provide market cap — hide it
    usd_24h_vol:    parseFloat(stats.quoteVolume),
  };
}

// days → Binance kline interval + limit
function rangeToKline(days) {
  if (days <= 1)  return { interval: "1h",  limit: 24  };
  if (days <= 7)  return { interval: "4h",  limit: 42  };
  if (days <= 30) return { interval: "1d",  limit: 30  };
  return              { interval: "1d",  limit: 90  };
}

async function fetchEthChart(days = 7) {
  const { interval, limit } = rangeToKline(days);
  const r = await fetch(`${BINANCE}/klines?symbol=${SYMBOL}&interval=${interval}&limit=${limit}`);
  const d = await r.json();
  // kline: [openTime, open, high, low, close, ...]
  return d.map((k) => [k[0], parseFloat(k[4])]); // [[timestamp_ms, closePrice]]
}

// ── SVG sparkline chart ───────────────────────────────────────────────────────
function PriceChart({ data, color = "#059669" }) {
  if (!data || data.length < 2) return (
    <div className="h-32 flex items-center justify-center">
      <div className="w-6 h-6 border-2 border-gray-200 border-t-emerald-500 rounded-full animate-spin" />
    </div>
  );

  const values = data.map(([, v]) => v);
  const minV   = Math.min(...values);
  const maxV   = Math.max(...values);
  const range  = maxV - minV || 1;
  const W = 500, H = 100;

  const pts = data.map(([, v], i) => {
    const x = (i / (data.length - 1)) * W;
    const y = H - ((v - minV) / range) * (H - 12) - 6;
    return `${x},${y}`;
  });

  const polyline = pts.join(" ");
  const area     = `0,${H} ${polyline} ${W},${H}`;
  const isUp     = values[values.length - 1] >= values[0];
  const lineColor = isUp ? "#059669" : "#ef4444";
  const gradId   = `grad-${isUp ? "up" : "dn"}`;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-32" preserveAspectRatio="none">
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor={lineColor} stopOpacity="0.15" />
          <stop offset="100%" stopColor={lineColor} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={area} fill={`url(#${gradId})`} />
      <polyline points={polyline} fill="none" stroke={lineColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      {/* Current price dot */}
      <circle cx={W} cy={pts[pts.length - 1].split(",")[1]} r="4" fill={lineColor} />
      <circle cx={W} cy={pts[pts.length - 1].split(",")[1]} r="7" fill={lineColor} fillOpacity="0.2" />
    </svg>
  );
}

// ── Stat card ─────────────────────────────────────────────────────────────────
function StatCard({ label, value, sub, color = "gray", icon }) {
  const colors = {
    emerald: { bg: "bg-emerald-50", border: "border-emerald-100", text: "text-emerald-700", sub: "text-emerald-500" },
    red:     { bg: "bg-red-50",     border: "border-red-100",     text: "text-red-600",     sub: "text-red-400"    },
    blue:    { bg: "bg-blue-50",    border: "border-blue-100",    text: "text-blue-700",    sub: "text-blue-500"   },
    violet:  { bg: "bg-violet-50",  border: "border-violet-100",  text: "text-violet-700",  sub: "text-violet-500" },
    gray:    { bg: "bg-gray-50",    border: "border-gray-100",    text: "text-gray-700",    sub: "text-gray-400"   },
  };
  const c = colors[color];
  return (
    <div className={`${c.bg} border ${c.border} rounded-2xl p-4`}>
      <p className={`text-[10px] font-bold uppercase tracking-widest ${c.sub} mb-2`}>{label}</p>
      <p className={`text-xl font-extrabold ${c.text} leading-none`}>{value}</p>
      {sub && <p className={`text-[11px] ${c.sub} mt-1.5`}>{sub}</p>}
    </div>
  );
}

// ── Range pill ────────────────────────────────────────────────────────────────
function RangePill({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
        active
          ? "bg-gray-900 text-white"
          : "bg-white text-gray-400 hover:text-gray-700 border border-gray-200"
      }`}
    >
      {label}
    </button>
  );
}

// ── Format helpers ─────────────────────────────────────────────────────────────
function fmtUSD(n) {
  if (!n) return "$—";
  if (n >= 1_000_000_000) return `$${(n / 1_000_000_000).toFixed(2)}B`;
  if (n >= 1_000_000)     return `$${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000)         return `$${(n / 1_000).toFixed(2)}K`;
  if (n < 0.01)           return `$${n.toFixed(8)}`;
  return `$${n.toFixed(2)}`;
}

function fmtChange(n) {
  if (n === undefined || n === null) return "—";
  const s = n >= 0 ? "+" : "";
  return `${s}${n.toFixed(2)}%`;
}

// ── GC Price History Chart ────────────────────────────────────────────────────
function GCPriceChart({ history, ethUSD }) {
  if (!history || history.length === 0) {
    return (
      <div className="h-36 flex flex-col items-center justify-center gap-2 text-gray-400">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>
        </svg>
        <p className="text-xs">No rate changes recorded yet</p>
        <p className="text-[11px] text-gray-300">Chart will appear after admin updates rates</p>
      </div>
    );
  }

  const points = history.map((h) => ({
    ts:      h.timestamp,
    buyUSD:  h.sellRate * ethUSD,
    label:   new Date(h.timestamp * 1000).toLocaleDateString([], { month: "short", day: "numeric" }),
  }));

  const W = 500, H = 100;
  const values = points.map((p) => p.buyUSD);
  const minV = Math.min(...values) * 0.9;
  const maxV = Math.max(...values) * 1.1;
  const range = maxV - minV || 1;

  const toX = (i) => points.length === 1 ? W / 2 : (i / (points.length - 1)) * W;
  const toY = (v) => H - ((v - minV) / range) * (H - 16) - 8;

  const pts   = points.map((p, i) => `${toX(i)},${toY(p.buyUSD)}`);
  const area  = `0,${H} ${pts.join(" ")} ${W},${H}`;
  const isUp  = points.length > 1 ? points[points.length - 1].buyUSD >= points[0].buyUSD : true;
  const color = isUp ? "#059669" : "#ef4444";

  return (
    <div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-36" preserveAspectRatio="none">
        <defs>
          <linearGradient id="gc-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor={color} stopOpacity="0.18" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        <polygon points={area} fill="url(#gc-grad)" />
        <polyline points={pts.join(" ")} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        {points.map((p, i) => (
          <circle key={i} cx={toX(i)} cy={toY(p.buyUSD)} r={i === points.length - 1 ? 5 : 3} fill={color} fillOpacity={i === points.length - 1 ? 1 : 0.5} />
        ))}
      </svg>
      {points.length <= 10 && (
        <div className="flex justify-between px-1 mt-1">
          {points.map((p, i) => (
            <span key={i} className="text-[9px] text-gray-400">{p.label}</span>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
const RANGES = [
  { label: "1D", days: 1 },
  { label: "7D", days: 7 },
  { label: "1M", days: 30 },
  { label: "3M", days: 90 },
];

export default function MarketTab({ rates, loadRatesHistory }) {
  const [ethData,      setEthData]      = useState(null);
  const [chart,        setChart]        = useState([]);
  const [range,        setRange]        = useState(7);
  const [loading,      setLoading]      = useState(true);
  const [gcHistory,    setGcHistory]    = useState([]);
  const [gcLoading,    setGcLoading]    = useState(true);
  const [error,    setError]    = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);

  const load = useCallback(async (days = 7) => {
    try {
      setLoading(true);
      setError(null);
      const [price, chartData] = await Promise.all([fetchEthPrice(), fetchEthChart(days)]);
      setEthData(price);
      setChart(chartData);
      setLastUpdate(new Date());
    } catch (e) {
      setError("Failed to load market data from Binance. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(range); }, [range]);

  // Auto-refresh every 60 seconds
  useEffect(() => {
    const id = setInterval(() => load(range), 60_000);
    return () => clearInterval(id);
  }, [range, load]);

  // Load GC rate history from contract events
  useEffect(() => {
    if (!loadRatesHistory) return;
    setGcLoading(true);
    loadRatesHistory().then((h) => { setGcHistory(h); setGcLoading(false); });
  }, [loadRatesHistory]);

  const ethUSD   = ethData?.usd ?? 0;
  const change24 = ethData?.usd_24h_change ?? null;
  const mcap     = ethData?.usd_market_cap ?? 0;
  const vol24    = ethData?.usd_24h_vol ?? 0;
  const isUp     = (change24 ?? 0) >= 0;

  // GC prices derived from contract rates × ETH/USD
  const gcBuyUSD  = ethUSD * parseFloat(rates?.sell ?? 0);  // what user pays
  const gcSellUSD = ethUSD * parseFloat(rates?.buy  ?? 0);  // what user gets

  return (
    <div className="max-w-4xl space-y-5 animate-fade-up">

      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-extrabold text-gray-900">Market</h2>
          <p className="text-xs text-gray-400 mt-0.5">
            {lastUpdate
              ? `Updated ${lastUpdate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} · auto-refresh every 60s`
              : "Loading live data…"}
          </p>
        </div>
        <button
          onClick={() => load(range)}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 hover:border-gray-300 rounded-xl text-xs font-semibold text-gray-600 transition-all hover:-translate-y-px disabled:opacity-50"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={loading ? "animate-spin" : ""}>
            <polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/>
            <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
          </svg>
          Refresh
        </button>
      </div>

      {/* ── Error ── */}
      {error && (
        <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-100 rounded-2xl">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* ── ETH Hero card ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 pt-5 pb-3">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              {/* ETH logo */}
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-sm">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2L4 12.5L12 16L20 12.5L12 2Z" fill="white" fillOpacity="0.9"/>
                  <path d="M4 12.5L12 22L20 12.5L12 16L4 12.5Z" fill="white" fillOpacity="0.6"/>
                </svg>
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">Ethereum</p>
                <p className="text-xs text-gray-400">ETH · Sepolia Testnet</p>
              </div>
            </div>
            <div className="text-right">
              {loading && !ethData ? (
                <div className="h-8 w-32 bg-gray-100 rounded-lg animate-pulse" />
              ) : (
                <>
                  <p className="text-3xl font-extrabold text-gray-900">{fmtUSD(ethUSD)}</p>
                  <div className={`flex items-center gap-1.5 justify-end mt-1 ${isUp ? "text-emerald-600" : "text-red-500"}`}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      {isUp ? <path d="M12 19V5M5 12l7-7 7 7" /> : <path d="M12 5v14M5 12l7 7 7-7" />}
                    </svg>
                    <span className="text-sm font-bold">{fmtChange(change24)}</span>
                    <span className="text-xs text-gray-400">24h</span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Range selector */}
          <div className="flex items-center gap-1.5 mb-3">
            {RANGES.map(({ label, days }) => (
              <RangePill key={label} label={label} active={range === days} onClick={() => setRange(days)} />
            ))}
          </div>
        </div>

        {/* Chart */}
        <div className="px-4 pb-4">
          {loading && chart.length === 0 ? (
            <div className="h-32 bg-gray-50 rounded-xl animate-pulse" />
          ) : (
            <PriceChart data={chart} />
          )}
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 border-t border-gray-50">
          {[
            { label: "24h Volume (USDT)", value: fmtUSD(vol24) },
            { label: "24h Change",        value: fmtChange(change24), colored: true },
          ].map(({ label, value, colored }) => (
            <div key={label} className="px-5 py-3.5 border-r border-gray-50 last:border-r-0">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{label}</p>
              <p className={`text-sm font-bold ${colored ? (isUp ? "text-emerald-600" : "text-red-500") : "text-gray-900"}`}>{value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── GC Token Pricing ── */}
      <div>
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1 mb-3">Gym Coin (GC) Pricing</p>
        <div className="grid grid-cols-2 gap-4">

          {/* Buy price */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 5v14M5 12l7 7 7-7"/>
                </svg>
              </div>
              <div>
                <p className="text-xs font-bold text-gray-900">Buy Price</p>
                <p className="text-[11px] text-gray-400">What you pay per GC</p>
              </div>
            </div>
            <p className="text-2xl font-extrabold text-gray-900 mb-1">
              {loading && !ethData ? "—" : fmtUSD(gcBuyUSD)}
            </p>
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-gray-400">≈</span>
              <span className="text-xs font-semibold text-gray-600">{parseFloat(rates?.sell ?? 0).toFixed(6)} ETH</span>
              <span className="text-xs text-gray-400">/ GC</span>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-50">
              <p className="text-[11px] text-gray-400">100 GC costs</p>
              <p className="text-sm font-bold text-emerald-700">
                {loading && !ethData ? "—" : fmtUSD(gcBuyUSD * 100)}
                <span className="text-xs font-normal text-gray-400 ml-1">≈ {(parseFloat(rates?.sell ?? 0) * 100).toFixed(6)} ETH</span>
              </p>
            </div>
          </div>

          {/* Sell price */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-50 border border-red-100 rounded-xl flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 19V5M5 12l7-7 7 7"/>
                </svg>
              </div>
              <div>
                <p className="text-xs font-bold text-gray-900">Sell Price</p>
                <p className="text-[11px] text-gray-400">What you receive per GC</p>
              </div>
            </div>
            <p className="text-2xl font-extrabold text-gray-900 mb-1">
              {loading && !ethData ? "—" : fmtUSD(gcSellUSD)}
            </p>
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-gray-400">≈</span>
              <span className="text-xs font-semibold text-gray-600">{parseFloat(rates?.buy ?? 0).toFixed(6)} ETH</span>
              <span className="text-xs text-gray-400">/ GC</span>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-50">
              <p className="text-[11px] text-gray-400">100 GC earns</p>
              <p className="text-sm font-bold text-red-600">
                {loading && !ethData ? "—" : fmtUSD(gcSellUSD * 100)}
                <span className="text-xs font-normal text-gray-400 ml-1">≈ {(parseFloat(rates?.buy ?? 0) * 100).toFixed(6)} ETH</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── GC Price History ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 pt-5 pb-3">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center shadow-sm">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
                </svg>
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">Gym Coin (GC)</p>
                <p className="text-xs text-gray-400">Price history from on-chain rate changes</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-extrabold text-gray-900">{fmtUSD(gcBuyUSD)}</p>
              <p className="text-xs text-gray-400 mt-0.5">Current buy price</p>
            </div>
          </div>
        </div>

        <div className="px-4 pb-2">
          {gcLoading ? (
            <div className="h-36 flex items-center justify-center">
              <div className="w-6 h-6 border-2 border-gray-200 border-t-emerald-500 rounded-full animate-spin" />
            </div>
          ) : (
            <GCPriceChart history={gcHistory} ethUSD={ethUSD} />
          )}
        </div>

        <div className="grid grid-cols-3 border-t border-gray-50">
          {[
            { label: "Rate Changes", value: gcHistory.length === 0 ? "0" : gcHistory.length.toString() },
            { label: "Buy Price",    value: fmtUSD(gcBuyUSD)  },
            { label: "Sell Price",   value: fmtUSD(gcSellUSD) },
          ].map(({ label, value }) => (
            <div key={label} className="px-5 py-3.5 border-r border-gray-50 last:border-r-0">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{label}</p>
              <p className="text-sm font-bold text-gray-900">{value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Spread info ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <p className="text-sm font-bold text-gray-900 mb-4">Spread Analysis</p>
        <div className="grid grid-cols-3 gap-4">
          <StatCard
            label="Spread (ETH)"
            value={`${(parseFloat(rates?.sell ?? 0) - parseFloat(rates?.buy ?? 0)).toFixed(6)}`}
            sub="Buy rate − Sell rate"
            color="blue"
          />
          <StatCard
            label="Spread (USD)"
            value={loading && !ethData ? "—" : fmtUSD(Math.abs(gcBuyUSD - gcSellUSD))}
            sub="Per 1 GC token"
            color="violet"
          />
          <StatCard
            label="Spread %"
            value={parseFloat(rates?.buy ?? 0) > 0
              ? `${(((parseFloat(rates?.sell ?? 0) - parseFloat(rates?.buy ?? 0)) / parseFloat(rates?.sell ?? 0)) * 100).toFixed(2)}%`
              : "—"}
            sub="Platform fee equivalent"
            color="gray"
          />
        </div>

        <div className="mt-4 flex items-start gap-3 p-3.5 bg-blue-50 border border-blue-100 rounded-xl">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 mt-0.5">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          <p className="text-xs text-blue-700">
            The spread is the difference between buy and sell rates. It represents the platform's margin.
            ETH prices are fetched live from <span className="font-semibold">Binance</span>.
            GC prices are calculated using the current contract rates.
          </p>
        </div>
      </div>

      {/* ── Data source ── */}
      <div className="flex items-center justify-center gap-2 text-[11px] text-gray-400">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
        </svg>
        Live data from Binance · Contract rates from Sepolia Testnet
      </div>
    </div>
  );
}
