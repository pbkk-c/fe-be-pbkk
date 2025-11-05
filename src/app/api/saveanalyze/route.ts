import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

export async function POST(req: Request) {
  try {
    console.log("\n🚀 ===== START /api/saveanalyze =====");

    // 🔐 Ambil Authorization Header
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Unauthorized: Missing or invalid Authorization header" },
        { status: 401 }
      );
    }

    const token = authHeader.split(" ")[1];
    let decoded: { userId: string; email: string };

    try {
      decoded = jwt.verify(token, JWT_SECRET) as { userId: string; email: string };
    } catch (jwtError: any) {
      const msg =
        jwtError.name === "TokenExpiredError"
          ? "Token expired"
          : "Invalid token";
      return NextResponse.json({ error: msg }, { status: 401 });
    }

    const userId = decoded.userId;
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized: Invalid token payload" },
        { status: 401 }
      );
    }

    console.log("✅ Authenticated userId:", userId);

    // 📦 Ambil body request
    const body = await req.json();
    let {
      url,
      title,
      raw_text,
      summary,
      fact_percentage,
      opinion_percentage,
      hoax_percentage,
      sentiment,
      raw_analysis_json,
    } = body;

    if (!url) {
      return NextResponse.json({ error: "Missing URL" }, { status: 400 });
    }

    // 🧩 Parse raw_analysis_json jika masih string
    if (typeof raw_analysis_json === "string") {
      try {
        raw_analysis_json = JSON.parse(raw_analysis_json);
      } catch {
        console.warn("⚠️ raw_analysis_json bukan JSON valid");
        raw_analysis_json = null;
      }
    }

    const analysisData = raw_analysis_json?.analysis || {};
    const topic = raw_analysis_json?.topic || "Umum";
    const main_theme = topic;
    const cleanSummary =
      summary || raw_analysis_json?.summary_statement || "Tidak ada ringkasan.";

    // 🧠 Fungsi bantu untuk gabungkan reason + supporting_factors
    const mergeReasonAndFactors = (section: any) => {
      if (!section) return null;
      const { reason, supporting_factors } = section;
      return [
        reason?.trim() || "",
        ...(supporting_factors?.length ? supporting_factors : []),
      ]
        .filter(Boolean)
        .join("; ");
    };

    // 🧩 Gabungkan data dari AI
    const factMerged = mergeReasonAndFactors(analysisData.Facts);
    const opinionMerged = mergeReasonAndFactors(analysisData.Opinion);
    const hoaxMerged = mergeReasonAndFactors(analysisData.Hoax);

    // 🧾 Simpan ke tabel contents (upsert berdasarkan URL)
    const content = await prisma.contents.upsert({
      where: { url },
      update: {
        user_id: userId,
        title: title || raw_analysis_json?.title || "Untitled",
        raw_text,
        topic,
        type: "history",
        platform: factMerged || "Tidak tersedia",
        published_at: opinionMerged ? new Date() : null, // kalau mau null, bisa diganti null saja
        creator_name: hoaxMerged || "AI Analyzer",
      },
      create: {
        user_id: userId,
        url,
        title: title || raw_analysis_json?.title || "Untitled",
        raw_text,
        topic,
        type: "history",
        platform: factMerged || "Tidak tersedia",
        published_at: opinionMerged ? new Date() : null,
        creator_name: hoaxMerged || "AI Analyzer",
        collected_at: new Date(),
      },
    });

    console.log("✅ Saved content:", content.id);

    // 🧾 Simpan ke tabel analyses
    const analysis = await prisma.analyses.create({
      data: {
        content_id: content.id,
        main_theme,
        summary: cleanSummary,
        fact_percentage,
        opinion_percentage,
        hoax_percentage,
        sentiment: opinionMerged,
      },
    });

    console.log("✅ Saved analysis:", analysis.id);
    console.log("🚀 ===== END /api/saveanalyze (SUCCESS) =====\n");

    return NextResponse.json({
      success: true,
      message: "✅ Analysis saved successfully",
      data: { content, analysis },
    });
  } catch (error: any) {
    console.error("\n❌ ===== ERROR in /api/saveanalyze =====");
    console.error(error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to save analysis",
        message: error.message,
      },
      { status: 500 }
    );
  }
}
