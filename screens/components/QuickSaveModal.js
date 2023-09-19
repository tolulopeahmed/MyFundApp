import React, { useState, useEffect } from 'react';
import { Modal, Text, Keyboard,ScrollView, Image, View, TextInput, TouchableWithoutFeedback, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Divider from '../components/Divider'
import { Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserCards } from '../../ReduxActions'; // Import fetchUserCards


const QuickSaveModal = ({ navigation, quickSaveModalVisible, setQuickSaveModalVisible }) => {
  const [frequency, setFrequency] = useState('');
  const [amount, setAmount] = useState('');
  const [isContinueButtonDisabled, setIsContinueButtonDisabled] = useState(true);
  const [selectedCard, setSelectedCard] = useState('null');

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
  
  console.log('User Cards in QuickSaveModal:', userCards);









  
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
                {'\n'}QuickSave how much?
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
                        <Picker.Item color='#4C28BC' label="Choose card..." value="null" />
                        {userCards.map((card) => (
                          <Picker.Item
                            label={`${card.bank_name} - **** ${card.card_number.slice(-4)}`}
                            value={card.cardId}
                            key={card.id}
                          />
                        ))}
                      </Picker>
                      </View>
                      </View>
                    )}

                    <View style={styles.buttonsContainer}>


                    <TouchableOpacity
                      style={isContinueButtonDisabled ? styles.primaryButtonDisabled : styles.primaryButton}
                      onPress={() => {
                        if (!isContinueButtonDisabled) {
                          navigation.navigate('Success');
                        }
                      }}
                      disabled={isContinueButtonDisabled}
                    >
                      <Image source={require('./paystack.png')} style={styles.image} />
                      <Text style={styles.primaryButtonText}>Continue</Text>
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



};

export default QuickSaveModal;
