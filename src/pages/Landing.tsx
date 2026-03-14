import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import upfounderLogo from "@/assets/upfounder-logo.jpg";
import featureGoalTracking from "@/assets/feature-goal-tracking.jpg";
import featureLiveSessions from "@/assets/feature-live-sessions.jpg";
import featureExpertAdvice from "@/assets/feature-expert-advice.jpg";
import featureInvestorSessions from "@/assets/feature-investor-sessions.jpg";
import bannerAccountability from "@/assets/banner-accountability.jpg";
import bannerResources from "@/assets/banner-resources.jpg";
import avatar1 from "@/assets/avatar-1.jpg";
import avatar2 from "@/assets/avatar-2.jpg";
import avatar3 from "@/assets/avatar-3.jpg";
import avatar4 from "@/assets/avatar-4.jpg";
import avatar5 from "@/assets/avatar-5.jpg";

const founderAvatars = [avatar1, avatar2, avatar3, avatar4, avatar5];
import {
  Target,
  Users,
  MessageSquare,
  CheckCircle,
  ArrowRight,
  Zap,
  Shield,
  BarChart3,
  Star,
} from "lucide-react";

/*
  Palette (all as HSL):
  #000000  → 0 0% 0%
  #FFFFFF  → 0 0% 100%
  #1A1A1A  → 0 0% 10%
  #6B6B6B  → 0 0% 42%
  #F5F5F5  → 0 0% 96%
*/

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
    image: featureGoalTracking,
  },
  {
    icon: Users,
    title: "Weekly Live Sessions",
    description:
      "Join live group sessions every week to share progress, get feedback, and stay motivated.",
    image: featureLiveSessions,
  },
  {
    icon: Star,
    title: "Expert Advice",
    description:
      "Get guidance from experienced founders and mentors who've built and scaled businesses.",
    image: featureExpertAdvice,
  },
  {
    icon: BarChart3,
    title: "Investor Sessions",
    description:
      "Pitch your ideas, get feedback, and connect directly with active investors.",
    image: featureInvestorSessions,
  },
];

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Founder, NovaTech",
    quote:
      "Upfounder completely changed how I approach my business. The accountability factor alone 10x'd my output.",
    rating: 5,
    avatar: avatar1,
  },
  {
    name: "Marcus Johnson",
    role: "CEO, GrowthLab",
    quote:
      "I went from scattered ideas to a focused roadmap in my first week. The community here is unmatched.",
    rating: 5,
    avatar: avatar2,
  },
  {
    name: "Elena Rodriguez",
    role: "Co-Founder, Artisana",
    quote:
      "Finally a platform built by founders, for founders. No fluff—just results and real connections.",
    rating: 5,
    avatar: avatar3,
  },
];

