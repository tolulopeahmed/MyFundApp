import React, { useEffect, useContext, useState } from 'react';
import { View, Text, SafeAreaView, ImageBackground, ScrollView, TouchableOpacity, StyleSheet, Switch } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AutoSaveModal from './AutoSaveModal';
import { ProgressBar } from 'react-native-paper';
import Swiper from 'react-native-swiper';
import QuickSaveModal from '../components/QuickSaveModal';
import Divider from '../components/Divider';
import Header from '../components/Header';
import DeactivateAutoSaveModal from './DeactivateAutoSaveModal';
import Title from '../components/Title';
import Subtitle from '../components/Subtitle';
import { AutoSaveContext } from '../components/AutoSaveContext';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAccountBalances, fetchUserTransactions, fetchUserData, fetchAutoSaveSettings } from '../../ReduxActions';
import SectionTitle from '../components/SectionTitle';
import moment from 'moment';
import Success from '../components/Success';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Save = ({ navigation, route }) => {
  const [quickSaveModalVisible, setQuickSaveModalVisible] = useState(false);
  const [autoSaveModalVisible, setAutoSaveModalVisible] = useState(false);
  const [deactivateAutoSaveModalVisible, setDeactivateAutoSaveModalVisible] = useState(false);
  const { autoSave, setAutoSave } = useContext(AutoSaveContext)
  const userInfo = useSelector((state) => state.bank.userInfo); // Get userInfo from Redux state
  const accountBalances = useSelector((state) => state.bank.accountBalances);
  const userTransactions = useSelector((state) => state.bank.userTransactions);
  const [currentMonth, setCurrentMonth] = useState('');
  const [isSuccessVisible, setIsSuccessVisible] = useState(false);
  const [amount, setAmount] = useState('');
  const [frequency, setFrequency] = useState('');
  const autoSaveSettings = useSelector((state) => state.bank.autoSaveSettings);
  

  const handleCloseSuccessModal = () => {
    setIsSuccessVisible(false);
  };
  


  const dispatch = useDispatch();


  useEffect(() => {
    dispatch(fetchAccountBalances()); // Fetch account balances using Redux action
    dispatch(fetchUserTransactions()); // Fetch user transactions using Redux action
    dispatch(fetchUserData(userInfo.token));
    dispatch(fetchAutoSaveSettings()); // Fetch auto-save status and settings when the component mounts
  }, []);


  

  const iconMapping = {
    "Card Successful": "card-outline",
    "QuickSave": "save-outline",
    "AutoSave": "car-outline",
    "QuickInvest": "trending-up-outline",
    "AutoInvest": "car-sport-outline",
    "Withdrawal from Savings": "arrow-down-outline",
    "Pending Referral Reward": "ellipsis-horizontal-circle-outline",
    "Referral Reward": "checkmark-circle",
    "Withdrawal from Investment": "arrow-down-outline",
    "Property": "home-outline",
  };

  useEffect(() => {
    const monthName = moment().format('MMMM');
    setCurrentMonth(monthName);
  }, []);


const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'short', day: '2-digit' };
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', options);
};

// Function to format the time
const formatTime = (timeString) => {
  const options = { hour: 'numeric', minute: '2-digit', hour12: true };
  const time = new Date(`2023-01-01T${timeString}`);
  return time.toLocaleTimeString('en-US', options);
};

