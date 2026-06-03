"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, MoreVertical, CalendarDays } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { NewProjectModal } from "@/components/projects/NewProjectModal";
import { EditProjectModal } from "@/components/projects/EditProjectModal";
import { deleteProject } from "@/app/actions/projects";
import { useState } from "react";

const statusColors: Record<string, string> = {
  ACTIVE: "text-emerald-600 bg-emerald-50 border-emerald-200 dark:text-emerald-400 dark:bg-emerald-950/50 dark:border-emerald-900",
  AT_RISK: "text-rose-600 bg-rose-50 border-rose-200 dark:text-rose-400 dark:bg-rose-950/50 dark:border-rose-900",
  ON_HOLD: "text-amber-600 bg-amber-50 border-amber-200 dark:text-amber-400 dark:bg-amber-950/50 dark:border-amber-900",
  COMPLETED: "text-blue-600 bg-blue-50 border-blue-200 dark:text-blue-400 dark:bg-blue-950/50 dark:border-blue-900",
};

export function ProjectsClient({ projects }: { projects: any[] }) {
  const [editingProject, setEditingProject] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");

  const filteredProjects = projects.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || (p.description || "").toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === "all" || p.status === selectedStatus.toUpperCase().replace("-", "_");
    return matchesSearch && matchesStatus;
  });

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to archive this project?")) {
      await deleteProject(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
          <p className="text-muted-foreground mt-1">Manage and track all your client projects.</p>
        </div>
        <NewProjectModal />
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search projects..." 
            className="pl-9" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={selectedStatus} onValueChange={(v) => setSelectedStatus(v ?? "all")}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Status">
              {{
                "all": "All Status",
                "active": "Active",
                "at-risk": "At Risk",
                "on-hold": "On Hold",
                "completed": "Completed"
              }[selectedStatus] || "Status"}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all" label={"All Status"}>All Status</SelectItem>
            <SelectItem value="active" label={"Active"}>Active</SelectItem>
            <SelectItem value="at-risk" label={"At Risk"}>At Risk</SelectItem>
            <SelectItem value="on-hold" label={"On Hold"}>On Hold</SelectItem>
            <SelectItem value="completed" label={"Completed"}>Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Project Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredProjects.length === 0 ? (
          <div className="col-span-full py-12 text-center border rounded-lg bg-muted/20">
            <h3 className="text-lg font-medium">No projects found</h3>
            <p className="text-sm text-muted-foreground mt-1">Try adjusting your filters or create a new project.</p>
          </div>
        ) : null}
        
        {filteredProjects.map((project) => (
          <Link key={project.id} href={`/projects/${project.id}`}>
            <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer group h-full">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="space-y-1 flex-1 min-w-0">
                    <CardTitle className="text-base font-semibold group-hover:text-primary transition-colors truncate">
                      {project.name}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground line-clamp-1">{project.description || "No description"}</p>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger 
                      className="h-8 w-8 inline-flex items-center justify-center rounded-md hover:bg-accent hover:text-accent-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => e.preventDefault()}
                    >
                      <MoreVertical className="h-4 w-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={(e) => { e.preventDefault(); setEditingProject(project); }}>Edit</DropdownMenuItem>
                      <DropdownMenuItem onClick={(e) => e.preventDefault()}>Duplicate</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive" onClick={(e) => { e.preventDefault(); handleDelete(project.id); }}>Archive</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant="outline" className={statusColors[project.status]}>
                    {project.status.replace("_", " ")}
                  </Badge>
                  {project.tags?.map((tag: any) => (
                    <Badge key={tag.id} variant="secondary" className="text-xs">
                      {tag.name}
                    </Badge>
                  ))}
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium">{project.progress}%</span>
                  </div>
                  <Progress value={project.progress} className="h-2" />
                </div>

                {project.budget !== null && (
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Budget</span>
                      <span className={`font-medium ${
                        ((project.budgetUsed || 0) / project.budget) >= 0.9 ? 'text-rose-500' :
                        ((project.budgetUsed || 0) / project.budget) >= 0.8 ? 'text-amber-500' :
                        'text-foreground'
                      }`}>
                        ${(project.budgetUsed || 0).toLocaleString()} / ${project.budget.toLocaleString()}
                      </span>
                    </div>
                    <Progress
                      value={((project.budgetUsed || 0) / project.budget) * 100}
                      className={`h-1.5 ${
                        ((project.budgetUsed || 0) / project.budget) >= 0.9 ? '[&>div]:bg-rose-500' :
                        ((project.budgetUsed || 0) / project.budget) >= 0.8 ? '[&>div]:bg-amber-500' :
                        ''
                      }`}
                    />
                  </div>
                )}

                <div className="flex items-center justify-between pt-2 border-t">
                  <div className="flex -space-x-2">
                    {project.team?.slice(0, 4).map((member: any, i: number) => (
                      <Avatar key={i} className="h-7 w-7 border-2 border-background">
                        <AvatarImage src={member.user.image || ""} alt={member.user.name || "User"} />
                        <AvatarFallback className="text-[10px]">{member.user.name?.substring(0, 2).toUpperCase() || "U"}</AvatarFallback>
                      </Avatar>
                    ))}
                    {project.team && project.team.length > 4 && (
                      <div className="h-7 w-7 rounded-full bg-muted flex items-center justify-center text-[10px] font-medium border-2 border-background">
                        +{project.team.length - 4}
                      </div>
                    )}
                  </div>
                  {project.endDate && (
                    <div className="flex items-center text-xs text-muted-foreground">
                      <CalendarDays className="h-3 w-3 mr-1" />
                      {new Date(project.endDate).toLocaleDateString()}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {editingProject && (
        <EditProjectModal
          project={editingProject}
          open={!!editingProject}
          onOpenChange={(open) => !open && setEditingProject(null)}
        />
      )}
    </div>
  );
}

