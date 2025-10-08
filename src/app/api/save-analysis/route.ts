import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // pastikan prisma client sudah ada


export async function POST(req: Request) {

  try {
    const body = await req.json();
    const { url, summary, userId } = body;

    if (!url || !summary) {
      return NextResponse.json(
        { error: "Missing url or summary" },
        { status: 400 }
      );
    }

    // 🔹 Buat record di contents (hanya id dan url)
    const content = await prisma.contents.upsert({
      where: { url },
      update: {},
      create: {    url,
        user_id: userId,
        type: "history", },
    });

    // 🔹 Analisis: parse summary untuk ambil nilai persen
    const factMatch = summary.match(/\[FACTS\]\s*-\s*(\d+(\.\d+)?)%/i);
    const opinionMatch = summary.match(/\[OPINION\]\s*-\s*(\d+(\.\d+)?)%/i);
    const hoaxMatch = summary.match(/\[HOAX\]\s*-\s*(\d+(\.\d+)?)%/i);

    const fact_percentage = factMatch ? parseFloat(factMatch[1]) : 0;
    const opinion_percentage = opinionMatch ? parseFloat(opinionMatch[1]) : 0;
    const hoax_percentage = hoaxMatch ? parseFloat(hoaxMatch[1]) : 0;

    // 🔹 Simpan ke analyses
    const analysis = await prisma.analyses.create({
      data: {
        content_id: content.id,
        summary,
        fact_percentage,
        opinion_percentage,
        hoax_percentage,
        main_theme: "Auto-generated",
        sentiment: null,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Analysis saved successfully",
      content_id: content.id,
      analysis_id: analysis.id,
    });
  } catch (err) {
    console.error("Error saving analysis:", err);
    return NextResponse.json(
      { error: "Failed to save analysis" },
      { status: 500 }
    );
  }
}
