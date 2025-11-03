"use client";

import { useEffect, useState } from "react";
import Navbar from "../layouts/Navbar";
import Footer from "../layouts/Footer";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";

interface User {
  id: string;
  email: string;
  created_at: string;
  user_metadata?: {
    full_name?: string;
    avatar_url?: string;
  };
}

interface SectionData {
  percentage: number;
  reason: string;
  supporting_factors: string[];
}

interface AnalysisData {
  analysis?: {
    Facts?: SectionData;
    Opinion?: SectionData;
    Hoax?: SectionData;
  };
  summary_statement?: string;
}

interface LocalAnalysisData {
  summary: string;
  fact_percentage: number;
  opinion_percentage: number;
  hoax_percentage: number;
  main_theme: string;
  sentiment: string;
  raw_analysis_json?: AnalysisData;
}

export default function AnalyzePage() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisData | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [progress, setProgress] = useState(0);
  const [progressDesc, setProgressDesc] = useState("");
  const [outputLang, setOutputLang] = useState<"ID" | "EN">("ID");

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) return setLoading(false);

      const res = await fetch("/api/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();
        setUser(data);
      } else {
        console.error("Failed to fetch user");
      }
      setLoading(false);
    };
    fetchUser();
  }, []);

  const handleAnalyze = async () => {
    if (!url.trim()) return alert("Masukkan URL berita!");

    setLoading(true);
    setResult(null);
    setLogs([]);
    setProgress(0);
    setProgressDesc("⏳ Memulai analisis...");

    try {
      setProgress(10);
      setProgressDesc("🧠 Mengirim URL ke API lokal...");

      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, language: outputLang }),
      });

      setProgress(40);
      setProgressDesc("📡 Menunggu hasil analisis dari AI...");

      if (!res.ok) {
        const errorData = await res.json();
        setLogs((prev) => [
          ...prev,
          `❌ Server Error: ${errorData.error || res.statusText}`,
        ]);
        throw new Error(errorData.error || "Gagal menghubungi server analisis.");
      }

      const response = await res.json();
      const localData: { success: boolean; data: LocalAnalysisData } = response;

      setProgress(85);
      setProgressDesc("✅ Analisis selesai. Memformat hasil...");

      if (localData.success && localData.data) {
        const analysisDataFromDB = localData.data.raw_analysis_json || {
          summary_statement: localData.data.summary,
          analysis: {
            Facts: {
              percentage: localData.data.fact_percentage,
              reason: "Data diambil dari hasil analisis AI.",
              supporting_factors: [],
            },
            Opinion: {
              percentage: localData.data.opinion_percentage,
              reason: "Data diambil dari hasil analisis AI.",
              supporting_factors: [],
            },
            Hoax: {
              percentage: localData.data.hoax_percentage,
              reason: "Data diambil dari hasil analisis AI.",
              supporting_factors: [],
            },
          },
        };

        setResult(analysisDataFromDB);
        setLogs((prev) => [...prev, "✅ Analisis berhasil disimpan ke database."]);
      } else {
        throw new Error("Format respons dari /api/analyze tidak valid.");
      }
    } catch (err: any) {
      console.error("Analysis Error:", err);
      setLogs((prev) => [...prev, `❌ Gagal: ${err.message}`]);
      alert(`❌ Error: ${err.message || "Terjadi kesalahan saat analisis."}`);
      setProgress(0);
    } finally {
      setProgress(100);
      setProgressDesc("Selesai!");
      setLoading(false);
    }
  };

  const getTotalPercentages = () => {
    const facts = result?.analysis?.Facts?.percentage || 0;
    const opinion = result?.analysis?.Opinion?.percentage || 0;
    const hoax = result?.analysis?.Hoax?.percentage || 0;
    return { facts, opinion, hoax };
  };

  const total = getTotalPercentages();

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-b from-black via-zinc-900 to-black text-white flex flex-col items-center justify-center pt-28 pb-40 px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl w-full text-center"
        >
          <h1 className="text-4xl md:text-6xl font-extrabold bg-gradient-to-r from-amber-400 to-orange-600 bg-clip-text text-transparent drop-shadow-sm mb-6">
            Fact, Hoax & Opinion Analyzer
          </h1>
          <p className="text-gray-300 mb-8">
            Masukkan URL berita untuk memeriksa sejauh mana artikel tersebut mengandung fakta,
            opini, atau hoaks menggunakan AI.
          </p>

          {/* Pilihan Bahasa + Input URL */}
          <div className="flex flex-col md:flex-row gap-4 mb-6 items-center">
            <select
              value={outputLang}
              onChange={(e) => setOutputLang(e.target.value as "ID" | "EN")}
              className="w-full md:w-60 border border-gray-600 bg-zinc-800 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <option value="ID">Output: Bahasa Indonesia</option>
              <option value="EN">Output: English</option>
            </select>

            <input
              type="text"
              placeholder="Masukkan URL berita..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="flex-1 border border-gray-600 bg-zinc-800 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          {/* Tombol & Progress */}
          <div className="w-full space-y-3">
            <button
              onClick={handleAnalyze}
              disabled={loading}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow-md w-full ${
                loading
                  ? "bg-gray-700 text-gray-300 cursor-not-allowed"
                  : "bg-amber-500 hover:bg-amber-400 text-black"
              }`}
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="animate-spin w-5 h-5" /> Menganalisis...
                </div>
              ) : (
                "Analisis Sekarang"
              )}
            </button>

            {loading && (
              <div className="w-full mt-3">
                <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-500 transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-sm text-gray-400 mt-1">
                  <span>{progressDesc}</span>
                </div>
              </div>
            )}
          </div>

          {/* Hasil Analisis */}
          <AnimatePresence>
            {result && (
              <motion.div
                key="analysis-result"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mt-10 bg-zinc-900 border border-zinc-800 p-6 rounded-2xl shadow-xl text-left space-y-6"
              >
                <h2 className="text-2xl font-bold text-amber-400 mb-4">
                  🧾 Hasil Analisis
                </h2>

                <p className="text-gray-300 whitespace-pre-wrap leading-relaxed">
                  {result.summary_statement}
                </p>

                {/* Bar Kombinasi */}
                <div className="mt-6">
                  <div className="w-full bg-zinc-800 h-6 rounded-full overflow-hidden flex">
                    <div
                      className="bg-blue-600 h-full"
                      style={{ width: `${total.facts}%` }}
                      title={`Fakta ${total.facts}%`}
                    ></div>
                    <div
                      className="bg-yellow-400 h-full"
                      style={{ width: `${total.opinion}%` }}
                      title={`Opini ${total.opinion}%`}
                    ></div>
                    <div
                      className="bg-red-600 h-full"
                      style={{ width: `${total.hoax}%` }}
                      title={`Hoaks ${total.hoax}%`}
                    ></div>
                  </div>

                  <div className="flex justify-between mt-3 text-sm text-gray-400 font-medium">
                    <div className="flex items-center gap-2">
                      <span className="inline-block w-3 h-3 rounded-full bg-blue-600"></span>
                      <span>Fakta: {total.facts}%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="inline-block w-3 h-3 rounded-full bg-yellow-400"></span>
                      <span>Opini: {total.opinion}%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="inline-block w-3 h-3 rounded-full bg-red-600"></span>
                      <span>Hoaks: {total.hoax}%</span>
                    </div>
                  </div>
                </div>

                {/* Penjelasan Tiap Bagian */}
                <div className="mt-6 space-y-4">
                  {Object.entries(result.analysis ?? {}).map(([key, section]) => (
                    <div key={key}>
                      <h3 className="text-lg font-semibold text-white mb-1">{key}</h3>
                      <p className="text-gray-400 text-sm">{section.reason}</p>
                      {section.supporting_factors?.length > 0 && (
                        <ul className="list-disc list-inside text-gray-500 text-sm mt-2 space-y-1">
                          {section.supporting_factors.map((f, i) => (
                            <li key={i}>{f}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </main>
      <Footer />
    </>
  );
}
