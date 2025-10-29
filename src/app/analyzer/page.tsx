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

      // 🚀 Step 1: Call the local API Route
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      setProgress(20);
      setProgressDesc("📡 Waiting for Python/Gemini process to finish...");

      if (!res.ok) {
        // If the API route returns an error status (4xx or 5xx)
        const errorData = await res.json();
        setLogs((prev) => [...prev, `❌ Server Error: ${errorData.error || res.statusText}`]);
        throw new Error(errorData.error || "Gagal menghubungi server analisis.");
      }

      // Step 2: Process the successful response (contains the saved DB object)
      const response = await res.json();
      const localData: { success: boolean; data: LocalAnalysisData } = response;

      setProgress(90);
      setProgressDesc("✅ Analysis complete. Formatting results...");

      if (localData.success && localData.data) {
        // We now extract the full analysis object (raw_analysis_json) 
        // which contains the Facts/Opinion/Hoax breakdown.
        const analysisDataFromDB = localData.data.raw_analysis_json || {
          summary_statement: localData.data.summary,
          analysis: {
            Facts: { percentage: localData.data.fact_percentage, reason: "Data from DB summary.", supporting_factors: [] },
            Opinion: { percentage: localData.data.opinion_percentage, reason: "Data from DB summary.", supporting_factors: [] },
            Hoax: { percentage: localData.data.hoax_percentage, reason: "Data from DB summary.", supporting_factors: [] },
          }
        };
        
        // Use the detailed analysis for the UI display
        setResult(analysisDataFromDB);
        setLogs((prev) => [...prev, `✅ Success! Saved to DB.`]);

      } else {
        throw new Error("Invalid response format from /api/analyze.");
      }
      
    } catch (err: any) {
      console.error("Analysis Error:", err);
      setLogs((prev) => [...prev, `❌ Failed: ${err.message}`]);
      alert(`❌ Error: ${err.message || "Unknown error during analysis."}`);
      setProgress(0); // Reset progress on failure
    } finally {
      setProgress(100);
      setProgressDesc("Done!");
      setLoading(false);
    }
  };


  // --- UI RENDER (Kept as is, but now using the local analysis result) ---

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

          <div className="flex flex-col md:flex-row items-center gap-3">
            <input
              type="text"
              placeholder="Contoh: https://www.example.com/berita"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="flex-1 px-4 py-3 rounded-xl border border-gray-700 bg-zinc-800 text-gray-100 focus:outline-none focus:ring-2 focus:ring-amber-500 placeholder-gray-500"
            />
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
          </div>
          {loading && (
            <div className="mt-6 text-left w-full">
              <div className="w-full bg-gray-700 h-3 rounded-full overflow-hidden shadow-inner">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ ease: "easeOut", duration: 0.5 }}
                  className="h-full bg-gradient-to-r from-amber-400 to-orange-600"
                />
              </div>
              <div className="flex justify-between mt-2 text-sm text-gray-400">
                <span>{progressDesc}</span>
                <span>{progress.toFixed(0)}%</span>
              </div>
            </div>
          )}
          <AnimatePresence>
            {result && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-10 bg-zinc-900/80 backdrop-blur-md rounded-2xl p-8 border border-zinc-700 text-left shadow-lg"
              >
                <h2 className="text-2xl font-bold text-amber-400 mb-3">Hasil Analisis</h2>
                <p className="text-gray-300 leading-relaxed mb-6">{result.summary_statement}</p>

                {result.analysis && (
                  <div className="space-y-6">
                    {Object.entries(result.analysis).map(([key, section]) => (
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
                        {section.supporting_factors.length > 0 && (
                          <ul className="list-disc list-inside text-gray-400 text-sm mt-2 space-y-1">
                            {section.supporting_factors.map((f, i) => (
                              <li key={i}>{f}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </main>
      <Footer />
    </>
  );
}