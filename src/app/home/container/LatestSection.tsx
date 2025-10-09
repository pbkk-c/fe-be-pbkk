"use client";

import { useEffect, useState } from "react";
// import { Content } from "@/types/fetchContent";
import NewsCard from "../components/NewsCard";
import { ContentPublic } from "@/types/ContentPublic";

export default function LatestSection() {
  const [contents, setContents] = useState<ContentPublic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContents = async () => {
      try {
        const res = await fetch("/api/content-public", { cache: "no-store" }); // biar gak cached
        if (!res.ok) throw new Error("Failed to fetch contents");

        const data: ContentPublic[] = await res.json();
        setContents(data);
      } catch (err) {
        console.error("Error fetching contents:", err);
        setError("Gagal memuat berita. Coba lagi nanti.");
      } finally {
        setLoading(false);
      }
    };

    fetchContents();
  }, []);

  if (loading) {
    return (
      <section className="px-16 py-6 text-center text-gray-500">
        Loading berita...
      </section>
    );
  }

  if (error) {
    return (
      <section className="px-16 py-6 text-center text-red-500">
        {error}
      </section>
    );
  }

  return (
    <section className="lg:col-span-3 px-16 py-6">
      <h2 className="font-bold text-2xl mb-4">Latest News</h2>
      <div className="grid md:grid-cols-2 gap-6">
        {contents.length > 0 ? (
          contents
            .filter((item) => item.type === "home")
            .map((item) => (
              <NewsCard
                key={item.id}
                variant="medium"
                title={item.title}
                description={item.raw_text?.slice(0, 100) ?? ""}
                image={item.urlToImage ?? "/img/home/news-2.png"} // pakai dari API
                category={item.topic ?? ""}
                // href={item.url ?? "#"} // langsung ke artikel aslinya
                 href={`/news/${item.id}`}
                // href={item.url ?? "#"} // langsung ke artikel aslinya
              />
            ))
        ) : (
          <p className="text-gray-500 text-center col-span-2">
            Tidak ada berita ditemukan.
          </p>
        )}
      </div>
    </section>
  );
}
