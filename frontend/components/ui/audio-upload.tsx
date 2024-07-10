import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";

interface Audio {
  url: string;
  file: File;
}

interface AudioUploadProps {
  audios: Audio[];
  onChange: (audios: Audio[]) => void;
  className?: string;
}

export function AudioUpload({ audios, onChange, className }: AudioUploadProps) {
  const handleAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newAudios = Array.from(e.target.files).map((file) => ({
        url: URL.createObjectURL(file),
        file: file,
      }));
      onChange([...audios, ...newAudios]);
    }
  };

  const removeAudio = (url: string) => {
    onChange(audios.filter((audio) => audio.url !== url));
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex flex-wrap gap-2">
        {audios.map((audio) => (
          <div key={audio.url} className="relative">
            <audio src={audio.url} controls className="h-10" />
            <Button
              variant="destructive"
              size="icon"
              className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
              onClick={() => removeAudio(audio.url)}
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
