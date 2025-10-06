"use client";

import HeroCard from "../components/HeroCard";
import SmallNewsCard from "../components/SmallNewsCard";
import { useEffect, useState } from "react";
import { NewsType } from "@/types/news";
import { useRouter } from "next/navigation";

export default function HeroSection() {
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

  //  useEffect(() => {
  //   const fetchNews = async () => {
  //     try {
  //       const res = await fetch("/api/content");
  //       if (!res.ok) throw new Error("Failed to fetch content");

  //       type ApiAnalysis = {
  //         fact_percentage: number | null;
  //         opinion_percentage: number | null;
  //         hoax_percentage: number | null;
  //         created_at: string;
  //       };

  //       type ApiContent = {
  //         id: string;
  //         title: string | null;
  //         url: string | null;
  //         platform: string;
  //         collected_at: string;
  //         analyses: ApiAnalysis[] | null;
  //       };

  //       const data: ApiContent[] = await res.json();

  //       const mapped: NewsType[] = data.map((item) => {
  //         // ambil analysis terbaru
  //         const latest = item.analyses?.sort(
  //           (a, b) =>
  //             new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  //         )[0];

  //         return {
  //           id: item.id,
  //           title: item.title ?? "Untitled",
  //           description: item.url ?? "",
  //           img: "/img/home/news-1.png", // sementara
  //           category: item.platform,
  //           type: "medium", // default, bisa diubah sesuai kebutuhan
  //           fact: latest?.fact_percentage ?? 0,
  //           opinion: latest?.opinion_percentage ?? 0,
  //           hoax: latest?.hoax_percentage ?? 0,
  //         };
  //       });

  //       setNews(mapped);
  //     } catch (error) {
  //       console.error("Unexpected error:", error);
  //     }
  //   };

  //   fetchNews();
  // }, []);

  return (
    <>
        {/* Hero Section */}
        <section className="lg:col-span-3 px-16 py-6">
          {news
            .filter((item) => item.type === "hero")
            .map((item) => (
              <HeroCard
                key={item.id}
                category={item.category ?? ""}
                title={item.title}
                description={item.description ?? ""}
                image={item.img ?? "/img/home/hero-1.png"}
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
                  href={`/news/${item.id}`}
                />
              ))}
          </div>
        </section>
    </>
  );
}
