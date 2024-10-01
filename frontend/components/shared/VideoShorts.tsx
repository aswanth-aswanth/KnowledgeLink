import * as React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Volume2, VolumeX, Heart, Maximize2 } from 'lucide-react';
import { useSwipeable } from 'react-swipeable';
import apiClient from '@/api/apiClient';
import { Skeleton } from '@/components/ui/skeleton';

interface VideoData {
  _id: string;
  title: string;
  description: string;
  videoUrl: string;
  likes: string[];
  views: number;
  isLiked: boolean;
}

interface FullscreenElement extends HTMLElement {
  webkitRequestFullscreen?: () => void;
  msRequestFullscreen?: () => void;
  mozRequestFullScreen?: () => void;
}

export default function VideoShorts() {
  const [videoData, setVideoData] = React.useState<VideoData[]>([]);
  const [fullscreenVideo, setFullscreenVideo] = React.useState<number | null>(
    null
  );
  const [isPlaying, setIsPlaying] = React.useState(true);
  const [isMuted, setIsMuted] = React.useState(true);
  const fullscreenRef = React.useRef<HTMLDivElement>(null);
  const videoRefs = React.useRef<(HTMLVideoElement | null)[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    fetchVideoData();
  }, []);

  const fetchVideoData = async () => {
    try {
      setIsLoading(true);
      const response = await apiClient('/post/short/recommended');
      setVideoData(response.data);
    } catch (error) {
      console.error('Error fetching video data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const openFullscreen = (index: number) => {
    setFullscreenVideo(index);
    setIsPlaying(true);
    setIsMuted(true);
    const elem = document.documentElement as FullscreenElement;
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.webkitRequestFullscreen) {
      /* Safari */
      elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) {
      /* IE11 */
      elem.msRequestFullscreen();
    }
  };

  const closeFullscreen = () => {
    setFullscreenVideo(null);
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if ((document as any).webkitExitFullscreen) {
      /* Safari */
      (document as any).webkitExitFullscreen();
    } else if ((document as any).msExitFullscreen) {
      /* IE11 */
      (document as any).msExitFullscreen();
    }
  };

  const handlers = useSwipeable({
    onSwipedUp: () => {
      if (fullscreenVideo !== null && fullscreenVideo < videoData.length - 1) {
        setFullscreenVideo(fullscreenVideo + 1);
      }
    },
    onSwipedDown: () => {
      if (fullscreenVideo !== null && fullscreenVideo > 0) {
        setFullscreenVideo(fullscreenVideo - 1);
      }
    },
  });

  React.useEffect(() => {
    if (fullscreenRef.current) {
      fullscreenRef.current.focus();
    }
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

  const VideoCard = React.memo(
    ({ video, index }: { video: VideoData; index: number }) => {
      const [isVideoLoaded, setIsVideoLoaded] = React.useState(false);

      return (
        <Card className="w-56 h-[27rem] flex-shrink-0 bg-transparent border-none overflow-hidden relative">
          <CardContent className="p-0 h-full w-auto">
            <div className="relative w-full h-[86%]">
              {!isVideoLoaded && (
                <Skeleton className="bg-slate-300 absolute inset-0 w-full h-full rounded-xl" />
              )}
              <video
                src={video.videoUrl}
                className={`w-full h-full object-cover rounded-xl ${
                  isVideoLoaded ? 'opacity-100' : 'opacity-0'
                }`}
                loop
                muted
                playsInline
                onClick={() => openFullscreen(index)}
                onLoadedData={() => setIsVideoLoaded(true)}
              >
                Your browser does not support the video tag.
              </video>
            </div>
            <div className="p-2 dark:text-white">
              <p className="text-base font-medium truncate">{video.title}</p>
              <p className="text-xs truncate">{video.description}</p>
            </div>
          </CardContent>
        </Card>
      );
    }
  );

  if (isLoading) {
    return (
      <div className="w-full overflow-x-auto scrollbar-none">
        <p className="dark:text-white font-medium text-lg mt-6 mb-8">
          Recommended for you
        </p>
        <div className="flex space-x-4 pb-4" style={{ width: 'max-content' }}>
          {[...Array(5)].map((_, index) => (
            <Skeleton
              key={index}
              className="w-56 h-[27rem] rounded-xl bg-slate-300"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      <p className="dark:text-white font-medium text-lg mt-6 mb-8">
        Recommended for you
      </p>
      <div className="w-full overflow-x-auto scrollbar-none">
        <div className="flex space-x-4 pb-4" style={{ width: 'max-content' }}>
          {videoData.map((video, index) => (
            <VideoCard key={video._id} video={video} index={index} />
          ))}
        </div>
      </div>

      {fullscreenVideo !== null && (
        <div
          className="fixed inset-0 bg-black z-50 flex flex-col outline-none overflow-hidden"
          tabIndex={0}
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
          <div className="w-max mx-auto h-screen" onClick={togglePlayPause}>
            <video
              ref={(el) => {
                videoRefs.current[fullscreenVideo] = el;
              }}
              src={videoData[fullscreenVideo].videoUrl}
              className="w-screen mx-auto h-screen object-contain"
              loop
              playsInline
            >
              Your browser does not support the video tag.
            </video>
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
