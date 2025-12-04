import { Link } from "react-router-dom";

export default function Navbar() {
  const logout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    window.location.href = "/login";
  };

  const token = localStorage.getItem("access");

  return (
    <nav className="p-4 bg-gray-800 text-white flex gap-4">
      <Link to="/" className="hover:underline">Home</Link>
      {token ? (
        <>
          <Link to="/wallet" className="hover:underline">Wallet</Link>
          <Link to="/topup" className="hover:underline">Topup</Link>
          <Link to="/transfer" className="hover:underline">Transfer</Link>
          <Link to="/notifications" className="hover:underline">Notifications</Link>
          <button
            onClick={logout}
            className="ml-auto bg-red-600 px-3 py-1 rounded hover:bg-red-700"
          >
            Logout
          </button>
        </>
      ) : (
        <>
          <Link to="/login" className="hover:underline">Login</Link>
          <Link to="/signup" className="hover:underline">Signup</Link>
        </>
      )}
    </nav>
  );
}

