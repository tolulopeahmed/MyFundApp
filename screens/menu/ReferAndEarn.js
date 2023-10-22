import React, { useState, useEffect } from 'react';
import { View, Text, Image, ScrollView, Pressable, TouchableOpacity, StyleSheet, Share } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Swiper from 'react-native-swiper';
import * as Clipboard from 'expo-clipboard';
import { MaterialIcons } from '@expo/vector-icons';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUserTransactions } from '../../ReduxActions';
import SectionTitle from '../components/SectionTitle';

const images = [
  require('./refer.png'),
  require('./howtoearn.png'),
];

const ReferAndEarn = ({ navigation, firstName }) => {
  const [isCopied, setIsCopied] = useState(false);
  const userInfo = useSelector((state) => state.bank.userInfo);
  const referralID = userInfo.email; // Assuming 'userInfo.email' contains the user's email
  const userTransactions = useSelector((state) => state.bank.userTransactions);
  const [totalConfirmedReferrals, setTotalConfirmedReferrals] = useState(0); // State for total confirmed referrals

  useEffect(() => {
    // Calculate the total confirmed referrals when the component mounts
    const confirmedReferralTransactions = userTransactions.filter(
      (transaction) => transaction.description === "Referral Reward (Confirmed)"
    );
    setTotalConfirmedReferrals(confirmedReferralTransactions.length);
  }, [userTransactions]);
  
  
  
  const iconMapping = {
    "Card Successful": "card-outline",
    "QuickSave": "save-outline",
    "AutoSave": "car-outline",
    "QuickInvest": "trending-up-outline",
    "AutoInvest": "car-sport-outline",
    "Withdrawal (Savings > Investment)": "arrow-down-outline",
    "Withdrawal (Investment > Savings)": "arrow-down-outline",
    "Withdrawal (Wallet > Savings)": "arrow-down-outline",
    "Withdrawal (Wallet > Investment)": "arrow-down-outline",
    "Withdrawal (Savings > Bank)": "arrow-down-outline",
    "Withdrawal (Investment > Bank)": "arrow-down-outline",
    "Withdrawal (Wallet > Bank)": "arrow-down-outline",
    "Property": "home-outline",
    "Referral Reward (Pending)": "ellipsis-horizontal-circle-outline",
    "Referral Reward (Confirmed)": "checkmark-circle",
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
  
  const handleCopyReferralID = () => {
    Clipboard.setString(referralID);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000); // Reset the copied state after 2 seconds
  };
  

  const handleImagePress = (index) => {
    switch (index) {
      case 0:
        handleShare(); // Call the handleShare function
        break;
      case 1:
        handleShare(); // Call the handleShare function
        break;
      default:
        break;
    }
  };

  const handleShare = () => {
    const message = `You'll be rewarded with N1000 bonus when you sign up on MyFund using my referral email: ${referralID}`;
    Share.share({
      message,
    });
  };




  return (
    <View style={styles.container}>
    <View style={styles.header}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back-outline" size={30} color="#4C28BC" />
      </TouchableOpacity>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>REFER AND EARN</Text>
      </View>
    </View>

    <Text style={styles.title}>Refer and Earn</Text>

    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Swiper
        autoplay
        autoplayTimeout={10}
        loop
        dotStyle={styles.dot}
        activeDotStyle={styles.activeDot}
        paginationStyle={styles.paginationContainer}
        containerStyle={styles.swiper}
      >
        {images.map((image, index) => (
          <Pressable
            key={index}
            style={styles.slideContainer}
            onPress={() => handleImagePress(index)}
          >
            <Image source={image} style={styles.slide} />
          </Pressable>
        ))}
      </Swiper>

      <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
        <Text style={styles.shareText}>Share and Earn</Text>
        <Ionicons name="share-social-outline" size={24} color="#fff" style={{ marginLeft: 10, marginRight: 15 }} />
      </TouchableOpacity>

      <View flexDirection='row' alignSelf='center'>
        <Text style={styles.referralText}>Referral ID:  <Text style={styles.referralID}>{referralID}</Text></Text>
        <TouchableOpacity onPress={handleCopyReferralID}>
          <Ionicons name="copy-outline" size={24} color="#4C28BC" style={{ marginLeft: 10, marginRight: 15 }} />
        </TouchableOpacity>
        {isCopied && (
          <View style={styles.copiedContainer}>
            <MaterialIcons name="check" size={24} color="green" style={styles.checkmark} />
            <Text style={styles.copiedText}>copied</Text>
          </View>
        )}
      </View>

      <View style={styles.transactionContainer}>
       <SectionTitle>REFERRAL LIST</SectionTitle> 

       <View style={styles.containerHead}>
  <View style={styles.column}>
    <Text style={styles.text}>
      My Referrals{" "}
      <Text style={{ fontFamily: 'ProductSans' }}>
        ({totalConfirmedReferrals < 10 ? `0${totalConfirmedReferrals}` : totalConfirmedReferrals})
      </Text>
    </Text>
  </View>
  <View style={styles.column}>
    <Text style={styles.text2}>Rewards Status</Text>
  </View>
</View>


        <View>

          <View style={styles.transactionsContainer}>
  {userTransactions.some((transaction) =>
    ["QuickSave", "AutoSave", "Referral Reward (Confirmed)", "Referral Reward (Pending)", "Card Transaction", "QuickInvest", "AutoInvest", "Withdrawal (Savings > Investment)", "Withdrawal (Investment > Savings)", "Withdrawal (Wallet > Savings)", "Withdrawal (Wallet > Investment)", "Withdrawal (Savings > Bank)", "Withdrawal (Investment > Bank)", "Withdrawal (Wallet > Bank)"].includes(transaction.description)
  ) ? (
    userTransactions
      .filter((transaction) =>
        ["QuickSave", "AutoSave", "Referral Reward (Confirmed)","Referral Reward (Pending)","Card Transaction", "QuickInvest", "AutoInvest", "Withdrawal (Savings > Investment)", "Withdrawal (Investment > Savings)", "Withdrawal (Wallet > Savings)", "Withdrawal (Wallet > Investment)", "Withdrawal (Savings > Bank)", "Withdrawal (Investment > Bank)", "Withdrawal (Wallet > Bank)"].includes(transaction.description)
      )
      .slice(0, 5)
      .map((transaction, index) => (
        <View key={index} style={styles.transactionItem}>

          <View style={styles.transactionText}>
            <Text style={styles.transactionDescription}>{transaction.referral_email}</Text>
            <Text style={styles.transactionDate}>{formatDate(transaction.date)} | {formatTime(transaction.time)}</Text>
            <Text style={styles.transactionID}>ID: {transaction.transaction_id} {transaction.description}</Text>
          </View>
          <View style={styles.transactionAmountContainer}>
              <Text style={
                transaction.transaction_type === "pending" ? styles.pendingAmount :
                transaction.transaction_type === "credit" ? styles.transactionAmount :
                styles.pendingAmount // Apply the pendingAmount style for pending transactions
              }>
                <Text style={{ fontSize: 12 }}>₦</Text>
                <Text>
                  {Math.floor(transaction.amount).toLocaleString()}
                  <Text style={{ fontSize: 12 }}>.{String(transaction.amount).split('.')[1]}     </Text>
                </Text>
              </Text>
            </View>

          <Ionicons
            name={iconMapping[transaction.description] || "arrow-down-outline"}
            size={25}
            style={styles.transactionIcon}
          />
        </View>
      ))
  ) : (
    <View style={styles.noTransactionsContainer}>
      <Text style={styles.noTransactionsMessage}>You're yet to make any referrals.</Text>
    </View>
  )}
</View>



        </View>
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
  headerText: {
    flex: 1,
    color: 'silver',
    alignSelf: 'center',
    marginLeft: 15,
    fontFamily: 'karla',
    letterSpacing: 3,
  },
  title: {
    fontSize: 20,
    marginLeft: 25,
    fontFamily: 'proxima',
    color: '#4C28BC',
    marginTop: 5,
    marginLeft: 20,
    letterSpacing: -0.4,
  },

  swiper: {
    height: 200,
    marginTop: 5, // Added marginTop to reduce the distance from the image
  },

  image: {
    width: '90%',
    alignSelf: 'center',
    resizeMode: 'cover',
    borderRadius: 10,
    marginTop: 5,
  },

  slideContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 5, // Add padding to create space between slides
  },
  slide: {
    width: '95%',
    height: 180,
    resizeMode: 'cover',
    borderRadius: 10,
    marginTop: 5,
  },
  
  dot: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)', // Customize the color of the inactive dots
    width: 5,
    height: 5,
    borderRadius: 5,
  },
  activeDot: {
    backgroundColor: '#4C28BC', // Customize the color of the active dot
    width: 10,
    height: 4,
    borderRadius: 5,
   },

  paginationContainer: {
    bottom: 1, // Adjust the value as per your requirement
  },

  shareButton: {
    marginTop: 15,
    flexDirection: 'row',
    backgroundColor: '#4C28BC',
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    marginBottom: 5,
    alignSelf: 'center',
    flex: 1, // Use flex to automatically adjust the width
  },
  shareText: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'ProductSans',
    marginLeft: 15
  },
  copiedContainer: {
    marginLeft: 5,
    alignItems: 'center',
    flexDirection: 'row'
  },
  
  copiedText: {
    color: '#4C28BC',
    fontSize: 13,
    fontFamily: 'ProductSans',  },
  

  referralText: {
    color: 'grey',
    fontSize: 11,
    fontFamily: 'ProductSans',
    alignSelf: 'center',
    marginLeft: 15,
    marginBottom: 25,
  },

  referralID: {
    color: '#4C28BC', 
    fontSize: 16
  },

  transactionContainer: {
    marginTop: 30,
    flex: 1,
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
    width: '93%',
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
    fontFamily: 'proxima',
    fontSize: 15,
    letterSpacing: -0.5,
    alignSelf: 'flex-start',
    marginLeft: 10,

  },
  text2: {
    color: 'green',
    fontFamily: 'proxima',
    fontSize: 15,
    letterSpacing: -0.5,
    alignSelf: 'flex-end',
    marginRight: 15,
  },


  transactionContainer: {
    marginTop: 5,
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
    color: 'green',
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
  
  transactionAmount2: {
    color: '#4C28BC',
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

  pendingAmount: {
    color: 'grey', // Change to your desired color
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
    marginBottom: 60
  },

});

export default ReferAndEarn;
