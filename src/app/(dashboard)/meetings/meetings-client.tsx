"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  Search,
  Video,
  Clock,
  Calendar,
  ExternalLink,
  FileText,
  Repeat,
  Zap,
  Eye,
  MessageSquare,
  Presentation,
} from "lucide-react";
import { ScheduleMeetingModal } from "@/components/meetings/ScheduleMeetingModal";
import { format } from "date-fns";

const typeConfig: Record<string, { icon: React.ElementType; color: string }> = {
  Kickoff: { icon: Zap, color: "text-emerald-600 bg-emerald-50 border-emerald-200 dark:text-emerald-400 dark:bg-emerald-950 dark:border-emerald-900" },
  "Weekly Sync": { icon: Repeat, color: "text-blue-600 bg-blue-50 border-blue-200 dark:text-blue-400 dark:bg-blue-950 dark:border-blue-900" },
  Review: { icon: Eye, color: "text-purple-600 bg-purple-50 border-purple-200 dark:text-purple-400 dark:bg-purple-950 dark:border-purple-900" },
  "Ad-hoc": { icon: MessageSquare, color: "text-amber-600 bg-amber-50 border-amber-200 dark:text-amber-400 dark:bg-amber-950 dark:border-amber-900" },
  Demo: { icon: Presentation, color: "text-rose-600 bg-rose-50 border-rose-200 dark:text-rose-400 dark:bg-rose-950 dark:border-rose-900" },
};

const statusColors: Record<string, string> = {
  SCHEDULED: "text-blue-600 bg-blue-50 border-blue-200 dark:text-blue-400 dark:bg-blue-950 dark:border-blue-900",
  COMPLETED: "text-emerald-600 bg-emerald-50 border-emerald-200 dark:text-emerald-400 dark:bg-emerald-950 dark:border-emerald-900",
  CANCELLED: "text-muted-foreground bg-muted border-border",
};

interface MeetingsClientProps {
  initialUpcoming: any[];
  initialPast: any[];
  projects: any[];
  users: any[];
}

export function MeetingsClient({ initialUpcoming, initialPast, projects, users }: MeetingsClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedProjectId, setSelectedProjectId] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filterMeetings = (meetingsList: any[]) => {
    return meetingsList.filter(m => {
      const matchesSearch = m.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = selectedType === "all" || m.type === selectedType;
      const matchesProject = selectedProjectId === "all" || m.projectId === selectedProjectId;
      return matchesSearch && matchesType && matchesProject;
    });
  };

  const upcoming = filterMeetings(initialUpcoming);
  const past = filterMeetings(initialPast);

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'U';
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Meetings</h1>
          <p className="text-muted-foreground mt-1">Schedule and manage all project meetings.</p>
        </div>
        <Button className="gap-2" onClick={() => setIsModalOpen(true)}>
          <Plus className="h-4 w-4" />
          Schedule Meeting
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search meetings..." 
            className="pl-9" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={selectedType} onValueChange={(v) => setSelectedType(v as string)}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Type">
              {selectedType === "all" ? "All Types" : selectedType}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all" label={"All Types"}>All Types</SelectItem>
            <SelectItem value="Kickoff" label={"Kickoff"}>Kickoff</SelectItem>
            <SelectItem value="Weekly Sync" label={"Weekly Sync"}>Weekly Sync</SelectItem>
            <SelectItem value="Review" label={"Review"}>Review</SelectItem>
            <SelectItem value="Ad-hoc" label={"Ad-hoc"}>Ad-hoc</SelectItem>
            <SelectItem value="Demo" label={"Demo"}>Demo</SelectItem>
          </SelectContent>
        </Select>
        <Select value={selectedProjectId} onValueChange={(v) => setSelectedProjectId(v as string)}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Project">
              {selectedProjectId === "all" ? "All Projects" : projects.find((p: any) => p.id === selectedProjectId)?.name || "Project"}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all" label={"All Projects"}>All Projects</SelectItem>
            {projects.map(p => (
              <SelectItem key={p.id} value={p.id} label={p.name}>{p.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="upcoming">
        <TabsList>
          <TabsTrigger value="upcoming">
            Upcoming ({upcoming.length})
          </TabsTrigger>
          <TabsTrigger value="past">
            Past ({past.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="mt-6 space-y-4">
          {upcoming.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground border rounded-lg border-dashed">
              No upcoming meetings.
            </div>
          ) : (
            upcoming.map((meeting) => {
              const TypeIcon = typeConfig[meeting.type]?.icon || Video;
              return (
                <Card key={meeting.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4 md:p-6">
                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                      <div className="flex items-center gap-4 flex-1 min-w-0">
                        <div className={`p-3 rounded-lg shrink-0 ${typeConfig[meeting.type]?.color || 'bg-muted'}`}>
                          <TypeIcon className="h-5 w-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-sm truncate">{meeting.title}</h3>
                          </div>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" /> {format(new Date(meeting.date), "MMM dd, yyyy")}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" /> {format(new Date(meeting.date), "h:mm a")} · {meeting.duration} min
                            </span>
                            <span className="text-muted-foreground">{meeting.project.name}</span>
                          </div>
                          {meeting.notes && (
                            <p className="text-xs text-muted-foreground mt-2 line-clamp-1">{meeting.notes}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-4 shrink-0">
                        <div className="flex -space-x-2">
                          {meeting.attendees.slice(0, 3).map((a: any) => (
                            <Avatar key={a.id} className="h-7 w-7 border-2 border-background">
                              <AvatarImage src={a.user.image} />
                              <AvatarFallback className="text-[10px]">{getInitials(a.user.name)}</AvatarFallback>
                            </Avatar>
                          ))}
                          {meeting.attendees.length > 3 && (
                            <div className="h-7 w-7 rounded-full bg-muted flex items-center justify-center text-[10px] font-medium border-2 border-background">
                              +{meeting.attendees.length - 3}
                            </div>
                          )}
                        </div>
                        {meeting.link && (
                          <a href={meeting.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-1 rounded-md text-sm font-medium border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3">
                            <Video className="h-3 w-3" /> Join
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </TabsContent>

        <TabsContent value="past" className="mt-6 space-y-4">
          {past.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground border rounded-lg border-dashed">
              No past meetings.
            </div>
          ) : (
            past.map((meeting) => {
              const TypeIcon = typeConfig[meeting.type]?.icon || Video;
              return (
                <Card key={meeting.id} className="opacity-80 hover:opacity-100 transition-opacity">
                  <CardContent className="p-4 md:p-6">
                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                      <div className="flex items-center gap-4 flex-1 min-w-0">
                        <div className={`p-3 rounded-lg shrink-0 ${typeConfig[meeting.type]?.color || 'bg-muted'}`}>
                          <TypeIcon className="h-5 w-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-sm truncate">{meeting.title}</h3>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap mt-1">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" /> {format(new Date(meeting.date), "MMM dd, yyyy")}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" /> {format(new Date(meeting.date), "h:mm a")} · {meeting.duration} min
                            </span>
                            <span>{meeting.project.name}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <Badge variant="outline" className={statusColors[meeting.status]}>
                          {meeting.status}
                        </Badge>
                        {meeting.notes && (
                          <Button variant="outline" size="sm" className="gap-1">
                            <FileText className="h-3 w-3" /> Notes
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </TabsContent>
      </Tabs>

      <ScheduleMeetingModal 
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        projects={projects}
        users={users}
        projectId={selectedProjectId === "all" ? undefined : selectedProjectId}
      />
    </div>
  );
}


