// components/VideoFeed.tsx
"use client";

import React, { useState } from "react";
import { parseVideos, useVideos } from "@/graphql/hooks/videos";
import SwipeableVideoCard from "./SwipeableVideoCard";
import { AnimatePresence } from "framer-motion";
import Header from "./Header";
import { ChevronsLeftRight } from "lucide-react";

const VideoFeed: React.FC = () => {
  const { data, isLoading, error } = useVideos();
  const [currentIndex, setCurrentIndex] = useState(0);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [likedVideos, setLikedVideos] = useState<string[]>([]);

  if (isLoading) return <div>Loading...</div>;
  if (error || !data) return <div>Error loading videos.</div>;

  const videos = parseVideos(data);

  const handleSwipe = (direction: "left" | "right", videoId: string) => {
    if (direction === "right") {
      setLikedVideos((prev) => [...prev, videoId]);
    }
    setCurrentIndex((prevIndex) => prevIndex + 1);
  };

  if (currentIndex >= videos.length) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <Header />
        <h2 className="text-2xl font-bold mt-20">
          You&apos;ve reached the end!
        </h2>
        <p className="mt-2 text-gray-600">No more videos to display.</p>
      </div>
    );
  }

  const remainingVideos = videos.slice(currentIndex);

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden">
      <Header />
      <AnimatePresence>
        {remainingVideos.slice(0, 3).map((video, index) => (
          <SwipeableVideoCard
            key={video.id}
            video={video}
            onSwipe={handleSwipe}
            index={index}
          />
        ))}
      </AnimatePresence>
      <div className="absolute bottom-10 w-full flex justify-center">
        <div className="flex items-center space-x-2 bg-black bg-opacity-50 px-4 py-2 rounded-full">
          <ChevronsLeftRight className="text-white" size={24} />
          <span className="text-white text-sm">Swipe left or right</span>
        </div>
      </div>
    </div>
  );
};

export default VideoFeed;
