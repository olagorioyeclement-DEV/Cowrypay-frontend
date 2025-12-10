import { useState } from "react";
import API from "../api";

export default function Transfer() {
  const [receiver, setReceiver] = useState("");
  const [receiverName, setReceiverName] = useState(null);
  const [amount, setAmount] = useState("");
  const [pin, setPin] = useState("");
  const [narration, setNarration] =useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [checking, setChecking] = useState(false);

  // Auto-check tagname
  const verifyReceiver = async () => {
    setReceiverName(null);
    setError("");
    if (!receiver.trim()) return;

    setChecking(true);
    try {
      const res = await API.get(`/verify-tag/?tagname=${receiver}`);
      setReceiverName(res.data.fullname);
    } catch (err) {
      setReceiverName(null);
      setError(err.response?.data?.error || "Receiver not found");
    } finally {
      setChecking(false);
    }
  };

  const handleTransfer = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!receiverName) {
      setError("Please enter a valid tagname before transferring");
      return;
    }

    try {
      const res = await API.post("/transfer/", { receiver, amount, pin, narration });
      setMessage(`Transfer successful! New balance: Ϛ${res.data.balance}`);
      setReceiver("");
      setAmount("");
      setPin("");
      setReceiverName(null);
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Transfer Cowry</h2>

      <form onSubmit={handleTransfer} className="flex flex-col gap-4">
        {/* Receiver Tagname */}
        <input
          type="text"
          placeholder="Receiver tagname"
          value={receiver}
          onChange={(e) => setReceiver(e.target.value)}
          onBlur={verifyReceiver}
          className="border p-2 rounded"
        />

        {/* Tagname check status */}
        {checking && <p className="text-blue-600">Checking receiver...</p>}
        {receiverName && (
          <p className="text-green-600 font-bold">
            Receiver: {receiverName}
          </p>
        )}

        {/* Amount */}
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="border p-2 rounded"
        />

        {/* PIN */}
        <input
          type="password"
          placeholder="4-digit PIN"
          value={pin}
          onChange={(e) => setPin(e.target.value)}
          className="border p-2 rounded"
          maxLength={4}
        />

        {/* Narration */}
        <input
          type="text"
          placeholder="Narration (Optional)"
          value={narration}
          onChange={(e) => setNarration(e.target.value)}
          className="border p-2 rounded"
        />

        

        <button className="bg-green-600 text-white p-2 rounded hover:bg-green-700">
          Transfer
        </button>
      </form>

      {message && <p className="text-green-600 mt-4">{message}</p>}
      {error && <p className="text-red-600 mt-4">{error}</p>}
    </div>
  );
}
