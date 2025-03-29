
import React, { ReactNode, useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Navbar } from "./Navbar";
import { Sidebar } from "./Sidebar";

interface DashboardLayoutProps {
  children: ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50 dark:bg-gray-900">
        <div 
          className="hidden md:block w-[160px] bg-droid-gray transition-all duration-300"
          style={{ 
            "--sidebar-width": "160px", 
            "--sidebar-width-icon": "3rem" 
          } as React.CSSProperties}
        >
          <Sidebar isMobileOpen={isMobileSidebarOpen} setMobileOpen={setIsMobileSidebarOpen} />
        </div>
        
        <div className="flex-1 flex flex-col">
          <Navbar onMenuClick={() => setIsMobileSidebarOpen(true)} />
          
          <main className="flex-1 overflow-auto p-4 md:p-6 bg-gray-50 dark:bg-gray-900">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};
