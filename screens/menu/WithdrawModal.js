import React, { useState, useEffect } from 'react';
import { Modal, Text, Alert, KeyboardAvoidingView, ActivityIndicator, Keyboard,ScrollView, Image, View, TextInput, TouchableWithoutFeedback, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Divider from '../components/Divider'
import { Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserBankAccounts, updateAccountBalances, fetchUserTransactions, fetchAccountBalances} from '../../ReduxActions'; 
import { ipAddress } from '../../constants';
import axios from 'axios';
import LoadingModal from '../components/LoadingModal';
import { MaterialIcons } from '@expo/vector-icons'; // Add this import statement
import bankOptions from '../components/BankOptions'; // Add this import statement


const WithdrawModal = ({ navigation, withdrawModalVisible, setWithdrawModalVisible, setIsSuccessVisible, defaultFromAccount }) => {
  const [fromAccount, setFromAccount ] = useState(defaultFromAccount.toLowerCase()); // Set the default account from prop
  const [toAccount, setToAccount] = useState('Investment'); // You can set the default value to your preferred option

  const [amount, setAmount] = useState('');
  const userInfo = useSelector((state) => state.bank.userInfo);
  const [processing, setProcessing] = useState(false);
  const bankAccounts = useSelector((state) => state.bank.bankAccounts);
  const [selectedBankName, setSelectedBankName] = useState(''); // New state variable to hold the selected bank's name
  const accountBalances = useSelector((state) => state.bank.accountBalances);
  const [setBankAccounts] = useState([]);

  const dispatch = useDispatch();
  const [toAccountOptions, setToAccountOptions] = useState(['Investment', 'Bank Account']);
  const [withdrawButtonDisabled, setWithdrawButtonDisabled] = useState(true); // State to control the button disabled state
  const [selectedBankAccountId, setSelectedBankAccountId] = useState(null); // Initialize with null or another suitable default value
  const [userEmail, setUserEmail] = useState('');

// Inside your component function/componentDidMount
useEffect(() => {
  dispatch(fetchUserBankAccounts());
}, []);

console.log('userInfo.token in WithdrawModal:', userInfo.token);


const getBackgroundColor = (selectedBankName) => {
  console.log("Selected bank name:", selectedBankName); // Debugging statement
  const bank = selectedBankName ? bankOptions.find((option) => option.name === selectedBankName) : null; // Check if selectedBankName is defined
  console.log("Bank:", bank); // Debugging statement
  return bank ? bank.color : "#4C28BC"; // Default to your default color if not found
};






useEffect(() => {
  if (selectedBankAccountId !== null) { // Add this check
    const selectedBankAccount = bankAccounts ? bankAccounts.find(account => account.id === selectedBankAccountId) : null;
    if (selectedBankAccount) {
      setSelectedBankName(selectedBankAccount.bank_name);
    }
  }
  console.log("Selected Bank Account ID:", selectedBankAccountId);
}, [bankAccounts, selectedBankAccountId]);




useEffect(() => {
  if (bankAccounts && bankAccounts.length > 0) {
    setSelectedBankAccountId(bankAccounts[0].id);
    setSelectedBankName(bankAccounts[0].bank_name); // Initialize selectedBankName
  } else {
    setSelectedBankAccountId(null);
    setSelectedBankName(''); // Set it to an appropriate default value
    console.log("No bank accounts available.");
  }
}, [bankAccounts]);



const handleUserEmailChange = (value) => {
  setUserEmail(value);
};





  const closeModal = () => {
    setWithdrawModalVisible(false);
  };

  const handleAmountPreset = (presetAmount) => {
    setAmount(presetAmount.toLocaleString('en-US'));
  }

  
  useEffect(() => {
  }, [fromAccount, toAccount]);
 

    const handleFromAccountChange = (value) => {
      setFromAccount(value);
    
      // Update the options for the second dropdown (toAccount) based on the selected value
      let updatedToAccountOptions = [];
      if (value === 'savings') {
        setToAccount('Investment'); // Set the default value to 'Investment'
        updatedToAccountOptions = ['Investment', 'Bank Account'];
      } else if (value === 'investment') {
        setToAccount('Savings'); // Set the default value to 'Savings'
        updatedToAccountOptions = ['Savings', 'Bank Account'];
      } else if (value === 'wallet') {
        setToAccount('Savings'); // Set the default value to 'Savings'
        updatedToAccountOptions = ['Savings', 'Investment', 'Bank Account', 'Another User']; // Add "Another User" option
      } else {
        setToAccount(''); // Clear the second field if an unknown value is selected
      }
    
      // Update the toAccountOptions state
      setToAccountOptions(updatedToAccountOptions);
    };


    useEffect(() => {
      // Check if the amount is empty, and update the button disabled state accordingly
      if (amount === '') {
        setWithdrawButtonDisabled(true);
      } else {
        setWithdrawButtonDisabled(false);
      }
    }, [amount]);



    const clearAmount = () => {
      setAmount('');
    };
    const clearEmail = () => {
      setUserEmail('');
    };

    const renderPresetAmounts = (amounts) => {
      const rows = [];
      for (let i = 0; i < amounts.length; i += 2) {
        const row = amounts.slice(i, i + 2);
        rows.push(row);
      }
    
      return (
        <View style={styles.presetAmountsContainer}>
          {rows.map((row, rowIndex) => (
            <View style={styles.presetAmountColumn} key={rowIndex}>
              {row.map((presetAmount, index) => (
                <TouchableOpacity style={styles.presetAmountButton} key={index} onPress={() => handleAmountButtonPress(presetAmount)}>
                  <Text style={styles.presetAmountText}>{presetAmount.toLocaleString()}</Text>
                </TouchableOpacity>
              ))}
            </View>
          ))}
        </View>
      );
    };
    
    
    const presetAmounts = [5000, 20000, 10000, 40000, 15000, 100000];

    
  
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
              value={amount} // Set the value to the state variable 'amount'
              placeholderTextColor="silver"
              onBlur={() => {
                if (parseInt(amount.replace(/,/g, '')) < 100000) {
                  Alert.alert(
                    'Invalid Amount',
                    'The minimum amount is ₦100,000. Please enter a valid amount.'
                  );
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
            keyboardType="decimal-pad" // Change this line
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

        {renderPresetAmounts(presetAmounts)}

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
          color={selectedBankName ? getBackgroundColor(selectedBankName) : "#4C28BC"} // Check if selectedBankName is defined
          marginLeft={2} 
          /> 
        </View>
        <View style={styles.dropdown}>
          <Picker
            style={styles.labelItem}
            selectedValue={selectedBankAccountId} // Use the state variable here
            onValueChange={(value) => {
              setSelectedBankAccountId(value); // Update the selected bank account ID
            }}
          >
            {bankAccounts.map((bankAccount, index) => (
              <Picker.Item
                label={`         ${bankAccount.bank_name} - ${bankAccount.account_name}`}
                value={bankAccount.id} // Convert ID to a string
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
       
            {renderPresetAmounts(presetAmounts)}

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
    // Remove any non-numeric characters except for the decimal point
    const numericValue = value.replace(/[^0-9.]/g, '');
  
    // Check if the numericValue is empty or NaN
    if (numericValue === '' || isNaN(parseFloat(numericValue))) {
      // If empty or NaN, set the amount to an empty string
      setAmount('');
    } else {
      // Ensure there is only one decimal point in the value
      const parts = numericValue.split('.');
      
      if (parts.length === 1) {
        // No decimal point, format as integer
        setAmount(parseFloat(parts[0]).toLocaleString('en-US'));
      } else if (parts.length === 2) {
        // One decimal point, format with 2 decimal places
        const integerPart = parseFloat(parts[0]).toLocaleString('en-US');
        const decimalPart = parts[1].substring(0, 2); // Maximum 2 decimal places
        setAmount(`${integerPart}.${decimalPart}`);
      }
    }
  };
  
  
  
  
  
  
  
  
  
  
  
  



  

  const handleWithdraw = async () => {
    setProcessing(true);
    console.log("From Account (in handleWithdraw):", fromAccount);
    console.log("To Account (in handleWithdraw):", toAccount);
  
    if (fromAccount === 'Savings' && toAccount === 'Investment') {
      handleSavingsToInvestmentTransfer();
    } else if (fromAccount === 'investment' && toAccount === 'Savings') {
      handleInvestmentToSavingsTransfer();
    } else if (fromAccount === 'wallet' && toAccount === 'Savings') {
      handleWalletToSavingsTransfer();
    } else if (fromAccount === 'wallet' && toAccount === 'Investment') {
      handleWalletToInvestmentTransfer();
    } else if (fromAccount === 'wallet' && toAccount === 'Another User') {
      transferToWallet();
    } else {
      handleTransferToBankAccount();
    }
  };
  
  
  




  console.log('Amount Entered:', amount); // Log the requestData

  const handleSavingsToInvestmentTransfer = async () => {
    try {
      const requestedAmount = parseFloat(amount.replace(/,/g, ''));
      const savingsBalance = accountBalances.savings; // Replace with the actual balance value from your state
  
      if (requestedAmount > savingsBalance) {
        // Display an alert for insufficient balance
        Alert.alert('Insufficient Balance', 'You do not have enough balance in your SAVINGS account for this withdrawal.');
        return;
      }
  
      // Prepare the data to send to the backend API
      const requestData = {
        amount: requestedAmount,
      };
  
      console.log('Request Data:', requestData); // Log the requestData
  
      const response = await axios.post(
        `${ipAddress}/api/savings-to-investment/`,
        requestData,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userInfo.token}`,
          },
        }
      );
  
      console.log('API Response:', response); // Log the API response
  
      if (response.status === 200) {
     
        const responseData = response.data;
        dispatch(updateAccountBalances(responseData.newAccountBalances));  
        dispatch(fetchAccountBalances()); // Add this line   
        dispatch(fetchUserTransactions()); // Add this line
 
        setIsSuccessVisible(true);
        setWithdrawModalVisible(false);
        setProcessing(false);

      } else {
        // Handle API errors here and show appropriate alerts
        if (response.status === 400) {
          setProcessing(false);
          Alert.alert('Error', 'Invalid input. Please check your data and try again.');
        } else if (response.status === 401) {
          setProcessing(false);
          Alert.alert('Error', 'You are not authorized. Please login again.');
        } else {
          setProcessing(false);
          Alert.alert('Error', 'An error occurred while processing your request. Please try again later.');
        }
      }
    } catch (error) {
      console.error('Savings to Investment Transfer Error:', error);
      // Handle network or other errors here and show an appropriate alert
      Alert.alert('Error', 'An error occurred. Please check your network connection and try again.');
    } finally {
      // Reset the processing state
      setProcessing(false);
    }
  };



  const handleInvestmentToSavingsTransfer = async () => {
    try {
      const requestedAmount = parseFloat(amount.replace(/,/g, ''));
      const investmentBalance = accountBalances.investment; // Replace with the actual balance value from your state
  
      if (requestedAmount > investmentBalance) {
        // Display an alert for insufficient balance
        Alert.alert('Insufficient Balance', 'You do not have enough balance in your INVESTMENT account for this withdrawal.');
        return;
      }
  
      // Prepare the data to send to the backend API
      const requestData = {
        amount: requestedAmount,
      };
  
      console.log('Request Data:', requestData); // Log the requestData
  
      const response = await axios.post(
        `${ipAddress}/api/investment-to-savings/`,
        requestData,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userInfo.token}`,
          },
        }
      );
  
      console.log('API Response:', response); // Log the API response
  
      if (response.status === 200) {
     
        const responseData = response.data;
        dispatch(updateAccountBalances(responseData.newAccountBalances));  
        dispatch(fetchAccountBalances()); // Add this line 
        dispatch(fetchUserTransactions()); // Add this line
   
        setIsSuccessVisible(true);
        setWithdrawModalVisible(false);
        setProcessing(false);

      } else {
        // Handle API errors here and show appropriate alerts
        if (response.status === 400) {
          setProcessing(false);
          Alert.alert('Error', 'Invalid input. Please check your data and try again.');
        } else if (response.status === 401) {
          setProcessing(false);
          Alert.alert('Error', 'You are not authorized. Please login again.');
        } else {
          setProcessing(false);
          Alert.alert('Error', 'An error occurred while processing your request. Please try again later.');
        }
      }
    } catch (error) {
      console.error('Savings to Investment Transfer Error:', error);
      // Handle network or other errors here and show an appropriate alert
      Alert.alert('Error', 'An error occurred. Please check your network connection and try again.');
    } finally {
      // Reset the processing state
      setProcessing(false);
    }
  };
  
  
  

  const handleWalletToSavingsTransfer = async () => {
    try {
      const requestedAmount = parseFloat(amount.replace(/,/g, ''));
      const walletBalance = accountBalances.wallet; // Replace with the actual balance value from your state
  
      if (requestedAmount > walletBalance) {
        // Display an alert for insufficient balance
        Alert.alert('Insufficient Balance', 'You do not have enough balance in your WALLET for this withdrawal.');
        return;
      }
  
      // Prepare the data to send to the backend API
      const requestData = {
        amount: requestedAmount,
      };
  
      console.log('Request Data:', requestData); // Log the requestData
  
      const response = await axios.post(
        `${ipAddress}/api/wallet-to-savings/`,
        requestData,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userInfo.token}`,
          },
        }
      );
  
      console.log('API Response:', response); // Log the API response
  
      if (response.status === 200) {
     
        const responseData = response.data;
        dispatch(updateAccountBalances(responseData.newAccountBalances));  
        dispatch(fetchAccountBalances()); // Add this line   
        dispatch(fetchUserTransactions()); // Add this line
        setIsSuccessVisible(true);
        setWithdrawModalVisible(false);
        setProcessing(false);

      } else {
        // Handle API errors here and show appropriate alerts
        if (response.status === 400) {
          setProcessing(false);
          Alert.alert('Error', 'Invalid input. Please check your data and try again.');
        } else if (response.status === 401) {
          setProcessing(false);
          Alert.alert('Error', 'You are not authorized. Please login again.');
        } else {
          setProcessing(false);
          Alert.alert('Error', 'An error occurred while processing your request. Please try again later.');
        }
      }
    } catch (error) {
      console.error('Savings to Investment Transfer Error:', error);
      // Handle network or other errors here and show an appropriate alert
      Alert.alert('Error', 'An error occurred. Please check your network connection and try again.');
    } finally {
      // Reset the processing state
      setProcessing(false);
    }
  };


  
  const handleWalletToInvestmentTransfer = async () => {
    try {
      const requestedAmount = parseFloat(amount.replace(/,/g, ''));
      const walletBalance = accountBalances.wallet; // Replace with the actual balance value from your state
  
      if (requestedAmount > walletBalance) {
        // Display an alert for insufficient balance
        Alert.alert('Insufficient Balance', 'You do not have enough balance in your WALLET for this withdrawal.');
        return;
      }
  
      // Prepare the data to send to the backend API
      const requestData = {
        amount: requestedAmount,
      };
  
      console.log('Request Data:', requestData); // Log the requestData
  
      const response = await axios.post(
        `${ipAddress}/api/wallet-to-savings/`,
        requestData,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userInfo.token}`,
          },
        }
      );
  
      console.log('API Response:', response); // Log the API response
  
      if (response.status === 200) {
     
        const responseData = response.data;
        dispatch(updateAccountBalances(responseData.newAccountBalances));  
        dispatch(fetchAccountBalances()); // Add this line   
        dispatch(fetchUserTransactions()); // Add this line
        setIsSuccessVisible(true);
        setWithdrawModalVisible(false);
        setProcessing(false);

      } else {
        // Handle API errors here and show appropriate alerts
        if (response.status === 400) {
          setProcessing(false);
          Alert.alert('Error', 'Invalid input. Please check your data and try again.');
        } else if (response.status === 401) {
          setProcessing(false);
          Alert.alert('Error', 'You are not authorized. Please login again.');
        } else {
          setProcessing(false);
          Alert.alert('Error', 'An error occurred while processing your request. Please try again later.');
        }
      }
    } catch (error) {
      console.error('Savings to Investment Transfer Error:', error);
      // Handle network or other errors here and show an appropriate alert
      Alert.alert('Error', 'An error occurred. Please check your network connection and try again.');
    } finally {
      // Reset the processing state
      setProcessing(false);
    }
  };






  const formattedAmount = parseFloat(amount.replace(/,/g, '')).toFixed(2);

    const handleTransferToBankAccount = async () => {
      setProcessing(true);    
      try {
        // Prepare the request data based on user selections
        const requestData = {
          source_account: fromAccount,
          target_bank_account_id: selectedBankAccountId, // Use the selected bank account ID
          amount: formattedAmount, // Use the formatted amount
        };
    
        console.log('formatted Amount in api call:', formattedAmount); // Log the API response
        console.log('Request Data:', requestData);

        const response = await axios.post(
          `${ipAddress}/api/withdraw-to-bank/`,
          requestData,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${userInfo.token}`,
            },
          }
        );
    
        // Handle the API response
        if (response.status === 200) {
          const responseData = response.data;
          console.log('API Response:', response.data);

          dispatch(updateAccountBalances(responseData.newAccountBalances));
          dispatch(fetchAccountBalances());
          dispatch(fetchUserTransactions());
          setIsSuccessVisible(true);
          setWithdrawModalVisible(false);
          setProcessing(false);
          // Show a success message to the user
          Alert.alert('Success', 'Withdrawal to local bank successful.');
        } else {
          // Handle API errors and show appropriate error messages
          if (response.status === 400) {
            setProcessing(false);
            Alert.alert('Error', 'Invalid input. Please check your data and try again.');
          } else if (response.status === 401) {
            setProcessing(false);
            Alert.alert('Error', 'You are not authorized. Please login again.');
          } else if (response.status === 402) {
            setProcessing(false);
            Alert.alert('Error', 'Insufficient balance. You do not have enough funds for this withdrawal.');
          } else {
            setProcessing(false);
            Alert.alert('Error', 'An error occurred while processing your request. Please try again later.');
          }
        }
      } catch (error) {
        // Handle network or other errors and show an appropriate error message
        setProcessing(false);
        Alert.alert('Error', 'An error occurred. Please check your network connection and try again.');
      }
    };


    
    const transferToWallet = async () => {
      try {
        const requestedAmount = parseFloat(amount.replace(/,/g, ''));
        if (!isValidEmail(userEmail)) {
          // Check for invalid email format
          Alert.alert('Send Error', "Invalid email format. Please enter a valid email.");
          return;
        }
    
        if (userEmail === userInfo.email) {
          // User is trying to send money to themselves
          Alert.alert('Send Error', "You cannot send money to yourself. Please enter another user's email");
          return;
        }
    
        // Prepare the data to send to the backend API
        const requestData = {
          recipient_email: userEmail,  // Replace with the recipient's email
          amount: requestedAmount,
        };
    
        console.log('Request Data:', requestData);
    
        const response = await axios.post(
          `${ipAddress}/api/wallet-to-wallet/`,
          requestData,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${userInfo.token}`,
            },
          }
        );
    
        console.log('API Response:', response);
    
        if (response.status === 200) {
          const responseData = response.data;
          // Handle success, e.g., show a success message
          setIsSuccessVisible(true);
          setWithdrawModalVisible(false);
          setProcessing(false);
          dispatch(updateAccountBalances(responseData.newAccountBalances));
          dispatch(fetchAccountBalances());
          dispatch(fetchUserTransactions());
          Alert.alert('Success!', `You've successfully transferred N${requestedAmount} to ${userEmail}.`);
        }
      } catch (error) {
        console.error('Wallet Transfer Error:', error);
        setProcessing(false); // Reset the processing state
    
        if (error.response && error.response.status === 404) {
          // Handle the case when the recipient email is not found
          Alert.alert('User Not Found!', 'Recipient email not found on the platform. Please check the email and try again.');
        } else if (error.response && error.response.status === 400) {
          // Handle API errors when the input is invalid
          Alert.alert('Error', 'Invalid input. Please check your entry and try again.');
        } else if (error.response && error.response.status === 401) {
          // Handle unauthorized access
          Alert.alert('Error', 'You are not authorized. Please login again.');
        } else if (error.response && error.response.status === 500) {
          // Handle other API errors and show an appropriate alert
          Alert.alert('Error', 'An error occurred while processing your request. Please try again later.');
        } else {
          // Handle other unanticipated errors
          Alert.alert('Error', 'An error occurred. Please check your network connection and try again.');
        }
      }
    };
    
    

    const isValidEmail = (email) => {
      // Regular expression to check for a valid email format
      const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
      return emailRegex.test(email);
    };
    
    
    console.log('formatted Amount:', amount); // Log the API response
    console.log('recipient_email::', userEmail); // Log the API response
    console.log('fromAccount::', fromAccount); // Log the API response
    console.log('toAccount::', toAccount); // Log the API response
    console.log('sender Email::', userInfo.email); // Log the API response








    
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
              <Picker.Item label={`Savings (₦${Math.floor(accountBalances.savings).toLocaleString()})`} value="savings" />
              <Picker.Item label={`Investment (₦${Math.floor(accountBalances.investment).toLocaleString()})`} value="investment" />
              <Picker.Item label={`Wallet (₦${Math.floor(accountBalances.wallet).toLocaleString()})`} value="wallet" />
            </Picker>

        </View>
      </View>

      <Text style={styles.modalSubText2} alignSelf='flex-start' marginTop={20}>Withdraw to...</Text>
      <View style={styles.inputContainer}>
        <View style={styles.dropdown}>
            <Picker
              style={styles.labelItem}
              selectedValue={toAccount}
              onValueChange={(value) => {
                setToAccount(value);
                console.log("Value of ToAccount field when changed:", value); // Moved outside the callback
              }}
            >
              {toAccountOptions.map((option) => (
                <Picker.Item key={option} label={option} value={option} />
              ))}
            </Picker>

        </View>
      </View>

        

          {toAccount === 'Investment' && investmentAmountField}
                {toAccount === 'Savings' && savingsAmountField}
                {toAccount === 'Bank Account' && bankAccountField }
                {toAccount === 'Another User' && (
                  <>
                    <Text style={styles.modalSubText2} alignSelf='flex-start' marginTop={20}>Enter User's Email</Text>
                    <View style={styles.inputContainer2}>
                      <TextInput
                        style={styles.amountInput}
                        placeholder="Make sure the email is correct"
                        keyboardType="email-address"
                        onChangeText={(value) => handleUserEmailChange(value)}
                        value={userEmail}
                        placeholderTextColor="silver"
                      />
                          {userEmail !== '' && (
                        <TouchableOpacity onPress={clearEmail}>
                          <Ionicons name="close-circle-outline" size={24} color="grey" marginRight={10} />
                        </TouchableOpacity>
                      )}
                    </View>
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
                    {renderPresetAmounts(presetAmounts)}

                  </>
                )}
            





           <View style={styles.buttonsContainer}>
           <TouchableOpacity
                    style={[
                      styles.primaryButton,
                      {
                        backgroundColor: withdrawButtonDisabled ? 'grey' : '#4C28BC',
                      },
                    ]}
                    onPress={handleWithdraw}
                    disabled={withdrawButtonDisabled}
                  >
                    {processing ? (
                      <><ActivityIndicator color="white" style={styles.activityIndicator} /> 
                      <Text style={styles.primaryButtonText}>  Processing... Please wait...</Text>
                      </>
                    ) : (
                      <>
                        {toAccount === "Another User" ? (
                          <Ionicons name="send" size={21} color="white" style={{ marginRight: 10 }} />
                        ) : (
                          <Ionicons name="arrow-down" size={24} color="white" style={{ marginRight: 10 }} />
                        )}
                        <Text style={styles.primaryButtonText}>
                          {toAccount === "Another User" ?   " Send to User" : "Withdraw"}
                        </Text>
                      </>
                    )}
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
    width: '105%',
    alignItems: 'center',
    alignSelf: 'center',
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
    marginTop: 35,
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
