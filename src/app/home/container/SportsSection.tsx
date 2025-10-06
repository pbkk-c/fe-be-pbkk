import { useState } from "react";
import BigCard from "../components/BigCard";
import NewsCard from "../components/NewsCard2";

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
    { title: "Reliving the Most Iconic Moments on Ice...", image: "/img/home/news-7.png", facts: 50, opinion: 30, hoax: 20, },
    { title: "From Amateur to Pro: The Journey of Aspiring Boxers", image: "/img/home/news-3.png", facts: 20, opinion: 40, hoax: 40, },
    { title: "From Amateur to Pro: The Journey of Aspiring Boxers", image: "/img/home/news-3.png", facts: 20, opinion: 40, hoax: 40, },
    { title: "Olympic Dreams: Athletes Prepare for Paris 2024", image: "/img/home/news-4.png", facts: 50, opinion: 50, hoax: 0, },
    { title: "Inside the Mind of a Champion: A New Documentary", image: "/img/home/news-4.png", facts: 70, opinion: 20, hoax: 10, },
    { title: "The Rise of eSports: More Than Just a Game", image: "/img/home/news-4.png", facts: 60, opinion: 30, hoax: 10, },
];

export default function SportsSection() {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const listContainerClasses = isExpanded
    ? 'max-h-[400px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300'
    : 'max-h-[335px] overflow-hidden'; 

  return (
    <div className="flex flex-col lg:flex-row lg:items-center">
      <div className="flex w-full md:w-2/5 flex-col gap-4">
        <h1 className="text-2xl font-extrabold">Sports</h1>

        <div className="relative flex-grow">
          <div className={`flex flex-col gap-4 transition-all duration-300 ease-in-out ${listContainerClasses}`}>
            {dummyNews.map((news, i) => (
              <NewsCard key={i} {...news} />
            ))}
          </div>

        </div>

        <h1
          className="text-md font-semibold mt-2 mb-6 cursor-pointer hover:underline"
          onClick={toggleExpanded}
        >
          {isExpanded ? 'See Less -' : 'See More +'}
        </h1>
      </div>

      <div className="w-full lg:w-3/5 mt-8 lg:mt-0">
        <BigCard {...dummyBig} />
      </div>
    </div>
  );
}