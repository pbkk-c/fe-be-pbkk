"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Content } from "@/types/fetchContent";
import HeroCard from "@/app/home/components/HeroCard";
import FactBar from "../components/FactBar";
import NewsTopicCard from "../components/NewsTopicCard";
import Footer from "@/app/layouts/Footer";
import Navbar from "@/app/layouts/Navbar";
import FloatingAIButton from "@/app/home/components/FloatingButton";

export default function PoliticsPage() {
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
        console.error(err);
        setError("Gagal memuat berita politik. Silakan coba lagi nanti.");
      } finally {
        setLoading(false);
      }
    };
    fetchContents();
  }, []);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-orange-600 font-medium">
        Memuat berita politik...
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600 font-medium">
        {error}
      </div>
    );

  const politicalNews = contents.filter((item) => item.type === "News" && item.topic === "Politic");

  const featured = politicalNews[0];
  const latest = politicalNews.slice(1, 5);
  const moreNews = politicalNews.slice(5);

  return (
    <>
      <Navbar />

      <main className="px-6 md:px-16  pb-10 pt-20 bg-gradient-to-b from-orange-50 via-white to-orange-50 text-gray-900">
        {/* === HERO FEATURED === */}
        {featured ? (
          <HeroCard
            cards={politicalNews.slice(0, 10).map((item) => ({
              href: `/news/${item.id}`,
              category: item.topic ?? "Politics",
              title: item.title ?? "",
              description: item.raw_text?.slice(0, 120) ?? "",
              image: item.url ?? "/placeholder.jpg",
              facts: item.analyses?.[0]?.fact_percentage ?? 0,
              opinion: item.analyses?.[0]?.opinion_percentage ?? 0,
              hoax: item.analyses?.[0]?.hoax_percentage ?? 0,
            }))}
          />
        ) : (
          <p className="text-center text-gray-500">Belum ada berita politik tersedia.</p>
        )}

        {/* === LATEST NEWS === */}
        {latest.length > 0 && (
          <section className="mb-20 mt-14">
            <h2 className="text-2xl font-bold mb-6 border-b-4 border-orange-500 inline-block pb-1 text-orange-700">
              Berita Terbaru
            </h2>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {latest.map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1, duration: 0.6 }}
                  viewport={{ once: true }}
                >
                  <NewsTopicCard item={item} variant="grid" />
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* === MORE NEWS === */}
        {moreNews.length > 0 && (
          <section className="pb-10">
            <h2 className="text-2xl font-bold mb-6 border-b-4 border-orange-500 inline-block pb-1 text-orange-700">
              Berita Lainnya
            </h2>
            <div className="flex flex-col gap-6">
              {moreNews.map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  viewport={{ once: true }}
                >
                  <NewsTopicCard item={item} variant="list" />
                </motion.div>
              ))}
            </div>
            <FloatingAIButton />
          </section>
          
        )}
      </main>
      <Footer />
    </>
  );
}
