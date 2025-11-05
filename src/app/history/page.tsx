"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../layouts/Navbar";
import Footer from "../layouts/Footer";
import { Clock, Sparkles } from "lucide-react";
import FloatingAIButton from "../home/components/FloatingButton";
import LoadingScreen from "../components/LoadingScree";
import ProtectedRoute from "../components/ProtectedRoute";

interface HistoryItem {
  id: string;
  url: string;
  title: string;
  topic: string;
  summary: string;
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
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setLoading(false);
          return;
        }

        const res = await fetch("/api/history", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Failed to fetch history");

        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          setHistory(json.data);
        }
      } catch (err) {
        console.error("Error fetching history:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  if (loading) return <LoadingScreen />;

  return (
    <>
      <ProtectedRoute>
        <Navbar />

        <main className="min-h-screen bg-gradient-to-b from-orange-100 via-white to-orange-50 pt-28 pb-40 px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-5xl mx-auto"
          >
            <div className="text-center mb-10">
              <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-amber-500 to-orange-600 bg-clip-text text-transparent drop-shadow-sm">
                Your Analysis History
              </h1>
              <p className="text-zinc-600 mt-3">
                Riwayat hasil analisis AI terhadap berita yang kamu periksa.
              </p>
            </div>

            {history.length === 0 ? (
              <p className="text-center text-zinc-500">
                Belum ada riwayat analisis.
              </p>
            ) : (
              <motion.div
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: 1,
                    transition: { staggerChildren: 0.1 },
                  },
                }}
                className="space-y-6"
              >
                <AnimatePresence>
                  {history.map((item, i) => {
                    const total =
                      item.fact_percentage +
                      item.opinion_percentage +
                      item.hoax_percentage;

                    return (
                      <motion.div
                        key={item.id}
                        variants={{
                          hidden: { opacity: 0, y: 20 },
                          visible: { opacity: 1, y: 0 },
                        }}
                        whileHover={{
                          scale: 1.02,
                          boxShadow: "0px 10px 25px rgba(255,165,0,0.2)",
                        }}
                        className="bg-white/90 backdrop-blur-md rounded-2xl shadow-sm border border-orange-200 hover:shadow-lg transition-all duration-300 p-6 cursor-pointer"
                        onClick={() => router.push(`/history/${item.id}`)}
                      >
                        {/* Header Section */}
                        <div className="flex justify-between items-start mb-3">
                          <h2 className="font-bold text-lg text-zinc-800 line-clamp-1 flex items-center gap-2">
                            <Sparkles className="w-5 h-5 text-amber-500" />
                            {item.title || "Untitled Analysis"}
                          </h2>
                          <span className="text-sm text-zinc-400 flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {new Date(item.created_at).toLocaleDateString(
                              "id-ID",
                              {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              }
                            )}
                          </span>
                        </div>

                        {/* Topic Badge */}
                        <span className="inline-block bg-gradient-to-r from-orange-400 to-amber-500 text-white text-xs font-semibold px-3 py-1 rounded-full mb-3 shadow-sm">
                          {item.topic || "Umum"}
                        </span>

                        {/* Summary Preview */}
                        <p className="text-sm text-zinc-600 mb-4 line-clamp-2 italic">
                          {item.summary ||
                            "Tidak ada ringkasan yang tersedia untuk artikel ini."}
                        </p>

                        {/* Combined Bar */}
                        <div className="w-full bg-orange-100 h-4 rounded-full overflow-hidden flex shadow-inner">
                          <motion.div
                            className="bg-blue-500 h-full"
                            style={{
                              width: `${(item.fact_percentage / total) * 100}%`,
                            }}
                            title={`Fakta ${item.fact_percentage}%`}
                          />
                          <motion.div
                            className="bg-yellow-400 h-full"
                            style={{
                              width: `${
                                (item.opinion_percentage / total) * 100
                              }%`,
                            }}
                            title={`Opini ${item.opinion_percentage}%`}
                          />
                          <motion.div
                            className="bg-red-500 h-full"
                            style={{
                              width: `${(item.hoax_percentage / total) * 100}%`,
                            }}
                            title={`Hoaks ${item.hoax_percentage}%`}
                          />
                        </div>

                        {/* Legend */}
                        <div className="flex justify-between mt-2 text-xs text-zinc-600">
                          <div className="flex items-center gap-1">
                            <span className="inline-block w-3 h-3 rounded-full bg-blue-500"></span>
                            Fakta: {item.fact_percentage.toFixed(1)}%
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="inline-block w-3 h-3 rounded-full bg-yellow-400"></span>
                            Opini: {item.opinion_percentage.toFixed(1)}%
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="inline-block w-3 h-3 rounded-full bg-red-500"></span>
                            Hoaks: {item.hoax_percentage.toFixed(1)}%
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </motion.div>
            )}

            <div className="text-center mt-12">
              <a
                href="/profile"
                className="inline-block bg-gradient-to-r from-amber-500 to-orange-600 hover:opacity-90 text-white font-semibold px-6 py-3 rounded-xl transition-all shadow-md"
              >
                ← Kembali ke Profil
              </a>
            </div>
          </motion.div>
        </main>

        <FloatingAIButton />
        <Footer />
      </ProtectedRoute>
    </>
  );
}
