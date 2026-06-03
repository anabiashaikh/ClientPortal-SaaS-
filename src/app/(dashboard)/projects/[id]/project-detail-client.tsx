"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  CalendarDays,
  DollarSign,
  Users,
  FileText,
  CheckSquare,
  Clock,
  MoreVertical,
} from "lucide-react";
import Link from "next/link";

import { NewTaskModal } from "@/components/tasks/NewTaskModal";
import { EditTaskModal } from "@/components/tasks/EditTaskModal";
import { AddMemberModal } from "@/components/projects/AddMemberModal";
import { EditProjectModal } from "@/components/projects/EditProjectModal";
import { AddMilestoneModal } from "@/components/projects/AddMilestoneModal";
import { UploadFileModal } from "@/components/assets/UploadFileModal";
import { deleteProject } from "@/app/actions/projects";
import { updateMilestone, deleteMilestone } from "@/app/actions/projects";
import { deleteTask } from "@/app/actions/tasks";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const statusColors: Record<string, string> = {
  ACTIVE: "text-emerald-600 bg-emerald-50 border-emerald-200",
  AT_RISK: "text-rose-600 bg-rose-50 border-rose-200",
  ON_HOLD: "text-amber-600 bg-amber-50 border-amber-200",
  COMPLETED: "text-blue-600 bg-blue-50 border-blue-200",
};

const taskStatusColors: Record<string, string> = {
  DONE: "text-emerald-600 bg-emerald-50 border-emerald-200",
  IN_PROGRESS: "text-blue-600 bg-blue-50 border-blue-200",
  TODO: "text-muted-foreground bg-muted border-border",
  IN_REVIEW: "text-amber-600 bg-amber-50 border-amber-200",
  BACKLOG: "text-gray-500 bg-gray-50 border-gray-200",
};

const priorityColors: Record<string, string> = {
  CRITICAL: "text-rose-600",
  HIGH: "text-orange-600",
  MEDIUM: "text-amber-600",
  LOW: "text-muted-foreground",
};

