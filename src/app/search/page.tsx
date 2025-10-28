// app/page.tsx

"use client";

import { useState } from "react";
import axios from "axios";

// Definisikan tipe untuk hasil analisis (sama seperti di API Route)
interface AnalysisItem {
  sentence: string;
  reason: string;
}

interface AnalysisResult {
  fakta: AnalysisItem[];
  opini: AnalysisItem[];
}

export default function HomePage() {
  const [url, setUrl] = useState<string>("");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      // Tipe response dari API
      const response = await axios.post<AnalysisResult>("/api/analyze-news", { url });
      setResult(response.data);
    } catch (err) {
      setError("Terjadi kesalahan saat menganalisis berita.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "auto" }}>
      <h1>Analisis Berita: Fakta vs. Opini</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Masukkan URL berita di sini..."
          style={{ width: "100%", padding: "10px" }}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Menganalisis..." : "Analisis"}
        </button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {result && (
        <div style={{ marginTop: "20px" }}>
          <h2>Hasil Analisis:</h2>
          <div style={{ display: "flex", gap: "20px" }}>
            <div style={{ flex: 1, border: "1px solid green", padding: "10px" }}>
              <h3>Fakta</h3>
              <ul>
                {result.fakta.map((item, index) => (
                  <li key={index}>
                    {item.sentence} <br /> <small>({item.reason})</small>
                  </li>
                ))}
              </ul>
            </div>
            <div style={{ flex: 1, border: "1px solid orange", padding: "10px" }}>
              <h3>Opini</h3>
              <ul>
                {result.opini.map((item, index) => (
                  <li key={index}>
                    {item.sentence} <br /> <small>({item.reason})</small>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
