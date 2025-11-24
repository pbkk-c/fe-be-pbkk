"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import UnstyledLink from "@/components/links/Unstyledlink";
import { Content } from "@/types/fetchContent";

export default function HighlightSection() {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);
  const [content, setContent] = useState<Content | null>(null);
  const [loading, setLoading] = useState(true);
  const [facts, setFacts] = useState(0);
  const [hoax, setHoax] = useState(0);
  const [opinion, setOpinion] = useState(0);

  useEffect(() => {
    const fetchHighlight = async () => {
      try {
        const res = await fetch("/xenotimes/api/xenotimes/content");
        if (!res.ok) throw new Error("Failed to fetch content");

        const data: Content[] = await res.json();
        const sorted = data
          // .sort((a, b) => (a.platform ?? 0) - (b.platform ?? 0))
          .filter((item) => item.type === "News");

        setContent(sorted[0] || null);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchHighlight();
  }, []);

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
      <section className="h-screen flex items-center justify-center bg-black text-gray-400">
        Loading highlight...
      </section>
    );
  }

  if (!content) {
    return (
      <section className="h-screen flex items-center justify-center bg-black text-red-400">
        Tidak ada highlight yang ditemukan.
      </section>
    );
  }

  return (
    <section
      ref={ref}
      className="relative min-h-[800px] md:min-h-screen bg-black w-full overflow-hidden shadow-xl"
    >
      <UnstyledLink
        href={`/xenotimes/news/${content.id}`}
        className="group relative block h-[800px] md:h-full w-full transition-transform duration-700 hover:scale-[1.01]"
      >
        {/* Background image */}
        <div className="relative h-[800px] md:h-screen w-full">
          {/* <Image
            // src={content.url || "/img/home/news-1.png"}
            src={`/xenotimes${content.url}`}
            alt={content.title || "Highlight news"}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            priority
          /> */}
          <div className="relative w-full h-full">
              <img
              src={`xenotimes${content.url}`}
                alt={content.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />
            </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/60"></div>
        </div>

        {/* Overlay konten */}
        <div
          className={`absolute inset-0 flex flex-col justify-end px-6 sm:px-10 md:px-20 pb-16 text-white transition-all duration-700 ease-out ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          <div className="max-w-5xl">
            <span className="bg-white/90 text-black text-xs sm:text-sm font-semibold px-3 py-1 rounded-full w-fit mb-4">
              {content.topic || "Story"}
            </span>

            <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold leading-snug mb-5 drop-shadow-lg">
              {content.title}
            </h1>

            {/* Progress bar */}
            <div
              className={`w-full sm:w-3/4 bg-gray-400/40 h-5 rounded-lg overflow-hidden flex mb-6 transition-all duration-700 ease-out ${
                visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
            >
              <div
                className="bg-blue-700 h-full flex items-center justify-center text-[10px] sm:text-xs font-semibold transition-all duration-700 ease-out"
                style={{ width: `${facts}%` }}
              >
                {facts >= 10 ? (
                  <span>Facts {facts}%</span>
                ) : facts > 4 ? (
                  <span>{facts}%</span>
                ) : null}
              </div>
              <div
                className="bg-red-700 h-full flex items-center justify-center text-[10px] sm:text-xs font-semibold transition-all duration-700 ease-out"
                style={{ width: `${hoax}%` }}
              >
                {hoax > 8 ? <span>Hoax {hoax}%</span> : hoax > 4 ? <span>{hoax}%</span> : null}
              </div>
              <div
                className="bg-gray-500 h-full flex items-center justify-center text-[10px] sm:text-xs font-semibold transition-all duration-700 ease-out"
                style={{ width: `${opinion}%` }}
              >
                {opinion >= 25 ? (
                  <span>Opinion {opinion}%</span>
                ) : opinion > 5 ? (
                  <span>{opinion}%</span>
                ) : null}
              </div>
            </div>

            <p
              className={`text-sm sm:text-base md:text-lg text-gray-200 max-w-4xl leading-relaxed transition-all duration-700 ease-out ${
                visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
            >
              {content.raw_text?.slice(0, 220) || "No description available for this news."}
            </p>
          </div>
        </div>
      </UnstyledLink>
    </section>
  );
}
