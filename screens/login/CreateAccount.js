import React, { useState} from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Image, Dimensions, TouchableOpacity, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

const CreateAccount = ({ navigation }) => {
  const [isPasswordVisible, setPasswordVisible] = useState(false);

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
            <Text style={styles.subText}>Join thousands of landlords to learn how to become one yourself with MyFund.</Text>
          </View>
          <View style={styles.inputContainer}>
            <View style={styles.inputWrapper}>
              <Ionicons name='person-outline' marginBottom={8} size={20} color="grey" padding={8} />
              <TextInput style={styles.input} placeholder="First Name" />
            </View>
            <View style={styles.inputWrapper}>
              <Ionicons name='person-outline' marginBottom={8} size={20} color="grey" padding={8} />
              <TextInput style={styles.input} placeholder="Last Name" />
            </View>
            <View style={styles.inputWrapper}>
              <Ionicons name='at-outline' marginBottom={8} size={20} color="grey" padding={8} />
              <TextInput style={styles.input} placeholder="Email Address" keyboardType="email-address" />
            </View>
            <View style={styles.inputWrapper}>
              <Ionicons name='call-outline' marginBottom={8} size={20} color="grey" padding={8} />
              <TextInput style={styles.input} placeholder="Phone Number" keyboardType="phone-pad" />
            </View>
            <View style={styles.inputWrapper}>
              <TouchableOpacity style={styles.eyeIcon} onPress={togglePasswordVisibility}>
                <Ionicons name={isPasswordVisible ? 'eye' : 'eye-off'} size={20} color="grey" marginBottom={8} padding={8} />
              </TouchableOpacity>
              <TextInput
                style={styles.input}
                placeholder="Password"
                secureTextEntry={!isPasswordVisible}
                keyboardType="default"
              />
            </View>
            <View style={styles.inputWrapper}>
              <TouchableOpacity style={styles.eyeIcon} onPress={togglePasswordVisibility}>
                <Ionicons name={isPasswordVisible ? 'eye' : 'eye-off'} size={20} color="grey" marginBottom={8} padding={8} />
              </TouchableOpacity>
              <TextInput
                style={styles.input}
                placeholder="Confirm Password"
                secureTextEntry={!isPasswordVisible}
                keyboardType="default"
              />
            </View>
            <View style={styles.inputWrapper}>
              <Ionicons name='person-add-outline' marginBottom={9} size={20} color="grey" padding={8} />
              <TextInput style={styles.input} placeholder="Referral Phone/Username (optional)" keyboardType="phone-pad" />
            </View>
          </View>
          <TouchableOpacity style={styles.createAccountButton} onPress={() => navigation.navigate('Confirmation')}>
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
    zIndex: -1,
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
    height: 37,
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    marginBottom: 10,
    paddingLeft: 14,    
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
