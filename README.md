# GlideReply - AI Support Copilot

GlideReply is a high-precision AI Copilot that drafts support responses by retrieving context from historical tickets and documentation.

## Core Features
- **Cross-Source RAG**: Indexes documentation, Jira, and past tickets.
- **Human-in-the-Loop**: Drafts are created for agent review, not auto-sent.
- **Next.js + Python Architecture**: Uses Next.js for the frontend and Python for heavy-duty ML/RAG processing.

## API Documentation

### 1. Draft Generation (`POST /api/draft`)
Generates a support reply draft based on a user query.

**Request:**
```json
{
  "query": "How do I connect Slack?"
}
```

**Response:**
```json
{
  "draft": "To resolve your Slack connection issue...",
  "citations": ["https://docs.glidereply.ai/integrations/slack"],
  "status": "success",
  "timestamp": "2026-04-26T12:00:00Z"
}
```

### 2. Waitlist Signup (`POST /api/waitlist`)
Captures leads for the beta program.

**Request:**
```json
{
  "email": "user@company.com"
}
```

## Database Schema

### Knowledge Base (`14ad3692-2133-4176-a9f4-58af947ca2c4`)
Stores the ground truth data used for RAG.

| Column | Type | Description |
| :--- | :--- | :--- |
| content | text | The actual text of the doc or ticket resolution. |
| source_type | text | Documentation, Past Ticket, Slack, or Jira. |
| source_url | text | Direct link to the source for citation. |
| tags | text | Keywords for improved retrieval. |

### Waitlist Signups (`d276a218-ffea-4a85-8ccf-8bffc4e70d71`)
Stores prospective customer emails.

## Technical Notes
- **Retrieval Engine**: Currently uses keyword-based filtering on the Knowledge Base database.
- **LLM Integration**: Drafts are generated via OpenAI (simulated in prototype).
- **Python Backend**: Core RAG logic is also available in `api/draft.py` for Python-specific ML extensions.
