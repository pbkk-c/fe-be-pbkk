import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const content_id = url.searchParams.get('content_id');
    const limit = Number(url.searchParams.get('limit') ?? 50);
    const offset = Number(url.searchParams.get('offset') ?? 0);

    if (content_id) {
      const { data, error } = await supabaseAdmin
        .from('content_media')
        .select('*')
        .eq('content_id', content_id)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
      return NextResponse.json(data);
    }

    const { data, error } = await supabaseAdmin
      .from('content_media')
      .select('*')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

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
    if (!body.content_id || !body.type || !body.url) {
      return NextResponse.json({ error: 'Missing content_id, type or url' }, { status: 400 });
    }

    // Optional: check content exists
    const { data: content, error: contentErr } = await supabaseAdmin
      .from('contents')
      .select('id')
      .eq('id', body.content_id)
      .single();

    if (contentErr) {
      // if 406-like error or no row, handle
      return NextResponse.json({ error: 'Referenced content not found' }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from('content_media')
      .insert({
        content_id: body.content_id,
        type: body.type,
        url: body.url,
      })
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
