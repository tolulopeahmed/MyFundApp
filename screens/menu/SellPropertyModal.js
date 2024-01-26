import React, { useState, useEffect } from 'react';
import { Modal, Text, TouchableOpacity, View, TextInput, ScrollView, Keyboard, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSelector, useDispatch } from 'react-redux';
import { updateAccountBalances, fetchUserTransactions, fetchAccountBalances } from '../../ReduxActions';
import { ipAddress } from '../../constants';
import axios from 'axios';
import Divider from '../components/Divider';
import SectionTitle from '../components/SectionTitle';

const SellPropertyModal = ({ sellPropertyModalVisible, setSellPropertyModalVisible, selectedProperty, properties }) => {
    const [amount, setAmount] = useState('');
  const [processing, setProcessing] = useState(false);

  const userInfo = useSelector((state) => state.bank.userInfo);

  const dispatch = useDispatch();

 
  const closeModal = () => {
    setSellPropertyModalVisible(false);
  };




  const handleSellProperty = async () => {
    setProcessing(true);

    try {
      if (!selectedProperty) {
        Alert.alert('Error', 'Please select a property to sell.');
        setProcessing(false);
        return;
      }

      if (!amount || isNaN(parseFloat(amount))) {
        Alert.alert('Error', 'Please enter a valid amount.');
        setProcessing(false);
        return;
      }

      const requestData = {
        property_id: selectedProperty.id,
        amount: parseFloat(amount),
      };

      const response = await axios.post(`${ipAddress}/api/sell-property/`, requestData, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      });

      if (response.status === 200) {
        const responseData = response.data;
        dispatch(updateAccountBalances(responseData.newAccountBalances));
        dispatch(fetchAccountBalances());
        dispatch(fetchUserTransactions());
        //setIsSuccessVisible(true);
        setSellPropertyModalVisible(false);
        Alert.alert('Success', 'Property sold successfully.');
      } else {
        if (response.status === 400) {
          Alert.alert('Error', 'Invalid input. Please check your data and try again.');
        } else if (response.status === 401) {
          Alert.alert('Error', 'You are not authorized. Please login again.');
        } else if (response.status === 402) {
          Alert.alert('Error', 'Insufficient balance. You do not have enough funds for this transaction.');
        } else {
          Alert.alert('Error', 'An error occurred while processing your request. Please try again later.');
        }
        setProcessing(false);
      }
    } catch (error) {
      setProcessing(false);
      Alert.alert('Error', 'An error occurred. Please check your network connection and try again.');
    }
  };





  console.log("selectedProperty:", selectedProperty);



  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={sellPropertyModalVisible}
      onRequestClose={() => setSellPropertyModalVisible(false)}
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
        <View style={styles.modalContent}>
          <ScrollView>
          <View style={{flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center',  paddingLeft: 30,}}>
              <Text style={styles.modalHeader}>Sell Property</Text>
              <Ionicons name="close-outline" size={24} color="grey" marginTop={22} paddingRight={25} onPress={() => setSellPropertyModalVisible(false)}/>
            </View>

            <Divider />

            <Text style={styles.modalSubText}>
              Please note that properties put up for sale would be made available for users who can potentially buy and could take time to be bought. You would get a mail when it's been successfully sold and you'll be credited in your wallet.
            </Text>

            <View style={{marginLeft: 10}}>
            <SectionTitle>PROPERTY DETAILS</SectionTitle>
            </View>

            <View>
            {selectedProperty && (
                <View style={styles.modalContent2}>
  <View style={styles.leftContainer}>
    <Ionicons name="home" size={54} color="grey" />
    <Text style={styles.propertyName}>{selectedProperty.description}</Text>
  </View>
  <Divider />
  <View style={styles.rightContainer}>
    <Text style={styles.propertyValue}><Text style={{fontSize: 10}}>value: </Text>₦{selectedProperty.property_value}</Text>
    <Text style={styles.propertyRent}><Text style={{fontSize: 10}}>ROI: </Text>₦{selectedProperty.rent_earned_annually}</Text>
  </View>
</View>

)}


                </View>


            <View style={styles.buttonsContainer}>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={handleSellProperty}
              disabled={processing}
            >
              <Text style={styles.primaryButtonText}>Sell This Property</Text>
            </TouchableOpacity>
            </View>
          </ScrollView>
        </View>

      </View>
      </TouchableOpacity>

      </TouchableOpacity>
    </Modal>
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
    leftContainer: {
        flexDirection: 'row',
        alignItems: 'center',
      },
      rightContainer: {
        flexDirection: 'column',
        alignItems: 'flex-end',
        alignSelf: 'flex-end',
        marginRight: 20,
        marginTop: -10
      },
      propertyName: {
        fontSize: 34,
        fontFamily: 'karla',
        color: 'black',
        padding: 10
      },
      propertyValue: {
        fontSize: 22,
        fontFamily: 'karla',
        marginLeft: 30,
        color: 'green',
        marginTop: 5,
      },
      propertyRent: {
        fontSize: 12,
        fontFamily: 'karla',
        color: 'green',
      },
      
      
      modalContent2: {
        backgroundColor: '#F6F3FF',
        width: '100%',
        alignItems: 'flex-start',
        borderTopRightRadius: 25,
        borderTopLeftRadius: 25,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,    
        marginTop: 2,  
        padding: 20
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
      marginBottom: 20,
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
      marginBottom: 15,
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
      //backgroundColor: '#fff',
      borderRadius: 10,
    },
  
    pickerContainer: {
      borderRadius: 10, // Add border radius here
     overflow: 'hidden', // This ensures that the border radius is applied to the Picker
    },
  
    modalSubText2Green: {
        fontSize: 14,
        fontFamily: 'karla',
        color: 'green',
        textAlign: 'center',
        marginHorizontal: 45,
        marginTop: 5,
        letterSpacing: -0.5,
      },
      label3: {
        fontSize: 17,
        fontFamily: 'proxima',
        marginBottom: 5,
        marginLeft: 45,
        alignSelf: 'flex-start',
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

export default SellPropertyModal;
