"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUIStore } from "@/store/uiStore";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  FolderKanban,
  Files,
  CalendarDays,
  Users,
  CheckSquare,
  BarChart3,
  LogOut,
  Settings,
} from "lucide-react";

const navItems = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Projects", href: "/projects", icon: FolderKanban },
  { name: "Assets", href: "/assets", icon: Files },
  { name: "Timeline", href: "/timeline", icon: CalendarDays },
  { name: "Meetings", href: "/meetings", icon: Users },
  { name: "Tasks", href: "/tasks", icon: CheckSquare },
  { name: "Reports", href: "/reports", icon: BarChart3 },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { isSidebarOpen } = useUIStore();

  if (!isSidebarOpen) return null;

  return (
    <aside className="w-64 bg-sidebar text-sidebar-foreground flex flex-col h-screen border-r border-sidebar-border hidden md:flex transition-all duration-300">
      <div className="h-16 flex items-center px-6 font-bold text-xl tracking-tight text-sidebar-primary">
        ClientPortal
      </div>

      <div className="flex-1 overflow-y-auto py-4 px-3 flex flex-col gap-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors text-sm font-medium",
                isActive
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.name}
            </Link>
          );
        })}
      </div>

      <div className="p-4 border-t border-sidebar-border flex flex-col gap-1">
        <Link
          href="/settings"
          className="flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors text-sm font-medium text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        >
          <Settings className="h-4 w-4" />
          Settings
        </Link>
        <button className="flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors text-sm font-medium text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground text-left w-full">
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </aside>
  );
}
