import React, { useEffect, useRef, useState } from 'react';
import { View, Alert,Keyboard, ActivityIndicator, Text, ScrollView, StyleSheet,Image,animation,TouchableOpacity,TextInput,Modal,Animated,} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as LocalAuthentication from 'expo-local-authentication';
import logo from './logo..png';
import axios from 'axios';
import { CommonActions } from '@react-navigation/native';
import { ipAddress } from '../../constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Audio } from 'expo-av';
import { useDispatch } from 'react-redux';
import { loadBankAccounts, setUserToken, fetchUserCards } from '../../ReduxActions';

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
  const dispatch = useDispatch();

  const passwordInputRef = useRef(null); // Create a ref for the password input



  useEffect(() => {
    // Check if both email and password are valid and form has been touched
    setIsFormValid(validEmail && validPassword && isFormTouched);
  }, [validEmail, validPassword, isFormTouched]);
  
  const playLoginSound = async () => {
    const soundObject = new Audio.Sound();

    try {
      await soundObject.loadAsync(require('./warm_login.mp3'));
      await soundObject.playAsync();
    } catch (error) {
      console.log('Error playing sound:', error);
    }
  };


  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };


  
const handleLogin = async () => {
  setIsLoggingIn(true);

  dismissKeyboard();

  try {
    // Attempt to make the login request
    const response = await axios.post(`${ipAddress}/api/login/`, {
      username: email.toLowerCase(),
      password: password,
    });


    if (response.status === 200) {
      const { access, refresh, user_id } = response.data;

      if (access && refresh) {
        await AsyncStorage.setItem('UserToken', access);
        await AsyncStorage.setItem('userId', user_id.toString());

        dispatch(loadBankAccounts());
        dispatch(setUserToken(access));
        dispatch(fetchUserCards());

        setModalVisible(false);
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: 'DrawerTab' }],
          })
        );

        // Play the login sound
        playLoginSound();
      } else {
        console.log('Tokens missing in response:', response.data);
      }
    } else if (response.status === 400) {
      // Check if the response contains specific error details
      if (response.data && response.data.non_field_errors) {
        Alert.alert('Login Error', 'Wrong username or password. Please try again.');
      } else {
        Alert.alert('Login Error', 'An error occurred while logging in. Please try again later.');
        console.log('Login failed:', response.data);
      }
    } else {
      Alert.alert('Login Error', 'An error occurred while logging in. Please try again later.');
      console.log('Login failed:', response.data);
    }
  } catch (error) {
    setIsLoggingIn(false);
    if (error.message === 'Network Error') {
      Alert.alert('Connection Error', 'Please check your internet connection and try again.');
    } else {
      Alert.alert('Login Error', 'Wrong username or password. Please check and try again.');
      console.log('Login error:', error);
    }
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
     

      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled" // Ensure taps outside input fields dismiss the keyboard
      >   
           <View style={styles.logoContainer}>
          <Image source={logo} style={styles.logo} />
        </View>
        <View style={styles.headerContainer}>
          <Text style={styles.header}>Welcome Back</Text>
          <Text style={styles.subText}>
          Earn up to <Text style={{fontFamily: 'proxima'}}>20% p.a. </Text>every January and July. Own properties and earn a <Text style={{fontFamily: 'proxima'}}>lifetime rental income </Text>on MyFund. Jump right back in!
          </Text>
        </View>


        <View style={styles.fieldContainer2}>
        <View style={styles.iconContainer}> 
          <Ionicons  name="person-outline" size={20} color="green"  zIndex={-1} />
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
        </View>
        </View>


        <View style={styles.fieldContainer2}>
        <View style={styles.iconContainer}> 
          <Ionicons  name="lock-closed-outline" size={20} color="green"  zIndex={-1} marginTop={-3} />
        </View> 
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
          ref={passwordInputRef} // Set the ref for the password input

        />
            <TouchableOpacity style={styles.passwordToggle} onPress={togglePasswordVisibility}>
              <Ionicons
                name={showPassword ? 'eye' : 'eye-off'}
                size={20}
                color="grey"
              />
            </TouchableOpacity>
            </View>
          </View>

          

          <View>
            <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>
          </View>
         
          <View style={styles.loginButtonContainer}>
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
        <ActivityIndicator color="white" size="small" />
      ) : null}
      <Text style={styles.loginButtonText}>
        {isLoggingIn ? '  Logging in...' : 'LOG IN'}
      </Text>
    </View>
  </TouchableOpacity>

  {/* Fingerprint button */}
  <TouchableOpacity
    style={styles.fingerprintButton}
    onPress={handleFingerprintLogin}
  >
    <Image source={require('./fingerprint.png')} style={styles.fingerprintImage} />
  </TouchableOpacity>
