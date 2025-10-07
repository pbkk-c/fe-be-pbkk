"use client";

import Button from "@/components/buttons/Button";
import supabase from "@/lib/db";
import type { NewsType } from "@/types/news";
import { useEffect, useState } from "react";
import HomePage from "./home/page";

export default function Home() {
  // const [news, setNews] = useState<NewsType[]>([]);

  // useEffect(() => {
  //   // Fetch news data from Supabase
  //   const fetchNews = async () => {
  //       try {
  //           const response = await supabase.from('news').select('*');
  //           if (response.error) {
  //               console.error('Error fetching news:', response.error);  
  //           } else {
  //               setNews(response.data as NewsType[]);
  //           }
  //       } catch (error) {
  //           console.error('Unexpected error:', error);
  //       }
  //   };
  //   fetchNews();
  // }, []);

  // console.log(news);  
  
  return (
<div>

  <HomePage />
    {/* <h1 className="text-3xl bg-sky-500 font-bold underline">
      Hello world!
    </h1> */}
    {/* <h1 className="text-3xl bg-reeva-secondary-5 font-bold underline">haloo</h1>
    <div className="w-10 h-10 bg-slate-700"></div> */}
    {/* <Button variant="blue" size="lg">
      Button
    </Button> */}

</div>
  );
}
