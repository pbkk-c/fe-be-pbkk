"use client";

import { useState } from "react";

export default function Analyzer() {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false); // State untuk loading

  // Menggunakan event FormEvent untuk handle submit dari form
  const handleAnalyze = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Mencegah refresh halaman saat form disubmit
    if (!url) return; // Jangan lakukan apa-apa jika URL kosong

    setIsLoading(true);
    setResult("");

    try {
      // 1️⃣ ambil teks dari URL
      const extractResponse = await fetch(`/api/extract?url=${encodeURIComponent(url)}`);
      if (!extractResponse.ok) throw new Error("Gagal mengambil konten dari URL.");
      const { text } = await extractResponse.json();

      // 2️⃣ kirim ke Gemini
      const analyzeResponse = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      if (!analyzeResponse.ok) throw new Error("Gagal menganalisis teks.");
      const { analysis } = await analyzeResponse.json();

      setResult(analysis);
    } catch (error) {
      console.error(error);
      setResult(error instanceof Error ? error.message : "Terjadi kesalahan.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // Container utama untuk menengahkan konten
    <main className="flex min-h-screen w-full flex-col items-center justify-center pb-40">
      
      {/* Konten Utama */}
      <div className="w-72 md:w-full max-w-3xl xl:max-w-5xl text-center">
        <h1 className="text-4xl font-extrabold tracking-tight md:text-6xl xl:text-8xl">
          Fact, Hoax, Opinion Checker
        </h1>

        {/* Form untuk input URL dan tombol search */}
        <form onSubmit={handleAnalyze} className="relative mx-auto mt-10 w-full max-w-2xl xl:max-w-5xl">
          <input
            className="w-72 xl:h-20 xl:text-2xl md:w-full rounded-full border border-gray-300 py-4 pl-6 pr-14 text-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-black"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter News Link"
            disabled={isLoading}
          />
          {/* Tombol dengan ikon search di dalam input */}
          <button
            type="submit"
            className="absolute inset-y-0 right-0 flex items-center pr-5 text-gray-400 disabled:opacity-50"
            disabled={isLoading}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
              />
            </svg>
          </button>
        </form>
      </div>

      {/* Area untuk menampilkan hasil atau status loading */}
      <div className="w-72 md:w-full mt-10 md:p-12 max-w-3xl">
        {isLoading && (
          <p className="animate-pulse text-center text-gray-500">
            Menganalisis...
          </p>
        )}
        {result && (
          <pre className="whitespace-pre-wrap rounded-md bg-gray-100 p-4 text-left font-sans text-gray-800">
            {result}
          </pre>
        )}
      </div>

    </main>
  );
}