import SocialActions from "../components/SocialActions";
import CommentSection from "../components/CommentAction";
import Image from "next/image";

interface NewsDetailProps {
  params: { slug: string };
}

export default function NewsDetail({ params }: NewsDetailProps) {
  // Contoh dummy data, nanti bisa fetch dari API/DB
  const article = {
    title: "News Title",
    category: "Politics",
    date: "September 18, 2025",
    image: "/img/home/news-1.png",
    content: `
    lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
    `,
  };

  return (
    <main className="max-w-3xl mx-auto px-4 py-8">
      {/* Category + Date */}
      <p className="text-sm text-green-600 font-medium">{article.category}</p>
      <h1 className="mt-2 text-3xl font-bold">{article.title}</h1>
      <p className="text-sm text-gray-500">{article.date}</p>

      {/* Hero Image */}
      <div className="relative w-full h-80 my-6 rounded-lg overflow-hidden">
        <Image
          src={article.image}
          alt={article.title}
          fill
          className="object-cover"
        />
      </div>

      {/* Content */}
      <article className="prose max-w-none text-gray-800">
        {article.content}
      </article>

      {/* Social Media Style Actions */}
      <SocialActions />

      {/* Comment Section */}
      <CommentSection />
    </main>
  );
}
