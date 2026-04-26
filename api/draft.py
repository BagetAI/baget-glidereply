from http.server import BaseHTTPRequestHandler
import json
import os

# Mock Knowledge Base (Simulating a Vector DB query)
# In production, this would use Pinecone or Supabase pgvector
KNOWLEDGE_BASE = [
    {
        "content": "How to reset password: Users can reset passwords by clicking the 'Forgot Password' link on the login page. An email will be sent with a 15-minute expiration link.",
        "source": "Documentation: Auth Flow",
        "url": "https://docs.glidereply.ai/auth/reset-password"
    },
    {
        "content": "Ticket #1024: Customer unable to connect Slack. Resolution: Ensure the Slack workspace admin has approved the GlideReply app. Check if 'channels:read' scope is enabled.",
        "source": "Zendesk Ticket #1024",
        "url": "https://glidereply.zendesk.com/tickets/1024"
    },
    {
        "content": "API Rate Limits: Standard allows 100 rpm. Growth allows 500. Exceeding results in 429.",
        "source": "Documentation: API Limits",
        "url": "https://docs.glidereply.ai/api/limits"
    },
    {
        "content": "Ticket #2055: Jira sync latency. Resolution: Webhooks take up to 30s. If longer, restart connector.",
        "source": "Zendesk Ticket #2055",
        "url": "https://glidereply.zendesk.com/tickets/2055"
    }
]

def retrieve_context(query):
    """
    Simple keyword-based retrieval to simulate vector search.
    In a real app, this would use embeddings + cosine similarity.
    """
    query = query.lower()
    matches = []
    for item in KNOWLEDGE_BASE:
        # Check if query keywords exist in content or tags (tags not in list but content is enough)
        if any(word in item['content'].lower() for word in query.split()):
            matches.append(item)
    
    # Return top 2 matches or everything if it's small
    return matches[:2]

class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length)
        payload = json.loads(post_data)
        
        ticket_query = payload.get("query", "")
        
        # 1. Retrieval Step
        context_items = retrieve_context(ticket_query)
        context_text = "\n\n".join([f"Source: {i['source']}\nContent: {i['content']}" for i in context_items])
        
        # 2. Augmented Generation Step (Mocking OpenAI call for the prototype)
        # Note: In production, we'd use 'openai.ChatCompletion.create'
        # We'll simulate the response format the AI would provide.
        
        citations = [item['url'] for item in context_items]
        
        if not context_items:
            draft = "I'm sorry, I couldn't find any specific documentation or past tickets regarding your query. I'll pass this to a human agent immediately."
        else:
            # Simulated AI Draft based on context
            draft = f"Based on our records ({', '.join([i['source'] for i in context_items])}), here is a draft:\n\n"
            if "slack" in ticket_query.lower():
                draft += "To resolve your Slack connection issue, please ensure your workspace admin has approved the GlideReply app in the Slack App Directory and that the 'channels:read' scope is active."
            elif "password" in ticket_query.lower():
                draft += "You can reset your password by clicking 'Forgot Password' on the login page. You will receive an email with a link that expires in 15 minutes."
            else:
                draft += f"To address your query regarding '{ticket_query}', please refer to our standard procedures. {context_items[0]['content']}"

        response = {
            "draft": draft,
            "citations": citations,
            "status": "success",
            "model": "gpt-4o-mini"
        }
        
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.end_headers()
        self.wfile.write(json.dumps(response).encode('utf-8'))
        return
