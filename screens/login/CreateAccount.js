import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Image, Dimensions, TouchableOpacity, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

const CreateAccount = ({ navigation }) => {
  const [isPasswordVisible, setPasswordVisible] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
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
  const [confirmPassword, setConfirmPassword] = useState('');
  const [validConfirmPassword, setValidConfirmPassword] = useState(true);

  useEffect(() => {
    // Check if both email and password are valid
    setIsFormValid(validEmail && validPassword && validConfirmPassword && validFirstName && validLastName && validPhoneNumber);
  }, [validEmail, validPassword, validConfirmPassword, validFirstName, validLastName, validPhoneNumber]);


  const validateEmail = (email) => {
    setValidEmail(email.includes('@'));
  };

  const validatePassword = (password) => {
    setValidPassword(password.length >= 8);
  };

  const validateConfirmPassword = (confirmPassword) => {
    setValidConfirmPassword(confirmPassword === password);
  };

  const validateFirstName = (firstName) => {
    setValidFirstName(firstName && /^[a-zA-Z0-9]+$/.test(firstName));
  };
  
  const validateLastName = (lastName) => {
    setValidLastName(lastName && /^[a-zA-Z0-9]+$/.test(lastName));
  };
  
  const validatePhoneNumber = (phoneNumber) => {
    setValidPhoneNumber(phoneNumber && /^\d+$/.test(phoneNumber) && phoneNumber.length <= 11);
  };
  
    

  const togglePasswordVisibility = () => {
    setPasswordVisible(!isPasswordVisible);
  };

  return (
    <>
      <SafeAreaView style={styles.container}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#4C28BC" />
        </TouchableOpacity>
        <ScrollView contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
          <View style={styles.logoContainer}>
            <Image source={require('./logo..png')} style={styles.logo} />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.header}>Create Account</Text>
            <Text style={styles.subText}>Earn up to 20% p.a. every January and July. Own peroperties and earn a lifetime rental income on MyFund</Text>
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
              <TouchableOpacity style={styles.eyeIcon} onPress={togglePasswordVisibility}>
                <Ionicons name={isPasswordVisible ? 'eye' : 'eye-off'} size={20} color="grey" marginBottom={8} padding={8} />
              </TouchableOpacity>
              <TextInput
                style={[styles.input, !validConfirmPassword && styles.invalidInput]}
                placeholder="Confirm Password"
                secureTextEntry={!isPasswordVisible}
                keyboardType="default"
                value={confirmPassword}
              onChangeText={(text) => {
              setConfirmPassword(text);
              validateConfirmPassword(text);
            }}
              />
            </View>


            <View style={styles.inputWrapper}>
              <Ionicons name='person-add-outline' marginBottom={9} size={20} color="grey" padding={8} />
              <TextInput style={styles.input} 
              placeholder="Referral Phone/Username (optional)" 
              keyboardType="phone-pad" />
            </View>
          </View>



          <TouchableOpacity 
          style={[styles.createAccountButton, !isFormValid && styles.disabledLoginButton]}
          onPress={() => navigation.navigate('Confirmation')}
          disabled={!isFormValid}
          >
            <Text style={styles.createAccountButtonText}>CREATE ACCOUNT</Text>
          </TouchableOpacity>



          <TouchableOpacity style={styles.loginTextContainer} onPress={() => navigation.navigate('Login')}>
            <Text style={styles.loginText}>Already have an account? <Text style={styles.login}>Log in</Text></Text>
          </TouchableOpacity>
          <View style={styles.divider} />
          <Text style={styles.orLoginText}>OR SIGN UP WITH</Text>
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
    marginTop: 70,
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
    marginHorizontal: 40,
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
