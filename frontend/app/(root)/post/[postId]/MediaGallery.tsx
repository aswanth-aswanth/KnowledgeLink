import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { AudioPlayer } from "./AudioPlayer";
import { MediaItem } from "@/types/posts";
import { MediaGalleryProps } from "@/types/posts";

export function MediaGallery({ mediaItems }: MediaGalleryProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(mediaItems.length > 1);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const scroll = (direction: "left" | "right") => {
    const container = scrollContainerRef.current;
    if (container) {
      const scrollAmount = container.clientWidth;
      container.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const handleScroll = () => {
    const container = scrollContainerRef.current;
    if (container) {
      setShowLeftArrow(container.scrollLeft > 0);
      setShowRightArrow(
        mediaItems.length > 1 &&
          container.scrollLeft < container.scrollWidth - container.clientWidth
      );
    }
  };

  const openModal = (index: number) => {
    setCurrentIndex(index);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? mediaItems.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === mediaItems.length - 1 ? 0 : prevIndex + 1
    );
  };

  const renderMediaItem = (
    item: MediaItem,
    index: number,
    inModal: boolean = false
  ) => {
    if (item.type === "image") {
      return (
        <img
          src={item.url}
          alt={`Media item ${index + 1}`}
          className={
            inModal
              ? "w-full max-h-[74vh] object-contain"
              : "w-full max-h-[74vh] object-contain cursor-pointer"
          }
          onClick={() => !inModal && openModal(index)}
        />
      );
    } else if (item.type === "video") {
      return (
        <video
          src={item.url}
          controls
          className={
            inModal
              ? "w-full max-h-[74vh] object-contain"
              : "w-full max-h-[74vh] object-cover cursor-pointer"
          }
          onClick={() => !inModal && openModal(index)}
        />
      );
    } else if (item.type === "audio") {
      return <AudioPlayer url={item.url} />;
    }
  };

  return (
    <>
      <div className="relative">
        <div
          ref={scrollContainerRef}
          className="flex items-center overflow-x-auto max-h-[calc(100vh-200px)] overflow-y-hidden scrollbar-hide snap-x snap-mandatory"
          onScroll={handleScroll}
        >
          {mediaItems.map((item, index) => (
            <div
              key={index}
              className="flex-shrink-0  w-full h-max snap-center"
            >
              {renderMediaItem(item, index)}
            </div>
          ))}
        </div>
        {showLeftArrow && (
          <Button
            variant="outline"
            size="icon"
            className="absolute top-1/2 left-2 bg-white/80 hover:bg-white transform -translate-y-1/2 rounded-sm"
            onClick={() => scroll("left")}
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
        )}
        {showRightArrow && (
          <Button
            variant="outline"
            size="icon"
            className="absolute top-1/2 right-2 bg-white/80 hover:bg-white transform -translate-y-1/2 rounded-sm"
            onClick={() => scroll("right")}
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        )}
        {mediaItems.length > 1 && (
          <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded">
            {mediaItems.length} items
          </div>
        )}
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-[90vw] max-h-[90vh] p-0 bg-black w-full h-full flex items-center justify-center">
          <div className="relative w-full h-full flex items-center">
            {renderMediaItem(mediaItems[currentIndex], currentIndex, true)}
            <Button
              variant="outline"
              size="icon"
              className="absolute top-2 right-2 bg-white"
              onClick={closeModal}
            >
              <X className="h-4 w-4" />
            </Button>
            {mediaItems.length > 1 && (
              <>
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute top-1/2 left-2 bg-white/80 hover:bg-white transform -translate-y-1/2 rounded-sm"
                  onClick={() => scroll("left")}
                >
                  <ChevronLeft className="h-6 w-6" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute top-1/2 right-2 bg-white transform -translate-y-1/2"
                  onClick={goToNext}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                  {currentIndex + 1} / {mediaItems.length}
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
