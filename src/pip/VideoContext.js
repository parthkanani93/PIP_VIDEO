// VideoContext.js - Global state management
import React, {createContext, useContext, useState} from 'react';

const VideoContext = createContext();

export const VideoProvider = ({children}) => {
  const [videoState, setVideoState] = useState({
    isVisible: false,
    isPiP: false,
    videoData: null,
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    volume: 1.0,
    playbackRate: 1.0,
    isBuffering: false,
    isMuted: false,
  });

  const showVideo = videoData => {
    setVideoState(prev => ({
      ...prev,
      isVisible: true,
      isPiP: false,
      videoData,
      isPlaying: true,
    }));
  };

  const hideVideo = () => {
    setVideoState(prev => ({
      ...prev,
      isVisible: false,
      isPiP: false,
      isPlaying: false,
    }));
  };

  const togglePiP = () => {
    setVideoState(prev => ({
      ...prev,
      isPiP: !prev.isPiP,
      // Keep audio unmuted when going back to full screen
      // isMuted: !prev.isPiP ? true : false,
    }));
  };

  const seekTo = time => {
    setVideoState(prev => ({
      ...prev,
      currentTime: time,
    }));
  };

  const updatePlaybackState = updates => {
    setVideoState(prev => ({...prev, ...updates}));
  };

  return (
    <VideoContext.Provider
      value={{
        videoState,
        showVideo,
        hideVideo,
        togglePiP,
        updatePlaybackState,
        seekTo,
      }}>
      {children}
    </VideoContext.Provider>
  );
};

export const useVideo = () => {
  const context = useContext(VideoContext);
  if (!context) {
    throw new Error('useVideo must be used within VideoProvider');
  }
  return context;
};
