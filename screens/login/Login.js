import React, { useRef, useState } from 'react';
import { View, Text, ScrollView, StyleSheet,Image,animation,TouchableOpacity,TextInput,Modal,Animated,} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import logo from './logo..png';

const Login = ({ navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [showPassword, setShowPassword] = useState(false); // Added toggle state


  const handleConfirm = () => {
    setModalVisible(true);
    setTimeout(() => {
      setModalVisible(false);
      navigation.navigate('DrawerTab', { firstName });
    }, 1000);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="#4C28BC" />
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.logoContainer}>
          <Image source={logo} style={styles.logo} />
        </View>
        <View style={styles.headerContainer}>
          <Text style={styles.header}>Welcome Back</Text>
          <Text style={styles.subText}>
            Have you earned your first rent yet? To do so, you need get your first property. That’s why you’re here.
            Jump right back in!
          </Text>
        </View>
        <View style={styles.inputContainer}>
          <TextInput style={styles.input} placeholder="Email or Phone Number" />
          
          <View style={styles.passwordInputContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Password"
              secureTextEntry={!showPassword}
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
         
          <TouchableOpacity style={styles.fingerprintContainer} onLongPress={handleConfirm}>
            <Image source={require('./fingerprint.png')} style={styles.image} />
            <Text style={styles.fingerprintText}>Press and Hold</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.loginButton} onPress={handleConfirm}>
            <Text style={styles.loginButtonText}>LOG IN</Text>
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
              <Text style={styles.modalSubText}>Welcome to MyFund{firstName}</Text>
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
  fingerprintContainer: {},
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
