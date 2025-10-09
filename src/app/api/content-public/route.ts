import { NextResponse } from "next/server";

export async function GET() {
  try {
    const res = await fetch(
    //   "https://newsapi.org/v2/everything?q=Apple&from=2025-10-09&sortBy=popularity&apiKey=4d710bd93fd34d69a27365dafa323e8b"
    "https://newsapi.org/v2/top-headlines?country=us&apiKey=4d710bd93fd34d69a27365dafa323e8b"
    );

    if (!res.ok) {
      return NextResponse.json({ error: "Failed to fetch news" }, { status: 500 });
    }

    const data = await res.json();

    // ✨ Ubah struktur sesuai kebutuhan frontend
    const formatted = data.articles.map((article: any, index: number) => ({
      id: `${index}`, // bisa pakai index atau UUID
      title: article.title,
      raw_text: article.description || "",
      image: article.urlToImage || "/img/default-news.png",
      topic: article.source?.name || "Unknown Source",
      type: "home", // biar bisa difilter di frontend
      url: article.url,
      publishedAt: article.publishedAt,
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    console.error("Error fetching news:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
