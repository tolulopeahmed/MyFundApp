import React, { useState } from 'react';
import { Modal, Text, Animated, View, TextInput, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Divider from '../components/Divider'
import { Ionicons } from '@expo/vector-icons';


const SavingsGoalModal = ({ navigation, goalModalVisible, setGoalModalVisible }) => {
  const [frequency, setFrequency] = useState('');
  const [year, setYear] = useState('');

  const [amount, setAmount] = useState('');

  const handleAmountChange = (value) => {
    // Remove any non-numeric characters from the input
    const formattedValue = value.replace(/[^0-9]/g, '');
    setAmount(formattedValue);
  };

  
   return (
    <>
    <Modal
      animationType="slide"
      transparent={true}
      visible={goalModalVisible}
      onRequestClose={() => setGoalModalVisible(false)}
    >
      <View style={styles.modalContainer}>
     
        <View style={styles.modalContent}>
         <View style={{flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center',  paddingLeft: 30,}}>
             <Text style={styles.modalHeader} >Set Your Savings Goal</Text>
             <Ionicons name="close-outline" size={24} color="grey" marginTop={22} paddingRight={25} onPress={() => setGoalModalVisible(false)}/>
         </View>
          <Divider />
          <Text style={styles.modalSubText}>
          As part of helping you grow your funds to own properties and developing your savings habit, you'll need to set a savings goal. {'\n'}
            {'\n'}<Text style={{fontFamily: 'proxima'}}>Preferred Asset</Text>
          </Text>
          
          <View style={styles.dropdown}>
              <Picker
                style={styles.labelItem}
                selectedValue={frequency}
                onValueChange={(value) => setFrequency(value)}
              >
                <Picker.Item color='silver' label="Select Asset" value="Select Asset" />
                <Picker.Item label="Real Estate" value="MyFund National Real Estate Project" />
                <Picker.Item label="Paper Assets" value="Paper Assets: Stocks" />
              </Picker>
            </View>
        
            <Text style={{fontFamily: 'proxima', marginTop: 7, marginLeft: 40, alignSelf: 'flex-start'}}>How much are you planning to save for it?</Text>

          <TextInput
        style={styles.amountInput}
        placeholder="Minimum amount is 1000000"
        keyboardType="numeric"
        onChangeText={(value) => handleAmountChange(value)}
      />

            <Text style={{fontFamily: 'proxima', marginTop: 7, marginLeft: 40, alignSelf: 'flex-start'}}>How long will it take you?</Text>
          <View style={styles.inputContainer}>
            <View style={styles.dropdown}>
              <Picker
                style={styles.labelItem}
                selectedValue={year}
                onValueChange={(value) => setYear(value)}
              >
                <Picker.Item color='silver' label="Select number of years" value="Select years" />
                <Picker.Item label="1 year" value="1 year" />
                <Picker.Item label="2 years" value="2 year" />
                <Picker.Item label="3 years" value="3 year" />
                <Picker.Item label="4 years" value="4 year" />
                <Picker.Item label="5 years" value="5 year" />
                <Picker.Item label="6 years" value="6 year" />

              </Picker>
            </View>
          </View>
 
            <View style={styles.buttonsContainer}>
                <TouchableOpacity style={styles.primaryButton} onPress={() => navigation.navigate('Save')}>
                  <Text style={styles.primaryButtonText}>Proceed </Text>
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
    flex: 0.7,
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
    marginTop: 445,
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

export default SavingsGoalModal;
