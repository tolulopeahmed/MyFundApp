import React, { useState, useEffect } from 'react';
import { Modal, Text, Alert, KeyboardAvoidingView, ActivityIndicator, Keyboard, ScrollView, Image, View, TextInput, TouchableWithoutFeedback, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Divider from '../components/Divider';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserCards, updateAccountBalances, fetchAccountBalances, fetchUserTransactions } from '../../ReduxActions'; // Import fetchUserCards
import { ipAddress } from '../../constants';
import axios from 'axios';
import LoadingModal from '../components/LoadingModal';
import bankOptions from '../components/BankOptions';


const getBackgroundColor = (bankName) => {
  const bank = bankOptions.find((option) => option.name === bankName);
  return bank ? bank.color : "#4C28BC"; // Default to your default color
};
const BuyPropertyModal = ({ navigation, propertyModalVisible, setPropertyModalVisible, isSuccessVisible, setIsSuccessVisible, selectedProperty }) => {
  const [frequency, setFrequency] = useState('');
  const [amount, setAmount] = useState('');
  const [units, setUnits] = useState('1'); // Set an initial value for units
  const [isContinueButtonDisabled, setIsContinueButtonDisabled] = useState(true);
  const [selectedCard, setSelectedCard] = useState(null);
  const userInfo = useSelector((state) => state.bank.userInfo);
  const [processing, setProcessing] = useState(false);
  const userCards = useSelector((state) => state.bank.cards) || [];
  const [selectedCardId, setSelectedCardId] = useState(
    userCards.length > 0 ? userCards[0].id : null
  );
  const [showBuyPropertyButton, setShowBuyPropertyButton] = useState(true);
  const [showCardSection, setShowCardSection] = useState(false);
  const [showSubmitButton, setShowSubmitButton] = useState(false);
  const accountBalances = useSelector((state) => state.bank.accountBalances);
  const [totalAmount, setTotalAmount] = useState(0);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchUserCards());
  }, []);


  const calculateTotalAmount = () => {
    const unitPrice = selectedProperty.price; // Get the price per unit from your data
    const numberOfUnits = parseInt(units); // Convert the selected units to an integer
    const total = unitPrice * numberOfUnits;
    setTotalAmount(total);
  };

  useEffect(() => {
    calculateTotalAmount();
  }, [units, selectedProperty]);



  useEffect(() => {
    if (frequency === 'Savings' || frequency === 'Investment' || frequency === 'Wallet') {
      setShowBuyPropertyButton(true);
      setShowCardSection(false);
      setShowSubmitButton(false);
    } else if (frequency === 'My Saved Cards') {
      setShowBuyPropertyButton(true);
      setShowCardSection(true);
      setShowSubmitButton(false);
    } else if (frequency === 'Bank Transfer') {
      setShowBuyPropertyButton(false);
      setShowCardSection(false);
      setShowSubmitButton(true);
    }
  }, [frequency]);

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  useEffect(() => {
    if (userCards.length > 0) {
      setSelectedCardId(userCards[0].id);
      setSelectedCard(userCards.find((card) => card.id === userCards[0].id));
    }
  }, [userCards]);

  useEffect(() => {
    if (amount !== '' && selectedCard !== null) {
      setIsContinueButtonDisabled(false);
    } else {
      setIsContinueButtonDisabled(true);
    }

    if (userCards.length > 0 && selectedCard === null) {
      setSelectedCard(userCards[0].id);
    }

    if (frequency === '') {
      setFrequency('Savings');
    }
  }, [amount, selectedCard, userCards, frequency]);

  const handleAddCard = () => {
    navigation.navigate('Card', { addCardModalVisible: true });
  };

  const closeModal = () => {
    setPropertyModalVisible(false);
  };



const handleBuyProperty = async () => {
  setProcessing(true);

  try {
    let paymentData = {};

    if (frequency === 'Savings' || frequency === 'Investment' || frequency === 'Wallet') {
      paymentData = {
        property: selectedProperty.id,
        num_units: parseInt(units),
        payment_source: frequency.toLowerCase(),
      };
    } else if (frequency === 'My Saved Cards') {
      paymentData = {
        property: selectedProperty.id,
        num_units: parseInt(units),
        payment_source: 'saved_cards',
        card_id: selectedCardId,
      };
    } else if (frequency === 'Bank Transfer') {
      // Handle bank transfer logic here
      // ...
      return;
    }

    // Check the user's account balances or card balance before making the purchase
    if (
      (frequency === 'Savings' && totalAmount > accountBalances.savings) ||
      (frequency === 'Investment' && totalAmount > accountBalances.investment) ||
      (frequency === 'Wallet' && totalAmount > accountBalances.wallet)
    ) {
      setProcessing(false);
      Alert.alert('Insufficient Balance', 'You do not have sufficient funds in your account for this purchase.');
      return;
    }

    // Make the API call to buy the property
    const response = await axios.post(
      `${ipAddress}/api/buy-property/`,
      paymentData,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      }
    );

    if (response.status === 200) {
      const responseData = response.data;
      dispatch(updateAccountBalances(responseData.newAccountBalances));
      dispatch(fetchAccountBalances());
      dispatch(fetchUserTransactions());

      setIsSuccessVisible(true);
      setPropertyModalVisible(false);
      setProcessing(false);
    } else {
      if (response.status === 400) {
        setProcessing(false);
        Alert.alert('Error', 'Invalid input. Please check your data and try again.');
      } else if (response.status === 401) {
        setProcessing(false);
        Alert.alert('Error', 'You are not authorized. Please login again.');
      } else {
        setProcessing(false);
        Alert.alert(
          'Error',
          'An error occurred while processing your request. Please try again later.'
        );
      }
    }
  } catch (error) {
    console.error('Buy Property Error:', error);
    setProcessing(false);
    Alert.alert('Error', 'An error occurred. Please check your network connection and try again.');
  }
};



  

