"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUIStore } from "@/store/uiStore";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  LayoutDashboard,
  FolderKanban,
  Files,
  CalendarDays,
  Users,
  CheckSquare,
  BarChart3,
  Settings,
} from "lucide-react";

const navCommands = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Projects", href: "/projects", icon: FolderKanban },
  { name: "Assets", href: "/assets", icon: Files },
  { name: "Timeline", href: "/timeline", icon: CalendarDays },
  { name: "Meetings", href: "/meetings", icon: Users },
  { name: "Tasks", href: "/tasks", icon: CheckSquare },
  { name: "Reports", href: "/reports", icon: BarChart3 },
  { name: "Settings", href: "/settings", icon: Settings },
];

export default function CommandMenu() {
  const router = useRouter();
  const { isCommandMenuOpen, setCommandMenuOpen } = useUIStore();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setCommandMenuOpen(!isCommandMenuOpen);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [isCommandMenuOpen, setCommandMenuOpen]);

  const runCommand = (command: () => void) => {
    setCommandMenuOpen(false);
    command();
  };

  return (
    <CommandDialog open={isCommandMenuOpen} onOpenChange={setCommandMenuOpen}>
      <CommandInput placeholder="Search projects, tasks, files..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Navigation">
          {navCommands.map((item) => (
            <CommandItem
              key={item.name}
              onSelect={() => runCommand(() => router.push(item.href))}
            >
              <item.icon className="mr-2 h-4 w-4" />
              <span>{item.name}</span>
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Quick Actions">
          <CommandItem onSelect={() => runCommand(() => router.push("/tasks?new=true"))}>
            <CheckSquare className="mr-2 h-4 w-4" />
            <span>Create New Task</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push("/meetings?new=true"))}>
            <Users className="mr-2 h-4 w-4" />
            <span>Schedule Meeting</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push("/projects?new=true"))}>
            <FolderKanban className="mr-2 h-4 w-4" />
            <span>Create New Project</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
