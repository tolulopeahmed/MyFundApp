import React, { useEffect, useContext, useState } from 'react';
import { View, Text, SafeAreaView, ImageBackground, ScrollView, TouchableOpacity, StyleSheet, Switch } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AutoInvestModal from './AutoInvestModal';
import { MaterialIcons } from '@expo/vector-icons';
import QuickInvestModal from '../components/QuickInvestModal';
import Divider from '../components/Divider';
import DeactivateAutoInvestModal from './DeactivateAutoInvestModal';
import Title from '../components/Title';
import Subtitle from '../components/Subtitle';
import { AutoInvestContext } from '../components/AutoInvestContext';
import SectionTitle from '../components/SectionTitle';


const Sponsorship = ({ navigation, route }) => {
// const [autoInvest, setAutoInvest] = React.useState(false);
  const [quickInvestModalVisible, setQuickInvestModalVisible] = useState(false);
  const [autoInvestModalVisible, setAutoInvestModalVisible] = useState(false);
  const [deactivateAutoInvestModalVisible, setDeactivateAutoInvestModalVisible] = useState(false);
  const { autoInvest, setAutoInvest } = useContext(AutoInvestContext);

  useEffect(() => {
    if (route.params?.autoInvestModalVisible) {
      setAutoInvestModalVisible(true);
    } else if (route.params?.quickInvestModalVisible) {
        setQuickInvestModalVisible(true);
    }
  }, [route.params]);


  const handleQuickInvest = () => {
    setQuickInvestModalVisible(true);
  };

const handleActivateAutoInvest = () => {
  if (!autoInvest) {
    setAutoInvestModalVisible(true);
  } else {
    setDeactivateAutoInvestModalVisible(true);
  }
};


const handleConfirmAutoInvest = () => {
  setAutoSave(true);
  setAutoInvestModalVisible(false);
};

const handleConfirmDeactivateAutoInvest = () => {
  setDeactivateAutoInvestModalVisible(false);
  setAutoInvest(false);
};

  
  return (
    <View style={styles.container}>

<View style={styles.header}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back-outline" size={30} color="#4C28BC" />
      </TouchableOpacity>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>SPONSORSHIP INVESTMENT</Text>
      
        </View>
    </View>

    <ScrollView showsVerticalScrollIndicator={false}>


      <Title>Sponsor</Title>
      <Subtitle>Earn 20% p.a. every 6 months with multiples of N100,000</Subtitle>



      <View style={styles.propertyContainer}>
        <MaterialIcons name="trending-up" size={34} color="#4C28BC" style={{ marginRight: 15 }} />
        <View style={styles.progressBarContainer}> 
        <Text style={styles.propertyText}><Text style={{ fontFamily: 'proxima', color: '#4C28BC' }}>Better Than Savings: </Text>Earn up to <Text style={{color: 'green', fontFamily: 'proxima'}}>20% p.a. every January and July </Text>sponsoring any of our National Hostel Projects. Multiples of ₦100,000.</Text>
      </View>
      </View>
      
      <SectionTitle>MY SPONSORSHIP INVESTMENT</SectionTitle>

      <ImageBackground
  source={require('./icb2.png')}
  style={styles.savingsContainer}
  imageStyle={styles.backgroundImage}
  >        
  <View style={styles.savingsLine1}>
          <Ionicons name="trending-up-outline" size={17} color="#A9A9A9" style={{ marginLeft: 16, marginTop: 6 }} />
          <Text style={styles.greyText}>Total Investment    <Text style={styles.rateText}>@15-20% p.a.</Text> </Text>
        </View>
        <View style={styles.amountContainer}>
        <Text style={styles.dollarSign}>₦</Text>
        <Text style={styles.savingsAmount}>3,650,200</Text>
        <Text style={styles.dollarSign}>50</Text>
        </View>
       
       <View style={styles.autoSaveContainer}>
       <Ionicons name="car-sport-outline" size={20} marginRight={5} marginTop={-3} style={[styles.autoSaveText, autoInvest ? styles.greenText : styles.grayText]} />
        <Text style={[styles.autoSaveText, autoInvest ? styles.greenText : styles.grayText]}>
    {autoInvest ? 'AutoInvest is ON' : 'AutoInvest is OFF'}
        </Text>


            <Switch
          title="Open Modal" 
          style={styles.switch}
            trackColor={{ false: 'grey', true: '#0AA447' }}
            thumbColor={autoInvest ? '#43FF8E' : 'silver'}
            ios_backgroundColor="#3e3e3e"
            onValueChange={handleActivateAutoInvest}
            value={autoInvest}
          />

{autoInvestModalVisible && (
        <AutoInvestModal
        autoInvest={autoInvest}
        setAutoInvest={setAutoInvest}
        autoInvestModalVisible={autoInvestModalVisible} 
        setAutoInvestModalVisible={setAutoInvestModalVisible} 
        onConfirm={handleConfirmAutoInvest}

        />
        )}

{deactivateAutoInvestModalVisible && (
<DeactivateAutoInvestModal
          autoInvest={autoInvest}
          setAutoInvest={setAutoInvest}
          deactivateAutoInvestModalVisible={deactivateAutoInvestModalVisible}
          setDeactivateAutoInvestModalVisible={setDeactivateAutoInvestModalVisible}
          onConfirm={handleConfirmDeactivateAutoInvest}
        />
        )}

        </View>

        <View style={styles.autoSaveSettingContainer}>
            {autoInvest && <Text style={styles.autoSaveSetting}>@$20/month
            <Ionicons name="checkmark" size={17} color="#0AA447" />          

            </Text>}
            </View> 

        <View>
          <TouchableOpacity style={styles.quickSaveButton} onPress={handleQuickInvest}>
          <Ionicons name="trending-up-outline" size={24} color="#fff" style={{ marginRight: 4 }} />
          <Text style={styles.quickSaveText}>QuickInvest</Text>
        </TouchableOpacity>
        </View>
      </ImageBackground>

      {quickInvestModalVisible && (
  <QuickInvestModal
  navigation={navigation}
  quickInvestModalVisible={quickInvestModalVisible} 
  setQuickInvestModalVisible={setQuickInvestModalVisible}
  />
)}


      <SafeAreaView style={styles.transactionContainer}>

      <Divider />

      <Text style={styles.todoList}>INVESTMENT TRANSACTIONS</Text>

        <View style={styles.transactionsContainer}>
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
          </View>
          {/* Add more transaction items here */}
          <View style={styles.transactionsContainer}>
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
          </View>
    </SafeAreaView>
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

  
  
  
  propertyContainer: {
    alignItems: 'center',
    paddingHorizontal: 16,
    flexDirection: 'row',
    backgroundColor: '#DCD1FF',
    padding: 15,
    marginHorizontal: 20,
    borderRadius: 10,
    marginTop: 1,
    marginBottom: 10,
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
  progressBar: {
    height: 3.5,
    backgroundColor: '#AEA5E1',
    borderRadius: 10,
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

    

    savingsContainer: {
    flexDirection: 'column',
    backgroundColor: '#4C28BC',
    marginHorizontal: 20,
    borderRadius: 10,
    marginTop: 5,
    alignItems: 'center',
    height: 150,
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


    quickSaveButton: {
      marginTop: 30,
      flexDirection: 'row',
      backgroundColor: '#4C28BC',
      width: 140,
      height: 40,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 10,
      marginBottom: 5,
    
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
      marginBottom: 2,
    },
    

    transactionContainer: {
      marginTop: 100,
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

export default Sponsorship;
