import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";

export default function SetPin() {
  const [pin, setPin] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSetPin = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (pin.length !== 4 || !/^\d{4}$/.test(pin)) {
      setError("PIN must be a 4-digit number");
      return;
    }

    try {
      const res = await API.post("/set-pin/", { pin });
      setMessage(res.data.message || "PIN set successfully");
      
      // Mark PIN as set in localStorage
      localStorage.setItem("pin_set", "true");

      // Redirect to Wallet after a short delay
      setTimeout(() => navigate("/wallet"), 1000);

    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Set 4-digit PIN</h2>
        
        {error && <div className="bg-red-100 text-red-700 text-sm p-3 rounded mb-4">{error}</div>}
        {message && <div className="bg-green-100 text-green-700 text-sm p-3 rounded mb-4">{message}</div>}

        <form onSubmit={handleSetPin} className="flex flex-col gap-4">
          <input
            type="password"
            placeholder="Enter 4-digit PIN"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-400"
            maxLength={4}
            required
          />
          <button className="bg-purple-600 text-white p-2 rounded hover:bg-purple-700">
            Set PIN
          </button>
        </form>
      </div>
    </div>
  );
}
