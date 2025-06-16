import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import {useVideo} from './VideoContext';
import GlobalVideoPlayer from './GlobalVideoPlayer';

const {width} = Dimensions.get('window');

const VideoScreen = ({navigation}) => {
  const {enableGlobalPiP, currentVideo, isPiPActive, isGlobalPiP} = useVideo();

  const videoSources = [
    {
      id: 1,
      title: 'Big Buck Bunny',
      uri: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    },
    {
      id: 2,
      title: 'Elephants Dream',
      uri: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    },
    {
      id: 3,
      title: 'For Bigger Blazes',
      uri: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    },
  ];

  const handlePlayGlobalVideo = video => {
    enableGlobalPiP(
      {uri: video.uri},
      {
        allowPiP: true,
        pipSize: {width: 200, height: 120},
        stopOnPiPExit: false,
        playerProps: {
          resizeMode: 'contain',
          controls: true,
        },
      },
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Text style={styles.title}>Video Screen</Text>

        {/* Embedded Video Player - This one doesn't persist across screens */}
        <View style={styles.embeddedSection}>
          <Text style={styles.sectionTitle}>
            Embedded Player (Screen-local)
          </Text>
          <GlobalVideoPlayer
            source={{
              uri: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
            }}
            style={styles.embeddedVideo}
            allowPiP={false} // Disable PiP for embedded player to avoid conflicts
            onPiPToggle={isActive => {
              console.log('Embedded video PiP:', isActive);
            }}
          />
        </View>

        {/* Global Video List */}
        <View style={styles.videoList}>
          <Text style={styles.sectionTitle}>Global PiP Videos</Text>
          <Text style={styles.subtitle}>
            These videos will persist across screens when in PiP mode
          </Text>

          {videoSources.map(video => (
            <TouchableOpacity
              key={video.id}
              style={styles.videoItem}
              onPress={() => handlePlayGlobalVideo(video)}>
              <Text style={styles.videoTitle}>{video.title}</Text>
              <Text style={styles.playText}>Tap to play globally</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Navigation Buttons */}
        <View style={styles.navigationSection}>
          <TouchableOpacity
            style={styles.navButton}
            onPress={() => navigation.navigate('Home')}>
            <Text style={styles.buttonText}>Go to Home</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navButton}
            onPress={() => navigation.navigate('Other')}>
            <Text style={styles.buttonText}>Go to Other Screen</Text>
          </TouchableOpacity>
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
          <Text style={styles.statusText}>
            Global PiP: {isGlobalPiP ? 'Yes' : 'No'}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
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
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
    fontStyle: 'italic',
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
  navigationSection: {
    margin: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  navButton: {
    backgroundColor: '#34C759',
    padding: 15,
    borderRadius: 8,
    flex: 0.48,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
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
