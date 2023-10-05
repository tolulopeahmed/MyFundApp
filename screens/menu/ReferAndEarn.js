import React, { useState } from 'react';
import { View, Text, Image, ScrollView, Pressable, TouchableOpacity, StyleSheet, Share } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Swiper from 'react-native-swiper';
import * as Clipboard from 'expo-clipboard';
import { MaterialIcons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import SectionTitle from '../components/SectionTitle';

const images = [
  require('./refer.png'),
  require('./howtoearn.png'),
];

const ReferAndEarn = ({ navigation, firstName }) => {
  const [isCopied, setIsCopied] = useState(false);
  const userInfo = useSelector((state) => state.bank.userInfo);
  const referralID = userInfo.email; // Assuming 'userInfo.email' contains the user's email


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
            <Text style={styles.text}>My Referrals</Text>
          </View>
          <View style={styles.column}>
            <Text style={styles.text2}>Rewards     Status</Text>
          </View>
        </View>

        <View>
          <View style={styles.transactionsContainer}>
            <View style={styles.transactionItem}>
              <View style={styles.transactionText}>
                <Text style={styles.transactionDescription}>name1@yahoo.com</Text>
                <Text style={styles.transactionDate}>05 Mar, 2023 - 10:30 AM</Text>
              </View>
              <View flexDirection='row' alignContent='space-between'>
                <Text style={styles.transactionAmount}>1000</Text>
                <Ionicons
                  name="checkmark-circle"
                  size={25}
                  style={styles.transactionIcon}
                />
              </View>
            </View>

            <View style={styles.transactionItem}>
              <View style={styles.transactionText}>
                <Text style={styles.transactionDescription}>name2@gmail.com</Text>
                <Text style={styles.transactionDate}>10 Jun, 2023 - 02:45 PM</Text>
              </View>
              <View flexDirection='row' alignContent='space-between'>
                <Text style={styles.transactionAmount}>1000</Text>
                <Ionicons
                  name="ellipsis-horizontal-circle-outline"
                  size={25}
                  style={styles.transactionIcon}
                />
              </View>
            </View>
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
    marginLeft: 15
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
    marginLeft: 5,

  },
  transactionText: {
    flex: 1,
    alignItems: 'flex-start',
    marginLeft: 10,
  },
  transactionDescription: {
    color: '#4C28BC',
    letterSpacing: -1,
    fontSize: 17,
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
    color: '#4C28BC',
    fontSize: 20,
    fontFamily: 'karla',
    letterSpacing: -1,
    marginTop: 10,
    textAlign: 'right',
    marginRight: 20,

  },

});

export default ReferAndEarn;
