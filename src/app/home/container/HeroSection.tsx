"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import HeroCard from "../components/HeroCard";
import SmallNewsCard from "../components/SmallNewsCard";
import { Content } from "@/types/fetchContent";
import SmallNewsCarousel from "../components/SmallNewsCardCarousel";

export default function HeroSection() {
  const router = useRouter();
  const [contents, setContents] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const headlineItems = contents.filter((item) => item.type === "home");
const itemsPerPage = 4;
const [page, setPage] = useState(1);
const totalPages = Math.ceil(headlineItems.length / itemsPerPage);

const paginatedItems = headlineItems.slice(
  (page - 1) * itemsPerPage,
  page * itemsPerPage
);

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
      {/* {contents
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
            href={`/news/${item.id}`}
            interval={5000}
          />
        ))} */}

        <HeroCard
  cards={contents
    .filter((item) => item.type === "home")
    .slice(0, 3)
    .map((item) => ({
      href: `/news/${item.id}`,
      category: item.topic ?? "",
      title: item.title ?? "",
      description: item.raw_text?.slice(0, 100) ?? "",
      image: "/img/home/news-3.png",
      facts: item.analyses?.[0]?.fact_percentage ?? 0,
      opinion: item.analyses?.[0]?.opinion_percentage ?? 0,
      hoax: item.analyses?.[0]?.hoax_percentage ?? 0,
    }))}
  interval={5000}
/>

      {/* Headline Section (type = headline) */}
      {/* <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        {contents
          .filter((item) => item.type === "home")
         .slice(0, 5) 
          .map((item) => (
            <SmallNewsCard
              key={item.id}
              title={item.title ?? ""}
              image="/img/home/news-1.png"
              href={`/news/${item.id}`}
            />
          ))}
      </div> */}

      <SmallNewsCarousel contents={contents} />

    </section>

    
  );
}
