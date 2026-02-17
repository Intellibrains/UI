import { useState, useCallback } from "react";
import { Upload, X, FileText } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface UploadedDoc {
  id: string;
  name: string;
  size: string;
}

interface DocumentUploadPanelProps {
  files: UploadedDoc[];
  onFilesChange: (files: UploadedDoc[]) => void;
}

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

export function DocumentUploadPanel({ files, onFilesChange }: DocumentUploadPanelProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    const newItems: UploadedDoc[] = droppedFiles.map((file, i) => ({
      id: `file-${Date.now()}-${i}`,
      name: file.name,
      size: formatFileSize(file.size),
    }));
    onFilesChange([...files, ...newItems]);
  }, [files, onFilesChange]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const selected = Array.from(e.target.files);
    const newItems: UploadedDoc[] = selected.map((file, i) => ({
      id: `file-${Date.now()}-${i}`,
      name: file.name,
      size: formatFileSize(file.size),
    }));
    onFilesChange([...files, ...newItems]);
    e.target.value = "";
  };

  const removeItem = (id: string) => {
    onFilesChange(files.filter(f => f.id !== id));
  };

  return (
    <div className="flex flex-col gap-3">
      <p className="text-xs font-semibold text-foreground uppercase tracking-wide">
        Upload Documents
      </p>

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          "border-2 border-dashed rounded-xl p-4 text-center transition-all duration-200 cursor-pointer",
          isDragging
            ? "border-accent bg-accent/5 scale-[1.01]"
            : "border-muted-foreground/25 hover:border-accent/50 hover:bg-muted/30"
        )}
      >
        <input
          type="file"
          accept=".pdf,.docx,.ppt,.pptx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-powerpoint"
          multiple
          onChange={handleFileSelect}
          className="hidden"
          id="doc-upload-input"
        />
        <label htmlFor="doc-upload-input" className="cursor-pointer flex flex-col items-center gap-1.5">
          <div className={cn(
            "w-10 h-10 rounded-full flex items-center justify-center transition-colors",
            isDragging ? "bg-accent/20" : "bg-muted"
          )}>
            <Upload className={cn("w-5 h-5 transition-colors", isDragging ? "text-accent" : "text-muted-foreground")} />
          </div>
          <p className="text-xs font-medium text-foreground">Drag & drop documents here</p>
          <p className="text-[11px] text-muted-foreground">or click to browse files</p>
          <p className="text-[10px] text-muted-foreground/70 mt-0.5">Supported: PDF, DOCX, PPT</p>
        </label>
      </div>

      <div className="flex-1 min-h-0">
        <ScrollArea className="h-full">
          <div className="space-y-1.5 pr-1">
            {files.map(item => (
              <div key={item.id} className="flex items-center gap-2 p-2 bg-muted/30 rounded-lg group animate-fade-in">
                <FileText className="w-4 h-4 text-primary shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-foreground truncate">{item.name}</p>
                  <p className="text-[10px] text-muted-foreground">{item.size}</p>
                </div>
                <button
                  onClick={() => removeItem(item.id)}
                  className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-opacity"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
            {files.length === 0 && (
              <p className="text-xs text-muted-foreground text-center py-3">No documents uploaded</p>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
