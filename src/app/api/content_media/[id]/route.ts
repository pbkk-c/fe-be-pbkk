// src/app/api/content_media/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id;
    const { data, error } = await supabaseAdmin
      .from('content_media')
      .select('*')
      .eq('id', id)
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 404 });
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id;
    const payload = await request.json();

    // if user tries to change content_id, optionally validate referenced content exists
    if (payload.content_id) {
      const { data: c, error: ce } = await supabaseAdmin
        .from('contents')
        .select('id')
        .eq('id', payload.content_id)
        .single();
      if (ce) return NextResponse.json({ error: 'Referenced content not found' }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from('content_media')
      .update(payload)
      .eq('id', id)
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id;
    const { error } = await supabaseAdmin.from('content_media').delete().eq('id', id);
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
