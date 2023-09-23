import React, { useContext, useEffect, useState} from 'react';
import { View, Text, Pressable, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView, Image, ImageBackground } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Header from '../components/Header';
import Divider from '../components/Divider';
import Swiper from 'react-native-swiper';
import Title from '../components/Title';
import Subtitle from '../components/Subtitle';
import { AutoSaveContext } from '../components/AutoSaveContext';
import { AutoInvestContext } from '../components/AutoInvestContext';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAccountBalances, fetchUserTransactions, fetchUserData, } from '../../ReduxActions';
import SectionTitle from '../components/SectionTitle';
import ImageContext from './ImageContext';

const Home = ({ navigation, route}) => {
  const [greeting, setGreeting] = useState('');
  const { autoSave } = useContext(AutoSaveContext)
  const { autoInvest } = useContext(AutoInvestContext)
  const [displayedProfileImage, setDisplayedProfileImage] = useState(null);
  const { profileImageUri, setProfileImageUri, selectedImage } = useContext(ImageContext);
  const userInfo = useSelector((state) => state.bank.userInfo);
  const accountBalances = useSelector((state) => state.bank.accountBalances);
  const userTransactions = useSelector((state) => state.bank.userTransactions);
  const dispatch = useDispatch();

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
    const timeout = setTimeout(() => {
        if (
            userInfo.savings_goal_amount === null ||
            userInfo.time_period === null ||
            userInfo.preferred_asset === null
        ) {
          navigation.navigate('More...', { goalModalVisible: true });
        }
    }, 2000); // Delay of 2000 milliseconds (2 seconds)

    return () => clearTimeout(timeout); // Clear the timeout on component unmount
}, [userInfo]);


  useEffect(() => {
    if (profileImageUri) {
      setDisplayedProfileImage(profileImageUri);
    } else if (displayedProfileImage) {
      setDisplayedProfileImage(userInfo.profileImageUrl);
    }
  }, [profileImageUri, displayedProfileImage, userInfo.profileImageUrl]);

  
  useEffect(() => {
    dispatch(fetchAccountBalances()); // Fetch account balances using Redux action
    dispatch(fetchUserTransactions()); // Fetch user transactions using Redux action
    dispatch(fetchUserData(userInfo.token));
  }, []);


  useEffect(() => {
    // Dispatch actions to fetch user data and set profile image URI when the component mounts or when the user logs in.
    if (userInfo.token) {
      dispatch(fetchUserData(userInfo.token));
    }
  }, [dispatch, userInfo.token]);


  useEffect(() => {
    const currentHour = new Date().getHours();
    let newGreeting;

    if (currentHour < 12) {
      newGreeting = 'Good Morning! Welcome to MyFund 👋🏼';
    } else if (currentHour < 17) {
      newGreeting = 'Good Afternoon! Welcome to MyFund 👋🏼';
    } else {
      newGreeting = 'Good Evening! Welcome to MyFund 👋🏼';
    }

    setGreeting(newGreeting);
  }, []);



  

  const handleQuickSave = () => {
    navigation.navigate('Save', { quickSaveModalVisible: true });
  };

  const handleQuickInvest = () => {
    navigation.navigate('Sponsorship', { quickInvestModalVisible: true });
  };

  const handleActivateAutoSave = () => {
    navigation.navigate('Save', { autoSaveModalVisible: true });
  };
  
  const handleActivateAutoInvest = () => {
    navigation.navigate('Sponsorship', { autoInvestModalVisible: true });
  };

  const handleBuyProperty = () => {
    navigation.navigate('Ownership');
  };

  const handleWithdraw = () => {
    navigation.navigate('Withdraw', { withdrawModalVisible: true });
  };


  

  return (
    <>
      <Header navigation={navigation} headerText='MYFUND'/>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
  <View>
    
  <Title>Hi {userInfo?.firstName ? `${userInfo.firstName},` : ''}</Title>
    <Subtitle>{greeting}</Subtitle>

  </View>
  
        <Pressable
        marginRight={15}
        marginTop={5}
        onPress={() => navigation.navigate('More...')}
        style={styles.profileContainer} // Add this style to the container
      >
      <View style={styles.profileImageContainer}>
        {profileImageUri ? (
          <Image source={{ uri: profileImageUri }} style={styles.profileImage} />
        ) : (
          <Ionicons name="person-circle" size={80} color="silver" />
        )}
      </View>
      </Pressable>


</View>


      <View style={styles.propertyContainer}>
        <Ionicons name="home-outline" size={24} color="#4C28BC" style={{ marginRight: 15 }} />
        <Text style={styles.propertyText}><Text style={{ fontFamily: 'proxima', color: "#4C28BC" }}></Text><Text style={{fontFamily: 'proxima'}}>Every January and July</Text>, you'll earn 10% p.a. on Savings and 20% p.a. on your Investments until you've saved enough to buy properties and earn lifetime rent.. Keep growing your funds.</Text>
      </View>


      <SectionTitle>MY ACCOUNTS</SectionTitle>

      <Swiper
  style={styles.swiperContainer}
  autoplay
  autoplayTimeout={20}
  dot={<View style={styles.dot} />}
  activeDot={<View style={styles.activeDot} />}
  paginationStyle={styles.paginationContainer}
>
  <ImageBackground
  source={require('./scb.png')}
  style={styles.savingsContainer}
  imageStyle={styles.backgroundImage}
  >
            <View style={styles.savingsLine1}>
          <Ionicons name="save-outline" size={17} color="#A9A9A9" style={{ marginLeft: 16, marginTop: 6 }} />
          <Text style={styles.greyText}>TOTAL SAVINGS    
          <Text style={styles.rateText}>    @10% p.a.</Text> </Text>
        </View>
        <View style={styles.amountContainer}>
        <Text style={styles.dollarSign}>₦</Text>
        <Text style={styles.savingsAmount}>{Math.floor(accountBalances.savings)}</Text>
        <Text style={styles.decimal}>.{String(accountBalances.savings).split('.')[1]}</Text>
        </View>

        <View style={styles.quickSaveButtonContainer}>
  <TouchableOpacity style={styles.quickSaveButton} onPress={() => handleQuickSave()}>
  <Ionicons name="save-outline" size={16} color="#fff" style={{ marginRight: 5 }} />
    <Text style={styles.quickSaveText}>QuickSave</Text>
  </TouchableOpacity>
</View>
    </ImageBackground>
       

    <ImageBackground
  source={require('./icb.png')}
  style={styles.savingsContainer}
  imageStyle={styles.backgroundImage}
  >
        <View style={styles.savingsLine1}>
          <Ionicons name="trending-up-outline" size={17} color="#A9A9A9" style={{ marginLeft: 16, marginTop: 6 }} />
          <Text style={styles.greyText}>TOTAL INVESTMENTS    
          <Text style={styles.rateText}>    @20% p.a.</Text> </Text>
        </View>
        <View style={styles.amountContainer}>
        <Text style={styles.dollarSign}>₦</Text>
        <Text style={styles.savingsAmount2}>{Math.floor(accountBalances.investment)}</Text>
        <Text style={styles.decimal}>.{String(accountBalances.investment).split('.')[1]}</Text>
        </View>

        <View style={styles.quickSaveButtonContainer}>
  <TouchableOpacity style={styles.quickSaveButton} onPress={handleQuickInvest}>
  <Ionicons name="trending-up-outline" size={16} color="#fff" style={{ marginRight: 5 }} />
<Text style={styles.quickSaveText}>QuickInvest</Text>
  </TouchableOpacity>
</View>
    </ImageBackground>


    <ImageBackground
  source={require('./scb.png')}
  style={styles.savingsContainer}
  imageStyle={styles.backgroundImage}
  >        
  <View style={styles.savingsLine1}>
          <Ionicons name="home-outline" size={17} color="#A9A9A9" style={{ marginLeft: 16, marginTop: 6 }} />
          <Text style={styles.greyText}>TOTAL PROPERTIES ACQUIRED    
          <Text style={styles.rateText}>    @yearly rent</Text> </Text>
        </View>
        <View style={styles.amountContainer}>
        <Text style={styles.savingsAmount3}>{accountBalances.properties < 10 ? `0${Math.floor(accountBalances.properties)}` : Math.floor(accountBalances.properties)}</Text>
        </View>

        <View style={styles.quickSaveButtonContainer}>
  <TouchableOpacity style={styles.quickSaveButton} onPress={handleBuyProperty}>
  <Ionicons name="home-outline" size={16} color="#fff" style={{ marginRight: 5 }} />
<Text style={styles.quickSaveText}>Buy Properties</Text>
  </TouchableOpacity>
</View>
    </ImageBackground>

      
    <ImageBackground
  source={require('./icb2.png')}
  style={styles.savingsContainer}
  imageStyle={styles.backgroundImage}
  >
            <View style={styles.savingsLine1}>
          <Ionicons name="wallet-outline" size={17} color="#A9A9A9" style={{ marginLeft: 16, marginTop: 6 }} />
          <Text style={styles.greyText}>TOTAL WALLET    
          <Text style={styles.rateText}> (My Earnings)</Text> </Text>
        </View>
        <View style={styles.amountContainer}>
        <Text style={styles.dollarSign}>₦</Text>
        <Text style={styles.savingsAmount4}>{Math.floor(accountBalances.wallet)}</Text>
        <Text style={styles.decimal}>.{String(accountBalances.wallet).split('.')[1]}</Text>
        </View>

        <View style={styles.quickSaveButtonContainer}>
  <TouchableOpacity style={styles.quickSaveButton} onPress={handleWithdraw}>
  <Ionicons name="arrow-down-outline" size={16} color="#fff" style={{ marginRight: 5 }} />
<Text style={styles.quickSaveText}>Withdraw</Text>
  </TouchableOpacity>
</View>
    </ImageBackground>

  
    </Swiper>

      <View style={{marginTop: 20}}>
    <SectionTitle>QUICK ACTIONS</SectionTitle>
    </View>
      <View style={styles.todoContainer}>
      
      <View style={styles.todoList1}>
      <TouchableOpacity
        style={[styles.todoButton, autoSave && styles.disabledButton]}
        onPress={handleActivateAutoSave}
        disabled={autoSave}
      >
        {autoSave ? (
          <>
            <Ionicons
              name="car-outline"
              size={24}
              color="green"
              style={{ marginRight: 10, marginLeft: 10 }}
            />
            <Text style={styles.disabledText}>AutoSave is ON</Text>
            <Ionicons
              name="checkmark-circle"
              size={24}
              color="green"
              style={{ marginRight: 10, marginLeft: 10 }}
            />
          </>
        ) : (
          <>
            <Ionicons
              name="car-outline"
              size={24}
              color="black"
              style={{ marginRight: 10, marginLeft: 10 }}
            />
            <Text style={styles.todoText}>Turn ON AutoSave</Text>
          </>
        )}
      </TouchableOpacity>
      </View>

        
        <View style={styles.todoList1}>
        <TouchableOpacity
        style={[styles.todoButton, autoInvest && styles.disabledButton]}
        onPress={handleActivateAutoInvest}
        disabled={autoInvest}
      >
        {autoInvest ? (
          <>
            <Ionicons
              name="car-sport-outline"
              size={24}
              color="green"
              style={{ marginRight: 10, marginLeft: 10 }}
            />
            <Text style={styles.disabledText}>AutoInvest is ON</Text>
            <Ionicons
              name="checkmark-circle"
              size={24}
              color="green"
              style={{ marginRight: 10, marginLeft: 10 }}
            />
          </>
        ) : (
          <>
            <Ionicons
              name="car-sport-outline"
              size={24}
              color="black"
              style={{ marginRight: 10, marginLeft: 10 }}
            />
            <Text style={styles.todoText}>Turn ON AutoInvest</Text>
          </>
        )}
      </TouchableOpacity>
        </View>

        <View style={styles.todoList1}>
        <TouchableOpacity style={styles.todoButton} onPress={() => navigation.navigate('ReferAndEarn')}>
          <Ionicons name="person-add-outline" size={23} color="#000" style={{ marginRight: 10, marginLeft: 10 }} />
          <Text style={styles.todoText}>Refer and Earn ₦1000</Text>
        </TouchableOpacity>
        </View>

        <View style={styles.todoList1}>
        <TouchableOpacity style={styles.todoButton} onPress={() => navigation.navigate('KYC')}>
          <Ionicons name="shield-checkmark-outline" size={23} color="#000" style={{ marginRight: 10, marginLeft: 10 }} />
          <Text style={styles.todoText}>Update KYC</Text>
        </TouchableOpacity>
        </View>

      </View>

   
    
    
      <SafeAreaView style={styles.transactionContainer}>
      <Divider />

<SectionTitle>MY RECENT TRANSACTIONS</SectionTitle>

      <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.transactionsContainer}>
      {userTransactions.length > 0 ? (
  userTransactions.slice(0, 5).map((transaction, index) => (
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
      Your most recent transactions will appear here.
    </Text>
  </View>
)}


            </View>

          </ScrollView>
    </SafeAreaView>
     
</ScrollView>
</>
);
}

