import React, { useState } from 'react';
import { Modal, Text, animation, StyleSheet, View, TextInput, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Divider from '../components/Divider'

const AutoSaveModal = ({ autoSaveModalVisible, setAutoSave, setAutoSaveModalVisible}) => {
  const [amount, setAmount] = useState('');
  const [frequency, setFrequency] = useState('');
  const [paymentOption, setPaymentOption] = useState('');

  
  const closeModal = () => {
    setAutoSaveModalVisible(false);
  };
  
  const handleConfirmAutoSave = () => {
    setAutoSave(true);
    setAutoSaveModalVisible(false);
  };
  
  
 



  return (
    <Modal
    animationType="slide"
    transparent={true}
    visible={autoSaveModalVisible}
    onRequestClose={() => setAutoSaveModalVisible(false)}
    >
<TouchableOpacity
  style={styles.modalContainer}
  activeOpacity={1}
  onPress={closeModal}
  
>
  <TouchableOpacity
    activeOpacity={1}
    style={styles.modalContent}
    onPress={() => {}}
  >       

        <View style={styles.modalContent}>
         <View style={{flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center',  paddingLeft: 30,}}>
             <Text style={styles.modalHeader} >Activate AutoSave</Text>
             <Ionicons name="close-outline" size={24} color="grey" marginTop={22} paddingRight={25} onPress={() => setAutoSaveModalVisible(false)}/>
         </View>
          <Divider />
          <Text style={styles.modalSubText}>
          AutoSave allows you to set an amount to automatically debit your local bank account to credit your MyFund Savings account.
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
          <TouchableOpacity style={styles.primaryButton} onPress={handleConfirmAutoSave}>
    <Text style={styles.primaryButtonText}>Activate Now</Text>
  </TouchableOpacity>

          
          </View>
        </View>
        </TouchableOpacity>
        </TouchableOpacity>
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
    flex: 1,
  },
  modalSubText: {
    fontSize: 14,
    fontFamily: 'karla',
    color: 'black',
    textAlign: 'left',
    marginHorizontal: 40,
    marginTop: 1,
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
    marginTop: 10,
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
  },



};

export default AutoSaveModal;
