"use client";

import { useEffect, useState } from "react";
import Navbar from "../layouts/Navbar";
import Footer from "../layouts/Footer";

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
      const joinRes = await fetch(
        "https://2d66e424d4b830b03a.gradio.live/gradio_api/queue/join",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            data: [url],
            fn_index: 0,
            session_hash: sessionHash,
          }),
        }
      );

      const joinData = await joinRes.json();
      console.log("Join:", joinData);
      setLogs((prev) => [...prev, "Connected to Gradio queue..."]);

      // TO DO CHANGE:
      const source = new EventSource(
        `https://2d66e424d4b830b03a.gradio.live/gradio_api/queue/data?session_hash=${sessionHash}`
      );

      source.onmessage = async (event) => {
        const message = event.data;
        console.log("Event:", message);
        setLogs((prev) => [...prev, message]);

        if (message.includes('"process_completed"')) {
          try {
            const parsed = JSON.parse(message.replace(/^data:\s*/, ""));
            // const output = parsed.output?.data?.[0];

            // if (output) {
            //   // ambil bagian JSON dari teks hasil
            //   const jsonMatch = output.match(/```json\n([\s\S]*?)\n```/);
            //   if (jsonMatch) {
            //     const jsonData: AnalysisData = JSON.parse(jsonMatch[1]);
            //     setResult(jsonData);

            //     // simpan ke backend
            //     await fetch("/api/save-analysis", {
            //       method: "POST",
            //       headers: { "Content-Type": "application/json" },
            //       body: JSON.stringify({
            //         url,
            //         summary: jsonData.summary_statement,
            //         userId: user?.id || null,
            //       }),
            //     });
            //   } else {
            //     console.warn("JSON data not found in output");
            //   }
            // }

            const outputs = parsed.output?.data;
if (Array.isArray(outputs)) {
  // Ambil elemen kedua (berisi JSON)
  const jsonText = outputs.find((item: string) => item.includes("```json"));
  if (jsonText) {
    const jsonMatch = jsonText.match(/```json\n([\s\S]*?)\n```/);
    if (jsonMatch) {
      const jsonData: AnalysisData = JSON.parse(jsonMatch[1]);
      setResult(jsonData);

      // Simpan ke backend
      await fetch("/api/save-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url,
          summary: jsonData.summary_statement,
          userId: user?.id || null,
        }),
      });
    } else {
      console.warn("JSON block not found in output text");
    }
  } else {
    console.warn("No JSON text found in outputs");
  }
}

          } catch (e) {
            console.error("Parse error:", e);
          }
          source.close();
          setLoading(false);
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

      <main className="flex min-h-screen w-full flex-col items-center justify-center pb-40 pt-20">
        <div className="w-72 md:w-full max-w-3xl xl:max-w-5xl text-center space-y-4">
          <h1 className="text-4xl font-extrabold tracking-tight md:text-6xl xl:text-8xl">
            Fact, Hoax, Opinion Checker
          </h1>

          <input
            type="text"
            placeholder="Masukkan URL berita..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2"
          />

          <button
            onClick={handleAnalyze}
            disabled={loading}
            className="bg-black w-full text-white px-4 py-2 rounded-md hover:bg-gray-800 disabled:opacity-60"
          >
            {loading ? "Menganalisis..." : "Analisis"}
          </button>

          {/* HASIL ANALISIS */}
          {result && (
            <div className="mt-6 bg-white border p-6 rounded-lg shadow-sm text-left space-y-6">
              <h2 className="text-2xl font-bold mb-2">Hasil Analisis</h2>

              <p className="text-gray-700 whitespace-pre-wrap">
                {result.summary_statement}
              </p>

              {result.analysis && (
                <div className="space-y-6 mt-4">
                  {Object.entries(result.analysis).map(([key, section]) => (
                    <div key={key} className="border-t pt-4">
                      <h3 className="text-xl font-semibold mb-2">{key}</h3>
                      <p className="text-gray-700">
                        <strong>Persentase:</strong> {section.percentage}%
                      </p>
                      <p className="text-gray-700 mt-2">
                        <strong>Alasan:</strong> {section.reason}
                      </p>
                      {section.supporting_factors.length > 0 && (
                        <div className="mt-2">
                          <strong>Faktor Pendukung:</strong>
                          <ul className="list-disc list-inside text-gray-700 mt-1">
                            {section.supporting_factors.map((f, i) => (
                              <li key={i}>{f}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}
