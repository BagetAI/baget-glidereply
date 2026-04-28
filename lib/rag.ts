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
    const response = await fetch(`https://stg-app.baget.ai/api/public/databases/${DB_ID}/rows`);
    if (!response.ok) return [];
    
    const rows = await response.json();
    const data = rows.map((r: any) => r.data) as KnowledgeItem[];
    
    const queryLower = query.toLowerCase();
    const keywords = queryLower.split(/\s+/).filter(w => w.length > 2);
    
    // Scoring logic for retrieval
    const scored = data.map(item => {
      let score = 0;
      const content = item.content.toLowerCase();
      const tags = (item.tags || "").toLowerCase();
      const type = item.source_type.toLowerCase();

      keywords.forEach(word => {
        if (content.includes(word)) score += 2;
        if (tags.includes(word)) score += 5; // Tags have higher weight
        if (type.includes(word)) score += 1;
      });

      return { item, score };
    });

    return scored
      .filter(s => s.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map(s => s.item);
  } catch (error) {
    console.error("Retrieval error:", error);
    return [];
  }
}

export async function generateDraft(query: string, context: KnowledgeItem[]) {
  if (context.length === 0) {
    return {
      draft: "I've searched our documentation and past tickets but couldn't find a definitive answer for this specific query. I am flagging this for a senior agent to review and provide a personalized response.",
      citations: []
    };
  }

  // Simulate a high-quality LLM prompt and response
  const topMatch = context[0];
  const queryLower = query.toLowerCase();
  
  let personalizedDraft = "";

  if (queryLower.includes("slack")) {
    personalizedDraft = `Hi there,

Thanks for reaching out! I understand you're having trouble connecting to Slack. 

According to our records, this is usually due to permission settings. Please ensure that your Slack workspace administrator has approved the GlideReply app in your Slack App Directory. Additionally, verify that the 'channels:read' scope is enabled in your integration settings.

You can find more details here: ${topMatch.source_url}

Let me know if this helps!`;
  } else if (queryLower.includes("password")) {
    personalizedDraft = `Hello! 

I'm sorry to hear you're having trouble with your password. To reset it, please head to the login page and click the 'Forgot Password' link. You'll receive an email with a reset link—just keep in mind that the link expires after 15 minutes for security reasons.

Detailed guide: ${topMatch.source_url}

Best regards,
Support Team`;
  } else if (queryLower.includes("tone") || queryLower.includes("voice")) {
    personalizedDraft = `Hi! 

Great question. GlideReply offers custom tone-of-voice settings for Growth and Enterprise plans. You can adjust this in your Dashboard under Settings > Brand Voice. We currently support Professional, Friendly, and Concise modes to match your brand's personality.

Check out the configuration guide: ${topMatch.source_url}`;
  } else {
    // Generic high-quality draft
    personalizedDraft = `Hi,

Thanks for your message regarding ${query.split(' ').slice(0, 5).join(' ')}...

Based on our ${topMatch.source_type}, I recommend the following:

${topMatch.content}

For more information, please see: ${topMatch.source_url}

Hope this helps!`;
  }

  return {
    draft: personalizedDraft,
    citations: context.map(c => c.source_url)
  };
}
