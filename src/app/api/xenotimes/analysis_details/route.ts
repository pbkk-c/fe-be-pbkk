// src/app/api/analysis_details/route.ts
import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

// GET: ambil semua detail atau berdasarkan analysis_id
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const analysisId = url.searchParams.get("analysis_id");

    let query = supabaseAdmin.from("analysis_details").select("*").order("id", { ascending: true });
    if (analysisId) query = query.eq("analysis_id", analysisId);

    const { data, error } = await query;
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// POST: tambah detail baru
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body.analysis_id || !body.sentence) {
      return NextResponse.json({ error: "Missing analysis_id or sentence" }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from("analysis_details")
      .insert({
        analysis_id: body.analysis_id,
        sentence: body.sentence,
        classification: body.classification ?? "unknown",
        confidence: body.confidence ?? null,
      })
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
