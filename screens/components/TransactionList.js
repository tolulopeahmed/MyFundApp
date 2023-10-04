import React, {useEffect, useState} from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserTransactions } from '../../ReduxActions';

const TransactionList = ({ transactions, transactionType }) => {
  const filteredTransactions = transactions.filter((transaction) =>
    transaction.description.includes(transactionType)
  );

  const userTransactions = useSelector((state) => state.bank.userTransactions);
  const [currentMonth, setCurrentMonth] = useState('');
  

  const iconMapping = {
    "Card Successful": "card-outline",
    "QuickSave": "save-outline",
    "AutoSave": "car-outline",
    "QuickInvest": "trending-up-outline",
    "AutoInvest": "car-sport-outline",
    "Withdrawal": "arrow-down-outline",
    "Withdrawal from Savings": "arrow-down-outline",
    "Pending Referral Reward": "ellipsis-horizontal-circle-outline",
    "Referral Reward": "checkmark-circle",
    "Withdrawal from Investment": "arrow-down-outline",
    "Property": "home-outline",
  };


  const getMessage = () => {
    if (filteredTransactions.length === 0) {
      if (transactionType === "QuickSave" || transactionType === "AutoSave") {
        return "You're yet to make any Savings.";
      } else if (transactionType === "QuickInvest" || transactionType === "AutoInvest") {
        return "You're yet to make any Investments.";
      } else if (transactionType === "Withdrawal" || transactionType === "Withdrawal from Savings") {
        return "You're yet to make any Withdrawals.";
      }
    } else {
      return "Your most recent transactions will appear here.";
    }
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



  return (
    <View style={styles.transactionsContainer}>
      {filteredTransactions.length > 0 ? (
        filteredTransactions
          .slice(0, 5)
          .map((transaction, index) => (
            <View key={index} style={styles.transactionItem}>
              <Ionicons
                name={iconMapping[transaction.description] || 'arrow-down-outline'}
                size={25}
                style={styles.transactionIcon}
              />
              <View style={styles.transactionText}>
                <Text style={styles.transactionDescription}>{transaction.description}</Text>
                <Text style={styles.transactionDate}>
                  {formatDate(transaction.date)} | {formatTime(transaction.time)}
                </Text>
                <Text style={styles.transactionID}>ID: {transaction.transaction_id}</Text>
              </View>
              <View style={styles.transactionAmountContainer}>
                <Text
                  style={
                    transaction.transaction_type === 'debit'
                      ? styles.negativeAmount
                      : styles.transactionAmount
                  }>
                  ₦{transaction.amount}
                </Text>
              </View>
            </View>
          ))
      ) : (
        <View style={styles.noTransactionsContainer}>
          <Text style={styles.noTransactionsMessage}>
          {getMessage()}
          </Text>
        </View>
      )}
    </View>
  );
};


const styles = StyleSheet.create({
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  noTransactionsMessage: {
    fontSize: 15,
    color: 'silver',
    fontFamily: 'karla-italic',
    marginTop: 80,
    marginBottom: 80,
    textAlign: 'center',
  },
});

export default TransactionList;
