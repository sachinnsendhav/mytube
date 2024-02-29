import React, { useEffect, useState } from 'react';
import { View, Text, Image, Alert,Button, StyleSheet,TouchableOpacity } from 'react-native';
import { YoutubeApi } from "../../services";
import { useNavigation } from '@react-navigation/native';
import YoutubePlayer from 'react-native-youtube-iframe';
// import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { Playlist, Video } from '../../services';
import { MultiSelect } from 'react-native-element-dropdown';
// import ModalDropdown from 'react-native-modal-dropdown';
import { Dropdown } from 'react-native-element-dropdown';
import AsyncStorage from '@react-native-async-storage/async-storage';

function ParentVideoDetailScreen({ route }) {
    console.log("route",route.params)
  const navigation = useNavigation();
  const { videoId } = route.params;
  const [videoDetails, setVideoDetails] = useState(null);
  const [relatedVideos, setRelatedVideos] = useState([]);
  const [isFocus, setIsFocus] = useState(false);
  const [playlist, setPlaylist] = useState([]);
  const [playlistId, setPlaylistId] = useState('');
 
  useEffect(() => {
    getVideoDetails(videoId);
    getRelatedVideos(videoId);
    getPlaylist();
  }, [videoId]);

  console.log(route, "routes")
 
  const getVideoDetails = async (videoId) => {
    try {
      const result = await YoutubeApi.getVideoDetails(videoId);
      setVideoDetails(result.items[0]);
    } catch (err) {
      console.error(err, 'errrr-----');
    }
  };
 
  const getRelatedVideos = async (videoId) => {
    try {
      const result = await YoutubeApi.getRelatedVideos(videoId);
      setRelatedVideos(result.items);
    } catch (err) {
      console.log(err, 'errrr-----');
    }
  };
  const getPlaylist = async () => {
  const token = await AsyncStorage.getItem('token');
    try {
      const result = await Playlist.getAllPlaylist(token);
      setPlaylist(result?.data || []);
    } catch (err) {
      if (err.response?.data?.message === 'Unauthorized') {
        Alert.alert("unatuhorized") // Replace 'SignIn' with your authentication screen
      }
      console.error(err, 'error');
    }
  };
 
  const addVideoToPlaylist = async () => {
    if (playlistId === '') {
      Alert.alert('Please Select Playlist');
    } else {
      const data = {
        videoName: videoDetails?.snippet?.title,
        videoDescription: videoDetails?.snippet?.description,
        videoUrl: `https://www.youtube.com/watch?v=${videoId}`,
        playListId: playlistId,
      };
      try {
        const token = await AsyncStorage.getItem('token');
        const resp = await Video.addVideoToPlaylist(token, data);
        // Alert.alert('Video added!');

        const confirmVideo = await new Promise((resolve) =>
        Alert.alert(
          'Video added!',
          'Video added successfully',
          [
            {
              text: 'OK',
              onPress: () => resolve(true),
            },
          ],
          { cancelable: false }
        ))
  
        if (confirmVideo){
          navigation.navigate("HomeScreen");
        }
        console.log('first', resp);
      } catch (err) {
        console.error(err);
      }
    }
  };
  console.log("video123",relatedVideos)
  return (
<View style={{ flex: 1, backgroundColor: '#e5e5e5' }}>
<View>
<YoutubePlayer
        height={200}
        videoId={videoId}
      />
<View style={{ padding: 10, borderWidth: 1, borderColor: '#ccc', marginVertical: 5 }}>
<Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 5 }}>{videoDetails?.snippet?.title}</Text>
<Text style={{ fontSize: 14, color: '#555' }}>{videoDetails?.snippet?.channelTitle}</Text>
</View>
        {playlist.length > 0 ? (
<View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 10 }}>
            
<Dropdown
          style={[styles.dropdown, isFocus && { borderColor: 'blue' }]}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          iconStyle={styles.iconStyle}
          data={playlist.map((item)=>({
            "label":item.name,
            "value":item._id
          }))}
          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder={!isFocus ? 'Select Playlist' : '...'}
          searchPlaceholder="Search..."
          value={playlistId}
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
          onChange={item => {
            setPlaylistId(item.value);
            setIsFocus(false);
          }}
        />
<Button title="Add Video" onPress={addVideoToPlaylist} />
</View>
        ) : (
<TouchableOpacity>
<Button title="Create New Playlist"  onPress={() => navigation.navigate('Create Playlist')}/>
</TouchableOpacity>
        )}
</View>
</View>
  );
}
 
export default ParentVideoDetailScreen;
const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: 16,
  },
  dropdown: {
    width:"70%",
    height: 50,
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  icon: {
    marginRight: 5,
  },
  label: {
    position: 'absolute',
    backgroundColor: 'white',
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
});