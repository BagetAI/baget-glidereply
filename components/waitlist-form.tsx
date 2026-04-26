"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";

export function WaitlistForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        setStatus("success");
        setEmail("");
      } else {
        setStatus("error");
      }
    } catch (err) {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className="bg-green-50 text-green-700 px-6 py-3 rounded-lg border border-green-200 font-medium">
        Thanks! You are on the list.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row w-full max-w-md gap-2">
      <input
        type="email"
        required
        placeholder="Enter your work email"
        className="flex-grow px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
      >
        {status === "loading" ? "Joining..." : "Get Early Access"}
        <ArrowRight className="w-4 h-4" />
      </button>
      {status === "error" && (
        <p className="text-red-500 text-sm mt-1 sm:absolute sm:mt-12">Something went wrong. Please try again.</p>
      )}
    </form>
  );
}