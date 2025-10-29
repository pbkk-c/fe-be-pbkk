// src/app/api/analyze/route.ts - REVISED

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // Still needed for database saving

// 🛑 REMOVE Node.js child_process imports and execPromise definition

export async function POST(req: Request) {
  try {
    const { url } = await req.json();
    if (!url) {
      return NextResponse.json({ error: "Missing URL" }, { status: 400 });
    }
    
    // 1. Get the new service URL
    const serviceUrl = process.env.ANALYSIS_SERVICE_URL;
    if (!serviceUrl) {
        return NextResponse.json({ error: "ANALYSIS_SERVICE_URL is not set" }, { status: 500 });
    }

    console.log(`Forwarding analysis request to: ${serviceUrl}`);

    // 🚀 Step 2: Call the external Python Analysis Service
    const response = await fetch(serviceUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            // Pass any needed headers, though likely none required here
        },
        body: JSON.stringify({ url: url }) // Send the raw URL
    });

    // Step 3: Check service response status
    if (!response.ok) {
        // If Python service returns an error (4xx or 5xx)
        const errorData = await response.json();
        const statusCode = response.status;
        console.error(`Analysis Service Error (${statusCode}):`, errorData);

        return NextResponse.json({ 
            error: `Analysis failed by external service: ${errorData.error || 'Unknown error'}`,
            details: errorData.details || errorData
        }, { status: statusCode });
    }

    // Step 4: Process successful result
    const serviceResult = await response.json();
    const analysisResult = serviceResult.data; // Get the raw analysis JSON

    // Destructure properties for database save
    const { 
        main_theme, 
        summary, 
        fact_percentage, 
        opinion_percentage, 
        hoax_percentage, 
        sentiment,
        raw_analysis_json // This contains the full detailed breakdown
    } = analysisResult;


    // Step 5: Save to database (This step is where your previous error occurred)
    try {
        const saved = await prisma.analyses.create({
            data: {
                main_theme: main_theme || "N/A",
                summary: summary || raw_analysis_json?.summary_statement || "No summary available.",
                fact_percentage: fact_percentage,
                opinion_percentage: opinion_percentage,
                hoax_percentage: hoax_percentage,
                sentiment: sentiment || "N/A",
                // You must ensure your Prisma schema supports storing the JSON object 
                // as a JSON or String field (e.g., 'analysis_details: JSON').
                // If storing as JSON, use JSON.parse() on the string if necessary.
                // For simplicity, assuming a JSON field that takes an object:
                // analysis_details: raw_analysis_json, 
            },
        });
        
        // Return the saved object plus the full raw analysis for the frontend
        return NextResponse.json({ success: true, data: { ...saved, raw_analysis_json } });

    } catch (dbError) {
        console.error("Prisma Database Save Error:", dbError);
        // The error you previously encountered will show here if the DB connection is bad.
        return NextResponse.json({ error: "Database save failed.", details: dbError.message || dbError }, { status: 500 });
    }

  } catch (error: any) {
    console.error("Next.js Analyze API Error:", error);
    return NextResponse.json({ error: error.message || "An unexpected error occurred." }, { status: 500 });
  }
}