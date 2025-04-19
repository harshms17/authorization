"use client";

import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { set } from "mongoose";

type User = {
  name: string;
  email: string;
  phone: string;
  region: string;
  date: string;
  status: "Registered" | "Pending" | "Declined" | "Blocked";
  isAdmin: boolean;
};

export default function UserDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const token = Cookies.get("token");
      if (!token) {
        window.location.href = "/";
        return;
      }
      try {
        const res = await fetch(
          `/api/user/getUser`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              token,
            },
          }
        );

        const data = await res.json();
        setUser(data);
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    };

    fetchUser();
  }, []);

  const getStatusMessage = (status: User["status"]) => {
    switch (status) {
      case "Registered":
        return {
          color: "bg-green-100 text-green-800",
          message: "You are successfully registered. Welcome aboard!",
        };
      case "Pending":
        return {
          color: "bg-yellow-100 text-yellow-800",
          message: "Your registration is pending. We’ll notify you soon!",
        };
      case "Declined":
        return {
          color: "bg-red-100 text-red-800",
          message:
            "Sorry! Your registration was declined. Please contact support or try again.",
        };
      case "Blocked":
        return {
          color: "bg-gray-200 text-gray-700",
          message: "Access blocked. Reach out to admin for clarification.",
        };
      default:
        return {
          color: "bg-slate-100 text-slate-800",
          message: "Unknown status.",
        };
    }
  };

  const handleRequestApproval = async () => {
    setLoading(true);
    const token = Cookies.get("token");
    if (!token) {
      window.location.href = "/";
      return;
    }
    try {
      const res = await fetch(
        `/api/user/requestApproval`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            token,
          },
        }
      );

      const data = await res.json();
      window.location.reload();
    } catch (error) {
      console.error("Error sending request:", error);
      alert("Failed to send request.");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-indigo-50 to-purple-100">
        <div className="text-xl font-medium text-gray-600">
          Loading your dashboard...
        </div>
      </div>
    );
  }

  const statusInfo = getStatusMessage(user.status);
  const showRequestButton = ["Registered", "Declined"].includes(user.status);

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 p-6 flex items-center justify-center">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl p-10 border border-gray-200 space-y-6">
        <h1 className="text-3xl font-bold text-indigo-700 text-center">
          Welcome, {user.name}!
        </h1>

        <div
          className={`rounded-xl p-4 text-center font-medium ${statusInfo.color} shadow-sm`}
        >
          {statusInfo.message}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <DetailCard label="Email" value={user.email} />
          <DetailCard label="Phone" value={user.phone} />
          <DetailCard label="Region" value={user.region} />
          <DetailCard
            label="Date Joined"
            value={new Date(user.date).toLocaleDateString()}
          />
          <DetailCard label="Status" value={user.status} />
          <DetailCard
            label="Admin Access"
            value={user.isAdmin ? "Yes" : "No"}
          />
        </div>

        {showRequestButton && (
          <div className="text-center">
            <button
              onClick={handleRequestApproval}
              disabled={loading}
              className="mt-4 px-6 py-2 bg-indigo-600 hover:bg-indigo-900 text-white rounded-full shadow transition duration-300 cursor-pointer"
            >
              {loading ? "Loading..." : "Request Approval"}
            </button>
          </div>
        )}
      </div>
    </main>
  );
}

function DetailCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white rounded-xl border shadow-sm p-4">
      <p className="text-sm text-gray-500 mb-1">{label}</p>
      <p className="text-lg font-semibold text-gray-800 break-words">{value}</p>
    </div>
  );
}
