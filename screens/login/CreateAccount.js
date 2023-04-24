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
});

export default CreateAccount;
