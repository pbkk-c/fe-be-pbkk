import { NextRequest, NextResponse } from "next/server";
import { geminiModel } from "@/lib/gemini";

interface Body {
  text: string;
}

export async function POST(req: NextRequest) {
  const { text }: Body = await req.json();
  

  if (!text) {
    return NextResponse.json({ error: "text is required" }, { status: 400 });
  }

  const prompt = `
  Baca teks berikut dan pisahkan menjadi dua daftar:
  1. Fakta (pernyataan yang dapat diverifikasi)
  2. Opini (pendapat/penilaian).

  Teks:
  """${text}"""

  Format jawaban:
  Fakta:
  - ...
  Opini:
  - ...
  `;

  const result = await geminiModel.generateContent(prompt);

  return NextResponse.json({ analysis: result.response.text() });
}
