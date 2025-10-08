import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserSession } from "@/lib/getUserSession";

export async function GET() {
  try {
    const user = await getUserSession();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Cari user di tabel prisma.users berdasarkan email dari Supabase
    const userData = await prisma.users.findUnique({
      where: { email: user.email! },
      select: {
        id: true,
        email: true,
        name: true,
        created_at: true,
        login_history: {
          orderBy: { login_time: "desc" },
          take: 5,
          select: {
            login_time: true,
            ip_address: true,
            user_agent: true,
          },
        },
      },
    });

    if (!userData) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(userData);
  } catch (error: any) {
    console.error("GET /api/profile error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
