import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Camera, LogOut, CreditCard, Mail, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export default function Settings() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [fullName, setFullName] = useState("");
  const [bio, setBio] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      setEmail(user.email || "");
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();
      
      if (data) {
        setProfile(data);
        setFullName(data.full_name || "");
        setBio(data.bio || "");
      }
    }
  };

  const handleUpdateProfile = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: fullName,
          bio: bio,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

      if (error) {
        toast({ title: "Error", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Success", description: "Profile updated successfully" });
        fetchProfile();
      }
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  const getInitials = (name: string | null) => {
    if (!name) return "?";
    return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Settings</h1>
        <p className="text-muted-foreground">Manage your account settings and preferences</p>
      </div>

      {/* Profile Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>Update your personal details and profile picture</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center space-x-6">
            <div className="w-24 h-24 rounded-2xl bg-foreground flex items-center justify-center text-background text-2xl font-bold">
              {getInitials(profile?.full_name)}
            </div>
            <div className="space-y-2">
              <Button variant="outline" className="relative rounded-full">
                <Camera className="h-4 w-4 mr-2" />
                Change Photo
                <input
                  type="file"
                  accept="image/*"
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  onChange={(e) => {
                    console.log("File selected:", e.target.files?.[0]);
                  }}
                />
              </Button>
              <p className="text-xs text-muted-foreground">JPG, PNG or GIF. Max 2MB</p>
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <Label htmlFor="name">
              <User className="h-4 w-4 inline mr-2" />
              Full Name
            </Label>
            <Input
              id="name"
              placeholder="John Smith"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="rounded-xl"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Quick Bio</Label>
            <Textarea
              id="bio"
              placeholder="Tell us about yourself and your entrepreneurial journey..."
              rows={4}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="rounded-xl"
            />
            <p className="text-xs text-muted-foreground">Brief description for your profile. Max 200 characters.</p>
          </div>

          <Button onClick={handleUpdateProfile} disabled={loading} className="rounded-full font-semibold">
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </CardContent>
      </Card>

      {/* Account Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Account Settings</CardTitle>
          <CardDescription>Manage your account details and security</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">
              <Mail className="h-4 w-4 inline mr-2" />
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="john@example.com"
              value={email}
              disabled
              className="rounded-xl"
            />
            <p className="text-xs text-muted-foreground">This is the email associated with your account</p>
          </div>

          <Button variant="outline" className="rounded-full">Update Email</Button>
        </CardContent>
      </Card>

      {/* Subscription */}
      <Card>
        <CardHeader>
          <CardTitle>Subscription</CardTitle>
          <CardDescription>Manage your subscription and billing</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-secondary rounded-xl">
            <div className="flex items-center space-x-3">
              <CreditCard className="h-5 w-5 text-foreground" />
              <div>
                <p className="font-semibold">Premium Plan</p>
                <p className="text-sm text-muted-foreground">$99/month</p>
              </div>
            </div>
            <Button variant="outline" className="rounded-full">
              Cancel Subscription
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Your subscription will remain active until the end of your current billing period.
          </p>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-destructive/30">
        <CardHeader>
          <CardTitle className="text-destructive">Danger Zone</CardTitle>
          <CardDescription>Actions that affect your account</CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            variant="destructive" 
            onClick={handleLogout}
            className="w-full sm:w-auto rounded-full font-semibold"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Log Out
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
