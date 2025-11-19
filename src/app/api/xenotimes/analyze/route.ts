import { NextResponse } from "next/server";

export const maxDuration = 60; // Allow up to 60 seconds for this function

export async function POST(req: Request) {
  try {
    const { url, language } = await req.json();

    if (!url) {
      return NextResponse.json({ error: "Missing URL" }, { status: 400 });
    }

    // 1. Python Service URL (Running locally)
    const serviceUrl = "http://127.0.0.1:5000/analyze";

    console.log(`🚀 Forwarding to Python AI: ${serviceUrl}`);

    // 2. Call Python API with a long timeout (60 seconds)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000);

    try {
      const response = await fetch(serviceUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: url,
          language: language || "ID",
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Python API Error (${response.status}):`, errorText);
        return NextResponse.json(
          { error: "AI Service failed", details: errorText },
          { status: response.status }
        );
      }

      // 3. Process Success
      const serviceResult = await response.json();
      
      // Our Python API returns { success: true, data: { ... } }
      return NextResponse.json(serviceResult);

    } catch (fetchError: any) {
      clearTimeout(timeoutId);
      if (fetchError.name === 'AbortError') {
        return NextResponse.json({ error: "AI took too long to respond (Timeout)" }, { status: 504 });
      }
      throw fetchError;
    }

  } catch (error: any) {
    console.error("Next.js API Route Error:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}