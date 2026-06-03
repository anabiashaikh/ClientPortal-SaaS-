"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CalendarDays, Filter } from "lucide-react";
import { format } from "date-fns";
import { AddMilestoneModal } from "@/components/projects/AddMilestoneModal";
import { useState } from "react";

export function TimelineClient({ events, projects }: { events: any[], projects: any[] }) {
  const [selectedProject, setSelectedProject] = useState("all");
  const [viewRange, setViewRange] = useState("month");

  const filteredEvents = selectedProject === "all" ? events : events.filter(e => e.project === projects.find(p => p.id === selectedProject)?.name);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Timeline</h1>
          <p className="text-muted-foreground mt-1">Track project milestones and deadlines.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
          <AddMilestoneModal projects={projects} />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <Select value={selectedProject} onValueChange={(v) => setSelectedProject(v as string)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Project">
              {selectedProject === "all" ? "All Projects" : projects.find((p: any) => p.id === selectedProject)?.name || "Project"}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all" label={"All Projects"}>All Projects</SelectItem>
            {projects.map(p => (
              <SelectItem key={p.id} value={p.id} label={p.name}>{p.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={viewRange} onValueChange={(v) => setViewRange(v ?? "month")}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="View">
              {{
                "week": "This Week",
                "month": "This Month",
                "quarter": "This Quarter"
              }[viewRange] || "View"}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="week" label={"This Week"}>This Week</SelectItem>
            <SelectItem value="month" label={"This Month"}>This Month</SelectItem>
            <SelectItem value="quarter" label={"This Quarter"}>This Quarter</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Upcoming Events</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative border-l-2 border-muted ml-4 space-y-8 pb-4">
            {filteredEvents.length === 0 && (
              <p className="text-sm text-muted-foreground ml-6">No upcoming events.</p>
            )}
            {filteredEvents.map((item) => (
              <div key={item.id} className="relative pl-6">
                {/* Timeline dot */}
                <div className={`absolute -left-[9px] top-1 h-4 w-4 rounded-full border-2 border-background ${
                  item.status === 'Completed' ? 'bg-emerald-500' : 
                  item.isUrgent ? 'bg-rose-500' : 'bg-primary'
                }`} />
                
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold">{item.title}</h3>
                      <Badge variant="outline" className="text-[10px]">{item.type}</Badge>
                      {item.isUrgent && (
                        <Badge variant="destructive" className="text-[10px]">Urgent</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{item.project}</p>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground shrink-0 bg-muted/50 px-3 py-1.5 rounded-md">
                    <CalendarDays className="h-4 w-4" />
                    {format(item.date, "MMM dd, yyyy")}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Gantt View Placeholder</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] flex items-center justify-center border border-dashed rounded-lg bg-muted/20">
            <p className="text-muted-foreground">Interactive Gantt Chart Component</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


