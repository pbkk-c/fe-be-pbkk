import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

export async function POST(req: Request) {
  try {
    console.log("\n🚀 ===== START /api/saveanalyze =====");

    // ✅ Ambil Authorization Header
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Unauthorized: Missing or invalid Authorization header" },
        { status: 401 }
      );
    }

    const token = authHeader.split(" ")[1];

    // ✅ Decode Token
    let decoded: { userId: string; email: string };
    try {
      decoded = jwt.verify(token, JWT_SECRET) as { userId: string; email: string };
    } catch (jwtError: any) {
      if (jwtError.name === "TokenExpiredError") {
        return NextResponse.json({ error: "Token expired" }, { status: 401 });
      }
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const userId = decoded.userId;
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized: Invalid token payload" }, { status: 401 });
    }

    console.log("✅ Authenticated userId:", userId);

    // ✅ Ambil body
    const body = await req.json();
    let {
      url,
      title,
      raw_text,
      main_theme,
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

    // ✅ Parse jika masih string
    if (typeof raw_analysis_json === "string") {
      try {
        raw_analysis_json = JSON.parse(raw_analysis_json);
      } catch (e) {
        console.warn("⚠️ raw_analysis_json bukan JSON valid:", e);
        raw_analysis_json = null;
      }
    }

    // ✅ Ambil reason + supporting_factors
    const facts = raw_analysis_json?.analysis?.Facts;
    const opinion = raw_analysis_json?.analysis?.Opinion;
    const hoax = raw_analysis_json?.analysis?.Hoax;

    const topic = facts
      ? `${facts.reason}\n\n${facts.supporting_factors?.map((s: string) => `• ${s}`).join("\n")}`
      : null;

    const platform = opinion
      ? `${opinion.reason}\n\n${opinion.supporting_factors?.map((s: string) => `• ${s}`).join("\n")}`
      : null;

    const creator_name = hoax
      ? `${hoax.reason}\n\n${hoax.supporting_factors?.map((s: string) => `• ${s}`).join("\n")}`
      : null;

    console.log("🧩 topic:", !!topic, "| platform:", !!platform, "| creator_name:", !!creator_name);

    // ✅ Simpan ke tabel contents (upsert)
    const content = await prisma.contents.upsert({
      where: { url },
      update: {
        user_id: userId,
        title,
        raw_text,
        type: "history",
        topic,
        platform,
        creator_name,
      },
      create: {
        user_id: userId,
        url,
        title,
        raw_text,
        type: "history",
        collected_at: new Date(),
        topic,
        platform,
        creator_name,
      },
    });

    console.log("✅ Saved content:", content.id);

    // ✅ Simpan ke tabel analyses
    const analysis = await prisma.analyses.create({
      data: {
        main_theme,
        summary,
        fact_percentage,
        opinion_percentage,
        hoax_percentage,
        sentiment,
        contents: {
          connect: { id: content.id },
        },
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
