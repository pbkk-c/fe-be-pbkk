"use client";

import Image from "next/image";
import UnstyledLink from "@/components/links/Unstyledlink";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

type HeroCardData = {
  href?: string;
  category: string;
  title: string;
  description: string;
  image: string;
  facts: number;
  opinion: number;
  hoax: number;
};

type HeroCardProps = {
  cards: HeroCardData[];
  interval?: number; // default: 5 detik
};

export default function HeroCard({ cards, interval = 5000 }: HeroCardProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % cards.length);
    }, interval);
    return () => clearInterval(timer);
  }, [cards.length, interval]);

  const current = cards[activeIndex] ?? {
    href: "#",
    category: "Loading...",
    title: "Please wait",
    description: "",
    image: "/placeholder.jpg",
    facts: 0,
    opinion: 0,
    hoax: 0,
  };

  return (
    <UnstyledLink href={current.href ?? "#"} className="block">
      <div className="relative w-full min-h-[300px] md:min-h-[420px] lg:min-h-[520px] rounded-3xl overflow-hidden group cursor-pointer shadow-lg transition-all duration-500">
        <AnimatePresence mode="wait">
          <motion.div
            key={current.title}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            {/* Gambar Latar */}
            <div className="relative h-[300px] md:h-[420px] lg:h-[520px] w-full">
              {/* <img
  src={current.image}
                alt={current.title}
                fill
                priority
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              /> */}
              <Image
                src={current.image ? current.image : ""}
                alt={current.title}
                fill
                priority
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent" />
            </div>

            {/* Konten */}
            <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-10 text-white">
              {/* Kategori */}
              <span className="absolute top-5 left-5 bg-white/90 text-black text-xs md:text-sm font-semibold px-4 py-1 rounded-full shadow-sm backdrop-blur-md">
                {current.category}
              </span>

              {/* Judul */}
              <h2 className="text-xl md:text-4xl font-bold leading-snug drop-shadow-lg md:w-3/4 transition-all duration-300 group-hover:text-amber-400 line-clamp-3">
                {current.title}
              </h2>

              {/* Bar Fakta / Opini / Hoax */}
              <div className="w-full md:w-3/4 bg-gray-200 h-4 rounded-full overflow-hidden mt-5 flex shadow-inner">
                <div
                  className="bg-blue-700 h-full flex items-center justify-center text-[10px] md:text-[14px] font-semibold"
                  style={{ width: `${current.facts}%` }}
                >
                  {current.facts > 20 ? (
                    <span>Facts {current.facts}%</span>
                  ) : current.facts >= 5 ? (
                    <span>{current.facts}%</span>
                  ) : null}
                </div>
                <div
                  className="bg-gray-500 h-full flex items-center justify-center text-[10px] md:text-[14px] font-semibold"
                  style={{ width: `${current.opinion}%` }}
                >
                  {current.opinion >= 25 ? (
                    <span>Opinion {current.opinion}%</span>
                  ) : current.opinion >= 5 ? (
                    <span>{current.opinion}%</span>
                  ) : null}
                </div>
                <div
                  className="bg-red-700 h-full flex items-center justify-center text-[10px] md:text-[14px] font-semibold"
                  style={{ width: `${current.hoax}%` }}
                >
                  {current.hoax > 15 ? (
                    <span>Hoax {current.hoax}%</span>
                  ) : current.hoax >= 5 ? (
                    <span>{current.hoax}%</span>
                  ) : null}
                </div>
              </div>

              {/* Deskripsi */}
              <p className="text-gray-300 mt-3 md:w-3/4 text-sm md:text-base bg-black/30 backdrop-blur-sm p-3 rounded-lg shadow-sm">
                <span className="md:hidden">
                  {current.description.length >= 80
                    ? current.description.slice(0, 80) + "..."
                    : (current.description ?? "")}
                </span>
                <span className="hidden md:inline">
                  {current.description.length >= 150
                    ? current.description.slice(0, 150) + "..."
                    : (current.description ?? "")}
                </span>
              </p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </UnstyledLink>
  );
}
