"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
// import UnstyledLink from "@/components/links/UnstyledLink";
import UnstyledLink from "@/components/links/Unstyledlink";

export default function HighlightSection() {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);
  const [facts, setFacts] = useState(0);
  const [hoax, setHoax] = useState(0);
  const [opinion, setOpinion] = useState(0);

  // Observer untuk animasi on-scroll (seperti AOS)
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setVisible(true);
          setTimeout(() => {
            setFacts(60);
            setHoax(30);
            setOpinion(10);
          }, 400);
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => {
      if (ref.current) observer.unobserve(ref.current);
    };
  }, []);

  return (
    <section
      ref={ref}
      className="relative min-h-screen bg-black w-full overflow-hidden shadow-xl"
    >
      <UnstyledLink
        href="/news/1"
        className="group relative block p-10 h-full w-full transition-transform duration-700 hover:scale-[1.01]"
      >
        {/* Background image */}
        <div className="relative h-screen w-full">
          <Image
            src="/img/home/news-4.png" // ganti sesuai aset kamu
            alt="Protests Breaks Out In Texas"
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            priority
          />
          <div className="absolute inset-0 bg-black/60"></div>
        </div>

        {/* Overlay konten */}
        <div
          className={`absolute inset-0 flex flex-col justify-end px-6 sm:px-10 pb-10 text-white transition-all duration-700 ease-out ${
            visible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-6"
          }`}
        >
          <span className="bg-white/90 text-black text-xs sm:text-sm font-semibold px-3 py-1 rounded-full w-fit mb-4">
            Story
          </span>

          <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold leading-snug mb-3 drop-shadow-lg">
            Protests Breaks Out In Texas
          </h1>

          {/* Progress bar */}
          <div
            className={`w-full sm:w-2/3 bg-gray-400/50 h-5 rounded-lg overflow-hidden flex mb-4 transition-all duration-700 ease-out ${
              visible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4"
            }`}
          >
            <div
              className="bg-blue-700 h-full flex items-center justify-center text-[10px] sm:text-xs font-semibold transition-all duration-700 ease-out"
              style={{ width: `${facts}%` }}
            >
              {facts > 5 && <span>Facts {facts}%</span>}
            </div>
            <div
              className="bg-red-700 h-full flex items-center justify-center text-[10px] sm:text-xs font-semibold transition-all duration-700 ease-out"
              style={{ width: `${hoax}%` }}
            >
              {hoax > 5 && <span>Hoax {hoax}%</span>}
            </div>
            <div
              className="bg-purple-700 h-full flex items-center justify-center text-[10px] sm:text-xs font-semibold transition-all duration-700 ease-out"
              style={{ width: `${opinion}%` }}
            >
              {opinion > 5 && <span>Op {opinion}%</span>}
            </div>
          </div>

          <p
            className={`text-sm sm:text-base md:text-lg text-gray-200 max-w-3xl transition-all duration-700 ease-out ${
              visible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4"
            }`}
          >
            Protests broke out in California as thousands took to the streets to
            oppose recent policy changes, leading to clashes with law
            enforcement and a state of emergency declared in several cities.
          </p>
        </div>
      </UnstyledLink>
    </section>
  );
}
