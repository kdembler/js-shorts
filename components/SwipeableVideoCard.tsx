// components/SwipeableVideoCard.tsx
"use client";

import React, { useState, useRef, useEffect } from "react";
import { Play, Pause } from "lucide-react";
import {
  AnimatePresence,
  motion,
  PanInfo,
  useMotionValue,
  useTransform,
} from "framer-motion";
import { Video } from "@/types/video";

interface SwipeableVideoCardProps {
  video: Video;
  onSwipe: (direction: "left" | "right", videoId: string) => void;
  index: number;
}

const SwipeableVideoCard: React.FC<SwipeableVideoCardProps> = ({
  video,
  onSwipe,
  index,
}) => {
  const [direction, setDirection] = useState<"left" | "right" | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showPlayIcon, setShowPlayIcon] = useState(false);
  const [showPauseIcon, setShowPauseIcon] = useState(false);

  // Play the video only if it's the top card
  useEffect(() => {
    if (index === 0 && videoRef.current) {
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
          })
          .catch(() => {
            // Autoplay was prevented
            setIsPlaying(false);
          });
      }
    } else if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  }, [index]);

  // log showPlayIcon and showPauseIcon
  useEffect(() => {
    console.log({ showPlayIcon, showPauseIcon });
  }, [showPlayIcon, showPauseIcon]);

  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-10, 10]);

  const likeOpacity = useTransform(x, [0, 150], [0, 1]);
  const dislikeOpacity = useTransform(x, [-150, 0], [1, 0]);

  // print x and direction
  useEffect(() => {
    if (index === 0) {
      console.log({
        x: x.get(),
        direction,
        index,
        isDragging,
        likeOpacity: likeOpacity.get(),
      });
    }
  }, [x, direction, index, isDragging, likeOpacity]);

  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDragEnd = (
    event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    setIsDragging(false);
    const threshold = 300;
    if (info.offset.x > threshold) {
      setDirection("right");
    } else if (info.offset.x < -threshold) {
      setDirection("left");
    } else {
      setDirection(null);
    }
  };

  const handleAnimationComplete = () => {
    if (direction && index === 0) {
      onSwipe(direction, video.id);
    }
    setDirection(null);
    // x.set(0);
  };

  const handleVideoClick = () => {
    if (isDragging) return; // Prevent click during drag
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setShowPauseIcon(true);
        // Hide the icon after 1 second
        setTimeout(() => setShowPauseIcon(false), 1000);
      } else {
        const playPromise = videoRef.current.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              setShowPlayIcon(true);
              // Hide the icon after 1 second
              setTimeout(() => setShowPlayIcon(false), 1000);
            })
            .catch(() => {
              // Handle play promise rejection
            });
        }
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Update play state when video actually plays or pauses
  const handlePlay = () => {
    setIsPlaying(true);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const cardVariants = {
    initial: (custom: number) => ({
      x: 0,
      y: custom * -20,
      scale: 1 - custom * 0.05,
      opacity: 1,
    }),
    swipeRight: { x: 1000, opacity: 0 },
    swipeLeft: { x: -1000, opacity: 0 },
  };

  return (
    <motion.div
      className="absolute w-full max-w-xs md:max-w-sm lg:max-w-md"
      custom={index}
      drag={index === 0 ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      onDragStart={index === 0 ? handleDragStart : undefined}
      onDragEnd={index === 0 ? handleDragEnd : undefined}
      variants={cardVariants}
      initial="initial"
      animate={
        direction
          ? direction === "right"
            ? "swipeRight"
            : "swipeLeft"
          : "initial"
      }
      exit={
        direction
          ? direction === "right"
            ? "swipeRight"
            : "swipeLeft"
          : "initial"
      }
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      onAnimationComplete={handleAnimationComplete}
      style={{
        x: index === 0 ? x : 0,
        rotate: index === 0 ? rotate : 0,
        // opacity: index === 0 ? opacity : 0,
        zIndex: 100 - index,
      }}
    >
      {/* Like/Dislike Feedback */}
      {index === 0 && (
        <>
          <motion.div
            className="absolute top-20 right-10 z-[100]"
            style={{ opacity: likeOpacity }}
          >
            <span className="text-4xl font-bold text-green-500">Liked</span>
          </motion.div>
          <motion.div
            className="absolute top-20 left-10 z-[100]"
            style={{ opacity: dislikeOpacity }}
          >
            <span className="text-4xl font-bold text-red-500">Disliked</span>
          </motion.div>
        </>
      )}

      {/* Play/Pause Feedback */}
      <AnimatePresence>
        {showPlayIcon && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center z-[100] pointer-events-none"
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            key="play-icon"
          >
            <Play size={64} className="text-white" />
          </motion.div>
        )}
        {showPauseIcon && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center z-[100] pointer-events-none"
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            key="pause-icon"
          >
            <Pause size={64} className="text-white" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Card Content */}
      <div className="relative w-full aspect-[9/16] bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Video Element */}
        <div className="relative w-full h-full">
          <video
            ref={videoRef}
            src={video.url}
            loop
            className="w-full h-full object-cover"
            onClick={handleVideoClick}
            onPlay={handlePlay}
            onPause={handlePause}
            playsInline // For iOS devices
          />
          {/* Text Overlay */}
          <div className="absolute bottom-0 w-full bg-gradient-to-t from-black via-transparent to-transparent p-4">
            <h1 className="text-xl font-bold text-white">{video.title}</h1>
            <p className="text-sm text-gray-300">{video.channelName}</p>
            <p className="mt-2 text-sm text-gray-200">
              {video.description.length > 100
                ? `${video.description.substring(0, 100)}...`
                : video.description}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SwipeableVideoCard;
