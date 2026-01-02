import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, MapPin, Building2, Calendar, Target, CheckCircle2, Flame, MessageSquare, Video } from "lucide-react";
import { format } from "date-fns";

const Profile = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();

  const { data: profile, isLoading, error } = useQuery({
    queryKey: ["profile", userId],
    queryFn: async () => {
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .maybeSingle();

      if (profileError) throw profileError;
      if (!profileData) return null;

      const { data: teamData } = await supabase
        .from("team_members")
        .select("*")
        .eq("user_id", userId)
        .maybeSingle();

      return { ...profileData, team: teamData };
    },
    enabled: !!userId,
  });

  if (isLoading) {
    return (
      <div className="p-6 max-w-4xl mx-auto space-y-6">
        <Skeleton className="h-8 w-32" />
        <Card>
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row gap-8">
              <Skeleton className="h-32 w-32 rounded-full" />
              <div className="space-y-4 flex-1">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-4 w-64" />
                <Skeleton className="h-20 w-full" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <Button variant="ghost" onClick={() => navigate("/members")} className="mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Members
        </Button>
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">Profile not found</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getInitials = (name: string | null) => {
    if (!name) return "?";
    return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  };

  const statusColor = profile.team?.status === "online" 
    ? "bg-green-500" 
    : profile.team?.status === "busy" 
    ? "bg-yellow-500" 
    : "bg-muted";

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <Button variant="ghost" onClick={() => navigate("/members")} className="mb-2">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Members
      </Button>

      <Card>
        <CardContent className="p-8">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="relative">
              <Avatar className="h-32 w-32">
                <AvatarImage src={profile.avatar_url || undefined} alt={profile.full_name || "User"} />
                <AvatarFallback className="text-2xl">{getInitials(profile.full_name)}</AvatarFallback>
              </Avatar>
              <span className={`absolute bottom-2 right-2 h-5 w-5 rounded-full border-4 border-background ${statusColor}`} />
            </div>

            <div className="flex-1 space-y-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-bold">{profile.full_name || "Unknown User"}</h1>
                  <Badge variant={profile.team?.status === "online" ? "default" : "secondary"}>
                    {profile.team?.status || "offline"}
                  </Badge>
                </div>
                
                <div className="flex flex-wrap gap-4 text-muted-foreground">
                  {profile.role && (
                    <span className="flex items-center gap-1">
                      {profile.role}
                    </span>
                  )}
                  {profile.company && (
                    <span className="flex items-center gap-1">
                      <Building2 className="h-4 w-4" />
                      {profile.company}
                    </span>
                  )}
                  {profile.location && (
                    <span className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {profile.location}
                    </span>
                  )}
                  {profile.team?.join_date && (
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      Member since {format(new Date(profile.team.join_date), "MMM yyyy")}
                    </span>
                  )}
                </div>
              </div>

              {profile.bio && (
                <p className="text-muted-foreground leading-relaxed">{profile.bio}</p>
              )}

              <div className="flex gap-3 pt-2">
                <Button onClick={() => navigate("/messages")}>
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Message
                </Button>
                <Button variant="outline">
                  <Video className="h-4 w-4 mr-2" />
                  Schedule Meeting
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {profile.team && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Target className="h-4 w-4" />
                <span className="text-sm">Active Goals</span>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{profile.team.goals_count || 0}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2 text-muted-foreground">
                <CheckCircle2 className="h-4 w-4" />
                <span className="text-sm">Completed</span>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{profile.team.completed_count || 0}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Flame className="h-4 w-4" />
                <span className="text-sm">Day Streak</span>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{profile.team.streak || 0}</p>
            </CardContent>
          </Card>
        </div>
      )}

      {profile.team?.expertise && profile.team.expertise.length > 0 && (
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold">Expertise</h2>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {profile.team.expertise.map((skill: string, index: number) => (
                <Badge key={index} variant="secondary">{skill}</Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Profile;
