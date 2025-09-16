import { useState } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter
} from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import { Target, Calendar, TrendingUp, Settings, BookOpen, Zap } from "lucide-react";
import { Link, useLocation } from "wouter";
import ThemeToggle from "./ThemeToggle";

const navigationItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: Target,
    description: "Overview and stats"
  },
  {
    title: "My Challenges",
    url: "/challenges",
    icon: BookOpen,
    description: "Active and completed challenges"
  },
  {
    title: "Daily Tasks",
    url: "/tasks",
    icon: Calendar,
    description: "Today's study tasks"
  },
  {
    title: "Progress Tracker",
    url: "/progress",
    icon: TrendingUp,
    description: "Study analytics"
  },
  {
    title: "Streak Counter",
    url: "/streak",
    icon: Zap,
    description: "Study streaks and motivation"
  }
];

export function AppSidebar() {
  const [location] = useLocation();
  // todo: remove mock functionality
  const mockStats = {
    activeChallenges: 3,
    currentStreak: 12
  };

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-8 h-8 bg-primary rounded-md">
            <Target className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h2 className="font-semibold text-lg">JEE Challenge Hub</h2>
            <p className="text-xs text-muted-foreground">Master Your Preparation</p>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => {
                const isActive = location === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton 
                      asChild
                      className={isActive ? "bg-sidebar-accent" : ""}
                      data-testid={`nav-${item.title.toLowerCase().replace(' ', '-')}`}
                    >
                      <Link href={item.url}>
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        <SidebarGroup>
          <SidebarGroupLabel>Quick Stats</SidebarGroupLabel>
          <SidebarGroupContent>
            <div className="px-2 space-y-2">
              <div className="flex items-center justify-between p-2 rounded-md bg-sidebar-accent/50">
                <span className="text-sm">Active Challenges</span>
                <Badge variant="secondary" data-testid="badge-active-challenges">
                  {mockStats.activeChallenges}
                </Badge>
              </div>
              <div className="flex items-center justify-between p-2 rounded-md bg-sidebar-accent/50">
                <span className="text-sm">Current Streak</span>
                <Badge className="bg-chart-2 text-white" data-testid="badge-current-streak">
                  {mockStats.currentStreak} days
                </Badge>
              </div>
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Settings className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Settings</span>
          </div>
          <ThemeToggle />
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}