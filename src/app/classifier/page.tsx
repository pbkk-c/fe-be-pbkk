"use client";

import { useState } from "react";

export default function ClassifierPage() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");

  const handleClassify = async () => {
    const res = await fetch("/api/classifier", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sentence: input }),
    });
    const data = await res.json();
    setResult(data.label);
  };

  return (
    <div className="p-6">
      <textarea
        className="border p-2 w-full"
        rows={3}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Tulis kalimat di sini..."
      />
      <button
        onClick={handleClassify}
        className="mt-2 bg-blue-500 text-white px-4 py-2 rounded"
      >
        Classify
      </button>
      {result && <p className="mt-4">Hasil: {result}</p>}
    </div>
  );
}
