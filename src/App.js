import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Wallet from "./pages/Wallet";
import Topup from "./pages/Topup";
import Transfer from "./pages/Transfer";
import Notifications from "./pages/Notifications";
import Setpin from "./pages/Setpin";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Transactions from "./pages/Transaction";
import TransactionDetails from "./pages/TransactionDetails";
import Settings from "./pages/Settings";

/* -------------------- PRIVATE ROUTE -------------------- */
function PrivateRoute({ children }) {
  const token = localStorage.getItem("access");
  const pinSet = localStorage.getItem("pin_set") === "true";

  if (!token) return <Navigate to="/login" replace />;
  if (!pinSet) return <Navigate to="/set-pin" replace />;

  return children;
}

function AppWrapper() {
  const location = useLocation();
  const token = localStorage.getItem("access");

  const hideNavbar =
    ["/login", "/signup", "/set-pin"].includes(location.pathname);

  const [theme, setTheme] = useState("soft");

  useEffect(() => {
    const token = localStorage.getItem("access");
    if (!token) return;

    fetch("http://127.0.0.1:8000/api/settings/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => res.json())
      .then(data => {
        if (data.theme) {
          setTheme(data.theme);
          localStorage.setItem("theme", data.theme);
        }
      })
      .catch(() => {});
  }, []);


  const toggleTheme = () => {
    const nextTheme =
      theme === "soft" ? "midnight" : theme === "midnight" ? "ocean" : "soft";
    setTheme(nextTheme);
    localStorage.setItem("theme", nextTheme);
  };

  /* ===== YOUR THEME CONFIG (UNCHANGED) ===== */
  const themeText = {
    soft: "text-gray-900",
    midnight: "text-gray-200",
    ocean: "text-gray-900",
  };

  const themeBg = {
    soft: "bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200",
    midnight: "bg-gradient-to-br from-[#0d1117] via-[#1a1f2b] to-[#2b2f3b]",
    ocean: "bg-gradient-to-br from-blue-200 via-cyan-200 to-teal-300",
  };

  const blobColors = {
    soft: ["bg-purple-300", "bg-pink-300", "bg-yellow-300"],
    midnight: ["bg-indigo-700", "bg-purple-800", "bg-blue-900"],
    ocean: ["bg-cyan-400", "bg-blue-400", "bg-teal-300"],
  };

  return (
    <div className={`relative min-h-screen ${themeText[theme]} overflow-hidden`}>
      {/* Animated background */}
      <div className={`absolute inset-0 ${themeBg[theme]} -z-10`}>
        <div className={`absolute w-72 h-72 ${blobColors[theme][0]} opacity-30 rounded-full animate-blob top-10 left-10`} />
        <div className={`absolute w-96 h-96 ${blobColors[theme][1]} opacity-20 rounded-full animate-blob top-72 left-64 animation-delay-2000`} />
        <div className={`absolute w-64 h-64 ${blobColors[theme][2]} opacity-25 rounded-full animate-blob top-1/2 left-1/4 animation-delay-4000`} />
      </div>

      {!hideNavbar && <Navbar theme={theme} />}

      {/* Theme toggle */}
      <div className="p-4 flex justify-end">
        <button
          onClick={toggleTheme}
          className="mb-4 px-4 py-2 rounded-lg bg-cyan-500 text-white hover:bg-cyan-600 transition"
        >
          Theme: {theme.charAt(0).toUpperCase() + theme.slice(1)}
        </button>
      </div>

      <Routes>
        {/* ROOT */}
        <Route
          path="/"
          element={token ? <Navigate to="/wallet" replace /> : <Home />}
        />

        {/* PUBLIC */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/set-pin" element={<Setpin />} />

        {/* PROTECTED */}
        <Route path="/wallet" element={<PrivateRoute><Wallet /></PrivateRoute>} />
        <Route path="/topup" element={<PrivateRoute><Topup /></PrivateRoute>} />
        <Route path="/transfer" element={<PrivateRoute><Transfer /></PrivateRoute>} />
        <Route path="/notifications" element={<PrivateRoute><Notifications /></PrivateRoute>} />
        <Route path="/transactions" element={<PrivateRoute><Transactions /></PrivateRoute>} />
        <Route path="/transactions/:id" element={<PrivateRoute><TransactionDetails /></PrivateRoute>} />
        <Route path="/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />

        {/* FALLBACK */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppWrapper />
    </Router>
  );
}

