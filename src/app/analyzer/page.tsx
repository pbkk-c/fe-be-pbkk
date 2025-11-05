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
  topic?: string;
}

interface LocalAnalysisData {
  summary: string;
  fact_percentage: number;
  opinion_percentage: number;
  hoax_percentage: number;
  main_theme: string;
  sentiment: string;
  raw_analysis_json?: AnalysisData;
  topic?: string;
  title?: string;
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
      console.log("🔍 Token saat fetch user:", token);

      if (!token) return setLoading(false);

      const res = await fetch("/api/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();
        console.log("✅ User data:", data);
        setUser(data);
      } else {
        console.error("❌ Failed to fetch user");
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
  setProgressDesc("Memulai analisis...");

  const token = localStorage.getItem("token");

  try {
    setProgress(10);
    setProgressDesc("Mengirim URL ke API...");

    const res = await fetch("/api/analyze", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify({ url, language: outputLang }),
    });

    setProgress(40);
    setProgressDesc("Menunggu hasil analisis dari AI...");

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Gagal menghubungi server analisis.");
    }

    const response = await res.json();
    const localData: { success: boolean; data: LocalAnalysisData } = response;

    if (!localData.success || !localData.data)
      throw new Error("Data analisis tidak valid.");

    const raw = localData.data.raw_analysis_json;
    const analysisDataFromDB = raw ?? {
      summary_statement: localData.data.summary,
      topic: localData.data.main_theme || "Umum",
      analysis: {
        Facts: { percentage: localData.data.fact_percentage, reason: "", supporting_factors: [] },
        Opinion: { percentage: localData.data.opinion_percentage, reason: "", supporting_factors: [] },
        Hoax: { percentage: localData.data.hoax_percentage, reason: "", supporting_factors: [] },
      },
    };

    setProgress(85);
    setProgressDesc("Analisis selesai. Menyimpan hasil...");

    if (token) {
      // 🔥 Ambil dan join data supporting_factors jadi string
      const platformData =
        analysisDataFromDB.analysis?.Facts?.supporting_factors?.join("; ") || "";
      const publishedAtData =
        analysisDataFromDB.analysis?.Opinion?.supporting_factors?.join("; ") || "";
      const creatorNameData =
        analysisDataFromDB.analysis?.Hoax?.supporting_factors?.join("; ") || "";

      // 🔥 Pastikan topic diambil dari response AI
      const topicData =
        analysisDataFromDB.topic || localData.data.topic || localData.data.main_theme || "Umum";

      // 🔥 Kirim ke backend
      const payload = {
        url,
        title: localData.data.title || localData.data.main_theme || "Untitled",
        raw_text: localData.data.summary,
        main_theme: topicData,
        summary: localData.data.summary,
        fact_percentage: localData.data.fact_percentage,
        opinion_percentage: localData.data.opinion_percentage,
        hoax_percentage: localData.data.hoax_percentage,
        sentiment: localData.data.sentiment,
        raw_analysis_json: analysisDataFromDB,

        // ✅ Data dari supporting_factors
        platform: platformData,
        published_at: publishedAtData,
        creator_name: creatorNameData,
        topic: topicData,
      };

      console.log("📦 Payload ke /api/saveanalyze:", payload);

      const saveRes = await fetch("/api/saveanalyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!saveRes.ok) {
        const saveErr = await saveRes.json();
        throw new Error(saveErr.message || saveErr.error);
      }

      const saveData = await saveRes.json();
      console.log("✅ Data berhasil disimpan:", saveData);
      setLogs((prev) => [...prev, "✅ Analisis berhasil disimpan ke database."]);
    } else {
      setLogs((prev) => [...prev, "⚠️ Anda belum login, data tidak disimpan."]);
    }

    setResult(analysisDataFromDB);
    setProgress(100);
    setProgressDesc("Selesai!");
  } catch (err: any) {
    console.error("❌ Error:", err);
    alert(`Gagal: ${err.message}`);
  } finally {
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
      <main className="min-h-screen bg-gradient-to-b from-orange-100 via-white to-orange-50 text-zinc-800 flex flex-col items-center justify-center pt-28 pb-40 px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl w-full text-center"
        >
          <h1 className="text-4xl md:text-6xl font-extrabold bg-gradient-to-r from-amber-500 to-orange-600 bg-clip-text text-transparent drop-shadow-sm mb-6">
            Fact, Hoax & Opinion Analyzer
          </h1>
          <p className="text-zinc-600 mb-8">
            Masukkan URL berita untuk memeriksa sejauh mana artikel tersebut mengandung fakta,
            opini, atau hoaks menggunakan AI.
          </p>

          {/* Pilihan Bahasa + Input URL */}
          <div className="flex flex-col md:flex-row gap-4 mb-6 items-center">
            <select
              value={outputLang}
              onChange={(e) => setOutputLang(e.target.value as "ID" | "EN")}
              className="w-full md:w-60 border border-orange-300 bg-white rounded-md px-3 py-2 text-zinc-800 focus:outline-none focus:ring-2 focus:ring-orange-400"
            >
              <option value="ID">Indonesia</option>
              <option value="EN">English</option>
            </select>

            <input
              type="text"
              placeholder="Masukkan URL berita..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="flex-1 border border-orange-300 bg-white rounded-md px-3 py-2 text-zinc-800 focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>

          {/* Tombol & Progress */}
          <div className="w-full space-y-3">
            <button
              onClick={handleAnalyze}
              disabled={loading}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow-md w-full ${
                loading
                  ? "bg-orange-200 text-orange-700 cursor-not-allowed"
                  : "bg-orange-500 hover:bg-orange-400 text-white"
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
                <div className="w-full h-2 bg-orange-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-orange-500 transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-sm text-zinc-500 mt-1">
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
                className="mt-10 bg-white border border-orange-200 p-6 rounded-2xl shadow-lg text-left space-y-6"
              >
                <h2 className="text-2xl font-bold text-orange-500 mb-4">🧾 Hasil Analisis</h2>

                <p className="text-zinc-700 whitespace-pre-wrap leading-relaxed">
                  {result.summary_statement}
                </p>

                {/* Bar Kombinasi */}
                <div className="mt-6">
                  <div className="w-full bg-orange-100 h-6 rounded-full overflow-hidden flex">
                    <div
                      className="bg-blue-500 h-full"
                      style={{ width: `${total.facts}%` }}
                      title={`Fakta ${total.facts}%`}
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
                      <span>Fakta: {total.facts}%</span>
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

                {/* Penjelasan Tiap Bagian */}
                <div className="mt-6 space-y-4">
                  {Object.entries(result.analysis ?? {}).map(([key, section]) => (
                    <div key={key}>
                      <h3 className="text-lg font-semibold text-orange-600 mb-1">{key}</h3>
                      <p className="text-zinc-600 text-sm">{section.reason}</p>
                      {section.supporting_factors?.length > 0 && (
                        <ul className="list-disc list-inside text-zinc-500 text-sm mt-2 space-y-1">
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
