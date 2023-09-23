import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import Header from '../components/Header';
import { Ionicons } from '@expo/vector-icons';
import Divider from '../components/Divider';
import WithdrawModal from './WithdrawModal';
import Title from '../components/Title';
import Subtitle from '../components/Subtitle';
import { useSelector, useDispatch } from 'react-redux'; 
import { updateAccountBalances, updateUserTransactions, fetchAccountBalances, fetchUserTransactions } from '../../ReduxActions';
import SectionTitle from '../components/SectionTitle';

const Withdraw = ({ navigation, route }) => {
  const [withdrawModalVisible, setWithdrawModalVisible] = useState(false); // define modalVisible state
  const dispatch = useDispatch(); // Create a dispatch function
  const accountBalances = useSelector((state) => state.bank.accountBalances);
  const userTransactions = useSelector((state) => state.bank.userTransactions);
  const userInfo = useSelector((state) => state.bank.userInfo);

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


  

  useEffect(() => {
    if (route.params?.withdrawModalVisible) {
      setWithdrawModalVisible(true);
    }
    dispatch(fetchAccountBalances()); // Replace with your action to fetch account balances
    dispatch(fetchUserTransactions()); // Replace with your action to fetch user transactions
  }, [route.params]);


  return (
    <SafeAreaView style={styles.container}>
          <Header navigation={navigation} headerText="WITHDRAW" />

    <ScrollView showsVerticalScrollIndicator={false}>

      <Title>Withdraw</Title>
      <Subtitle>Move funds between accounts or to your bank</Subtitle>

      
          

      <ImageBackground
  source={require('./scb.png')}
  style={styles.walletContainer}
  imageStyle={styles.backgroundImage}
  >        
    <View style={styles.walletDetails}>
       
     <View flexDirection='row' marginTop={-4}>  
     <Ionicons name="md-save-outline" size={19} color="silver" />
          <Text style={styles.walletTitle}>SAVINGS</Text> 
          </View> 

         <View style={styles.amountContainer2}> 
         <Text style={styles.nairaSign}>₦</Text>
         <Text style={styles.savingsBalance}>{Math.floor(accountBalances.savings).toLocaleString()}</Text>
         <Text style={styles.nairaSign}>.{String(accountBalances.savings).split('.')[1]}</Text>
         </View>
         <Text style={styles.walletMessage}>Immediate withdrawal attracts <Text style={{color: 'orange'}}>2.5%</Text> fee.
</Text>
              
      <View style={styles.quickWithdrawButtonContainer}>
      <TouchableOpacity
      style={styles.quickWithdrawButton}
      onPress={() => setWithdrawModalVisible(true)} // Replace with the appropriate onPress function
    >
      <Text style={styles.quickWithdrawText}>Withdraw</Text>
    </TouchableOpacity>
    </View>
        </View>      
      </ImageBackground>


      <ImageBackground
  source={require('./icb2.png')}
  style={styles.walletContainer}
  imageStyle={styles.backgroundImage}
  >        
  <View style={styles.walletDetails}>
       
     <View flexDirection='row' marginTop={-4}>  
     <Ionicons name="md-trending-up-outline" size={19} color="silver" />
          <Text style={styles.walletTitle}>SPONSORSHIP INVESTMENT</Text> 
          </View> 

         <View style={styles.amountContainer2}> 
         <Text style={styles.nairaSign}>₦</Text>
         <Text style={styles.investmentBalance}>{Math.floor(accountBalances.investment).toLocaleString()}</Text>
         <Text style={styles.nairaSign}>.{String(accountBalances.investment).split('.')[1]}</Text>
         </View>
         <Text style={styles.walletMessage}>Immediate withdrawal attracts <Text style={{color: 'orange'}}>5%</Text> fee.
</Text>

<View style={styles.quickWithdrawButtonContainer}>
      <TouchableOpacity
      style={styles.quickWithdrawButton}
      onPress={() => setWithdrawModalVisible(true)} // Replace with the appropriate onPress function
    >
      <Text style={styles.quickWithdrawText}>Withdraw</Text>
    </TouchableOpacity>
    </View>
        </View>
      </ImageBackground>


      <ImageBackground
  source={require('./icb2.png')}
  style={styles.walletContainer}
  imageStyle={styles.backgroundImage}
  >
            <View style={styles.walletDetails}>
       
     <View flexDirection='row' marginTop={-4}>  
     <Ionicons name="md-wallet-outline" size={19} color="silver" />
          <Text style={styles.walletTitle}>WALLET</Text> 
          </View> 

         <View style={styles.amountContainer2}> 
         <Text style={styles.nairaSign}>₦</Text>
         <Text style={styles.walletBalance}>{Math.floor(accountBalances.wallet).toLocaleString()}</Text>
         <Text style={styles.nairaSign}>.{String(accountBalances.wallet).split('.')[1]}</Text>
         </View>
         <Text style={styles.walletMessage}>Withdraw for <Text style={{color: '#43FF8E'}}>free</Text> anytime</Text>
 
        <WithdrawModal 
        navigation={navigation} 
        withdrawModalVisible={withdrawModalVisible} 
        setWithdrawModalVisible={setWithdrawModalVisible} />

      <View style={styles.quickWithdrawButtonContainer}>
      <TouchableOpacity
      style={styles.quickWithdrawButton}
      onPress={() => setWithdrawModalVisible(true)} // Replace with the appropriate onPress function
    >
      <Text style={styles.quickWithdrawText}>Withdraw</Text>
    </TouchableOpacity>
    </View>

        </View>      
      </ImageBackground>
      <TouchableOpacity style={styles.withdrawButton2} onPress={() => setWithdrawModalVisible(true)}>
          <Ionicons name="arrow-down-outline" size={24} color="#fff" style={{ marginRight: 4 }} />
          <Text style={styles.withdrawText2}>Withdraw</Text>
        </TouchableOpacity>
      
      <Divider />
     
      <SafeAreaView style={styles.transactionContainer}>
      <SectionTitle>WITHDRAWAL TRANSACTIONS</SectionTitle>

      

<View style={styles.transactionsContainer}>
  {userTransactions.length > 0 ? (
    userTransactions
      .filter(
        (transaction) =>
          [
            "Withdrawal from Savings",
            "Withdrawal from Investment",
            "Withdrawal from Wallet",
          ].includes(transaction.description)
      )
      .slice(0, 5)
      .map((transaction, index) => (
        // Inside your withdrawal screen component where you are rendering transactions
        <View key={index} style={styles.transactionItem}>
          <Ionicons
            name={iconMapping[transaction.description] || "arrow-down-outline"}
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
        {!userTransactions.some(
          (transaction) =>
            [
              "Withdrawal from Savings",
              "Withdrawal from Investment",
              "Withdrawal from Wallet",
            ].includes(transaction.description)
        )
          ? "Your most recent withdrawals will appear here."
          : "You're yet to make a withdrawal."} {/* Updated message */}
      </Text>
    </View>
  )}
</View>







    </SafeAreaView>

    </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F1FF',
  },

  walletContainer: {
    flexDirection: 'row',
    padding: 15,
    backgroundColor: '#4C28BC',
    marginHorizontal: 20,
    borderRadius: 10,
    marginTop: 5,
    marginBottom: 10,
    alignItems: 'center',
    height: 120,
  },

  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },

  amountContainer:{
    flex:1,
    flexDirection: 'column',
  },

  walletDetails: {
    flex: 1,
    flexDirection: 'column',
    marginLeft: 10,
  },
  
  walletTitle: {
    color: 'silver',
    fontSize: 12,
    fontFamily: 'ProductSans',
    marginTop: 3,
    marginBottom: 5,
    marginLeft: 7,
  },

  amountContainer2: {
    flexDirection: 'row',
    alignContent: 'flex-start',
    marginRight: 1,
    marginTop: -9,
  },

  walletBalance: {
    fontSize: 61,
    fontFamily: 'karla',
    textAlign: 'center',
    letterSpacing: -3,
    marginBottom: -25,
    marginTop: -1,
      color: '#43FF8E',
      padding: 1.5,
  },

  savingsBalance: {
    fontSize: 61,
    fontFamily: 'karla',
    textAlign: 'center',
    letterSpacing: -3,
    marginBottom: -25,
    marginTop: -1,
      color: '#fff',
      padding: 1.5,
  },

  investmentBalance: {
    fontSize: 61,
    fontFamily: 'karla',
    textAlign: 'center',
    letterSpacing: -3,
    marginBottom: -25,
    marginTop: -1,
      color: 'yellow',
      padding: 1.5,
  },

  nairaSign: {
    fontSize: 16,
    fontFamily: 'karla',
    marginTop: 20,
      color: 'silver',
      letterSpacing: -0.5,
    
    },

    decimal: {
      fontSize: 16,
      fontFamily: 'karla',
      marginTop: 10,
        color: 'silver',
        letterSpacing: -2,
      
      },

   

  walletMessage: {
    color: 'silver',
    fontSize: 10,
    fontFamily: 'karla',
    letterSpacing: -0.3,
    marginLeft: 5,
    marginTop: 25,
  },

  withdrawButton: {
    backgroundColor: '#9D8CD7',
borderRadius: 8,
paddingVertical: 4,
width: 65,
marginLeft: 265,
marginTop: -15,
    
    },
    withdrawText: {
      fontSize: 12,
      color: "white",
      fontFamily: 'ProductSans',
      alignSelf: 'center',
    },

  savingsContainer: {
    marginVertical: 10,
    marginHorizontal: 20,
    borderRadius: 10,
    padding: 15,
  },
  savingsIconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  savingsIcon: {
    color: '#9D8CD7',
    fontSize: 30,
    marginRight: 10,
  },
  savingsHeaderText: {
    color: '#6C63FF',
    fontFamily: 'ProductSansBold',
    fontSize: 18,
    marginBottom: 5,
  },
  savingsSubText: {
    color: '#958FA3',
    fontFamily: 'ProductSans',
    fontSize: 14,
    marginBottom: 10,
  },
  savingsBalanceText: {
    color: '#6C63FF',
    fontFamily: 'ProductSansBold',
    fontSize: 20,
    marginRight: 10,
  },
  savingsButton: {
    backgroundColor: '#9D8CD7',
    width: 100,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  savingsButtonText: {
    color: '#fff',
    fontFamily: 'ProductSans',
    fontSize: 16,
  },
  sponsorshipContainer: {
    flexDirection: 'row',
    backgroundColor: '#4C28BC',
    marginVertical: 10,
    marginHorizontal: 20,
    borderRadius: 10,
    padding: 15,
  },
  sponsorshipIconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sponsorshipIcon: {
    color: '#E5E5E5',
    fontSize: 30,
    marginRight: 10,
  },
  sponsorshipHeaderText: {
    color: '#fff',
    fontFamily: 'ProductSansBold',
    fontSize: 18,
    marginBottom: 5,
  },
  sponsorshipSubText: {
    color: '#E5E5E5',
    fontFamily: 'ProductSans',
    fontSize: 14,
    marginBottom: 10,
  },
  sponsorshipBalanceText: {
    color: '#fff',
    fontFamily: 'ProductSansBold',
    fontSize: 20,
    marginRight: 10,
  },
  sponsorshipButton: {
    backgroundColor: '#9D8CD7',
    width: 100,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sponsorshipButtonText: {
    color: '#fff',
    fontFamily: 'ProductSans',
    fontSize: 16,
  },
  transactionsContainer: {
    backgroundColor: '#F6F6F6',
    padding: 20,
    flex: 1,
  },
  transactionCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  transactionHeaderText: {
    color: '#6C63FF',
    fontFamily: 'ProductSansBold',
    fontSize: 16,
    marginBottom: 5,
  },
  transactionSubText: {
    color: '#958FA3',
    fontFamily: 'ProductSans',
    fontSize: 14,
    marginBottom: 5,
  },
  transactionAmountText: {
    color: '#6C63FF',
    fontFamily: 'ProductSansBold',
    fontSize: 20,
  },




  
quickWithdrawButtonContainer: {
  position: 'absolute',
  bottom: 2,
  right: 2,
},

quickWithdrawButton: {
  backgroundColor: '#9D8CD7',
  borderRadius: 8,
  paddingVertical: 4,
  paddingHorizontal: 9,
  alignSelf: 'flex-end',
  flexDirection: 'row',
  alignItems: 'center',
},
quickWithdrawText: {
  fontSize: 14,
  color: 'white',
  fontFamily: 'ProductSans',
  alignSelf: 'center',
},



  withdrawButton2: {
    marginTop: 10,
    flexDirection: 'row',
    backgroundColor: '#4C28BC',
    width: 140,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    marginBottom: 5,
    alignSelf: 'center'
  },
  withdrawText2: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'ProductSans',
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
    marginTop: 1,
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
    fontSize: 18,
    fontFamily: 'karla',
    marginTop: 3,
    textAlign: 'left',
    alignItems: 'flex-start',
  },
  transactionDate: {
    fontFamily: 'karla',
    fontSize: 12,
    marginTop: 3,
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
    color: 'brown',
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

});

export default Withdraw;



