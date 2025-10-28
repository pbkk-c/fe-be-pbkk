// src/app/api/content/route.ts
import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET(request: NextRequest) {
  try {
    const { data, error } = await supabaseAdmin
      .from("contents")
      .select(
        `
        *,
        analyses (
          fact_percentage,
          opinion_percentage,
          hoax_percentage,
          created_at
        )
      `
      )
      .order("collected_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // basic validation
    if (!body.url || !body.platform) {
      return NextResponse.json({ error: "Missing url or platform" }, { status: 400 });
    }

    // Insert content (kembalikan row yang dibuat)
    const { data, error } = await supabaseAdmin
      .from("contents")
      .insert({
        user_id: body.user_id ?? null,
        creator_id: body.creator_id ?? null,
        platform: body.platform,
        url: body.url,
        title: body.title ?? null,
        raw_text: body.raw_text ?? null,
        published_at: body.published_at ?? null,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // (opsional) jika ada media array, insert ke content_media
    if (body.media && Array.isArray(body.media) && body.media.length > 0) {
      const mediaRows = body.media.map((m: any) => ({
        content_id: data.id,
        type: m.type,
        url: m.url,
      }));
      await supabaseAdmin.from("content_media").insert(mediaRows);
    }

    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
