import { NextRequest, NextResponse } from "next/server";
import * as cheerio from "cheerio";

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get("url");
  if (!url) {
    return NextResponse.json({ error: "URL is required" }, { status: 400 });
  }

  const html = await fetch(url).then((r) => r.text());
  const $ = cheerio.load(html);

  // ambil semua paragraf jadi satu string
  const text = $("p")
    .map((_, el) => $(el).text())
    .get()
    .join("\n");

  return NextResponse.json({ text });
}
