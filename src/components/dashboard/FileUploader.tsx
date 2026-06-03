"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { UploadCloud, X, File as FileIcon, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { uploadAsset } from "@/lib/supabase";

type UploadingFile = {
  id: string;
  file: File;
  progress: number;
  status: "pending" | "uploading" | "success" | "error";
};

export default function FileUploader({ projectId }: { projectId: string }) {
  const [files, setFiles] = useState<UploadingFile[]>([]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map(file => ({
      id: Math.random().toString(36).substring(7),
      file,
      progress: 0,
      status: "pending" as const,
    }));
    
    setFiles(prev => [...prev, ...newFiles]);
    
    // Start uploads
    newFiles.forEach(f => uploadFile(f));
  }, [projectId]);

  const uploadFile = async (uploadFile: UploadingFile) => {
    setFiles(prev => prev.map(f => f.id === uploadFile.id ? { ...f, status: "uploading", progress: 20 } : f));
    
    try {
      // In a real implementation we would use a chunked uploader to track progress precisely.
      // For now we simulate progress for UX and then await the promise.
      const progressInterval = setInterval(() => {
        setFiles(prev => prev.map(f => f.id === uploadFile.id && f.progress < 90 ? { ...f, progress: f.progress + 10 } : f));
      }, 500);

      await uploadAsset(projectId, uploadFile.file);
      
      clearInterval(progressInterval);
      setFiles(prev => prev.map(f => f.id === uploadFile.id ? { ...f, status: "success", progress: 100 } : f));
    } catch (error) {
      setFiles(prev => prev.map(f => f.id === uploadFile.id ? { ...f, status: "error", progress: 0 } : f));
    }
  };

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div className="space-y-4">
      <div 
        {...getRootProps()} 
        className={`border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-colors ${
          isDragActive ? "border-primary bg-primary/5" : "border-muted hover:bg-muted/20"
        }`}
      >
        <input {...getInputProps()} />
        <div className="p-3 bg-muted rounded-full mb-4">
          <UploadCloud className="h-6 w-6 text-muted-foreground" />
        </div>
        <h3 className="font-semibold text-sm">Click or drag files here to upload</h3>
        <p className="text-xs text-muted-foreground mt-1">Maximum file size 50MB</p>
      </div>

      {files.length > 0 && (
        <div className="space-y-3">
          {files.map(file => (
            <div key={file.id} className="border rounded-md p-3 flex items-center gap-3">
              <FileIcon className="h-8 w-8 text-muted-foreground shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-medium truncate pr-4">{file.file.name}</p>
                  {file.status === "success" ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                  ) : (
                    <button onClick={() => removeFile(file.id)} className="text-muted-foreground hover:text-foreground">
                      <X className="h-4 w-4 shrink-0" />
                    </button>
                  )}
                </div>
                {file.status === "uploading" && (
                  <Progress value={file.progress} className="h-1.5" />
                )}
                {file.status === "error" && (
                  <p className="text-xs text-rose-500">Upload failed. Please try again.</p>
                )}
                {file.status === "success" && (
                  <p className="text-xs text-emerald-500">Upload complete</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
