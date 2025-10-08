"use client";

import { useEffect, useState } from "react";
import Footer from "../layouts/Footer";
import Navbar from "../layouts/Navbar";

interface HistoryItem {
  id: string;
  ip_address: string;
  user_agent: string;
  created_at: string;
}

export default function HistoryPage() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      const res = await fetch("/api/history", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        setHistory(data);
      } else {
        console.error("Failed to fetch history");
      }
      setLoading(false);
    };
    fetchHistory();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <p className="text-gray-600">Loading history...</p>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="w-full max-w-2xl bg-white shadow-lg rounded-2xl p-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Login History</h1>

          {history.length === 0 ? (
            <p className="text-gray-500 text-center">No history available.</p>
          ) : (
            <ul className="divide-y divide-gray-200">
              {history.map((item) => (
                <li key={item.id} className="py-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-gray-700">
                        Logged in from IP: {item.ip_address || "Unknown"}
                      </p>
                      <p className="text-sm text-gray-500 truncate max-w-[280px]">
                        Device: {item.user_agent}
                      </p>
                    </div>
                    <span className="text-sm text-gray-400">
                      {new Date(item.created_at).toLocaleString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}

          <div className="mt-6">
            <a
              href="/profile"
              className="w-full inline-block text-center py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition"
            >
              Back to Profile
            </a>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
