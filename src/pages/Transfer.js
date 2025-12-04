import { useState } from "react";
import API from "../api";

export default function Transfer() {
  const [receiver, setReceiver] = useState("");
  const [amount, setAmount] = useState("");
  const [pin, setPin] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleTransfer = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const res = await API.post("/transfer/", { receiver, amount, pin });
      setMessage(`Transfer successful! New balance: ₦${res.data.balance}`);
      setReceiver("");
      setAmount("");
      setPin("");
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Transfer Money</h2>
      <form onSubmit={handleTransfer} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Receiver tagname"
          value={receiver}
          onChange={(e) => setReceiver(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          type="password"
          placeholder="4-digit PIN"
          value={pin}
          onChange={(e) => setPin(e.target.value)}
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


