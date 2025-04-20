'use client';

import Link from 'next/link';
import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null); // null = loading state

  useEffect(() => {
    const token = Cookies.get('token');
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    Cookies.remove('token', { path: '/' });
    window.location.href = '/';
  };

  return (
    <nav className="w-full bg-white shadow-md py-4 px-6 flex justify-between items-center sticky top-0 z-50">
      <Link href="/" className="text-xl font-bold text-purple-600 hover:opacity-80">MyApp</Link>
      <div className="space-x-4 text-sm">
        <Link href="/about" className="hover:text-purple-600">About</Link>
        <Link href="/contact" className="hover:text-purple-600">Contact</Link>

        {isLoggedIn && (
          <button
            onClick={handleLogout}
            className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition duration-200 cursor-pointer">
            Logout
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
