import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, StyleSheet, Switch } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faHouseCircleCheck } from '@fortawesome/free-solid-svg-icons';
import Title from '../components/Title';
import Subtitle from '../components/Subtitle';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAccountBalances, fetchUserTransactions, updateAccountBalances } from '../../ReduxActions';
import SectionTitle from '../components/SectionTitle';
import SellPropertyModal from './SellPropertyModal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';

const PropertyList = ({ navigation, properties }) => {
  const accountBalances = useSelector((state) => state.bank.accountBalances);
  const userTransactions = useSelector((state) => state.bank.userTransactions);
  const [sellPropertyModalVisible, setSellPropertyModalVisible] = useState(false); // define modalVisible state
  const [selectedProperty, setSelectedProperty] = useState(null); // Add this state variable
  const [showBalances, setShowBalances] = useState(true);
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      // Fetch the value from AsyncStorage and update the state
      const fetchShowBalances = async () => {
        const showBalancesValue = await AsyncStorage.getItem('showBalances');
        setShowBalances(showBalancesValue === 'true'); // Convert to boolean
      };
      fetchShowBalances();
    }
  }, [isFocused]);


  const iconMapping = {
 "FUNAAB": "home-outline",
    "Property": "home-outline",
    "IBADAN": "home-outline",

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
  


  return (
    <View style={styles.container}>

<View style={styles.header}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back-outline" size={30} color="#4C28BC" />
      </TouchableOpacity>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>PROPERTY LIST</Text>
        <TouchableOpacity style={styles.person}> 
            <Ionicons name="person-outline" size={22} color="#4C28BC" onPress={() => navigation.navigate('More', component={Profile} )}/>
          </TouchableOpacity>
      <TouchableOpacity style={styles.bell}>
            <Ionicons name="notifications-outline" size={22} color="#4C28BC" />
          </TouchableOpacity>
        </View>
    </View>

      <Title>My Properties</Title>
      <Subtitle>Buy more or sell your acquired properties</Subtitle>


      <ScrollView showsVerticalScrollIndicator={false}>

      <View style={styles.propertyContainer}>
        <Ionicons name="home-outline" size={34} color="#4C28BC" style={{ marginRight: 15 }} />
        <View style={styles.progressBarContainer}> 
        <Text style={styles.propertyText}>The properties you've bought will appear here and <Text style={{color: '#4C28BC'}}>the yearly rental income</Text>. Buy more to earn more. For special package deals, kindly contact admin</Text>
      </View>
      </View>
      
      <View style={styles.savingsContainer}>
        <View style={styles.savingsLine1}>
          <Ionicons name="home-outline" size={17} color="#A9A9A9" style={{ marginLeft: 16, marginTop: 6 }} />
          <Text style={styles.greyText}>Number of Properties    <Text style={styles.rateText}>@30%+ p.a.</Text> </Text>
        </View>
        <View style={styles.amountContainer}>
        {showBalances ? (
            <>
        <Text style={styles.savingsAmount}>{accountBalances.properties < 10 ? `0${Math.floor(accountBalances.properties)}` : Math.floor(accountBalances.properties)}</Text>
         </>
          ) : (
            <Text style={styles.savingsAmount}>**</Text>
          )}
        </View>
      </View>
          <TouchableOpacity style={styles.quickSaveButton} onPress={() => navigation.navigate('Ownership')}>
          <FontAwesomeIcon icon={faHouseCircleCheck} animation="beat" style={styles.buttonIcon} />
          <Text style={styles.quickSaveText}>Buy Property</Text>
        </TouchableOpacity>

      <View style={styles.transactionContainer}>
<SectionTitle>ACQUIRED PROPERTIES</SectionTitle>

      <View style={styles.containerHead}>
      <View style={styles.column}>
        <Text style={styles.text}>Acquired [Value] </Text>
      </View>
 
      <View style={styles.column}>
        <Text style={styles.text2}>                         Yearly Rent</Text>
      </View>
    </View>



        <View style={styles.transactionsContainer}>
  {userTransactions.some((transaction) =>
    ["FUNAAB", "IBADAN", "OAU"].includes(transaction.description)
  ) ? (
    userTransactions
      .filter((transaction) =>
        ["FUNAAB", "IBADAN", "OAU"].includes(transaction.description)
      )
      .map((transaction, index) => (
        <View key={index} style={styles.transactionItem}>
          <Ionicons
            name={iconMapping[transaction.description] || "arrow-down-outline"}
            size={25}
            style={styles.transactionIcon}
          />
          <View style={styles.transactionText}>
            <Text style={styles.transactionDescription}>{transaction.description} [ <Text style={{ fontSize: 12,}}>₦</Text><Text>{Math.floor(transaction.amount).toLocaleString()}<Text style={{ fontSize: 12 }}>.{String(transaction.amount).split('.')[1]}</Text>
            </Text> ]</Text>
            <Text style={styles.transactionDate}>{formatDate(transaction.date)} | {formatTime(transaction.time)}</Text>
            <Text style={styles.transactionID}>ID: {transaction.transaction_id}</Text>
          </View>
          <View style={styles.transactionAmountContainer}>
            <Text style={transaction.transaction_type === "debit" ? styles.negativeAmount : styles.transactionAmount}>
      
            <Text style={{ fontSize: 12,}}>₦</Text><Text>{Math.floor(transaction.rent_earned_annually).toLocaleString()}<Text style={{ fontSize: 12 }}>.{String(transaction.amount).split('.')[1]}</Text>
              </Text>
            </Text>
            <TouchableOpacity
                  style={styles.sellPropertyButton}
                  onPress={() => {
                    setSelectedProperty(transaction); // Set the selected property to the current transaction
                    setSellPropertyModalVisible(true);
                  }}
                >
                <Text style={styles.sellPropertyButtonText}>Sell Property</Text>
              </TouchableOpacity>

          </View>
        </View>
      ))
  ) : (
    <View style={styles.noTransactionsContainer}>
      <Text style={styles.noTransactionsMessage}>You're yet to acquire a property.</Text>
    </View>
  )}
</View>

   
        
<SellPropertyModal 
        navigation={navigation} 
        sellPropertyModalVisible={sellPropertyModalVisible} 
        setSellPropertyModalVisible={setSellPropertyModalVisible} 
        properties={properties} // Pass the properties as a prop
        transactions={userTransactions} // Pass the transactions as a prop
        selectedProperty={selectedProperty} // Pass the selected property to the modal

        />

    </View>
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
    
    progressBarContainer: {
      flex: 1,
      flexDirection: 'column',
      marginLeft: 3,  // Adjust the left margin to align with the text
    },
    
    savingsContainer: {
    flexDirection: 'column',
    backgroundColor: '#4C28BC',
    marginHorizontal: 20,
    borderRadius: 10,
    marginTop: 20,
    alignItems: 'center',
    height: 125,
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
      color: 'orange',
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

      buttonIcon: {
        color: '#FFFFFF',
        marginRight: 7,
      },
    quickSaveButton: {
      marginTop: 30,
      flexDirection: 'row',
      backgroundColor: '#4C28BC',
      width: 146,
      height: 40,
      alignSelf: 'center',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 10,
    
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
      marginBottom: 10,
    },
    

    containerHead: {
        backgroundColor: '#fff',
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '90%',
        alignSelf: 'center',
        height: 40,
        borderRadius: 5,
        marginTop: 10,
      },
      column: {
        alignItems: 'center',
        flex: 1,
        justifyContent: 'center',
      },
      text: {
        color: '#4C28BC',
        fontFamily: 'ProductSans',
        fontSize: 16,
      },
      text2: {
        color: 'green',
        fontFamily: 'ProductSans',
        fontSize: 16,
      },


      transactionContainer: {
        marginTop: 15,
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
    marginTop: 60,
    marginBottom: 60,
    textAlign: 'center', // Center the text
  },

  sellPropertyButton: {
    flexDirection: 'row',
    backgroundColor: 'silver',
    height: 15,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
    width: '52%',
    alignSelf: 'flex-end'
  },
  sellPropertyButtonText: {
    color: '#fff',
    fontSize: 9,
    fontFamily: 'ProductSans',
    paddingHorizontal: 7,
  },


});

export default PropertyList;
