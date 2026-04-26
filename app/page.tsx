import { Navbar } from "@/components/navbar";
import { WaitlistForm } from "@/components/waitlist-form";
import { Features } from "@/components/features";
import { Pricing } from "@/components/pricing";
import { Footer } from "@/components/footer";
import { MessageSquare, ShieldCheck, Zap } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-20 pb-16 lg:pt-32 lg:pb-24 overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center">
            <div className="lg:w-1/2 mb-12 lg:mb-0">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary-light text-primary text-sm font-medium mb-6">
                New: AI RAG for Mid-Market SaaS
              </div>
              <h1 className="text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 mb-6 leading-tight">
                The AI Copilot that <span className="text-primary">Drafts Your Perfect Reply.</span>
              </h1>
              <p className="text-xl text-slate-600 mb-8 max-w-xl">
                GlideReply indexes your historical tickets, Slack, and Jira to draft 100% accurate responses. No more resolution taxes. No more hallucinations.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <WaitlistForm />
              </div>
              <div className="mt-8 flex items-center gap-6 text-sm text-slate-500">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-green-500" /> Human-in-the-loop
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-yellow-500" /> RAG-powered accuracy
                </div>
              </div>
            </div>
            <div className="lg:w-1/2 lg:pl-12">
              <div className="relative rounded-2xl border border-slate-200 shadow-2xl overflow-hidden bg-slate-50">
                <img 
                  src="images/a-sleek-professional-software-dashboard-.png" 
                  alt="GlideReply AI Copilot Dashboard" 
                  className="w-full h-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <Features />
      <Pricing />
      <Footer />
    </main>
  );
}