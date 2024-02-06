import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, SafeAreaView, ScrollView, Image, Dimensions, TouchableOpacity, Keyboard, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { ipAddress } from '../../constants';
import LoadingModal from '../components/LoadingModal';
import { useTheme } from '../../ThemeContext';

const { width, height } = Dimensions.get('window');

const CreateAccount = ({ route, navigation }) => {
  const [isPasswordVisible, setPasswordVisible] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [isFormTouched, setIsFormTouched] = useState(false); // New state variable
  const [email, setEmail] = useState(prefillEmail || ''); // Set the email from prefillEmail, or an empty string if not provided
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
  const { prefillEmail } = route.params || {}; // Ensure that route.params is defined
  const { isDarkMode, colors } = useTheme();
  const styles = createStyles(isDarkMode);

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
        setValidEmail(email.trim().includes('@'));
        setIsFormTouched(true);
      };
      
      const validateFirstName = (firstName) => {
        const trimmedFirstName = firstName.trim();
        setValidFirstName(trimmedFirstName && /^[a-zA-Z0-9]+$/.test(trimmedFirstName));
        setIsFormTouched(true);
      };
      
      const validateLastName = (lastName) => {
        const trimmedLastName = lastName.trim();
        setValidLastName(trimmedLastName && /^[a-zA-Z0-9]+$/.test(trimmedLastName));
        setIsFormTouched(true);
      };
      
      const validatePhoneNumber = (phoneNumber) => {
        const trimmedPhoneNumber = phoneNumber.trim();
        setValidPhoneNumber(
          trimmedPhoneNumber && /^\d+$/.test(trimmedPhoneNumber) && trimmedPhoneNumber.length <= 11
        );
        setIsFormTouched(true);
      };
      
      const validatePassword = (password) => {
        setValidPassword(password.trim().length >= 8);
        setIsFormTouched(true);
      };      
  
  const togglePasswordVisibility = () => {
    setPasswordVisible(!isPasswordVisible);
    setIsFormTouched(true); // Set the form touched when field value changes
  };


  const handleSignup = async () => {
    try {
      setIsCreatingAccount(true);
  
      // Build the request payload
      const payload = {
        email: email.toLowerCase(),
        password: password,
        first_name: firstName,
        last_name: lastName,
        phone_number: phoneNumber,
      };
  
      // Include referral email only if it's provided
      if (referralValue.trim() !== '') {
        payload.referral = referralValue.toLowerCase().trim();
      }
  
      const response = await axios.post(`${ipAddress}/api/signup/`, payload);
  
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
            alert('A MyFund user is already using this email. Kindly use another email to create your account. If in doubt, kindly return to the login screen and select "Forgot Password?"');
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
          <Image
        source={isDarkMode ? require('../images/icon.png') : require('../images/logo..png')}
        style={styles.logo}
      />
            </View>
          <View style={styles.textContainer}>
            <Text style={styles.header}>Create Account</Text>
            <Text style={styles.subText}>Earn up to <Text style={{fontFamily: 'proxima', color: isDarkMode? '#43FF8E' : 'green'}}>20% p.a. </Text>every January and July. Own properties and earn a <Text style={{fontFamily: 'proxima'}}>lifetime rental income </Text>on MyFund. Signup here.</Text>
          </View>



          <View style={styles.fieldContainer2}>
              <View style={styles.iconContainer}> 
          <Ionicons  name="person-outline" size={19} color="green"  zIndex={-1} />
        </View>   
            <View style={styles.inputContainer}>
        <TextInput 
              style={[styles.input, !validFirstName && styles.invalidInput]} 
              placeholder="First Name"
              placeholderTextColor="grey" 
              value={firstName}
              onChangeText={(text) => {
                setFirstName(text);
                validateFirstName(text);
              }}  
                />
            </View>
            </View>


            <View style={styles.fieldContainer2}>
            <View style={styles.iconContainer}> 
          <Ionicons  name="person-outline" size={19} color="green"  zIndex={-1} />
        </View>        
        <View style={styles.inputContainer}>
        <TextInput 
              style={[styles.input, !validLastName && styles.invalidInput]} 
              placeholder="Last Name"
              placeholderTextColor="grey" 
              value={lastName}
              onChangeText={(text) => {
                setLastName(text);
                validateLastName(text);
              }}  
                />
            </View>
            </View>


            <View style={styles.fieldContainer2}>
            <View style={styles.iconContainer}> 
          <Ionicons  name="at-outline" size={19} color="green"  zIndex={-1} />
        </View>       
        <View style={styles.inputContainer}>        
        <TextInput 
              style={[styles.input, !validEmail && styles.invalidInput]} 
              placeholder="Email Address (e.g. name@mail.com)" 
              placeholderTextColor="grey" 
              keyboardType="email-address"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                validateEmail(text);
              }} 
                />
            </View>
            </View>


            <View style={styles.fieldContainer2}>
            <View style={styles.iconContainer}> 
          <Ionicons  name="call-outline" size={19} color="green"  zIndex={-1} />
        </View>  
        <View style={styles.iconContainer}> 
        <Text style={styles.subText2}>+234</Text>
        </View>  
        <View style={styles.inputContainer}>        
                    <TextInput
              style={[styles.input2, !validPhoneNumber && styles.invalidInput]}
              placeholder=" Phone Number (e.g. 8034567890)"
              placeholderTextColor="grey" 
              keyboardType="phone-pad"
              value={phoneNumber}
              onChangeText={(text) => {
                setPhoneNumber(text);
                validatePhoneNumber(text);
              }}
              prefix="+234"
            />
          </View>
          </View>



          <View style={styles.fieldContainer2}>
          <View style={styles.iconContainer}> 
          <Ionicons  name="lock-closed-outline" size={19} color="green"  zIndex={-1} />
        </View>  
        <View style={styles.inputContainer}>    
        <View style={styles.iconContainer2}> 
              <TouchableOpacity style={styles.eyeIcon} onPress={togglePasswordVisibility}>
                <Ionicons name={isPasswordVisible ? 'eye' : 'eye-off'} size={20} color="grey" marginBottom={8} padding={8}  />
              </TouchableOpacity>
              </View>
              <TextInput
                style={[styles.input, !validPassword && styles.invalidInput]}
                placeholder="Password (at least 8 characters)"
                placeholderTextColor="grey" 
                secureTextEntry={!isPasswordVisible}
                keyboardType="default"
                value={password}
              onChangeText={(text) => {
              setPassword(text);
              validatePassword(text);
            }}
              />
            </View>
            </View>


   


            <View style={styles.fieldContainer2}>
            <View style={styles.iconContainer}> 
          <Ionicons  name="person-add-outline" size={19} color="green"  zIndex={-1} />
        </View>  
              <View style={styles.inputContainer}>    
              <TextInput
                  style={styles.input}
                  placeholder="Referral email (optional)"
                  placeholderTextColor="grey" 
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
            disabled={!isFormValid || isCreatingAccount }  // Disable the button while account is being created
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


