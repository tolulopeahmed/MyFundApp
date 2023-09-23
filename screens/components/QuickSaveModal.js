import React, { useState, useEffect } from 'react';
import { Modal, Text, Alert, ActivityIndicator, Keyboard,ScrollView, Image, View, TextInput, TouchableWithoutFeedback, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Divider from '../components/Divider'
import { Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserCards, updateAccountBalances, } from '../../ReduxActions'; // Import fetchUserCards
import { ipAddress } from '../../constants';
import axios from 'axios';


const getBackgroundColor = (bankName) => {
  switch (bankName) {
    case "Access Bank":
      return "#91A62A";
    case "Guaranty Trust Bank":
      return "#C3460E";
    case "Zenith Bank":
      return "#E6000D";
    case "United Bank for Africa":
      return "#D42C07";
    case "First City Monument Bank":
      return "#702699";
    case "Wema Bank":
      return "#72235A";
    case "Polaris Bank":
      return "#8834AE";
    case "Union Bank":
      return "#00ADEF";
    case "Ecobank":
      return "#00537F";
    case "Stanbic IBTC Bank":
      return "#04009D";
    case "First Bank of Nigeria":
      return "#0C2B5C";
    case "Keystone Bank":
      return "#014888";
    case "Sterling Bank":
      return "#DB3539";
    case "Unity Bank Plc":
      return "#88BB52";
    case "Citibank":
      return "#0275D0";
    case "Heritage Bank Plc":
      return "#439B2D";
    case "Standard Chartered Bank":
      return "#0671A9";
    case "Jaiz Bank":
      return "#0B411F";
    case "Fidelity Bank":
      return "#232B69";
    case "Opay":
        return "#08A67C";
    case "Palmpay":
        return "#7F13CB";
    case "Moniepoint Microfinance Bank":
        return "#0649C4";
    default:
      return "#4C28BC"; // Default color
  }
};

const QuickSaveModal = ({ navigation, quickSaveModalVisible, setQuickSaveModalVisible, setIsSuccessVisible }) => {
  const [frequency, setFrequency] = useState('');
  const [amount, setAmount] = useState('');
  const [isContinueButtonDisabled, setIsContinueButtonDisabled] = useState(true);
  const [selectedCard, setSelectedCard] = useState(null);
  const userInfo = useSelector((state) => state.bank.userInfo);
  const selectedCardId = selectedCard !== undefined && selectedCard !== null ? selectedCard : null;
  const [processing, setProcessing] = useState(false);
  const userCards = useSelector((state) => state.bank.cards) || [];
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchUserCards());
  }, []);

  const handleAmountButtonPress = (presetAmount) => {
    handleAmountPreset(presetAmount);
    // Dismiss the keyboard when the button is pressed
    Keyboard.dismiss();
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };



  useEffect(() => {
    // Check if both amount and selectedCard are not empty and selectedCard is not 'null'
    if (amount !== '' && selectedCard !== '' && selectedCard !== 'null') {
      setIsContinueButtonDisabled(false);
    } else {
      setIsContinueButtonDisabled(true);
    }
  }, [amount, selectedCard]);
  



  const handleAmountChange = (value) => {
    const numericValue = parseFloat(value.replace(/,/g, ''));

    if (!isNaN(numericValue) && numericValue > 0 && selectedCard !== '') {
      setAmount(numericValue.toLocaleString('en-US'));
    } else {
      setAmount('');
    }
  };
  
  const handleCardSelection = (value) => {
    console.log('Selected Card Value:', value); // Add this line
    setSelectedCard(value);
  };

  
  const handleAddCard = () => {
    navigation.navigate('Card', { addCardModalVisible: true });
  };

  const closeModal = () => {
    setQuickSaveModalVisible(false);
  };

  const handleAmountPreset = (presetAmount) => {
    setAmount(presetAmount.toLocaleString('en-US'));
  }

  const clearAmount = () => {
    setAmount('');
  };


  


  const handleQuickSave = async () => {
    setProcessing(true);
    try {
      console.log('QuickSave button pressed');
      console.log('Selected card:', selectedCard);
      console.log('userInfo:', userInfo.token);
      console.log('ipAddress:', ipAddress);


      // Send the QuickSave request to your API using axios
      const response = await axios.post(`${ipAddress}/api/quicksave/`,
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
        // QuickSave was successful, update account balances and transactions
        const responseData = response.data;
        setIsSuccessVisible(true);

        setQuickSaveModalVisible(false);
          // Dispatch actions to update Redux store
          dispatch(updateAccountBalances(responseData.newAccountBalances)); // Dispatch the action here
      
     
      } else {
        // Handle QuickSave error here and show appropriate alerts
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
      console.error('QuickSave Error:', error);
      setProcessing(false);
      // Handle network or other errors here and show an appropriate alert
      Alert.alert('Error', 'An error occurred. Please check your network connection and try again.');
    }
  };



  console.log('Selected card:', selectedCard);
  console.log('userInfo:', userInfo.token);







  
  return (
    <>
      <Modal
        animationType="slide"
        transparent={true}
        visible={quickSaveModalVisible}
        onRequestClose={() => setQuickSaveModalVisible(false)}
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
              <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', paddingLeft: 30 }}>
                <Text style={styles.modalHeader}>QuickSave</Text>
                <Ionicons name="close-outline" size={24} color="grey" marginTop={22} paddingRight={25} onPress={() => setQuickSaveModalVisible(false)} />
              </View>
              <Divider />
              <Text style={styles.modalSubText}>
                Manually move funds from your local bank account into your <Text style={{ fontFamily: 'nexa', fontSize: 12 }}>SAVINGS</Text> account with a few taps. <Text style={{ fontFamily: 'proxima' }}>(@10% interest p.a.)</Text> {'\n'}
                {'\n'}Enter or Select an amount.
              </Text>
              <View style={styles.inputContainer2}>
                <Text style={styles.nairaSign}>₦</Text>
                <TextInput
                  style={styles.amountInput}
                  placeholder="Amount (e.g. 20,000)"
                  keyboardType="numeric"
                  onChangeText={(value) => handleAmountChange(value)}
                  value={amount}
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

              <Text style={styles.modalSubText2} alignSelf='flex-start'>using...</Text>
              
              
              <View style={styles.inputContainer}>
                <View style={styles.dropdown}>
                  <Picker
                    style={styles.labelItem}
                    selectedValue={frequency}
                    onValueChange={(value) => setFrequency(value)}
                  >
                    <Picker.Item color='#4C28BC' label="Select source of funding..." value="Select destination account" />
                    <Picker.Item label="My Saved Cards" value="My Saved Cards" />
                    <Picker.Item label="Add New Card" value="Add New Card" />
                    <Picker.Item label="Bank Transfer" value="Bank Transfer" />
                  </Picker>
                </View>
              </View>

              {frequency === 'My Saved Cards' && (
                <>
                  <View style={styles.inputContainer}>
                    <Text style={styles.label3}>Which of them?     </Text>
                    {userCards.length === 0 ? (
                      <Text style={{ color: 'grey', fontFamily: 'karla-italic', marginBottom: 10, marginLeft: 15 }}>No cards added yet...</Text>
                    ) : (
                      
                      <View style={styles.inputContainer}>
                      <View style={styles.dropdown}>

                      <Picker
                        style={styles.labelItem}
                        selectedValue={selectedCard}
                        onValueChange={(value) => handleCardSelection(value)}
                      >
                        <Picker.Item color={getBackgroundColor("Choose card...")} label="Choose card..." value={null} />
                        {userCards.map((card) => (
                          <Picker.Item
                            label={`${card.bank_name} - **** ${card.card_number.slice(-4)}`}
                            value={card.id}
                            key={card.id}
                            color={getBackgroundColor(card.bank_name)}
                          />
                        ))}
                      </Picker>


                      </View>
                      </View>
                    )}

                    <View style={styles.buttonsContainer}>


                    <TouchableOpacity
                            style={[
                              styles.primaryButton,
                              (isContinueButtonDisabled || processing) && styles.primaryButtonDisabled,
                              { backgroundColor: processing ? 'green' : '#4C28BC' },
                            ]}
                            onPress={handleQuickSave}
                            disabled={isContinueButtonDisabled || processing}
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
                              {processing ? 'Paystack Processing...' : 'QuickSave Now!'}
                            </Text>
                          </TouchableOpacity>



                    </View>
                  </View>
                </>
              )}


              {frequency === "Add New Card" && (
                <>
                  <View style={styles.paymentOptionsContainer}>
                    <Text style={styles.modalSubText3} alignSelf='center'>Tap the button below to add a new card first...</Text>
                    <View style={styles.buttonsContainer}>
                      <TouchableOpacity style={styles.primaryButton} onPress={handleAddCard}>
                        <Text style={styles.primaryButtonText}>Add Card Now</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </>
              )}
              {frequency === "Bank Transfer" && (
                <>
                  <View style={styles.paymentOptionsContainer}>
                    <Text style={styles.modalSubText2} alignSelf='center'>Transfer the exact amount you entered above to the account below. Click 'Submit' after payment and your account will be updated within 12 hours.</Text>
                    <Text style={styles.label}>Access Bank {'\n'} 0821326433 {'\n'} Vcorp Systems Limited</Text>
                    <View style={styles.buttonsContainer}>
                      <TouchableOpacity style={styles.primaryButton}>
                        <Text style={styles.primaryButtonText}>Submit</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </>
              )}
            </View>
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

  // labelItem2: {
  //   color: 'black',
  //   textAlign: 'left',
  //   marginLeft: 5,
  //   marginRight: 5,
  //   marginBottom: 10,
  //   fontFamily: 'karla',
  //   backgroundColor: '#fff',
  //   borderRadius: 10,
  // },

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
  
  

  dropdown: {
    height: 50,
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    marginBottom: 1,
    paddingLeft: 15,
    paddingRight: 5,

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

export default QuickSaveModal;
