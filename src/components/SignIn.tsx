"use client";

import { useState } from "react";
import Cookies from "js-cookie";

type SignInProps = {
  role: "User" | "Admin" | "Super Admin"; // or just `string` if it's open
  api: string; // optional prop for API endpoint
  nextPage: string; // optional prop for redirecting after login
};

export default function SignIn({ role, api, nextPage }: SignInProps) {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${api}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        Cookies.set("token", data.token, {
          httpOnly: false,
          path: "/",
        });
        window.location.href = `${nextPage}`;
      } else {
        setError(data.message || "Login failed");
      }
    } catch (err) {
      setError("Something went wrong in logging api");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <div className="w-full max-w-md bg-white/60 backdrop-blur-md rounded-2xl shadow-xl p-8 border border-gray-200">
        <h2 className="text-3xl font-semibold text-gray-800 text-center mb-6">
          Sign In as {role}
        </h2>
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
              placeholder="••••••••"
            />
          </div>

          {error && <p className="text-sm text-red-600 mt-1">{error}</p>}

          {role === "Super Admin" && {`email = super@admin.com & password = password`}}
          
          <button
            type="submit"
            disabled={loading}
            className={`w-full text-white font-semibold py-2.5 rounded-xl transition-all shadow-md ${
              loading
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 cursor-pointer"
            }`}
          >
            {loading ? "Loading..." : "Submit"}
          </button>
        </form>
      </div>
    </main>
  );
}
