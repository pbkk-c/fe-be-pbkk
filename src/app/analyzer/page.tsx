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

interface SectionData {
  percentage: number;
  reason: string;
  supporting_factors: string[];
}

export default function AnalyzePage() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisData | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [progress, setProgress] = useState(0);
  const [progressDesc, setProgressDesc] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

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
    setProgressDesc("⏳ Starting analysis...");

    try {
      setProgress(5);
      setProgressDesc("🧠 Sending URL to local API...");

      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      setProgress(20);
      setProgressDesc("📡 Waiting for Python/Gemini process to finish...");

      if (!res.ok) {
        const errorData = await res.json();
        setLogs((prev) => [...prev, `❌ Server Error: ${errorData.error || res.statusText}`]);
        throw new Error(errorData.error || "Gagal menghubungi server analisis.");
      }

      const response = await res.json();
      const localData: { success: boolean; data: LocalAnalysisData } = response;

      setProgress(90);
      setProgressDesc("✅ Analysis complete. Formatting results...");

      if (localData.success && localData.data) {
        const analysisDataFromDB = localData.data.raw_analysis_json || {
          summary_statement: localData.data.summary,
          analysis: {
            Facts: {
              percentage: localData.data.fact_percentage,
              reason: "Data from DB summary.",
              supporting_factors: [],
            },
            Opinion: {
              percentage: localData.data.opinion_percentage,
              reason: "Data from DB summary.",
              supporting_factors: [],
            },
            Hoax: {
              percentage: localData.data.hoax_percentage,
              reason: "Data from DB summary.",
              supporting_factors: [],
            },
          },
        };

        setResult(analysisDataFromDB);
        setLogs((prev) => [...prev, `✅ Success! Saved to DB.`]);
      } else {
        throw new Error("Invalid response format from /api/analyze.");
      }
    } catch (err: any) {
      console.error("Analysis Error:", err);
      setLogs((prev) => [...prev, `❌ Failed: ${err.message}`]);
      alert(`❌ Error: ${err.message || "Unknown error during analysis."}`);
      setProgress(0);
    } finally {
      setProgress(100);
      setProgressDesc("Done!");
      setLoading(false);
    }
  };

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

          <input
            type="text"
            placeholder="Masukkan URL berita..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2"
          />

          <div className="w-full space-y-2">
            <button
              onClick={handleAnalyze}
              disabled={loading}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow-md ${
                loading
                  ? "bg-gray-700 text-gray-300 cursor-not-allowed"
                  : "bg-amber-500 hover:bg-amber-400 text-black"
              }`}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="animate-spin w-5 h-5" /> Menganalisis...
                </div>
              ) : (
                "Analisis Sekarang"
              )}
            </button>

            {loading && (
              <div className="w-full mt-3">
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-500 transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-sm text-gray-600 mt-1">
                  <span>{progressDesc}</span>
                  <span>{progress}%</span>
                </div>
              </div>
            )}
          </div>

          {/* HASIL ANALISIS */}
          <AnimatePresence>
            {result && (
              <motion.div
                key="analysis-result"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mt-6 bg-white border p-6 rounded-lg shadow-sm text-left space-y-6"
              >
                <h2 className="text-2xl font-bold mb-2">Hasil Analisis</h2>

                <p className="text-gray-700 whitespace-pre-wrap">{result.summary_statement}</p>

                {Object.entries(result.analysis ?? {}).map(([key, section]) => (
                  <div key={key}>
                    <h3 className="text-lg font-semibold text-white mb-2">{key}</h3>
                    <div className="w-full bg-gray-800 h-4 rounded-full overflow-hidden flex">
                      {key === "Facts" && (
                        <div
                          className="bg-blue-600 h-full text-xs flex items-center justify-center text-white"
                          style={{ width: `${section.percentage}%` }}
                        >
                          {section.percentage > 10 && `${section.percentage}%`}
                        </div>
                      )}
                      {key === "Opinion" && (
                        <div
                          className="bg-yellow-500 h-full text-xs flex items-center justify-center text-black"
                          style={{ width: `${section.percentage}%` }}
                        >
                          {section.percentage > 10 && `${section.percentage}%`}
                        </div>
                      )}
                      {key === "Hoax" && (
                        <div
                          className="bg-red-600 h-full text-xs flex items-center justify-center text-white"
                          style={{ width: `${section.percentage}%` }}
                        >
                          {section.percentage > 10 && `${section.percentage}%`}
                        </div>
                      )}
                    </div>
                    <p className="mt-2 text-gray-400 text-sm">{section.reason}</p>
                    {section.supporting_factors?.length > 0 && (
                      <ul className="list-disc list-inside text-gray-400 text-sm mt-2 space-y-1">
                        {section.supporting_factors.map((f, i) => (
                          <li key={i}>{f}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </main>
      <Footer />
    </>
  );
}