console.log('selectedProperty.id:', selectedProperty.id);
console.log('num_units:', units);
console.log('payment_source:', frequency.toLowerCase());
console.log('selectedCardId:', selectedCardId);



  return (
    <>
      <Modal
        animationType="slide"
        transparent={true}
        visible={propertyModalVisible}
        onRequestClose={() => setPropertyModalVisible(false)}
      >
        <TouchableWithoutFeedback
          onPress={(e) => {
            if (e.target !== e.currentTarget) {
              return;
            }
            Keyboard.dismiss();
            closeModal();
          }}
          accessible={false}
        >
          <TouchableOpacity style={styles.modalContainer} activeOpacity={1} onPress={closeModal}>
            <KeyboardAvoidingView activeOpacity={1} style={styles.modalContent} onPress={dismissKeyboard}>
              <ScrollView>
              <View style={styles.modalContent}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', paddingLeft: 30 }}>
                    <Text style={styles.modalHeader}>Buy Property</Text>
                    <Ionicons name="close-outline" size={24} color="grey" marginTop={22} paddingRight={25} onPress={() => setPropertyModalVisible(false)} />
                  </View>
                <Divider />

                <View style={{ flexDirection: 'row', alignItems: 'flex-start', paddingHorizontal: 10 }}>
                  <View style={styles.propertyImageContainer}>
                    <Image source={selectedProperty.image} style={styles.propertyImage} />
                  </View>
                  <View style={styles.propertyDetails}>
                    <Text style={styles.modalSubText}>
                      Buy {selectedProperty.name}, at {selectedProperty.location}. {'\n'}
                      {'\n'}
                      Pay: <Text style={{ color: '#4C28BC', fontFamily: 'proxima' }}>₦{Math.floor(selectedProperty.price).toLocaleString()}/unit</Text> {'\n'}
                      Earn: <Text style={{ color: 'green', fontFamily: 'proxima' }}>₦{Math.floor(selectedProperty.rent).toLocaleString()}/year</Text>{'\n'}
                      {/* ROI: <Text style={{ color: 'green', fontFamily: 'proxima' }}>{(selectedProperty.rent) / (selectedProperty.price) * 100}% p.a.</Text> */}
                    </Text>
                  </View>
                </View>


                  <Text style={styles.modalSubText2} alignSelf="flex-start">Select how many units you want to buy...</Text>
                  <View style={styles.inputContainer}>
                    <View style={styles.dropdown}>
                      <Picker
                        style={styles.labelItem}
                        selectedValue={units}
                        onValueChange={(value) => setUnits(value)}
                      >
                      <Picker.Item label="1 unit" value="1" />
                      <Picker.Item label="2 units" value="2" />
                      <Picker.Item label="3 units" value="3" />
                      <Picker.Item label="4 units" value="4" />
                      <Picker.Item label="5 units" value="5" />
                      <Picker.Item label="6 units" value="6" />
                      <Picker.Item label="7 units" value="7" />
                      <Picker.Item label="8 units" value="8" />
                      <Picker.Item label="9 units" value="9" />
                      <Picker.Item label="10 units" value="10" />
                      </Picker>
                    </View>
                  </View>

                  <Text style={styles.modalSubText5} alignSelf="flex-end">
      <Text style={{fontSize: 10, }}>Total:</Text> ₦{totalAmount.toLocaleString()}
    </Text>



                  <Text style={styles.modalSubText2} alignSelf="flex-start">using...</Text>

                  <View style={styles.inputContainer}>
                    <View style={styles.dropdown}>
                      <Picker
                        style={styles.labelItem}
                        selectedValue={frequency}
                        onValueChange={(value) => setFrequency(value)}
                      >
                        <Picker.Item label={`Savings (₦${Math.floor(accountBalances.savings).toLocaleString()})`} value="Savings" />
                        <Picker.Item label={`Investment (₦${Math.floor(accountBalances.investment).toLocaleString()})`} value="Investment" />
                        <Picker.Item label={`Wallet (₦${Math.floor(accountBalances.wallet).toLocaleString()})`} value="Wallet" />
                        <Picker.Item label="My Saved Cards" value="My Saved Cards" />
                        <Picker.Item label="Bank Transfer" value="Bank Transfer" />
                      </Picker>
                    </View>
                  </View>

                  {showBuyPropertyButton && (
                    <View style={styles.inputContainer}>
                      {showCardSection && (
                        <View style={styles.inputContainer}>
                       <Text style={styles.modalSubText2} alignSelf="flex-start">Which of them?</Text>

                          {userCards.length === 0 ? (
                            <TouchableOpacity onPress={handleAddCard}>
                              <Text style={{ color: 'grey', fontFamily: 'karla-italic', marginBottom: 5, marginLeft: 15 }}>No cards added yet...
                                <Text style={{ color: '#4C28BC', fontFamily: 'proxima', marginBottom: 5, marginLeft: 15 }}>    Add Card Now!</Text>
                              </Text>
                            </TouchableOpacity>
                          ) : (
                            <View style={styles.inputContainer}>
                              <View style={styles.iconContainer}>
                                <Ionicons
                                  name="card"
                                  size={28}
                                  color={selectedCard ? getBackgroundColor(selectedCard.bank_name) : null}
                                  zIndex={-1}
                                />
                              </View>
                              <View style={styles.dropdown}>
                                <Picker
                                  style={styles.labelItem}
                                  selectedValue={selectedCardId}
                                  onValueChange={(value) => {
                                    console.log('Selected Card Value:', value);
                                    setSelectedCardId(value);
                                  }}
                                >
                                  {userCards.map((card) => (
                                    <Picker.Item
                                      label={`         ${card.bank_name} - **** ${card.card_number.slice(-4)}`}
                                      value={card.id}
                                      key={card.id}
                                      color={getBackgroundColor(card.bank_name)}
                                    />
                                  ))}
                                </Picker>
                              </View>
                            </View>
                          )}
                        </View>
                      )}

                            <View style={styles.buttonsContainer}>
                              <TouchableOpacity
                                style={[
                                  styles.primaryButton,
                                  { backgroundColor: processing ? 'green' : '#4C28BC' },
                                ]}
                                onPress={handleBuyProperty}
                                disabled={processing}
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
                                  {processing ? 'Processing... Please Wait...' : 'Buy Now!'}
                                </Text>
                              </TouchableOpacity>
                            </View>

                      <Text style={styles.modalSubText4}>By clicking Buy Now, you agree to the  <Text style={{ color: '#4C28BC', fontFamily: 'proxima' }}>Deed of Agreement.</Text></Text>
                    </View>
                  )}

                  {showSubmitButton && (
                    <View style={styles.paymentOptionsContainer}>
                      <Text style={styles.modalSubText3} alignSelf="center">
                        Transfer the exact total amount above to the account below. Click 'Submit' after payment and your purchase would be processed.
                      </Text>
                      <Text style={styles.label}>Access Bank {'\n'} 0821326433 {'\n'} Vcorp Systems Limited</Text>
                      <View style={styles.buttonsContainer}>
                        <TouchableOpacity style={styles.primaryButton}>
                          <Text style={styles.primaryButtonText}>Submit</Text>
                        </TouchableOpacity>
                      </View>
                      <Text style={styles.modalSubText4}>By clicking Submit, you agree to the  <Text style={{ color: '#4C28BC', fontFamily: 'proxima' }}>Deed of Agreement.</Text></Text>
                    </View>
                  )}
                </View>

                <LoadingModal visible={processing} />
              </ScrollView>
            </KeyboardAvoidingView>
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

  modalSubText4: {
    fontSize: 13,
    fontFamily: 'karla-italic',
    textAlign: 'center',
    color: 'grey',
    textAlign: 'center',
    marginHorizontal: 45,
    marginTop: 25,
    marginBottom: 20,
    letterSpacing: -0.2,
  },

  modalSubText5: {
    fontSize: 15,
    fontFamily: 'proxima',
    textAlign: 'center',
    color: '#4C28BC',
    textAlign: 'center',
    marginHorizontal: 45,
    letterSpacing: -0.5,
  },

  inputContainer: {
    marginTop: 5,
    marginBottom: 5,
    width: '100%',
    alignItems: 'center',
    
  },

  propertyImageContainer: {
    flex: 1,
    padding: 1,
    alignItems: 'center',
  },
  propertyImage: {
    width: '110%',
    height: 120,
    resizeMode: 'cover',
    borderRadius: 9,
    marginLeft: 75,
    marginTop: 15,
  },
  propertyDetails: {
    flex: 1.8,
    padding: 10,
    marginLeft: 20
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
    marginBottom: 10,
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

export default BuyPropertyModal;
