"use client";

import { useEffect, useState } from "react";
import Cookies from "js-cookie";

interface User {
  _id: string;
  name: string;
  email: string;
  phone: string;
  region: string;
  date: string;
  status: string;
  isAdmin: boolean;
}

interface Admin {
  _id: string;
  name: string;
  email: string;
  phone: string;
  region: string;
  date: string;
}

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<"users" | "admins">("users");
  const [users, setUsers] = useState<User[]>([]);
  const [admins, setAdmins] = useState<Admin[]>([]);

  useEffect(() => {
    const token = Cookies.get("token");
    if (!token) {
      window.location.href = "/";
      return;
    }

    const fetchData = async () => {
      try {
        const url =
          activeTab === "users"
            ? `/api/superAdmin/getAllUsers`
            : `/api/superAdmin/getAllAdmins`;

        const res = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            token,
          },
        });

        const data = await res.json();
        activeTab === "users" ? setUsers(data) : setAdmins(data);
      } catch (err) {
        console.error("Fetch error:", err);
      }
    };

    fetchData();
  }, [activeTab]);

  const handleMakeAdmin = async (id: string, currentStatus: boolean) => {
    const token = Cookies.get("token");
    if (!token) {
      window.location.href = "/";
      return;
    }

    try {
      const res = await fetch(
        `/api/superAdmin/adminStatusUpdate/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            token,
          },
          body: JSON.stringify({ id, isAdmin: !currentStatus }), // toggle value
        }
      );

      if (res.ok) {
        setUsers((prev) =>
          prev.map((user) =>
            user._id === id ? { ...user, isAdmin: !currentStatus } : user
          )
        );
      }
    } catch (err) {
      console.error("Admin toggle failed", err);
    }
  };

  const handleResign = async (id: string) => {
    const token = Cookies.get("token");
    if (!token) {
      window.location.href = "/";
      return;
    }
  
    try {
      const res = await fetch(
        `/api/superAdmin/adminStatusUpdate/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            token,
          },
          body: JSON.stringify({ id, isAdmin: false }), // Forcefully resign
        }
      );
  
      if (res.ok) {
        setAdmins((prev) =>
          prev.map((admin) =>
            admin._id === id ? { ...admin, isAdmin: false } : admin
          ).filter((admin) => admin._id !== id) // Optionally remove from UI list
        );
      }
    } catch (err) {
      console.error("Resign failed", err);
    }
  };
  

  const handleBlockToggle = async (id: string, block: boolean) => {
    const token = Cookies.get("token");
    if (!token) {
      window.location.href = "/";
      return;
    }
  
    try {
      const status = block ? "Blocked" : "Declined";
  
      const res = await fetch(
        `/api/superAdmin/userStatusUpdate/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            token,
          },
          body: JSON.stringify({ status }), // Removed `id` from body
        }
      );
  
      if (res.ok) {
        setUsers((prev) =>
          prev.map((user) =>
            user._id === id ? { ...user, status } : user
          )
        );
      }
    } catch (err) {
      console.error("Block/Unblock failed", err);
    }
  };
  
  

  return (
    <div className="pt-20 px-6 max-w-7xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold text-center text-indigo-700 mb-6">
        Super Admin Dashboard
      </h1>

      <div className="flex space-x-4 justify-center mb-6">
        <button
          onClick={() => setActiveTab("users")}
          className={`px-4 py-2 rounded-lg font-medium cursor-pointer ${
            activeTab === "users"
              ? "bg-indigo-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          All Users
        </button>
        <button
          onClick={() => setActiveTab("admins")}
          className={`px-4 py-2 rounded-lg font-medium cursor-pointer ${
            activeTab === "admins"
              ? "bg-indigo-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          All Admins
        </button>
      </div>

      {activeTab === "users" ? (
        
        <div className="overflow-x-auto rounded-lg shadow bg-white p-4">
          <table className="table-auto w-full text-left border-collapse">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2">Name</th>
                <th className="p-2">Email</th>
                <th className="p-2">Phone</th>
                <th className="p-2">Region</th>
                <th className="p-2">Date</th>
                <th className="p-2">Status</th>
                <th className="p-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                
                <tr key={user._id} className="border-t hover:bg-gray-50">
                  <td className="p-2">{user.name}</td>
                  <td className="p-2">{user.email}</td>
                  <td className="p-2">{user.phone}</td>
                  <td className="p-2">{user.region}</td>
                  <td className="p-2">
                    {new Date(user.date).toLocaleDateString()}
                  </td>
                  <td className="p-2 font-medium text-indigo-600">
                    {user.status}
                  </td>
                  <td className="p-2 space-x-2">
                    <button
                      onClick={() =>
                        handleBlockToggle(user._id, user.status !== "Blocked")
                      }
                      className={`px-3 py-1 rounded text-white ${
                        user.status === "Blocked"
                          ? "bg-green-500 hover:bg-green-600 cursor-pointer"
                          : "bg-red-500 hover:bg-red-600 cursor-pointer"
                      }`}
                    >
                      {user.status === "Blocked" ? "Unblock" : "Block"}
                    </button>

                    <button
                      onClick={() => handleMakeAdmin(user._id, user.isAdmin)}
                      className={`px-3 py-1 rounded ${
                        user.isAdmin
                          ? "bg-yellow-500 hover:bg-yellow-600 text-white cursor-pointer"
                          : "bg-indigo-500 hover:bg-indigo-600 text-white cursor-pointer"
                      }`}
                    >
                      {user.isAdmin ? "Remove Admin" : "Make Admin"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg shadow bg-white p-4">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Current Admins
          </h2>
          <table className="table-auto w-full text-left border-collapse">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2">Name</th>
                <th className="p-2">Email</th>
                <th className="p-2">Phone</th>
                <th className="p-2">Region</th>
                <th className="p-2">Date</th>
                <th className="p-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {admins.map((admin) => (
                <tr
                  key={admin._id}
                  className="border-t hover:bg-gray-50"
                >
                  <td className="p-2">{admin.name}</td>
                  <td className="p-2">{admin.email}</td>
                  <td className="p-2">{admin.phone}</td>
                  <td className="p-2">{admin.region}</td>
                  <td className="p-2">
                    {new Date(admin.date).toLocaleDateString()}
                  </td>
                  <td className="p-2">
                    <button
                      onClick={() => handleResign(admin._id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded cursor-pointer"
                    >
                      Fire
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
