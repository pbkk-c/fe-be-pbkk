"use client";

import { useState } from "react";
import { ThumbsUp, MessageCircle, Bookmark, Share2 } from "lucide-react";

export default function SocialActions() {
  const [likes, setLikes] = useState(0);
  const [bookmarked, setBookmarked] = useState(false);

  return (
    <div className="flex items-center space-x-6 border-t border-b py-3 my-6">
      {/* Like */}
      <button
        onClick={() => setLikes(likes + 1)}
        className="flex items-center space-x-1 hover:text-green-600 transition"
      >
        <ThumbsUp size={18} />
        <span>{likes}</span>
      </button>

      {/* Comment */}
      <a
        href="#comments"
        className="flex items-center space-x-1 hover:text-green-600 transition"
      >
        <MessageCircle size={18} />
        <span>Comment</span>
      </a>

      {/* Bookmark */}
      <button
        onClick={() => setBookmarked(!bookmarked)}
        className="flex items-center space-x-1 hover:text-green-600 transition"
      >
        <Bookmark
          size={18}
          className={bookmarked ? "fill-green-600 text-green-600" : ""}
        />
        <span>{bookmarked ? "Saved" : "Save"}</span>
      </button>

      {/* Share */}
      <button className="flex items-center space-x-1 hover:text-green-600 transition">
        <Share2 size={18} />
        <span>Share</span>
      </button>
    </div>
  );
}
