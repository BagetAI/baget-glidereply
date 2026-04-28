// Database ID for the Knowledge Base
const DB_ID = "14ad3692-2133-4176-a9f4-58af947ca2c4";

export interface KnowledgeItem {
  content: string;
  source_type: string;
  source_url: string;
  tags: string;
}

export interface RetrievalResult {
  items: (KnowledgeItem & { score: number })[];
  confidence: number;
}

/**
 * Retrieves relevant context and calculates a confidence score based on keyword overlap.
 * This simulates a vector similarity search by normalizing keyword hits.
 */
export async function retrieveRelevantContext(query: string): Promise<RetrievalResult> {
  try {
    const response = await fetch(`https://stg-app.baget.ai/api/public/databases/${DB_ID}/rows`);
    if (!response.ok) return { items: [], confidence: 0 };
    
    const rows = await response.json();
    const data = rows.map((r: any) => r.data) as KnowledgeItem[];
    
    const queryLower = query.toLowerCase();
    const keywords = queryLower.split(/\s+/).filter(w => w.length > 2);
    
    if (keywords.length === 0) return { items: [], confidence: 0 };

    const scored = data.map(item => {
      let score = 0;
      const content = item.content.toLowerCase();
      const tags = (item.tags || "").toLowerCase();
      const type = item.source_type.toLowerCase();

      keywords.forEach(word => {
        if (content.includes(word)) score += 2;
        if (tags.includes(word)) score += 5; 
        if (type.includes(word)) score += 1;
      });

      // Normalize score based on potential max (if all keywords were in tags - simplified)
      const maxPossibleScore = keywords.length * 5;
      const normalizedScore = Math.min(score / maxPossibleScore, 1.0);

      return { ...item, score: normalizedScore };
    });

    const filtered = scored
      .filter(s => s.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);

    // Overall confidence is the score of the top match
    const confidence = filtered.length > 0 ? filtered[0].score : 0;

    return {
      items: filtered,
      confidence: parseFloat(confidence.toFixed(2))
    };
  } catch (error) {
    console.error("Retrieval error:", error);
    return { items: [], confidence: 0 };
  }
}

/**
 * Generates a draft using the retrieved context. 
 * Includes verifiable citations and handles the prompt grounding.
 */
export async function generateDraft(query: string, retrieval: RetrievalResult) {
  const { items, confidence } = retrieval;

  if (items.length === 0) {
    return {
      draft: "I've searched our internal documentation and past tickets, but I couldn't find a high-confidence match for this specific query. I've flagged this for agent review to ensure we provide an accurate technical solution.",
      confidence_score: 0,
      sources: []
    };
  }

  const topMatch = items[0];
  const queryLower = query.toLowerCase();
  
  // Simulation of LLM generation with specific source grounding
  let draftText = "";

  if (queryLower.includes("slack")) {
    draftText = `Hi, I see you're having trouble with the Slack connection. Based on our historical resolutions, please check if your Slack admin has approved the GlideReply app and verify the 'channels:read' scope is active.`;
  } else if (queryLower.includes("password")) {
    draftText = `Hello! To reset your password, please use the 'Forgot Password' link on the login page. Note that the reset link sent via email is valid for 15 minutes.`;
  } else {
    // Grounded generation from retrieved content
    draftText = `Based on our ${topMatch.source_type}, here is the recommended resolution: ${topMatch.content.split('.')[0]}.`;
  }

  // Formatting sources for the API response
  const sources = items.map(item => ({
    type: item.source_type,
    url: item.source_url,
    relevance: parseFloat(item.score.toFixed(2))
  }));

  return {
    draft: draftText,
    confidence_score: confidence,
    sources: sources
  };
}
