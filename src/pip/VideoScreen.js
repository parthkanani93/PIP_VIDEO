import {View, Text, ScrollView} from 'react-native';
import React from 'react';
import {VideoTrigger} from './VideoTrigger';

const VideoScreen = () => {
  const sampleVideos = [
    {
      id: '1',
      title: 'Sample Video 1',
      url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      thumbnail: 'https://via.placeholder.com/300x200',
      channel: 'Sample Channel',
      views: '1.2M',
      uploadDate: '2 days ago',
      description: 'This is a sample video description...',
    },
    // Add more sample videos...
  ];

  return (
    <ScrollView>
      {sampleVideos.map(video => (
        <VideoTrigger key={video.id} videoData={video} />
      ))}
    </ScrollView>
  );
};

export default VideoScreen;
