
import React from "react";
import { Link } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  FileText,
  MessageSquare,
  AlertTriangle,
  Clock
} from "lucide-react";
import {
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";

interface SidebarProps {
  isMobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

export const Sidebar = ({ isMobileOpen, setMobileOpen }: SidebarProps) => {
  const navigationItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Users", href: "/users", icon: Users },
    { name: "Posts", href: "/posts", icon: FileText },
    { name: "Comments", href: "/comments", icon: MessageSquare },
    { name: "Reports", href: "/reports", icon: AlertTriangle },
    { name: "Sessions", href: "/sessions", icon: Clock },
  ];

  // Close mobile sidebar when navigating
  const handleNavigation = () => {
    if (isMobileOpen) {
      setMobileOpen(false);
    }
  };

  return (
    <>
      <SidebarContent>
        <SidebarHeader>
          <div className="flex items-center h-16 px-3">
            <Link to="/dashboard" className="flex items-center gap-2 font-semibold" onClick={handleNavigation}>
              <img 
                src="/Drooid_Logo_wordmark.png" 
                alt="Drooid Logo" 
                className="h-8 object-contain" 
              />
            </Link>
          </div>
        </SidebarHeader>

        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={item.href === window.location.pathname}
                    tooltip={item.name}
                    className="text-white hover:text-droid-orange"
                  >
                    <Link to={item.href} onClick={handleNavigation}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />
      </SidebarContent>
    </>
  );
};
