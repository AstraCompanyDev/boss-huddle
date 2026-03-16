import { NavLink, useLocation } from "react-router-dom";
import {
  Home,
  Hash,
  Users,
  Settings,
  Target,
  FileText,
  Search,
  Shield,
} from "lucide-react";
import upfounderLogo from "@/assets/upfounder-logo.jpg";
import { useAdminCheck } from "@/hooks/useAdminCheck";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const mainItems = [
  { title: "Dashboard", url: "/dashboard", icon: Home },
  { title: "Channels", url: "/messages", icon: Hash },
  { title: "Goals", url: "/goals", icon: Target },
  { title: "Members", url: "/members", icon: Users },
  { title: "Files", url: "/files", icon: FileText },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const collapsed = state === "collapsed";
  const { isAdmin } = useAdminCheck();
  const [profile, setProfile] = useState<{ full_name: string | null } | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from("profiles")
          .select("full_name")
          .eq("id", user.id)
          .single();
        if (data) setProfile(data);
      }
    };
    fetchProfile();
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => fetchProfile());
    return () => subscription.unsubscribe();
  }, []);

  const getInitials = (name: string | null) => {
    if (!name) return "?";
    return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  };

  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive
      ? "!bg-foreground !text-background font-semibold rounded-xl"
      : "text-muted-foreground hover:!bg-secondary hover:text-foreground rounded-xl transition-colors";

  return (
    <Sidebar className={collapsed ? "w-14" : "w-64"} collapsible="icon">
      <SidebarContent className="bg-card border-r-0">
        {/* Header */}
        <div className="p-4 border-b">
          {!collapsed && (
            <div className="flex items-center justify-between">
              <img
                src={upfounderLogo}
                alt="Upfounder"
                className="h-8 object-contain"
              />
              <SidebarTrigger className="h-6 w-6 text-muted-foreground hover:text-foreground" />
            </div>
          )}
          {collapsed && (
            <div className="flex justify-center">
              <SidebarTrigger className="h-6 w-6 text-muted-foreground hover:text-foreground" />
            </div>
          )}
        </div>

        {/* Quick Search */}
        {!collapsed && (
          <div className="p-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search..."
                className="pl-10 bg-secondary border-0 rounded-xl text-sm"
              />
            </div>
          </div>
        )}

        {/* Navigation */}
        <SidebarGroup>
          <SidebarGroupContent>
            <nav className="space-y-1 px-2">
              {mainItems.map((item) => (
                <NavLink
                  key={item.title}
                  to={item.url}
                  end
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-3 px-3 py-2.5 text-sm rounded-xl transition-colors",
                      isActive
                        ? "bg-foreground text-background font-semibold"
                        : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                    )
                  }
                >
                  <item.icon className="h-5 w-5 shrink-0" />
                  {!collapsed && <span>{item.title}</span>}
                </NavLink>
              ))}
              {isAdmin && (
                <NavLink
                  to="/admin"
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-3 px-3 py-2.5 text-sm rounded-xl transition-colors",
                      isActive
                        ? "bg-foreground text-background font-semibold"
                        : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                    )
                  }
                >
                  <Shield className="h-5 w-5 shrink-0" />
                  {!collapsed && <span>Admin</span>}
                </NavLink>
              )}
            </nav>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* User Profile */}
        <div className="mt-auto p-4 border-t">
          {!collapsed ? (
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-full bg-foreground flex items-center justify-center text-background text-sm font-semibold">
                {getInitials(profile?.full_name)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">{profile?.full_name || "User"}</p>
                <p className="text-xs text-muted-foreground">Online</p>
              </div>
              <Button variant="ghost" size="sm" asChild className="text-muted-foreground hover:text-foreground">
                <NavLink to="/settings">
                  <Settings className="h-4 w-4" />
                </NavLink>
              </Button>
            </div>
          ) : (
            <div className="flex justify-center">
              <div className="w-9 h-9 rounded-full bg-foreground flex items-center justify-center text-background text-sm font-semibold">
                {getInitials(profile?.full_name)}
              </div>
            </div>
          )}
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
