"use client";

import { useState } from "react";

export default function AnalyzePage() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [logs, setLogs] = useState<string[]>([]);

  const handleAnalyze = async () => {
    setLoading(true);
    setResult(null);
    setLogs([]);

    const sessionHash = Math.random().toString(36).substring(2, 12);

    try {
      // 1️⃣ Kirim request join ke Gradio
      const joinRes = await fetch("https://1d28dd69d6b427d0f2.gradio.live/queue/join", {
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

      // 2️⃣ Buka stream ke /queue/data?session_hash
      const source = new EventSource(
        `https://1d28dd69d6b427d0f2.gradio.live/queue/data?session_hash=${sessionHash}`
      );

      source.onmessage = async    (event) => {
        // Gradio kirim event satu per satu
        const message = event.data;
        console.log("Event:", message);
        setLogs((prev) => [...prev, message]);

        if (message.includes('"process_completed"')) {
          try {
            const parsed = JSON.parse(
              message.replace(/^data:\s*/, "") // jaga-jaga kalau ada prefix
            );
            const output = parsed.output?.data?.[0];

            if (output) {
  setResult(output);
  setLogs((prev) => [...prev, "✅ Process completed"]);

              // 🔹 Simpan hasil ke backend
              try {
                await fetch("/api/save-analysis", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    url,
                    summary: output,
                  }),
                });
              } catch (err) {
                console.error("Gagal simpan ke backend:", err);
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
    <div className="p-6 max-w-lg mx-auto space-y-4">
      <h1 className="text-2xl font-bold">AI News Analyzer</h1>
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
        className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 disabled:opacity-60"
      >
        {loading ? "Menganalisis..." : "Analisis"}
      </button>

      {/* Log proses */}
      {/* <div className="bg-gray-100 p-3 rounded-md text-xs text-gray-700 h-32 overflow-auto">
        {logs.map((log, i) => (
          <p key={i}>{log}</p>
        ))}
      </div> */}

      {/* Hasil akhir */}
      {result && (
        <div className="mt-4 bg-white border p-4 rounded-lg shadow-sm">
          <h2 className="font-semibold mb-2">Hasil Analisis</h2>
          <pre className="text-sm whitespace-pre-wrap text-gray-700">
            {result}
          </pre>
        </div>
      )}
    </div>
  );
}
