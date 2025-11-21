"use client";

import { useEffect, useState } from "react";
import { Content } from "@/types/fetchContent";
import NewsCard from "../components/NewsCard";

export default function LatestSection() {
  const [contents, setContents] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 24;

  useEffect(() => {
    const fetchContents = async () => {
      try {
        const res = await fetch("/xenotimes/api/xenotimes/content");
        if (!res.ok) throw new Error("Failed to fetch contents");

        const data: Content[] = await res.json();

        // 🔍 Filter hanya konten bertipe News
        const filtered = data.filter((item) => item.type === "News");

        // 🎲 Acak urutan biar tampilnya tidak monoton
        const shuffled = filtered.sort(() => Math.random() - 0.5);

        setContents(shuffled);
      } catch (err) {
        console.error("Error fetching contents:", err);
        setError("Gagal memuat konten. Coba lagi nanti.");
      } finally {
        setLoading(false);
      }
    };

    fetchContents();
  }, []);

  if (loading) {
    return <section className="px-16 py-12 text-center text-gray-500">Loading konten...</section>;
  }

  if (error) {
    return <section className="px-16 py-12 text-center text-red-500">{error}</section>;
  }

  const totalPages = Math.ceil(contents.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = contents.slice(startIndex, startIndex + itemsPerPage);

  return (
    <section className="lg:col-span-3 px-16 py-12 bg-[#FFFDF9]">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-extrabold text-2xl md:text-3xl text-[#1F2937]">Latest News</h2>
        <span className="text-sm text-gray-500">
          Showing {startIndex + 1} - {Math.min(startIndex + itemsPerPage, contents.length)} of{" "}
          {contents.length}
        </span>
      </div>

      {/* Grid News */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {currentItems.map((item) => (
          <NewsCard
            key={item.id}
            variant="medium"
            title={item.title}
            description={item.raw_text?.slice(0, 100) ?? ""}
            // image={item.url ?? "/img/home/hero-1.png"}
            image = {`/xenotimes${item.url}`}
            category={item.topic ?? ""}
            href={`/xenotimes/news/${item.id}`}
          />
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-10 space-x-2">
        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            className={`px-4 py-2 rounded-lg border transition-all font-semibold ${
              currentPage === i + 1
                ? "bg-[#D97706] text-white border-[#D97706]"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </section>
  );
}
