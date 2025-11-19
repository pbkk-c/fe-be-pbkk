import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    // 🔒 Autentikasi
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };

    // 🆔 Ambil ID dari params
    const { id } = await params;

    // 📦 Ambil data content + analisis terbaru
    const content = await prisma.contents.findUnique({
      where: { id },
      include: {
        analyses: {
          orderBy: { created_at: "desc" },
          take: 1,
        },
      },
    });

    if (!content) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const latest = content.analyses[0];

    // ✅ Response lengkap
    return NextResponse.json({
      id: content.id,
      url: content.url,
      title: content.title,
      topic: content.topic,
      platform: content.platform,
      creator_name: content.creator_name,
      summary: latest?.summary || "No summary available",
      main_theme: latest?.main_theme || "-",
      sentiment: latest?.sentiment || "-",
      fact_percentage: latest?.fact_percentage || 0,
      opinion_percentage: latest?.opinion_percentage || 0,
      hoax_percentage: latest?.hoax_percentage || 0,
      created_at: latest?.created_at || content.collected_at,
    });
  } catch (err) {
    console.error("Error fetching history detail:", err);
    return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
  }
}
