// VideoTrigger.js - Example component to trigger video
import React from 'react';
import {TouchableOpacity, View, Text, Image, StyleSheet} from 'react-native';
import {useVideo} from './VideoContext';

export const VideoTrigger = ({videoData}) => {
  const {showVideo} = useVideo();

  const handlePress = () => {
    showVideo(videoData);
  };

  return (
    <TouchableOpacity onPress={handlePress} style={styles.videoItem}>
      <Image source={{uri: videoData.thumbnail}} style={styles.thumbnail} />
      <View style={styles.videoInfo}>
        <Text style={styles.title}>{videoData.title}</Text>
        <Text style={styles.channel}>{videoData.channel}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  // Video Item Styles
  videoItem: {
    flexDirection: 'row',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  thumbnail: {
    width: 120,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
  },
  videoInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  channel: {
    fontSize: 14,
    color: '#666',
  },
});