// Calculate the percentage
const percentage = () => {
  const goalAmount = parseFloat(userInfo.savings_goal_amount);
  const totalAmount = parseFloat(accountBalances.savings) + parseFloat(accountBalances.investment);
  
  if (goalAmount > 0) {
    return (totalAmount / goalAmount) * 100;
  } else {
    return 0; // Handle the case when goalAmount is zero or negative
  }
};


  const roundToNearestThousand = (value) => {
    return Math.round(value / 1000) * 1000;
  };

  const formatWithCommas = (number) => {
    return number.toLocaleString();
  };

  useEffect(() => {
    if (route.params?.autoSaveModalVisible) {
      setAutoSaveModalVisible(true);
    } else  if (route.params?.quickSaveModalVisible) {
      setQuickSaveModalVisible(true);
    } else if (route.params?.deactivateAutoSaveModalVisible) {
      setDeactivateAutoSaveModalVisible(true);
    }
  }, [route.params]);


  
  const handleQuickSave = () => {
    setQuickSaveModalVisible(true);
  };

  // Function to handle toggling auto-save
  const handleActivateAutoSave = () => {
    if (!autoSaveSettings.active) {
      // If auto-save is currently OFF, open the auto-save modal
      setAutoSaveModalVisible(true);
    } else {
      // If auto-save is currently ON, show a confirmation to deactivate
      setDeactivateAutoSaveModalVisible(true);
    }
  };

  // Function to handle confirming auto-save settings
  const handleConfirmAutoSave = (amount, frequency) => {
    // Set the amount and frequency in the component state
    setAmount(amount);
    setFrequency(frequency);

    // Close the auto-save modal
    setAutoSaveModalVisible(false);

    // Dispatch the auto-save status to Redux (if needed)

    // Store the auto-save status in AsyncStorage for persistence (if needed)
    AsyncStorage.setItem('autoSaveSettings', 'true')
      .then(() => console.log('Auto-save status saved'))
      .catch((error) => console.error('Error saving auto-save status:', error));
  };
  
  
  

// Function to handle confirming deactivation of auto-save
const handleConfirmDeactivateAutoSave = () => {
  // Close the deactivation confirmation modal
  setDeactivateAutoSaveModalVisible(false);

  // Dispatch an action to update the auto-save status in Redux (if needed)

  // Clear the auto-save status in AsyncStorage (if needed)
  AsyncStorage.removeItem('autoSaveSettings')
    .then(() => console.log('Auto-save status removed'))
    .catch((error) => console.error('Error removing auto-save status:', error));
};
  

useEffect(() => {
  dispatch(fetchAutoSaveSettings()); // Fetch auto-save status and settings when the component mounts
}, [autoSaveSettings.active]);
 
