import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Pressable } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const Notifications = ({ navigation, firstName }) => {
  const [selectedTab, setSelectedTab] = useState('All');
  
  const [transactions, setTransactions] = useState([
    {
      id: 1,
      type: 'transaction',
      description: 'AutoSave',
      date: '05 Mar, 2023, 11:30am',
      amount: '+300.50',
    },
    {
      id: 2,
      type: 'transaction',
      description: 'Withdrawal From Saving',
      date: '01 Mar, 2023, 9:30am',
      amount: '-500.00',
    },

    {
        id: 3,
        type: 'transaction',
        description: 'QuickSave',
        date: '05 Mar, 2023, 10:20am',
        amount: '+300.50',
      },
  ]);

  const [messages, setMessages] = useState([
    {
      id: 4,
      type: 'message',
      description: 'Great job! You\'ve made progress and reached stage 6 out of 9 on your journey to financial freedom.',
      date: '05 Mar, 2023, 11:30am',
    },
    {
      id: 5,
      type: 'message',
      description: 'Congratulations! You have received a bonus in your wallet for being one of the top savers for the month of July.',
      date: '05 August, 2023, 12:00pm',
    },
 
  ]);

  const allItems = [...transactions, ...messages];
  const filteredTransactions = transactions.filter(item => item.type === 'transaction');
  const filteredMessages = messages.filter(item => item.type === 'message');

  const renderList =
    selectedTab === 'All'
      ? allItems
      : selectedTab === 'Transactions'
      ? filteredTransactions
      : filteredMessages;

  return (
    <View style={styles.container}>
<View style={styles.header}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back-outline" size={30} color="#4C28BC" />
      </TouchableOpacity>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>NOTIFICATIONS</Text>
      
    
        </View>
    </View>


    
      <View flexDirection='row' alignSelf='center' padding={5} alignContents='space-between'>
      <Pressable
  style={[
    styles.cardContainer,
    selectedTab === 'All' && { backgroundColor: '#4C28BC' },
  ]}
  onPress={() => setSelectedTab('All')}
>
  <Text style={[styles.title2, selectedTab === 'All' && { color: '#fff' }]}>
    All
  </Text>
</Pressable>

<Pressable
  style={[
    styles.cardContainer,
    selectedTab === 'Transactions' && { backgroundColor: '#4C28BC' },
  ]}
  onPress={() => setSelectedTab('Transactions')}
>
  <Text
    style={[
      styles.title2,
      selectedTab === 'Transactions' && { color: '#fff' },
    ]}
  >
    Transactions
  </Text>
</Pressable>

<Pressable
  style={[
    styles.cardContainer,
    selectedTab === 'Messages' && { backgroundColor: '#4C28BC' },
  ]}
  onPress={() => setSelectedTab('Messages')}
>
  <Text
    style={[styles.title2, selectedTab === 'Messages' && { color: '#fff' }]}
  >
    Messages
  </Text>
</Pressable>

      </View>





      {renderList.map((item) => (
  <View key={item.id}>
    {item.type === 'transaction' ? (
      <View style={styles.transactionsContainer}>
        <View style={styles.transactionItem}>
          <Ionicons
            name="car-outline"
            size={25}
            style={styles.transactionIcon}
          />
          <View style={styles.transactionText}>
            <Text style={styles.transactionDescription}>
              {item.description}
            </Text>
            <Text style={styles.transactionDate}>{item.date}</Text>
          </View>
          <View>
            <Text style={styles.transactionAmount}>{item.amount}</Text>
          </View>
        </View>
      </View>
    ) : (
      <View style={styles.propertyContainer}>
        <Ionicons
          name="mail-outline"
          size={34}
          color="#4C28BC"
          style={{ marginRight: 15 }}
        />
        <View style={styles.textContainer}>
          <Text style={styles.propertyText}>{item.description}</Text>
          <Text style={styles.transactionDate}>{item.date}</Text>
        </View>
      </View>
    )}
  </View>
))}

    </View>
  );
};

// Your existing styles


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

  
    cardContainer: {
    borderWidth: 0.8,
    alignItems: 'center',
    flex: 1,
    backgroundColor: 'white',
    borderTopRightRadius: 15,
    borderTopLeftRadius: 15,
    borderBottomWidth: 0.8,
    borderLeftWidth: 0.8,
    borderRightWidth: 0.8,
    borderColor: 'silver',
    },

    
  title2: {
    fontSize: 16,
    fontFamily: 'proxima',
    color: 'silver',
    marginTop: 5,
    marginBottom: 5,
  },

  propertyContainer: {
    alignItems: 'center',
    paddingHorizontal: 16,
    flexDirection: 'row',
    backgroundColor: '#DCD1FF',
    padding: 15,
    marginHorizontal: 20,
    borderRadius: 10,
    marginTop: 10,
  },
  

  textContainer: {
    flex: 1,
    flexDirection: 'column',
    overflow: 'hidden',

  },
  
 
  propertyText: {
    flexShrink: 1,
    flexDirection: 'column',
    fontSize: 15,
    fontWeight: 'regular',
    fontFamily: 'ProductSans',
    color: '#4C28BC',
    position: 'relative',
    marginBottom: 5,
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

export default Notifications;
