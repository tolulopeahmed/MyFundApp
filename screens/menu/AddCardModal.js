import React, { useRef, useState } from 'react';
import { Modal, Text, ActivityIndicator, Image, Alert, Pressable, View, TextInput, TouchableOpacity } from 'react-native';
import Divider from '../components/Divider'
import { Ionicons } from '@expo/vector-icons';
import SelectDropdown from 'react-native-select-dropdown';
import axios from 'axios';
import { ipAddress } from '../../constants';
import { useDispatch, useSelector } from 'react-redux';
import { addCard, fetchUserData, fetchUserCards } from '../../ReduxActions';


const bankOptions = [
  { id: 1, name: 'Access Bank', code: '044' },
  { id: 2, name: 'Citibank', code: '023' },
  { id: 3, name: 'Palmpay', code: '999991' },
  { id: 4, name: 'Opay', code: '999992' },
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
  { id: 22, name: 'Zenith Bank', code: '057' },
  { id: 24, name: 'Kuda Microfinance Bank', code: '50211' },
  { id: 25, name: 'Moniepoint', code: '50515' },
  { id: 26, name: 'Paga', code: '100002' },
  { id: 27, name: 'ALAT by Wema', code: '035A' },
  { id: 28, name: 'Borstal Microfinance Bank', code: '090454' },
  { id: 29, name: 'Calabar Microfinance Bank', code: '090415' },
  { id: 30, name: 'Cherish Microfinance Bank', code: '090440' },
  { id: 31, name: 'Cross River Microfinance Bank', code: '090429' },
  { id: 32, name: 'Crutech Microfinance Bank', code: '090414' },
  { id: 33, name: 'Mainstreet MFB', code: '090171' },
  { id: 34, name: 'Fame Microfinance Bank', code: '090330' },
  { id: 35, name: 'First Generation Mortgage Bank', code: '070014' },
  { id: 36, name: 'Fairmoney Microfinance Bank', code: '51318' },
  { id: 37, name: 'Giwa Microfinance Bank', code: '090441' },
  { id: 38, name: 'Globus Bank', code: '000027' },
  { id: 39, name: 'Haggai Mortgage Bank', code: '070017' },
  { id: 40, name: 'Heritage Bank', code: '000020' },
  { id: 41, name: 'Ibeto Bank', code: '090439' },
  { id: 42, name: 'Unilag Microfinance Bank', code: '51316' },
  { id: 43, name: 'Livingtrust Bank', code: '031' },
  { id: 44, name: 'Lotus Bank', code: '303' },
  { id: 45, name: 'Moyofade Microfinance Bank', code: '090448' },
  { id: 46, name: 'Nice Microfinance Bank', code: '090459' },
  { id: 47, name: 'NIRSAL Microfinance Bank', code: '090194' },
  { id: 48, name: 'Nova MB', code: '060003' },
  { id: 49, name: 'Parallex Bank', code: '104' },
  { id: 50, name: 'Platinum Mortgage Bank', code: '268' },
  { id: 51, name: 'Premium Trust', code: '105' },
  { id: 52, name: 'Providus Bank', code: '101' },
  { id: 53, name: 'Rand Merchant Bank', code: '502' },
  { id: 54, name: 'Safe Haven Microfinance Bank', code: '51113' },
  { id: 55, name: 'SLS Microfinance Bank', code: '090449' },
  { id: 56, name: 'Sparkle Bank', code: '51310' },
  { id: 57, name: 'Taj Bank', code: '302' },
  { id: 58, name: 'Titan Trust Bank', code: '102' },
  { id: 59, name: 'VFD Microfinance Bank', code: '566' },
  { id: 60, name: 'Carbon', code: '565' },
  { id: 61, name: 'Moniepoint Microfinance Bank', code: '50515' },
];
  

