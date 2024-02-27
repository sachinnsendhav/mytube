import React, {useEffect, useState} from 'react';
import {
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Alert
} from 'react-native';
import {Channel, YoutubeApi} from '../../services';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import AntDesign from 'react-native-vector-icons/AntDesign';

const ParentChannelListScreen = () => {
  const [channelList, setChannelList] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    getChannelList();
  }, []);

  const getChannelList = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('token');
      const result = await Channel.getChannelList(token);
      setChannelList(result?.data);
    } catch (err) {
      console.error(err, 'error');
    }
    setLoading(false);
  };

  const handleChannelCardClick = async channelId => {
    try {
      const result = await YoutubeApi.getVideosByChannelId(channelId);
      navigation.navigate('Channel Videos', {videos: result.items || []});
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteChannel = async (channelId) => {
    try {
        const token = await AsyncStorage.getItem('token');
       await Channel.deleteChannel(token, channelId._id);
        // Remove the deleted channel from the local channelList state
        setChannelList(channelList.filter(channel => channel.channelId !== channelId));
        Alert.alert('Playlist Deleted!',`${channelId.channelName} deleted from your List Successfully`)
        await getChannelList();
    } catch (err) {
        Alert.alert("Error!","Error while deleting")
        console.error(err, 'error');
    }
};

  return (
    <View style={styles.container}>
      <ScrollView style={[styles.scrollView, {paddingRight: 10}]}>
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          channelList.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.touchable}
              onPress={() => handleChannelCardClick(item.channelId)}>
              <View style={[styles.card, {backgroundColor: '#3498db'}]}>
                <Text style={[styles.cardText, {color: 'white'}]}>
                  {item.channelName}
                </Text>
                <Text style={{color: 'white'}}>ID: {item.channelId}</Text>
                <AntDesign
                  name="delete"
                  style={{color: 'white', fontSize: 24, marginTop: 15}}
                  onPress={() => handleDeleteChannel(item)}
                />
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
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
  touchable: {
    marginVertical: 5,
    borderRadius: 5,
  },
  card: {
    padding: 10,
    backgroundColor: '#3498db',
    marginBottom: 10, // Add margin bottom here
    height: 100,
    borderRadius: 10,
  },
  cardText: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
});

export default ParentChannelListScreen;
