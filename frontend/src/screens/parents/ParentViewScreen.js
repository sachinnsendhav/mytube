import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, ScrollView, Alert, TouchableWithoutFeedback } from 'react-native';
import { Video } from '../../services';
import AsyncStorage from '@react-native-async-storage/async-storage';
import YoutubePlayer from 'react-native-youtube-iframe';
import { Card, Title } from 'react-native-paper';

const ParentViewScreen = ({ route }) => {
  const clickedPlaylistId = route.params.id;
  const [videos, setVideos] = useState([]);
  const playerRef = useRef(null);

  useEffect(() => {
    fetchPlaylistData();
  }, []);

  const fetchPlaylistData = async () => {
    const token = await AsyncStorage.getItem('token');
    try {
      const response = await Video.getVideosByPlaylist(token, clickedPlaylistId);
      setVideos(response.data.video);
    } catch (error) {
      console.error('Error fetching playlist data:', error);
      Alert.alert('Error', 'Failed to fetch playlist data');
    }
  };

  const handleCardPress = (videoId) => {
    if (videos === videoId) {
      playerRef.current && typeof playerRef.current.pause === 'function' && playerRef.current.pause();
    } else {
      playerRef.current && typeof playerRef.current.pause === 'function' && playerRef.current.pause();
      if (playerRef.current && typeof playerRef.current.play === 'function' && !playerRef.current.isPlaying()) {
        setVideos(videoId);
      }
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        {videos.map((item) => (
          <TouchableWithoutFeedback key={item._id} onPress={() => handleCardPress(item._id)}>
            <View>
              <Card style={styles.card}>
                <YoutubePlayer
                  ref={playerRef}
                  height={200}
                  videoId={getYouTubeVideoId(item.videoUrl)}
                />
                <View style={styles.videoInfoContainer}>
                  <Text style={styles.videoName}>{item.videoName}</Text>
                </View>
              </Card>
            </View>
          </TouchableWithoutFeedback>
        ))}
      </ScrollView>
    </View>
  );
};

const getYouTubeVideoId = (url) => {
  const videoIdRegex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const match = url.match(videoIdRegex);
  return match ? match[1] : '';
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  card: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 10,
    padding: 10,
  },
  videoInfoContainer: {
    padding: 8,
  },
  videoName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
});

export default ParentViewScreen;
