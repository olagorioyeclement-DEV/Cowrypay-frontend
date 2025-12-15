import { useEffect, useState, useRef, useCallback } from "react";
import API from "../api";
import { format } from "date-fns";

function Tab({ label, active, onClick }) {
  return (
    <button
      className={`px-3 py-1 rounded-full ${active ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700"}`}
      onClick={onClick}
    >
      {label}
    </button>
  );
}

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [page, setPage] = useState(1);
  const [nextPageExists, setNextPageExists] = useState(true);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [q, setQ] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [selectedTx, setSelectedTx] = useState(null);
  const observerRef = useRef();
  const sentinelRef = useRef();

  const buildParams = (pageNumber = 1) => {
    const params = new URLSearchParams();
    params.append("page", pageNumber);
    params.append("page_size", 10);
    if (filterType !== "all") params.append("type", filterType);
    if (q) params.append("q", q);
    if (dateFrom) params.append("date_from", dateFrom);
    if (dateTo) params.append("date_to", dateTo);
    return params.toString();
  };

  const fetchTransactions = async (pageNumber = 1, append = false) => {
    try {
      append ? setLoadingMore(true) : setLoading(true);
      setError("");

      const res = await API.get(`/transactions/?${buildParams(pageNumber)}`);
      const data = res.data.results || res.data || [];

      if (append) setTransactions((prev) => [...prev, ...data]);
      else setTransactions(data);

      setNextPageExists(Boolean(res.data.next));
      setPage(pageNumber);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to load transactions");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchTransactions(1, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterType, q, dateFrom, dateTo]);

  const handleObserver = useCallback(
    (entries) => {
      const target = entries[0];
      if (target.isIntersecting && !loadingMore && nextPageExists) {
        fetchTransactions(page + 1, true);
      }
    },
    [page, loadingMore, nextPageExists]
  );

  useEffect(() => {
    observerRef.current = new IntersectionObserver(handleObserver, { root: null, rootMargin: "200px", threshold: 0.1 });
    const current = observerRef.current;
    const el = sentinelRef.current;
    if (el) current.observe(el);
    return () => current.disconnect();
  }, [handleObserver]);

  const openTx = async (tx) => {
    try {
      const res = await API.get(`/transactions/${tx.reference}/`);
      setSelectedTx(res.data);
    } catch (err) {
      setError("Could not load transaction details");
    }
  };

  const copyRef = async (ref) => {
    try {
      await navigator.clipboard.writeText(ref);
      alert("Reference copied!");
    } catch (err) {
      console.error("Failed to copy reference:", err);
      alert("Failed to copy reference");
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Transaction History</h1>

      {/* Controls */}
      <div className="mb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div className="flex gap-2">
          <Tab label="All" active={filterType === "all"} onClick={() => setFilterType("all")} />
          <Tab label="Money In" active={filterType === "credit"} onClick={() => setFilterType("credit")} />
          <Tab label="Money Out" active={filterType === "debit"} onClick={() => setFilterType("debit")} />
        </div>

        <div className="flex gap-2 items-center">
          <input
            type="text"
            placeholder="Search by ref or description"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="border p-2 rounded w-60"
          />
          <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="border p-2 rounded" />
          <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className="border p-2 rounded" />
          <button
            onClick={() => {
              setQ("");
              setDateFrom("");
              setDateTo("");
            }}
            className="bg-gray-200 p-2 rounded"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Error */}
      {error && transactions.length === 0 && <div className="text-red-600 mb-4">{error}</div>}

      {/* List */}
      <div className="space-y-3">
        {loading && <div className="p-6 text-center">Loading…</div>}

        {!loading && transactions.length === 0 && <div className="p-6 text-center text-gray-500">No transactions found</div>}

        {transactions.map((tx) => (
          <div key={tx.transaction_id} className="border rounded-lg p-4 bg-white shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-3">
                  <span className={`font-semibold ${tx.transaction_type === "credit" ? "text-green-600" : "text-red-600"}`}>
                    {tx.transaction_type === "credit" ? "+" : "-"}Ϛ{tx.amount}
                  </span>
                  <small className="text-gray-500">• {tx.reference}</small>
                </div>
                <p className="mt-2 text-gray-700">{tx.description}</p>
              </div>

              <div className="text-right flex flex-col items-end gap-2">
                <small className="text-gray-500">{new Date(tx.timestamp).toLocaleString()}</small>
                <div className="flex gap-2">
                  <button onClick={() => copyRef(tx.reference)} className="text-blue-600 text-sm">
                    Copy ref
                  </button>
                  <button onClick={() => openTx(tx)} className="bg-blue-600 text-white px-3 py-1 rounded text-sm">
                    Details
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Infinite scroll sentinel */}
      <div ref={sentinelRef} className="h-8" />

      {loadingMore && <div className="text-center mt-3">Loading more…</div>}

      {/* Transaction detail modal with narration */}
      {selectedTx && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-xl w-full p-6 relative">
            <button onClick={() => setSelectedTx(null)} className="absolute top-3 right-3 text-gray-500">
              Close
            </button>

            <h3 className="text-xl font-bold mb-2">Transaction Details</h3>
            <p className="text-sm text-gray-500 mb-4">Ref: {selectedTx.reference}</p>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="text-gray-500 text-sm">Amount</div>
                <div className="font-semibold">Ϛ{selectedTx.amount}</div>
              </div>
              <div>
                <div className="text-gray-500 text-sm">Type</div>
                <div className="font-semibold">{selectedTx.transaction_type}</div>
              </div>
              <div>
                <div className="text-gray-500 text-sm">Date</div>
                <div>{new Date(selectedTx.timestamp).toLocaleString()}</div>
              </div>
              <div>
                <div className="text-gray-500 text-sm">Reference</div>
                <div className="flex items-center gap-2">
                  <span className="font-mono">{selectedTx.reference}</span>
                  <button onClick={() => navigator.clipboard.writeText(selectedTx.reference)} className="text-blue-600 text-sm">
                    Copy
                  </button>
                </div>
              </div>
              <div className="col-span-2">
                <div className="text-gray-500 text-sm">Description</div>
                <div className="mt-1">{selectedTx.description}</div>
              </div>
              <div className="col-span-2">
                <div className="text-gray-500 text-sm">Narration</div>
                <div className="mt-1">{selectedTx.narration || "—"}</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
