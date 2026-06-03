"use client";

import { useState } from "react";
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
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createFolder } from "@/app/actions/assets";
import { useRouter } from "next/navigation";

interface NewFolderModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projects: { id: string; name: string }[];
  projectId?: string;
}

export function NewFolderModal({
  open,
  onOpenChange,
  projects,
  projectId,
}: NewFolderModalProps) {
  const [name, setName] = useState("");
  const [selectedProjectId, setSelectedProjectId] = useState(projectId || "");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !selectedProjectId) return;

    setLoading(true);
    try {
      await createFolder({
        name,
        projectId: selectedProjectId,
      });
      onOpenChange(false);
      setName("");
      setSelectedProjectId(projectId || "");
      router.refresh();
    } catch (error) {
      console.error("Failed to create folder:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Folder</DialogTitle>
          <DialogDescription>
            Organize your assets into folders.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Folder Name</Label>
            <Input
              id="name"
              placeholder="e.g. Design Assets"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Project</Label>
            <Select
              value={selectedProjectId}
              onValueChange={(v) => setSelectedProjectId(v as string)}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select project">
                  {projects.find(p => p.id === selectedProjectId)?.name || "Select project"}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {projects.map((project) => (
                  <SelectItem key={project.id} value={project.id} label={project.name}>
                    {project.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading || !name || !selectedProjectId}>
              {loading ? "Creating..." : "Create Folder"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}


