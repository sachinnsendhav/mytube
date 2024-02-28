import React, { useEffect, useState } from 'react';
import {
  View,
  ScrollView,
  Text,
  ActivityIndicator,
  StyleSheet,
  Alert,
  RefreshControl,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Channel, YoutubeApi } from '../../services';
import YouTube from 'react-native-youtube-iframe';

const VideoChannelAll = () => {
  const [channelList, setChannelList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentChannelIndex, setCurrentChannelIndex] = useState(0);
  const [videos, setVideos] = useState([]);
  const [showVideos, setShowVideos] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    getChannelList();
  }, []);

  useEffect(() => {
    if (showVideos && currentChannelIndex < channelList.length) {
      fetchVideos(channelList[currentChannelIndex].channelId); // Corrected function name
    }
  }, [showVideos, currentChannelIndex]);
  

  const getChannelList = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('token');
      // Clear the videos state
      setVideos([]);
      const result = await Channel.getChannelList(token);
      const newChannelList = result?.data;
      
      // Check if there are any differences in the channel list
      const isDifferent = JSON.stringify(channelList) !== JSON.stringify(newChannelList);
      
      if (isDifferent) {
        setChannelList(newChannelList);
        setCurrentChannelIndex(0);
        setShowVideos(true);
      }
    } catch (err) {
      console.error(err, 'error');
    }
    setLoading(false);
  };
  
  
  const fetchVideos = async (channelId) => {
    try {
      const result = await YoutubeApi.getVideosByChannelId2(channelId);
      console.log(result,"result in allvideos")
      setVideos((prevVideos) => [...prevVideos, ...result.items]);
      setCurrentChannelIndex((prevIndex) => prevIndex + 1);
    } catch (error) {
      console.error(error);
    }
  };


  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    getChannelList().then(() => setRefreshing(false));
  }, []);

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : showVideos ? (
        <ScrollView
          style={[styles.scrollView, { paddingRight: 10 }]}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
          {videos.map((video, index) => (
            <YouTube
              key={index}
              videoId={video.id.videoId}
              height={200}
              style={styles.youtube}
            />
          ))}
        </ScrollView>
      ) : (
        <Text>No videos to show</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  scrollView: {
    flex: 1,
  },
  youtube: {
    alignSelf: 'stretch',
    height: 300,
    marginVertical: 10,
  },
});

export default VideoChannelAll;
