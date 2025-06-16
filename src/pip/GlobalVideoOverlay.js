// GlobalVideoOverlay.js - Renders the global video player
import React from 'react';
import {View, StyleSheet} from 'react-native';

import GlobalVideoPlayer from './GlobalVideoPlayer';
import {useVideo} from './VideoContext';

const GlobalVideoOverlay = () => {
  const {
    currentVideo,
    videoPlayerRef,
    stopVideo,
    setIsPiPActive,
    setIsFullscreenActive,
  } = useVideo();

  if (!currentVideo) return null;

  const handlePiPToggle = isActive => {
    setIsPiPActive(isActive);
  };

  const handleFullscreenToggle = isActive => {
    setIsFullscreenActive(isActive);
  };

  const handleVideoEnd = () => {
    if (currentVideo.autoClose !== false) {
      stopVideo();
    }
  };

  return (
    <View style={styles.overlay} pointerEvents="box-none">
      <GlobalVideoPlayer
        ref={videoPlayerRef}
        source={currentVideo.source}
        onPiPToggle={handlePiPToggle}
        onFullscreenToggle={handleFullscreenToggle}
        onEnd={handleVideoEnd}
        allowPiP={currentVideo.allowPiP !== false}
        pipSize={currentVideo.pipSize}
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
  },
});

export default GlobalVideoOverlay;
