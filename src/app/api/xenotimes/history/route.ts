import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

export async function GET(req: Request) {
  try {
    // 🔹 Ambil Authorization Header
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;

    let userId: string | null = null;

    // 🔹 Jika token ada → verifikasi JWT
    if (token) {
      try {
        const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
        userId = decoded.userId;
      } catch (err: any) {
        console.warn("⚠️ Token invalid atau expired:", err.message);
        // Tidak langsung return 401 — karena user boleh melihat history tanpa login (optional auth)
      }
    }

    // 🔹 Ambil semua contents dengan type = "history"
    // Jika user login → filter berdasarkan user_id
    // Jika tidak login → tampilkan history umum (tanpa user_id)
    const whereClause: any = {
      type: "history",
    };

    if (userId) {
      whereClause.user_id = userId;
    }

    const history = await prisma.contents.findMany({
      where: whereClause,
      orderBy: { collected_at: "desc" },
      select: {
        id: true,
        url: true,
        title: true,
        topic: true,
        collected_at: true,
        analyses: {
          select: {
            summary: true,
            main_theme: true,
            fact_percentage: true,
            opinion_percentage: true,
            hoax_percentage: true,
            sentiment: true,
            created_at: true,
          },
          orderBy: { created_at: "desc" },
          take: 1, // ambil analisis terbaru
        },
      },
    });

    // 🔹 Format hasil agar frontend langsung bisa render
    const formatted = history.map((item) => ({
      id: item.id,
      url: item.url ?? "-",
      title: item.title ?? "Untitled",
      topic: item.topic ?? "-",
      summary: item.analyses[0]?.summary ?? "No analysis available",
      main_theme: item.analyses[0]?.main_theme ?? "-",
      sentiment: item.analyses[0]?.sentiment ?? "-",
      fact_percentage: Number(item.analyses[0]?.fact_percentage ?? 0),
      opinion_percentage: Number(item.analyses[0]?.opinion_percentage ?? 0),
      hoax_percentage: Number(item.analyses[0]?.hoax_percentage ?? 0),
      created_at: item.collected_at,
    }));

    return NextResponse.json({
      success: true,
      count: formatted.length,
      data: formatted,
    });
  } catch (err: any) {
    console.error("❌ Error in /api/history:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to load history" },
      { status: 500 }
    );
  }
}
