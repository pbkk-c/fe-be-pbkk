import Image from "next/image";

type NewsCardProps = {
  title: string;
  image: string;
  facts: number;
  opinion: number;
};

export default function NewsCard({ title, image, facts, opinion }: NewsCardProps) {
  return (
    <div className="flex gap-3 items-start">
      <div className="relative w-24 h-16 rounded-md overflow-hidden">
        <Image src={image} alt={title} fill className="object-cover" />
      </div>
      <div className="flex flex-col flex-1">
        <h3 className="text-sm font-semibold">{title}</h3>
        <div className="flex items-center gap-1 mt-1">
          <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
            <div
              className="bg-green-500 h-2"
              style={{ width: `${facts}%` }}
            />
          </div>
          <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
            <div
              className="bg-blue-500 h-2"
              style={{ width: `${opinion}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
