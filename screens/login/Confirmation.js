import React, { useRef, useState} from 'react';
import { View, Text, animation, StyleSheet, Image, TouchableOpacity, TextInput, Modal, Animated, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import MyFundLogo from './logo..png';
import axios from 'axios';
import { ipAddress } from '../../constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoadingModal from '../components/LoadingModal';
import { CommonActions } from '@react-navigation/native';
import { loadBankAccounts, setUserToken, fetchUserCards } from '../../ReduxActions';
import { useDispatch } from 'react-redux';
import { useTheme } from '../../ThemeContext';

  const Confirmation = ({ navigation, route }) => {
    const [error, setError] = useState(""); // Declare the error state
    const inputRefs = useRef([]);
    const { email, password } = route.params;

    const { isDarkMode, colors } = useTheme();
    const styles = createStyles(isDarkMode);

  const [modalVisible, setModalVisible] = useState(false);
  const [otpValues, setOtpValues] = useState(['', '', '', '', '', '']);
  const [isConfirmButtonEnabled, setIsConfirmButtonEnabled] = useState(false);
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);
  const dispatch = useDispatch();

  const focusNext = (index) => {
    if (inputRefs.current[index]) {
      inputRefs.current[index].focus();
    }
  };

    
  const handleOtpChange = (text, index) => {
    const newOtpValues = [...otpValues];
    newOtpValues[index] = text;
    setOtpValues(newOtpValues);
  
    if (text === '') {
      // User deleted a digit, focus the previous input
      if (index > 0) {
        focusNext(index - 1);
      }
    } else {
      // User entered a digit
      if (index < 5) {
        // Focus the next input if not at the last digit
        focusNext(index + 1);
      } else if (index === 5) {
        // Focus out of the input field to trigger handleConfirm
        inputRefs.current[index].blur();
      }
    }
  
    // Check if all OTP digits are entered and enable/disable the button
    const allDigitsEntered = newOtpValues.every(value => value !== '');
    setIsConfirmButtonEnabled(allDigitsEntered);
  };
  
  const [isCodeResent, setIsCodeResent] = useState(false);

  const handleResendCode = async () => {
    if (!isCodeResent) {
      setIsCodeResent(true);
  
      try {
        const response = await axios.post(`${ipAddress}/api/signup/`, {
          email: email,
          resend: true,  // Set the resend flag
        });
  
        // Handle the response as needed...
        // For example, show a success message
        Alert.alert('Success', 'OTP resent successfully');
  
      } catch (error) {
        // Handle errors...
        // For example, show an error message
        Alert.alert('Error', 'Failed to resend OTP. Please try again.');
      }
    } else {
      // Code has already been resent
      Alert.alert('Check Your Email', 'Code has already been sent. Please check your email again. Try checking your Trash or Spam folders as well.');
    }
  };
  





  const handleConfirm = async (email) => {
    setIsCreatingAccount(true);

    const otpCode = otpValues.reduce((accumulator, value) => accumulator + value, '');
    console.log('Sending OTP:', otpCode);
  
    try {
        const response = await axios.post(`${ipAddress}/api/confirm-otp/`, {
            otp: otpCode,
        });

        console.log('API Response:', response.data);

        if (response.status === 200) {
            setIsCreatingAccount(false);

            if (response.data && response.data.message === 'Account confirmed successfully.') {
                console.log('OTP Verification Successful');

                try {
                    const loginResponse = await axios.post(`${ipAddress}/api/login/`, {
                        username: email,
                        password: password, // If needed
                    });

                    console.log('Login Response:', loginResponse.data);

                    if (loginResponse.status === 200) {
                        setIsCreatingAccount(false);
                        const { access, refresh, user_id } = loginResponse.data;

                        if (access && refresh) {
                          
                            dispatch(loadBankAccounts());
                            dispatch(setUserToken(access));
                            dispatch(fetchUserCards());

                            await AsyncStorage.setItem('authToken', access);
                            await AsyncStorage.setItem('userId', user_id.toString());

                            console.log('Login Successful');
                            setModalVisible(true);
                            setTimeout(() => {
                                setModalVisible(false);
                                navigation.dispatch(
                                  CommonActions.reset({
                                    index: 0,
                                    routes: [{ name: 'DrawerTab' }],
                                  })
                                );
                              }, 1500);
                        } else {
                            setIsCreatingAccount(false);
                            console.log('Tokens missing in response:', loginResponse.data);
                        }
                    } else {
                        setIsCreatingAccount(false);
                        console.log('Login API Error:', loginResponse.data);
                        setError("An error occurred while logging in. Please try again later.");
                    }
                } catch (loginError) {
                    setIsCreatingAccount(false);
                    console.error('Login API Error:', loginError);
                    setError("An error occurred while logging in. Please try again later.");
                }
            } else {
                setIsCreatingAccount(false);
                console.log('OTP Verification Failed');
                setError("Wrong OTP entered. Please check and try again.");
            }
        } else {
            setIsCreatingAccount(false);
            console.log('API Error:', response.data);
            setError("An error occurred. Please try again later.");
        }
    } catch (error) {
        setIsCreatingAccount(false);
        if (error.response && error.response.status === 400) {
            console.error('OTP Verification Failed');
            setError("Wrong OTP entered. Please check and try again.");
        } else {
            setIsCreatingAccount(false);
            console.error('API Error:', error);
            setError("An error occurred. Please try again later.");
        }
    }
};

  
  
console.log('username:', email);
console.log('password:', password);

    
    
    
      

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color={isDarkMode ? '#6E3DFF' : '#4C28BC'}/>
      </TouchableOpacity>
      <View style={styles.logoContainer}>
        <Image
        source={isDarkMode ? require('../images/icon.png') : require('../images/logo..png')}
        style={styles.logo}
      />     
       </View>
      <View style={styles.textContainer}>
        <Text style={styles.header}>Enter Confirmation Code</Text>
        <Text style={styles.subText}>Use the code we just sent to your email to complete your signup</Text>
      </View>
      <View style={styles.inputContainer}>

      <TextInput
  style={styles.input}
  placeholder="_"
  keyboardType="numeric"
  maxLength={1}
  value={otpValues[0]}
  onChangeText={(text) => handleOtpChange(text, 0)}
  ref={input => inputRefs.current[0] = input}
  onSubmitEditing={() => focusNext(1)}
/>
<TextInput
  style={styles.input}
  placeholder="_"
  keyboardType="numeric"
  maxLength={1}
  value={otpValues[1]}
  onChangeText={(text) => handleOtpChange(text, 1)}
  ref={input => inputRefs.current[1] = input}
  onSubmitEditing={() => focusNext(2)}
/>
<TextInput
  style={styles.input}
  placeholder="_"
  keyboardType="numeric"
  maxLength={1}
  value={otpValues[2]}
  onChangeText={(text) => handleOtpChange(text, 2)}
  ref={input => inputRefs.current[2] = input}
  onSubmitEditing={() => focusNext(3)}
/>
<TextInput
  style={styles.input}
  placeholder="_"
  keyboardType="numeric"
  maxLength={1}
  value={otpValues[3]}
  onChangeText={(text) => handleOtpChange(text, 3)}
  ref={input => inputRefs.current[3] = input}
  onSubmitEditing={() => focusNext(4)}
/>
<TextInput
  style={styles.input}
  placeholder="_"
  keyboardType="numeric"
  maxLength={1}
  value={otpValues[4]}
  onChangeText={(text) => handleOtpChange(text, 4)}
  ref={input => inputRefs.current[4] = input}
  onSubmitEditing={() => focusNext(5)}
/>
<TextInput
  style={styles.input}
  placeholder="_"
  keyboardType="numeric"
  maxLength={1}
  value={otpValues[5]}
  onChangeText={(text) => handleOtpChange(text, 5)}
  ref={input => inputRefs.current[5] = input}
  onSubmitEditing={handleConfirm}  // No need to focusNext here
/>




      </View>
      {error !== "" && <Text style={styles.errorText}>{error}</Text>}

      <TouchableOpacity
        style={[styles.confirmCodeButton, !isConfirmButtonEnabled && styles.disabledConfirmCodeButton]}
        onPress={() => handleConfirm(email)}
        disabled={!isConfirmButtonEnabled}
      >
        <Text style={styles.confirmCodeButtonText}>CONFIRM CODE</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.resendTextContainer} onPress={handleResendCode}>
        <Text style={styles.resendText}>Didn't receive a code? <Text style={styles.resendLinkText}>Resend</Text></Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer} onPress={() => setModalVisible(false)} >
          <View style={styles.modalContent}>
          <Text style={styles.modalHeader}>We've confirmed it's you!</Text>
            <Text style={styles.modalSubText}>Welcome to MyFund</Text>
          <Animated.View style={[styles.checkmarkContainer, { opacity: animation }]}>
            <Ionicons name="checkmark-circle-outline" size={170} color="green" marginBottom={60} marginTop={20}/>
          </Animated.View>          
          </View>
        </View>
      </Modal>

