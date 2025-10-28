"use client";

import { useEffect, useState } from "react";
import HeroCard from "../components/HeroCard";
import { Content } from "@/types/fetchContent";
import SmallNewsCarousel from "../components/SmallNewsCardCarousel";

export default function HeroSection() {
  const [contents, setContents] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

useEffect(() => {
  console.log("Fetched contents:", contents);
}, [contents]);

  // Fetch data dari API
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

  console.log("HeroSection contents state:", contents);

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

  console.log("Rendering HeroSection with contents:", contents);
  

  return (
    <section className="lg:col-span-3 px-16 py-12">
<HeroCard
  cards={contents
    .sort((a, b) => (a.platform ?? 0) - (b.platform ?? 0)) // urutkan berdasarkan platform
    .filter((item) => item.type === "News" || item.type === "history")
    .slice(0, 10)
    .map((item, index) => ({
      href: `/news/${item.id}`,
      category: item.topic,
      title: item.title,
      description: item.raw_text?.slice(0, 100),
      image: item.url,
      facts: item.analyses?.[0]?.fact_percentage ?? 0,
      opinion: item.analyses?.[0]?.opinion_percentage ?? 0,
      hoax: item.analyses?.[0]?.hoax_percentage ?? 0,
    }))}
/>
      <SmallNewsCarousel contents={contents} />
    </section>
  );
}
