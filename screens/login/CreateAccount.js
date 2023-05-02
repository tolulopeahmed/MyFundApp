import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, TextInput } from 'react-native';
import * as Font from 'expo-font';
import { Ionicons } from '@expo/vector-icons';


const CreateAccount = ({ navigation }) => {
  return (
    <View style={styles.container}>
           <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="#4C28BC" />
      </TouchableOpacity>
      <View style={styles.logoContainer}>
        <Image source={require('./logo..png')} style={styles.logo} />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.header}>Create Account</Text>
        <Text style={styles.subText}>Join thousands of landlords to learn how to become one yourself with MyFund.</Text>
      </View>
      <View style={styles.inputContainer}>
        <TextInput style={styles.input} placeholder="First Name"/>
        <TextInput style={styles.input} placeholder="Last Name" />
        <TextInput style={styles.input} placeholder="Email Address" keyboardType="email-address" />
        <TextInput style={styles.input} placeholder="Phone Number" keyboardType="phone-pad" />
        <TextInput style={styles.input} placeholder="Referral Phone/Username (optional)" keyboardType="phone-pad" />
      </View>
      <TouchableOpacity style={styles.createAccountButton} onPress={() => navigation.navigate('Confirmation')}>
        <Text style={styles.createAccountButtonText}>CREATE ACCOUNT</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.loginTextContainer} onPress={() => navigation.navigate('Login')}>
        <Text style={styles.loginText}>Already have an account? <Text style={styles.login}>Log in</Text></Text>
      </TouchableOpacity>


 {/* add a divider line */}
 <View style={styles.divider} />
 <Text style={styles.orLoginText}>OR SIGN UP WITH</Text>

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


    </View>
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
  },
  backButtonText: {
    fontSize: 16,
    color: '#4C28BC',
    fontFamily: 'proxima',
  },
  logoContainer: {
    flex: 0,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 50,
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
    width: '100%',
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
  },
  createAccountButton: {
    backgroundColor: '#4C28BC',
    width: '80%',
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
    marginBottom: 4,
    marginTop: 10,
  },
  createAccountButtonText:{
    color: '#fff',
    fontSize: 16,
    fontFamily: 'proxima',
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
  },

  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 17,
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
