import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import Header from '../components/Header';
import { Ionicons } from '@expo/vector-icons';
import Divider from '../components/Divider';
import WithdrawModal from './WithdrawModal';
import Title from '../components/Title';

const Withdraw = ({ navigation, route }) => {
  const [withdrawModalVisible, setWithdrawModalVisible] = useState(false); // define modalVisible state

  const balance = 7500.25; // replace with actual balance
  const savingsBalance = 250000.50;

  useEffect(() => {
    if (route.params?.withdrawModalVisible) {
      setWithdrawModalVisible(true);
    }
  }, [route.params]);


  return (
    <SafeAreaView style={styles.container}>
          <Header navigation={navigation} headerText="WITHDRAW" />

    <ScrollView showsVerticalScrollIndicator={false}>

      <Title>Withdraw</Title>
      
      <View style={styles.walletContainer}>
        <View style={styles.walletDetails}>
       
     <View flexDirection='row' marginTop={-8}>  
     <Ionicons name="md-wallet-outline" size={21} color="silver" />
          <Text style={styles.walletTitle}>WALLET</Text> 
          </View> 

         <View style={styles.amountContainer2}> 
         <Text style={styles.nairaSign}>₦</Text>
         <Text style={styles.walletBalance}>7500</Text>
         <Text style={styles.nairaSign}>25</Text>
         </View>
         <Text style={styles.walletMessage}>Withdraw for <Text style={{color: '#43FF8E'}}>free</Text> anytime</Text>
 
        <WithdrawModal 
        navigation={navigation} 
        withdrawModalVisible={withdrawModalVisible} 
        setWithdrawModalVisible={setWithdrawModalVisible} />

        </View>
      
      </View>
      

      <View style={styles.walletContainer}>
        <View style={styles.walletDetails}>
       
     <View flexDirection='row' marginTop={-8}>  
     <Ionicons name="md-save-outline" size={21} color="silver" />
          <Text style={styles.walletTitle}>SAVINGS</Text> 
          </View> 

         <View style={styles.amountContainer2}> 
         <Text style={styles.nairaSign}>₦</Text>
         <Text style={styles.walletBalance}>250,000</Text>
         <Text style={styles.nairaSign}>00</Text>
         </View>
         <Text style={styles.walletMessage}>Immediate withdrawal attracts <Text style={{color: 'orange'}}>2.5%</Text> fee.
</Text>
       
        
        </View>
      
      </View>

      <View style={styles.walletContainer}>
        <View style={styles.walletDetails}>
       
     <View flexDirection='row' marginTop={-8}>  
     <Ionicons name="md-trending-up-outline" size={21} color="silver" />
          <Text style={styles.walletTitle}>SPONSORSHIP INVESTMENT</Text> 
          </View> 

         <View style={styles.amountContainer2}> 
         <Text style={styles.nairaSign}>₦</Text>
         <Text style={styles.walletBalance}>3,650,200</Text>
         <Text style={styles.nairaSign}>00</Text>
         </View>
         <Text style={styles.walletMessage}>Immediate withdrawal attracts <Text style={{color: 'orange'}}>5%</Text> fee.
</Text>
        </View>
      </View>
    
      <TouchableOpacity style={styles.withdrawButton2} onPress={() => setWithdrawModalVisible(true)}>
          <Ionicons name="arrow-down-outline" size={24} color="#fff" style={{ marginRight: 4 }} />
          <Text style={styles.withdrawText2}>Withdraw</Text>
        </TouchableOpacity>
      
      <Divider />
     
     
      <SafeAreaView style={styles.transactionContainer}>
      <Text style={styles.todoList}>WITHDRAWAL TRANSACTIONS</Text>

        <View style={styles.transactionsContainer}>
          <View style={styles.transactionItem}>
            <Ionicons
              name="arrow-down-outline"
              size={25}
              style={styles.transactionIcon}
            />
            <View style={styles.transactionText}>
              <Text style={styles.transactionDescription}>Withdrawal from Wallet</Text>
              <Text style={styles.transactionDate}>05 Mar, 2023, 11:30am</Text>
            </View>
            <View>
            <Text style={styles.negativeAmount}>-300.50</Text>
            </View>
          </View>
          <View style={styles.transactionItem}>
            <Ionicons
              name="arrow-down-outline"
              size={25}
              style={styles.transactionIcon}
            />
            <View style={styles.transactionText}>
              <Text style={styles.transactionDescription}>Withdraw from Savings</Text>
              <Text style={styles.transactionDate}>03 Mar, 2023, 10:15am</Text>
            </View>
            <View>
            <Text style={styles.negativeAmount}>-1000.00</Text>
            </View>
          </View>
          <View style={styles.transactionItem}>
            <Ionicons
              name="arrow-down-outline"
              size={25}
              style={styles.transactionIcon}
            />
            <View style={styles.transactionText}>
              <Text style={styles.transactionDescription}>
                Withdrawal from Savings
              </Text>
              <Text style={styles.transactionDate}>01 Mar, 2023, 9:30am</Text>
            </View>
            <View style={styles.transactionAmountContainer}>
            <Text style={styles.negativeAmount}>-500.00</Text>
            </View>
          </View>
          </View>
          {/* Add more transaction items here */}
          <View style={styles.transactionsContainer}>
          <View style={styles.transactionItem}>
            <Ionicons
              name="arrow-down-outline"
              size={25}
              style={styles.transactionIcon}
            />
            <View style={styles.transactionText}>
              <Text style={styles.transactionDescription}>Withdrawal from Wallet</Text>
              <Text style={styles.transactionDate}>05 Mar, 2023, 11:30am</Text>
            </View>
            <View>
            <Text style={styles.negativeAmount}>-300.50</Text>
            </View>
          </View>
          <View style={styles.transactionItem}>
            <Ionicons
              name="arrow-down-outline"
              size={25}
              style={styles.transactionIcon}
            />
            <View style={styles.transactionText}>
              <Text style={styles.transactionDescription}>Withdrawal from Investment</Text>
              <Text style={styles.transactionDate}>03 Mar, 2023, 10:15am</Text>
            </View>
            <View>
            <Text style={styles.negativeAmount}>-1000.00</Text>
            </View>
          </View>
          <View style={styles.transactionItem}>
            <Ionicons
              name="arrow-down-outline"
              size={25}
              style={styles.transactionIcon}
            />
            <View style={styles.transactionText}>
              <Text style={styles.transactionDescription}>
                Withdrawal from Savings
              </Text>
              <Text style={styles.transactionDate}>01 Mar, 2023, 9:30am</Text>
            </View>
            <View style={styles.transactionAmountContainer}>
            <Text style={styles.negativeAmount}>-500.00</Text>
            </View>
          </View>
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
    marginTop: 4,
    marginBottom: 10,
    alignItems: 'center',
    height: 120,
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
    marginLeft: 7,
  },

  amountContainer2: {
    flexDirection: 'row',
    alignContent: 'flex-start',
    marginRight: 1,
    marginTop: -9,
  },

  walletBalance: {
    fontSize: 55,
    fontFamily: 'karla',
    textAlign: 'center',
    letterSpacing: -4,
    marginBottom: -20,
      color: '#fff',
  },

  nairaSign: {
    fontSize: 25,
    fontFamily: 'karla',
    marginTop: 10,
      color: 'silver',
      letterSpacing: -2,
    
    },

   

  walletMessage: {
    color: '#fff',
    fontSize: 10,
    fontFamily: 'karla',
    letterSpacing: -0.3,
    marginLeft: 5,
    marginTop: 20,
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

});

export default Withdraw;



