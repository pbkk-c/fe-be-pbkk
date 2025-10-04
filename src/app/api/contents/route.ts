import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const contents = await prisma.contents.findMany({
      include: {
        creators: true,       // ikut ambil data creator
        users: true,          // ikut ambil data user
        analyses: true,       // ikut ambil data analisis
        content_media: true,  // ikut ambil media
        content_topics: {
          include: {
            topics: true,     // join ke tabel topics
          },
        },
      },
      orderBy: {
        collected_at: "desc",
      },
      take: 20, // contoh: limit 20 data
    });

    return NextResponse.json(contents);
  } catch (error) {
    console.error("Error fetching contents:", error);
    return NextResponse.json(
      { error: "Failed to fetch contents" },
      { status: 500 }
    );
  }
}
