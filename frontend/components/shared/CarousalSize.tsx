import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Expand } from 'lucide-react';
import { FullscreenVideoPlayer } from '@/app/(root)/FullscreenVideoPlayer';

const videoData = [
  {
    id: 1,
    url: "https://res.cloudinary.com/yakir/video/upload/w_600/video/user_video.mp4",
    title: "Woman Dancing",
  },
  {
    id: 2,
    url: "https://res.cloudinary.com/demo/video/upload/f_auto,q_auto/vc_h265/dog.mp4",
    title: "Dog Running on Beach",
  },
  {
    id: 3,
    url: "https://res.cloudinary.com/yakir/video/upload/w_600/video/user_video.mp4",
    title: "Coffee Pouring",
  },
  {
    id: 4,
    url: "https://res.cloudinary.com/yakir/video/upload/w_600/video/user_video.mp4",
    title: "Woman Stretching",
  },
  {
    id: 5,
    url: "https://res.cloudinary.com/yakir/video/upload/w_600/video/user_video.mp4",
    title: "Cooking in Pan",
  },
  {
    id: 6,
    url: "https://res.cloudinary.com/yakir/video/upload/w_600/video/user_video.mp4",
    title: "Cooking in Pan",
  },
  {
    id: 7,
    url: "https://res.cloudinary.com/yakir/video/upload/w_600/video/user_video.mp4",
    title: "Cooking in Pan",
  },
  {
    id: 8,
    url: "https://res.cloudinary.com/yakir/video/upload/w_600/video/user_video.mp4",
    title: "Cooking in Pan",
  },
];

export default function CarouselSize() {
  const [fullscreenVideo, setFullscreenVideo] = React.useState<number | null>(null);

  const openFullscreen = (index: number) => {
    setFullscreenVideo(index);
  };

  const closeFullscreen = () => {
    setFullscreenVideo(null);
  };

  return (
    <>
      <p className="text-gray-500 font-medium text-lg mt-6 mb-8">
        Recommended for you
      </p>
      <div className="flex justify-center mx-auto w-[86%]">
        <Carousel
          opts={{
            align: "start",
          }}
          className="max-w-[80%] sm:max-w-full custom-sm:max-w-[50%] custom-sm:bg-blue-u md:max-w-[98%] lg:max-w-full"
        >
          <CarouselContent>
            {videoData.map((video, index) => (
              <CarouselItem
                key={video.id}
                className="md:basis-1/3 flex justify-center basis-full sm:basis-1/3 lg:basis-1/5"
              >
                <Card className="w-56 h-72 flex flex-col bg-gray-100 overflow-hidden relative">
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
                  <div className="absolute bottom-0 left-0 right-0 p-2 bg-black text-white  flex justify-between items-center">
                    <p className="text-sm font-medium  truncate flex-1">{video.title}</p>
                    <button 
                      onClick={() => openFullscreen(index)} 
                      className="text-gray-600 hover:text-gray-900"
                    >
                      <Expand size={20} />
                    </button>
                  </div>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>

      {fullscreenVideo !== null && (
        <FullscreenVideoPlayer
          videos={videoData}
          initialVideoIndex={fullscreenVideo}
          onClose={closeFullscreen}
        />
      )}
    </>
  );
}