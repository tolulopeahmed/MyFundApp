import React, { useRef, useState } from 'react';
import { View, Text, ScrollView, StyleSheet,Image,animation,TouchableOpacity,TextInput,Modal,Animated,} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import logo from '../login/logo..png';
import Divider from '../components/Divider';

const ForgotPassword = ({ navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);


  const handleConfirm = () => {
    setModalVisible(true);
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
          <Text style={styles.header}>Reset Password</Text>
          <Text style={styles.subText}>
          Enter the email address you use for MyFund, and we’ll help you create a new password.

          </Text>
        </View>
        <View style={styles.inputContainer}>
          <TextInput style={styles.input} placeholder="Enter Your Email Address" />
          <View style={styles.passwordInputContainer}>
           </View>

          <TouchableOpacity style={styles.loginButton} onPress={handleConfirm}>
            <Text style={styles.loginButtonText}>RESET</Text>
          </TouchableOpacity>
     
        </View>

   <Divider/>

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalHeader}>Password Reset</Text>
              <Text style={styles.modalSubText}>Click the reset link we just sent to your email address to create a new password. Afterwards, tap OK to login with your new password</Text>
              <Animated.View style={[styles.checkmarkContainer, { opacity: animation }]}>
              <Ionicons name="checkmark-circle-outline" size={170} color="green" marginBottom={20} marginTop={20}/>
              </Animated.View>

              <View style={styles.buttonsContainer}>
                <TouchableOpacity style={styles.primaryButton} onPress={() => navigation.navigate('Login')}>
                  <Text style={styles.primaryButtonText}>OK</Text>
                </TouchableOpacity>      
              </View>
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
    textAlign: 'right',
    marginLeft: 216,
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

  
  buttonsContainer: {
    flexDirection: 'row',
    marginTop: 15,
    position: 'relative',
    marginBottom: 35,
    alignSelf: 'center'
  },

  primaryButton: {
    flexDirection: 'row',
    backgroundColor: '#4C28BC',
    width: '85%',
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },

  primaryButtonText: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'ProductSans',
    marginRight: 5,
  },

});

export default ForgotPassword;
