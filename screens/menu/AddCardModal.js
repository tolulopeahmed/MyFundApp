import React, { useState } from 'react';
import { Modal, Text, Image, Pressable, View, TextInput, TouchableOpacity } from 'react-native';
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
    { id: 23, name: 'Zenith Bank', code: '057' },
  ];
  

const AddCardModal = ({ navigation, addCardModalVisible, setAddCardModalVisible }) => {
  const [frequency, setFrequency] = useState('');
  const [amount, setAmount] = useState('');

  const handleAmountChange = (value) => {
  const formattedValue = value.replace(/[^0-9]/g, '');
  const truncatedValue = formattedValue.substring(0, 16);
  const spacedValue = truncatedValue.replace(/(\d{4})(?=\d)/g, '$1 ');
  setAmount(spacedValue);
  };

  const handleSelect = (index, selectedItem) => {
    console.log(selectedItem);
  };

  const dropdownOptions = bankOptions.map((bank) => bank.name);
  const [cvv, setCVV] = useState('');
  const [expiry, setExpiry] = useState('');
  const [showCVVText, setShowCVVText] = useState(false);



const handleCVVChange = (value) => {
  const truncatedValue = value.substring(0, 3);
  setCVV(truncatedValue);
};

const handleExpiryChange = (text) => {
  let formattedText = text;
  if (text.length === 2 && !text.includes('/')) {
    formattedText += '/';
  }
  setExpiry(formattedText);
};

const handleAlertIconTap = () => {
  setShowCVVText(true);
  setTimeout(() => {
    setShowCVVText(false);
  }, 25000); // Hide the text after 15 seconds
};

   return (
    <>
    <Modal
      animationType="slide"
      transparent={true}
      visible={addCardModalVisible}
      onRequestClose={() => setAddCardModalVisible(false)}
    >
      <View style={styles.modalContainer}>
     
        <View style={styles.modalContent}>
         <View style={{flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center',  paddingLeft: 30,}}>
             <Text style={styles.modalHeader} >Add New Card</Text>
             <Ionicons name="close-outline" size={24} color="grey" marginTop={22} paddingRight={25} onPress={() => setAddCardModalVisible(false)}/>
         </View>
          <Divider />
          <Text style={styles.modalSubText}>
          Set up your cards so you can perform faster transactions. 
          
{'\n'}{'\n'}An initial charge of NGN 50 will be made and returned back as savings to confirm your card.

{'\n'}{'\n'}{'\n'}<Text style={{fontFamily: 'proxima'}}>            Bank                               Enter Card Number</Text>
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
        placeholder="1234  5678  9101  1121"
        keyboardType="numeric"
        maxLength={19} // Maximum length including spaces
        onChangeText={handleAmountChange}
        value={amount}
        /> 
            </View>


  
  <Text style={{fontFamily: 'proxima', marginBottom: 7, marginTop: 7, marginLeft: 40, alignSelf: 'flex-start'}}>Expiry                      CVV                           PIN</Text>
  <View style={styles.pickContainer}>

  <TextInput
  style={styles.amountInput2}
  placeholder="MM/YY"
  keyboardType="numeric"
  maxLength={5}
  onChangeText={handleExpiryChange}
  value={expiry}
/>  

  <TextInput
style={styles.amountInput2}
placeholder="1 2 3"
keyboardType="numeric"
onChangeText={handleCVVChange}
value={cvv}
/>
<Pressable onPress={handleAlertIconTap}>
<Ionicons name="alert-circle-outline" size={16} color="black" marginTop={-25} marginLeft={-90} position='absolute'/>
</Pressable>

 
<TextInput
  style={styles.amountInput2}
  placeholder="* * * *"
  keyboardType="numeric"
  secureTextEntry={true}
/>


</View>

{showCVVText && (
        <View style={{width: '80%', position: 'absolute', marginTop: 360}}>
          <Text style={{fontFamily: 'karla', fontSize: 12, textAlign: 'center', color: 'grey'}}>
            CVV is the 3 or 4-digit number at the back of your debit card. It is NOT your PIN.
          </Text>
        </View>
      )}





            <View style={styles.buttonsContainer}>
                <TouchableOpacity style={styles.primaryButton} onPress={() => navigation.navigate('Card')}>
                <Image source={require('./paystack.png')} style={styles.image} />
                  <Text style={styles.primaryButtonText}>Proceed</Text>
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
    flex: 0.67,
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignSelf: 'flex-start',
    marginLeft: 30,
    width: '50%',
  },
  pickerContainer: {
    flexDirection: 'row',
    width: '50%',
  },
  picker: {
    flex: 1,
    height: 100,
  },
  amountInput2: {
    color: 'black',
    fontFamily: 'ProductSans',
    backgroundColor: '#fff',
    height: 35,
    width: '50%',
    textAlign: 'left',
    padding: 10,
    fontSize: 15,
    letterSpacing: 1,
    borderRadius: 4,
    marginTop: 1,
    marginRight: 25,
  },
  buttonsContainer: {
    flexDirection: 'row',
    marginTop: 65,
    position: 'relative',

  },

  primaryButton: {
    marginTop: 5,
    flexDirection: 'row',
    backgroundColor: '#4C28BC',
    width: 140,
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
    marginRight: 5,
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
  secondaryButtonText: {
    color: '#4C28BC',
    fontSize: 18,
    fontFamily: 'ProductSans',
  },


};

export default AddCardModal;
