import * as React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Volume2, VolumeX, Heart } from 'lucide-react';
import { useSwipeable } from 'react-swipeable';
import apiClient from '@/api/apiClient';

interface VideoData {
  _id: string;
  title: string;
  description: string;
  videoUrl: string;
  likes: string[];
  views: number;
  isLiked: boolean;
}

export default function VideoShorts() {
  const [videoData, setVideoData] = React.useState<VideoData[]>([]);
  const [fullscreenVideo, setFullscreenVideo] = React.useState<number | null>(
    null
  );
  const [scrollPosition, setScrollPosition] = React.useState(0);
  const [isPlaying, setIsPlaying] = React.useState(true);
  const [isMuted, setIsMuted] = React.useState(true);
  const fullscreenRef = React.useRef<HTMLDivElement>(null);
  const videoRefs = React.useRef<(HTMLVideoElement | null)[]>([]);
  const [scrollDirection, setScrollDirection] = React.useState<
    'up' | 'down' | null
  >(null);

  React.useEffect(() => {
    fetchVideoData();
  }, []);

  const fetchVideoData = async () => {
    try {
      const response = await apiClient('/post/short/recommended');
      setVideoData(response.data);
    } catch (error) {
      console.error('Error fetching video data:', error);
    }
  };

  const openFullscreen = (index: number) => {
    setFullscreenVideo(index);
    setIsPlaying(true);
    setIsMuted(true);
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

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  React.useEffect(() => {
    videoRefs.current.forEach((videoRef, index) => {
      if (videoRef) {
        if (index === fullscreenVideo) {
          if (isPlaying) {
            videoRef.play();
          } else {
            videoRef.pause();
          }
          videoRef.muted = isMuted;
        } else {
          videoRef.pause();
          videoRef.currentTime = 0;
        }
      }
    });
  }, [fullscreenVideo, isPlaying, isMuted]);

  const handleVideoClick = (index: number) => {
    openFullscreen(index);
  };

  const handleLike = async (shortId: string, isLiked: boolean) => {
    try {
      const endpoint = isLiked
        ? `/post/short/${shortId}/unlike`
        : `/post/short/${shortId}/like`;
      await apiClient.post(endpoint);

      setVideoData((prevData) =>
        prevData.map((video) =>
          video._id === shortId
            ? {
                ...video,
                isLiked: !isLiked,
                likes: isLiked
                  ? video.likes.filter((id) => id !== 'currentUserId')
                  : [...video.likes, 'currentUserId'],
              }
            : video
        )
      );
    } catch (error) {
      console.error('Error liking/unliking video:', error);
    }
  };

  return (
    <>
      <p className="text-gray-500 font-medium text-lg mt-6 mb-8">
        Recommended for you
      </p>
      <div className="w-full overflow-x-auto scrollbar-none">
        <div className="flex space-x-4 pb-4" style={{ width: 'max-content' }}>
          {videoData.map((video, index) => (
            <Card
              key={video._id}
              className="w-56 h-[27rem] flex-shrink-0 bg-transparent border-none overflow-hidden relative"
            >
              <CardContent className="p-0 h-full w-auto">
                <video
                  src={video.videoUrl}
                  className="w-full mx-auto h-[86%] object-cover rounded-xl"
                  loop
                  muted
                  playsInline
                  controls
                  onClick={() => handleVideoClick(index)}
                >
                  Your browser does not support the video tag.
                </video>
                <div className="p-2 dark:text-white relative">
                  <p className="text-sm font-medium truncate">{video.title}</p>
                  <p className="text-xs truncate">{video.description}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {fullscreenVideo !== null && (
        <div
          ref={fullscreenRef}
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
          <button
            onClick={toggleMute}
            className="absolute top-4 right-4 text-white cursor-pointer z-50"
          >
            {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
          </button>
          <div
            className="w-full transition-transform duration-200 ease-out"
            style={{ transform: `translateY(${scrollPosition}px)` }}
          >
            {fullscreenVideo > 0 && (
              <div className="w-full h-screen absolute top-0 left-0 transform -translate-y-full">
                <video
                  ref={(el) => (videoRefs.current[fullscreenVideo - 1] = el)}
                  src={videoData[fullscreenVideo - 1].videoUrl}
                  className="w-full h-full object-cover"
                  loop
                  playsInline
                >
                  Your browser does not support the video tag.
                </video>
              </div>
            )}
            <div className="w-max mx-auto h-screen" onClick={togglePlayPause}>
              <video
                ref={(el) => (videoRefs.current[fullscreenVideo] = el)}
                src={videoData[fullscreenVideo].videoUrl}
                className="w-full mx-auto h-full object-cover"
                loop
                playsInline
              >
                Your browser does not support the video tag.
              </video>
            </div>
            {fullscreenVideo < videoData.length - 1 && (
              <div className="w-full h-screen absolute bottom-0 left-0 transform translate-y-full">
                <video
                  ref={(el) => (videoRefs.current[fullscreenVideo + 1] = el)}
                  src={videoData[fullscreenVideo + 1].videoUrl}
                  className="w-full h-full object-cover"
                  loop
                  playsInline
                >
                  Your browser does not support the video tag.
                </video>
              </div>
            )}
          </div>
          <div className="absolute bottom-4 left-4 right-4 text-white">
            <button
              onClick={() =>
                handleLike(
                  videoData[fullscreenVideo]._id,
                  videoData[fullscreenVideo].isLiked
                )
              }
              className={`absolute top-[-40px] right-0 ${
                videoData[fullscreenVideo].isLiked
                  ? 'text-red-500'
                  : 'text-white'
              }`}
            >
              <Heart size={24} />
            </button>
            <p className="text-lg font-medium">
              {videoData[fullscreenVideo].title}
            </p>
            <p className="text-sm mt-1">
              {videoData[fullscreenVideo].description}
            </p>
          </div>
        </div>
      )}
    </>
  );
}
