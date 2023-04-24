import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import logo from './logo..png';

const Login = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="#4C28BC" />
      </TouchableOpacity>
      <View style={styles.logoContainer}>
        <Image source={logo} style={styles.logo} />
      </View>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Welcome Back</Text>
        <Text style={styles.subText}>Have you earned your first rent yet? To do so, you need get your first property. That’s why you’re here. Jump right back in!</Text>
      </View>
      <View style={styles.inputContainer}>
        <TextInput style={styles.input} placeholder="Email or Phone Number" />
        <TextInput style={styles.input} placeholder="Password" secureTextEntry={true} />
        <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
          <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
        </TouchableOpacity>
        <View style={styles.fingerprintContainer}>
        <Image source={require('./fingerprint.png')} style={styles.image} />
          <Text style={styles.fingerprintText}>Use Fingerprint</Text>
        </View>
        <TouchableOpacity style={styles.loginButton} onPress={() => navigation.navigate('Home')}>
          <Text style={styles.loginButtonText}>LOG IN</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.createAccountTextContainer} onPress={() => navigation.navigate('CreateAccount')}>
          <Text style={styles.createAccountText}>New to MyFund? <Text style={styles.createAccount}>Create Free Account</Text></Text>
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
    width: 75,
    height: 75,
    resizeMode: 'contain',
  },
  headerContainer: {
    marginTop: 30,
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
  forgotPasswordText: {
    fontSize: 13,
    fontFamily: 'karla',
    color: '#4C28BC',
    textAlign: 'right',
    marginLeft: 210,
    marginBottom: 30,
  },
    fingerprintContainer: {
    },

    fingerprintText: {
        marginTop: 5,
        marginBottom: 20,
        fontSize: 9,
        fontFamily: 'karla',
        color: 'grey',
        textAlign: 'center',
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
      },
      loginButtonText:{
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
        fontSize: 14,
        fontFamily: 'karla',
        color: 'black',
        textAlign: 'center',
        marginHorizontal: 40,
        marginTop: 5,
      },
      createAccount: {
        fontSize: 14,
        fontFamily: 'karla',
        color: '#4C28BC',
        textAlign: 'center',
        marginHorizontal: 40,
        marginTop: 5,
      },
});

export default Login;