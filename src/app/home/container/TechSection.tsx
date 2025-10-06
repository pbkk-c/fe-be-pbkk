import BigCard from "../components/BigCard";
import NewsCard from "../components/NewsCard2";

const dummyBig = {
  category: "Sports",
  title: "Underdog Triumph: Unexpected Victory at the Championship",
  description:
    "Against all odds, the underdog team delivered an astonishing performance...",
  image: "/img/home/news-8.png",
  facts: 55,
  opinion: 45,
};

const dummyNews = [
  {
    title: "Reliving the Most Iconic Moments on Ice",
    image: "/img/home/news-7.png",
    facts: 70,
    opinion: 30,
  },
  {
    title: "From Amateur to Pro: The Journey of Aspiring Boxers",
    image: "/img/home/news-3.png",
    facts: 60,
    opinion: 40,
  },
  {
    title: "Olympic Dreams: Athletes Prepare for Paris 2024",
    image: "/img/home/news-4.png",
    facts: 50,
    opinion: 50,
  },
];

export default function TechSection() {
  return (
    // <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    <div className="flex gap-20">
      <div className="flex w-3/5 flex-col gap-4 justify-center">
        <h1 className="text-2xl font-extrabold">Technology</h1>
        {dummyNews.map((news, i) => (
            <NewsCard key={i} {...news} />
        ))}
        <h1 className="text-md font-semibold mb-6">See More +</h1>
      </div>
      <div className="md:col-span-2 w-2/5">
        <BigCard {...dummyBig} />
      </div>
    </div>
  );
}
