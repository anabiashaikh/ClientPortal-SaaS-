"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Plus,
  Search,
  LayoutGrid,
  List,
  MoreVertical,
  Clock,
  Calendar,
  MessageSquare,
  Paperclip,
} from "lucide-react";

import { NewTaskModal } from "@/components/tasks/NewTaskModal";
import { EditTaskModal } from "@/components/tasks/EditTaskModal";
import { deleteTask } from "@/app/actions/tasks";
import { useRouter } from "next/navigation";

const columns = ["BACKLOG", "TODO", "IN_PROGRESS", "IN_REVIEW", "DONE"];

const priorityColors: Record<string, string> = {
  CRITICAL: "bg-rose-100 text-rose-700 border-rose-200 dark:bg-rose-950 dark:text-rose-400 dark:border-rose-900",
  HIGH: "bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-950 dark:text-orange-400 dark:border-orange-900",
  MEDIUM: "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-400 dark:border-amber-900",
  LOW: "bg-muted text-muted-foreground border-border",
};

const columnColors: Record<string, string> = {
  BACKLOG: "border-t-slate-400",
  TODO: "border-t-blue-400",
  IN_PROGRESS: "border-t-amber-400",
  IN_REVIEW: "border-t-purple-400",
  DONE: "border-t-emerald-400",
};

const formatColumnName = (col: string) => {
  return col.replace("_", " ");
};

