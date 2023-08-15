import React, { useState } from 'react';
import { Modal, Text, View, TextInput, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Divider from '../components/Divider'
import { Ionicons } from '@expo/vector-icons';


const WithdrawModal = ({ navigation, withdrawModalVisible, setWithdrawModalVisible }) => {
 
  const [frequency, setFrequency] = useState('');
  const [toAccount, setToAccount] = useState('');
  const [toBank, setToBank] = useState('');

  const [paymentOption, setPaymentOption] = useState('');
  const [email, setEmail] = useState('');
  const [amount, setAmount] = useState('');


  const handleAmountChange = (value) => {
    // Remove any non-numeric characters from the input
    const formattedValue = value.replace(/[^0-9]/g, '');
    setAmount(formattedValue);
  };

  const closeModal = () => {
    setWithdrawModalVisible(false);
  };


  return (
    <>
    <Modal
      animationType="slide"
      transparent={true}
      visible={withdrawModalVisible}
      onRequestClose={() => setWithdrawModalVisible(false)}
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
             <Text style={styles.modalHeader} >Withdraw...</Text>
             <Ionicons name="close-outline" size={24} color="grey" marginTop={22} paddingRight={25} onPress={() => setWithdrawModalVisible(false)}/>
         </View>
          <Divider />

         <View style={styles.sectionContainer}> 

          <Text style={styles.modalSubText}>Amount</Text>
          <View style={styles.inputContainer2}>
          <Text style={styles.nairaSign}>₦</Text>
          <TextInput
        style={styles.amountInput}
        placeholder="e.g. 20000"
        keyboardType="numeric"
        onChangeText={(value) => handleAmountChange(value)}
      />
      </View>
      </View>


      <View style={styles.sectionContainer}> 
          <Text style={styles.modalSubText}>From...</Text>
          <Picker
                style={styles.labelItem}
                selectedValue={frequency}
                onValueChange={(value) => setFrequency(value)}
              >
                <Picker.Item color='silver' label="Select account" value="Select account" />
                <Picker.Item label="My Wallet" value="Wallet" />
                <Picker.Item label="My Savings" value="Savings" />
                <Picker.Item label="My Sponsorship Investment" value="Sponsorship Investment" />
              </Picker>
      </View>

      <View style={styles.sectionContainer}> 
      <Text style={styles.modalSubText}>To...</Text>
              <Picker
                style={styles.labelItem}
                selectedValue={toAccount}
                onValueChange={(value) => setToAccount(value)}
              >
                <Picker.Item color='silver' label="Select destination account" value="Select destination account" />
                <Picker.Item label="My local bank account" value="My local bank account" />
                <Picker.Item label="My Savings" value="Savings" />
                <Picker.Item label="My Sponsorship Investment" value="Sponsorship Investment" />
                <Picker.Item label="Another user's wallet" value="Another user's wallet" />
              </Picker>

          {toAccount === 'My local bank account' && (
            <>
              <View style={styles.paymentOptionsContainer}>
                <Text style={styles.label}>Which of them?     </Text>
                <Picker
                  style={styles.labelItem}
                  selectedValue={toBank}
                  onValueChange={(value) => setToBank(value)}
                >
                  <Picker.Item color='silver' label="My Saved Bank Accounts" value="Saved Bank Account"/>
                  <Picker.Item label="Oluwapelumi Oginni - Zenith" value="Tolulope Ahmed" />
                  <Picker.Item label="Oluwapelumi Oginni - Access" value="Tolulope Ahmed" />
                </Picker>
      
              </View>
            </>
          )}

{toAccount === "Another user's wallet" && (
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
      </View>


            <View style={styles.buttonsContainer}>
                <TouchableOpacity style={styles.primaryButton}>
                <Ionicons name="arrow-down-outline" size={24} color="#fff" style={{ marginRight: 4 }} />
                  <Text style={styles.primaryButtonText}>Withdraw Now</Text>
                </TouchableOpacity>
              </View>
              
        </View>
        </TouchableOpacity>
        </TouchableOpacity>
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

  sectionContainer: {
    alignSelf: 'flex-start',
    marginLeft: 30,
    marginTop: 5,
    width: '80%',
  },
  
  modalSubText: {
    fontSize: 14,
    fontFamily: 'karla',
    color: 'black',
    textAlign: 'left',
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

  inputContainer2: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    height: 50,
    width: '93%',
    marginTop: 5,
  },
  nairaSign: {
    fontSize: 16,
    marginLeft: 15,
    marginRight: 0,
  },

  autoSaveSetting: {
    fontSize: 17,
    fontFamily: 'proxima',
    marginLeft: 40,
    alignSelf: 'flex-start',
    marginBottom: 10,

  },

  paymentOptionsContainer:{
    marginTop: 5,
  },

  label: {
    fontSize: 17,
    fontFamily: 'proxima',
    marginTop: 5,
    marginBottom: 5,
  },

  

  labelItem2: {
    color: 'grey',
    textAlign: 'left',
    marginBottom: 10,
    fontFamily: 'karla',
    backgroundColor: '#fff',
    borderRadius: 10,

  },

  emailInput: {
    color: 'black',
    textAlign: 'left',
    fontFamily: 'karla',
    backgroundColor: '#fff',
    borderRadius: 5,
    height: 50,
    width: "108%",
    padding: 10,
    fontSize: 18,
    letterSpacing: -0.4,
  },

  amountInput: {
    color: 'black',
    textAlign: 'left',
    fontFamily: 'karla',
    backgroundColor: '#fff',
    borderRadius: 5,
    height: 50,
    width: "108%",
    padding: 10,
    fontSize: 17,
    letterSpacing: -0.3,
  },

  dropdown: {
    height: 45,
    width: '108%',
    backgroundColor: 'white',
    borderRadius: 10,
    marginBottom: 15,
    paddingLeft: 15,
    paddingRight: 5,
  },

  labelItem: {
    color: 'grey',
    textAlign: 'left',
    marginBottom: 4,
    fontFamily: 'karla',
    backgroundColor: '#fff',
    borderRadius: 10,
    width: "108%",
  },


  buttonsContainer: {
    flexDirection: 'row',
    marginTop: 15,
    position: 'relative',
    marginBottom: 35,


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

export default WithdrawModal;
