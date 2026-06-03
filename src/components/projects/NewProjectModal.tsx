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
import { createProject } from "@/app/actions/projects";
import { getOrganizations } from "@/app/actions/users";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

export function NewProjectModal() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    budget: "",
    startDate: "",
    endDate: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // For now, get the first organization to act as the default one
      const orgs = await getOrganizations();
      let orgId = orgs[0]?.id;
      
      // If no organization exists, this will fail. 
      // In a real app with auth, the user's organizationId would be used.
      if (!orgId) {
        alert("No organization found. Please create one first.");
        setLoading(false);
        return;
      }

      await createProject({
        name: formData.name,
        description: formData.description,
        budget: formData.budget ? parseFloat(formData.budget) : undefined,
        startDate: formData.startDate || undefined,
        endDate: formData.endDate || undefined,
        organizationId: orgId,
      });

      setOpen(false);
      setFormData({ name: "", description: "", budget: "", startDate: "", endDate: "" });
      router.refresh(); // Refresh the page to show the new project
    } catch (error) {
      console.error("Failed to create project:", error);
      alert("Failed to create project");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          New Project
        </Button>
      } />
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create New Project</DialogTitle>
            <DialogDescription>
              Fill in the details below to create a new project.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Project Name <span className="text-destructive">*</span></Label>
              <Input
                id="name"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Website Redesign"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Brief description of the project..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="budget">Budget ($)</Label>
              <Input
                id="budget"
                type="number"
                min="0"
                step="0.01"
                value={formData.budget}
                onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                placeholder="50000"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading || !formData.name}>
              {loading ? "Creating..." : "Create Project"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
