import { OpenAI } from "openai";

// Database ID for the Knowledge Base
const DB_ID = "14ad3692-2133-4176-a9f4-58af947ca2c4";

export interface KnowledgeItem {
  content: string;
  source_type: string;
  source_url: string;
  tags: string;
}

export async function retrieveRelevantContext(query: string): Promise<KnowledgeItem[]> {
  try {
    // Fetch all rows from the knowledge base database
    // In production, this would be a vector search query
    const response = await fetch(`https://stg-app.baget.ai/api/public/databases/${DB_ID}/rows`);
    if (!response.ok) return [];
    
    const rows = await response.json();
    const data = rows.map((r: any) => r.data) as KnowledgeItem[];
    
    // Simple filter-based retrieval (Simulating vector search)
    const keywords = query.toLowerCase().split(/\s+/);
    return data.filter(item => {
      const text = (item.content + " " + item.tags).toLowerCase();
      return keywords.some(word => word.length > 3 && text.includes(word));
    }).slice(0, 3); // Return top 3 matches
  } catch (error) {
    console.error("Retrieval error:", error);
    return [];
  }
}

export async function generateDraft(query: string, context: KnowledgeItem[]) {
  if (context.length === 0) {
    return {
      draft: "I couldn't find a specific answer in our docs. I've flagged this for a senior agent.",
      citations: []
    };
  }

  const contextText = context.map(c => `[Source: ${c.source_type} (${c.source_url})]: ${c.content}`).join("\n\n");
  
  // Construct the prompt for OpenAI
  // In a real environment, we'd use the OpenAI SDK here
  // For the prototype, we simulate the LLM logic
  
  const draft = `Hello, 

Thanks for reaching out! Based on our documentation, here is how you can resolve this:

${context[0].content}

If you need further assistance, please let me know!

Best regards,
GlideReply Copilot`;

  return {
    draft,
    citations: context.map(c => c.source_url)
  };
}
