import Image from "next/image";

type NewsCardProps = {
  title: string;
  image: string;
  facts: number;
  opinion: number;
  hoax: number;
};

export default function NewsCard2({
  title,
  image,
  facts,
  opinion,
  hoax,
}: NewsCardProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 items-center sm:items-start rounded-xl p-3 hover:shadow-md transition-all duration-300 w-full max-w-full">
      {/* Thumbnail */}
      <div className="relative rounded-xl w-[90%] sm:w-28 md:w-32 2xl:w-40 h-24 sm:h-16 md:h-20 overflow-hidden flex-shrink-0">
        <Image src={image} alt={title} fill className="object-cover" />
      </div>

      {/* Info Section */}
      <div className="flex flex-col flex-1 text-gray-800 w-full">
        <h3 className="w-full lg:w-[180px] xl:w-full text-xs sm:text-sm md:text-[14px] font-bold leading-snug line-clamp-2">
          {title}
        </h3>

        {/* Bar persegi panjang */}
        <div className="w-full md:w-[400px] lg:w-[180px] xl:w-[350px] bg-gray-300 h-2 mt-2 rounded overflow-hidden flex">
          <div
            className="bg-blue-800 h-full"
            style={{ width: `${facts}%` }}
            title={`Facts: ${facts}%`}
          />
          <div
            className="bg-gray-500 h-full"
            style={{ width: `${opinion}%` }}
            title={`Opinion: ${opinion}%`}
          />
          <div
            className="bg-red-800 h-full"
            style={{ width: `${hoax}%` }}
            title={`Hoax: ${hoax}%`}
          />
        </div>

        {/* Label indikator */}
        <div className="flex justify-between text-[10px] sm:text-[11px] md:text-xs lg:text-[9px] xl:text-xs text-gray-700 mt-1 w-full md:w-[400px] lg:w-[200px] xl:w-[350px]">
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-blue-800 inline-block rounded-sm"></span>
            <span>Facts: {facts}%</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-gray-500 inline-block rounded-sm"></span>
            <span>Opinion: {opinion}%</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-red-800 inline-block rounded-sm"></span>
            <span>Hoax: {hoax}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
