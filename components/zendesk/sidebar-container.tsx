"use client";

import { useState, useEffect } from "react";
import { getZAFClient, ZAFClient } from "@/lib/zendesk";
import { Loader2, Send, Copy, RefreshCw, FileText, ExternalLink, ShieldCheck, AlertCircle } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface Source {
  type: string;
  url: string;
  relevance: number;
}

export function SidebarContainer() {
  const [client, setClient] = useState<ZAFClient | null>(null);
  const [ticketData, setTicketData] = useState<{ id: string; subject: string; description: string } | null>(null);
  const [draft, setDraft] = useState<string>("");
  const [sources, setSources] = useState<Source[]>([]);
  const [confidence, setConfidence] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const zafClient = getZAFClient();
    if (zafClient) {
      setClient(zafClient);
      zafClient.get("ticket").then((data: any) => {
        const ticket = data.ticket;
        setTicketData({
          id: ticket.id,
          subject: ticket.subject,
          description: ticket.description
        });
      });
    } else {
      setTicketData({
        id: "T-1024",
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
        setSources(data.sources || []);
        setConfidence(data.confidence_score || 0);
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
    } catch (err) {
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
          {ticketData?.subject || "Fetching ticket..."}
        </p>
      </div>

      {!draft && !loading && (
        <button
          onClick={generateDraft}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all shadow-md active:scale-[0.98]"
        >
          <RefreshCw className="w-4 h-4" />
          Generate AI Draft
        </button>
      )}

      {loading && (
        <div className="bg-white p-8 rounded-lg border border-slate-200 flex flex-col items-center justify-center gap-4 animate-pulse">
          <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
          <p className="text-sm text-slate-600 font-medium">Retrieving from Slack & Jira...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg border border-red-200 text-sm">
          {error}
          <button onClick={generateDraft} className="block mt-2 font-bold underline">Try again</button>
        </div>
      )}

      {draft && !loading && (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
            <div className="bg-slate-50 px-3 py-2 border-b border-slate-200 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">AI Draft</span>
                <div className={cn(
                  "px-1.5 py-0.5 rounded-full text-[9px] font-bold uppercase",
                  confidence > 0.7 ? "bg-green-100 text-green-700" : 
                  confidence > 0.4 ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"
                )}>
                  {Math.round(confidence * 100)}% Confidence
                </div>
              </div>
              <button onClick={generateDraft} className="text-slate-400 hover:text-indigo-600">
                <RefreshCw className="w-3 h-3" />
              </button>
            </div>
            <div className="p-4">
              <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                {draft}
              </div>
            </div>
          </div>

          {sources.length > 0 && (
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
              <h4 className="text-[10px] font-bold text-slate-500 uppercase mb-2">Verified Sources</h4>
              <ul className="space-y-2">
                {sources.map((src, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <div className="mt-0.5">
                      {src.relevance > 0.8 ? <ShieldCheck className="w-3 h-3 text-green-500" /> : <ExternalLink className="w-3 h-3 text-slate-400" />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <a 
                        href={src.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-xs text-indigo-600 font-medium hover:underline block truncate"
                      >
                        {src.type}: {src.url.split('/').pop()}
                      </a>
                      <span className="text-[10px] text-slate-400">Match strength: {Math.round(src.relevance * 100)}%</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {confidence < 0.4 && (
            <div className="flex items-center gap-2 p-2 bg-amber-50 rounded border border-amber-100 text-[10px] text-amber-700 font-medium">
              <AlertCircle className="w-3 h-3" />
              Low confidence match. Please verify all technical steps manually.
            </div>
          )}

          <div className="flex gap-2">
            <button
              onClick={copyToEditor}
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all shadow-sm"
            >
              <Send className="w-4 h-4" />
              Copy to Editor
            </button>
            <button
              onClick={() => {
                navigator.clipboard.writeText(draft);
                alert("Copied");
              }}
              className="px-3 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-lg"
            >
              <Copy className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
