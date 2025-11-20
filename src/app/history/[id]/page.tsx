"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Navbar from "../../layouts/Navbar";
import Footer from "../../layouts/Footer";
import { motion } from "framer-motion";
import FloatingAIButton from "@/app/home/components/FloatingButton";
import Link from "next/link";
import LoadingScreen from "@/app/components/LoadingScree";

interface HistoryDetail {
  id: string;
  url: string;
  title: string;
  topic: string | null;
  platform: string | null;
  creator_name: string | null;
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
  const router = useRouter();

  useEffect(() => {
    const fetchDetail = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      const res = await fetch(`/xenotimes/api/xenotimes/history/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();
        setDetail(data);
      } else {
        console.error("❌ Failed to fetch history detail");
      }

      setLoading(false);
    };

    if (id) fetchDetail();
  }, [id]);

  if (loading) return <LoadingScreen />;

  if (!detail) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <p className="text-gray-600">No data found.</p>
      </div>
    );
  }

  const total = {
    fact: Number(detail.fact_percentage),
    opinion: Number(detail.opinion_percentage),
    hoax: Number(detail.hoax_percentage),
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-b from-orange-100 via-white to-orange-50 px-4 pt-24 pb-16 flex justify-center">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-3xl bg-white border border-orange-200 shadow-lg rounded-2xl p-8"
        >
          {/* Title */}
          <h1 className="text-3xl font-bold text-orange-600 mb-2">
            {detail.title || "Untitled"}
          </h1>

          {/* Metadata */}
          <Link href={detail.url} target="_blank" rel="noopener noreferrer" className="mb-6 block">
            <div>
              <p className="text-zinc-500">News Link</p>
              <p className="font-semibold text-zinc-800 break-words">{detail.url || "-"}</p>
            </div>
          </Link>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm mb-6">
            <div>
              <p className="text-zinc-500">Topic</p>
              <p className="font-semibold text-zinc-800">{detail.topic || "-"}</p>
            </div>
            {/* <div>
              <p className="text-zinc-500">Main Theme</p>
              <p className="font-semibold text-zinc-800">{detail.main_theme || "-"}</p>
            </div> */}
            <div>
              <p className="text-zinc-500">Created</p>
              <p className="font-semibold text-zinc-800">
                {new Date(detail.created_at).toLocaleString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>

          {/* Summary */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-orange-500 mb-2">Summary</h2>
            <p className="text-zinc-700 leading-relaxed whitespace-pre-line">
              {detail.summary || "No summary available."}
            </p>
          </div>

          {/* Breakdown */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-orange-500 mb-3">Analysis Breakdown</h2>
            <div className="w-full bg-orange-100 h-6 rounded-full overflow-hidden flex">
              <div
                className="bg-blue-500 h-full"
                style={{ width: `${total.fact}%` }}
                title={`Fakta ${total.fact}%`}
              ></div>
              <div
                className="bg-yellow-400 h-full"
                style={{ width: `${total.opinion}%` }}
                title={`Opini ${total.opinion}%`}
              ></div>
              <div
                className="bg-red-500 h-full"
                style={{ width: `${total.hoax}%` }}
                title={`Hoaks ${total.hoax}%`}
              ></div>
            </div>

            <div className="flex justify-between mt-3 text-sm text-zinc-600 font-medium">
              <div className="flex items-center gap-2">
                <span className="inline-block w-3 h-3 rounded-full bg-blue-500"></span>
                <span>Fakta: {total.fact}%</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-block w-3 h-3 rounded-full bg-yellow-400"></span>
                <span>Opini: {total.opinion}%</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-block w-3 h-3 rounded-full bg-red-500"></span>
                <span>Hoaks: {total.hoax}%</span>
              </div>
            </div>
          </div>

          {/* 🧠 Fakta (from platform) */}
          {detail.platform && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-blue-600 mb-1">Fakta</h3>
              <p className="text-zinc-700 whitespace-pre-line border-l-4 border-blue-400 pl-3">
                {detail.platform}
              </p>
            </div>
          )}

          {/* 💬 Opini (from sentiment) */}
          {detail.sentiment && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-yellow-600 mb-1">Opini</h3>
              <p className="text-zinc-700 whitespace-pre-line border-l-4 border-yellow-400 pl-3">
                {detail.sentiment}
              </p>
            </div>
          )}

          {/* 🚫 Hoaks (from creator_name) */}
          {detail.creator_name && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-red-600 mb-1">Hoaks</h3>
              <p className="text-zinc-700 whitespace-pre-line border-l-4 border-red-400 pl-3">
                {detail.creator_name}
              </p>
            </div>
          )}

          {/* Back Button */}
          <div className="mt-8">
            <button
              onClick={() => router.push("/history")}
              className="w-full py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition"
            >
              ← Back to History
            </button>
          </div>
        </motion.div>
      </main>

      <FloatingAIButton />
      <Footer />
    </>
  );
}
