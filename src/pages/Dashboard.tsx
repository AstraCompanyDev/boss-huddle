import { useState, useEffect } from "react";
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
  ArrowUp,
} from "lucide-react";
import heroImage from "@/assets/hero-dashboard.jpg";
import { format, isToday, isTomorrow, parseISO } from "date-fns";

export default function Dashboard() {
  const [goalDialogOpen, setGoalDialogOpen] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [stats, setStats] = useState({ activeGoals: 0, completionRate: 0, teamMembers: 0, messagesToday: 0 });
  const [userGoals, setUserGoals] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Fetch profile
    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name")
      .eq("id", user.id)
      .maybeSingle();
    if (profile?.full_name) {
      setFirstName(profile.full_name.split(" ")[0]);
    }

    // Fetch user's goals
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

    // Fetch team members count
    const { count: memberCount } = await supabase
      .from("profiles")
      .select("*", { count: "exact", head: true });

    // Fetch today's messages count
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

    // Fetch upcoming events
    const { data: eventsData } = await supabase
      .from("events")
      .select("*")
      .gte("event_date", new Date().toISOString())
      .order("event_date", { ascending: true })
      .limit(3);
    setEvents(eventsData || []);

    // Build recent activity from messages
    const { data: recentMessages } = await supabase
      .from("messages")
      .select("*, channels(name)")
      .order("created_at", { ascending: false })
      .limit(5);

    if (recentMessages) {
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

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-xl">
        <div className="h-48 bg-cover bg-center relative" style={{ backgroundImage: `url(${heroImage})` }}>
          <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/70 to-transparent" />
          <div className="relative h-full flex items-center px-8">
            <div className="text-white">
              <h1 className="text-3xl font-bold mb-2">Hi {firstName || "there"}, Welcome Back!</h1>
              <p className="text-lg opacity-90">Let's crush those goals together 🚀</p>
              <Dialog open={goalDialogOpen} onOpenChange={setGoalDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="mt-4 bg-card text-primary hover:bg-card/90 dark:bg-white dark:text-primary dark:hover:bg-white/90">
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
                      <Input id="title" name="title" placeholder="e.g., Launch MVP" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea id="description" name="description" placeholder="Describe what you want to achieve..." rows={3} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="deadline">Deadline*</Label>
                      <Input id="deadline" name="deadline" type="date" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <Select name="category" defaultValue="product">
                        <SelectTrigger><SelectValue /></SelectTrigger>
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
                      <Button type="button" variant="outline" onClick={() => setGoalDialogOpen(false)}>Cancel</Button>
                      <Button type="submit"><Plus className="h-4 w-4 mr-2" />Create Goal</Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Goals</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeGoals}</div>
            <p className="text-xs text-muted-foreground">Goals in progress</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completionRate}%</div>
            <p className="text-xs text-muted-foreground">Of all goals completed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Team Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.teamMembers}</div>
            <p className="text-xs text-muted-foreground">On the platform</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Messages Today</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.messagesToday}</div>
            <p className="text-xs text-muted-foreground">Across all channels</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Current Goals */}
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
                      goal.status === "on-track" ? "bg-green-500" : goal.status === "behind" ? "bg-red-500" : "bg-yellow-500"
                    }`} />
                    <h4 className="font-medium">{goal.title}</h4>
                  </div>
                  {goal.deadline && (
                    <Badge variant={goal.status === "on-track" ? "default" : "secondary"}>
                      Due {format(parseISO(goal.deadline), "MMM d")}
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
            <Button variant="outline" className="w-full" onClick={handleTrackGoal}>
              <Target className="h-4 w-4 mr-2" />
              View All Goals
            </Button>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>What's happening in your group</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">No recent activity yet.</p>
              )}
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center text-white text-sm font-medium">
                    {activity.user.split(" ").map((n: string) => n[0]).join("")}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm">
                      <span className="font-medium">{activity.user}</span>{" "}
                      <span className="text-muted-foreground">{activity.action}</span>{" "}
                      <span className="font-medium">{activity.target}</span>
                    </p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Events */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Events</CardTitle>
            <CardDescription>Don't miss these important dates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {events.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">No upcoming events.</p>
              )}
              {events.map((event) => (
                <div key={event.id} className="flex items-center space-x-3 p-3 rounded-lg bg-muted/30">
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

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <Button className="h-auto p-4 flex flex-col items-center space-y-2" onClick={handleSendUpdate}>
                <MessageSquare className="h-5 w-5" />
                <span className="text-sm">Send Update</span>
              </Button>
              <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2" onClick={handleTrackGoal}>
                <Target className="h-5 w-5" />
                <span className="text-sm">Track Goal</span>
              </Button>
              <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2" onClick={handleInviteMember}>
                <Users className="h-5 w-5" />
                <span className="text-sm">Invite Member</span>
              </Button>
              <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2" onClick={handleGetHelp}>
                <AlertCircle className="h-5 w-5" />
                <span className="text-sm">Get Help</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
