import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // pastikan kamu sudah punya prisma client di sini

export async function POST(req: Request) {
  try {
    const { url } = await req.json();
    if (!url) {
      return NextResponse.json({ error: "Missing URL" }, { status: 400 });
    }

    // ✅ Ambil link Gradio terbaru dari database
    const latestLink = await prisma.gardio_links.findFirst({
      orderBy: { created_at: "desc" },
    });

    if (!latestLink?.url) {
      return NextResponse.json({ error: "No active Gradio link found" }, { status: 404 });
    }

    // TO DO CHANGE GRADIO URL
    const gradioUrl = latestLink.url;
    console.log("Using Gradio URL:", gradioUrl);

    // const gradioUrl = process.env.GRADIO_URL;
    // const gradioUrl = "https://069d93420c693e575d.gradio.live";
    if (!gradioUrl) {
      return NextResponse.json({ error: "Missing GRADIO_URL in env" }, { status: 500 });
    }

    // Step 1: Kirim ke Gradio (sesuai format payload dari Network tab)
    const payload = {
      data: [url],
      event_data: null,
      fn_index: 0,
      session_hash: Math.random().toString(36).substring(7), // random hash
    };

    const response = await fetch(`${gradioUrl}/gradio_api/queue/join`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const event = await response.json();
    if (!event?.event_id) {
      return NextResponse.json({ error: "Failed to get Gradio event ID" }, { status: 500 });
    }

    // Step 2: Poll hasil dari Gradio (mirip mekanisme queue)
    const result = await waitForGradioResult(gradioUrl, event.event_id);

    if (!result) {
      return NextResponse.json({ error: "Timeout waiting for Gradio result" }, { status: 504 });
    }

    // --- hasil analisis dari Gradio ---
    const { main_theme, summary, fact_percentage, opinion_percentage, hoax_percentage, sentiment } =
      result || {};

    // Step 3: Simpan ke database
    const saved = await prisma.analyses.create({
      data: {
        main_theme,
        summary,
        fact_percentage,
        opinion_percentage,
        hoax_percentage,
        sentiment,
      },
    });

    return NextResponse.json({ success: true, data: saved });
  } catch (error: any) {
    console.error("Analyze API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/** Helper untuk nunggu hasil Gradio (polling mekanisme queue) */
async function waitForGradioResult(gradioUrl: string, eventId: string) {
  const maxAttempts = 20; // coba 20x
  const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

  for (let i = 0; i < maxAttempts; i++) {
    const res = await fetch(`${gradioUrl}/gradio_api/queue/data?event_id=${eventId}`);
    const data = await res.json();

    if (data?.status === "COMPLETE" && data?.output?.data) {
      // sesuaikan sesuai struktur output Gradio kamu
      return {
        main_theme: data.output.data[0],
        summary: data.output.data[1],
        fact_percentage: data.output.data[2],
        opinion_percentage: data.output.data[3],
        hoax_percentage: data.output.data[4],
        sentiment: data.output.data[5],
      };
    }

    await delay(2000); // tunggu 2 detik sebelum coba lagi
  }

  return null;
}