<LoadingModal visible={isCreatingAccount} />
    </View>
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

  errorText: {
    fontSize: 14,
    fontFamily: 'karla',
    color: 'brown',
    textAlign: 'center',
    marginHorizontal: 40,
    marginTop: 10,
  },

  inputContainer: {
    marginTop: 30,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    marginBottom: 1,
  },
  input: {
    fontSize: 30,
    height: 50,
    width: '13%',
    fontFamily: 'karla',
    backgroundColor: isDarkMode ? '#313151' : '#F5F5F5',
    borderRadius: 5,
    marginBottom: 15,
    paddingLeft: 5,
    paddingRight: 5,
    marginHorizontal: 3,
    textAlign: 'center',
    alignContent: 'center',
    alignSelf: 'center',
    alignItems: 'center',
    color: isDarkMode ? 'white' : 'black',
  },

  disabledConfirmCodeButton: {
    backgroundColor: 'grey',
  },

  confirmCodeButton: {
    backgroundColor: '#4C28BC',
    width: '80%',
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
    marginBottom: 4,
    marginTop: 70,
  },
  confirmCodeButtonText:{
        color: '#fff',
        fontSize: 16,
        fontFamily: 'proxima',
      },
      resendTextContainer: {
        fontSize: 16,
        fontFamily: 'karla',
        color: 'black',
        textAlign: 'center',
        marginHorizontal: 40,
      },
      resendText: {
        fontSize: 14,
        fontFamily: 'karla',
        color: isDarkMode ? 'silver' : 'white',
        textAlign: 'center',
        marginHorizontal: 40,
        marginTop: 5,
      },
      resendLinkText: {
        fontSize: 14,
        fontFamily: 'karla',
        color: isDarkMode ? '#6E3DFF' : '#4C28BC',
        textAlign: 'center',
        marginHorizontal: 40,
        marginTop: 5,
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
        marginHorizontal: 40,
        marginTop: 10,
      },

    });
  }
    export default Confirmation;
    
