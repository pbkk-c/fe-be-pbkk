import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Define the expected structure of the data returned by the external Python service.
interface AnalysisResultData {
  main_theme: string;
  summary: string;
  fact_percentage: number;
  opinion_percentage: number;
  hoax_percentage: number;
  sentiment: string;
  raw_analysis_json: any;
}

export async function POST(req: Request) {
  try {
    const { url, language } = await req.json();
    if (!url) {
      return NextResponse.json({ error: "Missing URL" }, { status: 400 });
    }

    // 1. Get the new service URL from the environment (loaded from .env)
    const serviceUrl = process.env.ANALYSIS_SERVICE_URL;
    if (!serviceUrl) {
      return NextResponse.json({ error: "ANALYSIS_SERVICE_URL is not set" }, { status: 500 });
    }

    console.log(`Forwarding analysis request to: ${serviceUrl}`);

    // 🚀 Step 2: Call the external Python Analysis Service
    const response = await fetch(serviceUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        url: url,
        language: language || "ID",
      }), // Use the user's input URL
    });

    // 🛑 CRITICAL CHECK: If the service returns HTML, catch it here.
    const contentType = response.headers.get("content-type");

    if (!response.ok || !contentType?.includes("application/json")) {
      const statusCode = response.status;
      let errorBody: any = await response.text(); // Read as text first

      // If it's HTML, truncate the body to prevent huge logs
      if (errorBody.startsWith("<")) {
        errorBody = "HTML Error Page (Container Crash or Not Found)";
      } else {
        // If it's not HTML, try to parse the error JSON
        try {
          errorBody = JSON.parse(errorBody);
        } catch {
          // Ignore if parsing fails
        }
      }

      console.error(`Analysis Service Error (${statusCode}):`, errorBody);
      return NextResponse.json(
        {
          error: `Service failed: ${errorBody.error || errorBody}`,
          details: `Status ${statusCode}: Check Hugging Face Logs for crash details.`,
        },
        { status: 502 }
      );
    }
    // 🛑 END CRITICAL CHECK

    // Step 3: Process successful JSON result
    const serviceResult = await response.json();
    // Assuming the Flask app wraps data in a 'data' key for success
    const analysisResult: AnalysisResultData = serviceResult.data || serviceResult;

    // 🚀 Step 4: Return Analysis Result Directly (Skipping Database Save)

    // We return the raw analysis JSON so the frontend (analyzer/page.tsx)
    // can display the facts/opinions/hoax breakdown immediately.
    return NextResponse.json({ success: true, data: analysisResult });
  } catch (error: any) {
    console.error("Next.js Analyze API Error:", error);
    return NextResponse.json(
      { error: error.message || "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
