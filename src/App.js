import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Wallet from "./pages/Wallet";
import Topup from "./pages/Topup";
import Transfer from "./pages/Transfer";
import Notifications from "./pages/Notifications";
import Setpin from "./pages/Setpin"; // Make sure this exists
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Transactions from "./pages/Transaction";


// PrivateRoute component to protect authenticated routes and ensure PIN is set
function PrivateRoute({ children }) {
  const token = localStorage.getItem("access");
  const pinSet = localStorage.getItem("pin_set") === "true";
  if (!token) return <Navigate to="/login" />;
  if (!pinSet) return <Navigate to="/set-pin" />;
  return children;
}

// Wrapper to handle conditional Navbar rendering
function AppWrapper() {
  const location = useLocation();
  const hideNavbar = ["/login", "/signup", "/set-pin"].includes(location.pathname);

  return (
    <>
      {!hideNavbar && <Navbar />}
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/set-pin" element={<Setpin />} />

        {/* Protected routes */}
        <Route
          path="/wallet"
          element={
            <PrivateRoute>
              <Wallet />
            </PrivateRoute>
          }
        />
        <Route
          path="/topup"
          element={
            <PrivateRoute>
              <Topup />
            </PrivateRoute>
          }
        />
        <Route
          path="/transfer"
          element={
            <PrivateRoute>
              <Transfer />
            </PrivateRoute>
          }
        />
        <Route
          path="/notifications"
          element={
            <PrivateRoute>
              <Notifications />
            </PrivateRoute>
          }
        />
        <Route
          path="/transactions"
          element={
            <PrivateRoute>
              <Transactions />
            </PrivateRoute>
        }
        />

        {/* Default redirect */}
        <Route
          path="/"
          element={
            localStorage.getItem("access") ? (
              <Navigate to="/wallet" />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <AppWrapper />
    </Router>
  );
}

export default App;



