// src/app/api/analyses/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const { data, error } = await supabaseAdmin
    .from('analyses')
    .select('*, analysis_details(*)')
    .eq('id', id)
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json(data);
}


export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id;
    const payload = await request.json();

    // Update analysis row
    const updatePayload: any = {};
    ['main_theme', 'summary', 'fact_percentage', 'opinion_percentage', 'hoax_percentage', 'sentiment'].forEach((k) => {
      if (k in payload) updatePayload[k] = payload[k];
    });

    const { data: updated, error } = await supabaseAdmin
      .from('analyses')
      .update(updatePayload)
      .eq('id', id)
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    // If payload.details present, we will replace existing details (simple approach)
    if (Array.isArray(payload.details)) {
      await supabaseAdmin.from('analysis_details').delete().eq('analysis_id', id);
      const detailsRows = payload.details.map((d: any) => ({
        analysis_id: id,
        sentence: d.sentence,
        classification: d.classification,
        confidence: d.confidence ?? null,
      }));
      if (detailsRows.length > 0) await supabaseAdmin.from('analysis_details').insert(detailsRows);
    }

    const { data: full, error: fullErr } = await supabaseAdmin
      .from('analyses')
      .select('*, analysis_details(*)')
      .eq('id', id)
      .single();

    if (fullErr) return NextResponse.json({ error: fullErr.message }, { status: 400 });
    return NextResponse.json(full);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id;
    const { error } = await supabaseAdmin.from('analyses').delete().eq('id', id);
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