export function ProjectDetailClient({ project }: { project: any }) {
  const router = useRouter();
  const [editingProject, setEditingProject] = useState<any>(null);
  const [editingTask, setEditingTask] = useState<any>(null);
  const [isFileModalOpen, setIsFileModalOpen] = useState(false);

  const handleDelete = async () => {
    if (confirm("Are you sure you want to archive this project?")) {
      await deleteProject(project.id);
      router.push("/projects");
    }
  };

  const handleDeleteTask = async (id: string) => {
    if (confirm("Are you sure you want to delete this task?")) {
      await deleteTask(id);
      router.refresh();
    }
  };

  const handleToggleMilestone = async (id: string, completed: boolean) => {
    await updateMilestone(id, { completed });
    router.refresh();
  };

  const handleDeleteMilestone = async (id: string) => {
    if (confirm("Are you sure you want to delete this milestone?")) {
      await deleteMilestone(id);
      router.refresh();
    }
  };

  const budgetPercent = project.budget ? ((project.budgetUsed || 0) / project.budget) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/projects">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight">{project.name}</h1>
            <Badge variant="outline" className={statusColors[project.status]}>
              {project.status}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-0.5">{project.client}</p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger render={
            <Button variant="outline" size="icon">
              <MoreVertical className="h-4 w-4" />
            </Button>
          } />
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setEditingProject(project)}>Edit Project</DropdownMenuItem>
            <DropdownMenuItem className="text-destructive" onClick={handleDelete}>Archive Project</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <CheckSquare className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Progress</p>
                <p className="text-lg font-bold">{project.progress}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <DollarSign className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Budget Used</p>
                <p className="text-lg font-bold">${(project.budgetUsed || 0).toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Users className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Team Members</p>
                <p className="text-lg font-bold">{project.team?.length || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <CalendarDays className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Deadline</p>
                <p className="text-lg font-bold">{project.endDate ? new Date(project.endDate).toLocaleDateString() : "No deadline"}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="files">Files</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6 mt-6">
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Description */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-base">Project Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {project.description}
                </p>
              </CardContent>
            </Card>

            {/* Budget Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Budget Tracker</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <p className="text-3xl font-bold">${(project.budgetUsed || 0).toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">of ${(project.budget || 0).toLocaleString()}</p>
                </div>
                <Progress
                  value={budgetPercent}
                  className={`h-3 ${budgetPercent >= 90 ? '[&>div]:bg-rose-500' : budgetPercent >= 80 ? '[&>div]:bg-amber-500' : ''}`}
                />
                <p className="text-xs text-center text-muted-foreground">
                  ${((project.budget || 0) - (project.budgetUsed || 0)).toLocaleString()} remaining
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Milestones */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-base">Milestones</CardTitle>
              <AddMilestoneModal projectId={project.id} />
            </CardHeader>
            <CardContent>
              <div className="relative mt-2">
                <div className="absolute left-4 top-0 bottom-0 w-px bg-border" />
                <div className="space-y-6">
                  {project.milestones?.length === 0 && (
                    <p className="text-sm text-muted-foreground ml-8">No milestones added yet.</p>
                  )}
                  {project.milestones?.map((milestone: any, i: number) => (
                    <div key={milestone.id} className="flex items-start gap-4 relative group">
                      <div 
                        className={`w-8 h-8 rounded-full flex items-center justify-center z-10 cursor-pointer transition-colors ${
                          milestone.completed
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted border-2 border-border hover:border-primary'
                        }`}
                        onClick={() => handleToggleMilestone(milestone.id, !milestone.completed)}
                      >
                        {milestone.completed ? (
                          <CheckSquare className="h-4 w-4" />
                        ) : (
                          <Clock className="h-4 w-4 text-muted-foreground" />
                        )}
                      </div>
                      <div className="flex-1 pt-1 flex justify-between items-start">
                        <div>
                          <p className={`text-sm font-medium ${milestone.completed ? '' : 'text-muted-foreground'}`}>
                            {milestone.name}
                          </p>
                          <p className="text-xs text-muted-foreground">{new Date(milestone.date).toLocaleDateString()}</p>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-6 w-6 opacity-0 group-hover:opacity-100 text-destructive transition-opacity"
                          onClick={() => handleDeleteMilestone(milestone.id)}
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tasks" className="mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">Project Tasks</CardTitle>
              <NewTaskModal projectId={project.id} teamMembers={project.team || []} />
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {project.tasks?.map((task: any) => (
                  <div
                    key={task.id}
                    className="flex items-center gap-4 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors cursor-pointer"
                    onClick={() => setEditingTask(task)}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-sm font-medium truncate">{task.title}</p>
                        <Badge variant="outline" className={`text-[10px] h-4 ${priorityColors[task.priority]}`}>
                          {task.priority}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <Badge variant="secondary" className="text-[10px] h-4 font-normal">
                          {task.status.replace("_", " ")}
                        </Badge>
                        {task.dueDate && (
                          <span className="flex items-center">
                            <CalendarDays className="h-3 w-3 mr-1" />
                            {new Date(task.dueDate).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                    {task.assignee && (
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="text-xs">{task.assignee.name?.substring(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                    )}
                    <DropdownMenu>
                      <DropdownMenuTrigger render={
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => e.stopPropagation()}>
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      } />
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={(e) => { e.stopPropagation(); setEditingTask(task); }}>Edit</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive" onClick={(e) => { e.stopPropagation(); handleDeleteTask(task.id); }}>Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="files" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Project Files</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex h-[200px] items-center justify-center border border-dashed rounded-md bg-muted/20">
                <div className="text-center">
                  <FileText className="h-10 w-10 mx-auto text-muted-foreground/50 mb-2" />
                  <p className="text-sm text-muted-foreground">No files uploaded yet</p>
                  <Button variant="outline" size="sm" className="mt-3" onClick={() => setIsFileModalOpen(true)}>Upload Files</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="timeline" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Project Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex h-[200px] items-center justify-center border border-dashed rounded-md bg-muted/20">
                <p className="text-sm text-muted-foreground">Gantt chart will appear here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="team" className="mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">Team Members</CardTitle>
              <AddMemberModal
                projectId={project.id}
                existingMemberIds={project.team?.map((m: any) => m.userId) || []}
              />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {project.team?.map((member: any, i: number) => (
                  <div key={i} className="flex items-center gap-4 p-3 rounded-lg border">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback>{member.user?.name?.substring(0, 2).toUpperCase() || "U"}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{member.user?.name || member.user?.email}</p>
                      <p className="text-xs text-muted-foreground">{member.role || "Team Member"}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {editingProject && (
        <EditProjectModal
          project={editingProject}
          open={!!editingProject}
          onOpenChange={(open) => !open && setEditingProject(null)}
        />
      )}
      {editingTask && (
        <EditTaskModal 
          task={editingTask} 
          open={!!editingTask} 
          onOpenChange={(open) => !open && setEditingTask(null)}
          teamMembers={project.team || []}
        />
      )}

      <UploadFileModal
        open={isFileModalOpen}
        onOpenChange={setIsFileModalOpen}
        projects={[{ id: project.id, name: project.name }]}
        folders={[]}
        projectId={project.id}
      />
    </div>
  );
}
