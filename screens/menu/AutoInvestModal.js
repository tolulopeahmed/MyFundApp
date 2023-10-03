import React, { useState, useEffect } from 'react';
import { Modal, Text, Alert, ActivityIndicator, Keyboard,ScrollView, Image, View, TextInput, TouchableWithoutFeedback, TouchableOpacity, Touchable } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Divider from '../components/Divider'
import { useDispatch, useSelector } from 'react-redux';
import { fetchAutoInvestSettings} from '../../ReduxActions'; // Import fetchUserCards
import { ipAddress } from '../../constants';
import axios from 'axios';
import LoadingModal from '../components/LoadingModal';
import bankOptions from '../components/BankOptions';



const getBackgroundColor = (bankName) => {
  const bank = bankOptions.find((option) => option.name === bankName);
  return bank ? bank.color : "#4C28BC"; // Default to your default color
};


const AutoInvestModal = ({ navigation, autoInvestModalVisible, setAutoInvestModalVisible, setAutoInvest }) => {
  const [amount, setAmount] = useState('');
  const [frequency, setFrequency] = useState('');
  const [isContinueButtonDisabled, setIsContinueButtonDisabled] = useState(true);
  const [selectedCard, setSelectedCard] = useState({});
  const userInfo = useSelector((state) => state.bank.userInfo);
  const [processing, setProcessing] = useState(false);
  const userCards = useSelector((state) => state.bank.cards) || [];
  const [selectedCardId, setSelectedCardId] = useState(userCards.length > 0 ? userCards[0].id : null);
  const dispatch = useDispatch();

  

  const closeModal = () => {
    setAutoInvestModalVisible(false);
  };


  const handleConfirmAutoInvest = async () => {
    try {
      setProcessing(true);
      console.log('Selected card ID:', selectedCard);
      console.log('Amount Entered:', amount);
      // Make an API request to activate AutoInvest
      const response = await axios.post(
        `${ipAddress}/api/activate-autoinvest/`,
        {
          card_id: selectedCardId,
          amount: parseFloat(amount.replace(/,/g, '')), // Parse the amount as a float
          frequency: frequency,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userInfo.token}`, // Include the user's token in the headers
          },
        }
      );
      
      console.log('API Response:', response);

      if (response.status === 200) {
        const responseData = response.data;
        dispatch(fetchAutoInvestSettings()); // Fetch and update auto-invest status
        setProcessing(false);
        setAutoInvestModalVisible(false);
        setAutoInvest(true); 

        Alert.alert(
          'AutoInvest Activated!',
          `Your AutoInvest has been activated. You're now investing ₦${amount} ${frequency}. Well done! Keep growing your funds. 🥂`,
          [
            {
              text: 'OK',
              onPress: () => {
                // Navigate to the Home screen
                navigation.navigate('MyFund');
              },
            },
          ]
        );
        
  
      } else {
        setProcessing(false);
        Alert.alert('AutoInvest Activation Failed', 'Please try again later.');
      }
    } catch (error) {
      console.error('Error activating AutoInvest:', error);
      setProcessing(false);
      Alert.alert(
        'Error',
        'Failed to activate AutoInvest. Please check your connection and try again later.'
      );
    }
  };
  
  
  useEffect(() => {
    // Fetch auto-save status and settings when the component mounts
    dispatch(fetchAutoInvestSettings());
  }, []);
  


  useEffect(() => {
    // Check if userCards is not empty
    if (userCards.length > 0) {
      setSelectedCardId(userCards[0].id); // Set selectedCardId to the ID of the first card
      setSelectedCard(userCards.find((card) => card.id === userCards[0].id)); // Set selectedCard to the first card object
    }
  }, [userCards]);
  
  

  
  

  
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


  useEffect(() => {
    // Check if both amount and selectedCard are not empty and selectedCard is not 'null'
    if (amount !== '' && selectedCard !== null) {
      setIsContinueButtonDisabled(false);
    } else {
      setIsContinueButtonDisabled(true);
    }
  
    // Set initial selectedCard when userCards are available
    if (userCards.length > 0 && selectedCard === null) {
      setSelectedCard(userCards[0].id);
    }
  
    // Set initial frequency when AutoInvestModal opens
    if (frequency === '') {
      setFrequency('daily'); // Change 'hourly' to the default frequency you want
    }
  }, [amount, selectedCard, userCards, frequency]); // Include 'frequency' in the dependency array
  
  
  
  

  const handleAmountChange = (value) => {
    const numericValue = parseFloat(value.replace(/,/g, ''));

    if (!isNaN(numericValue) && numericValue > 0 && selectedCard !== '') {
      setAmount(numericValue.toLocaleString('en-US'));
    } else {
      setAmount('');
    }
  };
  
  
  

  
  const handleAddCard = () => {
    navigation.navigate('Card', { addCardModalVisible: true });
  };


  const disabledButtonStyle = isContinueButtonDisabled ? styles.disabledButton : {};




  console.log('CardID in AutoInvestModal:', selectedCardId);
  console.log('frequency:', frequency);
  console.log('amount:', amount);
  console.log('Selected bank_name:', selectedCard.bank_name);

  



  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={autoInvestModalVisible}
      onRequestClose={() => setAutoInvestModalVisible(false)}
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
             <Text style={styles.modalHeader} >Activate AutoInvest</Text>
             <Ionicons name="close-outline" size={24} color="grey" marginTop={22} paddingRight={25} onPress={() => setAutoInvestModalVisible(false)}/>
         </View>
          <Divider />

          <Text style={styles.modalSubText}>
            AutoInvest allows you to set an amount to automatically debit from your local bank account
            to your MyFund account for up to <Text style={{color: 'green', fontFamily: 'proxima'}}>20% ROI p.a.</Text> Minimum: N100,000
          </Text>
          <View style={styles.inputContainer}>
          <Text style={styles.autoSaveSetting}>AutoInvest Settings</Text>


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
            

          </View>
          
          <View style={styles.inputContainer}>
          <Text style={styles.label3}>Frequency</Text>

      <View style={styles.dropdown}>
        <Picker
          style={styles.labelItem}
          selectedValue={frequency}
          onValueChange={(value) => setFrequency(value)}
        >
          <Picker.Item label="Hourly" value="hourly" />
          <Picker.Item label="Daily" value="daily" />
          <Picker.Item label="Weekly" value="weekly" />
          <Picker.Item label="Monthly" value="monthly" />
        </Picker>
      </View>
    </View>


                <>
                  <View style={styles.inputContainer}>
                    <Text style={styles.label3}>Select Card     </Text>
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
                            setSelectedCardId(value); // Set selectedCardId to the selected card's ID
                          }}
                        >
                          {userCards.map((card) => (
                            <Picker.Item
                              label={`         ${card.bank_name} - **** ${card.card_number.slice(-4)}`}
                              value={card.id} // Use the card's ID as the value
                              key={card.id}
                              //color={getBackgroundColor(card.bank_name)}
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
                    { backgroundColor: processing ? 'green' : isContinueButtonDisabled ? 'grey' : '#4C28BC' },
                  ]}
                  onPress={handleConfirmAutoInvest}
                  disabled={isContinueButtonDisabled || processing}
                >
                  {processing ? (
                    <>
                      <ActivityIndicator color="white" style={styles.activityIndicator} />
                      <Text style={[styles.primaryButtonText, styles.processingText]}> Activating AutoInvest... Please wait...</Text>
                    </>
                  ) : (
                    <Text style={styles.primaryButtonText}>Activate AutoInvest Now!</Text>
                  )}
                </TouchableOpacity>

          </View>
                  </View>
                </>


                <LoadingModal visible={processing} />

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
  

  modalHeader: {
    marginTop: 30,
    alignItems: 'flex-start',
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
    marginHorizontal: 40,
    marginTop: 1,
  },

  inputContainer: {
    marginTop: 30,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },

  input: {
    fontSize: 17,
    height: 45,
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    paddingLeft: 15,
    paddingRight: 5,
    fontFamily: 'karla',
    letterSpacing: -0.5,
  },

  inputContainer: {
    marginTop: 20,
    width: '100%',
    alignItems: 'center',
  },

  autoSaveSetting: {
    fontSize: 17,
    fontFamily: 'proxima',
    marginLeft: 50,
    marginBottom: 5,
    alignSelf: 'flex-start',
    marginTop: 10,
  },



  inputContainer: {
    marginTop: 5,
    marginBottom: 15,
    width: '100%',
    alignItems: 'center',
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
    marginHorizontal: 45,
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




  label: {
    fontSize: 17,
    fontFamily: 'proxima',
    marginRight: 190,
    marginTop: 20,
  },

  label3: {
    fontSize: 17,
    fontFamily: 'proxima',
    marginBottom: 5,
    marginLeft: 50,
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


dropdown: {
  //flexDirection: 'row', // Make the container a row to position icon and Picker side by side
  //alignItems: 'flex-start', // Center vertically
  height: 50,
  width: '80%',
  backgroundColor: 'white',
  borderRadius: 10,
  marginBottom: 1,
  paddingLeft: 15,
  paddingRight: 5,
},

iconContainer: {
  position: 'absolute', // Use absolute positioning
  left: 10, // Adjust the left position as needed
  top: '50%', // Center vertically
  marginLeft: 45,
  zIndex: 1,
  transform: [{ translateY: -12 }], // Adjust translateY to vertically center the icon
},


  buttonsContainer: {
    flexDirection: 'row',
    marginTop: 10,
    position: 'relative',
    marginBottom: 40,
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

  disabledButton: {
    backgroundColor: 'gray', // Change the background color to grey
    opacity: 0.9, // You can adjust the opacity as desired
  },

  primaryButtonDisabled: {
    flexDirection: 'row',
    backgroundColor: 'grey', // Background color for disabled state
    width: '85%',
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    opacity: 0.9, // Reduce opacity for disabled state
  },

  primaryButtonText: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'ProductSans',
  },


};

export default AutoInvestModal;
