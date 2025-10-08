import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

export async function GET(req: Request) {
  try {
    // 🔹 Ambil token dari Authorization header
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };

    // 🔹 Pastikan user ada
    const user = await prisma.users.findUnique({
      where: { id: decoded.userId },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // 🔹 Ambil semua contents milik user dengan type = "history"
    const history = await prisma.contents.findMany({
      where: {
        user_id: user.id,
        type: "history",
      },
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
          take: 1,
          orderBy: { created_at: "desc" },
        },
      },
    });

    // 🔹 Format data agar frontend bisa langsung render
    const formatted = history.map((item) => ({
      id: item.id,
      url: item.url || "-",
      title: item.title || "Untitled",
      topic: item.topic || "-",
      summary: item.analyses[0]?.summary || "No analysis available",
      main_theme: item.analyses[0]?.main_theme || "-",
      sentiment: item.analyses[0]?.sentiment || "-",
      fact_percentage: item.analyses[0]?.fact_percentage || 0,
      opinion_percentage: item.analyses[0]?.opinion_percentage || 0,
      hoax_percentage: item.analyses[0]?.hoax_percentage || 0,
      created_at: item.collected_at,
    }));

    return NextResponse.json(formatted);
  } catch (err) {
    console.error("Error in /api/history:", err);
    return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
  }
}