const createStyles = (isDarkMode) => {
  return StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: isDarkMode ? '#140A32' : '#DCD1FF',
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
    marginBottom: 15,
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
    marginTop: 10,
  },

  subText2: {
    fontSize: 15,
    color: isDarkMode ? 'white' : 'black',
    textAlign: 'center',
    marginHorizontal: 25,
    marginTop: 0.5,
  },

  inputContainer: {
    marginTop: 25,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },

  

  fieldContainer2: {
    alignSelf: 'center',
    alignItems: 'center',
    alignContents: 'center',
    width: '100%',
    marginTop: -20,
  },

  iconContainer: {
    position: 'absolute', // Use absolute positioning
    left: 10, // Adjust the left position as needed
    top: '63%', 
    marginLeft: 47,
    marginTop: -1,
    zIndex: 1,
    transform: [{ translateY: -12 }], 
  },

  iconContainer2: {
    position: 'absolute', // Use absolute positioning
    right: 47, // Adjust the left position as needed
    top: '63%', 
    marginTop: -18,
    zIndex: 1,
    transform: [{ translateY: -12 }], 
  },

  input: {
    fontSize: 15,
    height: 40,
    width: '80%',
    backgroundColor: isDarkMode ? '#313151' : '#F5F5F5',
    borderRadius: 10,
    marginBottom: 10,
    paddingLeft: 40,
    borderWidth: 1,
    borderColor: 'green',
    color: isDarkMode ? 'white' : 'black',
  },

  input2: {
    fontSize: 15,
    height: 40,
    width: '80%',
    backgroundColor: isDarkMode ? '#313151' : '#F5F5F5',
    borderRadius: 10,
    marginBottom: 10,
    paddingLeft: 77,
    borderWidth: 1,
    borderColor: 'green',
    color: isDarkMode ? 'white' : 'black',
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
    backgroundColor: isDarkMode ? '#6E3DFF' : '#4C28BC',
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
    color: isDarkMode ? 'silver' : 'black',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 20,

  },
  loginText: {
    fontSize: 14,
    fontFamily: 'karla',
    color: isDarkMode ? 'silver' : 'black',
    textAlign: 'center',
    marginHorizontal: 40,
    marginTop: 5,
  },
  login: {
    fontSize: 14,
    fontFamily: 'karla',
    color: isDarkMode ? '#6E3DFF' : '#4C28BC',
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
}
export default CreateAccount;
