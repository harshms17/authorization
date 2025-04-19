'use client';

import { useEffect, useState } from 'react';

const UserCount = () => {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    const fetchUserCount = async () => {
      try {
        const res = await fetch('/api/totalUsers');
        const data = await res.json();
        setCount(data.totalUsers);
      } catch (err) {
        console.error('Failed to fetch user count:', err);
        setCount(123);
      }
    };

    fetchUserCount();
  }, []);

  return (
    <div className="mt-10 text-lg text-gray-700">
      Total Registered Users:&nbsp;
      <span className="text-purple-700 font-bold text-xl">
        {count !== null ? count : '...'}
      </span>
    </div>
  );
};

export default UserCount;
