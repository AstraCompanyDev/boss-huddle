import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import upfounderLogo from "@/assets/upfounder-logo.jpg";
import {
  Target,
  Users,
  MessageSquare,
  TrendingUp,
  CheckCircle,
  ArrowRight,
  Zap,
  Shield,
  BarChart3,
  Star,
} from "lucide-react";

const stats = [
  { value: "500+", label: "Entrepreneurs" },
  { value: "2,400+", label: "Goals Achieved" },
  { value: "98%", label: "Retention Rate" },
  { value: "12x", label: "Avg Growth" },
];

const features = [
  {
    icon: Target,
    title: "Goal Tracking",
    description:
      "Set, track, and crush your business goals with milestone-based progress tracking.",
  },
  {
    icon: Users,
    title: "Accountability Groups",
    description:
      "Get paired with driven founders who keep you on track and push you forward.",
  },
  {
    icon: MessageSquare,
    title: "Real-Time Messaging",
    description:
      "Channel-based messaging to share wins, ask questions, and stay connected.",
  },
  {
    icon: BarChart3,
    title: "Progress Analytics",
    description:
      "Visual dashboards showing your streaks, milestones, and growth over time.",
  },
  {
    icon: Zap,
    title: "Weekly Sprints",
    description:
      "Structured weekly check-ins to maintain momentum and celebrate progress.",
  },
  {
    icon: Shield,
    title: "Private & Secure",
    description:
      "Your data stays yours. Enterprise-grade security for all your business intel.",
  },
];

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Founder, NovaTech",
    quote:
      "Upfounder completely changed how I approach my business. The accountability factor alone 10x'd my output.",
    rating: 5,
  },
  {
    name: "Marcus Johnson",
    role: "CEO, GrowthLab",
    quote:
      "I went from scattered ideas to a focused roadmap in my first week. The community here is unmatched.",
    rating: 5,
  },
  {
    name: "Elena Rodriguez",
    role: "Co-Founder, Artisana",
    quote:
      "Finally a platform built by founders, for founders. No fluff—just results and real connections.",
    rating: 5,
  },
];

