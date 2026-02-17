import { useState, useCallback } from "react";
import { Upload, X, FileText, FileVideo, Link2, Youtube } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
interface UploadedItem {
  id: string;
  name: string;
  size: string;
  type: "document" | "video" | "youtube";
}
interface UploadContentPanelProps {
  files: UploadedItem[];
  onFilesChange: (files: UploadedItem[]) => void;
}
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};
const getFileCategory = (file: File): "document" | "video" => {
  if (file.type.startsWith("video/")) return "video";
  return "document";
};
export function UploadContentPanel({
  files,
  onFilesChange
}: UploadContentPanelProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [youtubeUrl, setYoutubeUrl] = useState("");
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
    const newItems: UploadedItem[] = droppedFiles.map((file, i) => ({
      id: `file-${Date.now()}-${i}`,
      name: file.name,
      size: formatFileSize(file.size),
      type: getFileCategory(file)
    }));
    onFilesChange([...files, ...newItems]);
  }, [files, onFilesChange]);
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const selected = Array.from(e.target.files);
    const newItems: UploadedItem[] = selected.map((file, i) => ({
      id: `file-${Date.now()}-${i}`,
      name: file.name,
      size: formatFileSize(file.size),
      type: getFileCategory(file)
    }));
    onFilesChange([...files, ...newItems]);
    e.target.value = "";
  };
  const handleAddYoutube = () => {
    const trimmed = youtubeUrl.trim();
    if (!trimmed) return;
    const title = extractYoutubeTitle(trimmed);
    const newItem: UploadedItem = {
      id: `yt-${Date.now()}`,
      name: title,
      size: "YouTube",
      type: "youtube"
    };
    onFilesChange([...files, newItem]);
    setYoutubeUrl("");
  };
  const extractYoutubeTitle = (url: string): string => {
    try {
      const u = new URL(url);
      const id = u.searchParams.get("v") || u.pathname.split("/").pop();
      return id ? `YouTube Video (${id})` : url;
    } catch {
      return url;
    }
  };
  const removeItem = (id: string) => {
    onFilesChange(files.filter(f => f.id !== id));
  };
  const getIcon = (type: UploadedItem["type"]) => {
    switch (type) {
      case "video":
        return <FileVideo className="w-4 h-4 text-accent shrink-0" />;
      case "youtube":
        return <Youtube className="w-4 h-4 text-destructive shrink-0" />;
      default:
        return <FileText className="w-4 h-4 text-primary shrink-0" />;
    }
  };
  return <div className="flex flex-col gap-3">
      {/* Section title */}
      <p className="text-xs font-semibold text-foreground uppercase tracking-wide">
        Upload Documents & Videos
      </p>

      {/* Drag & drop zone */}
      <div onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop} className={cn("border-2 border-dashed rounded-xl p-4 text-center transition-all duration-200 cursor-pointer", isDragging ? "border-accent bg-accent/5 scale-[1.01]" : "border-muted-foreground/25 hover:border-accent/50 hover:bg-muted/30")}>
        <input type="file" accept=".pdf,.docx,.ppt,.pptx,.mp4,.mkv,.avi,.mov,video/*,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-powerpoint" multiple onChange={handleFileSelect} className="hidden" id="upload-content-input" />
        <label htmlFor="upload-content-input" className="cursor-pointer flex flex-col items-center gap-1.5">
          <div className={cn("w-10 h-10 rounded-full flex items-center justify-center transition-colors", isDragging ? "bg-accent/20" : "bg-muted")}>
            <Upload className={cn("w-5 h-5 transition-colors", isDragging ? "text-accent" : "text-muted-foreground")} />
          </div>
          <p className="text-xs font-medium text-foreground">
            Drag & drop documents or videos
          </p>
          <p className="text-[11px] text-muted-foreground">or click to browse files</p>
          <p className="text-[10px] text-muted-foreground/70 mt-0.5">
            PDF, DOCX, PPT, MP4, VIDEO
          </p>
        </label>
      </div>

      {/* Divider */}
      <div className="flex items-center gap-2">
        <div className="flex-1 h-px bg-border" />
        <Link2 className="w-3 h-3 text-muted-foreground" />
        <div className="flex-1 h-px bg-border" />
      </div>

      {/* YouTube link input */}
      <div className="rounded-lg border bg-muted/30 p-2.5 space-y-2">
        <p className="text-[11px] font-medium text-foreground flex items-center gap-1.5">
          <Youtube className="w-3.5 h-3.5 text-destructive" />
          Add YouTube Video Link
        </p>
        <div className="flex gap-1.5">
          <Input value={youtubeUrl} onChange={e => setYoutubeUrl(e.target.value)} placeholder="Paste YouTube URL here" className="h-7 text-xs bg-background" onKeyDown={e => e.key === "Enter" && handleAddYoutube()} />
          <Button size="sm" onClick={handleAddYoutube} disabled={!youtubeUrl.trim()} className="h-7 text-xs px-2.5 bg-accent hover:bg-accent/90 text-accent-foreground shrink-0">
            Add
          </Button>
        </div>
      </div>

      {/* Content list */}
      <div className="flex-1 min-h-0">
        
        <ScrollArea className="h-full">
          <div className="space-y-1.5 pr-1">
            {files.map(item => <div key={item.id} className="flex items-center gap-2 p-2 bg-muted/30 rounded-lg group animate-fade-in">
                {getIcon(item.type)}
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-foreground truncate">
                    {item.name}
                  </p>
                  <p className="text-[10px] text-muted-foreground">{item.size}</p>
                </div>
                <button onClick={() => removeItem(item.id)} className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-opacity">
                  <X className="w-3 h-3" />
                </button>
              </div>)}
            {files.length === 0}
          </div>
        </ScrollArea>
      </div>
    </div>;
}