const AddCardModal = ({ navigation, addCardModalVisible, setAddCardModalVisible,   }) => {
  const [cardNumber, setCardNumber] = useState('');
  const [selectedBank, setSelectedBank] = useState(null); // Add selectedBank state
  const [processing, setProcessing] = useState(false);
  const userInfo = useSelector((state) => state.bank.userInfo);
  const dispatch = useDispatch();
  const cards = useSelector((state) => state.bank.cards);

  const dropdownOptions = bankOptions.map((bank) => bank.name);
  const [cvv, setCVV] = useState('');
  const [expiry, setExpiry] = useState('');
  const [showCVVText, setShowCVVText] = useState(false);
  const [pin, setPin] = useState('');
  const [allFieldsFilled, setAllFieldsFilled] = useState(false);
  const cvvInputRef = useRef(null);
  const pinInputRef = useRef(null);
  
  const handleAmountChange = (value) => {
  const formattedValue = value.replace(/[^0-9]/g, '');
  const truncatedValue = formattedValue.substring(0, 19);
  const spacedValue = truncatedValue.replace(/(\d{4})(?=\d)/g, '$1 ');
  setCardNumber(spacedValue);
  checkAllFieldsFilled();
  };


  
  const handleSelect = (value) => {
    const selectedBankObj = bankOptions.find((bank) => bank.name === value);
    setSelectedBank(selectedBankObj); // Update the selectedBank state
  };
  
  
  const checkAllFieldsFilled = () => {
    if (cardNumber && selectedBank && cvv && expiry && pin) {
      setAllFieldsFilled(true);
    } else {
      setAllFieldsFilled(false);
    }
  };
  
  
const handleCVVChange = (value) => {
  const truncatedValue = value.substring(0, 3);
  setCVV(truncatedValue);
  if (truncatedValue.length === 3) { // Check the length here
    pinInputRef.current.focus(); // Focus on PIN input field
  }
  checkAllFieldsFilled();
};


const handleExpiryChange = (text) => {
  let formattedText = text;
  if (text.length === 2 && !text.includes('/')) {
    formattedText += '/';
  }
  setExpiry(formattedText);
  if (formattedText.length === 4) { // Check the length here
    cvvInputRef.current.focus(); // Focus on CVV input field
  }
  checkAllFieldsFilled();
};


const handleAlertIconTap = () => {
  setShowCVVText(true);
  setTimeout(() => {
    setShowCVVText(false);
  }, 25000); // Hide the text after 15 seconds
};


const closeModal = () => {
  setAddCardModalVisible(false);
};

const handlePinChange = (pinValue) => {
  setPin(pinValue);
  checkAllFieldsFilled(); // Call checkAllFieldsFilled here
};

console.log('UserInfo Token before the API call:', userInfo.token); // Log the response data for debugging








const handleProceed = async () => {
  setProcessing(true);

  console.log('Selected Bank:', selectedBank);

  if (!selectedBank) {
    Alert.alert('Error', 'Please select a bank');
    setProcessing(false); // Reset processing state
    return;
  }

  
  if (!userInfo || !userInfo.token) {
    Alert.alert('Error', 'User information is missing. Please relog in.');
    setProcessing(false); // Reset processing state
    return;
  }

  const cardNumberWithoutSpaces = cardNumber.replace(/ /g, '');
    // Check if the card with the same number already exists
    const isCardAlreadyAdded = cards.some(card => card.card_number === cardNumberWithoutSpaces);

    if (isCardAlreadyAdded) {
      Alert.alert('Error', 'This card has already been added.');
      return;
    }

    const confirmation = await new Promise((resolve) => {
      Alert.alert(
        'Confirmation',
        'An initial charge of ₦50 will be made and returned back to your savings account just to confirm that your card works fine. Click OK to proceed.',
        [
          { text: 'Cancel', onPress: () => resolve(false), style: 'cancel' },
          { text: 'OK', onPress: () => resolve(true) },
        ]
      );
    });
  
    if (!confirmation) {
      setProcessing(false); // Reset processing state
      return;
    }
  

  try {
    const requestData = {
      bank_name: selectedBank.name,
      card_number: cardNumberWithoutSpaces,
      expiry_date: expiry,
      cvv: cvv,
      pin: pin,

    };

    console.log('requestData:', requestData);


    const response = await axios.post(`${ipAddress}/api/add-card/`, requestData, {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    });

    console.log('Response:', response.data); // Log the response data for debugging

    if (response.status === 201) {
      const newCardRecord = {
        bank_name: selectedBank.name,
        card_number: cardNumberWithoutSpaces,
        expiry_date: expiry,
        id: response.data.id, // Assuming the response contains the card ID
      };
    
      dispatch(addCard(newCardRecord));
      Alert.alert(
        'Success',
        'Card added successfully! And ₦50 has been credited to your SAVINGS Account',
        [
          { text: 'OK' },
          {
            text: 'QuickSave',
            onPress: () => {
              navigation.navigate('Save', { quickSaveModalVisible: true });
            },
          },
          {
            text: 'AutoSave',
            onPress: () => {
              navigation.navigate('Save', { autoSaveModalVisible: true });
            },
          },
        ]
      );
      
           closeModal();

    } else {
      setProcessing(false);
      console.error('Failed to add card:', response.data);
      Alert.alert('Error', 'Failed to add card. This kind of problem is usually solved by trying another card.');
    }
    
  } catch (error) {
    setProcessing(false);
    console.error('An error occurred while adding card:', error);
    console.error(error.stack); // Print the stack trace

    Alert.alert('Error', 'An error occurred while adding card. Please try again later.');
  }
  setProcessing(false);

  setTimeout(() => {
    setProcessing(false);
  }, 3000);
};











   return (
    <>   
    <Modal
      animationType="slide"
      transparent={true}
      visible={addCardModalVisible}
      onRequestClose={() => setAddCardModalVisible(false)}
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
             <Text style={styles.modalHeader} >Add New Card</Text>
             <Ionicons name="close-outline" size={24} color="grey" marginTop={22} paddingRight={25} onPress={() => setAddCardModalVisible(false)}/>
         </View>
          <Divider />
          <Text style={styles.modalSubText}>
An initial charge of ₦50 will be made and returned back as to your savings account just to confirm that your card works fine.</Text>

<View>
    <Text style={styles.labelText}>Bank</Text>
    <View style={styles.fieldContainer3}>
    <SelectDropdown
        data={dropdownOptions}
        onSelect={handleSelect}
        buttonTextAfterSelection={(selectedItem) => selectedItem}
        rowTextForSelection={(item) => item}
        buttonStyle={{ borderRadius: 10, borderColor: 'silver',
        borderWidth: 1, fontFamily: 'karla', width: '85%', marginBottom: 20 }}
        dropdownStyle={{ fontFamily: 'karla' }}
        rowStyle={{ alignSelf: 'flex-start', fontFamily: 'karla' }}
        rowTextStyle={{ textAlign: 'left', fontSize: 16, color: 'black', fontFamily: 'ProductSans' }}
        defaultButtonText={selectedBank ? selectedBank.name : 'Select Bank'}
        buttonTextStyle={{ color: 'black', fontSize: 16, fontFamily: 'karla', letterSpacing: -0.6 }} // Style for the placeholder text
      />

  </View>

</View>

  <View style={styles.fieldContainer2}>
    <Text style={styles.labelText2}>Card Number</Text>
    <View style={styles.inputContainer}>
      <TextInput
        style={styles.amountInput}
        placeholder="1234  5678  9101  1121 XXXX"
        keyboardType="numeric"
        maxLength={23} // Maximum length including spaces
        onChangeText={handleAmountChange}
        value={cardNumber}
        placeholderTextColor="silver" // Add this line
      />
    </View>
</View>



    <View style={styles.pickContainer}>
  <View style={styles.fieldContainer}>
    <Text style={styles.labelText}>Expiry</Text>
    <TextInput
      style={styles.amountInput2}
      placeholder="MM/YY"
      keyboardType="numeric"
      maxLength={5}
      onChangeText={handleExpiryChange}
      value={expiry}
      placeholderTextColor="silver" 
      ref={cvvInputRef} // Attach the ref here    
    />
  </View>

  <View style={styles.fieldContainer}>
  <View flexDirection='row'>
    <Text style={styles.labelText}>CVV</Text>
 <Pressable onPress={handleAlertIconTap}>
    <Ionicons name="alert-circle-outline" size={16} color="black" style={styles.alertIcon} />
  </Pressable>
  </View>
  <TextInput
    style={styles.amountInput2}
    placeholder="1 2 3"
    keyboardType="numeric"
    onChangeText={handleCVVChange}
    value={cvv}
    placeholderTextColor="silver"
    ref={pinInputRef} // Attach the ref here
  />
</View>


  
  <View style={styles.fieldContainer}>
    <Text style={styles.labelText}>PIN</Text>
    <TextInput
      style={styles.amountInput2}
      placeholder="* * * *"
      keyboardType="numeric"
      secureTextEntry={true}
      onChangeText={handlePinChange} 
      placeholderTextColor="silver" 
      />
  </View>
</View>


{showCVVText && (
        <View style={{width: '80%', position: 'relative', }}>
          <Text style={{fontFamily: 'karla-italic', fontSize: 12, textAlign: 'center', color: 'grey', marginTop: 5,}}>
            CVV is the 3 or 4-digit number at the back of your debit card. It is NOT your PIN.
          </Text>
        </View>
      )}





            <View style={styles.buttonsContainer}>
            <TouchableOpacity
                style={[
                  styles.primaryButton,
                  (!allFieldsFilled || processing) && styles.disabledPrimaryButton, // Apply the disabled style here
                  { backgroundColor: processing ? 'green' : allFieldsFilled ? '#4C28BC' : 'grey' },
 
                ]}
                onPress={handleProceed}
                disabled={!allFieldsFilled || processing} // Use the allFieldsFilled state here
                >
                {processing ? (
                  <>
                  <ActivityIndicator color="white" style={styles.activityIndicator} />
                  <Image source={require('./paystack.png')} style={styles.image} />
                  </>
                ) : (
                  <Image source={require('./paystack.png')} style={styles.image} />
                )}
                <Text style={[styles.primaryButtonText, processing && styles.processingText]}>
                  {processing ? 'Paystack Processing...' : 'Proceed'}
                </Text>
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
  modalSubText: {
    fontSize: 14,
    fontFamily: 'karla',
    color: 'black',
    textAlign: 'left',
    marginHorizontal: 30,
    marginTop: 5,
    marginLeft: 15,
    marginBottom: 30,
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


  pickerContainer: {
    flexDirection: 'row',
    width: '50%',
  },
  picker: {
    flex: 1,
    height: 100,
  }, 


fieldContainer3: {
  width: '100%',
},



labelText2: {
  fontFamily: 'proxima',
  marginBottom: 7,
  textAlign: 'left',
},

fieldContainer2: {
  alignSelf: 'center',
  width: '85%',
},

inputContainer: {
  width: '100%',
  alignSelf: 'flex-start',
},

amountInput: {
  color: 'black',
  fontFamily: 'ProductSans',
  backgroundColor: '#fff',
  height: 50,
  padding: 10,
  marginTop: 1,
  fontSize: 16,
  letterSpacing: 2,
  borderRadius: 5,
  width: '100%',
  borderColor: 'silver',
        borderWidth: 1,
},


  pickContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignSelf: 'center',
    paddingHorizontal: 15,
    width: '100%',
    maxWidth: 390,
    marginTop: 20,
  },
  
  fieldContainer: {
    alignItems: 'flex-start',
    width: '28%',
  },
  
  labelText: {
    fontFamily: 'proxima',
    marginLeft: 3,
    marginBottom: 5,
    textAlign: 'left',
  },
  
  amountInput2: {
    color: 'black',
    fontFamily: 'ProductSans',
    backgroundColor: '#fff',
    height: 35,
    width: "110%",
    textAlign: 'left',
    padding: 10,
    fontSize: 15,
    letterSpacing: 1,
    borderRadius: 4,
    marginTop: 1,
    marginRight: 15,
    borderColor: 'silver',
        borderWidth: 1,
  },
  
  alertIcon: {
    marginLeft: 4,
  },
  
  
  buttonsContainer: {
    flexDirection: 'row',
    marginTop: 20,
    position: 'relative',
    marginBottom: 30,


  },

  primaryButton: {
    marginTop: 20,
    flexDirection: 'row',
    backgroundColor: '#4C28BC',
    width: '85%',
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    marginBottom: 30,
  
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'ProductSans',
    marginRight: 5,
  },

  disabledPrimaryButton: {
    backgroundColor: 'grey', // Change this to the color you want for disabled buttons
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

  activityIndicator: {
    marginRight: 10,
  },

  processingButton: {
    backgroundColor: 'green',
  },
  
  processingText: {
    color: 'white',
  },

};

export default AddCardModal;