const pricingPlans = [
  {
    name: "Starter",
    price: "Free",
    period: "forever",
    description: "Perfect for exploring accountability",
    features: [
      "Join 1 accountability group",
      "Basic goal tracking",
      "Community messaging",
      "Weekly check-ins",
    ],
    cta: "Get Started Free",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$99",
    period: "/month",
    description: "For serious founders ready to scale",
    features: [
      "Unlimited accountability groups",
      "Advanced goal analytics",
      "Priority matching",
      "File sharing & storage",
      "Direct messaging",
      "Custom milestones",
    ],
    cta: "Start 30-Day Free Trial",
    highlighted: true,
  },
  {
    name: "Team",
    price: "$249",
    period: "/month",
    description: "For founding teams building together",
    features: [
      "Everything in Pro",
      "Up to 10 team members",
      "Team dashboards",
      "Admin controls",
      "Priority support",
      "Custom integrations",
    ],
    cta: "Contact Sales",
    highlighted: false,
  },
];

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[hsl(220,20%,4%)] text-[hsl(0,0%,95%)]">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-[hsl(220,14%,12%)] bg-[hsl(220,20%,4%)]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img
              src={upfounderLogo}
              alt="Upfounder"
              className="h-8 w-8 rounded-lg"
            />
            <span className="text-lg font-bold tracking-tight">Upfounder</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-[hsl(220,10%,55%)]">
            <a href="#features" className="hover:text-[hsl(0,0%,95%)] transition-colors">Features</a>
            <a href="#testimonials" className="hover:text-[hsl(0,0%,95%)] transition-colors">Testimonials</a>
            <a href="#pricing" className="hover:text-[hsl(0,0%,95%)] transition-colors">Pricing</a>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              className="text-[hsl(220,10%,55%)] hover:text-[hsl(0,0%,95%)] hover:bg-[hsl(220,14%,12%)]"
              onClick={() => navigate("/auth")}
            >
              Sign In
            </Button>
            <Button
              className="bg-[hsl(0,0%,100%)] text-[hsl(220,20%,4%)] hover:bg-[hsl(0,0%,90%)] font-semibold rounded-full px-5"
              onClick={() => navigate("/auth")}
            >
              Get Started
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-8 rounded-full border border-[hsl(220,14%,18%)] bg-[hsl(220,14%,8%)] text-sm text-[hsl(220,10%,55%)]">
            <Zap className="h-3.5 w-3.5 text-[hsl(38,92%,50%)]" />
            Built for founders who ship
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight leading-[1.08] mb-6">
            Where founders hold
            <br />
            each other{" "}
            <span className="bg-gradient-to-r from-[hsl(208,52%,58%)] to-[hsl(38,92%,50%)] bg-clip-text text-transparent">
              accountable.
            </span>
          </h1>

          <p className="text-lg md:text-xl text-[hsl(220,10%,55%)] max-w-2xl mx-auto mb-10 leading-relaxed">
            Join a community of driven entrepreneurs who set ambitious goals,
            track real progress, and push each other to build faster.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Button
              size="lg"
              className="bg-[hsl(0,0%,100%)] text-[hsl(220,20%,4%)] hover:bg-[hsl(0,0%,90%)] font-semibold rounded-full px-8 h-12 text-base"
              onClick={() => navigate("/auth")}
            >
              Start Free Trial
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button
              size="lg"
              variant="ghost"
              className="text-[hsl(220,10%,55%)] hover:text-[hsl(0,0%,95%)] hover:bg-[hsl(220,14%,12%)] rounded-full px-8 h-12 text-base"
              onClick={() => {
                document.getElementById("features")?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              See How It Works
            </Button>
          </div>

          {/* Stats ticker */}
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12 text-sm">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-2xl md:text-3xl font-bold text-[hsl(0,0%,95%)]">
                  {stat.value}
                </p>
                <p className="text-[hsl(220,10%,45%)] mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-6 border-t border-[hsl(220,14%,10%)]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              Everything you need to stay on track
            </h2>
            <p className="text-[hsl(220,10%,50%)] text-lg max-w-xl mx-auto">
              Built specifically for founders who are serious about growth.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((feature) => (
              <Card
                key={feature.title}
                className="bg-[hsl(220,16%,8%)] border-[hsl(220,14%,14%)] hover:border-[hsl(220,14%,22%)] transition-colors group"
              >
                <CardContent className="p-6">
                  <div className="w-10 h-10 rounded-xl bg-[hsl(220,14%,14%)] flex items-center justify-center mb-4 group-hover:bg-[hsl(208,52%,58%)]/10 transition-colors">
                    <feature.icon className="h-5 w-5 text-[hsl(208,52%,58%)]" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2 text-[hsl(0,0%,95%)]">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-[hsl(220,10%,50%)] leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-24 px-6 border-t border-[hsl(220,14%,10%)]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              Founders who ship, together
            </h2>
            <p className="text-[hsl(220,10%,50%)] text-lg">
              Hear from entrepreneurs already building with Upfounder.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {testimonials.map((t) => (
              <Card
                key={t.name}
                className="bg-[hsl(220,16%,8%)] border-[hsl(220,14%,14%)]"
              >
                <CardContent className="p-6">
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 fill-[hsl(38,92%,50%)] text-[hsl(38,92%,50%)]"
                      />
                    ))}
                  </div>
                  <p className="text-[hsl(220,10%,70%)] text-sm leading-relaxed mb-5 italic">
                    "{t.quote}"
                  </p>
                  <div>
                    <p className="text-sm font-semibold text-[hsl(0,0%,95%)]">{t.name}</p>
                    <p className="text-xs text-[hsl(220,10%,45%)]">{t.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 px-6 border-t border-[hsl(220,14%,10%)]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              Simple, transparent pricing
            </h2>
            <p className="text-[hsl(220,10%,50%)] text-lg">
              Start free. Upgrade when you're ready to go all in.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {pricingPlans.map((plan) => (
              <Card
                key={plan.name}
                className={`relative overflow-hidden ${
                  plan.highlighted
                    ? "bg-[hsl(220,16%,10%)] border-[hsl(208,52%,58%)] border-2"
                    : "bg-[hsl(220,16%,8%)] border-[hsl(220,14%,14%)]"
                }`}
              >
                {plan.highlighted && (
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[hsl(208,52%,58%)] to-[hsl(38,92%,50%)]" />
                )}
                <CardContent className="p-6">
                  <p className="text-sm font-medium text-[hsl(220,10%,55%)] mb-1">
                    {plan.name}
                  </p>
                  <div className="flex items-baseline gap-1 mb-2">
                    <span className="text-4xl font-bold text-[hsl(0,0%,95%)]">
                      {plan.price}
                    </span>
                    {plan.period !== "forever" && (
                      <span className="text-[hsl(220,10%,45%)] text-sm">
                        {plan.period}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-[hsl(220,10%,45%)] mb-6">
                    {plan.description}
                  </p>

                  <Button
                    className={`w-full rounded-full font-semibold mb-6 ${
                      plan.highlighted
                        ? "bg-[hsl(0,0%,100%)] text-[hsl(220,20%,4%)] hover:bg-[hsl(0,0%,90%)]"
                        : "bg-[hsl(220,14%,16%)] text-[hsl(0,0%,90%)] hover:bg-[hsl(220,14%,22%)]"
                    }`}
                    onClick={() => navigate("/auth")}
                  >
                    {plan.cta}
                  </Button>

                  <ul className="space-y-3">
                    {plan.features.map((f) => (
                      <li
                        key={f}
                        className="flex items-start gap-2 text-sm text-[hsl(220,10%,60%)]"
                      >
                        <CheckCircle className="h-4 w-4 mt-0.5 text-[hsl(208,52%,58%)] shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 border-t border-[hsl(220,14%,10%)]">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Ready to build with accountability?
          </h2>
          <p className="text-[hsl(220,10%,50%)] text-lg mb-8">
            Join hundreds of founders already shipping faster together.
          </p>
          <Button
            size="lg"
            className="bg-[hsl(0,0%,100%)] text-[hsl(220,20%,4%)] hover:bg-[hsl(0,0%,90%)] font-semibold rounded-full px-10 h-12 text-base"
            onClick={() => navigate("/auth")}
          >
            Get Started Free
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-6 border-t border-[hsl(220,14%,10%)]">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <img
              src={upfounderLogo}
              alt="Upfounder"
              className="h-6 w-6 rounded"
            />
            <span className="text-sm font-semibold">Upfounder</span>
          </div>
          <p className="text-xs text-[hsl(220,10%,35%)]">
            © {new Date().getFullYear()} Upfounder. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
