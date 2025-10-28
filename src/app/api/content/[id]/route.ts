import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // pastikan ini default export

// ✅ GET: Ambil content by ID lengkap dengan analyses & content_media
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    const content = await prisma.contents.findUnique({
      where: { id },
      include: {
        // 🔹 ambil semua kolom analyses + relasi ke analysis_details
        analyses: {
          include: {
            analysis_details: {
              select: {
                id: true,
                sentence: true,
                classification: true,
                confidence: true,
              },
            },
          },
        },
        // 🔹 ambil media yang terkait
        content_media: {
          select: {
            id: true,
            type: true,
            url: true,
            text: true,
            created_at: true,
          },
        },
      },
    });

    if (!content) return NextResponse.json({ error: "Content not found" }, { status: 404 });

    return NextResponse.json(content);
  } catch (err: any) {
    console.error("GET /api/content/[id] error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// ✅ PATCH: Update content
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const payload = await request.json();

    const updated = await prisma.contents.update({
      where: { id },
      data: payload,
      include: {
        analyses: {
          include: {
            analysis_details: true,
          },
        },
        content_media: true,
      },
    });

    return NextResponse.json(updated);
  } catch (err: any) {
    console.error("PATCH /api/content/[id] error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// ✅ DELETE: Hapus content
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await prisma.contents.delete({
      where: { id },
    });

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error("DELETE /api/content/[id] error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
