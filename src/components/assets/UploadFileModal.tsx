"use client";

import { useState, useRef } from "react";
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
import { createAsset } from "@/app/actions/assets";
import { UploadCloud } from "lucide-react";
import { useRouter } from "next/navigation";

interface UploadFileModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projects: { id: string; name: string }[];
  folders: { id: string; name: string; projectId: string }[];
  projectId?: string;
  folderId?: string;
}

export function UploadFileModal({
  open,
  onOpenChange,
  projects,
  folders,
  projectId,
  folderId,
}: UploadFileModalProps) {
  const [selectedProjectId, setSelectedProjectId] = useState(projectId || "");
  const [selectedFolderId, setSelectedFolderId] = useState(folderId || "root");
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const availableFolders = folders.filter((f) => f.projectId === selectedProjectId);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !selectedProjectId) return;

    setLoading(true);
    try {
      // Simulate file upload delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      const fileExt = file.name.split(".").pop()?.toLowerCase() || "";
      
      await createAsset({
        name: file.name,
        url: `/uploads/mock-${Date.now()}.${fileExt}`, // Mock URL
        size: file.size,
        type: fileExt || "unknown",
        projectId: selectedProjectId,
        folderId: selectedFolderId === "root" ? undefined : selectedFolderId,
      });
      
      onOpenChange(false);
      setFile(null);
      setSelectedProjectId(projectId || "");
      setSelectedFolderId(folderId || "root");
      if (fileInputRef.current) fileInputRef.current.value = "";
      router.refresh();
    } catch (error) {
      console.error("Failed to upload file:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Upload File</DialogTitle>
          <DialogDescription>
            Upload a new asset to your project.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label>Project</Label>
            <Select
              value={selectedProjectId}
              onValueChange={(val) => {
                setSelectedProjectId(val as string);
                setSelectedFolderId("root"); // Reset folder on project change
              }}
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

          {selectedProjectId && (
            <div className="space-y-2">
              <Label>Folder</Label>
              <Select
                value={selectedFolderId}
                onValueChange={(v) => setSelectedFolderId(v as string)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select folder">
                    {selectedFolderId === "root" ? "No Folder (Root)" : availableFolders.find(f => f.id === selectedFolderId)?.name || "Select folder"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="root" label={"No Folder (Root)"}>No Folder (Root)</SelectItem>
                  {availableFolders.map((folder) => (
                    <SelectItem key={folder.id} value={folder.id} label={folder.name}>
                      {folder.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-2">
            <Label>File</Label>
            <div 
              className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-colors ${file ? 'border-primary bg-primary/5' : 'border-muted-foreground/25 hover:bg-accent/50'}`}
              onClick={() => fileInputRef.current?.click()}
            >
              <UploadCloud className="h-8 w-8 text-muted-foreground mb-2" />
              {file ? (
                <div>
                  <p className="text-sm font-medium">{file.name}</p>
                  <p className="text-xs text-muted-foreground mt-1">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
              ) : (
                <div>
                  <p className="text-sm font-medium">Click to select file</p>
                  <p className="text-xs text-muted-foreground mt-1">Any file up to 50MB</p>
                </div>
              )}
            </div>
            <input 
              type="file" 
              className="hidden" 
              ref={fileInputRef} 
              onChange={handleFileChange}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading || !file || !selectedProjectId}>
              {loading ? "Uploading..." : "Upload"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}


