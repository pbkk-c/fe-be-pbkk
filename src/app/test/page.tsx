"use client";

import { useEffect, useState } from "react";

export default function ContentsPage() {
  const [contents, setContents] = useState<any[]>([]);

  useEffect(() => {
    const fetchContents = async () => {
      try {
        const res = await fetch("/api/contents");
        const data = await res.json();
        setContents(data);
      } catch (err) {
        console.error("Failed to fetch contents", err);
      }
    };
    fetchContents();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold">Contents</h1>
      <ul className="space-y-4 mt-6">
        {contents.map((c) => (
          <li key={c.id} className="p-4 border rounded-lg shadow bg-white">
            <p className="font-semibold">{c.title || "No Title"}</p>
            <p className="text-sm text-gray-600">{c.platform}</p>
            <p className="text-xs text-gray-400">
              {new Date(c.collected_at).toLocaleString()}
            </p>
            {c.creators && (
              <p className="text-sm mt-1">
                Creator: <strong>{c.creators.name}</strong>
              </p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
