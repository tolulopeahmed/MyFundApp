import React, { useRef, useState} from 'react';
import { View, Text, animation, StyleSheet, Image, TouchableOpacity, TextInput, Modal, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import MyFundLogo from './logo..png';
import SavingsGoalModal from '../menu/SavingsGoalModal';

  const Confirmation = ({ navigation }) => {
    const input1 = useRef(null);
    const input2 = useRef(null);
    const input3 = useRef(null);
    const input4 = useRef(null);
    const input5 = useRef(null);
    const input6 = useRef(null);

  const [modalVisible, setModalVisible] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [goalModalVisible, setGoalModalVisible] = useState(false); // define modalVisible state


    const focusNext = (next) => {
        next.current.focus();
      }
    
      const clearAndSelectAll = (ref) => {
        if (ref && ref.current) {
          ref.current.clear();
          ref.current.focus();
        }
      };
      
      const submitForm = () => {
        setModalVisible (true);
        setTimeout(() => {
          setModalVisible(false);
          navigation.navigate('DrawerTab', { firstName });
        }, 1500);
      };

      const handleConfirm = () => {
        setModalVisible (true);
        setTimeout(() => {
          setModalVisible(false);
          navigation.navigate('DrawerTab', { firstName });
        }, 1500);
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
        <TextInput style={styles.input} placeholder="_" keyboardType="numeric" maxLength={1} ref={input1} onFocus={() => clearAndSelectAll(input1)} onChangeText={() => focusNext(input2)}/>
        <TextInput style={styles.input} placeholder="_" keyboardType="numeric" maxLength={1} ref={input2} onFocus={() => clearAndSelectAll(input2)} onChangeText={() => focusNext(input3)}/>
        <TextInput style={styles.input} placeholder="_" keyboardType="numeric" maxLength={1} ref={input3} onFocus={() => clearAndSelectAll(input3)} onChangeText={() => focusNext(input4)}/>
        <TextInput style={styles.input} placeholder="_" keyboardType="numeric" maxLength={1} ref={input4} onFocus={() => clearAndSelectAll(input4)} onChangeText={() => focusNext(input5)}/>
        <TextInput style={styles.input} placeholder="_" keyboardType="numeric" maxLength={1} ref={input5} onFocus={() => clearAndSelectAll(input5)} onChangeText={() => focusNext(input6)}/>
        <TextInput style={styles.input} placeholder="_" keyboardType="numeric" maxLength={1} ref={input6} onFocus={() => clearAndSelectAll(input6)} onChangeText={submitForm}/>
      </View>
      <TouchableOpacity style={styles.confirmCodeButton} onPress={handleConfirm}>
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
            <Text style={styles.modalSubText}>Welcome to MyFund{firstName}</Text>
          <Animated.View style={[styles.checkmarkContainer, { opacity: animation }]}>
            <Ionicons name="checkmark-circle-outline" size={170} color="green" />
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
  inputContainer: {
    marginTop: 30,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    marginBottom: 100,
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
  confirmCodeButton: {
    backgroundColor: '#4C28BC',
    width: '80%',
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
    marginBottom: 4,
    marginTop: 10,
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
        height: '45%',
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
    
