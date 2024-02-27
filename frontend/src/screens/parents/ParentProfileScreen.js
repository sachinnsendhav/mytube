import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Subscription } from '../../services'; // Assuming this is the file where you exported your Subscription service
import axios from 'axios';
import { config } from '../../../config';

const ParentProfileScreen = ({ navigation }) => {
  const [userParentFirstName, setUserParentFirstName] = useState('');
  const [userParentLastName, setUserParentLastName] = useState('');
  const [subscriptionPlans, setSubscriptionPlans] = useState([]);
  const [parentPhoneNumber, setParentPhoneNumber] = useState('');
  const [parentEmail, setParentEmail] = useState('');
  const [subscriptionDetails, setSubscriptionDetails] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const asyncUserParentFirstName = await AsyncStorage.getItem(
        'userParentFirstName',
      );
      const asyncUserParentLastName = await AsyncStorage.getItem(
        'userParentLastName',
      );

      setUserParentFirstName(asyncUserParentFirstName || '');
      setUserParentLastName(asyncUserParentLastName || '');

      const token = await AsyncStorage.getItem('token');
      const subscriptionPlansResponse = await Subscription.getSubscriptionPlans(
        token,
      );
      const plans = subscriptionPlansResponse.data || [];
      setSubscriptionPlans(plans);

      await fetchSubscriptionDetails(token);
    };

    const fetchSubscriptionDetails = async (token) => {
      try {
        const result = await axios.get(
          `${config.cli.url}/api/subscription/getUserPlan`,
          {
            headers: {
              Authorization: token,
            },
          },
        );
        if (result.data.status === 200) {
          setSubscriptionDetails(result.data.data);
        } else {
          Alert.alert('Error', 'Failed to fetch subscription details');
        }
      } catch (error) {
        console.log('Error:', error);
        Alert.alert('Error', 'An error occurred. Please try again later.');
      }
    };

    fetchData();

    const unsubscribe = navigation.addListener('focus', () => {
      fetchData();
    });

    return unsubscribe;
  }, [navigation]);


// This function generates a random orderId
const generateOrderId = () => {
  return "MYT" + Math.floor(Math.random() * Math.floor(Math.random() * Date.now()));
};


const handleSubscriptionPurchase = async (amount, subscriptionId, planName) => {
  try {
    const token = await AsyncStorage.getItem('token');
    let parentEmail = '';
    let parentPhoneNumber = '';

    const asyncUserParentPhoneNumber = await AsyncStorage.getItem('userParentPhoneNumber');
    const asyncUserParentEmail = await AsyncStorage.getItem('userParentEmail');

    if (asyncUserParentPhoneNumber) {
      parentPhoneNumber = asyncUserParentPhoneNumber;
    }

    if (asyncUserParentEmail) {
      parentEmail = asyncUserParentEmail;
    }

    console.log(parentPhoneNumber, 'parentPhoneNumber');
    console.log(parentEmail, 'parentEmail');

    const orderId = generateOrderId();

    const paymentRes = {
      order_id: orderId,
      amount: amount,
      currency: 'INR',
      receipt: orderId
    };

    const result = await axios.post(`${config.cli.url}/api/payment/createOrder`, paymentRes, {
      headers: {
        'Authorization': token
      }
    });

    if (!result.data.data) {
      Alert.alert('Error', 'Some Error Occurred!');
    } else {
      const options = {
        description: `Payment Process of ${planName.toUpperCase()} Subscription`,
        image: 'https://www.flaticon.com/free-icon/play_13710370',
        currency: 'INR',
        key: 'rzp_live_cyn3ljb7sMpJoR',
        amount: amount * 100,
        name: 'Mini Tube',
        prefill: {
          contact:" ",
          email: parentEmail,
          name: `${userParentFirstName} ${userParentLastName}`,
        },
        theme: { color: '#1d9cf0' },
        order_id: result.data.data.id,
        // Add the following line to handle the payment response
        payment_success_url: 'your-success-url',
      };

      RazorpayCheckout.open(options)
      .then(async (data) => {
        // Log the data object to see its structure
        console.log('Razorpay data:', data);
    
        // Show a simple alert to test if the code inside the then block is executed
        Alert.alert('Payment Success', 'Your payment was successful.');
    
        // Continue with your logic
        const body = {
          paymentId: data.razorpay_payment_id,
          amount: amount,
          subscriptionId: subscriptionId,
        };
        const result = await Subscription.placeOrder(body, token);
        console.log(result,"place order result");
                    // Update subscription details after purchase
                    const getUserPlanResponse = await axios.get(
                      `${config.cli.url}/api/subscription/getUserPlan`,
                      {
                        headers: {
                          Authorization: token,
                        },
                      },
                    );
                    const userData = getUserPlanResponse.data.data || {};
                    setSubscriptionDetails(userData);
      })
      .catch((error) => {
        console.log('Payment failed:', error);
        Alert.alert('Payment Failed', 'Please try again later.');
      });
    
    }
  } catch (error) {
    console.log('Error:', error);
    Alert.alert('Error', 'An error occurred. Please try again later.');
  }
};



  return (
    <View style={styles.container}>
    <View style={styles.card}>
      <Image
        source={require('../../assets/my-yt.png')}
        style={styles.profileImage}
      />
      <Text style={styles.fullNameText}>{`${userParentFirstName} ${userParentLastName}`}</Text>
{subscriptionDetails && subscriptionDetails.subscriptionType ? (
  <View style={styles.subscriptionDetailsContainer}>
    <Text style={styles.subscriptionDetailsText}>Current Plan: {subscriptionDetails.subscriptionType.toUpperCase()}</Text>
    <Text style={styles.subscriptionDetailsText}>Subscription Date: {new Date(subscriptionDetails.subscriptionDate).toDateString()}</Text>
    <Text style={styles.subscriptionDetailsText}>Expiration Date: {new Date(subscriptionDetails.expirationDate).toDateString()}</Text>
  </View>
) : (
  <Text style={styles.subscriptionDetailsText}>No Active Plan</Text>
)}

    </View>
      <View style={{marginTop: 1}}>
        <Text style={styles.title}>Subscription Plans</Text>
        <View style={styles.plansContainer}>
          {subscriptionPlans.map(plan => (
            <TouchableOpacity
              key={plan._id}
              style={styles.planCard}
              onPress={() =>
                handleSubscriptionPurchase(plan.subscriptionPrice, plan._id, plan.planType)
              }>
              <Text style={styles.planType}>{plan.planType.toUpperCase()}</Text>
              <Text style={styles.planDescription}>{plan.description}</Text>
              <Text style={styles.planAmount}>
                {plan.subscriptionPrice} &#8377;
              </Text>
              <View style={styles.buyButton}>
                <Text style={styles.buyButtonText}>Buy Now</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  card: {
    backgroundColor: '#54b6f7',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    alignItems: 'center',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 65,
    marginBottom: 20,
  },
  fullNameText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subscriptionDetailsText: {
    color: 'white',
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subscriptionDetailsContainer: {
    marginTop:10,
    alignItems: 'center'
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  plansContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  planCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    width: '48%',
    height: 250,
    justifyContent: 'space-between',
    alignItems: 'center', // Align items in the center vertically
    borderWidth: 1
  },
  planType: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  planDescription: {
    fontSize: 14,
    marginBottom: 5,
    color: '#333',
    textAlign: 'center', // Center align text
  },
  planAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#007bff',
    textAlign: 'center', // Center align text
  },
  buyButton: {
    backgroundColor: '#007bff',
    borderRadius: 5,
    padding: 10,
    alignItems: 'center',
  },
  buyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ParentProfileScreen;
