import React, { useState } from 'react';
import { Modal, Text, Alert, View, ActivityIndicator, TextInput, TouchableOpacity } from 'react-native';
import Divider from '../components/Divider'
import { Ionicons } from '@expo/vector-icons';
import SelectDropdown from 'react-native-select-dropdown';
import axios from 'axios'; // Import axios for making API requests
import { ipAddress } from '../../constants';
import { useUserContext } from '../../UserContext';

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
  

  const AddBankModal = ({ addBankModalVisible, setAddBankModalVisible, initialBankRecords, addBankRecord, bankRecords, setBankRecords, deleteBankRecord }) => {
    const [accountNumber, setAccountNumber] = useState('');
    const [selectedBank, setSelectedBank] = useState('');
    const [accountName, setAccountName] = useState(''); // State for resolved account name
    const [isAccountNameResolved, setIsAccountNameResolved] = useState(false);
    const [bankCode, setBankCode] = useState('');
    const [bankName, setBankName] = useState('');
    const { userInfo } = useUserContext();
    const [isLoading, setIsLoading] = useState(false); // Add this state

    
    const handleSelect = (value) => {
      const selectedBankObj = bankOptions.find((bank) => bank.name === value);
      setSelectedBank(selectedBankObj);
    };
  


    const handleAccountNumberChange = async (value) => {
      console.log('Account number input:', value);
      setAccountNumber(value);
      
      if (!value.trim() || accountName === 'Account not found. Try again.') {
        setAccountName('');
        setIsAccountNameResolved(false);
        return;
      }
    
      if (value.length === 10 && selectedBank) {
        console.log('Account number:', value);
        console.log('Bank code:', selectedBank.code);
        
        try {
          setIsLoading(true); // Set isLoading to true when starting to fetch
          const response = await axios.get(`https://api.paystack.co/bank/resolve?account_number=${value}&bank_code=${selectedBank.code}`, {
            headers: {
              Authorization: 'Bearer sk_live_a54969904a401ca7a59b8ca1567ce332a16a3ef8'
            }
          });
            
          console.log('API Response:', response.data);
            
          if (response.status === 200) {
            setAccountName(response.data.data.account_name);
            setIsAccountNameResolved(true);
          } else {
            setAccountName('Account not found. Try again.');
            setIsAccountNameResolved(false);
          }
        } catch (error) {
          console.error('Error fetching account name:', error);
          setIsAccountNameResolved(false);
          setAccountName('Account not found. Try again.');
          console.log('Error response:', error.response.data);
        } finally {
          setIsLoading(false); // Set isLoading back to false after fetching, regardless of success or error
        }
      }
    };
    
    
    
    
    const handleProceed = async () => {
      console.log('User Token:', userInfo.token);
    
      try {
        const response = await axios.post(
          `${ipAddress}/api/add-bank-account/`,
          {
            accountNumber: accountNumber.trim(),
            bankName: selectedBank.name,
            accountName: accountName.trim(),
            bankCode: selectedBank.code,
          },
          {
            headers: {
              Authorization: `Bearer ${userInfo.token}`,
            },
          }
        );
    
        if (response.status === 201) {
          setAddBankModalVisible(false); // Close the modal
    
          // Update the bankRecords state with the new bank account data
          const newBankRecord = {
            bank_name: selectedBank.name,
            account_number: accountNumber.trim(),
            // Add other properties here if needed
          };
          setBankRecords([...bankRecords, newBankRecord]);
    
          Alert.alert("Success", "Bank Account Added successfully", [
            { text: "OK" },
          ]);
        } else {
          console.error("Failed to add bank account:", response.data);
          Alert.alert("Error", "Failed to add bank account. Please try again later.");
        }
      } catch (error) {
        console.error("An error occurred while adding bank account:", error);
        // You can set an error state and display an error message to the user
        Alert.alert("Error", "An error occurred while adding bank account. Please try again later.");
      }
    };
    
    

    





  
    const closeModal = () => {
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
             <Text style={styles.modalHeader} >Add Bank Account</Text>
             <Ionicons name="close-outline" size={24} color="grey" marginTop={22} paddingRight={25} onPress={() => setAddBankModalVisible(false)}/>
         </View>
          <Divider />
          <Text style={styles.modalSubText}>
          Set up your bank accounts so you can perform faster withdrawals locally.{'\n'}
          </Text>


          <View>
    <Text style={styles.labelText}>Bank</Text>
    <View style={styles.fieldContainer3}>
      <SelectDropdown
        data={dropdownOptions}
        onSelect={handleSelect}
        buttonTextAfterSelection={(selectedItem) => selectedItem}
        rowTextForSelection={(item) => item}
        buttonStyle={{ borderRadius: 10,    borderColor: 'silver',
        borderWidth: 1, fontFamily: 'karla', width: '85%', marginBottom: 15, }}
        dropdownStyle={{ fontFamily: 'karla' }}
        rowStyle={{ alignSelf: 'flex-start', fontFamily: 'karla' }}
        rowTextStyle={{ textAlign: 'left', fontSize: 16, color: 'black', fontFamily: 'ProductSans' }}
        defaultButtonText="Select Bank" // Placeholder text
        buttonTextStyle={{ color: 'black', fontSize: 16, fontFamily: 'karla', letterSpacing: -0.6 }} // Style for the placeholder text
      />
  </View>

</View>


<View style={styles.fieldContainer2}>
  <Text style={styles.labelText}>Bank Account Number</Text>
  <View style={styles.inputContainer}>
    <TextInput
      style={styles.amountInput}
      placeholder="1234567890"
      keyboardType="numeric"
      maxLength={10}
      onChangeText={handleAccountNumberChange} // Use the modified function
      value={accountNumber}
    />
  </View>
</View>

<View style={styles.fieldContainer2}>
  <Text style={styles.labelText}>
  Account Name  {isLoading ? (
      <ActivityIndicator size="small" color="black" marginTop={2} />
    ) : (
      accountName && accountName !== 'Account not found. Try again.' && (
        <Ionicons name="checkmark-circle-outline" size={18} color="green" marginTop={2} />
      )
    )}
  </Text>
  <View style={{ ...styles.inputContainer, flexDirection: 'row', alignItems: 'center' }}>
    <TextInput
      style={styles.amountInput2}
      keyboardType="email-address"
      value={accountName}
      editable={false}
    />
  </View>
</View>

















        


  
  <Text style={{fontFamily: 'karla', letterSpacing: -0.8, marginBottom: 7, marginTop: 20, alignSelf: 'center', color: 'grey', fontSize: 12,}}>This bank account can only be used by you for receiving money</Text>
  
    


  <View style={styles.buttonsContainer}>
  <TouchableOpacity
    style={{
      ...styles.primaryButton,
      backgroundColor: isAccountNameResolved ? '#4C28BC' : '#BEBEBE', // Change color based on isAccountNameResolved state
    }}
    onPress={handleProceed}
    disabled={!isAccountNameResolved} // Disable the button if accountName is not resolved
  >
    <Text style={{ ...styles.primaryButtonText, color: isAccountNameResolved ? '#fff' : '#555' }}>
      Add Bank Account
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

  },
   

  labelText: {
    fontFamily: 'proxima',
    marginLeft: 3,
    marginBottom: 5,
    textAlign: 'left',
  },

  fieldContainer3: {
    width: '100%',
  },

  fieldContainer2: {
    alignSelf: 'center',
    width: '85%',
  },

  amountInput: {
    color: 'black',
    fontFamily: 'ProductSans',
    backgroundColor: '#fff',
    height: 50,
    width: '100%',
    padding: 10,
    fontSize: 17,
    letterSpacing: 3,
    borderRadius: 5,
    marginBottom: 15,
    borderColor: 'silver',
    borderWidth: 1,
  },

  amountInput2: {
    color: 'black',
    fontFamily: 'karla-italic',
    letterSpacing: -0.6,
    backgroundColor: '#EFEFEF',
    height: 50,
    width: '100%',
    padding: 10,
    fontSize: 17,
    borderRadius: 5,
    marginBottom: 15,
    borderColor: 'silver',
    borderWidth: 1,

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

export default AddBankModal;
