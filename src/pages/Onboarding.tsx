import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Check, Loader2, Rocket, Target, Zap } from "lucide-react";

export default function Onboarding() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    company: "",
    role: "",
    bio: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.bio) {
      toast({
        title: "Required fields",
        description: "Please fill out your name and tell us what you're building",
        variant: "destructive",
      });
      return;
    }
    setStep(2);
  };

  const handleCompleteOnboarding = async () => {
    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: formData.fullName,
          company: formData.company,
          role: formData.role,
          bio: formData.bio,
        })
        .eq("id", user.id);

      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      toast({
        title: "Welcome to Boss Huddle! 🎉",
        description: "Your 30-day free trial has started",
      });

      navigate("/dashboard");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/20 via-background to-accent/20 p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            {step === 1 ? (
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Rocket className="h-8 w-8 text-primary" />
              </div>
            ) : (
              <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center">
                <Zap className="h-8 w-8 text-accent" />
              </div>
            )}
          </div>
          <CardTitle className="text-3xl font-bold">
            {step === 1 ? "Tell Us About Yourself" : "Start Your Free Trial"}
          </CardTitle>
          <CardDescription>
            {step === 1 
              ? "Help us personalize your experience" 
              : "Get 30 days free, then $99/month"}
          </CardDescription>
          
          {/* Progress indicator */}
          <div className="flex items-center justify-center space-x-2 mt-6">
            <div className={`w-3 h-3 rounded-full ${step >= 1 ? 'bg-primary' : 'bg-muted'}`} />
            <div className="w-8 h-0.5 bg-muted" />
            <div className={`w-3 h-3 rounded-full ${step >= 2 ? 'bg-primary' : 'bg-muted'}`} />
          </div>
        </CardHeader>

        <CardContent>
          {step === 1 ? (
            <form onSubmit={handleStep1Submit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name*</Label>
                <Input
                  id="fullName"
                  placeholder="John Smith"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange("fullName", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="company">Company / Project Name (Optional)</Label>
                <Input
                  id="company"
                  placeholder="Acme Inc."
                  value={formData.company}
                  onChange={(e) => handleInputChange("company", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Your Role (Optional)</Label>
                <Input
                  id="role"
                  placeholder="Founder & CEO"
                  value={formData.role}
                  onChange={(e) => handleInputChange("role", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">What are you building?*</Label>
                <Textarea
                  id="bio"
                  placeholder="Tell us about your project, your goals, and what you're trying to achieve..."
                  rows={4}
                  value={formData.bio}
                  onChange={(e) => handleInputChange("bio", e.target.value)}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  This helps us match you with the right accountability partners
                </p>
              </div>

              <Button type="submit" className="w-full" size="lg">
                Continue to Trial
              </Button>
            </form>
          ) : (
            <div className="space-y-8">
              {/* Pricing Display */}
              <div className="text-center p-8 bg-gradient-to-br from-primary/5 to-accent/5 rounded-xl border-2 border-primary/20">
                <div className="inline-flex items-baseline space-x-2 mb-4">
                  <span className="text-5xl font-bold">$99</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                <div className="inline-flex items-center space-x-2 px-4 py-2 bg-accent/10 text-accent rounded-full font-semibold mb-6">
                  <Zap className="h-4 w-4" />
                  <span>30 Days Free Trial</span>
                </div>
                <p className="text-muted-foreground">
                  No credit card required for trial. Cancel anytime.
                </p>
              </div>

              {/* Features */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">What's Included:</h3>
                <div className="grid gap-3">
                  {[
                    "Unlimited goal tracking and milestones",
                    "Real-time team messaging and collaboration",
                    "Weekly accountability check-ins",
                    "File sharing and resource library",
                    "Progress analytics and insights",
                    "Direct mentorship from successful founders",
                  ].map((feature, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                        <Check className="h-3 w-3 text-primary" />
                      </div>
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="space-y-3">
                <Button 
                  onClick={handleCompleteOnboarding} 
                  className="w-full" 
                  size="lg"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Setting up your account...
                    </>
                  ) : (
                    <>
                      <Target className="mr-2 h-4 w-4" />
                      Start Free Trial
                    </>
                  )}
                </Button>
                <Button 
                  onClick={() => setStep(1)} 
                  variant="outline" 
                  className="w-full"
                  disabled={loading}
                >
                  Back
                </Button>
              </div>

              <p className="text-xs text-center text-muted-foreground">
                By continuing, you agree to our Terms of Service and Privacy Policy
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
