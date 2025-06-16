// GlobalVideoPlayer.js
import React, {
  useState,
  useRef,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  PanResponder,
  Animated,
  TouchableOpacity,
  Text,
  StatusBar,
  Platform,
} from 'react-native';
import Video from 'react-native-video';
import Icon from 'react-native-vector-icons/MaterialIcons';

const {width: screenWidth, height: screenHeight} = Dimensions.get('window');

const GlobalVideoPlayer = forwardRef(
  (
    {
      source,
      style,
      onLoad,
      onProgress,
      onEnd,
      onError,
      resizeMode = 'contain',
      controls = true,
      paused: initialPaused = false,
      muted = false,
      volume = 1.0,
      rate = 1.0,
      repeat = false,
      allowPiP = true,
      pipSize = {width: 200, height: 120},
      onPiPToggle,
      onFullscreenToggle,
      onPiPExit,
      forcePiP = false,
      ...otherProps
    },
    ref,
  ) => {
    const [paused, setPaused] = useState(initialPaused);
    const [isPiP, setIsPiP] = useState(forcePiP);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [showControls, setShowControls] = useState(true);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    // PiP positioning
    const pipPosition = useRef(
      new Animated.ValueXY({
        x: screenWidth - pipSize.width - 20,
        y: screenHeight - pipSize.height - 100,
      }),
    ).current;

    const videoRef = useRef(null);
    const controlsTimeoutRef = useRef(null);

    // PiP drag handler
    const panResponder = useRef(
      PanResponder.create({
        onMoveShouldSetPanResponder: () => isPiP,
        onPanResponderGrant: () => {
          pipPosition.setOffset({
            x: pipPosition.x._value,
            y: pipPosition.y._value,
          });
        },
        onPanResponderMove: Animated.event(
          [null, {dx: pipPosition.x, dy: pipPosition.y}],
          {useNativeDriver: false},
        ),
        onPanResponderRelease: (evt, gestureState) => {
          pipPosition.flattenOffset();

          // Snap to edges
          const {x, y} = gestureState;
          let finalX = pipPosition.x._value;
          let finalY = pipPosition.y._value;

          // Snap to left or right edge
          if (finalX < screenWidth / 2) {
            finalX = 20;
          } else {
            finalX = screenWidth - pipSize.width - 20;
          }

          // Keep within screen bounds
          finalY = Math.max(
            20,
            Math.min(finalY, screenHeight - pipSize.height - 100),
          );

          Animated.spring(pipPosition, {
            toValue: {x: finalX, y: finalY},
            useNativeDriver: false,
          }).start();
        },
      }),
    ).current;

    // Expose methods via ref
    useImperativeHandle(ref, () => ({
      play: () => setPaused(false),
      pause: () => setPaused(true),
      seek: time => videoRef.current?.seek(time),
      togglePiP: () => togglePiP(),
      toggleFullscreen: () => toggleFullscreen(),
      exitPiP: () => exitPiP(),
      getCurrentTime: () => currentTime,
      getDuration: () => duration,
      isPiPMode: () => isPiP,
      isFullscreenMode: () => isFullscreen,
    }));

    const togglePiP = () => {
      if (!allowPiP) return;

      const newPiPState = !isPiP;
      setIsPiP(newPiPState);

      if (newPiPState) {
        setIsFullscreen(false);
      }

      onPiPToggle?.(newPiPState);
    };

    const exitPiP = () => {
      setIsPiP(false);
      onPiPToggle?.(false);
      onPiPExit?.();
    };

    const toggleFullscreen = () => {
      const newFullscreenState = !isFullscreen;
      setIsFullscreen(newFullscreenState);

      if (newFullscreenState) {
        setIsPiP(false);
      }

      onFullscreenToggle?.(newFullscreenState);
    };

    const togglePlayPause = () => {
      setPaused(!paused);
    };

    const handleControlsVisibility = () => {
      if (!controls) return;

      setShowControls(true);

      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }

      controlsTimeoutRef.current = setTimeout(() => {
        if (!paused) {
          setShowControls(false);
        }
      }, 3000);
    };

    const formatTime = timeInSeconds => {
      const minutes = Math.floor(timeInSeconds / 60);
      const seconds = Math.floor(timeInSeconds % 60);
      return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    const handleLoad = data => {
      setDuration(data.duration);
      setIsLoading(false);
      onLoad?.(data);
    };

    const handleProgress = data => {
      setCurrentTime(data.currentTime);
      onProgress?.(data);
    };

    useEffect(() => {
      if (forcePiP !== isPiP) {
        setIsPiP(forcePiP);
      }
    }, [forcePiP]);

    useEffect(() => {
      if (paused) {
        setShowControls(true);
      } else {
        handleControlsVisibility();
      }
    }, [paused]);

    useEffect(() => {
      return () => {
        if (controlsTimeoutRef.current) {
          clearTimeout(controlsTimeoutRef.current);
        }
      };
    }, []);

    const getVideoStyle = () => {
      if (isPiP) {
        return [
          styles.pipVideo,
          {
            width: pipSize.width,
            height: pipSize.height,
          },
        ];
      } else if (isFullscreen) {
        return styles.fullscreenVideo;
      } else {
        return [styles.normalVideo, style];
      }
    };

    const getContainerStyle = () => {
      if (isPiP) {
        return [
          styles.pipContainer,
          {
            width: pipSize.width,
            height: pipSize.height,
            transform: pipPosition.getTranslateTransform(),
          },
        ];
      } else if (isFullscreen) {
        return styles.fullscreenContainer;
      } else {
        return [styles.normalContainer, style];
      }
    };

    const renderControls = () => {
      if (!controls || !showControls) return null;

      return (
        <View
          style={[
            styles.controlsContainer,
            isPiP && styles.pipControls,
            isFullscreen && styles.fullscreenControls,
          ]}>
          {!isPiP && (
            <>
              <View style={styles.topControls}>
                {isFullscreen && (
                  <TouchableOpacity
                    style={styles.controlButton}
                    onPress={toggleFullscreen}>
                    <Icon name="fullscreen-exit" size={24} color="white" />
                  </TouchableOpacity>
                )}
              </View>

              <View style={styles.centerControls}>
                <TouchableOpacity
                  style={styles.playButton}
                  onPress={togglePlayPause}>
                  <Icon
                    name={paused ? 'play-arrow' : 'pause'}
                    size={isFullscreen ? 60 : 40}
                    color="white"
                  />
                </TouchableOpacity>
              </View>
            </>
          )}

          <View style={styles.bottomControls}>
            {!isPiP && (
              <>
                <Text style={styles.timeText}>
                  {formatTime(currentTime)} / {formatTime(duration)}
                </Text>

                <View style={styles.controlsRow}>
                  {allowPiP && (
                    <TouchableOpacity
                      style={styles.controlButton}
                      onPress={togglePiP}>
                      <Icon
                        name="picture-in-picture-alt"
                        size={20}
                        color="white"
                      />
                    </TouchableOpacity>
                  )}

                  {!isFullscreen && (
                    <TouchableOpacity
                      style={styles.controlButton}
                      onPress={toggleFullscreen}>
                      <Icon name="fullscreen" size={20} color="white" />
                    </TouchableOpacity>
                  )}
                </View>
              </>
            )}

            {isPiP && (
              <TouchableOpacity style={styles.pipCloseButton} onPress={exitPiP}>
                <Icon name="close" size={16} color="white" />
              </TouchableOpacity>
            )}
          </View>
        </View>
      );
    };

    return (
      <Animated.View
        style={getContainerStyle()}
        {...(isPiP ? panResponder.panHandlers : {})}>
        <TouchableOpacity
          style={styles.videoWrapper}
          activeOpacity={1}
          onPress={handleControlsVisibility}>
          <Video
            ref={videoRef}
            source={source}
            style={getVideoStyle()}
            paused={paused}
            muted={muted}
            volume={volume}
            rate={rate}
            repeat={repeat}
            resizeMode={resizeMode}
            onLoad={handleLoad}
            onProgress={handleProgress}
            onEnd={onEnd}
            onError={onError}
            {...otherProps}
          />

          {isLoading && (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>Loading...</Text>
            </View>
          )}

          {renderControls()}
        </TouchableOpacity>
      </Animated.View>
    );
  },
);

const styles = StyleSheet.create({
  normalContainer: {
    backgroundColor: 'black',
    borderRadius: 8,
    overflow: 'hidden',
  },
  pipContainer: {
    position: 'absolute',
    backgroundColor: 'black',
    borderRadius: 8,
    overflow: 'hidden',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.8,
    shadowRadius: 4,
    zIndex: 9999,
  },
  fullscreenContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'black',
    zIndex: 9998,
  },
  videoWrapper: {
    flex: 1,
    position: 'relative',
  },
  normalVideo: {
    flex: 1,
  },
  pipVideo: {
    flex: 1,
  },
  fullscreenVideo: {
    flex: 1,
  },
  controlsContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'space-between',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  pipControls: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  fullscreenControls: {
    paddingTop: Platform.OS === 'ios' ? 40 : StatusBar.currentHeight,
  },
  topControls: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 16,
  },
  centerControls: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  controlButton: {
    marginLeft: 16,
    padding: 8,
  },
  playButton: {
    padding: 16,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  pipCloseButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    padding: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 12,
  },
  timeText: {
    color: 'white',
    fontSize: 12,
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  loadingText: {
    color: 'white',
    fontSize: 16,
  },
});

export default GlobalVideoPlayer;
