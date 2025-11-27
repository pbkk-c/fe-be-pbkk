import Link from "next/link";
import FactBar from "./FactBar";
import { Content } from "@/types/fetchContent";

interface PoliticsCardProps {
  item: Content;
  variant?: "grid" | "list";
}

export default function NewsTopicCard({ item, variant = "grid" }: PoliticsCardProps) {
  const facts = item.analyses?.[0]?.fact_percentage ?? 0;
  const opinion = item.analyses?.[0]?.opinion_percentage ?? 0;
  const hoax = item.analyses?.[0]?.hoax_percentage ?? 0;

  if (variant === "grid") {
    return (
      <Link href={`/xenotimes/news/${item.id}`}>
        <div className="bg-white rounded-2xl shadow-sm hover:shadow-lg border border-orange-100 hover:border-orange-400 transition-all overflow-hidden">
          <img
            src={item.url ? `xenotimes${item.url}` : "/placeholder.jpg"}
            alt={item.title ?? ""}
            className="w-full h-48 object-cover"
          />
          <div className="p-5">
            <p className="text-xs uppercase text-orange-600 font-semibold mb-1">
              {item.topic ?? "Politics"}
            </p>
            <h3 className="text-lg font-bold hover:text-orange-700 transition line-clamp-2">
              {item.title ?? ""}
            </h3>
            <p className="text-sm text-gray-600 line-clamp-3 mt-2">
              {item.raw_text?.slice(0, 100) ?? ""}
            </p>
            <FactBar facts={facts} opinion={opinion} hoax={hoax} />
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link href={`/xenotimes/news/${item.id}`} className="no-underline">
      <div className="bg-white p-5 rounded-2xl shadow-sm hover:shadow-md border border-orange-100 hover:border-orange-300 transition-all">
        <div className="flex flex-col md:flex-row gap-4">
          <img
            src={item.url ? `xenotimes${item.url}` : "/placeholder.jpg"}
            alt={item.title ?? ""}
            className="w-full md:w-48 h-40 object-cover rounded-lg"
          />
          <div className="flex flex-col justify-between">
            <div>
              <p className="text-xs uppercase text-orange-600 font-semibold mb-1">
                {item.topic ?? "Politics"}
              </p>
              <h3 className="text-lg font-bold mb-2 hover:text-orange-700 transition">
                {item.title ?? ""}
              </h3>
              <p className="text-sm text-gray-600 line-clamp-3">
                {item.raw_text?.slice(0, 120) ?? ""}
              </p>
            </div>
            <FactBar facts={facts} opinion={opinion} hoax={hoax} />
          </div>
        </div>
      </div>
    </Link>
  );
}
