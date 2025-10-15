"use client";

import { useEffect, useState } from "react";
import { Content } from "@/types/fetchContent";
import NewsCard from "../components/NewsCard";

export default function LatestSection() {
  const [contents, setContents] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContents = async () => {
      try {
        const res = await fetch("/api/content");
        if (!res.ok) throw new Error("Failed to fetch contents");

        const data: Content[] = await res.json();
        setContents(data);
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
    return (
      <section className="px-16 py-6 text-center text-gray-500">
        Loading konten...
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
          <div className="grid md:grid-cols-4 gap-6">
            {contents
              .filter((item) => item.type === "home")
              .map((item) => (
                <NewsCard
                  key={item.id}
                  variant="medium"
                  title={item.title}
                   description={item.raw_text?.slice(0, 100) ?? ""}
                   image="/img/home/news-2.png"
                    category={item.topic ?? ""}
                  href={`/news/${item.id}`}
                />
              ))}
          </div>
        </section>
  );
}
