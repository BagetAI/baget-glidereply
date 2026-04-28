"use client";

import { useState, useEffect } from "react";
import { getZAFClient, ZAFClient } from "@/lib/zendesk";
import { Loader2, Send, Copy, RefreshCw, FileText, ExternalLink } from "lucide-react";

export function SidebarContainer() {
  const [client, setClient] = useState<ZAFClient | null>(null);
  const [ticketData, setTicketData] = useState<{ id: string; subject: string; description: string } | null>(null);
  const [draft, setDraft] = useState<string>("");
  const [citations, setCitations] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const zafClient = getZAFClient();
    if (zafClient) {
      setClient(zafClient);
      
      // Get initial ticket data
      zafClient.get("ticket").then((data: any) => {
        const ticket = data.ticket;
        setTicketData({
          id: ticket.id,
          subject: ticket.subject,
          description: ticket.description
        });
      });
    } else {
      // Mock data for development when not in Zendesk
      setTicketData({
        id: "T-12345",
        subject: "Cannot connect to Slack integration",
        description: "Hi team, I'm trying to connect Slack but I keep getting a permission error. Can you help?"
      });
    }
  }, []);

  const generateDraft = async () => {
    if (!ticketData) return;
    
    setLoading(true);
    setError(null);
    setDraft("");
    
    try {
      const response = await fetch("/api/draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          query: `${ticketData.subject} ${ticketData.description}`,
          ticketId: ticketData.id
        }),
      });

      const data = await response.json();
      
      if (data.status === "success") {
        setDraft(data.draft);
        setCitations(data.citations || []);
      } else {
        setError(data.error || "Failed to generate draft");
      }
    } catch (err) {
      setError("An unexpected error occurred while generating the draft.");
    } finally {
      setLoading(false);
    }
  };

  const copyToEditor = async () => {
    if (!client || !draft) return;
    
    try {
      await client.set("ticket.comment.text", draft);
      // Optional: switch to public reply mode
      await client.set("ticket.comment.type", "public_reply");
    } catch (err) {
      console.error("Failed to copy to editor:", err);
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(draft);
    }
  };

  return (
    <div className="space-y-4">
      {/* Ticket Context Summary */}
      <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm">
        <div className="flex items-center gap-2 mb-2 text-xs font-semibold text-slate-500 uppercase">
          <FileText className="w-3 h-3" />
          Active Ticket: {ticketData?.id || "Loading..."}
        </div>
        <p className="text-sm font-medium text-slate-900 line-clamp-1">
          {ticketData?.subject || "Fetching ticket subject..."}
        </p>
      </div>

      {/* Main Action */}
      {!draft && !loading && (
        <button
          onClick={generateDraft}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all shadow-md active:scale-[0.98]"
        >
          <RefreshCw className="w-4 h-4" />
          Generate AI Draft
        </button>
      )}

      {/* Loading State */}
      {loading && (
        <div className="bg-white p-8 rounded-lg border border-slate-200 flex flex-col items-center justify-center gap-4 animate-pulse">
          <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
          <p className="text-sm text-slate-600 font-medium">Scanning Knowledge Base...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg border border-red-200 text-sm">
          {error}
          <button 
            onClick={generateDraft}
            className="block mt-2 font-bold underline"
          >
            Try again
          </button>
        </div>
      )}

      {/* Draft Result */}
      {draft && !loading && (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
            <div className="bg-slate-50 px-3 py-2 border-b border-slate-200 flex justify-between items-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">AI Drafted Reply</span>
              <button 
                onClick={generateDraft}
                className="text-slate-400 hover:text-indigo-600 transition-colors"
                title="Regenerate"
              >
                <RefreshCw className="w-3 h-3" />
              </button>
            </div>
            <div className="p-4">
              <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                {draft}
              </div>
            </div>
          </div>

          {/* Citations */}
          {citations.length > 0 && (
            <div className="bg-indigo-50/50 p-3 rounded-lg border border-indigo-100">
              <h4 className="text-[10px] font-bold text-indigo-600 uppercase mb-2">Sources Found</h4>
              <ul className="space-y-1">
                {citations.map((url, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <ExternalLink className="w-3 h-3 text-indigo-400" />
                    <a 
                      href={url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-xs text-indigo-700 hover:underline truncate"
                    >
                      {url.replace('https://', '')}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button
              onClick={copyToEditor}
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all"
            >
              <Send className="w-4 h-4" />
              Copy to Editor
            </button>
            <button
              onClick={() => {
                navigator.clipboard.writeText(draft);
                alert("Draft copied to clipboard");
              }}
              className="px-3 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-lg transition-all"
              title="Copy to clipboard"
            >
              <Copy className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
