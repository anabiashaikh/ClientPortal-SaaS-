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
import { updateProject } from "@/app/actions/projects";
import { useRouter } from "next/navigation";

export function EditProjectModal({
  project,
  open,
  onOpenChange,
}: {
  project: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  // Format dates for input fields (YYYY-MM-DD)
  const formatDateForInput = (dateValue: any) => {
    if (!dateValue) return "";
    const date = new Date(dateValue);
    if (isNaN(date.getTime())) return "";
    return date.toISOString().split("T")[0];
  };

  const [formData, setFormData] = useState({
    name: project.name || "",
    description: project.description || "",
    status: project.status || "ACTIVE",
    progress: project.progress?.toString() || "0",
    budget: project.budget?.toString() || "",
    budgetUsed: project.budgetUsed?.toString() || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateProject(project.id, {
        name: formData.name,
        description: formData.description,
        status: formData.status as any,
        progress: formData.progress ? parseInt(formData.progress) : undefined,
        budget: formData.budget ? parseFloat(formData.budget) : undefined,
        budgetUsed: formData.budgetUsed ? parseFloat(formData.budgetUsed) : undefined,
      });

      onOpenChange(false);
      router.refresh();
    } catch (error) {
      console.error("Failed to update project:", error);
      alert("Failed to update project");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Edit Project</DialogTitle>
            <DialogDescription>
              Update the project details below.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto px-1">
            <div className="space-y-2">
              <Label htmlFor="name">Project Name <span className="text-destructive">*</span></Label>
              <Input
                id="name"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select 
                value={formData.status} 
                onValueChange={(v) => setFormData({ ...formData, status: v as any })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status">
                    {({ ACTIVE: 'Active', ON_HOLD: 'On Hold', COMPLETED: 'Completed', AT_RISK: 'At Risk' } as any)[formData.status] || "Select status"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ACTIVE" label={"Active"}>Active</SelectItem>
                  <SelectItem value="ON_HOLD" label={"On Hold"}>On Hold</SelectItem>
                  <SelectItem value="COMPLETED" label={"Completed"}>Completed</SelectItem>
                  <SelectItem value="AT_RISK" label={"At Risk"}>At Risk</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="progress">Progress (%)</Label>
              <Input
                id="progress"
                type="number"
                min="0"
                max="100"
                value={formData.progress}
                onChange={(e) => setFormData({ ...formData, progress: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="budget">Budget ($)</Label>
                <Input
                  id="budget"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.budget}
                  onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="budgetUsed">Budget Used ($)</Label>
                <Input
                  id="budgetUsed"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.budgetUsed}
                  onChange={(e) => setFormData({ ...formData, budgetUsed: e.target.value })}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading || !formData.name}>
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}


