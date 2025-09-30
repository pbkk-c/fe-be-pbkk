"use client";

import supabase from "@/lib/db";
import HeroCard from "./components/HeroCard";
import NewsCard from "./components/NewsCard";
import SmallNewsCard from "./components/SmallNewsCard";
import { useEffect, useState } from "react";
import { NewsType } from "@/types/news";
import { Search } from 'lucide-react';
import { useRouter } from "next/navigation";

export default function HomePage() {
   const [news, setNews] = useState<NewsType[]>([]);
    const router = useRouter();


  useEffect(() => {
    // Fetch news data from Supabase
    const fetchNews = async () => {
        try {
            const response = await supabase.from('news').select('*');
            if (response.error) {
                console.error('Error fetching news:', response.error);  
            } else {
                setNews(response.data as NewsType[]);
            }
        } catch (error) {
            console.error('Unexpected error:', error);
        }
    };
    fetchNews();
  }, []);

  console.log(news);  
  return (
    <>
    <main className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* Hero Section - full width */}
      <section className="lg:col-span-3">
        {news
          .filter((item) => item.type === "hero")
          .map((item) => (
            <HeroCard
              key={item.id}
              category={item.category ?? ""}
              title={item.title}
              description={item.description ?? ""}
              // image={item.img ?? ""}
              image="/img/home/hero-1.png"
            />
          ))}

        {/* Sub News Section */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            {news
            .filter((item) => item.type === "headline")
            .map((item) => (
              <SmallNewsCard
                key={item.id}
                title={item.title}
                image={item.img ?? ""}
                href={`/news/${item.id}`} // atau slug kalau ada
              />
            ))}
        </div>
      </section>

      {/* News Section (2/3 width) */}
      {/* TENTATIVE */}
      {/* <section className="lg:col-span-2 grid grid-cols-2 gap-4">
        <NewsCard
          variant="big"
          title="Lorem Ipsum Dolor Sit Amet"
          description="Shaking up political traditions..."
          image="/img/home/news-1.png"
          category="Politics"
          href="/news/sample-article"
        />
        <NewsCard
          variant="small"
          title="Lorem Ipsum Dolor Sit Amet"
          image="/img/home/news-1.png"
          category="Science"
        />
        <NewsCard
          variant="small"
          title="Lorem Ipsum Dolor Sit Amet"
          image="/img/home/news-1.png"
          category="World"
        />
      </section> */}

      {/* Trending Headlines (1/3 width) */}
      {/* TENTATIVE */}
      {/* <aside className="lg:col-span-1 space-y-4">
        <h2 className="font-bold text-xl">Trending Headlines</h2>
        <div className="space-y-3">
          <NewsCard
            variant="trending"
            title="Lorem Ipsum Dolor Sit Amet"
            image="/img/home/news-1.png"
          />
          <NewsCard
            variant="trending"
            title="Lorem Ipsum Dolor Sit Amet"
            image="/img/home/news-1.png"
          />
          <NewsCard
            variant="trending"
            title="Lorem Ipsum Dolor Sit Amet"
            image="/img/home/news-1.png"
          />
          <NewsCard
            variant="trending"
            title="Lorem Ipsum Dolor Sit Amet"
            image="/img/home/news-1.png"
          />
        </div>
      </aside> */}

      {/* Latest News - full width */}
      <section className="lg:col-span-3">
        <h2 className="font-bold text-2xl mb-4">Latest News</h2>
        <div className="grid md:grid-cols-2 gap-6">
            {news
          .filter((item) => item.type === "medium")
          .map((item) => (
            <NewsCard
              key={item.id}
              variant="medium" // atau "small", bisa atur sendiri
              title={item.title}
              description={item.description ?? ""}
              image={item.img ?? "/img/home/news-1.png"}
              // image="/img/home/news-1.png"
              category={item.category ?? ""}
              href={`/news/${item.id}`}
            />
          ))}
        </div>
      </section>
    </main>
     <div className="fixed bottom-6 right-6 group">
        <button
          onClick={() => router.push("/analyzer")}
          className="relative flex items-center justify-center w-14 h-14 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg transition-colors duration-300"
        >
          <Search className="w-6 h-6" />
          {/* Tooltip */}
          <span className="absolute right-full mr-3 px-3 py-1 bg-gray-800 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
            Gunakan AI untuk temukan fakta atau opini
          </span>
        </button>
      </div>
      </>
  );
}
