// src/app/api/analyses/run/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

const HF_BASE = 'https://api-inference.huggingface.co/models';

async function hfInference(model: string, input: any) {
  const res = await fetch(`${HF_BASE}/${model}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`HuggingFace error: ${res.status} ${t}`);
  }
  return res.json();
}

function splitSentences(text: string) {
  // Simple sentence splitter — bisa disesuaikan
  return text
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body.content_id) return NextResponse.json({ error: 'Missing content_id' }, { status: 400 });

    const { data: content, error: ce } = await supabaseAdmin
      .from('contents')
      .select('id, raw_text, title, url')
      .eq('id', body.content_id)
      .single();

    if (ce || !content) return NextResponse.json({ error: 'Content not found or has no raw_text' }, { status: 404 });

    const rawText: string = content.raw_text ?? '';
    if (!rawText || rawText.trim().length === 0) {
      return NextResponse.json({ error: 'Content has no raw_text to analyze' }, { status: 400 });
    }

    // 1) Summarize
    let summary = null;
    try {
      const sumResp = await hfInference('facebook/bart-large-cnn', { inputs: rawText, parameters: { max_length: 200 } });
      // HF summarization may return array or object -> try to extract text
      if (Array.isArray(sumResp)) {
        summary = (sumResp[0] && (sumResp[0].summary_text || sumResp[0].generated_text)) ?? String(sumResp[0]);
      } else if (typeof sumResp === 'object') {
        summary = (sumResp as any).summary_text ?? JSON.stringify(sumResp);
      } else {
        summary = String(sumResp);
      }
    } catch (e) {
      summary = null;
      console.warn('Summarization failed', e);
    }

    // 2) Sentiment (text classification)
    let sentiment = null;
    try {
      const sentResp = await hfInference('distilbert-base-uncased-finetuned-sst-2-english', { inputs: rawText });
      // typical response: [{label: "POSITIVE", score: 0.99}]
      if (Array.isArray(sentResp) && sentResp[0]) {
        const label = (sentResp[0].label ?? '').toLowerCase();
        if (label.includes('positive')) sentiment = 'positif';
        else if (label.includes('negative')) sentiment = 'negatif';
        else sentiment = 'netral';
      }
    } catch (e) {
      sentiment = null;
      console.warn('Sentiment failed', e);
    }

    // 3) Sentence-level classification (zero-shot: fact / opinion / hoax)
    // 3) Sentence-level classification (zero-shot: fact / opinion / hoax)
    const sentences = splitSentences(rawText).slice(0, 60); // limit to first 60 sentences
    const details: any[] = [];

    type ClassificationLabel = "fact" | "opinion" | "hoax";

    const counts: Record<ClassificationLabel, number> = {
    fact: 0,
    opinion: 0,
    hoax: 0,
    };

    for (const s of sentences) {
    try {
        const zeroResp: any = await hfInference("facebook/bart-large-mnli", {
        inputs: s,
        parameters: { candidate_labels: ["fact", "opinion", "hoax"] },
        });

        const label: string | undefined =
        zeroResp.labels?.[0] ?? (zeroResp[0]?.label ?? undefined);

        const score: number | null =
        zeroResp.scores?.[0] ?? zeroResp[0]?.score ?? null;

        let classification: ClassificationLabel | "unknown" = "unknown";

        if (label === "fact" || label === "opinion" || label === "hoax") {
        counts[label] += 1; // ✅ sekarang aman
        classification = label;
        }

        details.push({
        sentence: s,
        classification,
        confidence: score,
        });
    } catch (e) {
        details.push({ sentence: s, classification: "error", confidence: null });
    }
    }



    const total = Math.max(1, sentences.length);
    const fact_percentage = (counts.fact / total) * 100;
    const opinion_percentage = (counts.opinion / total) * 100;
    const hoax_percentage = (counts.hoax / total) * 100;

    // 4) Insert analysis + details
    const { data: analysis, error: insertErr } = await supabaseAdmin
      .from('analyses')
      .insert({
        content_id: body.content_id,
        main_theme: body.main_theme ?? null,
        summary: summary ?? null,
        fact_percentage: Math.round(fact_percentage * 100) / 100,
        opinion_percentage: Math.round(opinion_percentage * 100) / 100,
        hoax_percentage: Math.round(hoax_percentage * 100) / 100,
        sentiment: sentiment ?? null,
      })
      .select()
      .single();

    if (insertErr) throw insertErr;

    if (details.length > 0) {
      const rows = details.map((d) => ({
        analysis_id: analysis.id,
        sentence: d.sentence,
        classification: d.classification,
        confidence: d.confidence,
      }));
      await supabaseAdmin.from('analysis_details').insert(rows);
    }

    // return inserted analysis with details
    const { data: full, error: fullErr } = await supabaseAdmin
      .from('analyses')
      .select('*, analysis_details(*)')
      .eq('id', analysis.id)
      .single();

    if (fullErr) return NextResponse.json({ error: fullErr.message }, { status: 400 });

    return NextResponse.json(full);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
