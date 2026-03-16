import { useState, useEffect } from "react";
import bannerRocket from "@/assets/banner-rocket.png";
import ShortsCarousel from "@/components/ShortsCarousel";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import {
  Target,
  TrendingUp,
  Users,
  MessageSquare,
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle,
  Plus,
  ArrowRight,
  Send,
} from "lucide-react";
import { format, isToday, isTomorrow, parseISO } from "date-fns";

export default function Dashboard() {
  const [goalDialogOpen, setGoalDialogOpen] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [stats, setStats] = useState({ activeGoals: 0, completionRate: 0, teamMembers: 0, messagesToday: 0 });
  const [userGoals, setUserGoals] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [channels, setChannels] = useState<any[]>([]);
  const [feedPost, setFeedPost] = useState("");
  const [selectedChannel, setSelectedChannel] = useState("");
  const [posting, setPosting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name")
      .eq("id", user.id)
      .maybeSingle();
    if (profile?.full_name) {
      setFirstName(profile.full_name.split(" ")[0]);
    }

    const { data: goals } = await supabase
      .from("goals")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    const activeGoals = goals || [];
    const completedGoals = activeGoals.filter(g => g.progress === 100);
    const completionRate = activeGoals.length > 0
      ? Math.round((completedGoals.length / activeGoals.length) * 100)
      : 0;

    setUserGoals(activeGoals.filter(g => g.progress < 100).slice(0, 3));

    const { count: memberCount } = await supabase
      .from("profiles")
      .select("*", { count: "exact", head: true });

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const { count: msgCount } = await supabase
      .from("messages")
      .select("*", { count: "exact", head: true })
      .gte("created_at", todayStart.toISOString());

    setStats({
      activeGoals: activeGoals.filter(g => g.progress < 100).length,
      completionRate,
      teamMembers: memberCount || 0,
      messagesToday: msgCount || 0,
    });

    const { data: eventsData } = await supabase
      .from("events")
      .select("*")
      .gte("event_date", new Date().toISOString())
      .order("event_date", { ascending: true })
      .limit(3);
    setEvents(eventsData || []);

    const { data: channelsData } = await supabase
      .from("channels")
      .select("*")
      .order("name");
    setChannels(channelsData || []);
    if (channelsData && channelsData.length > 0 && !selectedChannel) {
      setSelectedChannel(channelsData[0].id);
    }

    const { data: recentMessages } = await supabase
      .from("messages")
      .select("*, channels(name)")
      .order("created_at", { ascending: false })
      .limit(10);

    if (recentMessages && recentMessages.length > 0) {
      const userIds = [...new Set(recentMessages.map(m => m.user_id))];
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, full_name")
        .in("id", userIds);
      const profileMap = Object.fromEntries((profiles || []).map(p => [p.id, p.full_name || "Unknown"]));

      setRecentActivity(recentMessages.map(m => ({
        user: profileMap[m.user_id] || "Unknown",
        action: "posted in",
        target: `#${(m as any).channels?.name || "channel"}`,
        content: m.content,
        time: formatRelativeTime(m.created_at),
      })));
    }
  };

  const formatRelativeTime = (dateStr: string | null) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  };

  const formatEventDate = (dateStr: string) => {
    const date = parseISO(dateStr);
    if (isToday(date)) return `Today, ${format(date, "h:mm a")}`;
    if (isTomorrow(date)) return `Tomorrow, ${format(date, "h:mm a")}`;
    return format(date, "EEE, MMM d, h:mm a");
  };

  const handleCreateGoal = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const formData = new FormData(e.currentTarget);
    const { error } = await supabase.from("goals").insert({
      title: formData.get("title") as string,
      description: formData.get("description") as string || null,
      deadline: formData.get("deadline") as string || null,
      category: formData.get("category") as string || null,
      user_id: user.id,
    });

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return;
    }

    setGoalDialogOpen(false);
    toast({ title: "Goal Created! 🎯", description: `Goal has been added.` });
    fetchAllData();
  };

  const handleSendUpdate = () => navigate("/messages");
  const handleTrackGoal = () => navigate("/goals");
  const handleInviteMember = () => navigate("/members");
  const handleGetHelp = () => navigate("/contact");

  const handlePostToFeed = async () => {
    if (!feedPost.trim() || !selectedChannel) return;
    setPosting(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setPosting(false); return; }

    const { error } = await supabase.from("messages").insert({
      content: feedPost.trim(),
      channel_id: selectedChannel,
      user_id: user.id,
    });

    setPosting(false);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return;
    }
    setFeedPost("");
    toast({ title: "Posted! 🎉", description: "Your update is now in the feed." });
    fetchAllData();
  };

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl bg-foreground text-background p-8 md:p-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_80%_-20%,hsl(210,100%,30%),transparent)] opacity-60" />
        <img src={bannerRocket} alt="" className="absolute right-4 bottom-0 h-full max-h-[180px] md:max-h-[220px] object-contain opacity-80 pointer-events-none select-none" />
        <div className="relative">
          <h1 className="text-3xl font-bold mb-2">Hi {firstName || "there"}, Welcome Back!</h1>
          <p className="text-lg opacity-70 mb-6">Let's crush those goals together 🚀</p>
          <Dialog open={goalDialogOpen} onOpenChange={setGoalDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-full font-semibold px-6">
                <Plus className="h-4 w-4 mr-2" />
                Set New Goal
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Create New Goal</DialogTitle>
                <DialogDescription>
                  Set a new accountability goal and track your progress with the team.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreateGoal} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Goal Title*</Label>
                  <Input id="title" name="title" placeholder="e.g., Launch MVP" required className="rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" name="description" placeholder="Describe what you want to achieve..." rows={3} className="rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="deadline">Deadline*</Label>
                  <Input id="deadline" name="deadline" type="date" required className="rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select name="category" defaultValue="product">
                    <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="product">Product Development</SelectItem>
                      <SelectItem value="revenue">Revenue</SelectItem>
                      <SelectItem value="team">Team Building</SelectItem>
                      <SelectItem value="marketing">Marketing</SelectItem>
                      <SelectItem value="personal">Personal Growth</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex justify-end space-x-3 pt-4">
                  <Button type="button" variant="outline" onClick={() => setGoalDialogOpen(false)} className="rounded-full">Cancel</Button>
                  <Button type="submit" className="rounded-full"><Plus className="h-4 w-4 mr-2" />Create Goal</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Active Goals", value: stats.activeGoals, sub: "Goals in progress", icon: Target },
          { label: "Completion Rate", value: `${stats.completionRate}%`, sub: "Of all goals completed", icon: TrendingUp },
          { label: "Team Members", value: stats.teamMembers, sub: "On the platform", icon: Users },
          { label: "Messages Today", value: stats.messagesToday, sub: "Across all channels", icon: MessageSquare },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.label}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left Column - Discovery Feed */}
        <div className="lg:col-span-3 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Discovery Feed</CardTitle>
              <CardDescription>What's happening across the community</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Compose Box */}
              <div className="mb-6 p-4 rounded-2xl border bg-secondary/30 space-y-3">
                <Textarea
                  placeholder="Share an update with the community..."
                  value={feedPost}
                  onChange={(e) => setFeedPost(e.target.value)}
                  rows={2}
                  className="resize-none rounded-xl border-0 bg-background"
                />
                <div className="flex items-center justify-between">
                  <Select value={selectedChannel} onValueChange={setSelectedChannel}>
                    <SelectTrigger className="w-[180px] h-8 text-xs rounded-lg">
                      <SelectValue placeholder="Select channel" />
                    </SelectTrigger>
                    <SelectContent>
                      {channels.map((ch) => (
                        <SelectItem key={ch.id} value={ch.id}>#{ch.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button size="sm" onClick={handlePostToFeed} disabled={!feedPost.trim() || posting} className="rounded-full">
                    <Send className="h-4 w-4 mr-2" />
                    {posting ? "Posting..." : "Post"}
                  </Button>
                </div>
              </div>

              <div className="space-y-3">
                {recentActivity.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-8">No activity yet. Post your first update above!</p>
                )}
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 rounded-xl hover:bg-secondary/50 transition-colors">
                    <div className="w-10 h-10 rounded-full bg-foreground flex items-center justify-center text-background text-sm font-medium shrink-0">
                      {activity.user.split(" ").map((n: string) => n[0]).join("")}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm">
                        <span className="font-semibold">{activity.user}</span>{" "}
                        <span className="text-muted-foreground">{activity.action}</span>{" "}
                        <span className="font-semibold">{activity.target}</span>
                      </p>
                      {activity.content && (
                        <p className="text-sm mt-1 text-muted-foreground">{activity.content}</p>
                      )}
                      <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks and shortcuts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <Button className="h-auto p-4 flex flex-col items-center space-y-2 rounded-xl" onClick={handleSendUpdate}>
                  <MessageSquare className="h-5 w-5" />
                  <span className="text-sm">Send Update</span>
                </Button>
                <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2 rounded-xl" onClick={handleTrackGoal}>
                  <Target className="h-5 w-5" />
                  <span className="text-sm">Track Goal</span>
                </Button>
                <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2 rounded-xl" onClick={handleInviteMember}>
                  <Users className="h-5 w-5" />
                  <span className="text-sm">Invite Member</span>
                </Button>
                <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2 rounded-xl" onClick={handleGetHelp}>
                  <AlertCircle className="h-5 w-5" />
                  <span className="text-sm">Get Help</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Goals & Events */}
        <div className="lg:col-span-2 space-y-6">
          {/* Your Goals */}
          <Card>
            <CardHeader>
              <CardTitle>Your Goals</CardTitle>
              <CardDescription>Active accountability targets</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {userGoals.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">No active goals yet. Create one to get started!</p>
              )}
              {userGoals.map((goal) => (
                <div key={goal.id} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${
                        goal.status === "on-track" ? "bg-green-500" : goal.status === "behind" ? "bg-destructive" : "bg-accent"
                      }`} />
                      <h4 className="font-medium text-sm">{goal.title}</h4>
                    </div>
                    {goal.deadline && (
                      <Badge variant={goal.status === "on-track" ? "default" : "secondary"} className="text-xs">
                        {format(parseISO(goal.deadline), "MMM d")}
                      </Badge>
                    )}
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium">{goal.progress || 0}%</span>
                    </div>
                    <Progress value={goal.progress || 0} className="h-2" />
                  </div>
                </div>
              ))}
              <Button variant="outline" className="w-full rounded-full" onClick={handleTrackGoal}>
                <Target className="h-4 w-4 mr-2" />
                View All Goals
              </Button>
            </CardContent>
          </Card>

          {/* Upcoming Events */}
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Events</CardTitle>
              <CardDescription>Don't miss these important dates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {events.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">No upcoming events.</p>
                )}
                {events.map((event) => (
                  <div key={event.id} className="flex items-center space-x-3 p-3 rounded-xl bg-secondary/50">
                    <div className="flex-shrink-0">
                      {event.event_type === "meeting" && <Calendar className="h-4 w-4 text-primary" />}
                      {event.event_type === "review" && <CheckCircle className="h-4 w-4 text-accent" />}
                      {(!event.event_type || !["meeting", "review"].includes(event.event_type)) && <Clock className="h-4 w-4 text-muted-foreground" />}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{event.title}</p>
                      <p className="text-xs text-muted-foreground">{formatEventDate(event.event_date)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