const pricingPlans = [
  {
    name: "Freemium",
    price: "Free",
    period: "",
    description: "30 days FREE access to Premium features",
    features: [
      "Full platform access for 30 days",
      "Goal tracking & milestones",
      "Weekly live sessions",
      "Community messaging",
      "Expert advice sessions",
    ],
    cta: "Start Free Trial",
    gradient: "bg-gradient-to-br from-[hsl(210,100%,97%)] via-[hsl(210,60%,95%)] to-[hsl(230,80%,96%)]",
    border: "border-[hsl(210,60%,88%)]",
    highlighted: false,
  },
  {
    name: "Premium",
    price: "$99",
    period: "/month",
    description: "For serious founders ready to scale",
    features: [
      "Everything in Freemium",
      "Unlimited accountability groups",
      "Advanced goal analytics",
      "Investor session access",
      "Priority matching & support",
      "File sharing & storage",
    ],
    cta: "Get Premium",
    gradient: "bg-gradient-to-br from-[hsl(0,0%,8%)] via-[hsl(230,20%,15%)] to-[hsl(260,30%,12%)]",
    border: "border-[hsl(0,0%,20%)]",
    highlighted: true,
  },
];

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[hsl(0,0%,100%)] text-[hsl(0,0%,10%)] font-['Inter',sans-serif]">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-[hsl(0,0%,90%)] bg-[hsl(0,0%,100%)]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center">
            <img
              src={upfounderLogo}
              alt="Upfounder"
              className="h-8 rounded-lg"
            />
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-[hsl(0,0%,42%)]">
            <a href="#features" className="hover:text-[hsl(0,0%,0%)] transition-colors">Features</a>
            <a href="#testimonials" className="hover:text-[hsl(0,0%,0%)] transition-colors">Testimonials</a>
            <a href="#pricing" className="hover:text-[hsl(0,0%,0%)] transition-colors">Pricing</a>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              className="text-[hsl(0,0%,42%)] hover:text-[hsl(0,0%,0%)] hover:bg-[hsl(0,0%,96%)] font-medium"
              onClick={() => navigate("/auth")}
            >
              Sign In
            </Button>
            <Button
              className="bg-[hsl(38,92%,50%)] text-[hsl(0,0%,100%)] hover:bg-[hsl(38,92%,45%)] font-semibold rounded-full px-5"
              onClick={() => navigate("/auth")}
            >
              Get Started
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6 relative overflow-hidden">
        {/* Subtle radial gradient texture */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,hsl(210,100%,95%),transparent)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_80%_80%,hsl(38,90%,95%),transparent)]" />
        <div className="max-w-4xl mx-auto text-center relative">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-8 rounded-full border border-[hsl(0,0%,90%)] bg-[hsl(0,0%,96%)] text-sm font-medium text-[hsl(0,0%,42%)]">
            <Zap className="h-3.5 w-3.5 text-[hsl(0,0%,0%)]" />
            Built for founders who ship
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight leading-[1.08] mb-6 text-[hsl(0,0%,0%)]">
            Where founders hold
            <br />
            each other{" "}
            <span className="text-[hsl(0,0%,42%)]">
              accountable.
            </span>
          </h1>

          <p className="text-lg md:text-xl text-[hsl(0,0%,42%)] max-w-2xl mx-auto mb-10 leading-relaxed">
            Join a community of driven entrepreneurs who set ambitious goals,
            track real progress, and push each other to build faster.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Button
              size="lg"
              className="bg-[hsl(210,100%,50%)] text-[hsl(0,0%,100%)] hover:bg-[hsl(210,100%,42%)] font-semibold rounded-full px-8 h-12 text-base"
              onClick={() => navigate("/auth")}
            >
              Start Free Trial
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button
              size="lg"
              variant="ghost"
              className="text-[hsl(0,0%,42%)] hover:text-[hsl(0,0%,0%)] hover:bg-[hsl(0,0%,96%)] rounded-full px-8 h-12 text-base font-medium"
              onClick={() => {
                document.getElementById("features")?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              See How It Works
            </Button>
          </div>

          {/* Social proof avatars */}
          <div className="flex items-center justify-center gap-3 mb-16">
            <div className="flex -space-x-3">
              {founderAvatars.map((avatar, i) => (
                <img
                  key={i}
                  src={avatar}
                  alt="Founder"
                  className="w-9 h-9 rounded-full border-2 border-[hsl(0,0%,100%)] object-cover"
                />
              ))}
            </div>
            <p className="text-sm text-[hsl(0,0%,42%)] font-medium">
              Join <span className="text-[hsl(0,0%,0%)] font-semibold">hundreds</span> of other founders
            </p>
          </div>

          {/* Stats ticker */}
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12 text-sm">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-2xl md:text-3xl font-bold text-[hsl(0,0%,0%)]">
                  {stat.value}
                </p>
                <p className="text-[hsl(0,0%,42%)] mt-1 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-6 border-t border-[hsl(0,0%,92%)]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 text-[hsl(0,0%,0%)]">
              Everything you need to stay on track
            </h2>
            <p className="text-[hsl(0,0%,42%)] text-lg max-w-xl mx-auto">
              Built specifically for founders who are serious about growth.
            </p>
          </div>

          {/* Top row — 2 large banner cards */}
          <div className="grid md:grid-cols-2 gap-5 mb-5">
            <div className="relative rounded-2xl overflow-hidden h-56 group cursor-pointer">
              <img
                src={bannerAccountability}
                alt="Ultimate Accountability"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-[hsl(0,0%,0%)]/40" />
              <div className="absolute bottom-0 left-0 p-6">
                <div className="flex items-center gap-2 mb-1">
                  <img src={upfounderLogo} alt="" className="h-6 w-6 rounded" />
                  <h3 className="text-lg font-bold text-[hsl(0,0%,100%)]">
                    Ultimate Accountability
                  </h3>
                  <ArrowRight className="h-4 w-4 text-[hsl(0,0%,100%)]" />
                </div>
                <p className="text-sm text-[hsl(0,0%,85%)]">
                  Stay on track with founders who hold you to your word
                </p>
              </div>
            </div>
            <div className="relative rounded-2xl overflow-hidden h-56 group cursor-pointer">
              <img
                src={bannerResources}
                alt="All the resources you need"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-[hsl(0,0%,0%)]/40" />
              <div className="absolute bottom-0 left-0 p-6">
                <div className="flex items-center gap-2 mb-1">
                  <img src={upfounderLogo} alt="" className="h-6 w-6 rounded" />
                  <h3 className="text-lg font-bold text-[hsl(0,0%,100%)]">
                    All The Resources You Need
                  </h3>
                  <ArrowRight className="h-4 w-4 text-[hsl(0,0%,100%)]" />
                </div>
                <p className="text-sm text-[hsl(0,0%,85%)]">
                  Tools, templates, and community to build your business
                </p>
              </div>
            </div>
          </div>

          {/* Bottom row — 4 feature cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map((feature) => (
              <Card
                key={feature.title}
                className="bg-[hsl(0,0%,96%)] border-[hsl(0,0%,90%)] hover:border-[hsl(0,0%,80%)] transition-colors group overflow-hidden rounded-2xl"
              >
                <div className="w-full h-36 overflow-hidden">
                  <img
                    src={feature.image}
                    alt={feature.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <CardContent className="p-5">
                  <div className="w-9 h-9 rounded-lg bg-[hsl(0,0%,100%)] border border-[hsl(0,0%,90%)] flex items-center justify-center mb-3 group-hover:bg-[hsl(0,0%,0%)] group-hover:border-[hsl(0,0%,0%)] transition-colors">
                    <feature.icon className="h-4 w-4 text-[hsl(0,0%,10%)] group-hover:text-[hsl(0,0%,100%)] transition-colors" />
                  </div>
                  <h3 className="text-base font-semibold mb-1 text-[hsl(0,0%,0%)]">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-[hsl(0,0%,42%)] leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Built by Founders */}
      <section className="py-24 px-6 border-t border-[hsl(0,0%,92%)]">
        <div className="max-w-7xl mx-auto">
          <div className="bg-[hsl(0,0%,96%)] rounded-2xl border border-[hsl(0,0%,90%)] overflow-hidden grid md:grid-cols-5">
            <div className="md:col-span-2 overflow-hidden">
              <video
                src="/videos/founder-video.mp4"
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover min-h-[320px]"
                ref={(el) => {
                  if (!el) return;
                  const startTime = 2;
                  const endTime = el.duration ? el.duration - 2 : 0;
                  el.currentTime = startTime;
                  const handleTimeUpdate = () => {
                    if (el.currentTime >= endTime && endTime > startTime) {
                      el.currentTime = startTime;
                    }
                  };
                  el.addEventListener("timeupdate", handleTimeUpdate);
                  el.addEventListener("loadedmetadata", () => {
                    el.currentTime = startTime;
                  });
                }}
              />
            </div>
            <div className="md:col-span-3 flex flex-col justify-center p-10 md:p-16">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 text-[hsl(0,0%,0%)]">
                Built by founders,
                <br />
                for founders
              </h2>
              <p className="text-[hsl(0,0%,42%)] leading-relaxed max-w-lg">
                We believe founders grow fastest when they're surrounded by other
                ambitious builders. Upfounder was created to give entrepreneurs the
                structure, community, and accountability they need to turn big ideas
                into real results — no fluff, just action.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-24 px-6 border-t border-[hsl(0,0%,92%)] bg-[hsl(0,0%,96%)]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 text-[hsl(0,0%,0%)]">
              Founders who ship, together
            </h2>
            <p className="text-[hsl(0,0%,42%)] text-lg">
              Hear from entrepreneurs already building with Upfounder.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {testimonials.map((t) => (
              <Card
                key={t.name}
                className="bg-[hsl(0,0%,100%)] border-[hsl(0,0%,90%)] rounded-2xl"
              >
                <CardContent className="p-6">
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 fill-[hsl(0,0%,0%)] text-[hsl(0,0%,0%)]"
                      />
                    ))}
                  </div>
                  <p className="text-[hsl(0,0%,42%)] text-sm leading-relaxed mb-5 italic">
                    "{t.quote}"
                  </p>
                  <div className="flex items-center gap-3">
                    <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full object-cover" />
                    <div>
                      <p className="text-sm font-semibold text-[hsl(0,0%,0%)]">{t.name}</p>
                      <p className="text-xs text-[hsl(0,0%,42%)]">{t.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 px-6 border-t border-[hsl(0,0%,92%)]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 text-[hsl(0,0%,0%)]">
              Simple, transparent pricing
            </h2>
            <p className="text-[hsl(0,0%,42%)] text-lg">
              Start free. Upgrade when you're ready to go all in.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {pricingPlans.map((plan) => (
              <Card
                key={plan.name}
                className={`relative overflow-hidden rounded-2xl ${plan.gradient} ${plan.border} ${
                  plan.highlighted ? "text-[hsl(0,0%,100%)]" : ""
                }`}
              >
                <CardContent className="p-8">
                  <p className={`text-sm font-medium mb-1 ${plan.highlighted ? "text-[hsl(0,0%,70%)]" : "text-[hsl(0,0%,42%)]"}`}>
                    {plan.name}
                  </p>
                  <div className="flex items-baseline gap-1 mb-2">
                    <span className={`text-4xl font-bold ${plan.highlighted ? "text-[hsl(0,0%,100%)]" : "text-[hsl(0,0%,0%)]"}`}>
                      {plan.price}
                    </span>
                    {plan.period && (
                      <span className={`text-sm ${plan.highlighted ? "text-[hsl(0,0%,60%)]" : "text-[hsl(0,0%,42%)]"}`}>
                        {plan.period}
                      </span>
                    )}
                  </div>
                  <p className={`text-sm mb-6 ${plan.highlighted ? "text-[hsl(0,0%,60%)]" : "text-[hsl(0,0%,42%)]"}`}>
                    {plan.description}
                  </p>

                  <Button
                    className={`w-full rounded-full font-semibold mb-6 ${
                      plan.highlighted
                        ? "bg-[hsl(38,92%,50%)] text-[hsl(0,0%,100%)] hover:bg-[hsl(38,92%,45%)]"
                        : "bg-[hsl(210,100%,50%)] text-[hsl(0,0%,100%)] hover:bg-[hsl(210,100%,42%)]"
                    }`}
                    onClick={() => navigate("/auth")}
                  >
                    {plan.cta}
                  </Button>

                  <ul className="space-y-3">
                    {plan.features.map((f) => (
                      <li
                        key={f}
                        className={`flex items-start gap-2 text-sm ${plan.highlighted ? "text-[hsl(0,0%,70%)]" : "text-[hsl(0,0%,42%)]"}`}
                      >
                        <CheckCircle className={`h-4 w-4 mt-0.5 shrink-0 ${plan.highlighted ? "text-[hsl(0,0%,100%)]" : "text-[hsl(0,0%,0%)]"}`} />
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
      <section className="py-24 px-6 border-t border-[hsl(0,0%,92%)] bg-[hsl(0,0%,0%)]">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 text-[hsl(0,0%,100%)]">
            Ready to build with accountability?
          </h2>
          <p className="text-[hsl(0,0%,60%)] text-lg mb-8">
            Join hundreds of founders already shipping faster together.
          </p>
          <Button
            size="lg"
            className="bg-[hsl(38,92%,50%)] text-[hsl(0,0%,100%)] hover:bg-[hsl(38,92%,45%)] font-semibold rounded-full px-10 h-12 text-base"
            onClick={() => navigate("/auth")}
          >
            Get Started Free
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-6 border-t border-[hsl(0,0%,90%)]">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center">
            <img
              src={upfounderLogo}
              alt="Upfounder"
              className="h-6 rounded"
            />
          </div>
          <p className="text-xs text-[hsl(0,0%,42%)]">
            © {new Date().getFullYear()} Upfounder. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
