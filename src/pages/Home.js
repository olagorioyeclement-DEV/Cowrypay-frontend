import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8 text-center">

        <h1 className="text-3xl font-bold text-blue-600 mb-4">
          Welcome to CowryPay
        </h1>

        <p className="text-gray-600 mb-6">
          Send Cowry, receive payments, manage your wallet securely.
        </p>

        <div className="grid gap-4 mt-6">
          <Link
            to="/login"
            className="bg-blue-600 text-white py-3 rounded-lg font-semibold"
          >
            Login
          </Link>

          <Link
            to="/signup"
            className="bg-green-600 text-white py-3 rounded-lg font-semibold"
          >
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
}
