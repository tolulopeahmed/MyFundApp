import React, { useContext, useEffect, useState} from 'react';
import { View, Text, Pressable, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView, Image, ImageBackground } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Header from '../components/Header';
import Divider from '../components/Divider';
import Swiper from 'react-native-swiper';
import Title from '../components/Title';
import Subtitle from '../components/Subtitle';
import ImageContext from './ImageContext';
import { AutoSaveContext } from '../components/AutoSaveContext';
import { AutoInvestContext } from '../components/AutoInvestContext';

const Home = ({ navigation, route, }) => {
  const [greeting, setGreeting] = useState('');
  const { profileImageUri } = useContext(ImageContext);
  const { autoSave } = useContext(AutoSaveContext)
  const { autoInvest } = useContext(AutoInvestContext)


  useEffect(() => {
    const currentHour = new Date().getHours();
    let newGreeting;

    if (currentHour < 12) {
      newGreeting = 'Good Morning! Welcome to MyFund';
    } else if (currentHour < 17) {
      newGreeting = 'Good Afternoon! Welcome to MyFund';
    } else {
      newGreeting = 'Good Evening! Welcome to MyFund';
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
    
    <Title>Tolulope,</Title>
    <Subtitle>{greeting}</Subtitle>

  </View>
  <Pressable marginRight={20} onPress={() => navigation.navigate('More...')}>
    {profileImageUri ? (
      <Image source={{ uri: profileImageUri }} style={styles.profileImage} />
    ) : (
      <Ionicons name="person-circle-outline" size={80} color="silver" />
    )}
  </Pressable>
</View>


      <View style={styles.propertyContainer}>
        <Ionicons name="home-outline" size={24} color="#4C28BC" style={{ marginRight: 15 }} />
        <Text style={styles.propertyText}><Text style={{ fontFamily: 'proxima', color: "#4C28BC" }}></Text>Enjoy 10% p.a. on Savings, 20% p.a. on Investments <Text style={{fontFamily: 'proxima'}}>every January and July</Text>, and lifetime yearly rental income when you buy properties. Keep growing your funds.</Text>
      </View>


     
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
        <Text style={styles.savingsAmount}>250,000</Text>
        <Text style={styles.dollarSign}>50</Text>
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
        <Text style={styles.savingsAmount}>3,650,200</Text>
        <Text style={styles.dollarSign}>00</Text>
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
        <Text style={styles.savingsAmount}>02</Text>
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
        <Text style={styles.savingsAmount}>7,500</Text>
        <Text style={styles.dollarSign}>25</Text>
        </View>

        <View style={styles.quickSaveButtonContainer}>
  <TouchableOpacity style={styles.quickSaveButton} onPress={handleWithdraw}>
  <Ionicons name="arrow-down-outline" size={16} color="#fff" style={{ marginRight: 5 }} />
<Text style={styles.quickSaveText}>Withdraw</Text>
  </TouchableOpacity>
</View>
    </ImageBackground>

  
    </Swiper>

      
    
      
      <View style={styles.todoContainer}>
      <Text style={styles.todoList}>QUICK ACTIONS</Text>
      
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
          <Text style={styles.todoText}>Refer and Earn</Text>
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

      <Text style={styles.recentTransaction}>RECENT TRANSACTIONS</Text>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.transactionsContainer}>

        <View style={styles.transactionItem}>
            <Ionicons
              name="save-outline"
              size={25}
              style={styles.transactionIcon}
            />
            <View style={styles.transactionText}>
              <Text style={styles.transactionDescription}>QuickSave</Text>
              <Text style={styles.transactionDate}>03 Mar, 2023, 10:15am</Text>
            </View>
            <View>
            <Text style={styles.transactionAmount}>+1000.00</Text>
            </View>
          </View>

          <View style={styles.transactionItem}>
            <Ionicons
              name="car-outline"
              size={25}
              style={styles.transactionIcon}
            />
            <View style={styles.transactionText}>
              <Text style={styles.transactionDescription}>AutoSave</Text>
              <Text style={styles.transactionDate}>05 Mar, 2023, 11:30am</Text>
            </View>
            <View>
            <Text style={styles.transactionAmount}>+300.50</Text>
            </View>
          </View>

          <View style={styles.transactionItem}>
            <Ionicons
              name="trending-up-outline"
              size={25}
              style={styles.transactionIcon}
            />
            <View style={styles.transactionText}>
              <Text style={styles.transactionDescription}>QuickInvest</Text>
              <Text style={styles.transactionDate}>03 Mar, 2023, 10:15am</Text>
            </View>
            <View>
            <Text style={styles.transactionAmount}>+1000.00</Text>
            </View>
          </View>

          <View style={styles.transactionItem}>
            <Ionicons
              name="car-sport-outline"
              size={25}
              style={styles.transactionIcon}
            />
            <View style={styles.transactionText}>
              <Text style={styles.transactionDescription}>AutoInvest</Text>
              <Text style={styles.transactionDate}>05 Mar, 2023, 11:30am</Text>
            </View>
            <View>
            <Text style={styles.transactionAmount}>+300.50</Text>
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
              name="ellipsis-horizontal-circle-outline"
              size={25}
              style={styles.transactionIcon}
            />
            <View style={styles.transactionText}>
              <Text style={styles.transactionDescription}>Pending Referral Reward</Text>
              <Text style={styles.transactionDate}>03 Mar, 2023, 10:15am</Text>
            </View>
            <View>
            <Text style={styles.transactionAmount}>+1000.00</Text>
            </View>
          </View>

          <View style={styles.transactionItem}>
            <Ionicons
              name="checkmark-circle"
              size={25}
              style={styles.transactionIcon}
            />
            <View style={styles.transactionText}>
              <Text style={styles.transactionDescription}>Referral Reward</Text>
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
                Withdrawal from Investment
              </Text>
              <Text style={styles.transactionDate}>01 Mar, 2023, 9:30am</Text>
            </View>
            <View style={styles.transactionAmountContainer}>
            <Text style={styles.negativeAmount}>-500.00</Text>
            </View>
          </View>

          <View style={styles.transactionItem}>
            <Ionicons
              name="home-outline"
              size={25}
              style={styles.transactionIcon}
            />
            <View style={styles.transactionText}>
              <Text style={styles.transactionDescription}>FUNNAB</Text>
              <Text style={styles.transactionDate}>05 Jun, 2023</Text>
            </View>
            <View flexDirection='row' alignContent='space-between'>
            <Text style={styles.transactionAmount2}>5000000           </Text>
            <Text style={styles.transactionAmount}>200000</Text>
            </View>
          </View>
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
marginBottom: 4,
marginTop: 5,
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
    fontSize: 30,
    fontFamily: 'karla',
    textAlign: 'center',
    marginTop: 12,
      color: 'silver',
      letterSpacing: -2,
    },

  savingsAmount: {
  fontSize: 65,
  fontFamily: 'karla',
  textAlign: 'center',
  letterSpacing: -4,
  marginRight: 0,
    color: '#fff',
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
marginTop: 20,

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
});

export default Home;
