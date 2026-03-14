import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ThemeToggle } from "@/components/theme-toggle";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<{ full_name: string | null; role: string | null; avatar_url: string | null } | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from("profiles")
          .select("full_name, role, avatar_url")
          .eq("id", user.id)
          .single();
        if (data) setProfile(data);
      }
    };
    fetchProfile();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      fetchProfile();
    });
    return () => subscription.unsubscribe();
  }, []);

  const getInitials = (name: string | null) => {
    if (!name) return "?";
    return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col min-w-0">
          {/* Top Header */}
          <header className="h-16 border-b bg-card px-6 flex items-center justify-between shrink-0">
            <div className="flex items-center space-x-4">
              <SidebarTrigger className="md:hidden" />
            </div>

            <div className="flex items-center space-x-3">
              <ThemeToggle />

              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => navigate('/settings')}
                className="text-muted-foreground hover:text-foreground"
              >
                <Settings className="h-5 w-5" />
              </Button>

              {/* User Profile */}
              <div className="flex items-center space-x-3 pl-3 border-l">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-semibold">{profile?.full_name || "User"}</p>
                  <p className="text-xs text-muted-foreground">{profile?.role || "Member"}</p>
                </div>
                <div 
                  className="w-9 h-9 rounded-full bg-foreground flex items-center justify-center text-background text-sm font-semibold cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => navigate('/settings')}
                >
                  {getInitials(profile?.full_name)}
                </div>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 p-6 overflow-auto bg-secondary/30">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
