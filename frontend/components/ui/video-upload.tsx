import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";

interface Video {
  type: "youtubeVideo" | "videoFile";
  url: string;
  duration: number;
  file?: File;
}

interface VideoUploadProps {
  videos: Video[];
  onChange: (videos: Video[]) => void;
  className?: string;
}

export function VideoUpload({ videos, onChange, className }: VideoUploadProps) {
  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newVideos = Array.from(e.target.files).map((file) => ({
        type: "videoFile" as const,
        url: URL.createObjectURL(file),
        duration: 0,
        file: file,
      }));
      onChange([...videos, ...newVideos]);
    }
  };

  const removeVideo = (url: string) => {
    onChange(videos.filter((video) => video.url !== url));
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex flex-wrap gap-2">
        {videos.map((video) => (
          <div key={video.url} className="relative">
            <video src={video.url} className="h-20 w-20 object-cover rounded" />
            <Button
              variant="destructive"
              size="icon"
              className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
              onClick={() => removeVideo(video.url)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
      <Input
        type="file"
        accept="video/*"
        multiple
        onChange={handleVideoUpload}
      />
    </div>
  );
}
