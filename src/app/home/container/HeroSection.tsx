"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import HeroCard from "../components/HeroCard";
import SmallNewsCard from "../components/SmallNewsCard";
import { Content } from "@/types/fetchContent";

export default function HeroSection() {
  const router = useRouter();
  const [contents, setContents] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
      {/* Hero Card (type = hero) */}
      {contents
        .filter((item) => item.type === "home")
         .slice(0, 1) 
        .map((item) => (
          <HeroCard
            key={item.id}
            category={item.topic ?? ""}
            title={item.title ?? ""}
            description={item.raw_text?.slice(0, 100) ?? ""}
            image="/img/home/news-3.png"
            // image={item.url ?? "/img/home/hero-1.png"}
            facts={item.analyses?.[0]?.fact_percentage ?? 0}
            opinion={item.analyses?.[0]?.opinion_percentage ?? 0}
            hoax={item.analyses?.[0]?.hoax_percentage ?? 0}
          />
        ))}

      {/* Headline Section (type = headline) */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        {contents
          .filter((item) => item.type === "home")
         .slice(0, 4) 
          .map((item) => (
            <SmallNewsCard
              key={item.id}
              title={item.title ?? ""}
              image="/img/home/news-1.png"
              href={`/news/${item.id}`}
            />
          ))}
      </div>
    </section>
  );
}
