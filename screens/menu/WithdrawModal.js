import React, { useState } from 'react';
import { Modal, Text, Animated, View, TextInput, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Divider from '../components/Divider'
import { Ionicons } from '@expo/vector-icons';
import SuccessModal from '../components/SuccessModal'


const WithdrawModal = ({ navigation, modalVisible, setModalVisible }) => {
  const [frequency, setFrequency] = useState('');
  const [paymentOption, setPaymentOption] = useState('');
  const [email, setEmail] = useState('');
  const [amount, setAmount] = useState('');
  const [successModalVisible, setSuccessModalVisible] = useState('');


  const handleAmountChange = (value) => {
    // Remove any non-numeric characters from the input
    const formattedValue = value.replace(/[^0-9]/g, '');
    setAmount(formattedValue);
  };

  const handleSuccessModalClose = () => {
    setSuccessModalVisible(false);
  };
  

  const handleWithdrawNow = () => {
    setModalVisible(false); // hide the withdraw modal
    setTimeout(() => {
      setSuccessModalVisible(true);
    }, 1500);
  };


  return (
    <>
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}
    >
      <View style={styles.modalContainer}>

      

        <View style={styles.modalContent}>
         <View style={{flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center',  paddingLeft: 30,}}>
             <Text style={styles.modalHeader} >Withdraw From Wallet</Text>
             <Ionicons name="close-outline" size={24} color="grey" marginTop={22} paddingRight={25} onPress={() => setModalVisible(false)}/>
         </View>
          <Divider />
          <Text style={styles.modalSubText}>
          Withdraw from Wallet anytime for <Text style={{color: 'green'}}>free</Text> to any account of your choice.  {'\n'}
            {'\n'}Withdraw...
          </Text>
        
          <TextInput
        style={styles.amountInput}
        placeholder="How much do you want to withdraw?"
        keyboardType="numeric"
        onChangeText={(value) => handleAmountChange(value)}
      />
          <Text style={{alignSelf: 'flex-start', marginLeft: 45, fontSize: 12, fontFamily: 'proxima', marginTop: 2}}>Balance: <Text style={{color: '#4C28BC'}}>7500.25</Text></Text>

          <Text style={styles.modalSubText} alignSelf='flex-start'>to...</Text>
          <View style={styles.inputContainer}>
            <View style={styles.dropdown}>
              <Picker
                style={styles.labelItem}
                selectedValue={frequency}
                onValueChange={(value) => setFrequency(value)}
              >
                <Picker.Item color='silver' label="Select destination account" value="Select destination account" />
                <Picker.Item label="My local bank account" value="My local bank account" />
                <Picker.Item label="My Savings" value="Savings" />
                <Picker.Item label="My Sponsorship Investment" value="Sponsorship Investment" />
                <Picker.Item label="Another user's wallet" value="Another user's wallet" />
              </Picker>
            </View>
          </View>

          {frequency === 'My local bank account' && (
            <>
              <View style={styles.paymentOptionsContainer}>
                <Text style={styles.label}>Which of them?     </Text>
                <Picker
                  style={styles.labelItem2}
                  selectedValue={paymentOption}
                  onValueChange={(value) => setPaymentOption(value)}
                >
                  <Picker.Item color='silver' label="My Saved Bank Accounts" value="Saved Bank Account"/>
                  <Picker.Item label="Tolulope Ahmed" value="Tolulope Ahmed" />
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
                <TouchableOpacity style={styles.primaryButton} onPress={handleWithdrawNow}>
                  <Text style={styles.primaryButtonText}>Withdraw Now</Text>
                </TouchableOpacity>

            

                <TouchableOpacity style={styles.secondaryButton} onPress={() => setModalVisible(false)}>
                  <Text style={styles.secondaryButtonText}>Back</Text>
                </TouchableOpacity>
              </View>
        </View>
      </View>

    </Modal>

    {successModalVisible && (
      <SuccessModal Header='Sucess' Button='Close' Body='The withdrawal amount is on the way to its destination' />
    )}

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
    fontSize: 12,
    fontFamily: 'karla',
    textAlign: 'center',
    color: 'black',
    textAlign: 'left',
    marginHorizontal: 30,
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

export default WithdrawModal;
