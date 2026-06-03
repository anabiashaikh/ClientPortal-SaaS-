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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createMilestone } from "@/app/actions/projects";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

export function AddMilestoneModal({ 
  projectId: defaultProjectId,
  projects 
}: { 
  projectId?: string;
  projects?: any[];
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    date: "",
    projectId: defaultProjectId || "none",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createMilestone({
        name: formData.name,
        date: formData.date,
        projectId: formData.projectId !== "none" ? formData.projectId : (defaultProjectId as string),
      });

      setOpen(false);
      setFormData({ name: "", date: "", projectId: defaultProjectId || "none" });
      router.refresh();
    } catch (error) {
      console.error("Failed to add milestone:", error);
      alert("Failed to add milestone");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={
        <Button variant="outline" size="sm" className="gap-2">
          <Plus className="h-4 w-4" /> Add Milestone
        </Button>
      } />
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add Milestone</DialogTitle>
            <DialogDescription>
              Create a new milestone for this project.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Milestone Name <span className="text-destructive">*</span></Label>
              <Input
                id="name"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Design Approved"
              />
            </div>

            {!defaultProjectId && projects && (
              <div className="space-y-2">
                <Label htmlFor="project">Project <span className="text-destructive">*</span></Label>
                <Select value={formData.projectId} onValueChange={(v) => setFormData({ ...formData, projectId: v as any })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select project">
                      {projects.find(p => p.id === formData.projectId)?.name || "Select project"}
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
              <Label htmlFor="date">Date <span className="text-destructive">*</span></Label>
              <Input
                id="date"
                type="date"
                required
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading || !formData.name || !formData.date || (!defaultProjectId && formData.projectId === "none")}>
              {loading ? "Adding..." : "Add Milestone"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}


