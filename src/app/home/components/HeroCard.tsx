import Image from "next/image";
import Link from "next/link";

interface HeroCardProps {
  category: string;
  title: string;
  description: string;
  image: string;
  href?: string;
}

export default function HeroCard({
  category,
  title,
  description,
  image,
  href = "#",
}: HeroCardProps) {
  return (
   <Link
  href={href}
  className="relative w-full min-h-[450px] rounded-2xl overflow-hidden group block"
>
  <Image
    src={image}
    alt={title}
    fill
    priority
    className="object-cover transition-transform duration-500 group-hover:scale-105"
  />
  {/* Overlay */}
  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

  {/* Text Content */}
  <div className="absolute bottom-6 left-6 right-6 text-white">
    <span className="bg-white/20 text-xs px-2 py-1 rounded-md backdrop-blur">
      {category}
    </span>
    <h2 className="mt-2 text-3xl md:text-4xl font-bold leading-snug drop-shadow">
      {title}
    </h2>
    <p className="mt-2 text-sm md:text-base text-gray-200 line-clamp-3">
      {description}
    </p>
  </div>
</Link>

  );
}
