import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Mail, MessageSquare, Send, ArrowRight } from "lucide-react";

export default function Contact() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        const emailInput = document.getElementById('email') as HTMLInputElement;
        if (emailInput) emailInput.value = user.email || "";
        
        supabase
          .from("profiles")
          .select("full_name")
          .eq("id", user.id)
          .single()
          .then(({ data }) => {
            if (data) {
              const nameInput = document.getElementById('name') as HTMLInputElement;
              if (nameInput) nameInput.value = data.full_name || "";
            }
          });
      }
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData(e.currentTarget);
    const contactData = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      subject: formData.get('subject') as string,
      message: formData.get('message') as string,
    };

    const { data: { user } } = await supabase.auth.getUser();
    
    const { error } = await supabase
      .from("contact_submissions")
      .insert({
        user_id: user?.id,
        ...contactData,
      });

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Message Sent! 📧",
        description: "We'll get back to you as soon as possible.",
      });
      e.currentTarget.reset();
    }
    
    setLoading(false);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="text-center space-y-3">
        <h1 className="text-4xl font-bold tracking-tight">Get in Touch</h1>
        <p className="text-lg text-muted-foreground">
          Have a question or need help? We're here for you!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className="p-2.5 rounded-xl bg-secondary">
                <Mail className="h-5 w-5 text-foreground" />
              </div>
              <div>
                <CardTitle className="text-base">Email Us</CardTitle>
                <CardDescription>support@upfounder.com</CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className="p-2.5 rounded-xl bg-secondary">
                <MessageSquare className="h-5 w-5 text-foreground" />
              </div>
              <div>
                <CardTitle className="text-base">Live Chat</CardTitle>
                <CardDescription>Available Mon-Fri, 9AM-5PM EST</CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Send Us a Message</CardTitle>
          <CardDescription>
            Fill out the form below and we'll respond within 24 hours
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name*</Label>
                <Input id="name" name="name" placeholder="Your name" required className="rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email*</Label>
                <Input id="email" name="email" type="email" placeholder="your@email.com" required className="rounded-xl" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="subject">Subject*</Label>
              <Input id="subject" name="subject" placeholder="How can we help?" required className="rounded-xl" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Message*</Label>
              <Textarea id="message" name="message" placeholder="Tell us more about your question or issue..." rows={6} required className="rounded-xl" />
            </div>

            <Button type="submit" className="w-full rounded-full font-semibold" disabled={loading}>
              <Send className="h-4 w-4 mr-2" />
              {loading ? "Sending..." : "Send Message"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
