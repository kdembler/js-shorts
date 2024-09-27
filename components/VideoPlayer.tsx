/* components/VideoPlayer.tsx */
"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";

interface Video {
  url: string;
  title: string;
  description: string;
  channelName: string;
}

interface VideoPlayerProps {
  videos: Video[];
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ videos }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % videos.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? videos.length - 1 : prevIndex - 1
    );
  };

  const currentVideo = videos[currentIndex];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-xs md:max-w-sm lg:max-w-md">
        <div className="relative w-full aspect-[9/16]">
          <video
            src={currentVideo.url}
            controls
            autoPlay
            className="absolute inset-0 w-full h-full object-cover rounded-lg"
            onEnded={handleNext} // Auto-play next video
          />
        </div>
      </div>
      <div className="mt-4 text-center">
        <h1 className="text-lg md:text-xl font-bold">{currentVideo.title}</h1>
        <p className="text-sm text-gray-500">{currentVideo.channelName}</p>
        <p className="mt-2 text-sm text-gray-700">
          {currentVideo.description.length > 100
            ? `${currentVideo.description.substring(0, 100)}...`
            : currentVideo.description}
        </p>
      </div>
      <div className="mt-6 flex space-x-4">
        <Button variant="secondary" onClick={handlePrev}>
          Previous
        </Button>
        <Button variant="secondary" onClick={handleNext}>
          Next
        </Button>
      </div>
    </div>
  );
};

export default VideoPlayer;
