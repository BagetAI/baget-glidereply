import { Search, Database, Users, BarChart3 } from "lucide-react";

export function Features() {
  const features = [
    {
      title: "Cross-Source RAG",
      description: "We don't just index your help center. We pull context from past tickets, Slack threads, and Jira issues to find the real answer.",
      icon: <Database className="w-6 h-6 text-primary" />,
    },
    {
      title: "Human-in-the-Loop",
      description: "GlideReply drafts the response, but your agents keep control. 100% accuracy for technical SaaS queries, zero hallucinations.",
      icon: <Users className="w-6 h-6 text-primary" />,
    },
    {
      title: "Rapid Agent Onboarding",
      description: "Reduce new agent training from 8 weeks to 2 weeks. Every new hire can reply like a 5-year veteran from day one.",
      icon: <Zap className="w-6 h-6 text-primary" />,
    },
    {
      title: "Transparent ROI",
      description: "No 'Resolution Tax'. No hidden fees. Pay a predictable per-seat price and save 60% on average handle time.",
      icon: <BarChart3 className="w-6 h-6 text-primary" />,
    },
  ];

  return (
    <section id="features" className="py-24 bg-slate-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
            Built for Technical Support Teams
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Stop forcing your agents to hunt for answers across silos. GlideReply brings the answer to them.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, i) => (
            <div key={i} className="p-8 bg-white rounded-xl border border-slate-200 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-primary-light rounded-lg flex items-center justify-center mb-6">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
              <p className="text-slate-600 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}