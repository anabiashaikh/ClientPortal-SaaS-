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
import { updateTask } from "@/app/actions/tasks";
import { useRouter } from "next/navigation";

export function EditTaskModal({ 
  task, 
  open,
  onOpenChange,
  teamMembers,
  users,
}: { 
  task: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  teamMembers?: any[];
  users?: any[];
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  // Format date
  const formatDateForInput = (dateValue: any) => {
    if (!dateValue) return "";
    const date = new Date(dateValue);
    if (isNaN(date.getTime())) return "";
    return date.toISOString().split("T")[0];
  };

  const [formData, setFormData] = useState({
    title: task?.title || "",
    description: task?.description || "",
    status: task?.status || "TODO",
    priority: task?.priority || "MEDIUM",
    dueDate: formatDateForInput(task?.dueDate),
    estimatedHours: task?.estimatedHours?.toString() || "",
    assigneeId: task?.assigneeId || "none",
  });

  const availableUsers = teamMembers ? teamMembers.map(tm => tm.user) : (users || []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateTask(task.id, {
        title: formData.title,
        description: formData.description,
        status: formData.status,
        priority: formData.priority,
        dueDate: formData.dueDate || null,
        estimatedHours: formData.estimatedHours ? parseFloat(formData.estimatedHours) : undefined,
        assigneeId: formData.assigneeId !== "none" ? formData.assigneeId : null,
      });

      onOpenChange(false);
      router.refresh();
    } catch (error) {
      console.error("Failed to update task:", error);
      alert("Failed to update task");
    } finally {
      setLoading(false);
    }
  };

  if (!task) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
            <DialogDescription>
              Update task details below.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto px-1">
            <div className="space-y-2">
              <Label htmlFor="title">Task Title <span className="text-destructive">*</span></Label>
              <Input
                id="title"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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
                      {{LOW: 'Low', MEDIUM: 'Medium', HIGH: 'High', CRITICAL: 'Critical'}[formData.priority as string] || 'Select priority'}
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
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Assignee</Label>
              <Select value={formData.assigneeId} onValueChange={(v) => setFormData({ ...formData, assigneeId: v as string })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select assignee">
                    {formData.assigneeId === "none" ? "Unassigned" : availableUsers.find(u => u.id === formData.assigneeId)?.name || availableUsers.find(u => u.id === formData.assigneeId)?.email || "Select assignee"}
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
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading || !formData.title}>
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}


