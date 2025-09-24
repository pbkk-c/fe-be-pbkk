"use client";

import Button from "@/components/buttons/Button";
import supabase from "@/lib/db";
import type { NewsType } from "@/types/news";
import { useEffect, useState } from "react";

export default function Home() {
  const [news, setNews] = useState<NewsType[]>([]);

  useEffect(() => {
    // Fetch news data from Supabase
    const fetchNews = async () => {
        const { data, error } = await supabase.from('news').select('*');
        if (error) {
            console.error('Error fetching news:', error);
        } else {
            setNews(data);
        }
    };

    fetchNews();
  }, [supabase]);

  console.log(news);
  
  return (
<div>

    <h1 className="text-3xl bg-sky-500 font-bold underline">
      Hello world!
    </h1>
    <h1 className="text-3xl bg-reeva-secondary-5 font-bold underline">haloo</h1>
    <div className="w-10 h-10 bg-slate-700"></div>
    <Button variant="blue" size="lg">
      Button
    </Button>

</div>
  );
}
