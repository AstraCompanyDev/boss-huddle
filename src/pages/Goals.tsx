import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import {
  Target,
  Plus,
  Calendar,
  Clock,
  CheckCircle,
  TrendingUp,
  Loader2,
  Trash2,
} from "lucide-react";

export default function Goals() {
  const [userId, setUserId] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUserId(data.user?.id ?? null));
  }, []);

  // Fetch goals with milestones
  const { data: goals = [], isLoading } = useQuery({
    queryKey: ["goals", userId],
    queryFn: async () => {
      if (!userId) return [];
      const { data, error } = await supabase
        .from("goals")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });
      if (error) throw error;

      // Fetch milestones for all goals
      const goalIds = data.map((g) => g.id);
      const { data: milestones } = await supabase
        .from("goal_milestones")
        .select("*")
        .in("goal_id", goalIds.length > 0 ? goalIds : ["none"])
        .order("created_at");

      return data.map((g) => ({
        ...g,
        milestones: milestones?.filter((m) => m.goal_id === g.id) ?? [],
      }));
    },
    enabled: !!userId,
  });

  // Create goal
  const createGoal = useMutation({
    mutationFn: async (form: FormData) => {
      if (!userId) throw new Error("Not logged in");
      const title = form.get("title") as string;
      const description = form.get("description") as string;
      const deadline = form.get("deadline") as string;
      const category = form.get("category") as string;
      const priority = form.get("priority") as string;

      const { data: goal, error } = await supabase
        .from("goals")
        .insert({
          user_id: userId,
          title,
          description: description || null,
          deadline: deadline || null,
          category: category || null,
          priority: priority || "medium",
          progress: 0,
          status: "on-track",
        })
        .select()
        .single();
      if (error) throw error;

      // Create milestones if provided
      const milestonesStr = form.get("milestones") as string;
      if (milestonesStr?.trim()) {
        const milestoneNames = milestonesStr.split(",").map((m) => m.trim()).filter(Boolean);
        if (milestoneNames.length > 0) {
          await supabase.from("goal_milestones").insert(
            milestoneNames.map((title) => ({ goal_id: goal.id, title, completed: false }))
          );
        }
      }
    },
    onSuccess: () => {
      setDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ["goals"] });
      toast({ title: "Goal Created! 🎯", description: "Your new goal has been added." });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to create goal", variant: "destructive" });
    },
  });

  // Toggle milestone
  const toggleMilestone = useMutation({
    mutationFn: async ({ id, completed }: { id: string; completed: boolean }) => {
      const { error } = await supabase.from("goal_milestones").update({ completed }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["goals"] }),
  });

  // Update goal progress based on milestones
  const updateProgress = useMutation({
    mutationFn: async ({ goalId, progress }: { goalId: string; progress: number }) => {
      const { error } = await supabase.from("goals").update({ progress }).eq("id", goalId);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["goals"] }),
  });

  // Delete goal
  const deleteGoal = useMutation({
    mutationFn: async (goalId: string) => {
      // Delete milestones first
      await supabase.from("goal_milestones").delete().eq("goal_id", goalId);
      const { error } = await supabase.from("goals").delete().eq("id", goalId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["goals"] });
      toast({ title: "Goal deleted" });
    },
  });

  // Mark complete
  const markComplete = useMutation({
    mutationFn: async (goalId: string) => {
      const { error } = await supabase
        .from("goals")
        .update({ status: "completed", progress: 100 })
        .eq("id", goalId);
      if (error) throw error;
      // Mark all milestones complete
      await supabase.from("goal_milestones").update({ completed: true }).eq("goal_id", goalId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["goals"] });
      toast({ title: "Goal completed! 🎉" });
    },
  });

  const handleMilestoneToggle = (goal: any, milestoneId: string, currentCompleted: boolean) => {
    const newCompleted = !currentCompleted;
    toggleMilestone.mutate({ id: milestoneId, completed: newCompleted });

    // Recalculate progress
    const milestones = goal.milestones;
    const completedCount =
      milestones.filter((m: any) => (m.id === milestoneId ? newCompleted : m.completed)).length;
    const newProgress = milestones.length > 0 ? Math.round((completedCount / milestones.length) * 100) : goal.progress;
    updateProgress.mutate({ goalId: goal.id, progress: newProgress });
  };

  const activeGoals = goals.filter((g) => g.status !== "completed");
  const completedGoals = goals.filter((g) => g.status === "completed");
  const avgProgress = activeGoals.length > 0
    ? Math.round(activeGoals.reduce((acc, g) => acc + (g.progress ?? 0), 0) / activeGoals.length)
    : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Goals & Milestones</h1>
          <p className="text-muted-foreground">Track progress toward your objectives</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Goal
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Create New Goal</DialogTitle>
              <DialogDescription>Set a new goal and track your progress.</DialogDescription>
            </DialogHeader>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                createGoal.mutate(new FormData(e.currentTarget));
              }}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label htmlFor="title">Goal Title*</Label>
                <Input id="title" name="title" placeholder="e.g., Launch MVP" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" name="description" placeholder="Describe your goal..." rows={3} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="deadline">Deadline</Label>
                  <Input id="deadline" name="deadline" type="date" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select name="priority" defaultValue="medium">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select name="category" defaultValue="product">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="product">Product</SelectItem>
                    <SelectItem value="revenue">Revenue</SelectItem>
                    <SelectItem value="team">Team</SelectItem>
                    <SelectItem value="marketing">Marketing</SelectItem>
                    <SelectItem value="personal">Personal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="milestones">Milestones (comma-separated)</Label>
                <Input id="milestones" name="milestones" placeholder="e.g., Design, Build, Test, Launch" />
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={createGoal.isPending}>
                  {createGoal.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
                  Create Goal
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Target className="h-4 w-4 mr-2 text-primary" /> Active Goals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeGoals.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <TrendingUp className="h-4 w-4 mr-2 text-green-600" /> Avg. Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgProgress}%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <CheckCircle className="h-4 w-4 mr-2 text-green-600" /> Completed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedGoals.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Clock className="h-4 w-4 mr-2 text-amber-500" /> Total Goals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{goals.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Goals List */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : goals.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Target className="h-12 w-12 mx-auto mb-4 text-muted-foreground/30" />
            <p className="text-lg font-medium text-muted-foreground">No goals yet</p>
            <p className="text-sm text-muted-foreground mb-4">Create your first goal to start tracking progress!</p>
            <Button onClick={() => setDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" /> Create Goal
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {goals.map((goal) => (
            <Card key={goal.id} className="hover:shadow-md transition-all duration-200">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center space-x-3 flex-wrap gap-y-2">
                      <h3 className="text-lg font-semibold">{goal.title}</h3>
                      {goal.priority && (
                        <Badge variant={goal.priority === "high" ? "destructive" : goal.priority === "medium" ? "default" : "secondary"}>
                          {goal.priority}
                        </Badge>
                      )}
                      <Badge variant={goal.status === "on-track" ? "default" : goal.status === "behind" ? "destructive" : "secondary"}>
                        {goal.status}
                      </Badge>
                      {goal.category && <Badge variant="outline">{goal.category}</Badge>}
                    </div>
                    {goal.description && <p className="text-muted-foreground text-sm">{goal.description}</p>}
                    {goal.deadline && (
                      <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>Due {new Date(goal.deadline).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>
                  <div className="text-right space-y-2 ml-4">
                    <div className="text-2xl font-bold text-primary">{goal.progress ?? 0}%</div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <Progress value={goal.progress ?? 0} className="h-2" />

                {/* Milestones */}
                {goal.milestones.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Milestones</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                      {goal.milestones.map((milestone: any) => (
                        <button
                          key={milestone.id}
                          onClick={() => handleMilestoneToggle(goal, milestone.id, milestone.completed)}
                          className={`flex items-center space-x-2 p-2 rounded-lg text-left transition-colors ${
                            milestone.completed
                              ? "bg-green-500/10 text-green-700 dark:text-green-400"
                              : "bg-muted/30 hover:bg-muted/50"
                          }`}
                        >
                          {milestone.completed ? (
                            <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                          ) : (
                            <div className="h-4 w-4 rounded-full border-2 border-muted-foreground/30 flex-shrink-0" />
                          )}
                          <span className={`text-xs ${milestone.completed ? "line-through" : ""}`}>
                            {milestone.title}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-end space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => deleteGoal.mutate(goal.id)}
                    disabled={deleteGoal.isPending}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                  {goal.status !== "completed" && (
                    <Button size="sm" onClick={() => markComplete.mutate(goal.id)} disabled={markComplete.isPending}>
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Mark Complete
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
