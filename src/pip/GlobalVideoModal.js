// GlobalVideoModal.js - Main video modal component
import React, {useRef, useEffect} from 'react';
import {
  View,
  Animated,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  Text,
  StatusBar,
  PanResponder,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Video from 'react-native-video'; // or expo-av
import {useVideo} from './VideoContext';

const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');
const PIP_WIDTH = 150;
const PIP_HEIGHT = 100;
const MARGIN = 16;

// Utility function to format time
const formatTime = seconds => {
  if (!seconds || isNaN(seconds)) return '0:00';

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

export const GlobalVideoModal = () => {
  const {videoState, hideVideo, togglePiP, updatePlaybackState, seekTo} =
    useVideo();
  const {
    isVisible,
    isPiP,
    videoData,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
  } = videoState;

  // Animation values for single video component
  const modalOpacity = useRef(new Animated.Value(0)).current;
  const videoScale = useRef(new Animated.Value(1)).current;
  const videoPosition = useRef(new Animated.ValueXY({x: 0, y: 0})).current;
  const videoBorderRadius = useRef(new Animated.Value(0)).current;

  // PiP specific position
  const pipPosition = useRef(
    new Animated.ValueXY({
      x: SCREEN_WIDTH - PIP_WIDTH - MARGIN,
      y: SCREEN_HEIGHT - PIP_HEIGHT - 100,
    }),
  ).current;

  // Track if we're dragging to prevent animation conflicts
  const isDragging = useRef(false);

  // Single video ref
  const videoRef = useRef(null);

  // Create PanResponder for PiP drag functionality
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => isPiP,
      onMoveShouldSetPanResponder: () => isPiP,
      onPanResponderGrant: () => {
        isDragging.current = true;
        // Set offset to current position
        pipPosition.setOffset({
          x: pipPosition.x._value,
          y: pipPosition.y._value,
        });
        pipPosition.setValue({x: 0, y: 0});

        videoPosition.setOffset({
          x: videoPosition.x._value,
          y: videoPosition.y._value,
        });
        videoPosition.setValue({x: 0, y: 0});
      },
      onPanResponderMove: Animated.event(
        [
          null,
          {
            dx: pipPosition.x,
            dy: pipPosition.y,
          },
        ],
        {
          useNativeDriver: true,
          listener: (evt, gestureState) => {
            // Update video position to follow pip position
            videoPosition.setValue({
              x: gestureState.dx,
              y: gestureState.dy,
            });
          },
        },
      ),
      onPanResponderRelease: (evt, gestureState) => {
        isDragging.current = false;
        pipPosition.flattenOffset();
        videoPosition.flattenOffset();

        // Calculate final position with edge snapping
        const currentX = pipPosition.x._value;
        const finalX =
          currentX > SCREEN_WIDTH / 2
            ? SCREEN_WIDTH - PIP_WIDTH - MARGIN
            : MARGIN;
        const finalY = Math.max(
          50,
          Math.min(pipPosition.y._value, SCREEN_HEIGHT - PIP_HEIGHT - 100),
        );

        // Animate to final position
        Animated.parallel([
          Animated.spring(pipPosition, {
            toValue: {x: finalX, y: finalY},
            useNativeDriver: true,
          }),
          Animated.spring(videoPosition, {
            toValue: {x: finalX, y: finalY - 250},
            useNativeDriver: true,
          }),
        ]).start();
      },
    }),
  ).current;

  // Update panResponder when isPiP changes
  useEffect(() => {
    // Store current position for PiP mode
    const currentPipX = pipPosition.x._value;
    const currentPipY = pipPosition.y._value;

    panResponder.panHandlers = PanResponder.create({
      onStartShouldSetPanResponder: () => isPiP,
      onMoveShouldSetPanResponder: () => isPiP,
      onPanResponderGrant: () => {
        isDragging.current = true;
      },
      onPanResponderMove: (evt, gestureState) => {
        if (isPiP) {
          const newX = currentPipX + gestureState.dx;
          const newY = currentPipY + gestureState.dy;

          pipPosition.setValue({
            x: newX,
            y: newY,
          });

          videoPosition.setValue({
            x: newX,
            y: newY - 250,
          });
        }
      },
      onPanResponderRelease: (evt, gestureState) => {
        isDragging.current = false;

        const currentX = currentPipX + gestureState.dx;
        const currentY = currentPipY + gestureState.dy;

        const finalX =
          currentX > SCREEN_WIDTH / 2
            ? SCREEN_WIDTH - PIP_WIDTH - MARGIN
            : MARGIN;

        const finalY = Math.max(
          50,
          Math.min(currentY, SCREEN_HEIGHT - PIP_HEIGHT - 100),
        );

        Animated.parallel([
          Animated.spring(pipPosition, {
            toValue: {x: finalX, y: finalY},
            useNativeDriver: true,
            tension: 40,
            friction: 8,
          }),
          Animated.spring(videoPosition, {
            toValue: {x: finalX, y: finalY - 250},
            useNativeDriver: true,
            tension: 40,
            friction: 8,
          }),
        ]).start();
      },
    }).panHandlers;
  }, [isPiP, pipPosition, videoPosition]);

  // Handle modal show/hide animations
  useEffect(() => {
    if (isVisible && !isPiP) {
      // Show full screen modal
      Animated.parallel([
        Animated.timing(modalOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(videoScale, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(videoPosition, {
          toValue: {x: 0, y: 0},
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(videoBorderRadius, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else if (!isVisible) {
      // Hide modal completely
      Animated.parallel([
        Animated.timing(modalOpacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(videoScale, {
          toValue: 0.8,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isVisible, isPiP]);

  // Handle PiP transitions with single video
  useEffect(() => {
    if (isPiP && isVisible) {
      // Set initial PiP position
      const initialPipX = SCREEN_WIDTH - PIP_WIDTH - MARGIN;
      const initialPipY = SCREEN_HEIGHT - PIP_HEIGHT - 100;

      // Update pip position to initial values
      pipPosition.setValue({
        x: initialPipX,
        y: initialPipY,
      });

      // Transition to PiP mode
      Animated.parallel([
        // Scale down the video
        Animated.timing(videoScale, {
          toValue: PIP_WIDTH / SCREEN_WIDTH,
          duration: 400,
          useNativeDriver: true,
        }),
        // Move to PiP position
        Animated.timing(videoPosition, {
          toValue: {
            x: initialPipX,
            y: initialPipY - 250,
          },
          duration: 400,
          useNativeDriver: true,
        }),
        // Add border radius for PiP look
        Animated.timing(videoBorderRadius, {
          toValue: 8,
          duration: 400,
          useNativeDriver: true,
        }),
        // Fade out modal background
        Animated.timing(modalOpacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else if (isVisible && !isPiP) {
      // Reset pip position when going back to fullscreen
      pipPosition.setValue({
        x: SCREEN_WIDTH - PIP_WIDTH - MARGIN,
        y: SCREEN_HEIGHT - PIP_HEIGHT - 100,
      });

      // Transition back to full screen
      Animated.parallel([
        // Scale back to full size
        Animated.timing(videoScale, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        // Move back to center
        Animated.timing(videoPosition, {
          toValue: {x: 0, y: 0},
          duration: 400,
          useNativeDriver: true,
        }),
        // Remove border radius
        Animated.timing(videoBorderRadius, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
        // Show modal background
        Animated.timing(modalOpacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isPiP, isVisible]);

  const handleVideoPress = () => {
    if (isPiP) {
      togglePiP(); // Exit PiP mode
    }
  };

  const handleClose = () => {
    hideVideo();
  };

  const handlePiPToggle = () => {
    togglePiP();
  };

  const handlePlayPause = () => {
    updatePlaybackState({isPlaying: !isPlaying});
  };

  // Enhanced video event handlers
  const handleVideoLoad = data => {
    updatePlaybackState({
      duration: data.duration,
      isBuffering: false,
    });
  };

  const handleVideoProgress = data => {
    updatePlaybackState({
      currentTime: data.currentTime,
      playableDuration: data.playableDuration,
    });
  };

  const handleVideoBuffer = ({isBuffering}) => {
    updatePlaybackState({isBuffering});
  };

  const handleVideoEnd = () => {
    updatePlaybackState({
      isPlaying: false,
      currentTime: 0,
    });
    if (videoRef.current) {
      videoRef.current.seek(0);
    }
  };

  console.log('isPiP===>', isPiP);
  console.log('isVisible===>', isVisible);

  if (!isVisible) return null;

  if (!isVisible) return null;

  return (
    <>
      {/* Full Screen Background - only show when not in PiP */}
      {!isPiP && (
        <Animated.View
          style={[
            styles.fullScreenContainer,
            {
              opacity: modalOpacity,
            },
          ]}>
          <StatusBar backgroundColor="#000" barStyle="light-content" />

          {/* Video Container */}
          <View style={styles.videoSection} />

          {/* Details Section */}
          <View style={styles.detailsContainer}>
            <Text style={styles.videoTitle}>{videoData?.title}</Text>
            <Text style={styles.videoDescription}>
              {videoData?.description}
            </Text>
            <View style={styles.videoStats}>
              <Text style={styles.statsText}>{videoData?.views} views</Text>
              <Text style={styles.statsText}>{videoData?.uploadDate}</Text>
            </View>

            {/* Progress Bar */}
            <View style={styles.progressContainer}>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    {width: `${(currentTime / duration) * 100}%`},
                  ]}
                />
              </View>
              <View style={styles.timeContainer}>
                <Text style={styles.timeText}>
                  {formatTime(currentTime)} / {formatTime(duration)}
                </Text>
              </View>
            </View>
          </View>
        </Animated.View>
      )}

      {/* Video Component - Always on top */}
      <Animated.View
        style={[
          styles.animatedVideoContainer,
          {
            transform: [
              {scale: videoScale},
              {translateX: videoPosition.x},
              {translateY: videoPosition.y},
            ],
            borderRadius: videoBorderRadius,
            zIndex: isPiP ? 1000 : 100,
            elevation: isPiP ? 10 : 5,
          },
        ]}
        {...(isPiP ? panResponder.panHandlers : {})}>
        <TouchableOpacity
          onPress={handleVideoPress}
          style={styles.videoTouchable}
          activeOpacity={isPiP ? 0.8 : 1}>
          <Video
            ref={videoRef}
            source={{uri: videoData?.url}}
            style={[styles.singleVideo]}
            resizeMode={'contain'}
            paused={!isPlaying}
            // volume={isPiP ? 0 : volume}
            // muted={isPiP ? true : isMuted}
            onLoad={handleVideoLoad}
            onProgress={handleVideoProgress}
            onBuffer={handleVideoBuffer}
            onEnd={handleVideoEnd}
            progressUpdateInterval={250}
          />

          {/* Controls Overlay - only show when not in PiP */}
          {!isPiP && (
            <View style={styles.controlsOverlay}>
              <View style={styles.topControls}>
                <TouchableOpacity
                  onPress={handleClose}
                  style={styles.controlButton}>
                  <Ionicons name="chevron-down" size={28} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handlePiPToggle}
                  style={styles.controlButton}>
                  <Ionicons name="contract" size={24} color="#fff" />
                </TouchableOpacity>
              </View>

              <View style={styles.centerControls}>
                <TouchableOpacity
                  onPress={handlePlayPause}
                  style={styles.playButton}>
                  <Ionicons
                    name={isPlaying ? 'pause' : 'play'}
                    size={50}
                    color="#fff"
                  />
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* PiP Controls - only show in PiP mode */}
          {isPiP && (
            <View style={styles.pipControls}>
              <TouchableOpacity
                onPress={handlePlayPause}
                style={styles.pipPlayButton}>
                <Ionicons
                  name={isPlaying ? 'pause' : 'play'}
                  size={16}
                  color="#fff"
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleClose}
                style={styles.pipCloseButton}>
                <Ionicons name="close" size={16} color="#fff" />
              </TouchableOpacity>
            </View>
          )}

          {/* PiP Progress Bar */}
          {isPiP && (
            <View style={styles.pipProgressContainer}>
              <View
                style={[
                  styles.pipProgress,
                  {width: `${(currentTime / duration) * 100}%`},
                ]}
              />
            </View>
          )}
        </TouchableOpacity>
      </Animated.View>
    </>
  );
};

const styles = StyleSheet.create({
  fullScreenContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#000',
    zIndex: 10,
  },
  videoSection: {
    height: 300, // Space for video
  },
  animatedVideoContainer: {
    position: 'absolute',
    top: 50, // Status bar height
    left: 0,
    width: SCREEN_WIDTH,
    height: 250,
    backgroundColor: '#000',
    overflow: 'hidden',
  },
  videoTouchable: {
    flex: 1,
  },
  singleVideo: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  pipVideoStyle: {
    width: PIP_WIDTH,
    height: PIP_HEIGHT,
  },
  controlsOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'space-between',
  },
  topControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  centerControls: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  controlButton: {
    padding: 8,
  },
  playButton: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 35,
    padding: 15,
  },
  detailsContainer: {
    padding: 16,
    backgroundColor: '#fff',
    flex: 1,
  },
  videoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  videoDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  videoStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statsText: {
    fontSize: 12,
    color: '#999',
  },
  progressContainer: {
    marginTop: 16,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#e0e0e0',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#ff0000',
  },
  timeContainer: {
    marginTop: 8,
    alignItems: 'center',
  },
  timeText: {
    fontSize: 12,
    color: '#666',
  },

  // PiP Styles
  pipControls: {
    position: 'absolute',
    top: 4,
    right: 4,
    flexDirection: 'row',
  },
  pipPlayButton: {
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 12,
    padding: 4,
    marginRight: 4,
  },
  pipCloseButton: {
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 12,
    padding: 4,
  },
  pipProgressContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  pipProgress: {
    height: '100%',
    backgroundColor: '#ff0000',
  },
});
