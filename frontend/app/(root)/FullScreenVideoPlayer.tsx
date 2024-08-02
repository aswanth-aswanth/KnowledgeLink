import React, { useState, useRef, useEffect } from "react";
import { ChevronUp, ChevronDown, X } from "lucide-react";

interface Video {
  id: number;
  url: string;
  title: string;
}

interface FullscreenVideoPlayerProps {
  videos: Video[];
  initialVideoIndex: number;
  onClose: () => void;
}

export function FullscreenVideoPlayer({
  videos,
  initialVideoIndex,
  onClose,
}: FullscreenVideoPlayerProps) {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(initialVideoIndex);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowUp") {
        navigateVideo(-1);
      } else if (event.key === "ArrowDown") {
        navigateVideo(1);
      } else if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentVideoIndex]);

  useEffect(() => {
    videoRefs.current[currentVideoIndex]?.play();
  }, [currentVideoIndex]);

  const navigateVideo = (direction: number) => {
    const newIndex =
      (currentVideoIndex + direction + videos.length) % videos.length;
    setCurrentVideoIndex(newIndex);
  };

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white z-10"
      >
        <X size={24} />
      </button>
      <div className="flex-1 overflow-hidden relative">
        {videos.map((video, index) => (
          <div
            key={video.id}
            className={`absolute inset-0 transition-transform duration-300 ease-in-out ${
              index === currentVideoIndex
                ? "translate-y-0"
                : index < currentVideoIndex
                ? "-translate-y-full"
                : "translate-y-full"
            }`}
          >
            <video
              ref={(el) => (videoRefs.current[index] = el)}
              src={video.url}
              className="w-full h-full object-contain"
              loop
              playsInline
              onClick={(e) => {
                if (e.currentTarget.paused) {
                  e.currentTarget.play();
                } else {
                  e.currentTarget.pause();
                }
              }}
            />
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent">
              <h2 className="text-white text-lg font-bold">{video.title}</h2>
            </div>
          </div>
        ))}
      </div>
      <button
        onClick={() => navigateVideo(-1)}
        className="absolute top-1/2 left-4 text-white"
      >
        <ChevronUp size={24} />
      </button>
      <button
        onClick={() => navigateVideo(1)}
        className="absolute bottom-1/2 left-4 text-white"
      >
        <ChevronDown size={24} />
      </button>
    </div>
  );
}
