'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import UserCount from '@/components/UserCount';

export default function LandingPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (url: string) => {
    setLoading(true);
    router.push(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 flex flex-col items-center justify-center text-center p-6">
      <div className="max-w-4xl">
        <h1 className="text-4xl md:text-5xl font-extrabold text-purple-700 mb-6">
          Region-Based Verification
        </h1>
        <p className="text-lg md:text-xl text-gray-700 mb-8">
          This portal enables <span className="font-semibold text-purple-600">users to register and be verified by admins</span> based on their region. Admins and Superadmins have role-based dashboards and control over user verification.
        </p>

        <div className="flex flex-col md:flex-row gap-4 items-center justify-center mb-8">
          <Link
            href="/user/register"
            className="bg-purple-600 text-white px-6 py-3 rounded-full font-semibold shadow-lg transition-all duration-300 transform hover:bg-purple-700 hover:scale-105 hover:shadow-xl cursor-pointer"
          >
            Register as User
          </Link>

          <button
            onClick={() => handleLogin("/user/login")}
            disabled={loading}
            className={`${
              loading ? 'bg-blue-300' : 'bg-blue-500 hover:bg-blue-600'
            } text-white px-6 py-3 rounded-full font-semibold shadow-lg transition-all duration-300 transform ${
              !loading && 'hover:scale-105 hover:shadow-xl'
            } flex items-center justify-center cursor-pointer`}
          >
            {loading ? 'Loading...' : 'Login as User'}
          </button>
        </div>

        <div className="flex flex-row gap-6 justify-center mt-4 text-sm text-gray-700">
          <button
            onClick={() => handleLogin("/admin/login")}
            disabled={loading}
            className="flex items-center gap-1 transition-all duration-300 hover:text-purple-600 hover:scale-105 cursor-pointer"
          >
            Login as Admin <ArrowRight size={16} />
          </button>
          <button
            onClick={() => handleLogin("/superAdmin/login")}
            disabled={loading}
            className="flex items-center gap-1 transition-all duration-300 hover:text-purple-600 hover:scale-105 cursor-pointer"
          >
            Login as Superadmin <ArrowRight size={16} />
          </button>
        </div>

        <UserCount />

        <div className="mt-12 relative">
          <div className="absolute -top-12 -left-8 text-purple-300 text-6xl rotate-12 select-none">➤</div>
          <div className="absolute -top-20 right-10 text-blue-300 text-5xl rotate-[-20deg] select-none">➤</div>
          <div className="text-md text-gray-500 italic">
            Built with Next.js, TailwindCSS, and Role-Based Access Control (RBAC)
          </div>
        </div>
      </div>
    </div>
  );
}