export function TasksClient({ 
  initialTasks, 
  projects, 
  users 
}: { 
  initialTasks: any[]; 
  projects: any[]; 
  users: any[]; 
}) {
  const router = useRouter();
  const [view, setView] = useState<"kanban" | "list">("kanban");
  const [editingTask, setEditingTask] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPriority, setSelectedPriority] = useState("all");
  const [selectedProjectId, setSelectedProjectId] = useState("all");

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this task?")) {
      await deleteTask(id);
      router.refresh();
    }
  };

  const tasks = initialTasks.filter((t) => {
    const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) || (t.description || "").toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPriority = selectedPriority === "all" || t.priority === selectedPriority.toUpperCase();
    const matchesProject = selectedProjectId === "all" || t.projectId === selectedProjectId;
    return matchesSearch && matchesPriority && matchesProject;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tasks</h1>
          <p className="text-muted-foreground mt-1">Manage and track all tasks across projects.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex border rounded-md">
            <Button
              variant={view === "kanban" ? "default" : "ghost"}
              size="sm"
              onClick={() => setView("kanban")}
              className="rounded-r-none gap-1"
            >
              <LayoutGrid className="h-4 w-4" /> Board
            </Button>
            <Button
              variant={view === "list" ? "default" : "ghost"}
              size="sm"
              onClick={() => setView("list")}
              className="rounded-l-none gap-1"
            >
              <List className="h-4 w-4" /> List
            </Button>
          </div>
          <NewTaskModal projects={projects} users={users} />
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search tasks..." 
            className="pl-9" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={selectedPriority} onValueChange={(v) => setSelectedPriority(v ?? "all")}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Priority">
              {{
                "all": "All Priority",
                "critical": "Critical",
                "high": "High",
                "medium": "Medium",
                "low": "Low"
              }[selectedPriority] || "Priority"}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all" label={"All Priority"}>All Priority</SelectItem>
            <SelectItem value="critical" label={"Critical"}>Critical</SelectItem>
            <SelectItem value="high" label={"High"}>High</SelectItem>
            <SelectItem value="medium" label={"Medium"}>Medium</SelectItem>
            <SelectItem value="low" label={"Low"}>Low</SelectItem>
          </SelectContent>
        </Select>
        <Select value={selectedProjectId} onValueChange={(v) => setSelectedProjectId(v ?? "all")}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Project">
              {selectedProjectId === "all" ? "All Projects" : projects.find((p: any) => p.id === selectedProjectId)?.name || "Project"}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all" label={"All Projects"}>All Projects</SelectItem>
            {projects.map((project) => (
              <SelectItem key={project.id} value={project.id} label={project.name}>{project.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {view === "kanban" ? (
        <div className="flex gap-4 overflow-x-auto pb-4">
          {columns.map((col) => {
            const colTasks = tasks.filter((t) => t.status === col);
            return (
              <div key={col} className="min-w-[300px] flex-1">
                <div className={`bg-muted/30 rounded-lg border border-t-4 ${columnColors[col]}`}>
                  <div className="p-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-sm capitalize">{formatColumnName(col)}</h3>
                      <Badge variant="secondary" className="text-xs rounded-full h-5 w-5 flex items-center justify-center p-0">
                        {colTasks.length}
                      </Badge>
                    </div>
                    <NewTaskModal 
                      projects={projects} 
                      users={users} 
                      defaultStatus={col}
                      trigger={
                        <Button variant="ghost" size="icon" className="h-6 w-6">
                          <Plus className="h-3 w-3" />
                        </Button>
                      } 
                    />
                  </div>
                  <div className="p-2 space-y-2 min-h-[200px]">
                    {colTasks.map((task) => (
                      <Card key={task.id} className="cursor-pointer hover:shadow-md transition-shadow">
                        <CardContent className="p-3 space-y-3">
                          <div className="flex items-start justify-between gap-2">
                            <p className="text-sm font-medium leading-tight">{task.title}</p>
                            <DropdownMenu>
                              <DropdownMenuTrigger className="h-6 w-6 shrink-0 inline-flex items-center justify-center rounded-md hover:bg-accent hover:text-accent-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring">
                                <MoreVertical className="h-3 w-3" />
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => setEditingTask(task)}>Edit</DropdownMenuItem>
                                <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(task.id)}>Delete</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <Badge variant="outline" className={`text-xs ${priorityColors[task.priority]}`}>
                              {task.priority}
                            </Badge>
                            <span className="text-xs text-muted-foreground">{task.project?.name || "No Project"}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            {task.assignee ? (
                              <Avatar className="h-6 w-6">
                                <AvatarFallback className="text-[10px]">{task.assignee.name?.substring(0, 2).toUpperCase()}</AvatarFallback>
                              </Avatar>
                            ) : (
                              <Avatar className="h-6 w-6 border-dashed border-2 bg-transparent">
                                <AvatarFallback className="text-[10px] text-muted-foreground bg-transparent">?</AvatarFallback>
                              </Avatar>
                            )}
                            <div className="flex items-center gap-3 text-xs text-muted-foreground">
                              {task._count?.comments > 0 && (
                                <span className="flex items-center gap-0.5">
                                  <MessageSquare className="h-3 w-3" /> {task._count.comments}
                                </span>
                              )}
                              {task.dueDate && (
                                <span className="flex items-center gap-0.5">
                                  <Calendar className="h-3 w-3" /> {new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                </span>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/30">
                    <th className="text-left p-3 text-xs font-medium text-muted-foreground">Task</th>
                    <th className="text-left p-3 text-xs font-medium text-muted-foreground">Status</th>
                    <th className="text-left p-3 text-xs font-medium text-muted-foreground">Priority</th>
                    <th className="text-left p-3 text-xs font-medium text-muted-foreground">Assignee</th>
                    <th className="text-left p-3 text-xs font-medium text-muted-foreground">Project</th>
                    <th className="text-left p-3 text-xs font-medium text-muted-foreground">Due</th>
                    <th className="text-left p-3 text-xs font-medium text-muted-foreground">Hours</th>
                  </tr>
                </thead>
                <tbody>
                  {tasks.map((task) => (
                    <tr key={task.id} className="border-b last:border-0 hover:bg-muted/20 transition-colors cursor-pointer" onClick={() => setEditingTask(task)}>
                      <td className="p-3">
                        <p className="text-sm font-medium">{task.title}</p>
                        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{task.description}</p>
                      </td>
                      <td className="p-3">
                        <Badge variant="outline" className="text-xs">{formatColumnName(task.status)}</Badge>
                      </td>
                      <td className="p-3">
                        <Badge variant="outline" className={`text-xs ${priorityColors[task.priority]}`}>
                          {task.priority}
                        </Badge>
                      </td>
                      <td className="p-3">
                        {task.assignee ? (
                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarFallback className="text-[10px]">{task.assignee.name?.substring(0, 2).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <span className="text-sm">{task.assignee.name}</span>
                          </div>
                        ) : (
                          <span className="text-sm text-muted-foreground">Unassigned</span>
                        )}
                      </td>
                      <td className="p-3 text-sm text-muted-foreground">{task.project?.name || "-"}</td>
                      <td className="p-3 text-sm text-muted-foreground">{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "-"}</td>
                      <td className="p-3">
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Clock className="h-3 w-3" /> {task.estimatedHours || 0}h
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {editingTask && (
        <EditTaskModal 
          task={editingTask} 
          open={!!editingTask} 
          onOpenChange={(open) => !open && setEditingTask(null)}
          users={users}
        />
      )}
    </div>
  );
}

