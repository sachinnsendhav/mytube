import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, Alert, StyleSheet } from 'react-native';
import { Playlist } from '../../services';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation,useFocusEffect } from '@react-navigation/native';
import AntIcon from "react-native-vector-icons/AntDesign";

const PlaylistCard = ({ data, onView, onUpdate, onDelete }) => (
  // <Text >Hii guys</Text>
  
  <View style={styles.card}>
    <Text style={styles.cardText}>{`Name: ${data.name}`}</Text>
    <Text style={styles.cardText}>{`Description: ${data.description}`}</Text>
    <Text style={styles.cardText}>{`Video: ${data.videoCount}`}</Text>
    <View style={styles.actionButtons}>
      <TouchableOpacity onPress={() => onView(data)}>
        <Text style={styles.buttonText}>View</Text>
      </TouchableOpacity>
      {/* <TouchableOpacity onPress={() => onUpdate(data)}>
        <Text style={styles.buttonText}>Update</Text>
      </TouchableOpacity> */}
      <TouchableOpacity onPress={() => onDelete(data)}>
      <AntIcon name="delete" color="red" size={22} />
      </TouchableOpacity>
    </View>
  </View>
);



const ParentPlaylistScreen = () => {
  const navigation = useNavigation();
  const [playlist, setPlaylist] = useState([]);

  // useEffect(() => {
  //   fetchPlaylistData();
  // }, []);
  
  useFocusEffect(
    React.useCallback(() => {
      // Fetch updated playlist data when the screen comes into focus
      fetchPlaylistData();
    }, [])
  );
  const fetchPlaylistData = async () => {
    const token = await AsyncStorage.getItem('token')
    console.log(token,'token')
    try {
      const response = await Playlist.getAllPlaylist(token);
      console.log(response,"response aaya kya ");

      setPlaylist(response.data);
      console.log(playlist,"playlist me set hua kya ")
    } catch (error) {
      
      if (error.response.status === 400){
        Alert.alert('Errorssss', error.response.data.message);
      } else{
        console.error('Error fetching playlist data:', error);
        Alert.alert('Error', 'Failed to fetch playlist data');
      }
    }
  };

  const handleView = (item) => {
    // Handle view action (navigate to view screen or show details)
  {navigation.navigate("ParentViewScreen",{ id: item._id })};
    console.log('View:', item);
  };

  const handleUpdate = (item) => {
    // Handle update action (navigate to update screen or show update form)
    console.log('Update:', item);
  };

  const handleDelete = async(item) => {
    // Handle delete action (show confirmation and perform deletion)
    const token = await AsyncStorage.getItem('token')
    const id=item._id
    await Playlist.deletePlaylist(token,item._id)
    const newArray = playlist.filter((item) => item._id !== id);
        setPlaylist(newArray)
        Alert.alert('Playlist Deleted!',`${item.name} deleted from your List Successfully`)
    console.log('Delete:', item);
  };

  const handleCreate = () => {
    // Handle create action (navigate to create screen or show create form)
    // For demonstration purposes, you can navigate to the same update screen
    navigation.navigate('Create Playlist');
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.createButton} onPress={handleCreate}>
        <Text style={styles.createButtonText}>Create Playlist</Text>
      </TouchableOpacity>
      <FlatList
        data={playlist}
        renderItem={({ item }) => (
          <PlaylistCard
            data={item}
            onView={handleView}
            onUpdate={handleUpdate}
            onDelete={handleDelete}
          />
        )}
        keyExtractor={(item) => item._id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F5F5F5',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  cardText: {
    fontSize: 16,
    marginBottom: 8,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  buttonText: {
    color: '#007BFF',
    fontSize: 16,
  },
  createButton: {
    backgroundColor: '#007BFF',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  createButtonText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
  },
});

export default ParentPlaylistScreen;
