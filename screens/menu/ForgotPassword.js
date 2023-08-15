import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet,Image,animation,TouchableOpacity,TextInput,Modal,Animated,} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import logo from '../login/logo..png';
import Divider from '../components/Divider';
import axios from 'axios';
import { ipAddress } from '../../constants';


const ForgotPassword = ({ navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [isResetButtonDisabled, setIsResetButtonDisabled] = useState(true);
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [animation] = useState(new Animated.Value(0)); // Initialize the animation variable
  const [isResetting, setIsResetting] = useState(false);


  const handleEmailChange = (text) => {
    setEmail(text);
    setIsResetButtonDisabled(!text.includes('@'));
  };


  const handleResetPassword = async () => {
    try {
      setIsResetting(true); // Start resetting
      
      const response = await axios.post(`${ipAddress}/api/request-password-reset/`, {
        email: email,
      });
  
      if (response.status === 200) {
        // Password reset request successful, show the modal
        setModalVisible(true);
      } else {
        // Handle error here if needed
      }
    } catch (error) {
      // Handle error here if needed
    } finally {
      setIsResetting(false); // Finish resetting
    }
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
            <TextInput
              style={styles.input}
              placeholder="Enter Your Email Address"
              value={email}
              onChangeText={handleEmailChange}
            />
          
            <View style={styles.passwordInputContainer}></View>

            <TouchableOpacity
                style={[styles.loginButton, isResetButtonDisabled && styles.disabledButton, isResetting && styles.resettingButton]}
                onPress={handleResetPassword}
                disabled={isResetButtonDisabled || isResetting}
              >
                <Text style={styles.loginButtonText}>
                  {isResetting ? "Resetting your password..." : "RESET"}
                </Text>
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
              <Text style={styles.modalHeader}>Password Reset Link Sent!</Text>
              <Text style={styles.modalSubText}>Click the reset link we just sent to your email address to create a new password. <Text style={{fontFamily: 'proxima'}}>Afterwards,</Text> return to this screen and tap OK to login with your new password</Text>
              <Ionicons name="sync-outline" size={170} color="#4C28BC" marginBottom={20} marginTop={20}/>

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
    marginBottom: 25,
    paddingLeft: 15,
    paddingRight: 5,
  },
  
  
  loginButton: {
    backgroundColor: '#4C28BC',
    width: '80%',
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
    marginBottom: 15,
    marginTop: 10,
  },
  disabledButton: {
    backgroundColor: 'grey',
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'proxima',
  },

  resettingButton: {
    backgroundColor: 'green', // Change to the desired color
  },
  

  errorMessage: {
    color: 'red',
    fontSize: 12,
    marginTop: 5,
    textAlign: 'center',
  },
  
 
  
  divider: {
    width: '90%',
    marginTop: 10,
    height: 1,
    backgroundColor: 'silver',
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
    marginRight: 15,
    marginLeft: 15
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
