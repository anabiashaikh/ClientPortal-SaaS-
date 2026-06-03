"use client";

import { ReactNode } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import CommandMenu from "./CommandMenu";
import { TooltipProvider } from "@/components/ui/tooltip";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <TooltipProvider>
      <div className="flex h-screen bg-background overflow-hidden">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <Header />
          <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
            {children}
          </main>
        </div>
        <CommandMenu />
      </div>
    </TooltipProvider>
  );
}

