import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Video } from '../../services';
import AsyncStorage from '@react-native-async-storage/async-storage';
import YoutubePlayer from 'react-native-youtube-iframe';

const ParentViewScreen = ({ route }) => {
  const clickedPlaylistId = route.params.id;
  const navigation = useNavigation();
  const [videos, setVideos] = useState([]);

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

  // const handleView = (item) => {
  //   // Handle view action (navigate to view screen or show details)
  //   console.log('View:', item);
  // };

  const handleDelete = async (item) => {
    const token = await AsyncStorage.getItem('token');
    try {
      // Perform the deletion logic using the API or service method
      // Example: await Video.deleteVideo(token, item._id);
      await Video.deleteVideo(token,item._id,clickedPlaylistId)
      Alert.alert('Video delete SuccessFully from the playlist');

      // After deletion, refresh the playlist data
      fetchPlaylistData();
    } catch (error) {
      console.error('Error deleting playlist item:', error);
      Alert.alert('Error', 'Failed to delete playlist item');
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={videos}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.videoName}>{item.videoName}</Text>
            <YoutubePlayer
              height={200}
              videoId={getYouTubeVideoId(item.videoUrl)}
            />
            {/* <TouchableOpacity style={styles.viewButton} onPress={() => handleView(item)}>
              <Text style={styles.buttonText}>View</Text>
            </TouchableOpacity> */}
            <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(item)}>
              <Text style={styles.buttonText}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
        keyExtractor={(item) => item._id}
      />
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
  videoName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  viewButton: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
    marginTop: 5,
  },
  deleteButton: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
    marginTop: 5,
  },
  buttonText: {
    fontSize:21,
    color: 'red',
    textAlign: 'center',
  },
});

export default ParentViewScreen;
