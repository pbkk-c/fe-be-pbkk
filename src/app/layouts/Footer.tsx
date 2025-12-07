import Link from "next/link";

const categories = [
  { label: "Politics", href: "/xenotimes/politic" },
  { label: "Economy", href: "/xenotimes/economy" },
  { label: "Science", href: "/xenotimes/science" },
  { label: "Sports", href: "/xenotimes/sports" },
  { label: "Help", href: "/xenotimes/help" },
];

export default function Footer() {
  return (
    <footer className="border-t border-gray-800 bg-[#0b0c10] text-gray-300">
      <div className="mx-auto max-w-7xl px-6 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {/* Logo + Deskripsi */}
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight">XenoTimes</h2>
          <p className="mt-3 text-sm text-gray-400 leading-relaxed max-w-sm">
           Your instant AI detector for facts, opinions, and hoaxes
          </p>
        </div>

        {/* Kategori */}
        <div>
          <h3 className="mb-3 text-lg font-semibold text-white">Categories</h3>
          <ul className="space-y-2 text-sm">
            {categories.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="hover:text-[#fbbf24] transition-colors duration-200"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Info Kontak */}
        <div>
          <h3 className="mb-3 text-lg font-semibold text-white">Contact</h3>
          <ul className="space-y-2 text-sm text-gray-400">
            {/* <li>Email: contact@xenotimes.com</li> */}
            <li>Address: Surabaya, Indonesia</li>
          </ul>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-gray-800 py-5 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} <span className="font-semibold text-white">XenoTimes</span>.
        All rights reserved.
      </div>
    </footer>
  );
}