</View>


          <TouchableOpacity
            style={styles.createAccountTextContainer}
            onPress={() => navigation.navigate('CreateAccount')}
          >
            <Text style={styles.createAccountText}>
              New to MyFund? <Text style={styles.createAccount}>Create Free Account</Text>
            </Text>
          </TouchableOpacity>

        {/* add a divider line */}
        {/* <View style={styles.divider} />
        <Text style={styles.orLoginText}>OR LOGIN WITH</Text>

        {/* add two buttons */}
        {/* <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.googleButton}>
            <Ionicons name="logo-google" size={24} color="#fff" />
            <Text style={styles.googleButtonText}>Google</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.linkedinButton}>
            <Ionicons name="logo-linkedin" size={24} color="#fff" />
            <Text style={styles.linkedinButtonText}>LinkedIn</Text>
          </TouchableOpacity>
        </View> */} 

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
    marginTop: 170,
    marginBottom: 70,

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
    marginTop: 40,
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
    marginBottom: 15,

  },

  fieldContainer2: {
    alignSelf: 'center',
    alignItems: 'center',
    alignContents: 'center',
    width: '85%',
  },
  
  inputContainer: {
    marginTop: 25,
    width: '95%',
    alignItems: 'center',
    justifyContent: 'center',
  },

  input: {
    fontSize: 17,
    height: 45,
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 10,
    marginBottom: 15,
    paddingLeft: 40,
    paddingRight: 5,
    borderWidth: 1,
    borderColor: 'green',
        
  },
  passwordInputContainer: {
    position: 'relative',
    flexDirection: 'row',
    alignSelf: 'center',
    alignItems: 'center',
    alignContents: 'center',
    width: '95%',
  },

  invalidInput: {
    borderColor: 'red',
  },

  iconContainer: {
    position: 'absolute', // Use absolute positioning
    left: 10, // Adjust the left position as needed
    top: '63%', 
    marginLeft: 12,
    marginTop: -5,
    zIndex: 1,
    transform: [{ translateY: -12 }], 
  },


  passwordInput: {
    flex: 1,
    fontSize: 17,
    height: 45,
    backgroundColor: 'white',
    borderRadius: 10,
    marginBottom: 5,
    paddingLeft: 15,
    paddingRight: 40,
    borderWidth: 1,
    borderColor: 'green',
    paddingLeft: 40,
  
  },
  passwordToggle: {
    position: 'absolute',
    right: 12,
    top: 12,
  },
  forgotPasswordText: {
    fontSize: 12,
    fontFamily: 'karla',
    color: '#4C28BC',
    alignSelf: 'flex-end',
    marginLeft: '56%',
    marginBottom: 1,
  },
  loginButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '77%',
    marginTop: 5,
    marginRight: 10,
    marginBottom: 55,

  },


  fingerprintImage: {
    width: 40, // Adjust the width as needed
    height: 40, // Adjust the height as needed
    resizeMode: 'contain',
    marginBottom: 12,

  },


  disabledLoginButton: {
    backgroundColor: 'grey',
  },

  loginButton: {
    backgroundColor: '#4C28BC',
    width: '90%',
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
    marginBottom: 24,
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
    marginHorizontal: 1,
  },
  createAccountText: {
    fontSize: 13,
    fontFamily: 'karla',
    color: 'black',
    textAlign: 'center',
    marginHorizontal: 5,
    marginBottom: 5,
    letterSpacing: -0.2,
  },
  createAccount: {
    fontSize: 14,
    fontFamily: 'karla',
    color: '#4C28BC',
    textAlign: 'center',
    marginHorizontal: 10,
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
