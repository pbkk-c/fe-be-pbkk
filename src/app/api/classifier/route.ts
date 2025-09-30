import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { sentence } = await req.json();

  // prompt yang mirip Python versi kamu
  const prompt = `Classify this sentence as Fact, Opinion, or Claim:\n\n${sentence}\n\nAnswer with only one word.`;

  const response = await fetch(
    // "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2",
    // "https://huggingface.co/mistralai/Mistral-7B-Instruct-v0.2",
    "https://router.huggingface.co/v1/chat/completions",
    
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: { max_new_tokens: 5 },
      }),
    }
  );

  const result = await response.json();

  // ambil kata terakhir (seperti di Python)
  const text = result[0]?.generated_text || "";
  const label = text.trim().split(" ").pop();

  return NextResponse.json({ label, raw: text });
}
