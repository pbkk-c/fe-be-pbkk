"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import UnstyledLink from "@/components/links/Unstyledlink";

export default function Highlight2Section() {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);
  const [facts, setFacts] = useState(0);
  const [hoax, setHoax] = useState(0);
  const [opinion, setOpinion] = useState(0);

  // Animasi hanya muncul saat di-scroll ke viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setVisible(true);
          setTimeout(() => {
            setFacts(25);
            setHoax(15);
            setOpinion(60);
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
      className="min-h-screen flex flex-col md:flex-row items-center justify-center px-6 sm:px-12 lg:px-24 py-10 gap-10"
    >
      {/* Bagian kiri: gambar */}
      <UnstyledLink
        href="/news/2"
        className="group relative w-full md:w-1/2 h-[400px] sm:h-[480px] lg:h-[560px] rounded-3xl overflow-hidden shadow-xl transition-transform duration-700 hover:scale-[1.03]"
      >
        <Image
          src="/img/home/news-4.png" // ganti dengan path gambarmu
          alt="Local Government Faces Criticism Over New Policies"
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          priority
        />
      </UnstyledLink>

      {/* Bagian kanan: konten */}
      <div
        className={`flex flex-col md:w-1/2 text-center md:text-left transition-all duration-700 ease-out ${
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        }`}
      >
        {/* Label */}
        <span className="bg-black/80 text-white text-xs sm:text-sm font-semibold px-3 py-1 rounded-full w-fit mx-auto md:mx-0 mb-4">
          Story
        </span>

        {/* Judul */}
        <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-extrabold leading-snug mb-5">
          Local Government Faces Criticism Over New Policies
        </h1>

        {/* Bar persentase */}
        <div className="flex items-center justify-center md:justify-start w-full sm:w-3/4 bg-gray-200 rounded-md overflow-hidden h-8 text-xs sm:text-sm font-semibold mb-5">
          <div
            className="bg-gray-600 h-full flex items-center justify-center text-white transition-all duration-700 ease-out"
            style={{ width: `${facts}%` }}
          >
            {facts > 3 && <span>Facts {facts}%</span>}
          </div>
          <div
            className="bg-red-600 h-full flex items-center justify-center text-white transition-all duration-700 ease-out"
            style={{ width: `${hoax}%` }}
          >
            {hoax > 3 && <span>Hoax {hoax}%</span>}
          </div>
          <div
            className="bg-blue-700 h-full flex items-center justify-center text-white transition-all duration-700 ease-out"
            style={{ width: `${opinion}%` }}
          >
            {opinion > 3 && <span>Opinion {opinion}%</span>}
          </div>
        </div>

        {/* Deskripsi */}
        <p className="text-gray-700 text-sm sm:text-base md:text-lg leading-relaxed max-w-xl mx-auto md:mx-0">
          Local Government Faces Criticism Over New Policies as thousands took
          to the streets to oppose recent policy changes, leading to clashes
          with law enforcement and a state of emergency declared in several
          cities.
        </p>
      </div>
    </section>
  );
}
