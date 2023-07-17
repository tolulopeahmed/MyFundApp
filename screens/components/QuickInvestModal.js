import React, { useState, useCallback } from 'react';
import { Modal, Text, Image, View, TextInput, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Divider from '../components/Divider'
import { Ionicons } from '@expo/vector-icons';

const QuickInvestModal = ({ navigation, quickInvestModalVisible, setQuickInvestModalVisible }) => {
  const [frequency, setFrequency] = useState('');
  const [paymentOption, setPaymentOption] = useState('');
  const [amount, setAmount] = useState('');

  const handleAmountChange = (value) => {
    setAmount(value);
  }

  const handleAddCard= () => {
    navigation.navigate('Card', { addCardModalVisible: true });
  };

 
  const closeModal = () => {
    setQuickInvestModalVisible(false);
  };

  return (
    <>
    <Modal
      animationType="slide"
      transparent={true}
      visible={quickInvestModalVisible}
      onRequestClose={() => setQuickInvestModalVisible(false)}
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
             <Text style={styles.modalHeader} >QuickInvest</Text>
             <Ionicons name="close-outline" size={24} color="grey" marginTop={22} paddingRight={25} onPress={() => setQuickInvestModalVisible(false)}/>
         </View>
          <Divider />
          <Text style={styles.modalSubText}>
          Manually move multiples of N100,000 from your local bank acount into your Sponsorship Investment Account with a few taps to enjoy <Text style={{fontFamily: 'proxima'}}>20% p.a. ROI. </Text> {'\n'}
            {'\n'}QuickInvest...
          </Text>
        
          <View style={styles.inputContainer2}>
  <Text style={styles.nairaSign}>₦</Text>
  <TextInput
    style={styles.amountInput}
    placeholder="Amount (e.g. 100000)"
    keyboardType="numeric"
    onChangeText={(value) => handleAmountChange(value)}
  />
</View>


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
                <Text style={styles.label3}>Which of them?     </Text>
                <Picker
                  style={styles.labelItem2}
                  selectedValue={paymentOption}
                  onValueChange={(value) => setPaymentOption(value)}
                >
                  <Picker.Item color='silver' label="My Saved Cards" value="My Saved Cards"/>
                  <Picker.Item label="Mastercard 3591" value="Mastercard 3591" />
                </Picker>


                <View style={styles.buttonsContainer}>
                <TouchableOpacity style={styles.primaryButton}>
                <Image source={require('./paystack.png')} style={styles.image} />
                  <Text style={styles.primaryButtonText}>Continue</Text>
                </TouchableOpacity>

           
              </View>
      
              </View>
            </>
          )}


{frequency === "Add New Card" && (
  <>
    <View style={styles.paymentOptionsContainer}>
    <Text style={styles.modalSubText2} alignSelf='center'>Tap the button below to add a new card first.</Text>

      
      <View style={styles.buttonsContainer}>
                <TouchableOpacity style={styles.primaryButton} onPress={handleAddCard}>
                  <Text style={styles.primaryButtonText}>Add Card Now</Text>
                </TouchableOpacity>

            
              </View>
    </View>
  </>
)}


{frequency === "Bank Transfer" && (
  <>
    <View style={styles.paymentOptionsContainer}>
    <Text style={styles.modalSubText2} alignSelf='center'>Transfer the exact amount you entered above to the account below. 
    Click 'Submit' after payment and your account will be updated within 12 hours.</Text>

      <Text style={styles.label}>Access Bank {'\n'} 0821326433 {'\n'} Vcorp Systems Limited</Text>
      
      <View style={styles.buttonsContainer}>
                <TouchableOpacity style={styles.primaryButton}>
                  <Text style={styles.primaryButtonText}>Submit</Text>
                </TouchableOpacity>

            
              </View>
    </View>
  </>
)}


           
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
    textAlign: 'center',
    marginHorizontal: 45,
    marginTop: 5,
    letterSpacing: -0.5,
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
    marginTop: 20,
    marginBottom: 5,
    textAlign: 'center',
    letterSpacing: -0.5,
  },

  label3: {
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

  inputContainer2: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    height: 50,
    width: '80%',
    marginTop: 5,
  },

  nairaSign: {
    fontSize: 16,
    marginLeft: 15,
    marginRight: 0,
  },

  amountInput: {
    flex: 1,
    color: 'black',
    fontFamily: 'karla',
    fontSize: 16,
    letterSpacing: -0.3,
    padding: 10,
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



  image: {
    marginTop: 5,
    marginRight: 5,
    borderWidth: 1,
    width: 40,
    height: 40,
    resizeMode: 'contain',
    marginBottom: 5,
  },

  buttonsContainer: {
    flexDirection: 'row',
    marginTop: 15,
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
    marginRight: 5,
  },



};

export default QuickInvestModal;