console.log('autoSaveSettings.active:', autoSaveSettings.active)
console.log('autoSaveSettings.amount:', autoSaveSettings.amount)
console.log('autoSaveSettings.frequency:', autoSaveSettings.frequency)
console.log('accountBalances.savings:', accountBalances.savings)
console.log('accountBalances.investment:', accountBalances.investment)




  return (
    <View style={styles.container}>
     <Header navigation={navigation} headerText='SAVE'/>

  <ScrollView showsVerticalScrollIndicator={false}>

      <Title>Save</Title>
      <Subtitle>Earn 10% p.a. every January and July</Subtitle>


      <View style={styles.swiper}>
      <Swiper
          autoplay
          autoplayTimeout={10}
          showsPagination={true}
          dotStyle={styles.dot}
          activeDotStyle={styles.activeDot}
          paginationStyle={styles.paginationContainer}
        >
          <Swiper>
            <View style={styles.propertyContainer}>
              <Ionicons name="wallet-outline" size={34} color="#4C28BC" style={{ marginRight: 15 }} />
              <View style={styles.progressBarContainer}>
                <ScrollView showsVerticalScrollIndicator={false}>
                  <Text style={styles.propertyText}>
                  <Text style={{ fontFamily: 'proxima', color: '#4C28BC' }}>Your Savings Goal: </Text>
                  You should be saving 
                  <Text style={styles.goalText}> ₦{formatWithCommas(roundToNearestThousand(userInfo.savings_goal_amount / (userInfo.time_period * 12)))}
                  </Text>/month to reach
                  <Text style={styles.goalText}> ₦{formatWithCommas(roundToNearestThousand(userInfo.savings_goal_amount))} </Text>
                  for your <Text style={styles.goalText}>{userInfo.preferred_asset}</Text> investment in
                  <Text style={styles.goalText}> {userInfo.time_period}</Text>
                  <Text style={styles.restText}> years. And you're now</Text>
                  <Text style={styles.percentageText}> {percentage(0).toFixed(2)}%</Text>
                  <Text style={styles.restText}> to success. Well done!</Text>
                </Text>
                </ScrollView>
                <ProgressBar progress={percentage(0)/100} color="green" height={6} style={styles.progressBar} />
              </View>
            </View>
          </Swiper>
          <Swiper>
            <View style={styles.propertyContainer}>
              <Ionicons name="arrow-up-outline" size={34} color="#4C28BC" style={{ marginRight: 15 }} />
              <View style={styles.progressBarContainer}>
                <Text style={styles.propertyText}>
                  <Text style={{ fontFamily: 'proxima', color: '#4C28BC'}}>Top Saver: </Text>
                  Hey {userInfo?.firstName ? `${userInfo.firstName},` : ''} you're <Text style={styles.percentageText}>65%</Text> from being one of the top savers of {currentMonth}. Keep growing your funds to earn extra points, bonuses, rewards, and cash as top saver.
                </Text>
                <ProgressBar progress={0.65} color="green" height={6} style={styles.progressBar} />
              </View>
            </View>
          </Swiper>
        </Swiper>
        </View>
      
        <SectionTitle>MY SAVINGS</SectionTitle>

        <ImageBackground
  source={require('./icb2.png')}
  style={styles.savingsContainer}
  imageStyle={styles.backgroundImage}
  >
            <View style={styles.savingsLine1}>
          <Ionicons name="save-outline" size={17} color="#A9A9A9" style={{ marginLeft: 16, marginTop: 6 }} />
          <Text style={styles.greyText}>Total Savings    <Text style={styles.rateText}>@10% p.a.</Text> </Text>
        </View>


        
        <View style={styles.amountContainer}>
        <Text style={styles.dollarSign}>₦</Text>
        <Text style={styles.savingsAmount}>
        {Math.floor(accountBalances.savings).toLocaleString()}
        </Text>
        <Text style={styles.decimal}>.{String(accountBalances.savings).split('.')[1]}</Text>
        </View>

       
        <View style={styles.autoSaveContainer}>
            <Ionicons name="car-outline" size={20} marginRight={5} marginTop={-1} style={[styles.autoSaveText, autoSaveSettings.active ? styles.greenText : styles.grayText]} />
            <Text style={[styles.autoSaveText, autoSaveSettings.active ? styles.greenText : styles.grayText]}>
              {autoSaveSettings.active ? 'AutoSave is ON' : 'AutoSave is OFF'}
            </Text>

            <Switch
              title="Open Modal" 
              style={styles.switch}
              trackColor={{ false: 'grey', true: '#0AA447' }}
              thumbColor={autoSaveSettings.active ? '#43FF8E' : 'silver'}
              ios_backgroundColor="#3e3e3e"
              onValueChange={handleActivateAutoSave}
              value={autoSaveSettings.active}
            />

          <AutoSaveModal
          autoSave={autoSave}
          setAutoSave={setAutoSave}
          autoSaveModalVisible={autoSaveModalVisible}
          setAutoSaveModalVisible={setAutoSaveModalVisible}
          onConfirm={handleConfirmAutoSave}
          navigation={navigation}
          amount={amount} // Pass the amount as a prop
          frequency={frequency} // Pass the frequency as a prop
          />

        
        <DeactivateAutoSaveModal
          autoSave={autoSave}
          setAutoSave={setAutoSave}
          deactivateAutoSaveModalVisible={deactivateAutoSaveModalVisible}
          setDeactivateAutoSaveModalVisible={setDeactivateAutoSaveModalVisible}
          onConfirm={handleConfirmDeactivateAutoSave}
          frequency={frequency} // Pass the current frequency to the modal
          navigation={navigation}
          route={route} // Pass the route prop here
        />

        </View>
    </ImageBackground>


    
    <View>
          {autoSaveSettings.active ? (
            <Text style={styles.autoSaveSetting}>
              You're AutoSaving ₦{autoSaveSettings.amount} {autoSaveSettings.frequency} <Ionicons name="checkmark-circle" size={20} color="#0AA447" marginBottom={10} />
            </Text>
          ) : (
            <Text style={styles.autoSaveText} alignSelf='center' marginTop={10}>AutoSave is OFF: Use the switch above to turn ON</Text>
          )}
        </View>


        <View>
          <TouchableOpacity style={styles.quickSaveButton} onPress={handleQuickSave}>
          <Ionicons name="save-outline" size={22} color="#fff" style={{ marginRight: 4 }} />
          <Text style={styles.quickSaveText}>QuickSave</Text>
        </TouchableOpacity>
        </View>

      {quickSaveModalVisible && (
  <QuickSaveModal
  navigation={navigation}
  quickSaveModalVisible={quickSaveModalVisible} 
  setQuickSaveModalVisible={setQuickSaveModalVisible}
  setIsSuccessVisible={setIsSuccessVisible} // Pass the setIsSuccessVisible function here
  />
)}


      <SafeAreaView style={styles.transactionContainer}>

      <Divider />

<SectionTitle>SAVINGS TRANSACTIONS</SectionTitle>


<View style={styles.transactionsContainer}>
  {userTransactions.length > 0 ? (
    userTransactions
      .filter(
        (transaction) =>
          [
            "Card Successful",
            "QuickSave",
            "AutoSave",
          ].includes(transaction.description) // Filter transactions with these descriptions
      )
      .slice(0, 5)
      .map((transaction, index) => (
        // Inside your Save component where you are rendering transactions
        <View key={index} style={styles.transactionItem}>
          <Ionicons
            name={iconMapping[transaction.description] || "card-outline"}
            size={25}
            style={styles.transactionIcon}
          />
          <View style={styles.transactionText}>
            <Text style={styles.transactionDescription}>
              {transaction.description}
            </Text>
            <Text style={styles.transactionDate}>
              {formatDate(transaction.date)} | {formatTime(transaction.time)}
            </Text>
            <Text style={styles.transactionID}>
              ID: {transaction.transaction_id}
            </Text>
          </View>
          <View style={styles.transactionAmountContainer}>
            <Text
              style={
                transaction.transaction_type === "debit"
                  ? styles.negativeAmount
                  : styles.transactionAmount
              }
            >
              ₦{transaction.amount}
            </Text>
          </View>
        </View>
      ))
  ) : (
    <View style={styles.noTransactionsContainer}>
      <Text style={styles.noTransactionsMessage}>
        Your most recent savings will appear here.
      </Text>
    </View>
  )}
</View>


    </SafeAreaView>
    </ScrollView>

    <TouchableOpacity
        style={styles.quickSaveButtonCircle}
        onPress={handleQuickSave}
      >
        <Ionicons name="save-outline" size={25} color="#fff" />
      </TouchableOpacity>

      {isSuccessVisible && (
      <Success  
      isVisible={isSuccessVisible}
      onClose={handleCloseSuccessModal} // Pass the callback function
      navigation={navigation}
      />
      )}


    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F1FF',
  },


   header: {
        marginTop: 50,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 15,
      backgroundColor: 'white',
      height: 43,
    },
    icon: {
      marginRight: 0,
    },

    headerContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',

    },
 
    headerText:{
    flex: 1,
    color: 'silver',
    alignSelf: 'center',
    marginLeft: 15,
    fontFamily: 'karla',
    letterSpacing: 3,
    },

    person: {
        borderWidth: 1.5,
        padding: 4.5,
        borderRadius: 80,
        borderColor: '#4C28BC',
        height: 35,
        width: 35,
        alignSelf: 'center',
        alignItems: 'center',
        alignContent: 'center'
    },

    bell: {
        marginLeft: 6,
        borderWidth: 1.5,
        borderColor: '#4C28BC',
        padding: 4.5,
        height: 35,
        width: 35,
        borderRadius: 80,
        alignSelf: 'center',
        alignItems: 'center',
        alignContent: 'center'
    },

  

  swiper: {
    height: 125, 
    width:'100%'
  },

  dot: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)', 
    width: 5,
    height: 5,
    borderRadius: 5,
    marginLeft: 3,
    marginRight: 3,
    marginTop: 3,
    marginBottom: 3,
  },
  activeDot: {
    backgroundColor: '#4C28BC',
    width: 10,
    height: 4,
    borderRadius: 5,
    marginLeft: 3,
    marginRight: 3,
    marginTop: 3,
    marginBottom: 3,
  },

  paginationContainer: {
    bottom: 0, // Adjust the value as per your requirement
  },
  

  propertyContainer: {
    alignItems: 'center',
    paddingHorizontal: 16,
    flexDirection: 'row',
    backgroundColor: '#DCD1FF',
    padding: 15,
    marginHorizontal: 20,
    borderRadius: 10,
  },
  
  propertyText: {
    fontSize: 14,
    fontWeight: 'normal',
    fontFamily: 'karla',
    letterSpacing: -0.2,
    color: 'black',
    marginBottom: 8,  // Add some bottom margin to separate from the progress bar
  },
  
  progressBarContainer: {
    flex: 1,
    flexDirection: 'column',
    marginLeft: 3,  // Adjust the left margin to align with the text
  },
  progressBar: {
    height: 3.5,
    backgroundColor: '#AEA5E1',
    borderRadius: 10,
  },
 

    welcomeText: {
     color: '#4C28BC',
     fontFamily: 'ProductSansBold',
    },
    
 
    
    profileIcons: {
    flexDirection: 'row',
    },
   
    propertyIcon: {
    marginRight: 10,
    },
   
    goalText:{
      flex: 1,
      fontSize: 14,
      fontFamily: 'nexa',
      letterSpacing: -0.2,
      color: 'black',
    },

    percentageText:{
      flex: 1,
      fontSize: 14,
      fontFamily: 'proxima',
      letterSpacing: -0.2,
      color: 'green',
    },
    restText:{
      flex: 1,
      fontSize: 14,
      fontFamily: 'karla',
      letterSpacing: -0.2,
      color: 'black',
    },

    

    savingsContainer: {
    flexDirection: 'column',
    backgroundColor: '#4C28BC',
    marginHorizontal: 20,
    borderRadius: 10,
    marginTop: 5,
    alignItems: 'center',
    height: 150,
    },

    
