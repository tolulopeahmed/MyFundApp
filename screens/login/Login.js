import React, { useEffect, useState } from 'react';
import { View, Alert, ActivityIndicator, Text, ScrollView, StyleSheet,Image,animation,TouchableOpacity,TextInput,Modal,Animated,} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as LocalAuthentication from 'expo-local-authentication';
import logo from './logo..png';
import axios from 'axios';
import { CommonActions } from '@react-navigation/native';
import { ipAddress } from '../../constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Login = ({ navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [validEmail, setValidEmail] = useState(true);
  const [validPassword, setValidPassword] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [isFormTouched, setIsFormTouched] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);



  useEffect(() => {
    // Check if both email and password are valid and form has been touched
    setIsFormValid(validEmail && validPassword && isFormTouched);
  }, [validEmail, validPassword, isFormTouched]);
  

  const handleLogin = async () => {
    setIsLoggingIn(true);
  
    try {
      const response = await axios.post(`${ipAddress}/api/login/`, {
        username: email.toLowerCase(),
        password: password,
      });
  
      setIsLoggingIn(false);
  
      if (response.status === 200) {
        const { access, refresh, user_id } = response.data; // Destructure tokens and user_id
  
        if (access && refresh) {
          // Save the access token to AsyncStorage
          await AsyncStorage.setItem('authToken', access);
  
          // Save the user_id to AsyncStorage (if needed)
          await AsyncStorage.setItem('userId', user_id.toString());
  
          setModalVisible(false);
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{ name: 'DrawerTab' }],
            })
          );
        } else {
          // Handle case where tokens are missing
          console.log('Tokens missing in response:', response.data);
        }
      } else if (response.status === 400) {
        // Wrong username or password
        Alert.alert('Wrong username or password', 'Please try again.');
        console.log('Login failed:', response.data);
      } else {
        // Other login error
        Alert.alert(
          'Login Error',
          'An error occurred while logging in. Please try again later.'
        );
        console.log('Login failed:', response.data);
      }
    } catch (error) {
      setIsLoggingIn(false);
      Alert.alert(
        'Login Error',
        'An error occurred while logging in. Please try again later.'
      );
      console.log('Login error:', error);
    }
  };
  
  
  
  
  



  const handleFingerprintLogin = async () => {
    try {
      const { success } = await LocalAuthentication.authenticateAsync();
      if (success) {
        handleLogin();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const validateEmail = (email) => {
    setValidEmail(email.includes('@'));
  };

  const validatePassword = (password) => {
    setValidPassword(password.length >= 8);
  };

  return (
    <>
     

      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.logoContainer}>
          <Image source={logo} style={styles.logo} />
        </View>
        <View style={styles.headerContainer}>
          <Text style={styles.header}>Welcome Back</Text>
          <Text style={styles.subText}>
          Earn up to <Text style={{fontFamily: 'proxima'}}>20% p.a. </Text>every January and July. Own properties and earn a <Text style={{fontFamily: 'proxima'}}>lifetime rental income </Text>on MyFund. Jump right back in!
          </Text>
        </View>


        <View style={styles.inputContainer}>
          <TextInput
          style={[styles.input, !validEmail && styles.invalidInput]}
          placeholder="Email Address"
          value={email}
          onChangeText={(text) => {
            setEmail(text);
            validateEmail(text);
          }}
          onBlur={() => setIsFormTouched(true)}
        />
     

        <View style={styles.passwordInputContainer}>
          <TextInput
          style={[styles.passwordInput, !validPassword && styles.invalidInput]}
          placeholder="Password"
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={(text) => {
            setPassword(text);
            validatePassword(text);
          }}
          onBlur={() => setIsFormTouched(true)}
        />

            <TouchableOpacity style={styles.passwordToggle} onPress={togglePasswordVisibility}>
              <Ionicons
                name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                size={20}
                color="grey"
              />
            </TouchableOpacity>

          </View>

          <View>
            <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>
          </View>
         
          <TouchableOpacity style={styles.fingerprintContainer} onPress={handleFingerprintLogin}>
            <Image source={require('./fingerprint.png')} style={styles.image} />
            <Text style={styles.fingerprintText}>Tap to use Fingerprint</Text>
          </TouchableOpacity>

          <TouchableOpacity
          style={[
            styles.loginButton,
            !isFormValid && styles.disabledLoginButton,
            isLoggingIn && { backgroundColor: 'green' },
          ]}
          onPress={handleLogin}
          disabled={!isFormValid || isLoggingIn}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            {isLoggingIn ? (
              <ActivityIndicator color="white" size="small" /> // Show the activity indicator
            ) : null}
            <Text style={styles.loginButtonText}>
              {isLoggingIn ? ' Logging in...' : 'LOG IN'} {/* Display the text */}
            </Text>
          </View>
        </TouchableOpacity>





          <TouchableOpacity
            style={styles.createAccountTextContainer}
            onPress={() => navigation.navigate('CreateAccount')}
          >
            <Text style={styles.createAccountText}>
              New to MyFund? <Text style={styles.createAccount}>Create Free Account</Text>
            </Text>
          </TouchableOpacity>
        </View>

        {/* add a divider line */}
        <View style={styles.divider} />
        <Text style={styles.orLoginText}>OR LOGIN WITH</Text>

        {/* add two buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.googleButton}>
            <Ionicons name="logo-google" size={24} color="#fff" />
            <Text style={styles.googleButtonText}>Google</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.linkedinButton}>
            <Ionicons name="logo-linkedin" size={24} color="#fff" />
            <Text style={styles.linkedinButtonText}>LinkedIn</Text>
          </TouchableOpacity>
        </View>

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer} onPress={() => setModalVisible(false)}>
            <View style={styles.modalContent}>
              <Text style={styles.modalHeader}>We've confirmed it's you!</Text>
              <Text style={styles.modalSubText}>Welcome to MyFund</Text>
              <Animated.View style={[styles.checkmarkContainer, { opacity: animation }]}>
              <Ionicons name="checkmark-circle-outline" size={170} color="green" marginBottom={60} marginTop={20}/>
              </Animated.View>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#DCD1FF',
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
    color: '#4C28BC',
  },
  subText: {
    fontSize: 14,
    fontFamily: 'karla',
    color: 'black',
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
    backgroundColor: 'white',
    borderRadius: 10,
    marginBottom: 15,
    paddingLeft: 15,
    paddingRight: 5,
    borderWidth: 1,
    borderColor: 'green'    
  },

  invalidInput: {
    borderColor: 'red',
  },

  passwordInputContainer: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
    width: '80%',
  },
  passwordInput: {
    flex: 1,
    fontSize: 17,
    height: 45,
    backgroundColor: 'white',
    borderRadius: 10,
    marginBottom: 15,
    paddingLeft: 15,
    paddingRight: 40,
    borderWidth: 1,
    borderColor: 'green'    
  },
  passwordToggle: {
    position: 'absolute',
    right: 10,
    top: 14,
  },
  forgotPasswordText: {
    fontSize: 13,
    fontFamily: 'karla',
    color: '#4C28BC',
    alignSelf: 'flex-end',
    marginLeft: '50%',
    marginBottom: 25,
  },
  fingerprintContainer: {
    alignItems: 'center', // Align content to the center horizontally
    justifyContent: 'center', // Align content to the center vertically
  },

  fingerprintText: {
    marginTop: 5,
    marginBottom: 20,
    fontSize: 9,
    fontFamily: 'karla',
    color: 'grey',
    textAlign: 'center',
    alignSelf: 'center'
  },

  disabledLoginButton: {
    backgroundColor: 'grey',
  },

  loginButton: {
    backgroundColor: '#4C28BC',
    width: '80%',
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
    marginBottom: 4,
    marginTop: 10,
    marginRight: 10,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'proxima',
  },
  createAccountTextContainer: {
    fontSize: 16,
    fontFamily: 'karla',
    color: 'black',
    textAlign: 'center',
    marginHorizontal: 40,
  },
  createAccountText: {
    fontSize: 13,
    fontFamily: 'karla',
    color: 'black',
    textAlign: 'center',
    marginHorizontal: 10,
    marginTop: 5,
    letterSpacing: -0.2,
  },
  createAccount: {
    fontSize: 14,
    fontFamily: 'karla',
    color: '#4C28BC',
    textAlign: 'center',
    marginHorizontal: 40,
    marginTop: 5,
  },
  divider: {
    width: '90%',
    marginTop: 10,
    height: 1,
    backgroundColor: 'silver',
  },
  orLoginText: {
    fontSize: 10,
    marginTop: 16,
    color: 'grey',
    fontFamily: 'karla',
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 17,
    marginBottom: 17,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    //backgroundColor: '#DB4437',
    borderRadius: 20,
    paddingVertical: 1,
    paddingHorizontal: 10,
    width: '25%',
    height: 30,
    backgroundColor: '#9D8CD7',
    marginRight: 5,
  },
  googleButtonText: {
    color: 'white',
    fontSize: 15,
    marginLeft: 10,
    fontFamily: 'karla',
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 5,
  },
  linkedinButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    //backgroundColor: '#DB4437',
    borderRadius: 20,
    paddingVertical: 1,
    paddingHorizontal: 10,
    width: '30%',
    height: 30,
    backgroundColor: '#9D8CD7',
  },
  linkedinButtonText: {
    color: 'white',
    fontSize: 15,
    marginLeft: 10,
    fontFamily: 'karla',
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 5,
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
  },

});

export default Login;
