import React, { useState } from 'react';
import { View, Text, ScrollView, Alert, StyleSheet, Image, TouchableOpacity, TextInput, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import logo from '../login/logo..png';
import Divider from '../components/Divider';
import axios from 'axios';
import { ipAddress } from '../../constants';
import LoadingModal from '../components/LoadingModal';
import { useTheme } from '../../ThemeContext';

const PasswordForgot = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [isResetButtonDisabled, setIsResetButtonDisabled] = useState(true);
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  
  const { isDarkMode, colors } = useTheme(null);
  const styles = createStyles(isDarkMode);

  const handleEmailChange = (text) => {
    setEmail(text);
    setIsResetButtonDisabled(!text.includes('@'));
  };


  const handleResetPassword = async () => {
    try {
      setIsResetting(true);
  
      // Trim spaces from the email
      const trimmedEmail = email.trim();
  
      const response = await axios.post(`${ipAddress}/api/request-password-reset/`, {
        email: trimmedEmail.toLowerCase(),
      });
  
      if (response.status === 200) {
        // Password reset request successful, navigate to the PasswordConfirm screen
        navigation.navigate('PasswordConfirm', { email: trimmedEmail, token: response.data.token });
      } else {
        // Check if the response contains an error message
        const errorMessage = response.data.error; // Replace 'error' with the actual field name containing the error message in your response.
  
        if (errorMessage === 'User not found') {
          // Display an alert with a message and a sign-up option
          Alert.alert(
            'User Not Found',
            'No user with this email exists. Would you like to sign up instead?',
            [
              {
                text: 'Cancel',
                style: 'cancel',
              },
              {
                text: 'Sign Up',
                onPress: () => {
                  navigation.navigate('CreateAccount', { prefillEmail: trimmedEmail }); // Pass the trimmedEmail to CreateAccount
                },
              },
            ]
          );
        } else {
          // Handle other errors if needed
          Alert.alert('Error', 'Password reset request failed. Please try again later.');
        }
      }
    } catch (error) {
      // Handle error here if needed
      Alert.alert(
        'User Not Found!',
        'It looks like there\'s no user with this email yet in our system. Would you like to sign up instead?',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Sign Up',
            onPress: () => {
              navigation.navigate('CreateAccount', { prefillEmail: trimmedEmail }); // Pass the trimmedEmail to CreateAccount
            },
          },
        ]
      );
    } finally {
      setIsResetting(false);
    }
  };
  


  return (
    <>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="#4C28BC" />
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.logoContainer}>
        <Image
        source={isDarkMode ? require('../images/icon.png') : require('../images/logo..png')}
        style={styles.logo}
      />
             </View>
        <View style={styles.headerContainer}>
          <Text style={styles.header}>Reset Password</Text>
          <Text style={styles.subText}>
            Enter the email address you use for MyFund, and we’ll help you create a new password.
          </Text>
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Enter Your Email Address"
            placeholderTextColor="grey" 
            value={email}
            onChangeText={handleEmailChange}
          />

          <TouchableOpacity
            style={[
              styles.loginButton,
              isResetButtonDisabled && styles.disabledButton,
              isResetting && styles.resettingButton,
            ]}
            onPress={handleResetPassword}
            disabled={isResetButtonDisabled || isResetting}
          >
            <Text style={styles.loginButtonText}>
              {isResetting ? "Resetting your password..." : "RESET"}
            </Text>
          </TouchableOpacity>
        </View>
        <LoadingModal visible={isResetting} />

        <Divider />
      </ScrollView>
    </>
  );
};


const createStyles = (isDarkMode) => {
  return StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: isDarkMode ? '#140A32' : '#DCD1FF',
    alignItems: 'center',
    justifyContent: 'center',
  },

  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 1,
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 50,
  },
  logo: {
    width: 75,
    height: 75,
    resizeMode: 'contain',
  },
  image: {
    width: 60,
    height: 60,
    resizeMode: 'contain',
  },
  headerContainer: {
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    fontSize: 25,
    fontFamily: 'proxima',
    color: isDarkMode ? '#6E3DFF' : '#4C28BC',
  },
  subText: {
    fontSize: 14,
    fontFamily: 'karla',
    color: isDarkMode ? 'silver' : 'black',
    textAlign: 'center',
    marginHorizontal: 40,
    marginTop: 5,
  },
  inputContainer: {
    marginTop: 25,
    width: '90%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    fontSize: 17,
    height: 45,
    width: '80%',
    backgroundColor: isDarkMode ? '#313151' : '#F5F5F5',
    borderRadius: 10,
    marginBottom: 25,
    paddingLeft: 15,
    paddingRight: 5,
    borderWidth: 1,
    borderColor: 'silver',
    color: isDarkMode ? 'silver' : 'black',
  },
  
  
  loginButton: {
    backgroundColor: '#4C28BC',
    width: '80%',
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
    marginBottom: 15,
    marginTop: 10,
  },
  disabledButton: {
    backgroundColor: 'grey',
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'proxima',
  },

  resettingButton: {
    backgroundColor: 'green', // Change to the desired color
  },
  

  errorMessage: {
    color: 'red',
    fontSize: 12,
    marginTop: 5,
    textAlign: 'center',
  },
  
 
  
  divider: {
    width: '90%',
    marginTop: 10,
    height: 1,
    backgroundColor: 'silver',
  },
  
  

  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },

modalContent: {
    backgroundColor: '#F6F3FF',
    width: '100%',
    alignItems: 'center',
    borderTopRightRadius: 25,
    borderTopLeftRadius: 25,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,    
  },
  modalHeader: {
    marginTop: 50,
    fontSize: 25,
    fontFamily: 'proxima',
    color: '#4C28BC',
  },
  modalSubText: {
    fontSize: 14,
    fontFamily: 'karla',
    color: 'black',
    textAlign: 'center',
    marginTop: 5,
    marginRight: 15,
    marginLeft: 15
  },

  
  buttonsContainer: {
    flexDirection: 'row',
    marginTop: 15,
    position: 'relative',
    marginBottom: 35,
    alignSelf: 'center'
  },

  primaryButton: {
    flexDirection: 'row',
    backgroundColor: '#4C28BC',
    width: '85%',
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },

  primaryButtonText: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'ProductSans',
    marginRight: 5,
  },

});
}
export default PasswordForgot;
