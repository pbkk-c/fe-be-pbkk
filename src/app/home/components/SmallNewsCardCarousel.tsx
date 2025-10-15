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
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollAmount = clientWidth * 0.8; // geser 80% lebar container
      scrollRef.current.scrollTo({
        left: direction === "left" ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const filtered = contents.filter((item) => item.type === "home");

  return (
    <div className="relative mt-6">
      {/* Tombol Kiri */}
      <button
        onClick={() => scroll("left")}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/70 hover:bg-white rounded-full shadow-md p-2 transition"
      >
        <ChevronLeft className="w-5 h-5 text-gray-700" />
      </button>

      {/* Container Scroll */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scroll-smooth no-scrollbar px-10"
      >
        {filtered.map((item) => (
          <div key={item.id} className="min-w-[200px] md:min-w-[450px] flex-shrink-0">
            <SmallNewsCard
              title={item.title ?? ""}
              category={item.topic ?? ""}
              image="/img/home/news-1.png"
              href={`/news/${item.id}`}
            />
          </div>
        ))}
      </div>

      {/* Tombol Kanan */}
      <button
        onClick={() => scroll("right")}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/70 hover:bg-white rounded-full shadow-md p-2 transition"
      >
        <ChevronRight className="w-5 h-5 text-gray-700" />
      </button>
    </div>
  );
}
