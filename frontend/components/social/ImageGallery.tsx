import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

interface ImageGalleryProps {
  images: { url: string }[];
}

export function ImageGallery({ images }: ImageGalleryProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  const goToPreviousImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const goToNextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <div className="grid grid-cols-2 gap-2">
        {images.map((image, index) => (
          <DialogTrigger key={index} asChild>
            <img
              src={image.url}
              alt={`Post image ${index + 1}`}
              className="rounded-lg object-cover w-full h-48 cursor-pointer"
              onClick={() => {
                setCurrentImageIndex(index);
                setIsOpen(true);
              }}
            />
          </DialogTrigger>
        ))}
      </div>
      <DialogContent className="max-w-4xl bg-black w-full h-[80vh] flex items-center justify-center">
        <div className="relative w-full h-full">
          <img
            src={images[currentImageIndex].url}
            alt={`Gallery image ${currentImageIndex + 1}`}
            className="w-full h-full object-contain"
          />
          <Button
            variant="outline"
            size="icon"
            className="absolute top-2 right-2 bg-white"
            onClick={() => setIsOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="absolute top-1/2 left-2 bg-white transform -translate-y-1/2"
            onClick={goToPreviousImage}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="absolute top-1/2 right-2 bg-white transform -translate-y-1/2"
            onClick={goToNextImage}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-2 py-1 rounded">
            {currentImageIndex + 1} / {images.length}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
