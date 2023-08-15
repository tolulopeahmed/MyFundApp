import React, { useRef, useState} from 'react';
import { View, Text, animation, StyleSheet, Image, TouchableOpacity, TextInput, Modal, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import MyFundLogo from './logo..png';
import SavingsGoalModal from '../menu/SavingsGoalModal';
import axios from 'axios';
import { ipAddress } from '../../constants';


  const Confirmation = ({ navigation }) => {
    const [error, setError] = useState(""); // Declare the error state
    const inputRefs = useRef([]);


  const [modalVisible, setModalVisible] = useState(false);
  const [goalModalVisible, setGoalModalVisible] = useState(false); // define modalVisible state
  const [otpValues, setOtpValues] = useState(['', '', '', '', '', '']);
  const [isConfirmButtonEnabled, setIsConfirmButtonEnabled] = useState(false);

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
  
  
  
  
  
  
  
  
    
  

      
      
      
  const handleConfirm = async () => {
    const otpCode = otpValues.reduce((accumulator, value) => accumulator + value, '');
    console.log('Sending OTP:', otpCode);
  
    try {
      const response = await axios.post(`${ipAddress}/api/confirm-otp/`, {
        otp: otpCode,
      });
  
      console.log('API Response:', response.data);
  
      if (response.status === 200) {
        if (response.data && response.data.message === 'Account confirmed successfully.') {
          console.log('OTP Verification Successful');
          setModalVisible(true);
          setTimeout(() => {
            setModalVisible(false);
            navigation.navigate('DrawerTab');
          }, 1500);
        } else {
          console.log('OTP Verification Failed');
          setError("Wrong OTP entered. Please check and try again.");
        }
      } else {
        console.log('API Error:', response.data);
        setError("An error occurred. Please try again later.");
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        console.log('OTP Verification Failed');
        setError("Wrong OTP entered. Please check and try again.");
      } else {
        console.log('API Error:', error);
        setError("An error occurred. Please try again later.");
      }
    }
  };
  
      
      
    
    
    
      

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="#4C28BC" />
      </TouchableOpacity>
      <View style={styles.logoContainer}>
        <Image source={MyFundLogo} style={styles.logo} />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.header}>Enter Confirmation Code</Text>
        <Text style={styles.subText}>Use the code we just sent to your email/phone number to complete your signup</Text>
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
        onPress={handleConfirm}
        disabled={!isConfirmButtonEnabled}
      >
        <Text style={styles.confirmCodeButtonText}>CONFIRM CODE</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.resendTextContainer}>
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

      <SavingsGoalModal navigation={navigation} goalModalVisible={goalModalVisible} setGoalModalVisible={setGoalModalVisible} />

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
    backgroundColor: 'white',
    borderRadius: 5,
    marginBottom: 15,
    paddingLeft: 5,
    paddingRight: 5,
    marginHorizontal: 3,
    textAlign: 'center',
    alignContent: 'center',
    alignSelf: 'center',
    alignItems: 'center',
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
        color: 'black',
        textAlign: 'center',
        marginHorizontal: 40,
        marginTop: 5,
      },
      resendLinkText: {
        fontSize: 14,
        fontFamily: 'karla',
        color: '#4C28BC',
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
    
    export default Confirmation;
    
