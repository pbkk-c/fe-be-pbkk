// src/app/api/analyses/route.ts
import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const content_id = url.searchParams.get("content_id");
    const limit = Number(url.searchParams.get("limit") ?? 50);
    const offset = Number(url.searchParams.get("offset") ?? 0);

    let query = supabaseAdmin
      .from("analyses")
      .select("*, analysis_details(*)")
      .order("created_at", { ascending: false });

    if (content_id) query = query.eq("content_id", content_id);

    const { data, error } = await query.range(offset, offset + limit - 1);

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // validation
    if (!body.content_id) {
      return NextResponse.json({ error: "Missing content_id" }, { status: 400 });
    }

    // Optionally check content exists
    const { data: content, error: ce } = await supabaseAdmin
      .from("contents")
      .select("id")
      .eq("id", body.content_id)
      .single();

    if (ce) return NextResponse.json({ error: "Referenced content not found" }, { status: 400 });

    // Insert analysis
    const { data: analysis, error } = await supabaseAdmin
      .from("analyses")
      .insert({
        content_id: body.content_id,
        main_theme: body.main_theme ?? null,
        summary: body.summary ?? null,
        fact_percentage: body.fact_percentage ?? null,
        opinion_percentage: body.opinion_percentage ?? null,
        hoax_percentage: body.hoax_percentage ?? null,
        sentiment: body.sentiment ?? null,
      })
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    // If details provided, insert them
    if (Array.isArray(body.details) && body.details.length > 0) {
      const detailsRows = body.details.map((d: any) => ({
        analysis_id: analysis.id,
        sentence: d.sentence,
        classification: d.classification,
        confidence: d.confidence ?? null,
      }));
      await supabaseAdmin.from("analysis_details").insert(detailsRows);
    }

    // return analysis with details
    const { data: full, error: fullErr } = await supabaseAdmin
      .from("analyses")
      .select("*, analysis_details(*)")
      .eq("id", analysis.id)
      .single();

    if (fullErr) return NextResponse.json({ error: fullErr.message }, { status: 400 });

    return NextResponse.json(full);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
