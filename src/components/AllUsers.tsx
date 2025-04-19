"use client";

import { useEffect, useState } from "react";
import Cookies from "js-cookie";

type UsersProps = {
    api: string;
};

interface User {
  _id: string;
  name: string;
  email: string;
  phone: string;
  date: string;
  status: string;
  region: string;
}

export default function AllUsers({api}: UsersProps) {
  const [pendingUsers, setPendingUsers] = useState<User[]>([]);
  const [otherUsers, setOtherUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const token = Cookies.get("token");
      if (!token) {
        window.location.href = "/";
        return;
      }

      try {
        const resUsers = await fetch(
          `${api}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              token,
            },
          }
        );
        const users = await resUsers.json();

        const pending = users.filter((u: User) => u.status === "Pending");
        const others = users.filter((u: User) => u.status !== "Pending");

        setPendingUsers(pending);
        setOtherUsers(others);
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };

    fetchData();
  }, []);

  const handleStatusUpdate = async (
    id: string,
    status: "Registered" | "Declined"
  ) => {
    const token = Cookies.get("token");
    if (!token) {
      window.location.href = "/";
      return;
    }
    await fetch(
      `/api/admin/userStatusUpdate/${id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          token,
        },
        body: JSON.stringify({ status }),
      }
    );
    setPendingUsers((prev) => prev.filter((user) => user._id !== id));
    setOtherUsers((prev) => [
      ...prev,
      { ...pendingUsers.find((u) => u._id === id)!, status },
    ]);
  };

  const handleBlockToggle = async (id: string, block: boolean) => {
    const token = Cookies.get("token");
    if (!token) {
      window.location.href = "/";
      return;
    }
    await fetch(
      `/api/admin/userStatusUpdate/${id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          token,
        },
        body: JSON.stringify({ status: block ? "Blocked" : "Declined" }),
      }
    );
    setOtherUsers((prev) =>
      prev.map((user) =>
        user._id === id ? { ...user, isBlocked: block } : user
      )
    );
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Section 2: Pending Users */}
      <section className="bg-white rounded-lg shadow p-6 border">
        <h2 className="text-xl font-semibold mb-4 text-yellow-600">
          Pending Users
        </h2>
        {pendingUsers.length === 0 ? (
          <p>No users pending approval.</p>
        ) : (
          <div className="space-y-4">
            {pendingUsers.map((user) => (
              <div
                key={user._id}
                className="bg-green-50 p-4 border rounded shadow flex flex-col md:flex-row md:items-center md:justify-between"
              >
                <div className="text-gray-700 space-y-1">
                  <p>
                    <strong>Name:</strong> {user.name}
                  </p>
                  <p>
                    <strong>Email:</strong> {user.email}
                  </p>
                  <p>
                    <strong>Phone:</strong> {user.phone}
                  </p>
                  <p>
                    <strong>Date:</strong>{" "}
                    {new Date(user.date).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex gap-2 mt-4 md:mt-0">
                  <button
                    onClick={() => handleStatusUpdate(user._id, "Registered")}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded cursor-pointer"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleStatusUpdate(user._id, "Declined")}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded cursor-pointer"
                  >
                    Decline
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Section 3: Other Users */}
      <section className="bg-white rounded-lg shadow p-6 border">
        <h2 className="text-xl font-semibold mb-4 text-indigo-600">
          All Other Users
        </h2>
        {otherUsers.length === 0 ? (
          <p>No users available.</p>
        ) : (
          <div className="space-y-4">
            {otherUsers.map((user) => (
              <div
                key={user._id}
                className="bg-blue-50 p-4 border rounded shadow flex flex-col md:flex-row md:items-center md:justify-between"
              >
                <div className="text-gray-700 space-y-1">
                  <p>
                    <strong>Name:</strong> {user.name}
                  </p>
                  <p>
                    <strong>Email:</strong> {user.email}
                  </p>
                  <p>
                    <strong>Phone:</strong> {user.phone}
                  </p>
                  <p>
                    <strong>Date:</strong>{" "}
                    {new Date(user.date).toLocaleDateString()}
                  </p>
                  <p>
                    <strong>Status:</strong> {user.status}
                  </p>
                </div>
                <div className="mt-4 md:mt-0">
                  {user.status === "Blocked" ? (
                    <button
                      onClick={() => handleBlockToggle(user._id, false)}
                      className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded cursor-pointer"
                    >
                      Unblock
                    </button>
                  ) : (
                    <button
                      onClick={() => handleBlockToggle(user._id, true)}
                      className="bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded cursor-pointer"
                    >
                      Block
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
