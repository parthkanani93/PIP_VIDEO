import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
} from 'react-native';
import {useVideo} from './VideoContext';
import GlobalVideoPlayer from './GlobalVideoPlayer';

const {width} = Dimensions.get('window');

const VideoScreen = () => {
  const {playVideo, currentVideo, isPiPActive} = useVideo();

  const videoSources = [
    {
      id: 1,
      title: 'Sample Video 1',
      uri: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    },
    {
      id: 2,
      title: 'Sample Video 2',
      uri: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    },
  ];

  const handlePlayVideo = video => {
    playVideo(
      {uri: video.uri},
      {
        allowPiP: true,
        pipSize: {width: 200, height: 120},
        playerProps: {
          resizeMode: 'contain',
          controls: true,
        },
      },
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Video Gallery</Text>

      {/* Embedded Video Player */}
      <View style={styles.embeddedSection}>
        <Text style={styles.sectionTitle}>Embedded Player</Text>
        <GlobalVideoPlayer
          source={{
            uri: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
          }}
          style={styles.embeddedVideo}
          allowPiP={true}
          pipSize={{width: 180, height: 100}}
          onPiPToggle={isActive => {
            console.log('Embedded video PiP:', isActive);
          }}
        />
      </View>

      {/* Video List */}
      <View style={styles.videoList}>
        <Text style={styles.sectionTitle}>Global Player Videos</Text>
        {videoSources.map(video => (
          <TouchableOpacity
            key={video.id}
            style={styles.videoItem}
            onPress={() => handlePlayVideo(video)}>
            <Text style={styles.videoTitle}>{video.title}</Text>
            <Text style={styles.playText}>Tap to play</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Status Info */}
      <View style={styles.statusSection}>
        <Text style={styles.sectionTitle}>Status</Text>
        <Text style={styles.statusText}>
          Global Video Active: {currentVideo ? 'Yes' : 'No'}
        </Text>
        <Text style={styles.statusText}>
          PiP Active: {isPiPActive ? 'Yes' : 'No'}
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
  },
  embeddedSection: {
    margin: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  embeddedVideo: {
    width: width - 40,
    height: 200,
  },
  videoList: {
    margin: 20,
  },
  videoItem: {
    backgroundColor: 'white',
    padding: 20,
    marginBottom: 10,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  videoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  playText: {
    color: '#007AFF',
    fontSize: 14,
  },
  statusSection: {
    margin: 20,
    padding: 15,
    backgroundColor: 'white',
    borderRadius: 8,
  },
  statusText: {
    fontSize: 14,
    marginBottom: 5,
  },
});

export default VideoScreen;
