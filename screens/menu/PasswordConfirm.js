import React, { useState } from 'react';
import { View, Text, ScrollView, Alert, StyleSheet, Image, TouchableOpacity, TextInput, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Divider from '../components/Divider';
import axios from 'axios';
import { ipAddress } from '../../constants';
import LoadingModal from '../components/LoadingModal';
import { useTheme } from '../../ThemeContext';

const PasswordConfirm = ({ navigation, route }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isPasswordVisible, setPasswordVisibility] = useState(false);
  const [isConfirmPasswordVisible, setConfirmPasswordVisibility] = useState(false);
  const [isConfirmButtonDisabled, setIsConfirmButtonDisabled] = useState(true);
  const [isConfirming, setIsConfirming] = useState(false);

  
  const { isDarkMode, colors } = useTheme(null);
  const styles = createStyles(isDarkMode);

  const handleOtpChange = (text) => {
    setOtp(text);
    validateForm();
  };

  const handlePasswordChange = (text) => {
    setPassword(text);
    validateForm();
  };

  const handleConfirmPasswordChange = (text) => {
    setConfirmPassword(text);
    validateForm();
  };

  const togglePasswordVisibility = (field) => {
    if (field === 'password') {
      setPasswordVisibility(!isPasswordVisible);
    } else if (field === 'confirmPassword') {
      setConfirmPasswordVisibility(!isConfirmPasswordVisible);
    }
  };

  const validateForm = () => {
    setIsConfirmButtonDisabled(
      otp.length !== 6 || password.length < 8 || password == confirmPassword
    );
  };

  const handleConfirmPasswordReset = async () => {
    try {
      setIsConfirming(true);
  
      const response = await axios.post(`${ipAddress}/api/reset-password/?token=${route.params.token}`, {
        email: route.params.email,
        otp: otp,
        password: password,
        confirm_password: confirmPassword,
      });
  
      if (response.status === 200) {
        setModalVisible(true);
      } else {
        Alert.alert('Error', 'Password reset failed. Please make sure the OTP is correct and try again.');
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred while resetting the password. Please try again later.');
    } finally {
      setIsConfirming(false);
    }
  };

  return (
    <>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="#4C28BC" />
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.logoContainer}>
        <Image
        source={isDarkMode ? require('../images/icon.png') : require('../images/logo..png')}
        style={styles.logo}
      />
              </View>
        <View style={styles.headerContainer}>
          <Text style={styles.header}>Confirm Password Reset</Text>
          <Text style={styles.subText}>
            Enter the OTP we just sent to your email alongside your new password to complete the password reset process.
          </Text>
        </View>

        <View style={styles.inputContainer}>
          <View style={styles.fieldContainer2}>
            <View style={styles.iconContainer}>
              <Ionicons name="eye-off-outline" size={20} color="green" zIndex={-1} marginTop={-3} />
            </View>
            <View style={styles.passwordInputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Enter OTP"
                placeholderTextColor="grey" 
                value={otp}
                onChangeText={handleOtpChange}
              />
            </View>
          </View>

          <View style={styles.fieldContainer2}>
            <View style={styles.iconContainer}>
              <Ionicons name="lock-closed-outline" size={20} color="green" zIndex={-1} marginTop={-3} />
            </View>
            <View style={styles.passwordInputContainer}>
              <TextInput
                style={styles.input}
                placeholder="New Password"
                placeholderTextColor="grey" 
                value={password}
                onChangeText={handlePasswordChange}
                secureTextEntry={!isPasswordVisible}
              />
              <TouchableOpacity style={styles.passwordToggle} onPress={() => togglePasswordVisibility('password')}>
                <Ionicons
                  name={isPasswordVisible ? 'eye' : 'eye-off'}
                  size={20}
                  color="grey"
                />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.fieldContainer2}>
            <View style={styles.iconContainer}>
              <Ionicons name="lock-closed-outline" size={20} color="green" zIndex={-1} marginTop={-3} />
            </View>
            <View style={styles.passwordInputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Confirm New Password"
                placeholderTextColor="grey" 
                value={confirmPassword}
                onChangeText={handleConfirmPasswordChange}
                secureTextEntry={!isConfirmPasswordVisible}
              />
              <TouchableOpacity style={styles.passwordToggle} onPress={() => togglePasswordVisibility('confirmPassword')}>
                <Ionicons
                  name={isConfirmPasswordVisible ? 'eye' : 'eye-off'}
                  size={20}
                  color="grey"
                />
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            style={[
              styles.confirmButton,
              isConfirmButtonDisabled && styles.disabledButton,
              isConfirming && styles.confirmingButton,
            ]}
            onPress={handleConfirmPasswordReset}
            disabled={isConfirmButtonDisabled || isConfirming}
          >
            <Text style={styles.confirmButtonText}>
              {isConfirming ? 'Confirming Password Reset...' : 'CONFIRM'}
            </Text>
          </TouchableOpacity>
        </View>
        
        <LoadingModal visible={isConfirming} />

        <Divider />

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalHeader}>Password Reset Successful!</Text>
              <Text style={styles.modalSubText}>
                Click OK to log in to your account with your new password.
              </Text>
              <Ionicons name="checkmark-circle-outline" size={170} color="green" marginBottom={20} marginTop={20} />
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



const createStyles = (isDarkMode) => {
  return StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: isDarkMode ? '#140A32' : '#DCD1FF',
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
  headerContainer: {
    marginTop: 20,
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
    marginTop: 5,
  },


  inputContainer: {
    marginTop: 25,
    width: '90%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  fieldContainer2: {
    alignSelf: 'center',
    alignItems: 'center',
    alignContents: 'center',
    width: '85%',
  },
  

  inputContainer: {
    marginTop: 25,
    width: '95%',
    alignItems: 'center',
    justifyContent: 'center',
  },


  input: {
    fontSize: 17,
    height: 45,
    width: '100%',
    backgroundColor: isDarkMode ? '#313151' : '#F5F5F5',
    borderRadius: 10,
    marginBottom: 15,
    paddingLeft: 40,
    paddingRight: 5,
    borderWidth: 1,
    borderColor: 'green',
    color: isDarkMode ? 'silver' : 'black',

  },
  passwordInputContainer: {
    position: 'relative',
    flexDirection: 'row',
    alignSelf: 'center',
    alignItems: 'center',
    alignContents: 'center',
    width: '95%',
  },

  invalidInput: {
    borderColor: 'red',
  },

  iconContainer: {
    position: 'absolute', // Use absolute positioning
    left: 10, // Adjust the left position as needed
    top: '63%', 
    marginLeft: 10,
    marginTop: -11,
    zIndex: 1,
    transform: [{ translateY: -12 }], 
  },


  passwordInput: {
    flex: 1,
    fontSize: 17,
    height: 45,
    backgroundColor: 'white',
    borderRadius: 10,
    marginBottom: 5,
    paddingLeft: 15,
    paddingRight: 40,
    borderWidth: 1,
    borderColor: 'green',
    paddingLeft: 40,
  
  },
  passwordToggle: {
    position: 'absolute',
    right: 12,
    top: 12,
  },




  confirmButton: {
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
  confirmingButton: {
    backgroundColor: 'green', // Change to the desired color
  },

  confirmButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'proxima',
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
    marginLeft: 15,
  },
  buttonsContainer: {
    flexDirection: 'row',
    marginTop: 15,
    position: 'relative',
    marginBottom: 35,
    alignSelf: 'center',
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
}
export default PasswordConfirm;
