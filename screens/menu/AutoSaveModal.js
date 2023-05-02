import React, { useState } from 'react';
import { Modal, Text, animation, StyleSheet, View, TextInput, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import ConfirmationModal from './ConfirmationModal'

const AutoSaveModal = ({ modalVisible, setModalVisible }) => {
  const [amount, setAmount] = useState('');
  const [frequency, setFrequency] = useState('');
  const [paymentOption, setPaymentOption] = useState('');
  

  const handleActivate = () => {
    setModalVisible(true);
    Animated.timing(animation, {
      toValue: 1,
      duration: 1500,
      useNativeDriver: true,
    }).start(() => {
      setModalVisible(false);
      navigation.navigate('Save');
      setAnimation(new Animated.Value(0));
    });
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}
    >
      <View style={styles.modalContainer} onPress={() => setModalVisible(false)}>
        <View style={styles.modalContent}>
          <Text style={styles.modalHeader}>Activate AutoSave</Text>
          <Text style={styles.modalSubText}>
            Autosave allows you to set an amount to automatically debit from your local bank account
            to your MyFund account.
          </Text>
          <View style={styles.inputContainer}>
          <Text style={styles.autoSaveSetting}>AutoSave Settings</Text>

            <TextInput
              style={styles.input}
              value={amount}
              onChangeText={setAmount}
              keyboardType="numeric"
              placeholder="Enter The Amount to AutoSave"
            />
          </View>
          
          <View style={styles.inputContainer}>
      <View style={styles.dropdown}>
        <Picker
          style={styles.labelItem}
          selectedValue={frequency}
          onValueChange={(value) => setFrequency(value)}
        >
          <Picker.Item color='silver' label="Set The Frequency" value="Frequency" />
          <Picker.Item label="Hourly" value="hourly" />
          <Picker.Item label="Daily" value="daily" />
          <Picker.Item label="Weekly" value="weekly" />
          <Picker.Item label="Monthly" value="monthly" />
        </Picker>
      </View>
    </View>


          <View style={styles.paymentOptionsContainer}>
            <Text style={styles.label}>Payment Options</Text>
            
            <Picker
          style={styles.labelItem}
          selectedValue={paymentOption}
          onValueChange={(value) => setPaymentOption(value)}
        >
          <Picker.Item color='silver' label="Select Source of Funding" value="Frequency" />
          <Picker.Item label="Pay with saved card" value="Pay with card" />
          <Picker.Item label="Add new card" value="Add new card" />
          <Picker.Item label="Pay with bank transfer" value="Pay with bank transfer" />
        </Picker>
            
            </View>
          <View style={styles.buttonsContainer}>
  <TouchableOpacity style={styles.primaryButton} onPress={() => setModalVisible(false)}>
    <Text style={styles.primaryButtonText}>Activate Now</Text>
  </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => setModalVisible(false)}
          >
            <Text style={styles.secondaryButtonText}>Back</Text>
          </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = {
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  modalContent: {
    backgroundColor: '#F6F3FF',
    width: '100%',
    height: '75%',
    alignItems: 'center',
    borderTopRightRadius: 25,
    borderTopLeftRadius: 25,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,      
  },

  modalHeader: {
    marginTop: 30,
    alignItems: 'flex-start',
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
    paddingLeft: 15,
    paddingRight: 5,
    fontFamily: 'karla',
    letterSpacing: -0.5,
  },

  inputContainer: {
    marginTop: 20,
    width: '100%',
    alignItems: 'center',
  },

  autoSaveSetting: {
    fontSize: 17,
    fontFamily: 'proxima',
    marginRight: 190,
    marginBottom: 10,
  },

  label: {
    fontSize: 17,
    fontFamily: 'proxima',
    marginRight: 190,
    marginTop: 20,
  },

  labelItem: {
    color: 'grey',
    textAlign: 'left',
    marginLeft: -16,
    marginBottom: 30,
    backgroundColor: '#fff',
  },

  dropdown: {
    height: 45,
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    marginBottom: 15,
    paddingLeft: 15,
    paddingRight: 5,

  },


  buttonsContainer: {
    flexDirection: 'row',
  },

  primaryButton: {
    marginTop: 30,
    flexDirection: 'row',
    backgroundColor: '#4C28BC',
    width: 160,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    marginBottom: 5,
  
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'ProductSans',
  },

  secondaryButton: {
    marginTop: 30,
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderColor: '#4C28BC',
    borderWidth: 1,
    width: 90,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    marginBottom: 5,
    marginLeft: 20,

  
  },
  secondaryButtonText: {
    color: '#4C28BC',
    fontSize: 18,
    fontFamily: 'ProductSans',
  },


};

export default AutoSaveModal;
