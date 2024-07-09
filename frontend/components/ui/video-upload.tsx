// components/ui/video-upload.tsx
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";

interface VideoUploadProps {
  videos: {
    type: "youtubeVideo" | "videoFile";
    url: string;
    duration: number;
  }[];
  onChange: (
    videos: {
      type: "youtubeVideo" | "videoFile";
      url: string;
      duration: number;
    }[]
  ) => void;
  className?: string;
}

export function VideoUpload({ videos, onChange, className }: VideoUploadProps) {
  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Implement video upload logic here
    // For now, we'll just use the file name as the URL and set a dummy duration
    if (e.target.files) {
      const newVideos = Array.from(e.target.files).map((file) => ({
        type: "videoFile" as const,
        url: URL.createObjectURL(file),
        duration: 0, // You'll need to implement a way to get the actual duration
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
