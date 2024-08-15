import React, { useState, useRef, useEffect } from 'react';
import { X } from 'lucide-react';
import { useSwipeable } from 'react-swipeable';

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
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    videoRefs.current[currentVideoIndex]?.play();
    videoRefs.current.forEach((video, index) => {
      if (index !== currentVideoIndex && video) {
        video.pause();
      }
    });
  }, [currentVideoIndex]);

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.scrollTop = currentVideoIndex * container.clientHeight;
    }
  }, [currentVideoIndex]);

  const navigateVideo = (direction: number) => {
    const newIndex = Math.max(
      0,
      Math.min(currentVideoIndex + direction, videos.length - 1)
    );
    setCurrentVideoIndex(newIndex);
  };

  const handleScroll = () => {
    const container = containerRef.current;
    if (container) {
      const newIndex = Math.round(container.scrollTop / container.clientHeight);
      if (newIndex !== currentVideoIndex) {
        setCurrentVideoIndex(newIndex);
      }
    }
  };

  const handlers = useSwipeable({
    onSwipedUp: () => navigateVideo(1),
    onSwipedDown: () => navigateVideo(-1),
    preventDefaultTouchmoveEvent: true,
    trackMouse: true,
  });

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col" {...handlers}>
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white z-10"
      >
        <X size={24} />
      </button>
      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto snap-y snap-mandatory"
        onScroll={handleScroll}
      >
        {videos.map((video, index) => (
          <div
            key={video.id}
            className="w-full h-full flex justify-center items-center snap-start"
          >
            <div className="relative w-full h-full max-w-[400px] aspect-[9/16] overflow-hidden">
              <video
                ref={(el) => (videoRefs.current[index] = el)}
                src={video.url}
                className="absolute inset-0 w-full h-full object-cover"
                loop
                playsInline
                muted
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
          </div>
        ))}
      </div>
    </div>
  );
}
