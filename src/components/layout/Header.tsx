"use client";

import { useUIStore } from "@/store/uiStore";
import { Menu, Search, Bell } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Header() {
  const { toggleSidebar, setCommandMenuOpen, userAvatar } = useUIStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const avatarSrc = mounted ? userAvatar : "https://github.com/shadcn.png";

  return (
    <header className="h-16 border-b border-border bg-background flex items-center justify-between px-4 lg:px-6 sticky top-0 z-10">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={toggleSidebar} className="md:hidden">
          <Menu className="h-5 w-5" />
        </Button>
        
        <div className="hidden sm:block">
          <Button
            variant="outline"
            className="w-64 justify-start text-muted-foreground"
            onClick={() => setCommandMenuOpen(true)}
          >
            <Search className="mr-2 h-4 w-4" />
            <span>Search projects, tasks...</span>
            <kbd className="pointer-events-none ml-auto inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
              <span className="text-xs">⌘</span>K
            </kbd>
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger render={
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-destructive" />
            </Button>
          } />
          <DropdownMenuContent className="w-80" align="end">
            <div className="px-2 py-1.5 text-sm font-semibold">Notifications</div>
            <DropdownMenuSeparator />
            <div className="max-h-80 overflow-y-auto">
              <DropdownMenuItem className="flex flex-col items-start p-3 cursor-pointer">
                <span className="font-medium text-sm">New task assigned</span>
                <span className="text-xs text-muted-foreground mt-1">You were assigned to "Design Homepage"</span>
                <span className="text-[10px] text-muted-foreground mt-2">10 minutes ago</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="flex flex-col items-start p-3 cursor-pointer">
                <span className="font-medium text-sm">Project update</span>
                <span className="text-xs text-muted-foreground mt-1">"Website Redesign" status changed to IN PROGRESS</span>
                <span className="text-[10px] text-muted-foreground mt-2">1 hour ago</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="flex flex-col items-start p-3 cursor-pointer">
                <span className="font-medium text-sm">Meeting reminder</span>
                <span className="text-xs text-muted-foreground mt-1">"Weekly Sync" starts in 15 minutes</span>
                <span className="text-[10px] text-muted-foreground mt-2">2 hours ago</span>
              </DropdownMenuItem>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="justify-center text-primary text-sm font-medium cursor-pointer">
              Mark all as read
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger className="relative h-8 w-8 rounded-full outline-none ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
            <div className="h-8 w-8 rounded-full overflow-hidden">
                <img key={avatarSrc} src={avatarSrc} alt="User" className="h-full w-full object-cover" />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end">
            <div className="px-2 py-1.5 text-sm font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">Admin User</p>
                <p className="text-xs leading-none text-muted-foreground">
                  admin@example.com
                </p>
              </div>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Log out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
