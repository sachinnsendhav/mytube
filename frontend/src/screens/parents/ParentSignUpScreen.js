import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  Image,
  ImageBackground,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Auth } from "../../services";
import { CheckBox } from "react-native-elements";
import AsyncStorage from "@react-native-async-storage/async-storage";
import tickImage from "../../assets/icons/tick.png";
import untickImage from "../../assets/icons/untick.png";

const ParentSignUpScreen = ({ onLoginSuccess, setIsLogInScreen }) => {
  const navigation = useNavigation();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const validateForm = () => {
    const error = {};
    if (firstName === "") {
      error.firstName = "Please enter First Name";
    }
    if (lastName === "") {
      error.lastName = "Please enter Last Name";
    }
    if (email === "") {
      error.email = "Please enter email address";
    }
    if (password === "") {
      error.password = "Please enter valid password";
    }
    if (phone === "") {
      error.phone = "Please enter Phone Number";
    }
    if (otp === "") {
      error.otp = "Please enter Otp Number";
    }
    setErrors(error);
    return Object.keys(error).length === 0 && agreedToTerms;
  };

  const handleLogin = () => {
    setIsLogInScreen(true);
    navigation.navigate("Login");
  };

  const registerParents = async () => {
    setLoading(true);
    if (validateForm()) {
      const data = {
        firstName: firstName,
        lastName: lastName,
        email: email,
        userPassword: password,
        phoneNumber: phone,
        otp: Number(otp),
      };
  
      try {
        const result = await Auth.register(data);
  
        if (result && result.data) {
          const userObjectId = result.data.userData._id;
          const userUserName = result.data.userData.email;
          const userParentFirstName = result.data.userData.firstName;
          const userParentLastName = result.data.userData.lastName;
          const userParentPhoneNumber = result.data.userData.phoneNumber;
          const userParentEmail = result.data.userData.email;
          const userRole = result.data.userData.role;
  
          await AsyncStorage.setItem("userParentFirstName", userParentFirstName);
          await AsyncStorage.setItem("userUserName", userUserName);
          await AsyncStorage.setItem("userParentLastName", userParentLastName);
          await AsyncStorage.setItem("userParentPhoneNumber", userParentPhoneNumber.toString());
          await AsyncStorage.setItem("userParentEmail", userParentEmail);
          await AsyncStorage.setItem("role", userRole);
          await AsyncStorage.setItem("token", result.data.token);
  
          if (result.status === 200) {
            onLoginSuccess();
            Alert.alert(
              "Register Successful",
              "You have successfully registered as a parent."
            );
          } else {
            Alert.alert(
              "Register Failed",
              "Invalid credentials. Please try again."
            );
          }
        } else {
          Alert.alert(
            "Register Failed",
            "Invalid credentials. Please try again."
          );
        }
      } catch (err) {
        if (err.response && err.response.status === 401) {
          // Invalid OTP
          Alert.alert(
            "Invalid OTP",
            "The entered OTP is incorrect. Please check and try again."
          );
        } else {
          console.log(err, "error");
          Alert.alert(
            "Register Failed",
            "An error occurred. Please try again later."
          );
        }
      }
    }
    setLoading(false);
  };
  

  const sendOtp = async () => {
    setLoading(true);
  
    if (email !== "") {
      const data = {
        email: email,
      };
  
      try {
        const result = await Auth.generateOtp(data);
  
        if (result && result.data && result.status === 200 || 201) {
          Alert.alert(
            "OTP Sent",
            "An OTP has been sent to your email address. Please check and enter the OTP."
          );
        } else {
          Alert.alert(
            "OTP Failed",
            "Failed to send OTP. Please try again."
          );
        }
      } catch (err) {
        console.log(err, "error");
        Alert.alert(
          "Error",
          "An error occurred while sending OTP. Please try again later."
        );
      }
    } else {
      alert("Please enter Email Address");
    }
  
    setLoading(false);
  };
  

  return (
    <View style={styles.container}>
      <ImageBackground
        source={{ uri: "https://www.colorhexa.com/9370db.png" }}
        style={styles.backgroundImage}
      >
        <Text
          style={{
            fontSize: 24,
            fontWeight: "bold",
            marginBottom: 10,
            color: "#333",
            textAlign: "center",
            marginTop: 50,
          }}
        >
          Admin - Sign Up
        </Text>

        <View style={styles.formContainer}>
          <TextInput
            style={styles.input}
            placeholder="First Name"
            value={firstName}
            onChangeText={(text) => setFirstName(text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Last Name"
            value={lastName}
            onChangeText={(text) => setLastName(text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={(text) => setEmail(text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry={true}
            value={password}
            onChangeText={(text) => setPassword(text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Phone"
            value={phone}
            onChangeText={(text) => setPhone(text)}
          />
          <TextInput
            style={styles.input}
            placeholder="OTP"
            value={otp}
            onChangeText={(text) => setOtp(text)}
          />

          <TouchableOpacity
            onPress={() => sendOtp()}
            style={styles.loginButton}
          >
            <Text style={styles.loginButtonText}>Send OTP</Text>
          </TouchableOpacity>

          <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 10, marginTop: 10 }}>
  <TouchableOpacity onPress={() => setAgreedToTerms(!agreedToTerms)} style={{ flexDirection: "row", alignItems: "center" }}>
    <Image source={agreedToTerms ? tickImage : untickImage} style={{ width: 24, height: 24, marginRight: 8 }} />
    <Text>I agree to the terms and condition</Text>
  </TouchableOpacity>
</View>

          <TouchableOpacity
            onPress={() => registerParents()}
            disabled={loading || otp === ""}
            style={styles.loginButton}
          >
            <Text style={styles.loginButtonText}>Sign Up</Text>
          </TouchableOpacity>

          <Text style={{ color: "#555", textAlign: "center", marginTop: 10 }}>
            Already have an account?{" "}
            <Text
              onPress={() => handleLogin()}
              style={{ color: "blue", textDecorationLine: "underline" }}
            >
              Sign in
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
  formContainer: {
    marginHorizontal: 20,
    marginTop: 50,
    padding: 20,
    borderRadius: 10,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
  },
  input: {
    height: 40,
    paddingHorizontal: 10,
    borderBottomColor: "#B0C4DE",
    marginBottom: 20,
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
  },
  loginButton: {
    backgroundColor: "#7B68EE",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 16,
  },
});

export default ParentSignUpScreen;
