import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { FadeIn } from "@/hooks/useScrollFadeIn";
import { Zap, Check, Loader2, Sparkles, Users, Rocket } from "lucide-react";
import upfounderLogo from "@/assets/upfounder-logo.jpg";

const signupSchema = z.object({
  name: z.string().trim().min(1, "Please enter your name").max(100, "Name must be under 100 characters"),
  email: z.string().trim().email("Please enter a valid email address").max(255, "Email must be under 255 characters"),
  business_bio: z.string().trim().min(1, "Tell us a little about your business").max(1000, "Please keep it under 1000 characters"),
});

const perks = [
  {
    icon: Rocket,
    title: "12 months free",
    text: "A full year of UpFounder Premium on us — no card, no catch.",
  },
  {
    icon: Users,
    title: "Founding member status",
    text: "A permanent Founding 500 badge on your profile and priority access to new features.",
  },
  {
    icon: Sparkles,
    title: "Shape the platform",
    text: "Direct line to the team — your feedback decides what we build next.",
  },
];

export default function Founding500() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", business_bio: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const parsed = signupSchema.safeParse(form);
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      parsed.error.issues.forEach((issue) => {
        const field = issue.path[0] as string;
        if (!fieldErrors[field]) fieldErrors[field] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setLoading(true);
    const { error } = await supabase.from("founding_500_signups").insert({
      name: parsed.data.name,
      email: parsed.data.email,
      business_bio: parsed.data.business_bio,
    });
    setLoading(false);

    if (error) {
      toast({
        title: "Something went wrong",
        description: "Please try again in a moment.",
        variant: "destructive",
      });
      return;
    }

    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[hsl(0,0%,100%)] text-[hsl(0,0%,10%)] font-['Inter',sans-serif]">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-[hsl(0,0%,90%)] bg-[hsl(0,0%,100%)]/80 backdrop-blur-xl">
        <div className="max-w-[1400px] mx-auto px-5 h-16 flex items-center justify-between">
          <button onClick={() => navigate("/")} className="flex items-center">
            <img src={upfounderLogo} alt="Upfounder" className="h-8 rounded-lg" />
          </button>
          <Button
            variant="ghost"
            className="text-[hsl(0,0%,42%)] hover:text-[hsl(0,0%,0%)] hover:bg-[hsl(0,0%,96%)] font-medium"
            onClick={() => navigate("/")}
          >
            Back to site
          </Button>
        </div>
      </nav>

      {/* Hero + Form */}
      <section className="pt-32 pb-24 px-5 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,hsl(210,100%,95%),transparent)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_80%_80%,hsl(38,90%,95%),transparent)]" />

        <FadeIn className="max-w-6xl mx-auto relative">
          <div className="grid lg:grid-cols-2 gap-14 items-center">
            {/* Left: pitch */}
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-8 rounded-full border border-[hsl(0,0%,90%)] bg-[hsl(0,0%,96%)] text-sm font-medium text-[hsl(0,0%,42%)]">
                <Zap className="h-3.5 w-3.5 text-[hsl(38,92%,50%)]" />
                Limited to the first 500 founders
              </div>
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-[1.05] mb-6">
                Join the{" "}
                <span className="text-[hsl(210,100%,50%)]">Founding 500</span>{" "}
                of UpFounder
              </h1>
              <p className="text-lg md:text-xl text-[hsl(0,0%,42%)] leading-relaxed mb-10 max-w-xl">
                Be one of the first 500 founders inside UpFounder and get{" "}
                <span className="font-semibold text-[hsl(0,0%,10%)]">
                  12 months of free coverage
                </span>{" "}
                with the network — accountability groups, expert sessions, and a
                community that ships.
              </p>

              <div className="space-y-5">
                {perks.map((perk) => (
                  <div key={perk.title} className="flex items-start gap-4">
                    <div className="shrink-0 w-11 h-11 rounded-2xl bg-[hsl(210,100%,96%)] flex items-center justify-center">
                      <perk.icon className="h-5 w-5 text-[hsl(210,100%,50%)]" />
                    </div>
                    <div>
                      <p className="font-semibold">{perk.title}</p>
                      <p className="text-sm text-[hsl(0,0%,42%)]">{perk.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: form card */}
            <div className="rounded-2xl border border-[hsl(0,0%,90%)] bg-[hsl(0,0%,100%)] shadow-xl p-8 md:p-10">
              {submitted ? (
                <div className="text-center py-10">
                  <div className="w-16 h-16 rounded-full bg-[hsl(210,100%,50%)] flex items-center justify-center mx-auto mb-6">
                    <Check className="h-8 w-8 text-[hsl(0,0%,100%)]" />
                  </div>
                  <h2 className="text-2xl font-bold mb-3">You're in!</h2>
                  <p className="text-[hsl(0,0%,42%)] leading-relaxed mb-8">
                    Welcome to the Founding 500. We'll be in touch shortly with
                    your 12 months of free access to the UpFounder network.
                  </p>
                  <Button
                    className="bg-[hsl(38,92%,50%)] text-[hsl(0,0%,100%)] hover:bg-[hsl(38,92%,45%)] font-semibold rounded-full px-8"
                    onClick={() => navigate("/")}
                  >
                    Back to UpFounder
                  </Button>
                </div>
              ) : (
                <>
                  <h2 className="text-2xl font-bold mb-2">Claim your spot</h2>
                  <p className="text-sm text-[hsl(0,0%,42%)] mb-8">
                    Tell us who you are and what you're building.
                  </p>
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full name*</Label>
                      <Input
                        id="name"
                        placeholder="Jane Smith"
                        value={form.name}
                        onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                        className="rounded-xl"
                        maxLength={100}
                      />
                      {errors.name && <p className="text-xs text-red-600">{errors.name}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email*</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="jane@yourstartup.com"
                        value={form.email}
                        onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                        className="rounded-xl"
                        maxLength={255}
                      />
                      {errors.email && <p className="text-xs text-red-600">{errors.email}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="business_bio">About your business*</Label>
                      <Textarea
                        id="business_bio"
                        placeholder="What are you building, who is it for, and where are you in the journey?"
                        rows={4}
                        value={form.business_bio}
                        onChange={(e) => setForm((f) => ({ ...f, business_bio: e.target.value }))}
                        className="rounded-xl"
                        maxLength={1000}
                      />
                      {errors.business_bio && <p className="text-xs text-red-600">{errors.business_bio}</p>}
                    </div>
                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-[hsl(38,92%,50%)] text-[hsl(0,0%,100%)] hover:bg-[hsl(38,92%,45%)] font-semibold rounded-full"
                      size="lg"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Securing your spot...
                        </>
                      ) : (
                        "Get 12 months free"
                      )}
                    </Button>
                    <p className="text-xs text-center text-[hsl(0,0%,55%)]">
                      No credit card required. Spots are limited to the first 500 signups.
                    </p>
                  </form>
                </>
              )}
            </div>
          </div>
        </FadeIn>
      </section>
    </div>
  );
}
