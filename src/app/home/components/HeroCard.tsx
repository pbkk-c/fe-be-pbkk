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

  // Auto-slide tiap beberapa detik
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % cards.length);
    }, interval);
    return () => clearInterval(timer);
  }, [cards.length, interval]);

  const current = cards[activeIndex];

  return (
    <UnstyledLink href={current.href ?? "#"} className="block">
      <div className="relative w-full min-h-[300px] md:min-h-[420px] lg:min-h-[520px] rounded-3xl overflow-hidden group cursor-pointer transition-all duration-500">
        <AnimatePresence mode="wait">
          <motion.div
            key={current.title}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            {/* Gambar */}
            <div className="relative h-[300px] md:h-[420px] lg:h-[520px] w-full">
              <motion.div
                className="absolute inset-0"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              >
                <Image
                  src={current.image}
                  alt={current.title}
                  fill
                  priority
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/50 to-transparent" />
              </motion.div>
            </div>

            {/* Konten */}
            <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-10 text-white transition-all duration-500 group-hover:border-4 group-hover:border-amber-500 rounded-3xl">
              <span className="absolute top-5 left-5 bg-white/90 text-black text-xs md:text-sm font-semibold px-4 py-1 rounded-full backdrop-blur-md">
                {current.category}
              </span>

              <h2 className="text-2xl md:text-4xl font-extrabold leading-snug drop-shadow-lg md:w-2/3 transition-all duration-300">
                {current.title}
              </h2>

              {/* Bar Fakta, Opini, Hoax */}
              <div className="w-full md:w-2/3 bg-gray-300 h-4 rounded-full overflow-hidden mt-4 flex shadow-inner">
                <div
                  className="bg-blue-800 h-full flex items-center justify-center text-[16px] font-semibold"
                  style={{ width: `${current.facts}%` }}
                >
                  {current.facts > 10 && `Facts ${current.facts}%`}
                </div>
                <div
                  className="bg-gray-500 h-full flex items-center justify-center text-[16px] font-semibold"
                  style={{ width: `${current.opinion}%` }}
                >
                  {current.opinion > 10 && `Opinion ${current.opinion}%`}
                </div>
                <div
                  className="bg-red-800 h-full flex items-center justify-center text-[16px] font-semibold py-2"
                  style={{ width: `${current.hoax}%` }}
                >
                  {current.hoax > 10 && `Hoax ${current.hoax}%`}
                </div>
              </div>

              <p className="text-gray-300 mt-3 md:w-2/3 text-sm md:text-base line-clamp-3 backdrop-blur-sm bg-black/10 p-2 rounded-md">
                {current.description}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </UnstyledLink>
  );
}
