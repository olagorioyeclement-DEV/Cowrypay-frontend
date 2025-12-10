import { useEffect, useState } from "react";
import API from "../api";

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedRef, setCopiedRef] = useState(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await API.get("/transactions/");
        setTransactions(res.data);
      } catch (err) {
        console.error(err.response?.data);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  const copyToClipboard = (ref) => {
    navigator.clipboard.writeText(ref);
    setCopiedRef(ref);
    setTimeout(() => setCopiedRef(null), 1500);
  };

  if (loading)
    return <div className="p-6 text-center text-gray-600">Loading…</div>;

  if (transactions.length === 0)
    return <div className="p-6 text-center text-gray-500">No transactions found</div>;

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-5">Transaction History</h1>

      <div className="space-y-4">
        {transactions.map((tx) => (
          <div
            key={tx.transaction_id}
            className="border rounded-lg p-4 shadow-sm bg-white"
          >
            <div className="flex justify-between items-center">
              <span
                className={`font-bold ${
                  tx.transaction_type === "credit"
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {tx.transaction_type === "credit" ? "+" : "-"}Ϛ{tx.amount}
              </span>

              <small className="text-gray-500">
                {new Date(tx.timestamp).toLocaleString()}
              </small>
            </div>

            <p className="mt-2 text-gray-700">{tx.description}</p>

            <div className="mt-2 flex items-center justify-between">
              <small className="text-gray-500">Ref: {tx.reference}</small>

              <button
                onClick={() => copyToClipboard(tx.reference)}
                className="text-blue-600 text-sm"
              >
                {copiedRef === tx.reference ? "Copied!" : "Copy"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
