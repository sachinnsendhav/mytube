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
  Modal,
  ScrollView
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
  const [showModal, setShowModal] = useState(false);

  const validateForm = () => {
    const error = {};
    // if (firstName === "") {
    //   error.firstName = "Please enter First Name";
    // }
    // if (lastName === "") {
    //   error.lastName = "Please enter Last Name";
    // }
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
        email: email.trim(),
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
              "You are registered."
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
      Alert.alert("Please enter Email Address");
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
          {/* <TextInput
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
          /> */}
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
            placeholder="Email OTP"
            value={otp}
            onChangeText={(text) => setOtp(text)}
          />

          <TouchableOpacity
            onPress={() => sendOtp()}
            style={styles.loginButton}
          >
            <Text style={styles.loginButtonText}>Send OTP</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setShowModal(true)} style={{marginLeft:40, marginTop:10 }}>
    <Text style={{ color: "#007bff" }}>Read Terms and Conditions</Text>
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
      <Modal
  visible={showModal}
  animationType="slide"
  transparent={true}
  onRequestClose={() => setShowModal(false)}
>
  <View style={styles.modalContainer}>
    <View style={styles.modalContent}>
      <ScrollView>
      <Text style={styles.modalText}>
      MyTube Terms and Conditions{"\n"}

        Welcome to MyTube! By accessing or using our application, website, services, or tools (collectively, "Services"), you agree to comply with and be bound by the following terms and conditions (the "Terms"). Please read these Terms carefully before using our Services.{"\n"}

        1. Acceptance of Terms{"\n"}
        By creating an account, accessing, or using the Services, you confirm that you have read, understood, and agreed to be bound by these Terms. If you do not agree with any part of these Terms, you must not use our Services.{"\n\n"}

        2. Changes to Terms{"\n"}
        We reserve the right to modify these Terms at any time. We will notify you of any changes by posting the new Terms on this page. Your continued use of the Services after any such changes take effect constitutes your acceptance of the new Terms.{"\n\n"}

        3. Account Registration{"\n"}
        To access certain features of the Services, you must register for an account. When registering, you agree to provide accurate, current, and complete information about yourself. You are responsible for safeguarding your account and for all activities that occur under your account.{"\n\n"}

        4. Use of Services{"\n"}
        You agree to use our Services only for lawful purposes and in accordance with these Terms. You will not use the Services in any way that violates any applicable local, state, national, or international law or regulation.{"\n\n"}

        5. Intellectual Property Rights{"\n"}
        All rights, title, and interest in and to the Services (excluding content provided by users) are and will remain the exclusive property of MyTube and its licensors. Nothing in the Terms gives you a right to use the MyTube name or any of the MyTube trademarks, logos, domain names, and other distinctive brand features.{"\n\n"}

        6. Content{"\n"}
        You are responsible for the content that you provide or transmit through our Services. You grant us a non-exclusive, transferable, sub-licensable, royalty-free, worldwide license to use any content that you post on or in connection with the Services.{"\n\n"}

        7. Third-Party Services{"\n"}
        Our Services may contain links to third-party websites or services that are not owned or controlled by MyTube. We have no control over, and assume no responsibility for, the content, privacy policies, or practices of any third-party websites or services.{"\n\n"}

        8. Termination{"\n"}
        We may terminate or suspend your account and bar access to the Services immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever and without limitation, including but not limited to a breach of the Terms.{"\n\n"}

        9. Limitation of Liability{"\n"}
        In no event shall MyTube, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Services.{"\n\n"}

        10. Governing Law{"\n"}
        These Terms shall be governed and construed in accordance with the laws of India, without regard to its conflict of law provisions.{"\n\n"}

        11. Changes to Services{"\n"}
        We reserve the right to withdraw or amend our Services, and any service or material we provide via the Services, in our sole discretion without notice. We will not be liable if for any reason all or any part of the Services is unavailable at any time or for any period.{"\n\n"}

        12. Contact Us{"\n"}
        If you have any questions about these Terms, please contact us at contact.timesride@gmail.com{"\n\n"}
      </Text>
      </ScrollView>
      <TouchableOpacity onPress={() => setShowModal(false)} style={styles.okButton}>
        <Text style={{ color: "#fff" }}>OK</Text>
      </TouchableOpacity>
    </View>
  </View>
</Modal>


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
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    width: "80%",
    maxHeight: "80%",
  },
  modalText: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'justify',
    marginBottom: 20,
  },
  okButton: {
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    position: "absolute",
    bottom: 20,
    right: 20,
  },  
});

export default ParentSignUpScreen;
