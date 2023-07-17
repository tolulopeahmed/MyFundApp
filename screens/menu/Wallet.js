import React, { useState } from 'react';
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, StyleSheet, Switch } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Divider from '../components/Divider';
import WithdrawModal from './WithdrawModal';
import Title from '../components/Title';
import Subtitle from '../components/Subtitle';


const Wallet = ({ navigation, firstName }) => {
  const [withdrawModalVisible, setWithdrawModalVisible] = useState(false);

  const handleWithdraw = () => {
    navigation.navigate('Withdraw', { withdrawModalVisible: true });
  };
  
  return (
    <View style={styles.container}>

<View style={styles.header}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back-outline" size={30} color="#4C28BC" />
      </TouchableOpacity>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>MY EARNINGS</Text>
  
        </View>
    </View>

<ScrollView showsVerticalScrollIndicator={false}>

      <Title>Wallet</Title>
      <Subtitle>Your wallet ID is your email address</Subtitle>


      <View style={styles.propertyContainer}>
        <Ionicons name="wallet-outline" size={34} color="#4C28BC" style={{ marginRight: 15 }} />
        <View style={styles.progressBarContainer}> 
        <Text style={styles.propertyText}>Withdraw from your Wallet at any time into your bank account or give your wallet ID to other MyFund users to receive gift funds from them.</Text>
      </View>
      </View>
      
      <View style={styles.savingsContainer}>
        <View style={styles.savingsLine1}>
          <Ionicons name="wallet-outline" size={17} color="#A9A9A9" style={{ marginLeft: 16, marginTop: 6 }} />
          <Text style={styles.greyText}>Total Earnings </Text>
        </View>
        <View style={styles.amountContainer}>
        <Text style={styles.dollarSign}>₦</Text><Text style={styles.savingsAmount}>250,000</Text><Text style={styles.decimal}>.50</Text>
        </View>
        <View style={styles.autoSaveContainer}>
       
        </View>
      
       
      </View>

      <View>
          <TouchableOpacity
           style={styles.withdrawButton}
           onPress={handleWithdraw}
         >
          
          <Ionicons name="arrow-down-outline" size={24} color="#fff" style={{ marginRight: 4 }} />
          <Text style={styles.quickSaveText}>Withdraw</Text>
        </TouchableOpacity>
        </View>


<Divider/>

      <SafeAreaView style={styles.transactionContainer}>
      <Text style={styles.todoList}>Wallet Transactions</Text>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.transactionsContainer}>
          <View style={styles.transactionItem}>
            <Ionicons
              name="checkmark-circle"
              size={25}
              style={styles.transactionIcon}
            />
            <View style={styles.transactionText}>
              <Text style={styles.transactionDescription}>pelumi@gmail.com</Text>
              <Text style={styles.transactionDate}>05 Mar, 2023, 11:30am</Text>
            </View>
            <View>
            <Text style={styles.transactionAmount}>+300.50</Text>
            </View>
          </View>
          <View style={styles.transactionItem}>
            <Ionicons
              name="checkmark-circle"
              size={25}
              style={styles.transactionIcon}
            />
            <View style={styles.transactionText}>
              <Text style={styles.transactionDescription}>timothy@yahoo.co.uk</Text>
              <Text style={styles.transactionDate}>03 Mar, 2023, 10:15am</Text>
            </View>
            <View>
            <Text style={styles.transactionAmount}>+1000.00</Text>
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
                Withdrawal From Wallet
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
              name="checkmark-circle"
              size={25}
              style={styles.transactionIcon}
            />
            <View style={styles.transactionText}>
              <Text style={styles.transactionDescription}>adeyemijohn@gmail.com</Text>
              <Text style={styles.transactionDate}>05 Mar, 2023, 11:30am</Text>
            </View>
            <View>
            <Text style={styles.transactionAmount}>+300.50</Text>
            </View>
          </View>
          <View style={styles.transactionItem}>
            <Ionicons
              name="checkmark-circle"
              size={25}
              style={styles.transactionIcon}
            />
            <View style={styles.transactionText}>
              <Text style={styles.transactionDescription}>patrickmundi@gmail.com</Text>
              <Text style={styles.transactionDate}>03 Mar, 2023, 10:15am</Text>
            </View>
            <View>
            <Text style={styles.transactionAmount}>+1000.00</Text>
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
                Withdrawal From Wallet
              </Text>
              <Text style={styles.transactionDate}>01 Mar, 2023, 9:30am</Text>
            </View>
            <View style={styles.transactionAmountContainer}>
            <Text style={styles.negativeAmount}>-500.00</Text>
            </View>
          </View>
          </View>
          </ScrollView>
    </SafeAreaView>
   
    {withdrawModalVisible && (
   <WithdrawModal 
   navigation={navigation} 
   withdrawModalVisible={withdrawModalVisible} 
   setWithdrawModalVisible={setWithdrawModalVisible} />
)}

</ScrollView>
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




  profileIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  propertyContainer: {
    alignItems: 'center',
    paddingHorizontal: 16,
    flexDirection: 'row',
    backgroundColor: '#DCD1FF',
    padding: 15,
    marginHorizontal: 20,
    borderRadius: 10,
    marginTop: 5,
  },
  
  propertyText: {
    fontSize: 14,
    fontWeight: 'normal',
    fontFamily: 'karla',
    letterSpacing: -0.2,
    color: 'black',
    marginBottom: 8,  // Add some bottom margin to separate from the progress bar
  },
   

    welcomeText: {
     color: '#4C28BC',
     fontFamily: 'ProductSansBold',
    },
    
   
    
   
   
    propertyIcon: {
    marginRight: 10,
    },
    
    goalText:{
      flex: 1,
      fontSize: 14,
      fontFamily: 'karla',
      letterSpacing: -0.2,
     color: '#4C28BC',

    },
    restText:{
      flex: 1,
      fontSize: 14,
      fontFamily: 'karla',
      letterSpacing: -0.2,
      color: 'black',
    },

    progressBarContainer: {
      flex: 1,
      flexDirection: 'column',
    },
    progressBar: {
      height: 3.5,
      backgroundColor: '#AEA5E1',
      borderRadius: 10,


    },

    savingsContainer: {
    flexDirection: 'column',
    backgroundColor: '#4C28BC',
    marginHorizontal: 20,
    borderRadius: 10,
    marginTop: 20,
    alignItems: 'center',
    height: 150,
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
    },
  
    dollarSign: {
      fontSize: 40,
      fontFamily: 'karla',
      textAlign: 'center',
      marginTop: 8,
        color: 'silver',
      },

    savingsAmount: {
    fontSize: 70,
    fontFamily: 'karla',
    textAlign: 'center',
    letterSpacing: -4,
    marginRight: 0,
      color: '#fff',
    },

      decimal: {
        fontSize: 30,
        marginTop: 33,
        fontFamily: 'karla',
        textAlign: 'center',
        marginRight: 0,
        color: 'silver',
        letterSpacing: -2,

      },

      autoSaveContainer: {
        flexDirection: 'row',
        marginTop: 7
      },

      autoSaveText: {
        color: 'silver',
        fontFamily: 'karla',
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
        color: '#0AA447',
        position: 'absolute',
        alignItems: 'center',
        alignSelf: 'center',
      },


    withdrawButton: {
      marginTop: 30,
      flexDirection: 'row',
      backgroundColor: '#4C28BC',
      width: 140,
      height: 40,
      alignItems: 'center',
      justifyContent: 'center',
      alignSelf: 'center',
      borderRadius: 10,
      marginBottom: 25,
    
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
      fontSize: 18,
      color: 'black',
       fontFamily: 'ProductSansBold',
       
    },

    transactionContainer: {
      marginTop: 10,
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


});

export default Wallet;
