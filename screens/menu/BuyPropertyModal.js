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

const BuyPropertyModal = ({ navigation, propertyModalVisible, setPropertyModalVisible, setIsSuccessVisible }) => {
  const [frequency, setFrequency] = useState('');
  const [amount, setAmount] = useState('');
  const [units, setUnits] = useState('');
  const [isContinueButtonDisabled, setIsContinueButtonDisabled] = useState(true);
  const [selectedCard, setSelectedCard] = useState(null);
  const userInfo = useSelector((state) => state.bank.userInfo);
  const [processing, setProcessing] = useState(false);
  const userCards = useSelector((state) => state.bank.cards) || [];
  const [selectedCardId, setSelectedCardId] = useState(
    userCards.length > 0 ? userCards[0].id : null
  );
  const [showBuyPropertyButton, setShowBuyPropertyButton] = useState(true);
  const accountBalances = useSelector((state) => state.bank.accountBalances);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchUserCards());
  }, []);

  useEffect(() => {
    if (frequency === 'Bank Transfer') {
      setShowBuyPropertyButton(false);
    } else {
      setShowBuyPropertyButton(true);
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
      setFrequency('daily');
    }
  }, [amount, selectedCard, userCards, frequency]);

  const handleAmountChange = (value) => {
    const numericValue = value.replace(/[^0-9.]/g, '');

    if (numericValue === '' || isNaN(parseFloat(numericValue))) {
      setAmount('');
    } else {
      const parts = numericValue.split('.');

      if (parts.length === 1) {
        setAmount(parseFloat(parts[0]).toLocaleString('en-US'));
      } else if (parts.length === 2) {
        const integerPart = parseFloat(parts[0]).toLocaleString('en-US');
        const decimalPart = parts[1].substring(0, 2);
        setAmount(`${integerPart}.${decimalPart}`);
      }
    }
  };

  const handleAddCard = () => {
    navigation.navigate('Card', { addCardModalVisible: true });
  };

  const closeModal = () => {
    setPropertyModalVisible(false);
  };

  const handleBuyProperty = async () => {
    setProcessing(true);
    try {
      console.log('Selected card ID:', selectedCardId);
      console.log('Amount Entered:', amount);

      const response = await axios.post(
        `${ipAddress}/api/buy-property/`,
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
                  <Text style={styles.modalSubText}>
                    Buy Kings and Queen Hostels, at Harmony Estate, Federal University of Agriculture, Abeokuta, FUNAAB. {'\n'}
                    {'\n'}
                    Pay: <Text style={{ color: '#4C28BC', fontFamily: 'proxima' }}>N5 million/unit</Text> {'\n'}
                    Earn <Text style={{ color: 'green', fontFamily: 'proxima' }}>N250,000/year</Text>
                    {'\n'}
                    {'\n'}
                    Select how many units you want to buy.
                  </Text>

                  <View style={styles.inputContainer}>
                    <View style={styles.dropdown}>
                      <Picker
                        style={styles.labelItem}
                        selectedValue={units}
                        onValueChange={(value) => setUnits(value)}
                      >
                        <Picker.Item label="1 unit" value="1" />
                        <Picker.Item label="2 units" value="1" />
                        <Picker.Item label="3 units" value="1" />
                        <Picker.Item label="4 units" value="1" />
                        <Picker.Item label="5 units" value="1" />
                        <Picker.Item label="6 units" value="1" />
                        <Picker.Item label="7 units" value="1" />
                        <Picker.Item label="8 units" value="1" />
                        <Picker.Item label="9 units" value="1" />
                        <Picker.Item label="10 units" value="1" />
                      </Picker>
                    </View>
                  </View>
                  <Text style={styles.modalSubText2} alignSelf="flex-start">using...</Text>

                  <View style={styles.inputContainer}>
                    <View style={styles.dropdown}>
                      <Picker
                        style={styles.labelItem}
                        selectedValue={frequency}
                        onValueChange={(value) => setFrequency(value)}
                      >
                        <Picker.Item label={`Savings (₦${Math.floor(accountBalances.savings).toLocaleString()})`} value="savings" />
                        <Picker.Item label={`Investment (₦${Math.floor(accountBalances.investment).toLocaleString()})`} value="investment" />
                        <Picker.Item label={`Wallet (₦${Math.floor(accountBalances.wallet).toLocaleString()})`} value="wallet" />
                        <Picker.Item label="My Saved Cards" value="My Saved Cards" />
                        <Picker.Item label="Bank Transfer" value="Bank Transfer" />
                      </Picker>
                    </View>
                  </View>

                  {showBuyPropertyButton ? (
                    <View style={styles.inputContainer}>
                      <Text style={styles.label3}>Which of them?     </Text>
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
                      <Text style={styles.modalSubText4}>By clicking Buy Now, you agree to the <Text style={{ color: '#4C28BC', fontFamily: 'proxima' }}>Deed of Agreement.</Text></Text>
                      <View style={styles.buttonsContainer}>
                        <TouchableOpacity
                          style={[
                            styles.primaryButton,
                            (isContinueButtonDisabled || processing) && styles.primaryButtonDisabled,
                            { backgroundColor: processing ? 'green' : isContinueButtonDisabled ? 'grey' : '#4C28BC' },
                          ]}
                          onPress={handleBuyProperty}
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
                            {processing ? 'Processing... Please Wait...' : 'Buy Now!'}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  ) : (
                    <View style={styles.paymentOptionsContainer}>
                      <Text style={styles.modalSubText2} alignSelf="center">
                        Transfer the exact amount you entered above to the account below. Click 'Submit' after payment and your account will be updated within 12 hours.
                      </Text>
                      <Text style={styles.label}>Access Bank {'\n'} 0821326433 {'\n'} Vcorp Systems Limited</Text>
                      <View style={styles.buttonsContainer}>
                        <TouchableOpacity style={styles.primaryButton}>
                          <Text style={styles.primaryButtonText}>Submit</Text>
                        </TouchableOpacity>
                      </View>
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
    backgroundColor: '#DCD1FF',
    borderRadius: 5,
    padding: 10,
    margin: 5,
    alignItems: 'center',
  },
  presetAmountText: {
    color: 'black',
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
    borderRadius: 10,
    overflow: 'hidden',
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
  },
  pickerContainer: {
    borderRadius: 10,
    overflow: 'hidden',
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
    position: 'absolute',
    left: 10,
    top: '50%',
    marginLeft: 45,
    zIndex: 1,
    transform: [{ translateY: -12 }],
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
    backgroundColor: 'grey',
    width: '85%',
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    opacity: 0.7,
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
