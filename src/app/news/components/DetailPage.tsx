"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import SocialActions from "../components/SocialActions";
import CommentSection from "../components/CommentAction";
import { useParams } from "next/navigation";

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
  raw_text: string | null;
  creator_name: string | null;
  published_at: string | null;
  analyses: Analysis[];
  content_media: ContentMedia[];
}

export default function NewsDetailPage({ id }: { id: string }) {
  // kamu tidak perlu useParams() lagi
  console.log("id dari server:", id);

  useEffect(() => {
    console.log("useParams() ->", id);
    console.log("id ->", id);
  }, [id]);

  const [content, setContent] = useState<ContentDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await fetch(`/api/content/${id}`);
        if (!res.ok) throw new Error("Failed to fetch content");
        const data: ContentDetail = await res.json();
        setContent(data);
        console.log("Fetched content:", data);
        console.log("Content analyses:", data.analyses);
      } catch (err) {
        console.error("Error fetching content:", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchContent();
  }, [id]);

  if (loading)
    return (
      <main className="max-w-3xl mx-auto px-4 py-12 text-center text-gray-500">
        Loading article...
      </main>
    );

  if (!content)
    return (
      <main className="max-w-3xl mx-auto px-4 py-12 text-center text-red-500">
        Content not found.
      </main>
    );

  // Ambil nilai analisis (ambil 1 analisis terbaru kalau ada)
  const analysis = content.analyses[0] || {
    fact_percentage: 0,
    opinion_percentage: 0,
    hoax_percentage: 0,
  };

  // Ambil gambar pertama dari content_media
  const imageUrl =
    content.content_media.find((m) => m.type === "image")?.url ||
    "/img/home/news-1.png";

  return (
    <main className="max-w-3xl mx-auto px-4 py-8">
      {/* Topic + Author + Date */}
      <p className="text-sm text-green-600 font-medium">{content.topic}</p>
      <h1 className="mt-2 text-3xl font-bold">{content.title}</h1>
      <p className="text-sm text-gray-500">
        {content.creator_name || "Unknown"} •{" "}
        {new Date(content.published_at || "").toLocaleDateString("id-ID", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })}
      </p>

      {/* Analisis bar */}
      <div className="w-full bg-gray-300 h-5 mt-4 rounded-md overflow-hidden flex">
        <div
          className="bg-blue-800 h-full text-[10px] font-semibold flex items-center justify-center text-white"
          style={{ width: `${analysis.fact_percentage}%` }}
        >
          {analysis.fact_percentage > 5 && `Facts ${analysis.fact_percentage}%`}
        </div>
        <div
          className="bg-gray-500 h-full text-[10px] font-semibold flex items-center justify-center text-white"
          style={{ width: `${analysis.opinion_percentage}%` }}
        >
          {analysis.opinion_percentage > 5 &&
            `Opinion ${analysis.opinion_percentage}%`}
        </div>
        <div
          className="bg-red-800 h-full text-[10px] font-semibold flex items-center justify-center text-white"
          style={{ width: `${analysis.hoax_percentage}%` }}
        >
          {analysis.hoax_percentage > 5 &&
            `Hoax ${analysis.hoax_percentage}%`}
        </div>
      </div>

      {/* Hero Image */}
      <div className="relative w-full h-80 my-6 rounded-lg overflow-hidden">
        <Image
          src={imageUrl}
          alt={content.title || ""}
          fill
          className="object-cover"
        />
      </div>

      {/* Article Text */}
      <article className="prose max-w-none text-gray-800">
        {/* Gunakan paragraf dari content_media kalau ada */}
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

      {/* Social and Comments */}
      <SocialActions />
      <CommentSection />
    </main>
  );
}
