import React, { useState, useEffect } from 'react';
import { Modal, Text, Alert, KeyboardAvoidingView, ActivityIndicator, Keyboard,ScrollView, Image, View, TextInput, TouchableWithoutFeedback, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Divider from '../components/Divider'
import { Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserBankAccounts, updateAccountBalances, } from '../../ReduxActions'; 
import { ipAddress } from '../../constants';
import axios from 'axios';
import LoadingModal from '../components/LoadingModal';
import { MaterialIcons } from '@expo/vector-icons'; // Add this import statement
import bankOptions from '../components/BankOptions';



const WithdrawModal = ({ navigation, withdrawModalVisible, setWithdrawModalVisible }) => {
  const [fromAccount, setFromAccount] = useState('Savings');
  const [toAccount, setToAccount] = useState('Investment'); // You can set the default value to your preferred option

  const [amount, setAmount] = useState('');
  const userInfo = useSelector((state) => state.bank.userInfo);
  const [processing, setProcessing] = useState(false);
  const bankAccounts = useSelector((state) => state.bank.bankAccounts);
  const [selectedBankAccount, setSelectedBankAccount] = useState('');

  const dispatch = useDispatch();
  const [toAccountOptions, setToAccountOptions] = useState(['Investment', 'Bank Account']);
  

// Inside your component function/componentDidMount
useEffect(() => {
  dispatch(fetchUserBankAccounts());
}, []);


const getBackgroundColor = (bankName) => {
  const bank = bankOptions.find((option) => option.name === bankName);
  console.log("Selected Bank:", bankName); // Add this line
  console.log("Selected Bank Color:", bank ? bank.color : "#4C28BC"); // Add this line
  return bank ? bank.color : "#4C28BC"; // Default to your default color
};


console.log("Selected Bank Color:", selectedBankAccount); // A

  const closeModal = () => {
    setWithdrawModalVisible(false);
  };

  const handleAmountPreset = (presetAmount) => {
    setAmount(presetAmount.toLocaleString('en-US'));
  }

  
 

    const handleFromAccountChange = (value) => {
      setFromAccount(value);
    
      // Update the options for the second dropdown (toAccount) based on the selected value
      let updatedToAccountOptions = [];
      if (value === 'Savings') {
        setToAccount('Investment'); // Set the default value to 'Investment'
        updatedToAccountOptions = ['Investment', 'Bank Account'];
      } else if (value === 'Investment') {
        setToAccount('Savings'); // Set the default value to 'Savings'
        updatedToAccountOptions = ['Savings', 'Bank Account'];
      } else if (value === 'Wallet') {
        setToAccount('Savings'); // Set the default value to 'Savings'
        updatedToAccountOptions = ['Savings', 'Investment', 'Bank Account'];
      } else {
        setToAccount(''); // Clear the second field if an unknown value is selected
      }
    
      // Update the toAccountOptions state
      setToAccountOptions(updatedToAccountOptions);
    };

    const clearAmount = () => {
      setAmount('');
    };
  
    
  
    const investmentAmountField = (
      <>
        <Text style={styles.modalSubText2} alignSelf='flex-start' marginTop={20}>Amount</Text>
        <View style={styles.inputContainer2}>
          <Text style={styles.nairaSign}>₦</Text>
          <TextInput
            style={styles.amountInput}
            placeholder="Minimum amount is ₦100,000"
            keyboardType="numeric"
            onChangeText={(value) => handleAmountChange(value)}
            value={amount}
            placeholderTextColor="silver"
            onBlur={() => {
              if (parseInt(amount) < 1000000) {
                Alert.alert('Invalid Amount', 'The minimum amount is ₦100,000. Please enter a valid amount.');
              }
            }}
          />
          {amount !== '' && (
            <TouchableOpacity onPress={clearAmount}>
              <Ionicons name="close-circle-outline" size={24} color="grey" marginRight={10} />
            </TouchableOpacity>
          )}
        </View>
        <View style={styles.presetAmountsContainer}>
                <View style={styles.presetAmountColumn}>
                  <TouchableOpacity style={styles.presetAmountButton} onPress={() => handleAmountButtonPress(100000)}>
                    <Text style={styles.presetAmountText}>100,000</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.presetAmountButton} onPress={() => handleAmountButtonPress(1000000)}>
                    <Text style={styles.presetAmountText}>1,000,000</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.presetAmountColumn}>
                  <TouchableOpacity style={styles.presetAmountButton} onPress={() => handleAmountButtonPress(200000)}>
                    <Text style={styles.presetAmountText}>200,000</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.presetAmountButton} onPress={() => handleAmountButtonPress(2000000)}>
                    <Text style={styles.presetAmountText}>2,000,000</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.presetAmountColumn}>
                  <TouchableOpacity style={styles.presetAmountButton} onPress={() => handleAmountButtonPress(500000)}>
                    <Text style={styles.presetAmountText}>500,000</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.presetAmountButton} onPress={() => handleAmountButtonPress(5000000)}>
                    <Text style={styles.presetAmountText}>5,000,000</Text>
                  </TouchableOpacity>
                </View>
              </View>
      </>
    );
 
  
   
    const savingsAmountField = (
      <>
        <Text style={styles.modalSubText2} alignSelf='flex-start' marginTop={20}>Amount</Text>
        <View style={styles.inputContainer2}>
          <Text style={styles.nairaSign}>₦</Text>
          <TextInput
            style={styles.amountInput}
            placeholder="e.g. ₦20,000"
            keyboardType="numeric"
            onChangeText={(value) => handleAmountChange(value)}
            value={amount}
            placeholderTextColor="silver"
          />
          {amount !== '' && (
            <TouchableOpacity onPress={clearAmount}>
              <Ionicons name="close-circle-outline" size={24} color="grey" marginRight={10} />
            </TouchableOpacity>
          )}
        </View>
       
        <View style={styles.presetAmountsContainer}>
                <View style={styles.presetAmountColumn}>
                  <TouchableOpacity style={styles.presetAmountButton} onPress={() => handleAmountButtonPress(5000)}>
                    <Text style={styles.presetAmountText}>5,000</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.presetAmountButton} onPress={() => handleAmountButtonPress(20000)}>
                    <Text style={styles.presetAmountText}>20,000</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.presetAmountColumn}>
                  <TouchableOpacity style={styles.presetAmountButton} onPress={() => handleAmountButtonPress(10000)}>
                    <Text style={styles.presetAmountText}>10,000</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.presetAmountButton} onPress={() => handleAmountButtonPress(40000)}>
                    <Text style={styles.presetAmountText}>40,000</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.presetAmountColumn}>
                  <TouchableOpacity style={styles.presetAmountButton} onPress={() => handleAmountButtonPress(15000)}>
                    <Text style={styles.presetAmountText}>15,000</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.presetAmountButton} onPress={() => handleAmountButtonPress(100000)}>
                    <Text style={styles.presetAmountText}>100,000</Text>
                  </TouchableOpacity>
                </View>
              </View>
      </>
    );
 


    const handleAddBankAccount = () => {
      navigation.navigate('Bank', { addBankModalVisible: true });
    };
