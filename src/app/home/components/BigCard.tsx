import Image from "next/image";

type BigCardProps = {
  category: string;
  title: string;
  description: string;
  image: string;
  facts: number;
  opinion: number;
  hoax: number;
};

export default function BigCard({
  category,
  title,
  description,
  image,
  facts,
  opinion,
  hoax,
}: BigCardProps) {
  return (
    <div className="relative w-full rounded-3xl overflow-hidden shadow-lg">
      {/* Background image */}
      <div className="relative h-[260px] md:h-[360px] lg:h-[460px] xl:h-[560px] 2xl:h-[600px] w-full transition-all duration-300">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover"
          priority
        />

        {/* Overlay gelap agar teks terbaca */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>

        {/* Konten overlay */}
        <div className="absolute inset-0 flex flex-col justify-end p-4 sm:p-6 md:p-8 text-white">
          {/* Kategori */}
          <span className="absolute top-4 left-4 bg-white/90 text-black text-[10px] sm:text-xs md:text-sm font-semibold px-3 py-1 rounded-full">
            {category}
          </span>

          {/* Judul */}
          <h2 className="text-[10px] sm:text-[12px] md:text-[14px] lg:text-[16px] xl:text-3xl font-extrabold leading-snug drop-shadow-lg">
            {title}
          </h2>

          {/* Bar fakta, opini, hoax */}
          <div className="w-full bg-gray-300 h-3 sm:h-4 md:h-5 mt-3 rounded-md overflow-hidden flex">
            <div
              className="bg-blue-800 h-full text-[6px] sm:text-[7px] md:text-[9px] lg:text-[10px] font-semibold flex items-center justify-center"
              style={{ width: `${facts}%` }}
            >
              {facts > 10 ? (
                <span>Facts {facts}%</span>
              ) : facts > 3 ? (
                <span>{facts}%</span>
              ) : null}
            </div>
            <div
              className="bg-gray-500 h-full text-[6px] sm:text-[7px] md:text-[9px] lg:text-[10px] font-semibold flex items-center justify-center"
              style={{ width: `${opinion}%` }}
            >
              {opinion > 10 ? (
                <span>Opinion {opinion}%</span>
              ) : opinion > 3 ? (
                <span>{opinion}%</span>
              ) : null}
            </div>
            <div
              className="bg-red-800 h-full text-[6px] sm:text-[7px] md:text-[9px] lg:text-[10px] font-semibold flex items-center justify-center"
              style={{ width: `${hoax}%` }}
            >
              {hoax > 10 ? (
                <span>Hoax {hoax}%</span>
              ) : hoax > 3 ? (
                <span>{hoax}%</span>
              ) : null}
            </div>
          </div>

          {/* Deskripsi */}
          <p className="text-[8px] sm:text-[10px] md:text-[11px] lg:text-[12px] sm:text-sm md:text-base text-gray-200 mt-2 line-clamp-3 max-w-3xl">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}
