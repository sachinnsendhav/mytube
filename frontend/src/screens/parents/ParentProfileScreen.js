import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';



const ParentProfileScreen = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [userName, setUserName] = useState('');
  const [userParentFirstName, setUserParentFirstName] = useState('');
  const [userParentLastName, setUserParentLastName] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const asyncFirstName = await AsyncStorage.getItem('userFirstName');
      const asyncLastName = await AsyncStorage.getItem('userLastName');
      const asyncUserName = await AsyncStorage.getItem('userUserName');
      const asyncUserParentFirstName = await AsyncStorage.getItem('userParentFirstName');
      const asyncUserParentLastName = await AsyncStorage.getItem('userParentLastName');

      setFirstName(asyncFirstName || '');
      setLastName(asyncLastName || '');
      setUserName(asyncUserName || '');
      setUserParentFirstName(asyncUserParentFirstName || '');
      setUserParentLastName(asyncUserParentLastName || '');
    };
    fetchData();
  }, []);

  return (
    <View style={styles.container}>
        <View style={styles.card}>
          <Image source={require('../../assets/my-yt.png')} style={styles.profileImage} />
          {/* <Text style={styles.fullNameText}>{`${firstName} ${lastName}`}</Text> */}
          <Text style={styles.fullNameText}> {`${userParentFirstName} ${userParentLastName}`}</Text>
          <Text style={styles.userNameText}>{userName}</Text>
        </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  card: {
    backgroundColor: '#54b6f7',
    borderRadius: 15,
    padding: 20,
    margin: 20,
    alignItems: 'center',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 65,
    marginBottom: 20,
  },
  userNameText: {
    color: 'white',
    fontSize: 18,
  },
  fullNameText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});

export default ParentProfileScreen;