const styles = StyleSheet.create({
container: {
flex: 1,
backgroundColor: '#F5F1FF',
},
headerContainer: {
backgroundColor: 'white',
},
header: {
flexDirection: 'row',
justifyContent: 'space-between',
alignItems: 'center',
marginHorizontal: 20,
marginVertical: 10,
},


title: {
  fontSize: 35,
  marginLeft: 25,
  fontFamily: 'proxima',
  color: '#4C28BC',
  marginTop: 5,
  marginBottom: 5,
  marginLeft: 20,
  letterSpacing: -1,    
},


headerText: {
  marginTop: 10,
  fontFamily: 'karla',
  marginHorizontal: 20,
  fontSize: 18,
},

profileIcons: {
flexDirection: 'row',
},
profileImage: {
  width: 80,
  height: 80,
  borderRadius: 67,
  marginRight: 5,
  marginLeft: -10,
  borderWidth: 0.5,
  resizeMode: 'center'
  },
propertyContainer: {
flexDirection: 'row',
backgroundColor: '#DCD1FF',
padding: 15,
marginHorizontal: 20,
alignItems: 'center',
borderRadius: 10,
marginBottom: 15,
marginTop: 0,
flexWrap: 'wrap', // Adjust container size based on the text inside
},
propertyIcon: {
marginRight: 10,
},
propertyText: {
flex: 1,
fontSize: 14,
fontWeight: 'regular',
fontFamily: 'karla',
},

swiperContainer: {
  height: 160,
},
dot: {
  backgroundColor: 'rgba(0, 0, 0, 0.2)', // Customize the color of the inactive dots
  width: 5,
  height: 5,
  borderRadius: 5,
  marginLeft: 3,
  marginRight: 3,
  marginTop: 3,
  marginBottom: 3,
},
activeDot: {
  backgroundColor: '#4C28BC', // Customize the color of the active dot
  width: 10,
  height: 4,
  borderRadius: 5,
  marginLeft: 3,
  marginRight: 3,
  marginTop: 3,
  marginBottom: 3,
},
paginationContainer: {
  bottom: -10, // Adjust the value as per your requirement
},
savingsContainer: {
  flexDirection: 'column',
  backgroundColor: '#4C28BC',
  marginHorizontal: 20,
  borderRadius: 10,
  marginTop: 5,
  alignItems: 'center',
  height: 160,
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
  alignSelf: 'flex-start',
  marginRight: 10,
  },
  
  greyText: {
  marginLeft: 8,
  marginTop:10,
  fontSize: 11,
  color: 'silver',
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
    alignSelf: 'flex-start',
    marginLeft: 15,
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

  savingsAmount2: {
    fontSize: 80,
    fontFamily: 'karla',
    textAlign: 'center',
    letterSpacing: -4,
    marginRight: 5,
    marginLeft: 5,
    marginTop: -10,
    marginBottom: -10,
      color: 'yellow',
    },

    savingsAmount3: {
      fontSize: 80,
      fontFamily: 'karla',
      textAlign: 'center',
      letterSpacing: -4,
      marginRight: 5,
      marginLeft: 5,
      marginTop: -10,
      marginBottom: -10,
        color: 'gold',
      },

      savingsAmount4: {
        fontSize: 80,
        fontFamily: 'karla',
        textAlign: 'center',
        letterSpacing: -4,
        marginRight: 5,
        marginLeft: 5,
        marginTop: -10,
        marginBottom: -10,
          color: '#43FF8E',
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


quickSaveButtonContainer: {
  position: 'absolute',
  bottom: 15,
  right: 10,
},

quickSaveButton: {
  backgroundColor: '#9D8CD7',
  borderRadius: 8,
  paddingVertical: 4,
  paddingHorizontal: 9,
  alignSelf: 'flex-end',
  flexDirection: 'row',
  alignItems: 'center',
},
quickSaveText: {
  fontSize: 14,
  color: 'white',
  fontFamily: 'ProductSans',
  alignSelf: 'center',
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


todoContainer: {
borderRadius: 10,
marginHorizontal: 20,
marginTop: 1,

},

todoButton: {
  flexDirection: 'row',
  borderColor: 'silver',
  backgroundColor: 'white',
  height: 40,
  width: '100%',
  padding: 6,
  borderWidth: 1,
  borderRadius: 9,
},

disabledButton: {
  flexDirection: 'row',
  borderColor: 'silver',
  backgroundColor: '#D6D6D6',
  height: 40,
  width: '100%',
  padding: 6,
  borderWidth: 1,
  borderRadius: 9,
},

disabledText: {
  marginTop: 3,
fontSize: 16,
fontFamily: 'karla',
color: 'green',
},

todoList:{
  marginTop: 2,
  fontSize: 18,
  color: 'black',
   fontFamily: 'ProductSansBold',
   marginHorizontal: 3,
  },

todoList1: {
flexDirection: 'row',
alignItems: 'center',
marginBottom: 5,
marginTop:5,
},
toDoListIcon: {
marginRight: 10,
},
todoText: {
  marginTop: 3,
fontSize: 16,
fontFamily: 'karla',
color: 'grey',
},


tabNavigator: {
flexDirection: 'row',
},
toDoListItem: {
flexDirection: 'row',
alignItems: 'center',
paddingVertical: 10,
borderBottomWidth: 1,
borderBottomColor: '#ccc',
},


recentContainer: {
flexDirection: 'row',
marginTop: 5,
borderWidth: 0.3,
borderColor: 'silver',
borderRadius: 8,
width: '100%',
height: 50,
},



todoList: {
  marginTop: 2,
  color: 'grey',
  fontFamily: 'karla',
  letterSpacing: 2,
  marginBottom: 2,
},


recentTransaction: {
  marginLeft:20,
  marginTop: 2,
  color: 'grey',
  fontFamily: 'karla',
  letterSpacing: 2,
  marginBottom: 2,   
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

transactionAmount2: {
  color: '#4C28BC',
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

});

export default Home;
