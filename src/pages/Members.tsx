import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Search,
  MessageSquare,
  Calendar,
  Target,
  Flame,
  MapPin,
  Building2,
} from "lucide-react";
import { useState } from "react";

export default function Members() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const { data: members = [], isLoading } = useQuery({
    queryKey: ["members"],
    queryFn: async () => {
      const { data: profiles, error } = await supabase
        .from("profiles")
        .select("*")
        .order("full_name");
      if (error) throw error;

      // Fetch team_members data
      const userIds = profiles.map((p) => p.id);
      const { data: teamData } = await supabase
        .from("team_members")
        .select("*")
        .in("user_id", userIds.length > 0 ? userIds : ["none"]);

      const teamMap = new Map(teamData?.map((t) => [t.user_id, t]) ?? []);

      return profiles.map((p) => ({
        ...p,
        team: teamMap.get(p.id) || null,
      }));
    },
  });

  const filtered = members.filter((m) =>
    (m.full_name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    (m.company || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    (m.role || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getInitials = (name: string | null) => {
    if (!name) return "?";
    return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
  };

  const onlineCount = members.filter((m) => m.team?.status === "online").length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Team Members</h1>
          <p className="text-muted-foreground">Connect and collaborate with fellow entrepreneurs</p>
        </div>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search members by name, company, or role..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Members Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center space-x-3">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
                <Skeleton className="h-16 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">No members found</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((member) => (
            <Card
              key={member.id}
              className="hover:shadow-md transition-all duration-200 cursor-pointer"
              onClick={() => navigate(`/profile/${member.id}`)}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={member.avatar_url || undefined} />
                        <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                          {getInitials(member.full_name)}
                        </AvatarFallback>
                      </Avatar>
                      <div
                        className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-background ${
                          member.team?.status === "online"
                            ? "bg-green-500"
                            : member.team?.status === "busy"
                            ? "bg-yellow-500"
                            : "bg-muted-foreground/30"
                        }`}
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold truncate">{member.full_name || "Unknown"}</h3>
                      {member.role && <p className="text-sm text-muted-foreground truncate">{member.role}</p>}
                      {member.company && <p className="text-sm text-primary font-medium truncate">{member.company}</p>}
                    </div>
                  </div>
                  <Badge variant={member.team?.status === "online" ? "default" : "secondary"}>
                    {member.team?.status || "offline"}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {member.bio && (
                  <p className="text-sm text-muted-foreground line-clamp-2">{member.bio}</p>
                )}

                <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                  {member.location && (
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" /> {member.location}
                    </span>
                  )}
                  {member.company && (
                    <span className="flex items-center gap-1">
                      <Building2 className="h-3 w-3" /> {member.company}
                    </span>
                  )}
                </div>

                {/* Stats */}
                {member.team && (
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div className="bg-muted/30 rounded-lg p-2">
                      <div className="text-lg font-bold text-primary">{member.team.goals_count || 0}</div>
                      <div className="text-xs text-muted-foreground">Goals</div>
                    </div>
                    <div className="bg-muted/30 rounded-lg p-2">
                      <div className="text-lg font-bold text-accent">{member.team.completed_count || 0}</div>
                      <div className="text-xs text-muted-foreground">Done</div>
                    </div>
                    <div className="bg-muted/30 rounded-lg p-2">
                      <div className="text-lg font-bold text-green-600">{member.team.streak || 0}</div>
                      <div className="text-xs text-muted-foreground">Streak</div>
                    </div>
                  </div>
                )}

                {/* Expertise */}
                {member.team?.expertise && member.team.expertise.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {member.team.expertise.slice(0, 3).map((skill: string, i: number) => (
                      <Badge key={i} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                    {member.team.expertise.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{member.team.expertise.length - 3}
                      </Badge>
                    )}
                  </div>
                )}

                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate("/messages");
                  }}
                >
                  <MessageSquare className="h-4 w-4 mr-1" />
                  Message
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Group Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Group Statistics</CardTitle>
          <CardDescription>Overview of team engagement</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-2xl font-bold text-primary">{members.length}</div>
              <p className="text-sm text-muted-foreground">Total Members</p>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">{onlineCount}</div>
              <p className="text-sm text-muted-foreground">Online Now</p>
            </div>
            <div>
              <div className="text-2xl font-bold text-accent">
                {members.reduce((acc, m) => acc + (m.team?.completed_count || 0), 0)}
              </div>
              <p className="text-sm text-muted-foreground">Goals Completed</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
