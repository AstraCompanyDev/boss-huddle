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

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const mainItems = [
  { title: "Dashboard", url: "/", icon: Home },
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

  const isActive = (path: string) => currentPath === path;
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive ? "bg-primary/10 text-primary font-medium" : "hover:bg-muted/50";

  return (
    <Sidebar className={collapsed ? "w-14" : "w-64"} collapsible="icon">
      <SidebarContent className="bg-card">
        {/* Header */}
        <div className="p-4 border-b">
          {!collapsed && (
            <div className="flex items-center justify-between">
              <img
                src={upfounderLogo}
                alt="Upfounder"
                className="h-8 object-contain"
              />
              <SidebarTrigger className="h-6 w-6" />
            </div>
          )}
          {collapsed && (
            <div className="flex justify-center">
              <SidebarTrigger className="h-6 w-6" />
            </div>
          )}
        </div>

        {/* Quick Search */}
        {!collapsed && (
          <div className="p-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search messages..."
                className="pl-10 bg-muted/30"
              />
            </div>
          </div>
        )}

        {/* Navigation */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} end className={getNavCls}>
                      <item.icon className="h-5 w-5" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              {/* Admin link - only visible to admins */}
              {isAdmin && (
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <NavLink to="/admin" className={getNavCls}>
                      <Shield className="h-5 w-5" />
                      {!collapsed && <span>Admin</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>


        {/* User Profile */}
        <div className="mt-auto p-4 border-t">
          {!collapsed ? (
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center text-white font-semibold">
                JS
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">John Smith</p>
                <p className="text-xs text-muted-foreground">Online</p>
              </div>
              <Button variant="ghost" size="sm" asChild>
                <NavLink to="/settings">
                  <Settings className="h-4 w-4" />
                </NavLink>
              </Button>
            </div>
          ) : (
            <div className="flex justify-center">
              <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center text-white font-semibold">
                JS
              </div>
            </div>
          )}
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
