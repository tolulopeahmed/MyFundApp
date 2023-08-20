import React, { useState, useEffect } from 'react';
import { Modal, Alert, Text, View, TextInput, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Divider from '../components/Divider'
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios'; // Import axios library
import { useUserContext } from '../../UserContext';
import { ipAddress } from '../../constants';


const SavingsGoalModal = ({ navigation, goalModalVisible, setGoalModalVisible }) => {
  const [frequency, setFrequency] = useState('');
  const [year, setYear] = useState('');
  const [amount, setAmount] = useState('');
  const { userInfo, setUserInfo, setSavingsGoal } = useUserContext();
  const [isUpdateEnabled, setIsUpdateEnabled] = useState(false); // State for button enabling
  const [formattedAmount, setFormattedAmount] = useState('');


  useEffect(() => {
    // Enable the "Update" button only when all fields are filled
    if (frequency && year && amount) {
      setIsUpdateEnabled(true);
    } else {
      setIsUpdateEnabled(false);
    }
  }, [frequency, year, amount]);



  const updateSavingsGoal = async () => {
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
        setUserInfo(prevUserInfo => ({
          ...prevUserInfo,
          preferred_asset: response.data.preferred_asset,
          savings_goal_amount: response.data.savings_goal_amount,
          time_period: response.data.time_period,
        }));
  
        setSavingsGoal({
          preferred_asset: response.data.preferred_asset,
          savings_goal_amount: response.data.savings_goal_amount,
          time_period: response.data.time_period,
        });
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
      
      setSavingsGoal({
        preferred_asset: frequency,
        savings_goal_amount: amount,
        time_period: year,
      });

      // Update the corresponding userInfo properties in the context
    setUserInfo(prevUserInfo => ({
      ...prevUserInfo,
      preferred_asset: frequency,
      savings_goal_amount: amount,
      time_period: year,
    }));
  
      // Close the modal
      setGoalModalVisible(false);
  
      // Navigate to the Save screen
      navigation.navigate('Save'); // Replace 'Save' with the correct screen name
    } catch (error) {
      console.error('Error updating savings goal:', error);
    }
  };




  const handleAmountChange = (value) => {
    // Remove any non-numeric characters from the input
    const formattedValue = value.replace(/[^0-9]/g, '');
  
    // Add commas as thousands separators to the formatted value
    const numberWithCommas = formattedValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  
    setAmount(formattedValue); // Store the value without commas
    setFormattedAmount(numberWithCommas); // Store the formatted value for display
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
          As part of helping you grow your funds to own properties and developing your savings habit, you'll need to set a savings goal. {'\n'}
            {'\n'}<Text style={{fontFamily: 'proxima'}}>Preferred Asset</Text>
          </Text>
          
          <View style={styles.dropdown}>
              <Picker
                style={styles.labelItem}
                selectedValue={frequency}
                onValueChange={(value) => setFrequency(value)}
              >
                <Picker.Item color='blue' label="Select Asset" value="Select Asset" />
                <Picker.Item label="Real Estate" value="Real Estate" />
                <Picker.Item label="Paper Assets" value="Paper Assets" />
              </Picker>
            </View>
        
            <Text style={{fontFamily: 'proxima', marginTop: 7, marginLeft: 40, alignSelf: 'flex-start'}}>How much are you planning to save for it?</Text>

            <TextInput
              style={styles.amountInput}
              placeholder="Minimum amount is 1,000,000"
              keyboardType="numeric"
              onChangeText={(value) => handleAmountChange(value)}
              value={formattedAmount} // Display the formatted value
            />


            <Text style={{fontFamily: 'proxima', marginTop: 7, marginLeft: 40, alignSelf: 'flex-start'}}>How long will it take you?</Text>
          <View style={styles.inputContainer}>
            <View style={styles.dropdown}>
              <Picker
                style={styles.labelItem}
                selectedValue={year}
                onValueChange={(value) => setYear(value)}
              >
                <Picker.Item color='blue' label="Select number of years" value="Select years" />
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
                onPress={updateSavingsGoal}
                disabled={!isUpdateEnabled} // Disable button if not enabled
              >
                <Ionicons
                  name="arrow-up-outline"
                  size={24}
                  color="#fff"
                  style={{ marginRight: 4 }}
                />
                <Text style={styles.primaryButtonText}>Update</Text>
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

  amountInput: {
    color: 'black',
    textAlign: 'left',
    marginLeft: -5,
    fontFamily: 'ProductSans',
    backgroundColor: '#fff',
    borderRadius: 10,
    height: 50,
    width: "80%",
    padding: 10,
    marginTop: 5,
    borderRadius: 10,
    fontSize: 18,
    letterSpacing: -0.5,
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
