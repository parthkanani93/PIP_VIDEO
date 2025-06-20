// VideoContext.js - Global state management for video
import React, {createContext, useState, useContext, useRef} from 'react';

const VideoContext = createContext();

export const VideoProvider = ({children}) => {
  const [currentVideo, setCurrentVideo] = useState(null);
  const [isPiPActive, setIsPiPActive] = useState(false);
  const [isFullscreenActive, setIsFullscreenActive] = useState(false);
  const [isGlobalPiP, setIsGlobalPiP] = useState(false); // New state for global PiP
  const videoPlayerRef = useRef(null);

  const playVideo = (videoSource, options = {}) => {
    setCurrentVideo({
      source: videoSource,
      ...options,
    });
  };

  const stopVideo = () => {
    setCurrentVideo(null);
    setIsPiPActive(false);
    setIsFullscreenActive(false);
    setIsGlobalPiP(false);
  };

  const enableGlobalPiP = (videoSource, options = {}) => {
    setCurrentVideo({
      source: videoSource,
      ...options,
    });
    setIsGlobalPiP(true);
    setIsPiPActive(true);
  };

  const togglePiP = () => {
    if (videoPlayerRef.current) {
      videoPlayerRef.current.togglePiP();
    }
  };

  const exitPiP = () => {
    if (videoPlayerRef.current) {
      videoPlayerRef.current.exitPiP();
    }
    setIsGlobalPiP(false);
  };

  const value = {
    currentVideo,
    isPiPActive,
    isFullscreenActive,
    isGlobalPiP,
    videoPlayerRef,
    playVideo,
    stopVideo,
    enableGlobalPiP,
    togglePiP,
    exitPiP,
    setIsPiPActive,
    setIsFullscreenActive,
    setIsGlobalPiP,
  };

  return (
    <VideoContext.Provider value={value}>{children}</VideoContext.Provider>
  );
};

export const useVideo = () => {
  const context = useContext(VideoContext);
  if (!context) {
    throw new Error('useVideo must be used within a VideoProvider');
  }
  return context;
};
