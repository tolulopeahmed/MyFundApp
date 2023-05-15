import React, { useState, useCallback } from 'react';
import { Modal, Text, Animated, View, TextInput, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Divider from '../components/Divider'
import { Ionicons } from '@expo/vector-icons';

const QuickSaveModal = ({ navigation, quickSaveModalVisible, setQuickSaveModalVisible }) => {
  const [frequency, setFrequency] = useState('');
  const [paymentOption, setPaymentOption] = useState('');
  const [amount, setAmount] = useState('');

  const handleAmountChange = (value) => {
    setAmount(value);
  }

  const handleBackButtonPress = useCallback(() => {
    setQuickSaveModalVisible(false);
  }, [setQuickSaveModalVisible]);


  return (
    <>
    <Modal
      animationType="slide"
      transparent={true}
      visible={quickSaveModalVisible}
      onRequestClose={() => setQuickSaveModalVisible(false)}
      >
      <View style={styles.modalContainer}>

      

        <View style={styles.modalContent}>
         <View style={{flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center',  paddingLeft: 30,}}>
             <Text style={styles.modalHeader} >QuickSave</Text>
             <Ionicons name="close-outline" size={24} color="grey" marginTop={22} paddingRight={25} onPress={() => setQuickSaveModalVisible(false)}/>
         </View>
          <Divider />
          <Text style={styles.modalSubText}>
          QuickSave by moving funds from your local bank acount into your Savings Account with a few taps.  {'\n'}
            {'\n'}QuickSave...
          </Text>
        
          <TextInput
        style={styles.amountInput}
        placeholder="Amount (e.g. 20000)"
        keyboardType="numeric"
        onChangeText={(value) => handleAmountChange(value)}
      />
          <Text style={styles.modalSubText2} alignSelf='flex-start'>using...</Text>

          <View style={styles.inputContainer}>
            <View style={styles.dropdown}>
              <Picker
                style={styles.labelItem}
                selectedValue={frequency}
                onValueChange={(value) => setFrequency(value)}
              >
                <Picker.Item color='silver' label="Select source of funding" value="Select destination account" />
                <Picker.Item label="My Saved Cards" value="My Saved Cards" />
                <Picker.Item label="Add New Card" value="Add New Card" />
                <Picker.Item label="Bank Transfer" value="Bank Transfer" />
              </Picker>
            </View>
          </View>

          {frequency === 'My Saved Cards' && (
            <>
              <View style={styles.paymentOptionsContainer}>
                <Text style={styles.label}>Which of them?     </Text>
                <Picker
                  style={styles.labelItem2}
                  selectedValue={paymentOption}
                  onValueChange={(value) => setPaymentOption(value)}
                >
                  <Picker.Item color='silver' label="My Saved Cards" value="My Saved Cards"/>
                  <Picker.Item label="Mastercard 3591" value="Mastercard 3591" />
                </Picker>
      
              </View>
            </>
          )}

{frequency === "Another user's wallet" && (
  <>
    <View style={styles.paymentOptionsContainer}>
      <Text style={styles.label}>Enter user's email</Text>
      <TextInput
        style={styles.emailInput}
        placeholder="Enter the correct user's email"
        onChangeText={(value) => setEmail(value)}
      />
    </View>
  </>
)}


            <View style={styles.buttonsContainer}>
                <TouchableOpacity style={styles.primaryButton}>
                  <Text style={styles.primaryButtonText}>Continue</Text>
                </TouchableOpacity>

            

                <TouchableOpacity style={styles.secondaryButton} onPress={handleBackButtonPress}>
                  <Text style={styles.secondaryButtonText}>Back</Text>
                </TouchableOpacity>
              </View>
        </View>
      </View>

    </Modal>

    
    </>
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
    flex: 0.65,
    alignItems: 'center',
    borderTopRightRadius: 25,
    borderTopLeftRadius: 25,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,      
  },

  modalHeader: {
    marginTop: 20,
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
    marginHorizontal: 30,
    marginTop: 5,
  },
   
  modalSubText2: {
    fontSize: 14,
    fontFamily: 'karla',
    textAlign: 'center',
    color: 'black',
    textAlign: 'left',
    marginHorizontal: 45,
    marginTop: 5,
  },

  inputContainer: {
    marginTop: 5,
    marginBottom: 15,
    width: '100%',
    alignItems: 'center',
  },

  autoSaveSetting: {
    fontSize: 17,
    fontFamily: 'proxima',
    marginLeft: 40,
    alignSelf: 'flex-start',
    marginBottom: 10,

  },

  paymentOptionsContainer:{
    marginTop: -20,
  },

  label: {
    fontSize: 17,
    fontFamily: 'proxima',
    marginRight: 190,
    marginTop: 20,
    marginBottom: 10,
  },

  labelItem: {
    color: 'grey',
    textAlign: 'left',
    marginLeft: -16,
    marginBottom: 30,
    fontFamily: 'karla',
    backgroundColor: '#fff',
    borderRadius: 10,
  },

  labelItem2: {
    color: 'grey',
    textAlign: 'left',
    marginLeft: -5,
    marginBottom: 10,
    fontFamily: 'karla',
    backgroundColor: '#fff',
    borderRadius: 10,

  },

  emailInput: {
    color: 'grey',
    textAlign: 'left',
    marginLeft: -5,
    marginBottom: 30,
    fontFamily: 'karla',
    backgroundColor: '#fff',
    borderRadius: 10,
    height: 45,
    padding: 10,
    borderRadius: 10,
  },

  amountInput: {
    color: 'black',
    textAlign: 'left',
    marginLeft: -5,
    fontFamily: 'karla',
    backgroundColor: '#fff',
    borderRadius: 10,
    height: 50,
    width: "80%",
    padding: 10,
    marginTop: 5,
    borderRadius: 10,
    fontSize: 16,
    letterSpacing: -0.3,
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
    marginTop: 415,
    position: 'absolute',

  },

  primaryButton: {
    marginTop: 5,
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
    marginTop: 5,
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

export default QuickSaveModal;
