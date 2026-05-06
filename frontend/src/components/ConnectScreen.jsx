const BENEFITS = [
  {
    icon: (
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    ),
    label: "Secure",
    desc: "Smart contract protected on Ethereum",
  },
  {
    icon: (
      <>
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
      </>
    ),
    label: "Transparent",
    desc: "Every transaction is publicly verifiable",
  },
  {
    icon: <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />,
    label: "Fast",
    desc: "Confirmed in seconds on Sepolia",
  },
  {
    icon: (
      <>
        <circle cx="12" cy="5" r="2" />
        <circle cx="5" cy="19" r="2" />
        <circle cx="19" cy="19" r="2" />
        <path d="M12 7v4M5 17l5-4M19 17l-5-4" />
      </>
    ),
    label: "Decentralized",
    desc: "No central authority or middlemen",
  },
];

export default function ConnectScreen({ onConnect, message }) {
  return (
    <div className="min-h-screen bg-[#FAFAF8] flex">
      {/* Left */}
      <div className="hidden lg:flex flex-col justify-between w-[480px] bg-white border-r border-gray-100 p-12">
        <div>
          {/* Logo */}
          <div className="flex items-center gap-3 mb-16">
            <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
              </svg>
            </div>
            <span className="text-lg font-bold text-gray-900 tracking-tight">Gym Credit Token</span>
          </div>

          <h1 className="text-4xl font-bold text-gray-900 leading-tight mb-4">
            The smarter way to manage gym credits.
          </h1>
          <p className="text-gray-500 text-lg leading-relaxed mb-12">
            Buy, sell, and transfer GC tokens on the Sepolia testnet. Powered by Ethereum smart contracts.
          </p>

          <div className="space-y-6">
            {BENEFITS.map((b) => (
              <div key={b.label} className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center flex-shrink-0">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    {b.icon}
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{b.label}</p>
                  <p className="text-gray-500 text-sm mt-0.5">{b.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="text-xs text-gray-400">
          Gym Credit Token System &copy; 2024 · Sepolia Testnet
        </p>
      </div>

      {/* Right */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Logo mobile */}
          <div className="flex items-center gap-3 mb-10 lg:hidden">
            <div className="w-9 h-9 bg-emerald-600 rounded-xl flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
              </svg>
            </div>
            <span className="text-base font-bold text-gray-900">Gym Credit Token</span>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-1">Connect your wallet</h2>
          <p className="text-gray-500 text-sm mb-8">Select a wallet to get started on Sepolia Testnet</p>

          {/* Wallet card */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden mb-4">
            <div className="p-6">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Available Wallets</p>

              <button
                onClick={onConnect}
                className="w-full flex items-center gap-4 p-4 rounded-xl border border-gray-200 hover:border-emerald-400 hover:bg-emerald-50/40 transition-all duration-200 group"
              >
                {/* MetaMask fox SVG */}
                <div className="w-12 h-12 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center flex-shrink-0">
                  <svg width="28" height="28" viewBox="0 0 318.6 318.6" fill="none">
                    <polygon fill="#E2761B" stroke="#E2761B" strokeLinecap="round" strokeLinejoin="round" points="274.1,35.5 174.6,109.4 193,65.8"/>
                    <polygon fill="#E4761B" stroke="#E4761B" strokeLinecap="round" strokeLinejoin="round" points="44.4,35.5 143.1,110.1 125.6,65.8"/>
                    <polygon fill="#D7C1B3" stroke="#D7C1B3" strokeLinecap="round" strokeLinejoin="round" points="238.3,206.8 211.8,247.4 268.5,263 284.8,207.7"/>
                    <polygon fill="#D7C1B3" stroke="#D7C1B3" strokeLinecap="round" strokeLinejoin="round" points="33.9,207.7 50.1,263 106.8,247.4 80.3,206.8"/>
                    <polygon fill="#D7C1B3" stroke="#D7C1B3" strokeLinecap="round" strokeLinejoin="round" points="103.6,138.2 87.8,162.1 144.1,164.6 142.1,104.1"/>
                    <polygon fill="#D7C1B3" stroke="#D7C1B3" strokeLinecap="round" strokeLinejoin="round" points="214.9,138.2 175.9,103.4 174.6,164.6 230.8,162.1"/>
                    <polygon fill="#E4761B" stroke="#E4761B" strokeLinecap="round" strokeLinejoin="round" points="106.8,247.4 140.6,230.9 111.4,208.1"/>
                    <polygon fill="#E4761B" stroke="#E4761B" strokeLinecap="round" strokeLinejoin="round" points="177.9,230.9 211.8,247.4 207.1,208.1"/>
                  </svg>
                </div>
                <div className="text-left flex-1">
                  <p className="font-semibold text-gray-900 text-sm">MetaMask</p>
                  <p className="text-xs text-gray-400 mt-0.5">Connect using browser extension</p>
                </div>
                <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center group-hover:bg-emerald-600 transition-colors">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="group-hover:stroke-white transition-colors">
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </div>
              </button>
            </div>

            {/* Network selector */}
            <div className="px-6 pb-6">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Network</p>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 flex-shrink-0" />
                <span className="text-sm font-medium text-gray-700">Sepolia Testnet</span>
                <span className="ml-auto text-xs text-gray-400 bg-white border border-gray-200 px-2 py-0.5 rounded-md">Chain ID: 11155111</span>
              </div>
            </div>
          </div>

          {/* Help card */}
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1d4ed8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 16v-4M12 8h.01" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-blue-900">New to Web3?</p>
              <p className="text-xs text-blue-700 mt-0.5">Install MetaMask browser extension, create a wallet, and get Sepolia ETH from a faucet to get started.</p>
            </div>
          </div>

          {message && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
              {message.text}
            </div>
          )}

          <p className="text-xs text-gray-400 text-center mt-6">
            By connecting, you agree to our{" "}
            <span className="text-gray-600 underline cursor-pointer">Terms of Service</span>
            {" "}and{" "}
            <span className="text-gray-600 underline cursor-pointer">Privacy Policy</span>
          </p>
        </div>
      </div>
    </div>
  );
}
