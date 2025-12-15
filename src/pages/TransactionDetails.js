import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api";

export default function TransactionDetails() {
  const { id } = useParams(); // can be numeric or reference
  const [tx, setTx] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch single transaction
  useEffect(() => {
    const fetchTransaction = async () => {
      try {
        const res = await API.get(`/transactions/${id}/`);
        setTx(res.data);
      } catch (err) {
        console.error(err);
        alert("Could not load transaction details");
      } finally {
        setLoading(false);
      }
    };
    fetchTransaction();
  }, [id]);

  // Copy reference to clipboard
  const copyRef = async (ref) => {
    if (!ref) return alert("Reference not available");
    try {
      await navigator.clipboard.writeText(ref);
      alert("Reference copied!");
    } catch {
      alert("Failed to copy reference");
    }
  };

  if (loading) return <div className="p-6 text-center">Loading…</div>;
  if (!tx) return <div className="p-6 text-center">Transaction not found</div>;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="text-blue-600 mb-4 hover:underline"
      >
        Back
      </button>

      <h1 className="text-2xl font-bold mb-4">Transaction Details</h1>

      <div className="border rounded-lg bg-white p-4 space-y-3 shadow-sm">
        <p><strong>Amount:</strong> Ϛ{tx.amount}</p>
        <p><strong>Type:</strong> {tx.transaction_type}</p>
        <p><strong>Date:</strong> {new Date(tx.timestamp).toLocaleString()}</p>
        <p><strong>Description:</strong> {tx.description || "—"}</p>
        <p><strong>Narration:</strong> {tx.narration || "—"}</p>
        <p>
          <strong>Reference:</strong>{" "}
          <span className="font-mono">{tx.reference}</span>{" "}
          <button
            onClick={() => copyRef(tx.reference)}
            className="text-blue-600 text-sm ml-2 hover:underline"
          >
            Copy
          </button>
        </p>
      </div>
    </div>
  );
}


