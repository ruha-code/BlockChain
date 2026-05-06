import { useState } from "react";
import { ethers } from "ethers";
import { PrimaryButton } from "./BuyTab";

const QUICK = [100, 500, 1000, 5000];

const TIPS = [
  "Double-check the recipient address — transactions are irreversible.",
  "Transfers are processed in real-time on the Sepolia network.",
  "Only send to wallets that support ERC-20 tokens.",
];

const TIP_ICONS = [
  <><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></>,
  <><circle cx="12" cy="12" r="10" /><path d="M12 8v4l3 3" /></>,
  <><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></>,
];

export default function TransferTab({ balance, account, onTransfer, loading }) {
  const [to, setTo]         = useState("");
  const [amount, setAmount] = useState("");
  const [selected, setSelected] = useState(null);
  const [copied, setCopied]   = useState(false);

  const isValidAddr = to.startsWith("0x") && to.length === 42 && ethers.isAddress(to);
  const maxGc       = Math.floor(parseFloat(balance));
  const gcInt       = Math.max(0, Math.floor(Number(amount) || 0));
  const overMax     = gcInt > maxGc && gcInt > 0;
  const isValid     = isValidAddr && gcInt > 0 && !overMax;
  const fee         = 0.0001;
  const shortAddr   = (a) => a ? `${a.slice(0, 6)}…${a.slice(-4)}` : "—";

  const pick = (n) => { setAmount(n.toString()); setSelected(n); };
  const handleChange = (e) => { setAmount(e.target.value); setSelected(null); };

  const handleTransfer = () => {
    if (!isValid) return;
    onTransfer(to, gcInt.toString());
    setTo(""); setAmount(""); setSelected(null);
  };

  const copyAddr = () => {
    navigator.clipboard.writeText(account);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="max-w-5xl animate-fade-up">
      <div className="grid grid-cols-5 gap-5">

        {/* ── Left: Form ── */}
        <div className="col-span-3 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {/* Header */}
          <div className="px-6 pt-6 pb-5 border-b border-gray-50">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-blue-50 border border-blue-100 rounded-xl flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M14 6l6 6-6 6" />
                </svg>
              </div>
              <div>
                <h2 className="text-base font-bold text-gray-900">Transfer Gym Coin</h2>
                <p className="text-xs text-gray-400 mt-0.5">Send GC tokens to any address on Sepolia Testnet</p>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-5">
            {/* Recipient Address */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Recipient Address</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="0x..."
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  className={`w-full px-4 py-3.5 border rounded-xl text-sm font-mono placeholder:text-gray-300 placeholder:font-sans focus:outline-none focus:ring-3 transition-all cursor-text pr-14 ${
                    to && !isValidAddr
                      ? "border-red-300 focus:ring-red-500/10 focus:border-red-400 bg-red-50/20"
                      : isValidAddr
                      ? "border-emerald-300 focus:ring-emerald-500/10 focus:border-emerald-400"
                      : "border-gray-200 hover:border-gray-300 focus:border-blue-400 focus:ring-blue-500/10"
                  } text-gray-900`}
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  {isValidAddr ? (
                    <div className="w-7 h-7 bg-emerald-50 border border-emerald-100 rounded-lg flex items-center justify-center">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                  ) : (
                    <div className="w-7 h-7 bg-blue-50 border border-blue-100 rounded-lg flex items-center justify-center">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="8.5" cy="7" r="4" /><line x1="20" y1="8" x2="20" y2="14" /><line x1="23" y1="11" x2="17" y2="11" />
                      </svg>
                    </div>
                  )}
                </div>
              </div>
              {to && !isValidAddr && (
                <p className="text-xs text-red-500 mt-1.5 font-medium">Invalid Ethereum address</p>
              )}
              {!to && (
                <p className="text-[11px] text-gray-400 mt-1.5">Make sure the address supports ERC-20 tokens</p>
              )}
            </div>

            {/* Amount */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-gray-700">Amount in GC</label>
                <span className="text-[11px] text-gray-400">
                  Balance: <span className="font-bold text-blue-600">{parseFloat(balance).toFixed(2)} GC</span>
                </span>
              </div>
              <div className="relative">
                <input
                  type="number"
                  placeholder="0"
                  min="1"
                  max={maxGc}
                  step="1"
                  value={amount}
                  onChange={handleChange}
                  className={`w-full px-4 py-3.5 border rounded-xl text-xl font-bold pr-20 transition-all placeholder:font-normal placeholder:text-gray-300 focus:outline-none cursor-text ${
                    overMax
                      ? "border-red-300 bg-red-50/30 focus:border-red-400 focus:ring-3 focus:ring-red-500/10 text-red-600"
                      : "bg-white border-gray-200 text-gray-900 hover:border-gray-300 focus:border-blue-400 focus:ring-3 focus:ring-blue-500/10"
                  }`}
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 bg-emerald-50 border border-emerald-100 rounded-lg px-2.5 py-1">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                  </svg>
                  <span className="text-xs font-bold text-emerald-700">GC</span>
                </div>
              </div>

              {/* Quick pills + MAX */}
              <div className="flex gap-2 mt-2.5 flex-wrap">
                {QUICK.map((n) => (
                  <button
                    key={n}
                    onClick={() => pick(n)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer hover:-translate-y-px ${
                      selected === n
                        ? "bg-blue-600 text-white border-blue-600 shadow-sm shadow-blue-600/20"
                        : "bg-white text-gray-500 border-gray-200 hover:border-blue-300 hover:text-blue-600"
                    }`}
                  >
                    {n.toLocaleString()} GC
                  </button>
                ))}
                <button
                  onClick={() => pick(maxGc)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer hover:-translate-y-px ${
                    selected === maxGc
                      ? "bg-blue-600 text-white border-blue-600 shadow-sm shadow-blue-600/20"
                      : "bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100"
                  }`}
                >
                  MAX
                </button>
              </div>

              {overMax && (
                <p className="flex items-center gap-1.5 text-xs text-red-500 font-medium mt-2">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  Exceeds available balance ({maxGc.toLocaleString()} GC)
                </p>
              )}
            </div>

            {/* Max transferable info pill */}
            {!overMax && (
              <div className="flex items-center justify-between px-4 py-3 bg-blue-50 border border-blue-100 rounded-xl">
                <div className="flex items-center gap-2.5">
                  <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-blue-700">Max transferable</p>
                    <p className="text-[11px] text-blue-500">You can transfer up to {maxGc.toLocaleString()}.00 GC</p>
                  </div>
                </div>
                <span className="text-sm font-extrabold text-blue-700">{maxGc.toLocaleString()}.00 GC</span>
              </div>
            )}
          </div>

          {/* Transaction Summary */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 space-y-2.5">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Transaction Summary</p>
            {[
              { label: "You Send",           value: gcInt > 0 ? `${gcInt.toLocaleString()} GC` : "0 GC" },
              { label: "Recipient",          value: isValidAddr ? shortAddr(to) : "—", mono: true },
              { label: "Network Fee (est.)", value: `~${fee} ETH` },
            ].map(({ label, value, mono }) => (
              <div key={label} className="flex justify-between">
                <span className="text-xs text-gray-400">{label}</span>
                <span className={`text-xs font-semibold text-gray-600 ${mono ? "font-mono" : ""}`}>{value}</span>
              </div>
            ))}
            <div className="h-px bg-gray-200 my-1" />
            <div className="flex justify-between">
              <span className="text-xs font-bold text-gray-700">Total</span>
              <span className="text-xs font-extrabold text-blue-600">
                {gcInt > 0 ? `${gcInt.toLocaleString()} GC` : "0 GC"}
              </span>
            </div>
          </div>

          {/* CTA */}
          <div className="px-6 py-5 space-y-3">
            <PrimaryButton onClick={handleTransfer} disabled={!isValid} loading={loading} color="blue">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M14 6l6 6-6 6" />
              </svg>
              Transfer GC
            </PrimaryButton>
            <div className="flex items-center justify-center gap-1.5">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <span className="text-[11px] text-gray-400">Secure transaction via MetaMask</span>
            </div>
          </div>
        </div>

        {/* ── Right: Info ── */}
        <div className="col-span-2 space-y-4">

          {/* Before you send */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <p className="text-sm font-bold text-gray-900 mb-4">Before you send</p>
            <div className="space-y-4">
              {TIPS.map((text, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      {TIP_ICONS[i]}
                    </svg>
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed">{text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Your Wallet */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <p className="text-sm font-bold text-gray-900 mb-4">Your Wallet</p>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">GC Balance</span>
                <span className="text-sm font-extrabold text-gray-900">{parseFloat(balance).toFixed(2)} GC</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">Wallet Address</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-mono font-semibold text-gray-600">{shortAddr(account)}</span>
                  <button
                    onClick={copyAddr}
                    className="w-6 h-6 rounded-md hover:bg-gray-100 flex items-center justify-center transition-colors cursor-pointer"
                    title="Copy address"
                  >
                    {copied ? (
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    ) : (
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
              <div className="h-px bg-gray-100" />
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">Max Transferable</span>
                <span className="text-xs font-bold text-blue-600">{maxGc.toLocaleString()}.00 GC</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">Network</span>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span className="text-xs font-semibold text-gray-700">Sepolia Testnet</span>
                </div>
              </div>
            </div>
          </div>

          {/* Irreversible warning */}
          <div className="bg-red-50 border border-red-100 rounded-2xl p-5">
            <div className="flex items-start gap-2.5">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 mt-0.5">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
              <div>
                <p className="text-xs font-bold text-red-700 mb-1">Irreversible Action</p>
                <p className="text-xs text-red-600 leading-relaxed">
                  Blockchain transfers cannot be undone.<br />Verify the address before confirming.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
