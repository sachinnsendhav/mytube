import React, { useState } from "react";
import {
  StyleSheet,
  View,
  ImageBackground,
  Image,
  TextInput,
  TouchableOpacity,
  Text,
  Alert,
} from "react-native";
// import { RadioButton } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Auth } from "../services";
import { useNavigation } from "@react-navigation/native";

const LoginScreen = ({ onLoginSuccess,setIsLogInScreen }) => {
  const navigation = useNavigation();
  const [userName, setUsername] = useState("");
  const [password, setPassword] = useState("");
  // const [role, setRole] = useState("user");
  // const [checked, setChecked] = useState("user");
  


  const handleSignup = async () => {
    // Alert.alert("Sign Up", "Signup functionality needs to be implemented.");
    navigation.navigate("Sign UP")
    setIsLogInScreen(false)
  };

  const parentLogin = async () => {
    try {
      const adminData = {
        email: userName.trimEnd(),
        password: password,
      };
      const response = await Auth.login(adminData);

      if (response && response.data) {
        const userObjectId = response.data.userData._id;
        const userUserName = response.data.userData.email;
        const userParentFirstName = response.data.userData.firstName;
        const userParentLastName = response.data.userData.lastName;
        const userParentPhoneNumber = response.data.userData.phoneNumber;
        const userParentEmail = response.data.userData.email;
        const userRole = response.data.userData.role;


        await AsyncStorage.setItem("userParentFirstName", userParentFirstName);
        await AsyncStorage.setItem("userUserName", userUserName);
        await AsyncStorage.setItem("userParentLastName", userParentLastName);
        await AsyncStorage.setItem("userParentPhoneNumber", userParentPhoneNumber.toString());
        await AsyncStorage.setItem("userParentEmail", userParentEmail);
        await AsyncStorage.setItem("role", userRole);
        await AsyncStorage.setItem("token", response.data.token);
        console.log("response.status", response.status);
        if (response.status === 200) {
          onLoginSuccess();
          Alert.alert(
            "Login Successful",
            "You have successfully logged in."
          );
        } else {
          console.log("response.status", response.status);

          Alert.alert("Login Failed", "Invalid credentials. Please try again.");
        }
      } else {
        console.log("response.status", response.status);
        Alert.alert("Login Failed", "Invalid credentials. Please try again.");
      }
    } catch (err) {
      console.log(err);
      Alert.alert("Error", "An error occurred while logging in admin");
    }
  };



  return (
    <View style={styles.container}>
      <ImageBackground
        source={{ uri: "https://www.colorhexa.com/9370db.png" }}
        style={styles.backgroundImage}
      >
        <View style={styles.logoContainer}>

            <Image
              source={require('../assets/my-yt.png')}
              style={styles.logo}
            />

        </View>
        <View style={styles.formContainer}>
          {/* <View style={styles.radioButtonContainer}>
            <RadioButton
              value="user"
              status={checked === "user" ? "checked" : "unchecked"}
              onPress={() => {
                setChecked("user");

                setRole("user");
              }}
            />

            <Text style={styles.radioButtonText}>User</Text>

            <RadioButton
              value="admin"
              status={checked === "admin" ? "checked" : "unchecked"}
              onPress={() => {
                setChecked("admin");

                setRole("admin");
              }}
            />

            <Text style={styles.radioButtonText}>Admin</Text>
          </View> */}

          <View style={styles.card}>
            <TextInput
              placeholder="Email"
              style={styles.input}
              value={userName}
              onChangeText={setUsername}
            />
          </View>
          <View style={styles.card}>
            <TextInput
              placeholder="Password"
              secureTextEntry={true}
              style={styles.input}
              value={password}
              onChangeText={setPassword}
            />
          </View>
          <TouchableOpacity
            style={styles.loginButton}
            onPress={parentLogin}
          >
            <Text style={styles.loginButtonText}>Log In</Text>
          </TouchableOpacity>

          {/* <TouchableOpacity style={styles.signupButton} onPress={handleSignup}>
            <Text style={styles.signupButtonText}>Sign Up</Text>
          </TouchableOpacity> */}

           <Text style={{ color: "#555", textAlign: "center", marginTop: 10 }}>
              Create a new account?{" "}
           <Text style={{ color: "blue", textDecorationLine: "underline" }} onPress={() => handleSignup()}  >
          Sign Up
        </Text>
        </Text>


        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
  },
  logoContainer: {
    alignItems: "center",
    marginTop: 160,
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  formContainer: {
    marginHorizontal: 20,
    marginTop: 50,
    padding: 20,
    borderRadius: 10,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginBottom: 20,
    padding: 10,
  },
  input: {
    height: 40,
    paddingHorizontal: 10,
    borderBottomColor: "#B0C4DE",
  },
  loginButton: {
    backgroundColor: "#7B68EE",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  signupButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  radioButtonContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 15,
  },

  radioButtonText: {
    marginLeft: 5, // Adjust the margin as needed
  },
  signupButton: {
    backgroundColor: "blue", // Green color, adjust as needed
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
});

export default LoginScreen;
