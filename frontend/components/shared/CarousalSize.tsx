import * as React from "react";

import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export default function CarouselSize() {
  return (
    <Carousel
      opts={{
        align: "start",
      }}
      className="max-w-[80%] custom-sm:max-w-[50%] custom-sm:bg-blue-u md:max-w-[98%] lg:max-w-full"
    >
      <CarouselContent>
        {Array.from({ length: 10 }).map((_, index) => (
          <CarouselItem
            key={index}
            className="md:basis-1/3 flex justify-center basis-full sm:basis-1/3 lg:basis-1/5"
          >
            <Card className="w-56 h-72 flex  gap-4  items-center bg-gray-100 justify-center">
              <CardContent className="flex  aspect-square items-center justify-center p-6">
                <span className="text-3xl font-semibold">{index + 1}</span>
              </CardContent>
            </Card>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
