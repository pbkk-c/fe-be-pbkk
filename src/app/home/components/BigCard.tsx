import Image from "next/image";

type BigCardProps = {
  category: string;
  title: string;
  description: string;
  image: string;
  facts: number;
  opinion: number;
};

export default function BigCard({
  category,
  title,
  description,
  image,
  facts,
  opinion,
}: BigCardProps) {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-md">
      <div className="relative w-full h-64">
        <Image src={image} alt={title} fill className="object-cover" />
      </div>
      <div className="p-4">
        <span className="text-sm font-semibold text-gray-600 uppercase">
          {category}
        </span>
        <h2 className="text-xl font-bold mt-2">{title}</h2>
        <div className="flex items-center gap-2 mt-3 text-sm">
          <div className="flex-1 bg-gray-200 rounded-full h-3 overflow-hidden">
            <div
              className="bg-green-500 h-3"
              style={{ width: `${facts}%` }}
            />
          </div>
          <span className="text-xs">{facts}% Facts</span>
          <div className="flex-1 bg-gray-200 rounded-full h-3 overflow-hidden">
            <div
              className="bg-blue-500 h-3"
              style={{ width: `${opinion}%` }}
            />
          </div>
          <span className="text-xs">{opinion}% Opinion</span>
        </div>
        <p className="text-sm text-gray-600 mt-3">{description}</p>
      </div>
    </div>
  );
}
