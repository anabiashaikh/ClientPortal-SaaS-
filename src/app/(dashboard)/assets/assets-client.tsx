"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
  MoreVertical,
  FileImage,
  FileText,
  FileVideo,
  FileArchive,
  File,
  Download,
  FolderOpen,
} from "lucide-react";
import { format } from "date-fns";
import { NewFolderModal } from "@/components/assets/NewFolderModal";
import { UploadFileModal } from "@/components/assets/UploadFileModal";
import { deleteAssetRecord } from "@/app/actions/assets";

const getFileIcon = (type: string) => {
  switch (type) {
    case "fig":
    case "png":
    case "jpg":
    case "jpeg":
    case "svg":
    case "gif":
      return <FileImage className="h-8 w-8 text-blue-500" />;
    case "pdf":
    case "docx":
    case "doc":
    case "txt":
      return <FileText className="h-8 w-8 text-rose-500" />;
    case "mp4":
    case "mov":
    case "avi":
      return <FileVideo className="h-8 w-8 text-purple-500" />;
    case "zip":
    case "rar":
    case "7z":
      return <FileArchive className="h-8 w-8 text-amber-500" />;
    default:
      return <File className="h-8 w-8 text-muted-foreground" />;
  }
};

const formatSize = (bytes: number) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

interface AssetsClientProps {
  initialAssets: any[];
  initialFolders: any[];
  projects: any[];
}

export function AssetsClient({ initialAssets, initialFolders, projects }: AssetsClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedProjectId, setSelectedProjectId] = useState("all");
  
  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);
  const [isFileModalOpen, setIsFileModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const router = useRouter();

  // Filter assets
  const filteredAssets = initialAssets.filter(asset => {
    const matchesSearch = asset.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    let matchesType = true;
    if (selectedType !== "all") {
      const imgTypes = ["png", "jpg", "jpeg", "gif", "svg", "fig"];
      const docTypes = ["pdf", "doc", "docx", "txt"];
      const vidTypes = ["mp4", "mov", "avi"];
      const arcTypes = ["zip", "rar", "7z"];
      
      if (selectedType === "images") matchesType = imgTypes.includes(asset.type);
      else if (selectedType === "documents") matchesType = docTypes.includes(asset.type);
      else if (selectedType === "videos") matchesType = vidTypes.includes(asset.type);
      else if (selectedType === "archives") matchesType = arcTypes.includes(asset.type);
    }

    const matchesProject = selectedProjectId === "all" || asset.projectId === selectedProjectId;

    return matchesSearch && matchesType && matchesProject;
  });

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this file?")) {
      setDeletingId(id);
      try {
        await deleteAssetRecord(id);
        router.refresh();
      } catch (error) {
        console.error("Failed to delete asset:", error);
      } finally {
        setDeletingId(null);
      }
    }
  };

  const handleDownload = (url: string, name: string) => {
    // In a real app, this would trigger a download of the actual file.
    // For now, we simulate a download.
    const link = document.createElement("a");
    link.href = url;
    link.download = name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    alert(`Started download for ${name}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Assets</h1>
          <p className="text-muted-foreground mt-1">Manage and organize project files.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2" onClick={() => setIsFolderModalOpen(true)}>
            <FolderOpen className="h-4 w-4" />
            New Folder
          </Button>
          <Button className="gap-2" onClick={() => setIsFileModalOpen(true)}>
            <Plus className="h-4 w-4" />
            Upload File
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search files..." 
            className="pl-9" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={selectedType} onValueChange={(v) => setSelectedType(v as string || "all")}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="File Type">
              {{'all': 'All Types', 'images': 'Images', 'documents': 'Documents', 'videos': 'Videos', 'archives': 'Archives'}[selectedType as string] || 'File Type'}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all" label={"All Types"}>All Types</SelectItem>
            <SelectItem value="images" label={"Images"}>Images</SelectItem>
            <SelectItem value="documents" label={"Documents"}>Documents</SelectItem>
            <SelectItem value="videos" label={"Videos"}>Videos</SelectItem>
            <SelectItem value="archives" label={"Archives"}>Archives</SelectItem>
          </SelectContent>
        </Select>
        <Select value={selectedProjectId} onValueChange={(v) => setSelectedProjectId(v as string || "all")}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Project">
              {selectedProjectId === "all" ? "All Projects" : projects.find((p: any) => p.id === selectedProjectId)?.name || "Project"}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all" label={"All Projects"}>All Projects</SelectItem>
            {projects.map(p => (
              <SelectItem key={p.id} value={p.id} label={p.name}>{p.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Folders Overview */}
      <div className="grid gap-4 md:grid-cols-4">
        {initialFolders.filter(f => selectedProjectId === "all" || f.projectId === selectedProjectId).map((folder) => (
          <Card key={folder.id} className="cursor-pointer hover:bg-accent/50 transition-colors">
            <CardContent className="p-4 flex items-center gap-3">
              <FolderOpen className="h-8 w-8 text-primary" />
              <div>
                <p className="font-medium text-sm">{folder.name}</p>
                <p className="text-xs text-muted-foreground">{folder._count?.assets || 0} files</p>
              </div>
            </CardContent>
          </Card>
        ))}
        {initialFolders.length === 0 && (
          <div className="col-span-full py-6 text-center text-muted-foreground text-sm border rounded-lg border-dashed">
            No folders created yet.
          </div>
        )}
      </div>

      {/* Files List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Recent Files</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/30">
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Name</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Project</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Size</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Uploaded</th>
                  <th className="text-right p-4 text-sm font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAssets.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-muted-foreground">
                      No files found.
                    </td>
                  </tr>
                ) : (
                  filteredAssets.map((asset) => (
                    <tr key={asset.id} className={`border-b last:border-0 hover:bg-muted/20 transition-colors group ${deletingId === asset.id ? 'opacity-50' : ''}`}>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          {getFileIcon(asset.type)}
                          <div>
                            <p className="text-sm font-medium">{asset.name}</p>
                            <Badge variant="outline" className="text-[10px] uppercase mt-0.5">{asset.type}</Badge>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-sm text-muted-foreground">{asset.project.name}</td>
                      <td className="p-4 text-sm text-muted-foreground">{formatSize(asset.size)}</td>
                      <td className="p-4">
                        <div className="text-sm">{format(new Date(asset.createdAt), "MMM dd, yyyy")}</div>
                        <div className="text-xs text-muted-foreground">by Admin</div>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8"
                            onClick={() => handleDownload(asset.url, asset.name)}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger className="h-8 w-8 inline-flex items-center justify-center rounded-md hover:bg-accent hover:text-accent-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring">
                              <MoreVertical className="h-4 w-4" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => alert("Rename coming soon!")}>Rename</DropdownMenuItem>
                              <DropdownMenuItem onClick={() => alert("Share link copied!")}>Share</DropdownMenuItem>
                              <DropdownMenuItem 
                                className="text-destructive"
                                onClick={() => handleDelete(asset.id)}
                              >
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <NewFolderModal 
        open={isFolderModalOpen} 
        onOpenChange={setIsFolderModalOpen}
        projects={projects}
        projectId={selectedProjectId === "all" ? undefined : selectedProjectId}
      />
      
      <UploadFileModal
        open={isFileModalOpen}
        onOpenChange={setIsFileModalOpen}
        projects={projects}
        folders={initialFolders}
        projectId={selectedProjectId === "all" ? undefined : selectedProjectId}
      />
    </div>
  );
}

