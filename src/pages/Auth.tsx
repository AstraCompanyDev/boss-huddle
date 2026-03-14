import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Loader2, ArrowRight } from "lucide-react";
import upfounderLogo from "@/assets/upfounder-logo.jpg";

export default function Auth() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");

  const demoCreds = useMemo(
    () => ({ email: "demo@bosshuddle.com", password: "test123456" }),
    []
  );

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) navigate("/dashboard");
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) navigate("/dashboard");
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/`,
        data: {
          full_name: fullName,
        },
      },
    });

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Account Created!",
        description: "Let's set up your profile",
      });
      navigate("/onboarding");
    }

    setLoading(false);
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error?.message === "Invalid login credentials" && email.trim().toLowerCase() === demoCreds.email) {
      setLoading(false);
      await handleUseDemo();
      return;
    }

    if (error) {
      toast({
        title: "Sign in failed",
        description:
          error.message === "Invalid login credentials"
            ? "No account found with that email/password. Try Sign Up first, or use the demo account."
            : error.message,
        variant: "destructive",
      });
    } else {
      navigate("/dashboard");
    }

    setLoading(false);
  };

  const handleUseDemo = async () => {
    setLoading(true);
    try {
      const { error: invokeError } = await supabase.functions.invoke("create-demo-user", {
        body: {},
      });

      if (invokeError) {
        throw new Error(invokeError.message || "Unable to create demo account");
      }

      setEmail(demoCreds.email);
      setPassword(demoCreds.password);

      const { error } = await supabase.auth.signInWithPassword({
        email: demoCreds.email,
        password: demoCreds.password,
      });

      if (error) throw error;

      navigate("/dashboard");
    } catch (err: any) {
      toast({
        title: "Demo sign-in failed",
        description: err?.message ?? "Please try again",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden p-4">
      {/* Subtle radial gradients matching landing page */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,hsl(210,100%,95%),transparent)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_80%_80%,hsl(38,90%,95%),transparent)]" />
      
      <Card className="w-full max-w-md relative z-10 border-border">
        <CardHeader className="text-center space-y-4">
          <img
            src={upfounderLogo}
            alt="Upfounder"
            className="h-10 mx-auto object-contain"
          />
          <CardDescription className="text-muted-foreground">
            Join your accountability group
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2 rounded-xl bg-secondary">
              <TabsTrigger value="signin" className="rounded-lg">Sign In</TabsTrigger>
              <TabsTrigger value="signup" className="rounded-lg">Sign Up</TabsTrigger>
            </TabsList>

            <TabsContent value="signin">
              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signin-email">Email</Label>
                  <Input
                    id="signin-email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signin-password">Password</Label>
                  <Input
                    id="signin-password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="rounded-xl"
                  />
                </div>

                <Button type="submit" className="w-full rounded-full font-semibold" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    <>
                      Sign In
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full rounded-full font-medium"
                  onClick={handleUseDemo}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Preparing demo...
                    </>
                  ) : (
                    "Use demo account"
                  )}
                </Button>

                <p className="text-xs text-muted-foreground text-center">
                  Tip: if you've never created an account here, use <span className="font-medium text-foreground">Sign Up</span> first.
                </p>
              </form>
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-name">Full Name</Label>
                  <Input
                    id="signup-name"
                    type="text"
                    placeholder="John Smith"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    className="rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    className="rounded-xl"
                  />
                  <p className="text-xs text-muted-foreground">Password must be at least 6 characters</p>
                </div>
                <Button type="submit" className="w-full rounded-full font-semibold" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    <>
                      Sign Up
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
