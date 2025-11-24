"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import UnstyledLink from "@/components/links/Unstyledlink";
import { Content } from "@/types/fetchContent";

export default function Highlight2Section() {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);
  const [content, setContent] = useState<Content | null>(null);
  const [loading, setLoading] = useState(true);
  const [facts, setFacts] = useState(0);
  const [hoax, setHoax] = useState(0);
  const [opinion, setOpinion] = useState(0);

  // 🔹 Fetch konten highlight ke-2
  useEffect(() => {
    const fetchHighlight2 = async () => {
      try {
        const res = await fetch("/xenotimes/api/xenotimes/content");
        if (!res.ok) throw new Error("Failed to fetch content");

        const data: Content[] = await res.json();
        const sorted = data.filter((item) => item.type === "News");

        // ambil konten ke-2
        setContent(sorted[1] || null);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchHighlight2();
  }, []);

  // 🔹 Animasi hanya saat komponen terlihat
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && content) {
          setVisible(true);
          setTimeout(() => {
            setFacts(content.analyses?.[0]?.fact_percentage ?? 0);
            setHoax(content.analyses?.[0]?.hoax_percentage ?? 0);
            setOpinion(content.analyses?.[0]?.opinion_percentage ?? 0);
          }, 400);
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => {
      if (ref.current) observer.unobserve(ref.current);
    };
  }, [content]);

  if (loading) {
    return (
      <section className="min-h-screen flex items-center justify-center text-gray-500">
        Loading highlight...
      </section>
    );
  }

  if (!content) {
    return (
      <section className="min-h-screen flex items-center justify-center text-red-500">
        Tidak ada konten highlight ke-2.
      </section>
    );
  }

  return (
    <section
      ref={ref}
      className="min-h-[1000px] xl:min-h-screen flex flex-col md:flex-row items-center justify-center px-6 sm:px-12 lg:px-24 py-10 gap-10"
    >
      {/* Bagian kiri: gambar */}
      <UnstyledLink
        href={`/xenotimes/news/${content.id}`}
        className="group relative w-full md:w-1/2 h-[400px] sm:h-[480px] lg:h-[560px] rounded-3xl overflow-hidden shadow-xl transition-transform duration-700 hover:scale-[1.03]"
      >
        {/* <Image
          // src={content.url || "/img/home/news-4.png"}
          src={`xenotimes${content.url}`}
          alt={content.title || "Highlight news"}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          priority
        /> */}
          <div className="relative w-full h-full">
              <img
                // src={current.image ? current.image : ""}
                src={`xenotimes${content.url}`}
                alt={content.title || "Highlight news"}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />
            </div>
      </UnstyledLink>

      {/* Bagian kanan: konten */}
      <div
        className={`flex flex-col md:w-1/2 text-center md:text-left transition-all duration-700 ease-out ${
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        }`}
      >
        {/* Label */}
        <span className="bg-black/80 text-white text-xs sm:text-sm font-semibold px-3 py-1 rounded-full w-fit mx-auto md:mx-0 mb-4">
          {content.topic || "Story"}
        </span>

        {/* Judul */}
        <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-extrabold leading-snug mb-5">
          {content.title}
        </h1>

        {/* Bar persentase */}
        <div className="flex items-center justify-center md:justify-start w-full sm:w-3/4 bg-gray-200 rounded-md overflow-hidden h-8 text-xs lg:text-sm font-semibold mb-5">
          <div
            className="bg-blue-700 h-full flex items-center justify-center text-white transition-all duration-700 ease-out"
            style={{ width: `${facts}%` }}
          >
            {facts >= 30 ? <span>Facts {facts}%</span> : facts > 4 ? <span>{facts}%</span> : null}
          </div>
          <div
            className="bg-red-700 h-full flex items-center justify-center text-white transition-all duration-700 ease-out"
            style={{ width: `${hoax}%` }}
          >
            {hoax >= 20 ? <span>Hoax {hoax}%</span> : hoax > 4 ? <span>{hoax}%</span> : null}
          </div>
          <div
            className="bg-gray-500 h-full flex items-center justify-center text-white transition-all duration-700 ease-out"
            style={{ width: `${opinion}%` }}
          >
            {opinion >= 40 ? (
              <span>Opinion {opinion}%</span>
            ) : opinion > 4 ? (
              <span>{opinion}%</span>
            ) : null}
          </div>
        </div>

        {/* Deskripsi */}
        <p className="text-gray-700 text-sm sm:text-base md:text-lg leading-relaxed max-w-xl mx-auto md:mx-0">
          {content.raw_text?.slice(0, 200) || "No description available for this news."}
        </p>
      </div>
    </section>
  );
}
