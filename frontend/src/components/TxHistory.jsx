import { SEPOLIA_EXPLORER } from "../constants";

const TYPE_STYLES = {
  buy: "bg-emerald-500/10 text-emerald-400",
  sell: "bg-red-500/10 text-red-400",
  transfer: "bg-blue-500/10 text-blue-400",
  received: "bg-purple-500/10 text-purple-400",
};

const TYPE_LABELS = {
  buy: "Buy",
  sell: "Sell",
  transfer: "Sent",
  received: "Received",
};

function shortAddr(addr) {
  return addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : "";
}

export default function TxHistory({ txHistory }) {
  if (!txHistory.length) return null;

  return (
    <div className="bg-[rgba(20,20,30,0.6)] backdrop-blur-xl border border-white/10 rounded-2xl p-7 mb-6">
      <h3 className="text-lg font-semibold mb-4 text-white">Recent Transactions</h3>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              {["Type", "Amount", "Details", "Time", "Tx"].map((h) => (
                <th
                  key={h}
                  className="text-left py-3 px-3 text-xs text-gray-500 border-b border-white/10 uppercase tracking-wider font-semibold"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {txHistory.map((tx, i) => (
              <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                <td className="py-3.5 px-3 text-sm border-b border-white/10">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${TYPE_STYLES[tx.type]}`}>
                    {TYPE_LABELS[tx.type]}
                  </span>
                </td>
                <td
                  className={`py-3.5 px-3 text-sm font-semibold border-b border-white/10 ${
                    tx.type === "buy" || tx.type === "received" ? "text-emerald-400" : "text-red-400"
                  }`}
                >
                  {tx.type === "buy" || tx.type === "received" ? "+" : "-"}
                  {parseFloat(tx.gcAmount).toFixed(2)} GC
                </td>
                <td className="py-3.5 px-3 text-sm text-gray-400 border-b border-white/10">
                  {(tx.type === "buy" || tx.type === "sell") && `${parseFloat(tx.ethAmount).toFixed(6)} ETH`}
                  {tx.type === "transfer" && `To: ${shortAddr(tx.to)}`}
                  {tx.type === "received" && `From: ${shortAddr(tx.from)}`}
                </td>
                <td className="py-3.5 px-3 text-xs text-gray-500 border-b border-white/10 whitespace-nowrap">
                  {tx.timestamp}
                </td>
                <td className="py-3.5 px-3 border-b border-white/10">
                  {tx.txHash && (
                    <a
                      href={`${SEPOLIA_EXPLORER}/tx/${tx.txHash}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-violet-400 hover:text-violet-300 underline underline-offset-2"
                    >
                      View
                    </a>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
