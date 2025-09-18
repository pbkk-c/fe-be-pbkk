import Image from "next/image";
import Link from "next/link";

interface SmallNewsCardProps {
  title: string;
  image: string;
  href?: string;
}

export default function SmallNewsCard({
  title,
  image,
  href = "#",
}: SmallNewsCardProps) {
  return (
    <Link
      href={href}
      className="relative rounded-lg overflow-hidden group"
    >
      <Image
        src={image}
        alt={title}
        width={300}
        height={180}
        className="object-cover w-full h-32 transition-transform duration-500 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition" />
      <h3 className="absolute bottom-2 left-2 right-2 text-white text-sm font-semibold drop-shadow">
        {title}
      </h3>
    </Link>
  );
}