backgroundImage: {
  flex: 1,
  resizeMode: 'cover',
  borderTopLeftRadius: 10,
  borderTopRightRadius: 10,
},


    savingsLine1: {
      flexDirection: 'row',
    color: '#8E8E93',
    marginTop: 8,
    },
    
    greyText: {
    marginLeft: 8,
    marginTop:8,
    fontSize: 11,
    color: '#8E8E93',
    fontFamily: 'karla',
    textAlign: 'center',

    },

    rateText: {
      fontSize: 11,
      color: '#43FF8E',
      marginRight: 278,
      fontFamily: 'karla',
      },

    amountContainer: {
      flexDirection: 'row',
      alignItems: 'flex-start'
    },
  
    dollarSign: {
      fontSize: 20,
      fontFamily: 'karla',
      textAlign: 'center',
      marginTop: 12,
        color: 'silver',
        letterSpacing: -2,
      },

      decimal: {
        fontSize: 20,
        fontFamily: 'karla',
        textAlign: 'center',
        marginTop: 12,
          color: 'silver',
          letterSpacing: -2,
        },

    savingsAmount: {
    fontSize: 80,
    fontFamily: 'karla',
    textAlign: 'center',
    letterSpacing: -4,
    marginRight: 5,
    marginLeft: 5,
    marginTop: -10,
    marginBottom: -10,
      color: '#fff',
    },

     

      autoSaveContainer: {
        flexDirection: 'row',
        marginTop: 7
      },

      autoSaveText: {
        color: 'silver',
        fontFamily: 'karla-italic',
        marginRight: 5,
      },

      grayText: {
        color: 'silver',
      },
      greenText: {
        color: '#43FF8E',
      },

      switch:{
        marginTop: -15,
      }, 
      
      autoSaveSettingContainer: {
        flexDirection: 'column',
        marginTop: 10,
      },
      autoSaveSetting: {
        marginTop: 5,
        color: '#04A447',
        position: 'relative',
        alignItems: 'center',
        alignSelf: 'center',
        fontFamily: 'proxima',
      },

     
    quickSaveButton: {
      marginTop: 15,
      flexDirection: 'row',
      backgroundColor: '#4C28BC',
      width: 140,
      height: 40,
      alignItems: 'center',
      justifyContent: 'center',
      alignSelf: 'center',
      borderRadius: 10,
      marginBottom: 0,
    
    },
    quickSaveText: {
      color: '#fff',
      fontSize: 18,
      fontFamily: 'ProductSans',
    },
    navigatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    },
    navigatorIndicator: {
    height: 3,
    width: 10,
    borderRadius: 5,
    marginHorizontal: 5,
    backgroundColor: 'silver',
    },


    todoList: {
      marginTop: 2,
      marginLeft:20,
      color: 'grey',
      fontFamily: 'karla',
      letterSpacing: 2,
      marginBottom: 2,
    },
    
    

    transactionContainer: {
      marginTop: 25,
      flex: 1,
        },

    transactionsContainer: {
      borderRadius: 10,
      marginHorizontal: 20,
      marginTop: 5,
    },
    transactionItem: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 10,
      borderBottomWidth: 1,
      borderBottomColor: '#ccc',
    },
    transactionIcon: {
      backgroundColor: '#DEE4FC',
      color: '#4C28BC',
      padding: 8,
      borderRadius: 10,
      marginRight: 10,
    },
    transactionText: {
      flex: 1,
      alignItems: 'flex-start',

    },
    transactionDescription: {
      color: '#4C28BC',
      letterSpacing: -1,
      fontSize: 19,
      fontFamily: 'karla',
      marginTop: 3,
      textAlign: 'left',
      alignItems: 'flex-start',
    },
    transactionDate: {
      fontFamily: 'karla',
      fontSize: 10,
      marginTop: 1,
    },
    transactionTime: {
      fontFamily: 'karla',
      fontSize: 10,
      marginTop: 1,
    },
    transactionID: {
      fontFamily: 'nexa',
      fontSize: 10,
      marginTop: 1,
      color: '#4C28BC',
    },
    transactionAmount: {
      color: 'green',
      fontSize: 23,
      fontFamily: 'karla',
      letterSpacing: -1,
      marginTop: 10,
      textAlign: 'right',
    },

    negativeAmount: {
      color: 'red',
      fontSize: 23,
      fontFamily: 'karla',
      letterSpacing: -1,
      marginTop: 10,
      textAlign: 'right',
    },

    transactionAmountContainer: {
      textAlign: 'right',
      
    },

    noTransactionsContainer: {
      flex: 1,
      justifyContent: 'center', // Center vertically
      alignItems: 'center', // Center horizontally
    },
    noTransactionsMessage: {
      fontSize: 15,
      color: 'silver',
      fontFamily: 'karla-italic',
      marginTop: 140,
      marginBottom: 100
    },

    quickSaveButtonCircle: {
      position: 'absolute',
      bottom: 20,
      right: 20,
      backgroundColor: '#4C28BC',
      width: 60,
      height: 60,
      borderRadius: 40,
      borderBottomRightRadius: 0,
      alignItems: 'center',
      justifyContent: 'center',
      elevation: 10, // Add elevation to create a shadow

    },
  

});

export default Save;
