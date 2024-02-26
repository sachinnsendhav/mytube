import React,{useState,useEffect} from "react";
import { View,ScrollView,TouchableOpacity,Image,Text  } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
 
import { Searchbar, Title } from "react-native-paper";
import { useNavigation } from '@react-navigation/native'
import { YoutubeApi } from "../../services";
function HomeScreen() {
  const navigation=useNavigation()
  const [videos, setVideos] = useState([]);
  const [searchText,setsearchText]=useState('')
  useEffect(()=>{
  getVideos()
  },[searchText])
 
  const getVideos=async()=>{
    try{
      const response=await YoutubeApi.getVideosBySearch(searchText==''?"cartoon":searchText)
      setVideos(response.items)
      console.log(response)
    }catch(error){
      console.log("error",error)
    }
  }
   
return (
  <>
    <View style={{ marginTop: 15, backgroundColor: "white" }}>
      <Searchbar
        style={{ marginLeft: 10, marginRight: 10, backgroundColor: "white" }}
        placeholder="Type Here..."
        onChangeText={setsearchText}
        onClearIconPress={() => setsearchText('')}
        value={searchText}
      >
      </Searchbar>
      <ScrollView contentContainerStyle={{ paddingHorizontal: 5, paddingVertical: 3 }}>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
          {videos?.map((item, index) => (
            item?.id?.videoId ? (
              <TouchableOpacity
                key={item.id.videoId}
                style={{ flexBasis: '50%', padding: 5 }}
                onPress={() => navigation.navigate("Add Video", { videoId: item.id.videoId })}
              >
                <View style={{ borderWidth: 1, borderColor: '#ddd', borderRadius: 8, backgroundColor: '#f9f9f9', overflow: 'hidden' }}>
                  <Image source={{ uri: item?.snippet?.thumbnails?.medium?.url }} style={{ width: '100%', height: 150, resizeMode: 'cover' }} />
                  <View style={{ padding: 10 }}>
                    <Text numberOfLines={2} style={{ fontSize: 16, color: '#333', fontWeight: 'bold', marginBottom: 5 }}>{item?.snippet?.title}</Text>
                    <Text numberOfLines={1} style={{ fontSize: 14, color: '#888' }}>{item?.snippet?.channelTitle}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                key={item.id.channelId}
                style={{ flexBasis: '50%', padding: 5 }}
                onPress={() => {
                  console.log("Channel ID:", item.id.channelId);
                  navigation.navigate("Channel", { channelId: item.id.channelId });
                  console.log("aaaa ID:", item.id.channelId);

                }}
              >
                <View style={{ borderWidth: 1, borderColor: '#ddd', borderRadius: 8, backgroundColor: '#f9f9f9', overflow: 'hidden', height: 235.9 }}>
                  <Image source={{ uri: item?.snippet?.thumbnails?.default?.url }} style={{ width: '100%', height: 150, resizeMode: 'cover', borderRadius: 200 }} />
                  <View style={{ padding: 10 }}>
                    <Text numberOfLines={2} style={{ fontSize: 16, color: '#333', fontWeight: 'bold', marginBottom: 5 }}>{item?.snippet?.channelTitle}</Text>
                    {/* Add additional information or UI elements for channel here */}
                  </View>
                </View>
              </TouchableOpacity>
            )
          ))}
        </View>
      </ScrollView>
    </View>
  </>
);

  
  
}
 
export default HomeScreen;