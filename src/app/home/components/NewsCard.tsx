import Image from "next/image";
import NextImage from "@/components/NextImage";
import Link from "next/link";
import clsx from "clsx";

interface NewsCardProps {
  variant?: "big" | "medium" | "small" | "trending";
  title: string;
  description?: string;
  image: string;
  category?: string;
  href?: string;
}

export default function NewsCard({
  variant = "medium",
  title,
  description,
  image,
  category,
  href = "#",
}: NewsCardProps) {
  return (
    <Link
      href={href}
      className={clsx(
        "group overflow-hidden rounded-2xl bg-white shadow hover:shadow-lg transition",
        variant === "big" && "col-span-2 row-span-2",
        variant === "medium" && "flex flex-col",
        variant === "small" && "flex flex-col",
        variant === "trending" && "flex items-center space-x-3 p-2"
      )}
    >
      <div
        className={clsx(
          "relative w-full overflow-hidden",
          variant === "big" ? "h-72" : variant === "medium" ? "h-52" : "h-32",
          variant === "trending" && "w-20 h-20 shrink-0 rounded-md"
        )}
      >
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="p-4">
        {category && (
          <span className="text-xs uppercase text-[#D97706] font-semibold">{category}</span>
        )}
        <h3
          className={clsx(
            "font-bold leading-snug group-hover:text-[#D97706]",
            variant === "big" && "text-2xl",
            variant === "medium" && "text-lg",
            variant === "small" && "text-base",
            variant === "trending" && "text-sm"
          )}
        >
          {title}
        </h3>
        {description && variant !== "trending" && (
          <p className="mt-2 text-sm text-gray-600 line-clamp-3">{description}</p>
        )}
      </div>
    </Link>
  );
}
