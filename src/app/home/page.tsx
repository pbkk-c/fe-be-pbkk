"use client";

import supabase from "@/lib/db";
import HeroCard from "./components/HeroCard";
import NewsCard from "./components/NewsCard";
import SmallNewsCard from "./components/SmallNewsCard";
import { useEffect, useState } from "react";
import { NewsType } from "@/types/news";
import { Search } from 'lucide-react';
import { useRouter } from "next/navigation";
import SportsSection from "./container/SportsSection";
import TechSection from "./container/TechSection";
import Navbar from "../layouts/Navbar";
import Footer from "../layouts/Footer";
import HeroSection from "./container/HeroSection";
import LatestSection from "./container/LatestSection";
import HighlightSection from "./container/HighlightSection";
import PoliticsSection from "./container/PoliticsSection";
import Highlight2Section from "./container/Highlight2Section";
import FloatingAIButton from "./components/FloatingButton";

export default function HomePage() {
  const router = useRouter();

  // Data manual (hardcode)
  const mockNews: NewsType[] = [
    {
      id: "1",
      title: "Pemerintah Umumkan Kebijakan Ekonomi Baru",
      description: "Ringkasan kebijakan ekonomi terbaru yang diharapkan memperkuat pertumbuhan nasional.",
      img: "/img/home/news-1.png",
      category: "economy",
      type: "headline",
    },
    {
      id: "2",
      title: "Penemuan Baru dalam Bidang Energi Terbarukan",
      description: "Para ilmuwan Indonesia menemukan metode baru meningkatkan efisiensi panel surya.",
      img: "/img/home/news-2.png",
      category: "science",
      type: "medium",
    },
    {
      id: "3",
      title: "Pemilu 2025: Debat Kandidat Pertama Sukses Digelar",
      description: "Debat pertama para calon presiden berlangsung aman dan tertib.",
      img: "/img/home/news-3.png",
      category: "politics",
      type: "hero",
    },
    {
      id: "4",
      title: "Pasar Saham Menguat Setelah Rilis Data Inflasi",
      description: "IHSG mencatat kenaikan signifikan pasca rilis data inflasi terbaru.",
      img: "/img/home/news-4.png",
      category: "economy",
      type: "medium",
    },
    {
      id: "5",
      title: "Tim Riset Lokal Temukan Vaksin Baru untuk Flu Burung",
      description: "Vaksin eksperimental menunjukkan hasil menjanjikan dalam uji coba awal.",
      img: "/img/home/news-5.png",
      category: "science",
      type: "medium",
    },
    {
      id: "6",
      title: "KTT G20 Bahas Perubahan Iklim dan Ekonomi Global",
      description: "Para pemimpin dunia sepakat memperkuat komitmen pengurangan emisi.",
      img: "/img/home/news-6.png",
      category: "world",
      type: "headline",
    },
    {
      id: "7",
      title: "Pemerintah Rancang Regulasi Baru untuk Startup",
      description: "Aturan ini diharapkan mempermudah pendanaan bagi perusahaan rintisan.",
      img: "/img/home/news-7.png",
      category: "economy",
      type: "headline",
    },
    {
      id: "8",
      title: "Peneliti Ungkap Rahasia Bintang Neutron",
      description: "Studi terbaru memberi pemahaman baru tentang fenomena astrofisika langka.",
      img: "/img/home/news-8.png",
      category: "science",
      type: "headline",
    },
    {
      id: "9",
      title: "Kesepakatan Dagang Baru Antarnegara Asia Tenggara",
      description: "Negara-negara ASEAN menandatangani perjanjian untuk meningkatkan perdagangan regional.",
      img: "/img/home/news-9.png",
      category: "world",
      type: "medium",
    },
    {
      id: "10",
      title: "Parlemen Sahkan Undang-Undang Keamanan Siber",
      description: "UU ini diharapkan memperkuat perlindungan data nasional.",
      img: "/img/home/news-10.png",
      category: "politics",
      type: "medium",
    },
  ];

  const [news, setNews] = useState<NewsType[]>(mockNews);

  // Comment fetch supabase
  /*
  useEffect(() => {
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
  */

  return (
    <>
      <Navbar />
      <main className="w-full mx-auto gap-6 pt-10">
        <HeroSection />
        <HighlightSection />
        <section className="px-16 py-6 bg-white">
          <PoliticsSection />
        </section>
        <section className="px-16 py-6 bg-[#BABABA]">
          <SportsSection />
        </section>
        <Highlight2Section />
        <section className="px-16 py-6 bg-yellow-50">
          <TechSection />
        </section>
        <LatestSection />
      </main>
      <Footer />

      {/*=== FLOATING BUTTON AI === */}
      {/* <div className="fixed bottom-6 right-6 group">
        <button
          onClick={() => router.push("/analyzer")}
          className="relative flex items-center justify-center w-14 h-14 rounded-full bg-[#D97706] hover:bg-blue-700 text-white shadow-lg transition-colors duration-300"
        >
          <Search className="w-6 h-6" />
          <span className="absolute right-full mr-3 px-3 py-1 bg-gray-800 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
            Gunakan AI untuk temukan fakta atau opini
          </span>
        </button>
      </div> */}
      <FloatingAIButton />
    </>
  );
}
