import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, SafeAreaView, ScrollView, Image, Dimensions, TouchableOpacity, Keyboard, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { ipAddress } from '../../constants';
import LoadingModal from '../components/LoadingModal';

const { width, height } = Dimensions.get('window');

const CreateAccount = ({ navigation }) => {
  const [isPasswordVisible, setPasswordVisible] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [isFormTouched, setIsFormTouched] = useState(false); // New state variable
  const [email, setEmail] = useState('');
  const [validEmail, setValidEmail] = useState(true);
  const [firstName, setFirstName] = useState('');
  const [validFirstName, setValidFirstName] = useState(true);
  const [lastName, setLastName] = useState('');
  const [validLastName, setValidLastName] = useState(true);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [validPhoneNumber, setValidPhoneNumber] = useState(true);
  const [password, setPassword] = useState('');
  const [validPassword, setValidPassword] = useState(true);
  const [validConfirmPassword, setValidConfirmPassword] = useState(true);
  const [referralValue, setReferralValue] = useState('');
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);
  const [referralEmail, setReferralEmail] = useState('');


  useEffect(() => {
        // Check if both email and password are valid
        setIsFormValid(
          validEmail &&
          validPassword &&
          validConfirmPassword &&
          validFirstName &&
          validLastName &&
          validPhoneNumber &&
          isFormTouched
        );
      }, [
        validEmail,
        validPassword,
        validConfirmPassword,
        validFirstName,
        validLastName,
        validPhoneNumber,
        isFormTouched,
      ]);


  const validateEmail = (email) => {
    setValidEmail(email.includes('@'));
    setIsFormTouched(true); // Set the form touched when field value changes
  };

  const validatePassword = (password) => {
    setValidPassword(password.length >= 8);
    setIsFormTouched(true); // Set the form touched when field value changes
  };


  const validateFirstName = (firstName) => {
    setValidFirstName(firstName && /^[a-zA-Z0-9]+$/.test(firstName));
    setIsFormTouched(true); // Set the form touched when field value changes
  };
  
  const validateLastName = (lastName) => {
    setValidLastName(lastName && /^[a-zA-Z0-9]+$/.test(lastName));
    setIsFormTouched(true); // Set the form touched when field value changes
  };
  
  const validatePhoneNumber = (phoneNumber) => {
    setValidPhoneNumber(phoneNumber && /^\d+$/.test(phoneNumber) && phoneNumber.length <= 11);
    setIsFormTouched(true); // Set the form touched when field value changes
  };
  
  const togglePasswordVisibility = () => {
    setPasswordVisible(!isPasswordVisible);
    setIsFormTouched(true); // Set the form touched when field value changes
  };


  const handleSignup = async () => {
    try {
      setIsCreatingAccount(true);
  
      const response = await axios.post(`${ipAddress}/api/signup/`, {
        email: email.toLowerCase(),
        password: password,
        first_name: firstName,
        last_name: lastName,
        phone_number: phoneNumber,
        referral: referralValue, // Assuming referralValue contains the referral email
      });
  
      if (response.status === 201) {
        // Extract and set the referral email
        const { referral_email } = response.data;
  
        setIsCreatingAccount(false);
        setReferralEmail(referral_email); // Set the referral email in your state
        navigation.navigate('Confirmation', {
          email: email.toLowerCase(),
          password: password,
        });
      } else {
        // Handle other response statuses or errors
        console.log('Signup failed with status:', response.status);
        // You can add more specific error handling here based on the response status
        alert('Signup failed. Please check your details and try again.');
      }
    } catch (error) {
      setIsCreatingAccount(false);
      console.error('An error occurred during signup:', error);
  
      if (error.response) {
        console.log('Response data:', error.response.data);
        console.log('Response status:', error.response.status);
  
        if (error.response.status === 400) {
          if (error.response.data.email) {
            alert('A MyFund user is already using this email. Kindly use another email to create your account.');
          } else if (
            !error.response.data.first_name ||
            !error.response.data.last_name ||
            !error.response.data.email ||
            !error.response.data.password ||
            !error.response.data.phone_number
          ) {
            alert('Please fill in all required fields to create your account.');
          } else {
            alert('Signup failed. Please check your details and try again.');
          }
        } else {
          alert('Signup failed. Please check your details and try again.');
        }
      }
    }
  };
  
  



  


  return (
    <>
      <SafeAreaView style={styles.container}>
      
        <ScrollView contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
          <View style={styles.logoContainer}>
            <Image source={require('./logo..png')} style={styles.logo} />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.header}>Create Account</Text>
            <Text style={styles.subText}>Earn up to <Text style={{fontFamily: 'proxima'}}>20% p.a. </Text>every January and July. Own properties and earn a <Text style={{fontFamily: 'proxima'}}>lifetime rental income </Text>on MyFund. Signup here.</Text>
          </View>
          <View style={styles.inputContainer}>
            <View style={styles.inputWrapper}>
              <Ionicons name='person-outline' marginBottom={8} size={20} color="grey" padding={8} />
              <TextInput 
              style={[styles.input, !validFirstName && styles.invalidInput]} 
              placeholder="First Name"
              value={firstName}
              onChangeText={(text) => {
                setFirstName(text);
                validateFirstName(text);
              }}  
                />
            </View>


            <View style={styles.inputWrapper}>
              <Ionicons name='person-outline' marginBottom={8} size={20} color="grey" padding={8} />
              <TextInput 
              style={[styles.input, !validLastName && styles.invalidInput]} 
              placeholder="Last Name"
              value={lastName}
              onChangeText={(text) => {
                setLastName(text);
                validateLastName(text);
              }}  
                />
            </View>

            <View style={styles.inputWrapper}>
              <Ionicons name='at-outline' marginBottom={8} size={20} color="grey" padding={8} />
              <TextInput 
              style={[styles.input, !validEmail && styles.invalidInput]} 
              placeholder="Email Address (e.g. name@mail.com)" 
              keyboardType="email-address"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                validateEmail(text);
              }} 
                />
            </View>


            <View style={styles.inputWrapper}>
            <Ionicons name='call-outline' marginBottom={8} size={20} color="grey" padding={8} />
            <TextInput
              style={[styles.input, !validPhoneNumber && styles.invalidInput]}
              placeholder="Phone Number (e.g. 08034567890)"
              keyboardType="phone-pad"
              value={phoneNumber}
              onChangeText={(text) => {
                setPhoneNumber(text);
                validatePhoneNumber(text);
              }}
              prefix="+234"
            />
          </View>



            <View style={styles.inputWrapper}>
              <TouchableOpacity style={styles.eyeIcon} onPress={togglePasswordVisibility}>
                <Ionicons name={isPasswordVisible ? 'eye' : 'eye-off'} size={20} color="grey" marginBottom={8} padding={8} />
              </TouchableOpacity>
              <TextInput
                style={[styles.input, !validPassword && styles.invalidInput]}
                placeholder="Password (at least 8 characters)"
                secureTextEntry={!isPasswordVisible}
                keyboardType="default"
                value={password}
              onChangeText={(text) => {
              setPassword(text);
              validatePassword(text);
            }}
              />
            </View>


   


            <View style={styles.inputWrapper}>
              <Ionicons name='person-add-outline' marginBottom={9} size={20} color="grey" padding={8} />
              <TextInput
                  style={styles.input}
                  placeholder="Referral email (optional)"
                  keyboardType="email-address"
                  value={referralValue}
                  onChangeText={(text) => setReferralValue(text)}
                />
            </View>
          </View>



          <TouchableOpacity 
            style={[
              styles.createAccountButton, 
              !isFormValid && styles.disabledLoginButton, 
              isCreatingAccount && { backgroundColor: 'green' }  // Add this line
            ]}
            onPress={() => {
              Keyboard.dismiss(); // Dismiss the keyboard
              handleSignup(); // Call the handleSignup function
            }}
            disabled={!isFormValid || isCreatingAccount}  // Disable the button while account is being created
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              {isCreatingAccount ? (
                <ActivityIndicator color="white" size="small" /> // Show the activity indicator
              ) : null}
              <Text style={styles.createAccountButtonText}>
                {isCreatingAccount ? "  Creating Account..." : "CREATE ACCOUNT"}  {/* Update the text */}
              </Text>
            </View>
          </TouchableOpacity>




          <LoadingModal visible={isCreatingAccount} />


          <TouchableOpacity style={styles.loginTextContainer} onPress={() => navigation.navigate('Login')}>
            <Text style={styles.loginText}>Already have an account? <Text style={styles.login}>Log in</Text></Text>
          </TouchableOpacity>
          {/* <View style={styles.divider} />
          <Text style={styles.orLoginText}>OR SIGN UP WITH</Text>
          <View style={styles.buttonContainer}>
          
          <TouchableOpacity
        style={styles.googleButton}
      >
        <Ionicons name="logo-google" size={24} color="#fff" />
        <Text style={styles.googleButtonText}>Google</Text>
      </TouchableOpacity>

            <TouchableOpacity style={styles.linkedinButton}>
              <Ionicons name="logo-linkedin" size={24} color="#fff" />
              <Text style={styles.linkedinButtonText}>LinkedIn</Text>
            </TouchableOpacity>
          </View> */}
        </ScrollView>
      </SafeAreaView>
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

  contentContainer: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: width,
    minHeight: height,
  },

  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 1,
  },
  backButtonText: {
    fontSize: 16,
    color: '#4C28BC',
    fontFamily: 'proxima',
  },
  
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 90,
    marginBottom: 70,

  },
  logo: {
    width: 75,
    height: 75,
    resizeMode: 'contain',
  },
  textContainer: {
    marginTop: 15,
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
    marginTop: 10,
  },
  inputContainer: {
    marginTop: 30,
    width: '90%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    fontSize: 15,
    height: 40,
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    marginBottom: 10,
    paddingLeft: 14,
    borderWidth: 1,
    borderColor: 'green'    
  },

  invalidInput: {
    borderColor: 'red',
  },

  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center', // align items to the end of container
 },

  createAccountButton: {
    backgroundColor: '#4C28BC',
    width: '80%',
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    borderRadius: 15,
    marginBottom: 4,
    marginTop: 10,
  },
  createAccountButtonText:{
    color: '#fff',
    fontSize: 16,
    fontFamily: 'proxima',
  },

  disabledLoginButton: {
    backgroundColor: 'grey',
  },


  loginTextContainer: {
    fontSize: 16,
    fontFamily: 'karla',
    color: 'black',
    textAlign: 'center',
    marginTop: 20,
  },
  loginText: {
    fontSize: 14,
    fontFamily: 'karla',
    color: 'black',
    textAlign: 'center',
    marginHorizontal: 40,
    marginTop: 5,
  },
  login: {
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
      alignSelf: 'center'
  },

  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 17,
    marginBottom: 20
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



});

export default CreateAccount;
