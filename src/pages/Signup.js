import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";

export default function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstname: "",
    lastname: "",
    username: "",
    email: "",
    tagname: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const res = await API.post("/signup/", form);
      setSuccess("Signup successful! Redirecting to login...");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setError(err.response?.data?.error || "Signup failed");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
          Sign Up
        </h2>

        {error && (
          <div className="bg-red-100 text-red-700 text-sm p-3 rounded mb-4">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-100 text-green-700 text-sm p-3 rounded mb-4">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="firstname"
            placeholder="First Name"
            value={form.firstname}
            onChange={handleChange}
            className="w-full border rounded-lg p-2 focus:outline-none focus:ring focus:ring-blue-300"
            required
          />
          <input
            type="text"
            name="lastname"
            placeholder="Last Name"
            value={form.lastname}
            onChange={handleChange}
            className="w-full border rounded-lg p-2 focus:outline-none focus:ring focus:ring-blue-300"
            required
          />
          <input
            type="text"
            name="tagname"
            placeholder="Tagname"
            value={form.tagname}
            onChange={handleChange}
            className="w-full border rounded-lg p-2 focus:outline-none focus:ring focus:ring-blue-300"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="w-full border rounded-lg p-2 focus:outline-none focus:ring focus:ring-blue-300"
            required
          />
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            className="w-full border rounded-lg p-2 focus:outline-none focus:ring focus:ring-blue-300"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full border rounded-lg p-2 focus:outline-none focus:ring focus:ring-blue-300"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white py-2 rounded-xl text-lg font-semibold hover:bg-green-700 transition disabled:opacity-50"
          >
            {loading ? "Signing up..." : "Sign Up"}
          </button>
        </form>

        <p className="text-center text-gray-600 text-sm mt-4">
          Already have an account?{" "}
          <span
            className="text-blue-600 font-semibold cursor-pointer"
            onClick={() => navigate("/login")}
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}

