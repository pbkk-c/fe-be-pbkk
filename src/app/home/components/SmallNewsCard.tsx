import Image from "next/image";
import Link from "next/link";

interface SmallNewsCardProps {
  title: string;
  category?: string;
  image: string;
  href?: string;
}

export default function SmallNewsCard({
  title,
  category,
  image,
  href = "#",
}: SmallNewsCardProps) {
  return (
    <Link
      href={href}
      // className="relative rounded-xl overflow-hidden group border- border-transparent hover:border-amber-500 hover:border-4 transition-all duration-500"
      className="relative rounded-xl overflow-hidden group transition-all duration-500"

    >
      <div className="relative w-full h-40 md:h-48">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-all duration-300" />
      </div>

      {/* Konten */}
      <div className="absolute bottom-3 left-3 right-3 text-white">
        {category && (
          <span className="bg-white/90 text-black text-xs font-semibold px-3 py-1 rounded-full mb-1 inline-block">
            {category}
          </span>
        )}
        <h3 className="text-sm font-semibold drop-shadow-md">
          {title}
        </h3>
      </div>
    </Link>
  );
}
