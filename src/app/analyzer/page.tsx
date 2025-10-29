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
  const [GRADIO_BASE_URL, setGradioUrl] = useState<string | null>(null);

  // const GRADIO_BASE_URL =
  // "https://069d93420c693e575d.gradio.live/gradio_api/queue";

  // 🔗 Fetch link Gradio dari backend
  useEffect(() => {
    const fetchGradioLink = async () => {
      try {
        const res = await fetch("/api/gardio");
        const data = await res.json();
        if (data.data.url) {
          setGradioUrl(data.data.url);
          console.log("✅ Gradio link loaded:", data.data.url);
        } else {
          console.error("❌ Tidak ada Gradio link aktif");
        }
      } catch (err) {
        console.error("Gagal mengambil link Gradio:", err);
      }
    };
    fetchGradioLink();
  }, []);

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
    setLoading(true);
    setResult(null);
    setLogs([]);

    const sessionHash = Math.random().toString(36).substring(2, 12);

    // TO DO CHANGE:
    try {
      const joinRes = await fetch(`${GRADIO_BASE_URL}gradio_api/queue/join`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          data: [url],
          fn_index: 0,
          session_hash: sessionHash,
        }),
      });

      const joinData = await joinRes.json();
      console.log("Join:", joinData);
      setLogs((prev) => [...prev, "Connected to Gradio queue..."]);

      // TO DO CHANGE:
      const source = new EventSource(
        `${GRADIO_BASE_URL}gradio_api/queue/data?session_hash=${sessionHash}`
      );

      source.onmessage = async (event) => {
        const message = event.data;
        console.log("Event:", message);
        setLogs((prev) => [...prev, message]);

        try {
          const parsed = JSON.parse(message.replace(/^data:\s*/, ""));

          // Saat proses dimulai
          if (parsed.msg === "process_starts") {
            setProgress(0);
            setProgressDesc("Menyiapkan analisis...");
          }

          // Saat progress berjalan
          if (parsed.msg === "progress" && Array.isArray(parsed.progress_data)) {
            const progressInfo = parsed.progress_data[0];
            if (progressInfo) {
              const pct = progressInfo.progress * 100;
              setProgress(Math.floor(pct));
              setProgressDesc(progressInfo.desc || "Memproses...");
            }
          }

          // Saat proses selesai
          if (parsed.msg === "process_completed") {
            setProgress(100);
            setProgressDesc("Selesai 🎉");

            const outputs = parsed.output?.data;
            if (Array.isArray(outputs)) {
              const jsonText = outputs.find((item: string) => item.includes("```json"));
              if (jsonText) {
                const jsonMatch = jsonText.match(/```json\n([\s\S]*?)\n```/);
                if (jsonMatch) {
                  const jsonData: AnalysisData = JSON.parse(jsonMatch[1]);
                  setResult(jsonData);

                  await fetch("/api/save-analysis", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      url,
                      summary: jsonData.summary_statement,
                      userId: user?.id || null,
                    }),
                  });
                }
              }
            }

            setLoading(false);
            source.close();
          }
        } catch (e) {
          console.error("Parse error:", e);
        }
      };

      source.onerror = (err) => {
        console.error("Stream error:", err);
        setLogs((prev) => [...prev, "❌ Error connecting to stream"]);
        source.close();
        setLoading(false);
      };
    } catch (err) {
      console.error(err);
      setLogs((prev) => [...prev, "❌ Failed to connect"]);
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
