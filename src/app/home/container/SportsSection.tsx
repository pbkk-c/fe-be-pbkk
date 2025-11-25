import { useEffect, useState } from "react";
import BigCard from "../components/BigCard";
import NewsCard from "../components/NewsCard2";
import { Content } from "@/types/fetchContent";

const dummyBig = {
  category: "Sports",
  title: "Underdog Triumph: Unexpected Victory at the Championship",
  description: "Against all odds, the underdog team delivered an astonishing performance...",
  image: "/img/home/news-8.png",
  facts: 55,
  opinion: 25,
  hoax: 20,
};
const dummyNews = [
  {
    title: "Reliving the Most Iconic Moments on Ice...",
    image: "/img/home/news-7.png",
    facts: 50,
    opinion: 30,
    hoax: 20,
  },
  {
    title: "From Amateur to Pro: The Journey of Aspiring Boxers",
    image: "/img/home/news-3.png",
    facts: 20,
    opinion: 40,
    hoax: 40,
  },
  {
    title: "From Amateur to Pro: The Journey of Aspiring Boxers",
    image: "/img/home/news-3.png",
    facts: 20,
    opinion: 40,
    hoax: 40,
  },
  {
    title: "Olympic Dreams: Athletes Prepare for Paris 2024",
    image: "/img/home/news-4.png",
    facts: 50,
    opinion: 50,
    hoax: 0,
  },
  {
    title: "Inside the Mind of a Champion: A New Documentary",
    image: "/img/home/news-4.png",
    facts: 70,
    opinion: 20,
    hoax: 10,
  },
  {
    title: "The Rise of eSports: More Than Just a Game",
    image: "/img/home/news-4.png",
    facts: 60,
    opinion: 30,
    hoax: 10,
  },
];

export default function SportsSection() {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const [contents, setContents] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch data dari API
  useEffect(() => {
    const fetchContents = async () => {
      try {
        const res = await fetch("/xenotimes/api/xenotimes/content");
        if (!res.ok) throw new Error("Failed to fetch contents");

        const data: Content[] = await res.json();
        setContents(data);
      } catch (err) {
        console.error("Error fetching contents:", err);
        setError("Gagal memuat konten. Coba lagi nanti.");
      } finally {
        setLoading(false);
      }
    };

    fetchContents();
  }, []);

  if (loading) {
    return <section className="px-16 py-6 text-center text-gray-500">Loading konten...</section>;
  }

  if (error) {
    return <section className="px-16 py-6 text-center text-red-500">{error}</section>;
  }

  const listContainerClasses = isExpanded
    ? "max-h-[400px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300"
    : "max-h-[335px] overflow-hidden";

  return (
    <div className="flex flex-col lg:flex-row lg:items-center">
      <div className="flex w-full lg:w-2/5 flex-col gap-4">
        <h1 className="text-2xl font-extrabold">Sports</h1>
        <div className="relative flex-grow">
          <div
            className={`flex flex-col gap-4 transition-all duration-300 ease-in-out ${listContainerClasses}`}
          >
            {contents
              .filter((item) => item.type === "News" && item.topic === "Sports")
              //  .slice(0, 4)
              .map((item) => (
                <NewsCard
                  key={item.id}
                  title={item.title ?? ""}
                  // image={item.url ?? "/img/home/news-3.png"}
                  image = {`xenotimes${item.url}`}
                  href={`/xenotimes/news/${item.id}`}
                  facts={item.analyses?.[0]?.fact_percentage ?? 0}
                  opinion={item.analyses?.[0]?.opinion_percentage ?? 0}
                  hoax={item.analyses?.[0]?.hoax_percentage ?? 0}
                />
              ))}
          </div>
        </div>

        <h1
          className="text-md font-semibold mt-2 mb-6 cursor-pointer hover:underline"
          onClick={toggleExpanded}
        >
          {isExpanded ? "See Less -" : "See More +"}
        </h1>
      </div>

      <div className="w-full lg:w-3/5 mt-8 lg:mt-0">
        {contents
          .filter((item) => item.type === "News" && item.topic === "Sports")
          .slice(0, 1)
          .map((item) => (
            <BigCard
              key={item.id}
              title={item.title ?? ""}
              // image={item.url ?? "/img/home/news-8.png"}
              image={`xenotimes${item.url}`}
              href={`/xenotimes/news/${item.id}`}
              facts={item.analyses?.[0]?.fact_percentage ?? 0}
              opinion={item.analyses?.[0]?.opinion_percentage ?? 0}
              hoax={item.analyses?.[0]?.hoax_percentage ?? 0}
              description={item.raw_text?.slice(0, 100) ?? ""}
              category={item.topic ?? ""}
            />
          ))}
      </div>
    </div>
  );
}
