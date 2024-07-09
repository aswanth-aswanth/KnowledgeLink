// components/ui/image-upload.tsx
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";

interface ImageUploadProps {
  images: { url: string }[];
  onChange: (images: { url: string }[]) => void;
  className?: string;
}

export function ImageUpload({ images, onChange, className }: ImageUploadProps) {
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Implement image upload logic here
    // For now, we'll just use the file name as the URL
    if (e.target.files) {
      const newImages = Array.from(e.target.files).map((file) => ({
        url: URL.createObjectURL(file),
      }));
      onChange([...images, ...newImages]);
    }
  };

  const removeImage = (url: string) => {
    onChange(images.filter((img) => img.url !== url));
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex flex-wrap gap-2">
        {images.map((img) => (
          <div key={img.url} className="relative">
            <img
              src={img.url}
              alt="Uploaded"
              className="h-20 w-20 object-cover rounded"
            />
            <Button
              variant="destructive"
              size="icon"
              className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
              onClick={() => removeImage(img.url)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
      <Input
        type="file"
        accept="image/*"
        multiple
        onChange={handleImageUpload}
      />
    </div>
  );
}
