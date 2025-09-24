"use client";

import { useState } from "react";

export default function Analyzer() {
    
  const [url, setUrl] = useState("");
  const [result, setResult] = useState<string>("");

  const handleAnalyze = async () => {
    // 1️⃣ ambil teks dari URL
    const { text } = await fetch(`/api/extract?url=${encodeURIComponent(url)}`)
      .then(r => r.json());

    // 2️⃣ kirim ke Gemini
    const { analysis } = await fetch("/api/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    }).then(r => r.json());

    setResult(analysis);
  };

  return (
    <div className="space-y-4">
      <input
        className="border p-2 w-full"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="Masukkan link berita..."
      />
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded"
        onClick={handleAnalyze}
      >
        Analisis Fakta & Opini
      </button>
      <pre className="bg-gray-100 p-4 whitespace-pre-wrap">{result}</pre>
    </div>
  );
}