// Define the third field for Bank Account


const bankAccountField = (
  <>
    <Text style={styles.modalSubText2} alignSelf='flex-start' marginTop={20}>Select Bank Account</Text>
    {bankAccounts && bankAccounts.length > 0 ? (
      <View style={styles.inputContainer}>
        <View style={styles.iconContainer}>
          <MaterialIcons 
          name="account-balance" 
          size={28} 
          color={selectedBankAccount ? getBackgroundColor(selectedBankAccount.bank_name) : "#4C28BC"} 
          marginLeft={2} 
          /> 
        </View>
        <View style={styles.dropdown}>
          <Picker
            style={styles.labelItem}
            selectedValue={selectedBankAccount} // Use a selected value for banks
            onValueChange={(value) => {
              setSelectedBankAccount(value);
            }}
          >
            {bankAccounts.map((bankAccount, index) => (
              <Picker.Item
                label={`         ${bankAccount.bank_name} - ${bankAccount.account_name}`}
                value={bankAccount.account_number} // Set the value to the account number
                key={`${bankAccount.account_number}-${index}`}
              />
            ))}
          </Picker>
        </View>
      </View>
    ) : (
      <TouchableOpacity onPress={handleAddBankAccount}>
        <Text style={{ color: 'grey', fontFamily: 'karla-italic', marginBottom: 5, marginTop: 5, marginLeft: 15 }}>No bank accounts added yet...
          <Text style={{ color: '#4C28BC', fontFamily: 'proxima', marginBottom: 5, marginTop: 5, marginLeft: 15 }}>   Add Bank Account Now!</Text>
        </Text>
      </TouchableOpacity>
    )}
  </>
);

  
  

  const handleAmountButtonPress = (presetAmount) => {
    handleAmountPreset(presetAmount);
    // Dismiss the keyboard when the button is pressed
    Keyboard.dismiss();
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };



  

  const handleAmountChange = (value) => {
    const numericValue = parseFloat(value.replace(/,/g, ''));

    if (!isNaN(numericValue) && numericValue > 0 && selectedCard !== '') {
      setAmount(numericValue.toLocaleString('en-US'));
    } else {
      setAmount('');
    }
  };

  

  


  const handleWithdraw = async () => {
    setProcessing(true);
    try {
      console.log('Selected card ID:', selectedCardId);
      console.log('Amount Entered:', amount);

      // Send the QuickSave request to your API using axios
      const response = await axios.post(`${ipAddress}/api/quickinvest/`, // Updated API endpoint
        {
          card_id: selectedCardId,
          amount: parseFloat(amount.replace(/,/g, '')),
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userInfo.token}`,
          },
        }
      );
  
      if (response.status === 200) {
       
        dispatch(updateAccountBalances(responseData.newAccountBalances)); // Dispatch the action here
        // QuickSave was successful, update account balances and transactions
        const responseData = response.data;
        setIsSuccessVisible(true);

        setWithdrawModalVisible(false);
          // Dispatch actions to update Redux store
      
     
      } else {
        // Handle QuickInvest error here and show appropriate alerts
        if (response.status === 400) {
          setProcessing(false);
          // Bad request, possibly due to invalid input
          Alert.alert('Error', 'Invalid input. Please check your data and try again.');
        } else if (response.status === 401) {
          setProcessing(false);
          // Unauthorized, user not authenticated
          Alert.alert('Error', 'You are not authorized. Please login again.');
        } else {
          // Other server errors
          setProcessing(false);
          Alert.alert('Error', 'An error occurred while processing your request. Please try again later.');
        }
      }
    } catch (error) {
      console.error('QuickInvest Error:', error);
      setProcessing(false);
      // Handle network or other errors here and show an appropriate alert
      Alert.alert('Error', 'An error occurred. Please check your network connection and try again.');
    }
  };








  return (
<>
      <Modal
        animationType="slide"
        transparent={true}
        visible={withdrawModalVisible}
        onRequestClose={() => setWithdrawModalVisible(false)}
      >
        <TouchableWithoutFeedback
          onPress={() => {
            Keyboard.dismiss(); // Dismiss the keyboard when tapping outside the modal
            closeModal(); // Optionally, close the modal on outside tap
          }}
          accessible={false} // Disable accessibility for this wrapper
          keyboardShouldPersistTaps="handled" // Ensure taps outside input fields dismiss the keyboard
        >

        <TouchableOpacity
          style={styles.modalContainer}
          activeOpacity={1}
          onPress={closeModal}
        >
          
          <TouchableOpacity
            activeOpacity={1}
            style={styles.modalContent}
            onPress={() => dismissKeyboard()} // Dismiss the keyboard when tapping within the modal
            >


            <ScrollView>  
        <View style={styles.modalContent}>
         <View style={{flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center',  paddingLeft: 30,}}>
             <Text style={styles.modalHeader} >Withdraw</Text>
             <Ionicons name="close-outline" size={24} color="grey" marginTop={22} paddingRight={25} onPress={() => setWithdrawModalVisible(false)}/>
         </View>
          <Divider />

          <Text style={styles.modalSubText}>
          Move money between your accounts or to your bank. <Text style={{fontFamily: 'proxima'}}> </Text> 
          </Text>


          <Text style={styles.modalSubText2} alignSelf='flex-start' marginTop={20}>Withdraw from...</Text>
      <View style={styles.inputContainer}>
        <View style={styles.dropdown}>
          <Picker
            style={styles.labelItem}
            selectedValue={fromAccount}
            onValueChange={(value) => handleFromAccountChange(value)}
          >
            <Picker.Item label="Savings" value="Savings" />
            <Picker.Item label="Investment" value="Investment" />
            <Picker.Item label="Wallet" value="Wallet" />
          </Picker>
        </View>
      </View>

      <Text style={styles.modalSubText2} alignSelf='flex-start' marginTop={20}>Withdraw to...</Text>
      <View style={styles.inputContainer}>
        <View style={styles.dropdown}>
          <Picker
            style={styles.labelItem}
            selectedValue={toAccount}
            onValueChange={(value) => setToAccount(value)}
          >
            {toAccountOptions.map((option) => (
              <Picker.Item key={option} label={option} value={option} />
            ))}
          </Picker>
        </View>
      </View>

        

          {toAccount === 'Investment' && investmentAmountField}
                {toAccount === 'Savings' && savingsAmountField}
                {toAccount === 'Bank Account' && bankAccountField}

            





           <View style={styles.buttonsContainer}>
              <TouchableOpacity
                    style={styles.primaryButton} // Use your existing primary button style
                    onPress={handleWithdraw}
                  >
                    <Ionicons name="arrow-down" size={24} color="white" style={{ marginRight: 10 }} />
                    <Text style={styles.primaryButtonText}>Withdraw</Text>
                  </TouchableOpacity>
                  </View>
                  </View>


            <LoadingModal visible={processing} />

            </ScrollView>


          </TouchableOpacity>
        </TouchableOpacity>
        </TouchableWithoutFeedback>

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
    fontSize: 15,
    fontFamily: 'proxima',
    textAlign: 'center',
    color: 'black',
    textAlign: 'center',
    marginHorizontal: 45,
    marginTop: 5,
    letterSpacing: -0.5,
  },

  modalSubText3: {
    fontSize: 13,
    fontFamily: 'karla-italic',
    textAlign: 'center',
    color: 'black',
    textAlign: 'center',
    marginHorizontal: 45,
    marginTop: 25,
    letterSpacing: -0.2,
  },

  inputContainer: {
    marginTop: 5,
    width: '100%',
    alignItems: 'center',
    
  },

  presetAmountsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 40,
    marginTop: 5,
    marginBottom: 20,

  },
  presetAmountColumn: {
    flex: 1,
    flexDirection: 'column',
  },
  presetAmountButton: {
    backgroundColor: '#DCD1FF', // Background color changed to #DCD1FF
    borderRadius: 5,
    padding: 10,
    margin: 5,
    alignItems: 'center',
  },
  presetAmountText: {
    color: 'black', // Text color changed to #4C28BC
    fontSize: 15,
    fontFamily: 'karla',
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
    marginLeft: 5,
    marginRight: 5,
    borderRadius: 10, // Add border radius here
    overflow: 'hidden', // This ensures that the border radius is applied to the Picker
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
      marginBottom: 5,
      marginLeft: 45,
      alignSelf: 'flex-start'
  },

  labelItem: {
    color: 'black',
    textAlign: 'left',
    marginLeft: -16,
    marginBottom: 30,
    fontFamily: 'karla',
    //backgroundColor: '#fff',
    borderRadius: 10,
  },

  pickerContainer: {
    borderRadius: 10, // Add border radius here
   overflow: 'hidden', // This ensures that the border radius is applied to the Picker
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
    borderWidth: 0.5,
    borderColor: 'silver',
  },

  iconContainer: {
    position: 'absolute', // Use absolute positioning
    left: 10, // Adjust the left position as needed
    top: '50%', // Center vertically
    marginLeft: 45,
    zIndex: 1,
    transform: [{ translateY: -12 }], // Adjust translateY to vertically center the icon
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
    height: 50,
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    paddingLeft: 15,
    paddingRight: 5,
    borderWidth: 0.5,
    borderColor: 'silver',
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
  
  primaryButtonDisabled: {
    flexDirection: 'row',
    backgroundColor: 'grey', // Background color for disabled state
    width: '85%',
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    opacity: 0.7, // Reduce opacity for disabled state
  },
  
  primaryButtonText: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'ProductSans',
    marginRight: 5,
  },

  processingText: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'ProductSans',
    marginRight: 5,
  },



};

export default WithdrawModal;
