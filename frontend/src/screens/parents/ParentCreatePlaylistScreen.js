import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Button, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Playlist } from '../../services';
import { useNavigation } from '@react-navigation/native';



const ParentCreatePlaylistScreen = () => {
  const navigation = useNavigation();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [playlist, setPlaylist] = useState('');

  const handleAddPlaylist = async () => {
    // Handle the logic to add the playlist with playlistName and description
    console.log('Playlist Name:', name);
    console.log('Description:', description);
    const token = await AsyncStorage.getItem('token')
    console.log(token,'token')

    const data = {
        name:name,
        description:description
    }
    console.log(data,"dataa")
    try {
        const response = await Playlist.createPlaylist(token,data);
        console.log(response,"response aaya kya ");
        setPlaylist(response.data);
        console.log(playlist,"playlist me set hua kya ")
        // alert("create playlist")
        

        const confirmPlaylist = await new Promise((resolve) =>
      Alert.alert(
        'Confirm Playlist',
        'Playlist added successfully',
        [
          {
            text: 'OK',
            onPress: () => resolve(true),
          },
        ],
        { cancelable: false }
      ))

      if (confirmPlaylist){
        navigation.navigate("Playlist");
      }
        
      } catch (error) {
        if (error.response.status === 400){
          Alert.alert('Error while creating', error.response.data.message);
        } else{
          console.error('Error creating  playlist data:', error);
          // Alert.alert('Error', 'Failed to fetch playlist data');
        }
      }

  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Create Playlist </Text>
      <TextInput
        style={styles.input}
        placeholder="Playlist Name"
        value={name}
        onChangeText={(text) => setName(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Description"
        value={description}
        onChangeText={(text) => setDescription(text)}
      />
      <Button title="Add Playlist" onPress={handleAddPlaylist} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 8,
    width: '100%',
  },
});

export default ParentCreatePlaylistScreen;
