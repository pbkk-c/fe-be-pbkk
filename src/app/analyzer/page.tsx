"use client";

import { useEffect, useState } from "react";
import Navbar from "../layouts/Navbar";
import Footer from "../layouts/Footer";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";
import Button from "@/components/buttons/Button";
import Typography from "@/components/Typography";
import { useRouter } from "next/navigation";


// --- TYPES ---
interface SectionData {
  percentage: number;
  reason: string;
  supporting_factors: string[];
}

// The structure inside 'raw_analysis_json'
interface AnalysisStructure {
  Facts?: SectionData;
  Opinion?: SectionData;
  Hoax?: SectionData;
}

// The data returned from Python 'data' field
interface PythonAnalysisResult {
  title: string;
  topic: string;
  summary: string;
  fact_percentage: number;
  opinion_percentage: number;
  hoax_percentage: number;
  raw_analysis_json: {
    topic: string;
    analysis: AnalysisStructure;
    summary_statement: string;
  };
}

interface User {
  id: string;
  email: string;
}

export default function AnalyzePage() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  
  // Result holds the nested structure for display
  const [result, setResult] = useState<{ analysis: AnalysisStructure; summary: string } | null>(null);
  
  const [logs, setLogs] = useState<string[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [progress, setProgress] = useState(0);
  const [progressDesc, setProgressDesc] = useState("");
  const [outputLang, setOutputLang] = useState<"ID" | "EN">("ID");
  const [percentages, setPercentages] = useState({ facts: 0, opinion: 0, hoax: 0 });

  // 1. Fetch User on Mount
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await fetch("/xenotimes/api/xenotimes/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setUser(data);
        }
      } catch (e) {
        console.error("Failed to fetch user", e);
      }
    };
    fetchUser();
  }, []);

  // 2. Main Analyze Function
  const handleAnalyze = async () => {
    if (!url.trim()) return alert("Masukkan URL berita!");

    setLoading(true);
    setResult(null);
    setLogs([]);
    setProgress(0);
    setProgressDesc("Menghubungkan ke Local AI...");

    const token = localStorage.getItem("token");

    try {
      // --- STEP A: Call Next.js API (which calls Python) ---
      setProgress(10);
      setProgressDesc("Loading...");

      const res = await fetch("/xenotimes/api/xenotimes/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, language: outputLang }),
      });

      setProgress(50);
      setProgressDesc("AI sedang membaca & menganalisis...");

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Gagal menghubungi server analisis.");
      }

      const responseWrapper = await res.json();
      // Expecting: { success: true, data: { ...PythonAnalysisResult... } }
      
      if (!responseWrapper.success || !responseWrapper.data) {
        throw new Error("Format data AI tidak valid.");
      }

      const aiData: PythonAnalysisResult = responseWrapper.data;

      // --- STEP B: Update UI State ---
      setProgress(80);
      setProgressDesc("Memproses hasil...");

      // Set the bars
      setPercentages({
        facts: aiData.fact_percentage,
        opinion: aiData.opinion_percentage,
        hoax: aiData.hoax_percentage
      });

      // Set the text content (Using raw_analysis_json for deep details)
      setResult({
        analysis: aiData.raw_analysis_json.analysis,
        summary: aiData.summary
      });

      // --- STEP C: Save to Database (If Logged In) ---
      if (token) {
        setProgressDesc("Menyimpan ke riwayat...");
        
        const deepAnalysis = aiData.raw_analysis_json.analysis;

        // Prepare payload for your Backend
        const payload = {
          url,
          title: aiData.title || "Untitled News",
          raw_text: aiData.summary,
          main_theme: aiData.topic, // Mapping Python 'topic' to DB 'main_theme'
          summary: aiData.summary,
          
          fact_percentage: aiData.fact_percentage,
          opinion_percentage: aiData.opinion_percentage,
          hoax_percentage: aiData.hoax_percentage,
          
          // Keep specific JSON for detailed view later
          raw_analysis_json: aiData.raw_analysis_json, 

          // Flatten arrays to strings for DB compatibility
          platform: deepAnalysis.Facts?.supporting_factors?.join("; ") || "",
          published_at: deepAnalysis.Opinion?.supporting_factors?.join("; ") || "",
          creator_name: deepAnalysis.Hoax?.supporting_factors?.join("; ") || "",
          topic: aiData.topic,
        };

        console.log("📦 Saving Payload:", payload);

        const saveRes = await fetch("/xenotimes/api/xenotimes/saveanalyze", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });

        if (saveRes.ok) {
          setLogs(prev => [...prev, "✅ Tersimpan di riwayat"]);
        } else {
          console.warn("Gagal menyimpan ke DB");
        }
      }

      setProgress(100);
      setProgressDesc("Selesai!");

    } catch (err: any) {
      console.error("❌ Error:", err);
      alert(`Gagal: ${err.message}`);
      setProgressDesc("Terjadi kesalahan.");
    } finally {
      setLoading(false);
    }
  };
  const router = useRouter();
  const BackHomeButton = () => (
  <Button
    onClick={() => router.push("/xenotimes")}
    className="mt-6 px-6 py-3 rounded-xl border border-orange-500 text-orange-600 
               bg-white hover:bg-orange-50 hover:border-orange-600 
               transition-all font-semibold shadow-sm w-full"
  >
    <Typography as="p" variant="btn" className="text-orange-600">
      ← Kembali ke Home
    </Typography>
  </Button>
);


  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-b from-orange-100 via-white to-orange-50 text-zinc-800 flex flex-col items-center justify-center pt-28 pb-40 px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl w-full text-center"
        >
          <h1 className="text-4xl md:text-6xl font-extrabold bg-gradient-to-r from-amber-500 to-orange-600 bg-clip-text text-transparent drop-shadow-sm mb-6 py-2">
            AI News Analyzer
          </h1>
          <p className="text-zinc-600 mb-8">
            Analyze news to detect Facts, Opinions, and Hoaxes using AI.
          </p>

          {/* Inputs */}
          <div className="flex flex-col md:flex-row gap-4 mb-6 items-center">
            <select
              value={outputLang}
              onChange={(e) => setOutputLang(e.target.value as "ID" | "EN")}
              className="w-full md:w-32 border border-orange-300 bg-white rounded-md px-3 py-3 text-zinc-800 focus:ring-2 focus:ring-orange-400"
            >
              <option value="ID">🇮🇩 Indo</option>
              <option value="EN">🇬🇧 Eng</option>
            </select>

            <input
              type="text"
              placeholder="Tempel link berita di sini..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="flex-1 border border-orange-300 bg-white rounded-md px-4 py-3 text-zinc-800 focus:outline-none focus:ring-2 focus:ring-orange-400 shadow-sm"
            />
          </div>

          {/* Action Button */}
          <div className="w-full space-y-3">
            <button
              onClick={handleAnalyze}
              disabled={loading}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow-md w-full ${
                loading
                  ? "bg-orange-200 text-orange-700 cursor-not-allowed"
                  : "bg-orange-500 hover:bg-orange-600 text-white hover:shadow-lg"
              }`}
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="animate-spin w-5 h-5" /> {progressDesc}
                </div>
              ) : (
                "Mulai Analisis AI"
              )}
            </button>

            {/* Progress Bar */}
            {loading && (
              <div className="w-full mt-3">
                <div className="w-full h-2 bg-orange-200 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-orange-500"
                    initial={{ width: "0%" }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>
            )}
            {!result && !loading && <BackHomeButton />}
          </div>

          {/* Results Display */}
          <AnimatePresence>
            {result && (
              <motion.div
                key="analysis-result"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mt-10 bg-white border border-orange-200 p-6 rounded-2xl shadow-xl text-left space-y-6"
              >
                <h2 className="text-2xl font-bold text-zinc-800 border-b pb-2">Hasil Analisis</h2>

                <div className="bg-orange-50 p-4 rounded-lg border border-orange-100">
                  <p className="text-zinc-700 leading-relaxed font-medium">
                    {result.summary}
                  </p>
                </div>

                {/* Percentage Bars */}
                <div className="mt-6">
                  <div className="w-full bg-zinc-100 h-8 rounded-full overflow-hidden flex border border-zinc-200 shadow-inner">
                    <div style={{ width: `${percentages.facts}%` }} className="bg-blue-500 h-full transition-all duration-1000" />
                    <div style={{ width: `${percentages.opinion}%` }} className="bg-yellow-400 h-full transition-all duration-1000" />
                    <div style={{ width: `${percentages.hoax}%` }} className="bg-red-500 h-full transition-all duration-1000" />
                  </div>

                  <div className="flex justify-between mt-3 text-sm font-bold">
                    <div className="flex items-center gap-2 text-blue-600">
                      <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                      Fakta: {percentages.facts}%
                    </div>
                    <div className="flex items-center gap-2 text-yellow-600">
                      <span className="w-3 h-3 rounded-full bg-yellow-400"></span>
                      Opini: {percentages.opinion}%
                    </div>
                    <div className="flex items-center gap-2 text-red-600">
                      <span className="w-3 h-3 rounded-full bg-red-500"></span>
                      Hoaks: {percentages.hoax}%
                    </div>
                  </div>
                </div>

                {/* Detailed Breakdown */}
                <div className="grid gap-6 md:grid-cols-1 mt-8">
                  {/* Facts */}
                  <div className="border-l-4 border-blue-500 pl-4 py-1">
                    <h3 className="text-lg font-bold text-blue-600">Fakta</h3>
                    <p className="text-sm text-zinc-600 mb-2">{result.analysis.Facts?.reason}</p>
                    <ul className="list-disc list-inside text-xs text-zinc-500">
                      {result.analysis.Facts?.supporting_factors?.map((f, i) => (
                        <li key={i}>{f}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Opinion */}
                  <div className="border-l-4 border-yellow-400 pl-4 py-1">
                    <h3 className="text-lg font-bold text-yellow-600">Opini</h3>
                    <p className="text-sm text-zinc-600 mb-2">{result.analysis.Opinion?.reason}</p>
                    <ul className="list-disc list-inside text-xs text-zinc-500">
                      {result.analysis.Opinion?.supporting_factors?.map((f, i) => (
                        <li key={i}>{f}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Hoax */}
                  <div className="border-l-4 border-red-500 pl-4 py-1">
                    <h3 className="text-lg font-bold text-red-600">Hoaks</h3>
                    <p className="text-sm text-zinc-600 mb-2">{result.analysis.Hoax?.reason}</p>
                    <ul className="list-disc list-inside text-xs text-zinc-500">
                      {result.analysis.Hoax?.supporting_factors?.map((f, i) => (
                        <li key={i}>{f}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            )}
            {result && <BackHomeButton />}
          </AnimatePresence>
        </motion.div>
      </main>
      <Footer />
    </>
  );
}