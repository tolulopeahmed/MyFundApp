import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Divider from '../components/Divider';
import { useSelector } from 'react-redux';

const PinModal = ({ pinModalVisible, setPinModalVisible, onPinSubmit }) => {
  const [pin, setPin] = useState(['', '', '', '']);
  const [isConfirmMode, setIsConfirmMode] = useState(false); // Track if user is in confirmation mode
  const userInfo = useSelector((state) => state.bank.userInfo);

  useEffect(() => {
    // Check if all digits are entered and toggle confirmation mode
    const isAllDigitsEntered = pin.every((digit) => digit !== '');
    setIsConfirmMode(isAllDigitsEntered);
  }, [pin]);

  const closeModal = () => {
    setPinModalVisible(false);
    setPin(['', '', '', '']);
  };

  const handlePinSubmit = () => {
    const enteredPin = pin.join('');
    if (enteredPin.length === 4) {
      onPinSubmit(enteredPin);
      closeModal();
    }
  };

  const handleNumberPress = (number) => {
    if (isConfirmMode) {
      // Clear the PIN and reset to enter a new one when confirming
      setPin(['', '', '', '']);
      setIsConfirmMode(false);
    }

    const newPin = [...pin];
    for (let i = 0; i < 4; i++) {
      if (newPin[i] === '') {
        newPin[i] = number;
        break;
      }
    }
    setPin(newPin);
  };

  const handleBackspacePress = () => {
    if (isConfirmMode) {
      // If in confirmation mode, clear the PIN and exit confirmation mode
      setPin(['', '', '', '']);
      setIsConfirmMode(false);
      return;
    }

    const newPin = [...pin];
    for (let i = 3; i >= 0; i--) {
      if (newPin[i] !== '') {
        newPin[i] = '';
        break;
      }
    }
    setPin(newPin);
  };

  const modalHeaderText = isConfirmMode ? 'Confirm Your PIN' : 'Enter Your PIN';
  const modalBodyText = isConfirmMode
    ? 'Re-enter the PIN again to confirm.'
    : 'Enter your PIN for faster and more secure access while using MyFund.';

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={pinModalVisible}
      onRequestClose={closeModal}
    >
      <View style={styles.modalContainer}>
        <TouchableOpacity
          style={styles.modalContent}
          activeOpacity={1}
          onPress={closeModal}
        >
          <View style={styles.modalHeader}>
            <Text style={styles.modalHeaderText}>{modalHeaderText}</Text>
            <Ionicons
              name="close-outline"
              size={24}
              color="#4C28BC"
              onPress={closeModal}
              style={styles.closeIcon}
            />
          </View>
          <Divider />

          <Text style={styles.modalBodyText}>{userInfo?.firstName ? `${userInfo.firstName},` : ''}</Text>
          <Text style={styles.modalBodyText}>{modalBodyText}</Text>
          <View style={styles.pinContainer}>
            {pin.map((digit, index) => (
              <View key={index} style={styles.pinInput}>
                {digit && <Text style={styles.pinText}>{digit}</Text>}
              </View>
            ))}
          </View>
          <View style={styles.keyboardContainer}>
            <View style={styles.keyboardRow}>
              {[1, 2, 3].map((number) => (
                <TouchableOpacity
                  key={number}
                  style={styles.keyboardButton}
                  onPress={() => handleNumberPress(number)}
                >
                  <Text style={styles.keyboardButtonText}>{number}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={styles.keyboardRow}>
              {[4, 5, 6].map((number) => (
                <TouchableOpacity
                  key={number}
                  style={styles.keyboardButton}
                  onPress={() => handleNumberPress(number)}
                >
                  <Text style={styles.keyboardButtonText}>{number}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={styles.keyboardRow}>
              {[7, 8, 9].map((number) => (
                <TouchableOpacity
                  key={number}
                  style={styles.keyboardButton}
                  onPress={() => handleNumberPress(number)}
                >
                  <Text style={styles.keyboardButtonText}>{number}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={styles.keyboardRow}>
              <TouchableOpacity
                style={styles.keyboardButton}
                onPress={() => handleNumberPress(0)}
              >
                <Text style={styles.keyboardButtonText}>*</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.keyboardButton}
                onPress={() => handleNumberPress(0)}
              >
                <Text style={styles.keyboardButtonText}>0</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.keyboardButton}
                onPress={handleBackspacePress}
              >
                <Ionicons name="ios-backspace" size={28} color="brown" />
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};
const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  modalContent: {
    backgroundColor: '#F6F3FF',
    borderTopRightRadius: 25,
    borderTopLeftRadius: 25,
    paddingVertical: 20,
    paddingHorizontal: 30,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalHeaderText: {
    fontSize: 25,
    fontFamily: 'proxima',
    color: '#4C28BC',
  },
  closeIcon: {
    marginLeft: 10,
  },
  modalBodyText: {
    fontSize: 16,
    fontFamily: 'karla',
    color: 'black',
    marginBottom: 20,
  },
  
  
  pinContainer: {
    marginTop: 30,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    flexDirection: 'row',
  },

  pinInput: {
    fontSize: 30,
    height: 70,
    width: '22%',
    fontFamily: 'karla',
    backgroundColor: 'white',
    borderRadius: 9,
    marginBottom: 15,
    paddingLeft: 5,
    paddingRight: 5,
    marginHorizontal: 3,
    textAlign: 'center',
    alignContent: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0.5,
    borderColor: 'gray',
  },

  

  pinText: {
    fontSize: 30,
    fontFamily: 'karla',
    color: 'black',
  },
  keyboardContainer: {
    alignItems: 'center',
    marginBottom: 50,
  },
  keyboardRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10,
  },
  keyboardButton: {
    backgroundColor: '#fff',
    borderRadius: 5,
    width: 80,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
    borderColor: 'silver',
    borderWidth: 0.8,
  },
  keyboardButtonText: {
    color: 'grey',
    fontSize: 24,
    fontFamily: 'nexa'
  },
  
});

export default PinModal;
