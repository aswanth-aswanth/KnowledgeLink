// components/ui/audio-upload.tsx
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";

interface AudioUploadProps {
  audios: string[];
  onChange: (audios: string[]) => void;
  className?: string;
}

export function AudioUpload({ audios, onChange, className }: AudioUploadProps) {
  const handleAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Implement audio upload logic here
    // For now, we'll just use the file name as the URL
    if (e.target.files) {
      const newAudios = Array.from(e.target.files).map((file) =>
        URL.createObjectURL(file)
      );
      onChange([...audios, ...newAudios]);
    }
  };

  const removeAudio = (url: string) => {
    onChange(audios.filter((audio) => audio !== url));
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex flex-wrap gap-2">
        {audios.map((audio) => (
          <div key={audio} className="relative">
            <audio src={audio} controls className="h-10" />
            <Button
              variant="destructive"
              size="icon"
              className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
              onClick={() => removeAudio(audio)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
      <Input
        type="file"
        accept="audio/*"
        multiple
        onChange={handleAudioUpload}
      />
    </div>
  );
}
