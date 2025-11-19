"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import Footer from "@/app/layouts/Footer";
import Navbar from "@/app/layouts/Navbar";
import FloatingAIButton from "@/app/home/components/FloatingButton";
import LoadingScreen from "@/app/components/LoadingScree";

interface Analysis {
  created_at: string;
  fact_percentage: number;
  opinion_percentage: number;
  hoax_percentage: number;
}

interface ContentMedia {
  id: string;
  type: string | null;
  url: string | null;
  text: string | null;
  created_at: string | null;
}

interface ContentDetail {
  id: string;
  title: string | null;
  topic: string | null;
  url: string | null;
  raw_text: string | null;
  creator_name: string | null;
  published_at: string | null;
  analyses: Analysis[];
  content_media: ContentMedia[];
}

export default function NewsDetailPage() {
  const params = useParams();
  const id = params?.slug as string | undefined;

  const [content, setContent] = useState<ContentDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("Params object:", params);
    console.log("Extracted id:", id);
  }, [params, id]);

  useEffect(() => {
    const fetchContent = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const res = await fetch(`/api/content/${id}`);
        if (!res.ok) throw new Error(`Failed to fetch content: ${res.status}`);
        const data: ContentDetail = await res.json();
        setContent(data);
        console.log("Fetched content:", data);
      } catch (err) {
        console.error("Error fetching content:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [id]);

  if (loading) {
    return <LoadingScreen />;
  }

  if (!content)
    return (
      <main className="max-w-3xl mx-auto px-4 py-12 text-center text-red-500">
        Content not found.
      </main>
    );

  const analysis = content.analyses[0] || {
    fact_percentage: 0,
    opinion_percentage: 0,
    hoax_percentage: 0,
  };

  const imageUrl = content.url || "/img/home/news-1.png";

  return (
    <>
      <Navbar />

      <main className="max-w-3xl mx-auto px-4 pt-24 pb-16">
        {/* Topic + Author + Date */}
        <p className="text-sm text-amber-600 font-medium">{content.topic}</p>
        <h1 className="mt-2 text-3xl font-bold">{content.title}</h1>
        <p className="text-sm text-gray-500">
          {content.creator_name || "Unknown"} •{" "}
          {new Date(content.published_at || "").toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </p>

        {/* Hero Image */}
        <div className="relative w-full h-80 my-6 rounded-lg overflow-hidden">
          <Image src={imageUrl} alt={content.title || ""} fill className="object-cover" />
        </div>

        {/* Analisis bar */}
        <div className="w-full bg-gray-300 h-5 mt-4 rounded-md overflow-hidden flex">
          <div
            className="bg-blue-800 h-full text-[10px] font-semibold flex items-center justify-center text-white"
            style={{ width: `${analysis.fact_percentage}%` }}
          >
            {analysis.fact_percentage >= 20 ? `Facts ${analysis.fact_percentage}%` : analysis.fact_percentage >= 5 ? `${analysis.fact_percentage}%` : null}
          </div>
          <div
            className="bg-gray-500 h-full text-[10px] font-semibold flex items-center justify-center text-white"
            style={{ width: `${analysis.opinion_percentage}%` }}
          >
            {analysis.opinion_percentage >= 25  ? `Opinion ${analysis.opinion_percentage}%` : analysis.opinion_percentage >= 5  ? `${analysis.opinion_percentage}%` : null}
          </div>
          <div
            className="bg-red-800 h-full text-[10px] font-semibold flex items-center justify-center text-white"
            style={{ width: `${analysis.hoax_percentage}%` }}
          >
            {analysis.hoax_percentage >= 15 ? `Hoax ${analysis.hoax_percentage}%` : analysis.hoax_percentage >= 5 ? `${analysis.hoax_percentage}%` : null}
          </div>
        </div>
        {/* Article Text */}
        <article className="prose max-w-none text-gray-800">
          {content.content_media.length > 0 ? (
            content.content_media
              .filter((m) => m.text)
              .map((m) => (
                <p key={m.id} className="mb-4">
                  {m.text}
                </p>
              ))
          ) : (
            <p>{content.raw_text}</p>
          )}
        </article>

        {/* === HIDE DULU === */}
        {/* <SocialActions />
      <CommentSection /> */}
        <FloatingAIButton />
      </main>
      <Footer />
    </>
  );
}
