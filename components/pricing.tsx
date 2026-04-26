import { Check } from "lucide-react";

export function Pricing() {
  const tiers = [
    {
      name: "Starter",
      price: "$49",
      description: "Perfect for small teams getting started with AI.",
      features: [
        "Zendesk/Intercom integration",
        "Help Center RAG",
        "500 drafts per month",
        "Basic tone matching",
      ],
      cta: "Join Waitlist",
    },
    {
      name: "Growth",
      price: "$89",
      description: "For teams that need deep technical accuracy.",
      features: [
        "Everything in Starter",
        "Cross-Source RAG (Slack/Jira)",
        "Unlimited drafts",
        "Custom knowledge base indexing",
      ],
      cta: "Join Waitlist",
      popular: true,
    },
    {
      name: "Enterprise",
      price: "Custom",
      description: "Scale with security and dedicated support.",
      features: [
        "Dedicated LLM instance",
        "SOC2 Type II compliance",
        "SSO & RBAC",
        "Priority engineering support",
      ],
      cta: "Contact Sales",
    },
  ];

  return (
    <section id="pricing" className="py-24">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
            Predictable Pricing, No Resolution Tax
          </h2>
          <p className="text-lg text-slate-600">
            Choose the plan that fits your team size and data complexity.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {tiers.map((tier, i) => (
            <div 
              key={i} 
              className={`relative p-8 rounded-2xl border ${
                tier.popular ? "border-primary shadow-xl scale-105 z-10" : "border-slate-200"
              } bg-white`}
            >
              {tier.popular && (
                <div className="absolute top-0 right-8 -translate-y-1/2 bg-primary text-white text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                  Most Popular
                </div>
              )}
              <h3 className="text-xl font-bold text-slate-900 mb-2">{tier.name}</h3>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-4xl font-bold text-slate-900">{tier.price}</span>
                {tier.price !== "Custom" && <span className="text-slate-500">/agent/mo</span>}
              </div>
              <p className="text-slate-600 mb-8 text-sm">{tier.description}</p>
              <ul className="space-y-4 mb-10">
                {tier.features.map((feature, j) => (
                  <li key={j} className="flex gap-3 text-sm text-slate-600">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
              <a 
                href="#waitlist"
                className={`block w-full text-center py-3 rounded-lg font-semibold transition-colors ${
                  tier.popular 
                    ? "bg-primary text-white hover:bg-primary-dark" 
                    : "bg-slate-100 text-slate-900 hover:bg-slate-200"
                }`}
              >
                {tier.cta}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}