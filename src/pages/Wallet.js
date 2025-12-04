import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";

export default function Wallet() {
  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWallet = async () => {
      try {
        const res = await API.get("/wallet/");
        setWallet(res.data);
      } catch (err) {
        console.error(err.response?.data);
      } finally {
        setLoading(false);
      }
    };
    fetchWallet();
  }, []);

  if (loading) return <div className="p-6 text-center">Loading...</div>;
  if (!wallet)
    return (
      <div className="p-6 text-center text-red-500">
        Failed to load wallet
      </div>
    );

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">My Wallet</h1>

      <div className="bg-white shadow-md rounded-lg p-5 mb-6">
        <p className="text-gray-600">Welcome,</p>
        <h2 className="text-xl font-semibold">
          {wallet.user.first_name} {wallet.user.last_name}
        </h2>

        <p className="mt-4 text-gray-500">Balance</p>
        <h1 className="text-3xl font-bold text-green-600">Ϛ{wallet.balance}</h1>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <button
          className="bg-blue-600 text-white p-3 rounded-lg"
          onClick={() => navigate("/topup")}
        >
          Top Up
        </button>

        <button
          className="bg-purple-600 text-white p-3 rounded-lg"
          onClick={() => navigate("/transfer")}
        >
          Transfer
        </button>

        <button
          className="bg-yellow-600 text-white p-3 rounded-lg"
          onClick={() => navigate("/notifications")}
        >
          Notifications
        </button>

        <button
          className="bg-gray-800 text-white p-3 rounded-lg"
          onClick={() => {
            localStorage.removeItem("access");
            localStorage.removeItem("refresh");
            navigate("/login");
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}


