import React, { useState, useEffect } from 'react';
import { Modal, Keyboard, Alert, Text, View, TextInput, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Divider from '../components/Divider'
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios'; // Import axios library
import { useDispatch, useSelector } from 'react-redux';
import { ipAddress } from '../../constants';
import { updateSavingsGoal } from '../../ReduxActions';


const SavingsGoalModal = ({ navigation, goalModalVisible, setGoalModalVisible }) => {
  const [frequency, setFrequency] = useState('');
  const [year, setYear] = useState('');
  const [amount, setAmount] = useState('');
  const [isUpdateEnabled, setIsUpdateEnabled] = useState(false); // State for button enabling
  const dispatch = useDispatch(); // Get the dispatch function from Redux
  const userInfo = useSelector(state => state.bank.userInfo); // Get user info from Redux store
  const savingsGoal = useSelector(state => state.bank.savingsGoal); // Get savings goal from Redux store


  useEffect(() => {
    // Enable the "Update" button only when all fields are filled
    if (frequency && year && amount) {
      setIsUpdateEnabled(true);
    } else {
      setIsUpdateEnabled(false);
    }
  }, [frequency, year, amount]);



  const handleUpdateSavingsGoal = async () => {
    try {
      // Check if userInfo and token are available
      if (!userInfo || !userInfo.token) {
        console.error('User info or token is missing');
        return;
      }
  
      // Prepare data for the API call
      const data = {
        preferred_asset: frequency,
        savings_goal_amount: amount,
        time_period: year,
      };
  
      // Make the API call
      const response = await axios.put(
        `${ipAddress}/api/update-savings-goal/`,
        data,
        {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
            'Content-Type': 'application/json',
          },
        }
      );
  
      if (response.data && response.data.preferred_asset) {
        // Update context states with the data from the response
        dispatch(updateSavingsGoal(data));

      }
      // Ensure the API response contains the expected data structure
      if (!response.data || typeof response.data !== 'object') {
        console.error('Invalid API response format');
        return;
      }
  
      const monthlySavingsNeeded = Math.round(
        response.data.savings_goal_amount / (response.data.time_period * 12)
      );
      
      const successMessage = `You need to be saving ₦${
        monthlySavingsNeeded.toLocaleString() // Add commas automatically
      } per month to achieve your goal of ₦${
        Math.round(response.data.savings_goal_amount).toLocaleString() // Add commas automatically
      } for your ${response.data.preferred_asset} investment in ${
        response.data.time_period
      } years. Keep saving to reach your goal!`;
      
      Alert.alert('Savings Goal Updated!', successMessage);
      
    
      // Close the modal
      setGoalModalVisible(false);
  
      // Navigate to the Save screen
      navigation.navigate('Save'); // Replace 'Save' with the correct screen name
    } catch (error) {
      console.error('Error updating savings goal:', error);
    }
  };





  const handleAmountChange = (value) => {
    const numericValue = parseFloat(value.replace(/,/g, ''));

    if (!isNaN(numericValue) && numericValue > 0 && selectedCard !== '') {
      setAmount(numericValue.toLocaleString('en-US'));
    } else {
      setAmount('');
    }
  };

  const handleAmountPreset = (presetAmount) => {
    setAmount(presetAmount.toLocaleString('en-US'));
  }

  const clearAmount = () => {
    setAmount('');
  };
  
  const handleAmountButtonPress = (presetAmount) => {
    handleAmountPreset(presetAmount);
    // Dismiss the keyboard when the button is pressed
    Keyboard.dismiss();
  };



  const closeModal = () => {
    setGoalModalVisible(false);
  };
  
  
   return (
    <>
    <Modal
      animationType="slide"
      transparent={true}
      visible={goalModalVisible}
      onRequestClose={() => setGoalModalVisible(false)}
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
             <Text style={styles.modalHeader} >Update Savings Goal</Text>
             <Ionicons name="close-outline" size={24} color="grey" marginTop={22} paddingRight={25} onPress={() => setGoalModalVisible(false)}/>
         </View>
          <Divider />
          <Text style={styles.modalSubText}>
          Hey {userInfo?.firstName ? `${userInfo.firstName},` : ''} As part of helping you grow your funds to own properties and developing your savings habit, you'll need to set a savings goal. {'\n'}
            {'\n'}<Text style={{fontFamily: 'proxima'}}>Preferred Asset</Text>
          </Text>
          
          <View style={styles.dropdown}>
              <Picker
                style={styles.labelItem}
                selectedValue={frequency}
                onValueChange={(value) => setFrequency(value)}
              >
                <Picker.Item color='#4C28BC' label="Select asset..." value="Select Asset" />
                <Picker.Item label="Real Estate (MyFund Hostels)" value="Real Estate" />
                <Picker.Item label="Paper Assets" value="Paper Assets" />
              </Picker>
            </View>
        
            <Text style={{fontFamily: 'proxima', marginTop: 7, marginLeft: 40, alignSelf: 'flex-start'}}>How much are you planning to save for it?</Text>
            
            <View style={styles.inputContainer2}>
                <Text style={styles.nairaSign}>₦</Text>
                <TextInput
                  style={styles.amountInput}
                  placeholder="Minimum amount is 1,000,000"
                  keyboardType="numeric"
                  onChangeText={(value) => handleAmountChange(value)}
                  value={amount}
                  placeholderTextColor="silver"

                  onBlur={() => {
                    if (parseInt(amount) < 1000000) {
                      Alert.alert('Invalid Amount', 'The minimum amount is 1,000,000. Please enter a valid amount.');
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
                  <TouchableOpacity style={styles.presetAmountButton} onPress={() => handleAmountButtonPress(1000000)}>
                    <Text style={styles.presetAmountText}>1,000,000</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.presetAmountButton} onPress={() => handleAmountButtonPress(10000000)}>
                    <Text style={styles.presetAmountText}>10,000,000</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.presetAmountColumn}>
                  <TouchableOpacity style={styles.presetAmountButton} onPress={() => handleAmountButtonPress(2000000)}>
                    <Text style={styles.presetAmountText}>2,000,000</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.presetAmountButton} onPress={() => handleAmountButtonPress(15000000)}>
                    <Text style={styles.presetAmountText}>15,000,000</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.presetAmountColumn}>
                  <TouchableOpacity style={styles.presetAmountButton} onPress={() => handleAmountButtonPress(5000000)}>
                    <Text style={styles.presetAmountText}>5,000,000</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.presetAmountButton} onPress={() => handleAmountButtonPress(30000000)}>
                    <Text style={styles.presetAmountText}>30,000,000</Text>
                  </TouchableOpacity>
                </View>
              </View>



            <Text style={{fontFamily: 'proxima', marginTop: 15, marginLeft: 40, alignSelf: 'flex-start'}}>How long will it take you?</Text>
          <View style={styles.inputContainer}>
            <View style={styles.dropdown}>
              <Picker
                style={styles.labelItem}
                selectedValue={year}
                onValueChange={(value) => setYear(value)}
              >
                <Picker.Item color='blue' label="Select number of years..." value="Select years" />
                <Picker.Item label="1 year" value="1" />
                <Picker.Item label="2 years" value="2" />
                <Picker.Item label="3 years" value="3" />
                <Picker.Item label="4 years" value="4" />
                <Picker.Item label="5 years" value="5" />
                <Picker.Item label="6 years" value="6" />
                <Picker.Item label="7 years" value="6" />
                <Picker.Item label="8 years" value="6" />
                <Picker.Item label="9 years" value="9" />
                <Picker.Item label="10 years" value="10" />

              </Picker>
            </View>
          </View>
 
            <View style={styles.buttonsContainer}>
            <TouchableOpacity
                style={[
                  styles.primaryButton,
                  isUpdateEnabled ? {} : { backgroundColor: 'grey' }, // Disable button style
                ]}
                onPress={handleUpdateSavingsGoal}
                disabled={!isUpdateEnabled} // Disable button if not enabled
              >
                <Ionicons
                  name="arrow-up-outline"
                  size={24}
                  color="#fff"
                  style={{ marginRight: 4 }}
                />
                <Text style={styles.primaryButtonText}>Update Savings Goal</Text>
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
    color: 'black',
    textAlign: 'left',
    marginLeft: -16,
    marginBottom: 30,
    fontFamily: 'karla',
    backgroundColor: '#fff',
    borderRadius: 10,
  },

  labelItem2: {
    color: 'black',
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
    letterSpacing: -0.5
  },


  dropdown: {
    height: 45,
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    marginBottom: 15,
    paddingLeft: 15,
    paddingRight: 5,
    color: 'red',


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

export default SavingsGoalModal;
