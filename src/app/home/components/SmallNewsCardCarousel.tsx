"use client";

import { useRef } from "react";
import SmallNewsCard from "./SmallNewsCard";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Content } from "@/types/fetchContent";

interface SmallNewsCarouselProps {
  contents: Content[];
}

export default function SmallNewsCarousel({ contents }: SmallNewsCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const { scrollLeft, clientWidth } = scrollRef.current;
    const scrollAmount = clientWidth * 0.8;
    scrollRef.current.scrollTo({
      left: direction === "left" ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
      behavior: "smooth",
    });
  };

  // Sort & filter
  const filtered = contents
    .filter((item) => item.type === "News")
    .sort((a, b) => (Number(a.platform) || 0) - (Number(b.platform) || 0));

  return (
    <div className="relative mt-8">
      {/* Tombol kiri */}
      <button
        onClick={() => scroll("left")}
        className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white/80 backdrop-blur-md hover:bg-white shadow-lg rounded-full p-2 transition"
      >
        <ChevronLeft className="w-5 h-5 text-gray-700" />
      </button>

      {/* Scroll container */}
      <div className="relative">
        {/* Fade kiri-kanan */}
        <div className="pointer-events-none absolute left-0 top-0 h-full w-12 bg-gradient-to-r from-white to-transparent z-5" />
        <div className="pointer-events-none absolute right-0 top-0 h-full w-12 bg-gradient-to-l from-white to-transparent z-5" />

        <div ref={scrollRef} className="flex gap-5 overflow-x-auto scroll-smooth no-scrollbar py-2">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="min-w-[200px] sm:min-w-[260px] md:min-w-[400px] lg:min-w-[450px] flex-shrink-0"
            >
              <SmallNewsCard
                title={item.title ?? ""}
                category={item.topic ?? ""}
                // image={item.url ?? ""}
                image={`xenotimes${item.url}`}
                href={`/news/${item.id}`}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Tombol kanan */}
      <button
        onClick={() => scroll("right")}
        className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white/80 backdrop-blur-md hover:bg-white shadow-lg rounded-full p-2 transition"
      >
        <ChevronRight className="w-5 h-5 text-gray-700" />
      </button>
    </div>
  );
}
