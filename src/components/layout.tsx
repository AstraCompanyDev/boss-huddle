import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { ThemeToggle } from "@/components/theme-toggle";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
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
