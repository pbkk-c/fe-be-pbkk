import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };

    // ambil riwayat login & aktivitas user
    const history = await prisma.login_history.findMany({
      where: { user_id: decoded.userId },
      orderBy: { created_at: "desc" },
      select: {
        id: true,
        ip_address: true,
        user_agent: true,
        created_at: true,
      },
    });

    return NextResponse.json(history);
  } catch (err) {
    console.error("Error in /api/history:", err);
    return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
  }
}
