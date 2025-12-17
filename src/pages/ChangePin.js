import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../utils/axios"; // axios instance with JWT interceptor

export default function ChangePin() {
  const navigate = useNavigate();
  const [oldPin, setOldPin] = useState("");
  const [newPin, setNewPin] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    // Basic validation
    if (!oldPin || oldPin.length !== 4 || !/^\d+$/.test(oldPin)) {
      alert("Old PIN must be exactly 4 digits");
      return;
    }

    if (!newPin || newPin.length !== 4 || !/^\d+$/.test(newPin)) {
      alert("New PIN must be exactly 4 digits");
      return;
    }

    setLoading(true);
    try {
      const res = await API.post("/change-pin/", { old_pin: oldPin, new_pin: newPin });

      // Sync localStorage & frontend state for PrivateRoute
      if (res.data.pin_set) {
        localStorage.setItem("pin_set", "true");
      }

      alert(res.data.message);

      // Clear inputs
      setOldPin("");
      setNewPin("");

      // Navigate back to wallet
      navigate("/wallet");
    } catch (err) {
      const msg = err.response?.data?.error || "Failed to update PIN";
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-sm mx-auto">
      <h2 className="font-bold mb-4 text-xl">Change PIN</h2>

      <input
        type="password"
        placeholder="Old PIN"
        value={oldPin}
        onChange={e => setOldPin(e.target.value)}
        className="w-full mb-3 p-2 border rounded"
      />

      <input
        type="password"
        placeholder="New PIN"
        value={newPin}
        onChange={e => setNewPin(e.target.value)}
        className="w-full mb-3 p-2 border rounded"
      />

      <button
        onClick={submit}
        disabled={loading}
        className={`w-full p-2 rounded text-white ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}
      >
        {loading ? "Updating..." : "Update PIN"}
      </button>
    </div>
  );
}
