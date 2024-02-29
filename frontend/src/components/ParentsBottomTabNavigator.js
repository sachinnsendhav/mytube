import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Alert, Image, TouchableOpacity } from "react-native"; // Import Image and TouchableOpacity
import ParentHomeScreen from "../screens/parents/ParentHomeScreen";
// import ParentUsersScreen from "../screens/parents/ParentUsersScreen";
import ParentProfileScreen from "../screens/parents/ParentProfileScreen";
// import ParentCollectionScreen from "../screens/parents/ParentCollectionScreen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import ParentPlaylistScreen from "../screens/parents/ParentPlaylistScreen";
import ParentChannelListScreen from "../screens/parents/ParentChannelListScreen";
import VideoChannelAll from "../screens/parents/VideoChannelAll";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const LogoutButton = ({ navigation, onLogout }) => {
  const handleLogout = async () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Logout",
          onPress: async () => {
            await AsyncStorage.clear();
            onLogout();
            navigation.replace("Login");
          },
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <TouchableOpacity onPress={handleLogout} style={{ marginRight: 10 }}>
      <Image source={require("../assets/icons/logout-icon5.png")} style={{ width: 28, height: 28, marginRight:8 }} />
    </TouchableOpacity>
  );
};

const ParentsBottomTabNavigator = ({ onLogout }) => {
  const navigation = useNavigation();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerRight: () => {
          if (
            route.name === "Home" ||
            route.name === "Channel Video" ||
            route.name === "Playlist" ||
            route.name === "Channel List" ||
            // route.name === "Collection" ||
            route.name === "User" ||
            route.name === "Profile"
          ) {
            return <LogoutButton navigation={navigation} onLogout={onLogout} />;
          }
          return null;
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconSource;

          if (route.name === "Home") {
            iconSource = focused ? require("../assets/icons/home-icon.png") : require("../assets/icons/home-icon.png");
          }  else if (route.name === "Channel Video") {
            iconSource = focused ? require("../assets/icons/collection-icon.png") : require("../assets/icons/collection-icon.png");
          } else if (route.name === "Playlist") {
            iconSource = focused ? require("../assets/icons/category-icon.png") : require("../assets/icons/category-icon.png");
          } else if (route.name === "Channel List") {
            iconSource = focused ? require("../assets/icons/clipboard.png") : require("../assets/icons/clipboard.png");
          // } else if (route.name === "Collection") {
          //   iconSource = focused ? require("../assets/icons/collection-icon.png") : require("../assets/icons/collection-icon.png");
          } else if (route.name === "User") {
            iconSource = focused ? require("../assets/icons/user-icon.png") : require("../assets/icons/user-icon.png");
          } else if (route.name === "Profile") {
            iconSource = focused ? require("../assets/icons/profile-icon.png") : require("../assets/icons/profile-icon.png");
          }

          return <Image source={iconSource} style={{ width: size, height: size, tintColor: color }} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={ParentHomeScreen} />
      <Tab.Screen name="Channel Video" component={VideoChannelAll} />
      <Tab.Screen name="Playlist" component={ParentPlaylistScreen} />
      <Tab.Screen name="Channel List" component={ParentChannelListScreen} />
      {/* <Tab.Screen name="Collection" component={ParentCollectionScreen} /> */}
      {/* <Tab.Screen name="User" component={ParentUsersScreen} /> */}
      <Tab.Screen name="Profile" component={ParentProfileScreen} />
    </Tab.Navigator>
  );
};

export default ParentsBottomTabNavigator;
