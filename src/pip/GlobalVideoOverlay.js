// GlobalVideoOverlay.js - Global overlay that persists across screens
import React from 'react';
import {View, StyleSheet} from 'react-native';
import GlobalVideoPlayer from './GlobalVideoPlayer';
import {useVideo} from './VideoContext';
import {useSelector} from 'react-redux';

const GlobalVideoOverlay = () => {
  const {
    currentVideo,
    videoPlayerRef,
    stopVideo,
    setIsPiPActive,
    setIsFullscreenActive,
    isGlobalPiP,
    setIsGlobalPiP,
  } = useVideo();
  const videoReducer = useSelector(state => state.video);

  // Only render if we have a video AND it's either not in PiP mode OR it's global PiP
  if (!currentVideo || (!isGlobalPiP && !currentVideo.forceGlobal)) return null;

  const handlePiPToggle = isActive => {
    setIsPiPActive(isActive);
    if (isActive) {
      setIsGlobalPiP(true);
    }
  };

  const handleFullscreenToggle = isActive => {
    setIsFullscreenActive(isActive);
    // Exit global PiP when going fullscreen
    if (isActive) {
      setIsGlobalPiP(false);
    }
  };

  const handleVideoEnd = () => {
    if (currentVideo.autoClose !== false) {
      stopVideo();
    }
  };

  const handlePiPExit = () => {
    setIsGlobalPiP(false);
    // Optionally stop the video completely or keep it paused
    if (currentVideo.stopOnPiPExit !== false) {
      stopVideo();
    }
  };

  return (
    <View style={styles.overlay} pointerEvents="box-none">
      <GlobalVideoPlayer
        ref={videoPlayerRef}
        onLoad={() => videoPlayerRef.current?.seek(videoReducer.currentTime)}
        source={currentVideo.source}
        onPiPToggle={handlePiPToggle}
        onFullscreenToggle={handleFullscreenToggle}
        onEnd={handleVideoEnd}
        onPiPExit={handlePiPExit}
        allowPiP={currentVideo.allowPiP !== false}
        pipSize={currentVideo.pipSize}
        forcePiP={isGlobalPiP}
        {...currentVideo.playerProps}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'box-none',
    zIndex: 9999,
  },
});

export default GlobalVideoOverlay;
