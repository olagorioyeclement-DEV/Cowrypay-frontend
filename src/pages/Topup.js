import { useState } from "react";
import API from "../api";

export default function Topup() {
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleTopup = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const res = await API.post("/topup/", { amount });
      setMessage(`Top-up successful! New balance: ₦${res.data.balance}`);
      setAmount("");
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Top-up Wallet</h2>
      <form onSubmit={handleTopup} className="flex flex-col gap-4">
        <input
          type="number"
          placeholder="Enter amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="border p-2 rounded"
        />
        <button className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
          Top-up
        </button>
      </form>
      {message && <p className="text-green-600 mt-4">{message}</p>}
      {error && <p className="text-red-600 mt-4">{error}</p>}
    </div>
  );
}

