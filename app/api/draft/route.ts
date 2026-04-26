import { NextResponse } from "next/server";
import { retrieveRelevantContext, generateDraft } from "@/lib/rag";

export async function POST(req: Request) {
  try {
    const { query } = await req.json();

    if (!query) {
      return NextResponse.json({ error: "Query is required" }, { status: 400 });
    }

    // 1. Retrieve context from Knowledge Base
    const context = await retrieveRelevantContext(query);

    // 2. Generate Draft
    const result = await generateDraft(query, context);

    return NextResponse.json({
      ...result,
      status: "success",
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("Draft generation failed:", error);
    return NextResponse.json({ error: "Failed to generate draft" }, { status: 500 });
  }
}
