'use client';

import { useState } from "react";
import { z } from "zod";
import { useRouter } from "next/navigation";

const registerSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters long'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(5, 'Password must be at least 5 characters long'),
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Invalid phone number'),
  region: z.string().min(3, 'Region must be at least 3 characters long'),
});

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    region: "",
  });

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const result = registerSchema.safeParse(formData);
    if (!result.success) {
      setError(result.error.errors[0].message);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/user/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        router.push("/user/login");
      } else {
        setError(data.message || "Registration failed");
      }
    } catch (err) {
      setError("error in user registration api");
    }
  };

  if(loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-indigo-50 to-purple-100">
        <div className="text-xl font-medium text-gray-600">
          Redirecting...
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-indigo-100 px-4">
      <div className="w-full max-w-xl bg-white/60 backdrop-blur-md rounded-2xl shadow-xxl p-8 border border-gray-200">
        <h2 className="text-3xl font-semibold text-gray-800 text-center mb-6">
          Register
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          {["name", "email", "password", "phone", "region"].map((field) => (
            <div key={field}>
              <label className="block text-sm font-medium text-gray-700 capitalize mb-1">
                {field}
              </label>
              <input
                name={field}
                type={field === "password" ? "password" : field === "email" ? "email" : "text"}
                value={(formData as any)[field]}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
                placeholder={`Enter ${field}`}
              />
            </div>
          ))}

          {error && (
            <p className="text-sm text-red-600">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-xl transition-all shadow-md cursor-pointer"
          >
            {loading ? "Registering..." : "Create Account"}
          </button>
        </form>
      </div>
    </main>
  );
}
