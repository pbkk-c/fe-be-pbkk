"use client";

import { useState } from "react";

interface Comment {
  id: number;
  author: string;
  text: string;
}

export default function CommentSection() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [input, setInput] = useState("");

  const handleAddComment = () => {
    if (!input.trim()) return;
    const newComment: Comment = {
      id: Date.now(),
      author: "Guest",
      text: input,
    };
    setComments([newComment, ...comments]);
    setInput("");
  };

  return (
    <div id="comments" className="mt-8">
      <h3 className="text-lg font-semibold mb-3">Comments</h3>
      {/* Input */}
      <div className="flex items-center space-x-2 mb-4">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Write a comment..."
          className="flex-1 rounded-md border px-3 py-2 focus:outline-none"
        />
        <button
          onClick={handleAddComment}
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
        >
          Post
        </button>
      </div>

      {/* List Comments */}
      <div className="space-y-3">
        {comments.length === 0 && <p className="text-gray-500 text-sm">No comments yet.</p>}
        {comments.map((c) => (
          <div key={c.id} className="rounded-md bg-gray-100 p-3">
            <p className="text-sm font-semibold">{c.author}</p>
            <p className="text-sm">{c.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
