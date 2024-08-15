import * as React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Expand, ArrowLeft } from 'lucide-react';
import { useSwipeable } from 'react-swipeable';

const videoData = [
  {
    id: 1,
    url: 'https://res.cloudinary.com/yakir/video/upload/w_600/video/user_video.mp4',
    title: 'Woman Dancing',
  },
  {
    id: 2,
    url: 'https://res.cloudinary.com/demo/video/upload/f_auto,q_auto/vc_h265/dog.mp4',
    title: 'Dog Running on Beach',
  },
  {
    id: 3,
    url: 'https://res.cloudinary.com/yakir/video/upload/w_600/video/user_video.mp4',
    title: 'Coffee Pouring1',
  },
  {
    id: 4,
    url: 'https://res.cloudinary.com/yakir/video/upload/w_600/video/user_video.mp4',
    title: 'Woman Stretching',
  },
  {
    id: 5,
    url: 'https://res.cloudinary.com/yakir/video/upload/w_600/video/user_video.mp4',
    title: 'Cooking in Pan2',
  },
  {
    id: 6,
    url: 'https://res.cloudinary.com/yakir/video/upload/w_600/video/user_video.mp4',
    title: 'Cooking in Pan3',
  },
  {
    id: 7,
    url: 'https://res.cloudinary.com/yakir/video/upload/w_600/video/user_video.mp4',
    title: 'Cooking in Pan4',
  },
  {
    id: 8,
    url: 'https://res.cloudinary.com/yakir/video/upload/w_600/video/user_video.mp4',
    title: 'Cooking in Pan4',
  },
];

export default function VideoShorts() {
  const [fullscreenVideo, setFullscreenVideo] = React.useState<number | null>(
    null
  );
  const [scrollPosition, setScrollPosition] = React.useState(0);
  const [isPlaying, setIsPlaying] = React.useState(true);
  const fullscreenRef = React.useRef<HTMLDivElement>(null);
  const videoRefs = React.useRef<(HTMLVideoElement | null)[]>([]);
  const [scrollDirection, setScrollDirection] = React.useState<
    'up' | 'down' | null
  >(null);

  const openFullscreen = (index: number) => {
    setFullscreenVideo(index);
  };

  const closeFullscreen = () => {
    setFullscreenVideo(null);
  };

  const handleScroll = (event: React.WheelEvent<HTMLDivElement>) => {
    if (fullscreenVideo !== null) {
      if (event.deltaY > 0 && fullscreenVideo < videoData.length - 1) {
        setScrollDirection('down');
        setTimeout(() => {
          setFullscreenVideo(fullscreenVideo + 1);
        }, 300);
      } else if (event.deltaY < 0 && fullscreenVideo > 0) {
        setScrollDirection('up');
        setTimeout(() => {
          setFullscreenVideo(fullscreenVideo - 1);
        }, 300);
      }
    }
  };

  const handlers = useSwipeable({
    onSwipedUp: () => {
      if (fullscreenVideo !== null && fullscreenVideo < videoData.length - 1) {
        setScrollDirection('down');
        setTimeout(() => {
          setFullscreenVideo(fullscreenVideo + 1);
        }, 300);
      }
    },
    onSwipedDown: () => {
      if (fullscreenVideo !== null && fullscreenVideo > 0) {
        setScrollDirection('up');
        setTimeout(() => {
          setFullscreenVideo(fullscreenVideo - 1);
        }, 300);
      }
    },
  });

  React.useEffect(() => {
    if (fullscreenRef.current) {
      fullscreenRef.current.focus();
    }
    setScrollDirection(null);
  }, [fullscreenVideo]);

  const togglePlayPause = () => {
    if (fullscreenVideo !== null) {
      const video = videoRefs.current[fullscreenVideo];
      if (video) {
        if (isPlaying) {
          video.pause();
        } else {
          video.play();
        }
        setIsPlaying(!isPlaying);
      }
    }
  };

  React.useEffect(() => {
    if (fullscreenRef.current) {
      fullscreenRef.current.focus();
    }
    videoRefs.current.forEach((videoRef, index) => {
      if (videoRef) {
        if (index === fullscreenVideo) {
          if (isPlaying) {
            videoRef.play();
          } else {
            videoRef.pause();
          }
        } else {
          videoRef.pause();
          videoRef.currentTime = 0;
        }
      }
    });
  }, [fullscreenVideo, isPlaying]);

  return (
    <>
      <p className="text-gray-500 font-medium text-lg mt-6 mb-8">
        Recommended for you
      </p>
      <div className="w-full overflow-x-auto scrollbar-none">
        <div className="flex space-x-4 pb-4" style={{ width: 'max-content' }}>
          {videoData.map((video, index) => (
            <Card
              key={video.id}
              className="w-56 h-72 flex-shrink-0 bg-gray-100 overflow-hidden relative"
            >
              <CardContent className="p-0 h-full">
                <video
                  src={video.url}
                  className="w-full h-full object-cover"
                  loop
                  muted
                  playsInline
                  controls
                >
                  Your browser does not support the video tag.
                </video>
              </CardContent>
              <div className="absolute bottom-0 left-0 right-0 p-2 bg-black text-white flex justify-between items-center">
                <p className="text-sm font-medium truncate flex-1">
                  {video.title}
                </p>
                <button
                  onClick={() => openFullscreen(index)}
                  className="text-gray-600 hover:text-gray-900"
                >
                  <Expand size={20} />
                </button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {fullscreenVideo !== null && (
        <div
          className="fixed inset-0 bg-black z-50 flex flex-col outline-none overflow-hidden"
          tabIndex={0}
          onWheel={handleScroll}
          {...handlers}
        >
          <button
            onClick={closeFullscreen}
            className="absolute top-4 left-4 text-white cursor-pointer z-50"
          >
            <ArrowLeft size={24} />
          </button>
          <div
            className="w-full transition-transform duration-200 ease-out"
            style={{ transform: `translateY(${scrollPosition}px)` }}
          >
            {fullscreenVideo > 0 && (
              <div className="w-full h-screen absolute top-0 left-0 transform -translate-y-full">
                <video
                  ref={(el) => (videoRefs.current[fullscreenVideo - 1] = el)}
                  src={videoData[fullscreenVideo - 1].url}
                  className="w-full h-full object-cover"
                  loop
                  playsInline
                  muted
                >
                  Your browser does not support the video tag.
                </video>
              </div>
            )}
            <div className="w-full h-screen" onClick={togglePlayPause}>
              <video
                ref={(el) => (videoRefs.current[fullscreenVideo] = el)}
                src={videoData[fullscreenVideo].url}
                className="w-full h-full object-cover"
                loop
                playsInline
                muted
              >
                Your browser does not support the video tag.
              </video>
            </div>
            {fullscreenVideo < videoData.length - 1 && (
              <div className="w-full h-screen absolute bottom-0 left-0 transform translate-y-full">
                <video
                  ref={(el) => (videoRefs.current[fullscreenVideo + 1] = el)}
                  src={videoData[fullscreenVideo + 1].url}
                  className="w-full h-full object-cover"
                  loop
                  playsInline
                  muted
                >
                  Your browser does not support the video tag.
                </video>
              </div>
            )}
          </div>
          <div className="absolute bottom-4 left-4 right-4 text-white">
            <p className="text-lg font-medium">
              {videoData[fullscreenVideo].title}
            </p>
          </div>
        </div>
      )}
    </>
  );
}
