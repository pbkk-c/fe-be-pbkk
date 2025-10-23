import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET → ambil link gardio terbaru
export async function GET() {
  try {
    const latestLink = await prisma.gardio_links.findFirst({
      orderBy: { created_at: "desc" },
    });

    if (!latestLink) {
      return NextResponse.json({ error: "No Gradio link found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: latestLink });
  } catch (error) {
    console.error("GET /api/gardio error:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}

// POST → tambahkan link gardio baru
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { url } = body;

    if (!url) {
      return NextResponse.json({ success: false, error: "URL is required" }, { status: 400 });
    }

    const newLink = await prisma.gardio_links.create({
      data: { url },
    });

    return NextResponse.json({ success: true, data: newLink });
  } catch (error) {
    console.error("POST /api/gardio error:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
