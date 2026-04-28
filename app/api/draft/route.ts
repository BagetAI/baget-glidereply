import { NextResponse } from "next/server";
import { retrieveRelevantContext, generateDraft } from "@/lib/rag";

/**
 * Enhanced Draft API
 * Returns AI-generated draft, confidence score, and verified source citations.
 */
export async function POST(req: Request) {
  try {
    const { query, ticketId } = await req.json();

    if (!query) {
      return NextResponse.json({ error: "Query is required" }, { status: 400 });
    }

    // 1. Retrieve relevant context with confidence scoring
    const retrieval = await retrieveRelevantContext(query);

    // 2. Generate Draft grounded in the retrieved sources
    const result = await generateDraft(query, retrieval);

    // 3. Return structured response with confidence and sources
    return NextResponse.json({
      draft: result.draft,
      confidence_score: result.confidence_score,
      sources: result.sources,
      ticketId,
      status: "success",
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("Draft generation failed:", error);
    return NextResponse.json({ 
      error: "Failed to generate draft",
      status: "error" 
    }, { status: 500 });
  }
}
