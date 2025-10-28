"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../layouts/Navbar";
import Footer from "../layouts/Footer";
import { Search } from "lucide-react";

interface HistoryItem {
  id: string;
  url: string;
  title: string;
  topic: string;
  summary: string;
  main_theme: string;
  sentiment: string;
  fact_percentage: number;
  opinion_percentage: number;
  hoax_percentage: number;
  created_at: string;
}

export default function HistoryPage() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

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
      <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
        <div className="w-full max-w-3xl bg-white shadow-lg rounded-2xl p-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Analysis History</h1>

          {history.length === 0 ? (
            <p className="text-gray-500 text-center">No history available.</p>
          ) : (
            <ul className="divide-y divide-gray-200">
              {history.map((item) => (
                <li
                  key={item.id}
                  className="py-4 cursor-pointer hover:bg-gray-50 transition rounded-lg px-2"
                  onClick={() => router.push(`/history/${item.id}`)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800 line-clamp-1">
                        {item.title || "Untitled"}
                      </p>
                      <p className="text-sm text-gray-500 line-clamp-1">
                        {item.summary || "No summary available."}
                      </p>
                      <div className="mt-2 text-xs text-gray-400 flex gap-4">
                        <span>Topic: {item.topic}</span>
                        <span>Sentiment: {item.sentiment}</span>
                      </div>
                    </div>
                    <span className="text-sm text-gray-400 whitespace-nowrap ml-4">
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
      {/* Floating Button */}
      <div className="fixed bottom-6 right-6 group">
        <button
          onClick={() => router.push("/analyzer")}
          className="relative flex items-center justify-center w-14 h-14 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg transition-colors duration-300"
        >
          <Search className="w-6 h-6" />
          <span className="absolute right-full mr-3 px-3 py-1 bg-gray-800 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
            Gunakan AI untuk temukan fakta atau opini
          </span>
        </button>
      </div>
      <Footer />
    </>
  );
}
