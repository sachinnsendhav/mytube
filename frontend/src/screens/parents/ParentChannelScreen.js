import React, { useEffect, useState } from 'react';
import { View, ScrollView, Text, TouchableOpacity, Image, Alert } from 'react-native';
import { Button } from 'react-native'; // Assuming you have defined these components
import { YoutubeApi, Channel } from '../../services'; // Assuming you have defined these services
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';


function ChannelVideos({ route, id }) {
    console.log(route.params.channelId, "route");
    const navigation = useNavigation();
    const [videos, setVideos] = useState([]);
    const [pageToken, setPageToken] = useState('');
    const limit = 4; // Number of videos to fetch initially

    useEffect(() => {
        console.log("id dekhi kya", route.params.channelId);
        const YoutubeId = route.params.channelId;
        if (YoutubeId !== undefined) {
            getVideosByChannelId(YoutubeId);
        }
    }, []);

    const getVideosByChannelId = async (YoutubeId, pageToken = '') => {
        console.log(YoutubeId, "id mili kya");
        if (YoutubeId) {
            try {
                const result = await YoutubeApi.getVideosByChannelId(YoutubeId, pageToken, limit);
                setVideos(result.items);
                setPageToken(result.nextPageToken); // Update page token
                console.log("resrserf", result);
            } catch (err) {
                console.error(err, 'errrr-----');
            }
        }
    };

    const loadMoreVideos = () => {
        // Load more videos with the next page token
        getVideosByChannelId(route.params.channelId, pageToken);
    };

    const addChannel = async () => {
        const channelYtId = route.params.channelId;
console.log("object",channelYtId)
        console.log("videos[0]?.snippet?.channelTitle",videos[0]?.snippet?.channelTitle)
        const data = {
            channelName: "videos[0]?.snippet?.channelTitle",
            channelId: "channelYtId"
            // channelId: "afafafss"

        };

        try {
            const token = await AsyncStorage.getItem('token');
            const result = await Channel.addChannel(token,data);
            console.log("result addChannel......",result) // Assuming addChannel function doesn't need token in React Native
            if (result?.status === "200" || result?.status === 201) {
                Alert.alert("Channel added!",`${data.channelName} is added in your Channel List`);
                navigation.navigate('Channel List', channelYtId);
            }
        } catch (error) {
          console.log(error.response.data.mesage,"error,,,,,,,,,,")
            if (error.response.status === 400){
                Alert.alert('Error while adding');
              } else{
            Alert.alert("Error!")
              }
        }
            // Handle errors as needed
    };

    return (
      <View style={{ flex: 1, backgroundColor: 'white' }}>
          <View style={{ padding: 10 }}>
              <Text style={{fontSize: 18, fontWeight: 'bold', marginBottom: 10}}>{videos[0]?.snippet?.channelTitle}</Text>
              <Button title='Add Channel' onPress={addChannel} />
          </View>
          <ScrollView contentContainerStyle={{ paddingHorizontal: 5, paddingVertical: 3 }}>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                  {videos?.map((item) => (
                      item?.id?.videoId && (
                          <TouchableOpacity
                              key={item.id.videoId}
                              style={{
                                  flexBasis: '48%',
                                  marginBottom: 10,
                                  marginRight: 5,
                                  borderRadius: 8,
                                  shadowColor: '#000',
                                  shadowOffset: {
                                      width: 0,
                                      height: 2,
                                  },
                                  shadowOpacity: 0.25,
                                  shadowRadius: 3.84,
                                  elevation: 5,
                                  backgroundColor: 'white',
                                  overflow: 'hidden',
                              }}
                              onPress={() => navigation.navigate('Add Video', { videoId: item.id.videoId })}
                          >
                              <View>
                                  <Image
                                      source={{ uri: item?.snippet?.thumbnails?.medium?.url }}
                                      style={{ width: '100%', height: 150, resizeMode: 'cover' }}
                                  />
                                  <View style={{ padding: 10 }}>
                                      <Text numberOfLines={2} style={{ fontSize: 16, color: '#333', fontWeight: 'bold', marginBottom: 5 }}>
                                          {item?.snippet?.title}
                                      </Text>
                                      <Text numberOfLines={1} style={{ fontSize: 14, color: '#888' }}>
                                          {item?.snippet?.channelTitle}
                                      </Text>
                                  </View>
                              </View>
                          </TouchableOpacity>
                      )
                  ))}
              </View>
          </ScrollView>
          {videos.length > limit && (
              <TouchableOpacity onPress={loadMoreVideos} style={{ backgroundColor: 'white', padding: 10, alignItems: 'center' }}>
                  <Text style={{ color: 'blue' }}>Load More</Text>
              </TouchableOpacity>
          )}
      </View>
  );
  
  
}

export default ChannelVideos;
