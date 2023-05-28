import React, { useState } from 'react';
import { Modal, Text, Platform, Button, View, TextInput, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import Divider from '../components/Divider'
import { Ionicons } from '@expo/vector-icons';
import SelectDropdown from 'react-native-select-dropdown';


const bankOptions = [
    { id: 1, name: 'Access Bank', code: '044' },
    { id: 2, name: 'Citibank', code: '023' },
    { id: 3, name: 'Diamond Bank', code: '063' },
    { id: 4, name: 'Dynamic Standard Bank', code: '' },
    { id: 5, name: 'Ecobank', code: '050' },
    { id: 6, name: 'Fidelity Bank ', code: '070' },
    { id: 7, name: 'First Bank of Nigeria', code: '011' },
    { id: 8, name: 'First City Monument Bank', code: '214' },
    { id: 9, name: 'Guaranty Trust Bank', code: '058' },
    { id: 10, name: 'Heritage Bank Plc', code: '030' },
    { id: 11, name: 'Jaiz Bank', code: '301' },
    { id: 12, name: 'Keystone Bank', code: '082' },
    { id: 13, name: 'Providus Bank Plc', code: '101' },
    { id: 14, name: 'Polaris Bank', code: '076' },
    { id: 15, name: 'Stanbic IBTC Bank', code: '221' },
    { id: 16, name: 'Standard Chartered Bank', code: '068' },
    { id: 17, name: 'Sterling Bank', code: '232' },
    { id: 18, name: 'Suntrust Bank', code: '100' },
    { id: 19, name: 'Union Bank', code: '032' },
    { id: 20, name: 'United Bank for Africa', code: '033' },
    { id: 21, name: 'Unity Bank Plc', code: '215' },
    { id: 22, name: 'Wema Bank', code: '035' },
    { id: 22, name: 'Zenith Bank', code: '035' },
    { id: 24, name: 'Kuda Microfinance Bank', code: '057' },
    { id: 25, name: 'Abbey Mortgage Bank', code: '057' },
    { id: 26, name: 'AG Mortgage Bank', code: '057' },
    { id: 27, name: 'Bonghe Microfinance Bank', code: '057' },
    { id: 28, name: 'Borstal Microfinance Bank', code: '057' },
    { id: 29, name: 'Calabar Microfinance Bank', code: '057' },
    { id: 30, name: 'Cherish Microfinance Bank', code: '057' },
    { id: 31, name: 'Cross River Microfinance Bank', code: '057' },
    { id: 32, name: 'Crutech Microfinance Bank', code: '057' },
    { id: 33, name: 'Enterprise Bank', code: '057' },
    { id: 34, name: 'Fame Microfinance Bank', code: '057' },
    { id: 35, name: 'First Generation Mortgage Bank', code: '057' },
    { id: 36, name: 'FSDH Merchant Bank', code: '057' },
    { id: 37, name: 'Giwa Microfinance Bank', code: '057' },
    { id: 38, name: 'Globus Bank', code: '057' },
    { id: 39, name: 'Haggai Mortgage Bank', code: '057' },
    { id: 40, name: 'Heritage Bank', code: '057' },
    { id: 41, name: 'Ibeto Bank', code: '057' },
    { id: 42, name: 'Keystone Bank', code: '057' },
    { id: 43, name: 'Livingtrust Bank', code: '057' },
    { id: 44, name: 'Lotus Bank', code: '057' },
    { id: 45, name: 'Moyofade Microfinance Bank', code: '057' },
    { id: 46, name: 'Nice Microfinance Bank', code: '057' },
    { id: 47, name: 'NIRSAL Microfinance Bank', code: '057' },
    { id: 48, name: 'Nova MB', code: '057' },
    { id: 49, name: 'Parallex Bank', code: '057' },
    { id: 50, name: 'Platinum Mortgage Bank', code: '057' },
    { id: 51, name: 'PalmPay', code: '057' },
    { id: 52, name: 'Providus Bank', code: '057' },
    { id: 53, name: 'Rand Merchant Bank', code: '057' },
    { id: 54, name: 'Safegate Microfinance Bank', code: '057' },
    { id: 55, name: 'SLS Microfinance Bank', code: '057' },
    { id: 56, name: 'Sparkle Bank', code: '057' },
    { id: 57, name: 'Taj Bank', code: '057' },
    { id: 58, name: 'Titan Trust Bank', code: '057' },
    { id: 59, name: 'VFD Microfinance Bank', code: '057' },
    { id: 60, name: 'Opay', code: '057' },
    { id: 61, name: 'Moniepoint Microfinance Bank', code: '057' },
  ];
  

  const AddBankModal = ({ navigation, addBankModalVisible, setAddBankModalVisible, initialBankRecords, setBankRecords }) => {
    const [accountNumber, setAccountNumber] = useState('');
    const [selectedBank, setSelectedBank] = useState('');
  
    const handleSelect = (value) => {
      setSelectedBank(value);
    };
  
    const handleProceed = () => {
      const newBankRecord = { bank: selectedBank, accountNumber };
      const updatedBankRecords = [...initialBankRecords, newBankRecord];
      setBankRecords(updatedBankRecords);
      setAccountNumber('');
      setAddBankModalVisible(false);
    };
  
  
  
  const dropdownOptions = bankOptions.map((bank) => bank.name);

   return (
    <>
    <Modal
      animationType="slide"
      transparent={true}
      visible={addBankModalVisible}
      onRequestClose={() => setAddBankModalVisible(false)}
    >
      <View style={styles.modalContainer}>
     
        <View style={styles.modalContent}>
         <View style={{flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center',  paddingLeft: 30,}}>
             <Text style={styles.modalHeader} >Add Bank Account</Text>
             <Ionicons name="close-outline" size={24} color="grey" marginTop={22} paddingRight={25} onPress={() => setAddBankModalVisible(false)}/>
         </View>
          <Divider />
          <Text style={styles.modalSubText}>
          Set up your bank accounts so you can perform faster withdrawals locally.{'\n'}
            {'\n'}<Text style={{fontFamily: 'proxima'}}>            Bank                               Enter Account Number</Text>
          </Text>

        <View flexDirection='row' alignSelf='center'>
         
        <View style={styles.dropdown}> 
        <SelectDropdown
      data={dropdownOptions}
      onSelect={handleSelect}
      buttonTextAfterSelection={(selectedItem) => selectedItem}
      rowTextForSelection={(item) => item}
      buttonStyle={{ borderRadius: 10, fontFamily: 'karla' }}
      dropdownStyle={{ fontFamily: 'karla' }}
      rowStyle={{ alignSelf: 'flex-start', fontFamily: 'karla' }}
      rowTextStyle={{ textAlign: 'left', fontSize: 16, color: 'black', fontFamily: 'ProductSans'}}
      defaultButtonText="Select Bank" // Placeholder text
      buttonTextStyle={{ color: 'black', fontSize: 16, fontFamily: 'karla', marginRight: 70, letterSpacing: -0.6, }} // Style for the placeholder text
    />
            </View>


            <TextInput
              style={styles.amountInput}
              placeholder="1234567890"
              keyboardType="numeric"
              maxLength={10}
              onChangeText={(value) => setAccountNumber(value)}
              value={accountNumber}
            />

            </View>


  
  <Text style={{fontFamily: 'karla', letterSpacing: -0.8, marginBottom: 7, marginTop: 45, alignSelf: 'center', color: 'grey', fontSize: 12,}}>This bank account can only be used by you for receiving money</Text>
  
    



            <View style={styles.buttonsContainer}>
            <TouchableOpacity style={styles.primaryButton} onPress={handleProceed}>
  <Text style={styles.primaryButtonText}>Add Bank Account</Text>
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
    flex: 0.5,
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
    marginLeft: 15,

  },
   


  amountInput: {
    color: 'black',
    fontFamily: 'ProductSans',
    backgroundColor: '#fff',
    height: 50,
    width: 200,
    padding: 10,
    marginTop: 5,
    fontSize: 16,
    letterSpacing: 1,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
  },

  
  amountInput2: {
    color: 'black',
    fontFamily: 'ProductSans',
    backgroundColor: '#fff',
    height: 35,
    width: 60,
    textAlign: 'center',
    padding: 6,
    fontSize: 15,
    letterSpacing: 1,
    borderRadius: 4,
    marginTop: 15,
  },
  
  dropdown: {
    height: 50,
    width: 10,
    marginTop: 5,
    borderRadius: 10,
    marginBottom: 10,
    paddingRight: 5,
    marginRight: 165,
  },


  pickContainer: {
    alignItems: 'center',
    height: 40,
    justifyContent: 'center',
    alignSelf: 'center',
    alignContents: 'center',
    width: '90%',
    backgroundColor: 'white'

  },
  pickerContainer: {
    flexDirection: 'row',
    width: '94%',

  },
  picker: {
    flex: 0.5,
    height: 150,
    width: 10,
  },
  
  buttonsContainer: {
    flexDirection: 'row',
    marginTop: 10,
    position: 'relative',

  },

  primaryButton: {
    marginTop: 5,
    flexDirection: 'row',
    backgroundColor: '#4C28BC',
    width: 170,
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

export default AddBankModal;
