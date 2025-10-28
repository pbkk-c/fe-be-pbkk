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
      className="relative block rounded-2xl overflow-hidden group shadow-md hover:shadow-xl transition-all duration-500"
    >
      {/* Gambar */}
      <div className="relative w-full h-40 md:h-48">
        <Image
          src={image}
          alt={title}
          fill
          sizes="(max-width: 768px) 200px, 400px"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent group-hover:from-black/70 transition-all duration-500" />
      </div>

      {/* Teks */}
      <div className="absolute bottom-3 left-3 right-3 text-white space-y-1">
        {category && (
          <span className="bg-white/90 text-black text-xs font-semibold px-3 py-1 rounded-full inline-block">
            {category}
          </span>
        )}
        <h3 className="text-sm md:text-base font-semibold leading-tight line-clamp-2 drop-shadow-md group-hover:translate-y-[-2px] transition-transform duration-300">
          {title}
        </h3>
      </div>
    </Link>
  );
}
