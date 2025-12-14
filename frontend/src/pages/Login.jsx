import api from "../api/api";
import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const submit = async (e) => {
    e?.preventDefault();
    setError("");
    
    if (!email || !password) {
      setError("Email and password are required");
      return;
    }

    try {
      setLoading(true);

      const res = await api.post("/auth/login", {
        email,
        password,
      });

      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        navigate("/dashboard");
      } else {
        setError("Login failed. Please try again.");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(
        err.response?.data?.message || "Login failed. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-zinc-900 to-black text-white px-4">
      <div className="w-full max-w-md">
        <div className="bg-gradient-to-br from-zinc-900 to-zinc-800 p-8 rounded-xl shadow-2xl border border-zinc-700">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent">
              MovieVerse
            </h1>
            <h2 className="text-2xl font-semibold mb-2">Welcome Back</h2>
            <p className="text-gray-400 text-sm">
              Sign in to get personalized recommendations
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-900/30 border border-red-700 rounded-lg text-red-300 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-300 mb-2">Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm text-gray-300 mb-2">
                Password
              </label>
              <input
                type="password"
                placeholder="Enter your password"
                className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-lg font-semibold text-lg transition-all transform ${
                loading
                  ? "bg-zinc-700 cursor-not-allowed opacity-50"
                  : "bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 hover:scale-[1.02] shadow-lg"
              }`}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-400">
            <p>
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="text-red-500 hover:text-red-400 font-semibold"
              >
                Sign Up
              </Link>
            </p>
          </div>

          <div className="mt-4 text-center">
            <Link
              to="/"
              className="text-sm text-gray-500 hover:text-gray-400"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
