"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Navbar from "../../layouts/Navbar";
import Footer from "../../layouts/Footer";
import { Search } from "lucide-react";

interface HistoryDetail {
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

export default function HistoryDetailPage() {
  const { id } = useParams();
  const [detail, setDetail] = useState<HistoryDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const route = useRouter();

  useEffect(() => {
    const fetchDetail = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      const res = await fetch(`/api/history/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();
        setDetail(data);
      } else {
        console.error("Failed to fetch history detail");
      }

      setLoading(false);
    };

    if (id) fetchDetail();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <p className="text-gray-600">Loading detail...</p>
      </div>
    );
  }

  if (!detail) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <p className="text-gray-600">No data found.</p>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 px-4 py-8 flex justify-center">
        <div className="w-full max-w-3xl bg-white shadow-md rounded-2xl p-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">{detail.title}</h1>
          <p className="text-sm text-gray-500 mb-4">{detail.url}</p>

          <div className="mb-6">
            <h2 className="font-semibold text-gray-700 mb-2">Summary</h2>
            <p className="text-gray-600">{detail.summary}</p>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <p className="text-sm text-gray-500">Topic</p>
              <p className="font-medium">{detail.topic}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Main Theme</p>
              <p className="font-medium">{detail.main_theme}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Sentiment</p>
              <p className="font-medium">{detail.sentiment}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Created At</p>
              <p className="font-medium">{new Date(detail.created_at).toLocaleString()}</p>
            </div>
          </div>

          <div className="border-t pt-4">
            <h3 className="font-semibold text-gray-700 mb-2">Analysis Breakdown</h3>
            <p className="text-sm text-gray-600">Fact: {detail.fact_percentage}%</p>
            <p className="text-sm text-gray-600">Opinion: {detail.opinion_percentage}%</p>
            <p className="text-sm text-gray-600">Hoax: {detail.hoax_percentage}%</p>
          </div>

          <div className="mt-6">
            <a
              href="/history"
              className="inline-block py-2 px-4 bg-black text-white rounded-lg hover:bg-gray-800 transition"
            >
              Back to History
            </a>
          </div>
        </div>
      </div>
      {/* Floating Button */}
      <div className="fixed bottom-6 right-6 group">
        <button
          onClick={() => route.push("/analyzer")}
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
