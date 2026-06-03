"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createTask } from "@/app/actions/tasks";
import { Plus, CheckSquare } from "lucide-react";
import { useRouter } from "next/navigation";

export function NewTaskModal({ 
  projectId: defaultProjectId, 
  teamMembers,
  projects,
  users,
  trigger,
  defaultStatus
}: { 
  projectId?: string; 
  teamMembers?: any[];
  projects?: any[];
  users?: any[];
  trigger?: React.ReactNode;
  defaultStatus?: any;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: defaultStatus || "TODO",
    priority: "MEDIUM" as any,
    dueDate: "",
    estimatedHours: "",
    assigneeId: "none",
    projectId: defaultProjectId || "none",
  });

  const availableUsers = teamMembers ? teamMembers.map(tm => tm.user) : (users || []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createTask({
        title: formData.title,
        description: formData.description,
        status: formData.status,
        priority: formData.priority,
        dueDate: formData.dueDate || undefined,
        estimatedHours: formData.estimatedHours ? parseFloat(formData.estimatedHours) : undefined,
        projectId: formData.projectId !== "none" ? formData.projectId : (defaultProjectId as string),
        assigneeId: formData.assigneeId !== "none" ? formData.assigneeId : undefined,
      });

      setOpen(false);
      setFormData({
        title: "",
        description: "",
        status: "TODO",
        priority: "MEDIUM",
        dueDate: "",
        estimatedHours: "",
        assigneeId: "none",
        projectId: defaultProjectId || "none",
      });
      router.refresh();
    } catch (error) {
      console.error("Failed to create task:", error);
      alert("Failed to create task");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={
        (trigger as React.ReactElement) ?? (
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            New Task
          </Button>
        )
      } />
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create New Task</DialogTitle>
            <DialogDescription>
              Add a new task to this project.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Task Title <span className="text-destructive">*</span></Label>
              <Input
                id="title"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. Design Homepage"
              />
            </div>
            
            {!defaultProjectId && projects && (
              <div className="space-y-2">
                <Label htmlFor="project">Project <span className="text-destructive">*</span></Label>
                <Select value={formData.projectId} onValueChange={(v) => setFormData({ ...formData, projectId: v as any })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select project">
                      {formData.projectId === "none" ? "Select a project..." : projects?.find(p => p.id === formData.projectId)?.name || "Select project"}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none" label={"Select a project..."}>Select a project...</SelectItem>
                    {projects.map((p) => (
                      <SelectItem key={p.id} value={p.id} label={p.name}>{p.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Task details..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={formData.status} onValueChange={(v) => setFormData({ ...formData, status: v as any })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status">
                      {{BACKLOG: 'Backlog', TODO: 'To Do', IN_PROGRESS: 'In Progress', IN_REVIEW: 'In Review', DONE: 'Done'}[formData.status as string] || 'Select status'}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BACKLOG" label={"Backlog"}>Backlog</SelectItem>
                    <SelectItem value="TODO" label={"To Do"}>To Do</SelectItem>
                    <SelectItem value="IN_PROGRESS" label={"In Progress"}>In Progress</SelectItem>
                    <SelectItem value="IN_REVIEW" label={"In Review"}>In Review</SelectItem>
                    <SelectItem value="DONE" label={"Done"}>Done</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Priority</Label>
                <Select value={formData.priority} onValueChange={(v) => setFormData({ ...formData, priority: v as any })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority">
                      {{LOW: 'Low', MEDIUM: 'Medium', HIGH: 'High', URGENT: 'Urgent'}[formData.priority as string] || 'Select priority'}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="LOW" label={"Low"}>Low</SelectItem>
                    <SelectItem value="MEDIUM" label={"Medium"}>Medium</SelectItem>
                    <SelectItem value="HIGH" label={"High"}>High</SelectItem>
                    <SelectItem value="CRITICAL" label={"Critical"}>Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dueDate">Due Date</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="estimatedHours">Est. Hours</Label>
                <Input
                  id="estimatedHours"
                  type="number"
                  min="0"
                  step="0.5"
                  value={formData.estimatedHours}
                  onChange={(e) => setFormData({ ...formData, estimatedHours: e.target.value })}
                  placeholder="e.g. 4"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Assignee</Label>
              <Select value={formData.assigneeId} onValueChange={(v) => setFormData({ ...formData, assigneeId: v as string })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select assignee">
                    {formData.assigneeId === "none" ? "Unassigned" : availableUsers?.find(u => u.id === formData.assigneeId)?.name || availableUsers?.find(u => u.id === formData.assigneeId)?.email || "Select assignee"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none" label={"Unassigned"}>Unassigned</SelectItem>
                  {availableUsers.map((user) => (
                    <SelectItem key={user.id} value={user.id} label={user.name || user.email || "Unknown"}>
                      {user.name || user.email || "Unknown"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading || !formData.title || (!defaultProjectId && formData.projectId === "none")}>
              {loading ? "Creating..." : "Create Task"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}


