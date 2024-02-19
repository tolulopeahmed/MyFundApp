import React, { useState } from 'react';
import { View, Text, Image, SafeAreaView, ScrollView, TouchableOpacity, StyleSheet, Switch } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Title from '../components/Title';
import { useDispatch, useSelector } from 'react-redux';
import { useTheme } from '../../ThemeContext';

const WealthMap = ({ navigation, firstName }) => {
  const userInfo = useSelector((state) => state.bank.userInfo);
  const accountBalances = useSelector((state) => state.bank.accountBalances);
  const { isDarkMode, colors } = useTheme();
  const styles = createStyles(isDarkMode);
 
  const wealthStages = [
    {
      stage: 1,
      text: "Debt",
      description: "Your income is less than your expenses",
      condition: accountBalances.savings == 0 && accountBalances.investment == 0,
    },
    {
      stage: 2,
      text: "No Debt",
      description: "Your income is equal to your expenses",
      condition: accountBalances.savings > 0 && accountBalances.investment == 0,
    },
    {
      stage: 3,
      text: "Surplus",
      description: "Your income is greater than your expenses",
      condition: accountBalances.savings > 0 && accountBalances.investment > 0 && accountBalances.properties === 0,
    },
    {
      stage: 4,
      text: "Savings",
      description: "You have cash flow, and your savings are growing.",
      condition: accountBalances.savings + accountBalances.investment >= 250000,
    },
    {
      stage: 5,
      text: "Millions",
      description: "You have a cash asset and are ready for true investment",
      condition: accountBalances.savings + accountBalances.investment >= 1000000,
    },
    {
      stage: 6,
      text: "Assets",
      description: "You have acquired one or more properties",
      condition: accountBalances.properties > 0 && accountBalances.wallet < 300000,
    },
    {
      stage: 7,
      text: "Passive Income",
      description: "You have earned your first rental income",
      condition: accountBalances.wallet >= 300000 && accountBalances.properties > 0,
    },
    {
      stage: 8,
      text: "Financially Free",
      description: "Your passive income is greater than your living expenses",
      condition: accountBalances.wallet >= 500000 && accountBalances.properties > 0,
    },
    {
      stage: 9,
      text: "You're Financially Free indeed",
      description: "Your wallet is at least N1000000, and you have properties",
      condition: accountBalances.wallet >= 1000000 && accountBalances.properties > 0,
    },
  ];
  
  const currentStage = wealthStages.find((stage) => stage.condition);

  const stageImageSources = {
    1: require('./9steps1.png'),
    2: require('./9steps2.png'),
    3: require('./9steps3.png'),
    4: require('./9steps4.png'),
    5: require('./9steps5.png'),
    6: require('./9steps6.png'),
    7: require('./9steps7.png'),
    8: require('./9steps8.png'),
    9: require('./9steps9.png'),

  };



  return (

    // <ScrollView style={styles.container}>

    <View style={styles.container}>

<View style={styles.header}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back-outline" size={30} color="#4C28BC" />
      </TouchableOpacity>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>MY WEALTHMAP</Text>
     
        </View>
    </View>





      <Title>My WealthMap</Title>
      <View style={styles.propertyContainer}>
        <Ionicons name="cellular-outline" size={34} style={styles.icon}/>
        <View style={styles.progressBarContainer}> 
        <Text style={styles.propertyText}>Based on your usage, your financial status is <Text style={{fontFamily: 'proxima', color: 'green'}}>Stage {currentStage.stage}: {(currentStage.text).toUpperCase()}</Text>. Keep growing your funds to move up the 9 stages to financial freedom.</Text>
      </View>
      </View>
      
      <View style={styles.savingsContainer}>
        <View style={styles.savingsLine1}>
          <Ionicons name="cellular-outline" size={17} color="#43FF8E" style={{ marginLeft: 16 }} />
          <Text style={styles.greyText}>Stage {currentStage.stage}</Text>
        </View>
        <View style={styles.amountContainer}>
        <Text style={styles.savingsAmount} adjustsFontSizeToFit={true} numberOfLines={1}>{currentStage ? currentStage.text : 'Unknown'}</Text>
        </View>
        <Text style={styles.greyText2}>{currentStage.description}</Text>
      </View>

      <Image source={stageImageSources[currentStage.stage]} style={styles.image} />

          <ScrollView>
      <View style={styles.buttonsContainer}>
          <TouchableOpacity style={styles.primaryButton} onPress={() => navigation.push('Resources')}>
          <Text style={styles.primaryButtonText}>Learn More</Text>
        </TouchableOpacity>
        </View>

        

        </ScrollView>
  

   </View>
  //  </ScrollView>
  );
};

const createStyles = (isDarkMode) => {
  return StyleSheet.create({  
    container: {
    flex: 1,
    backgroundColor: isDarkMode ? '#140A32' : '#F5F1FF',
  },

   header: {
    marginTop: 50,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 15,
      backgroundColor: isDarkMode ? 'black' : 'white',
      height: 43,
    },

    icon: {
      marginRight: 15,
      color: isDarkMode ? '#6E3DFF' : '#4C28BC',
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

  
  title: {
    fontSize: 20,
    marginLeft: 25,
    fontFamily: 'proxima',
    color: '#4C28BC',
    marginTop: 5,
    marginBottom: 5,
    marginLeft: 20,
    
  },
  propertyContainer: {
    alignItems: 'center',
    paddingHorizontal: 16,
    flexDirection: 'row',
    backgroundColor: isDarkMode ? '#2B1667' : '#DCD1FF',
    padding: 15,
    marginHorizontal: 20,
    borderRadius: 10,
    marginTop: 2,
    height: 80,
  },
 

    image: {
      width: "85%",
      height: '35%',
      resizeMode: 'center',
      borderRadius: 9,
      marginTop: 10,
  alignSelf: 'center',
    },
    
    profileIcons: {
    flexDirection: 'row',
    },
   
    propertyIcon: {
    marginRight: 10,
    },
    
    propertyText: {
    flex: 1,
    fontSize: 14,
    fontWeight: 'regular',
    fontFamily: 'karla',
    letterSpacing: -0.4,
    color: isDarkMode ? 'silver' : 'black',

    },



    progressBarContainer: {
      flex: 1,
      flexDirection: 'column',
    },


    savingsContainer: {
    flexDirection: 'column',
    backgroundColor: '#4C28BC',
    marginHorizontal: 20,
    borderRadius: 10,
    marginTop: 20,
    alignItems: 'center',
    // height: 135,
    },
    
    savingsLine1: {
      flexDirection: 'row',
    color: '#8E8E93',
    marginTop: 10,
    },
    
    greyText: {
    marginLeft: 8,
    fontSize: 12,
    marginTop: 3,
    color: 'silver',
    fontFamily: 'karla',
    textAlign: 'center',
    },

    greyText2: {
      marginLeft: 8,
      fontSize: 12,
      marginBottom: 11,
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
  
    

    savingsAmount: {
    fontSize: 55,
    fontFamily: 'nexa',
    textAlign: 'center',
    letterSpacing: -4,
    marginRight: 0,
    marginTop: -2,
      color: '#fff',
},
 

      
      buttonIcon: {
        color: '#FFFFFF',
        marginRight: 7,
      },
     
 
      buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        position: 'relative',
        top: 20,
        left: 0,
        right: 0,
        marginBottom: 30,
      },
      
      primaryButton: {
        flexDirection: 'row',
        backgroundColor: '#4C28BC',
        width: '85%',
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        marginBottom: 5,
      },

primaryButtonText: {
  color: '#fff',
  fontSize: 18,
  fontFamily: 'ProductSans',
},

});
}

export default WealthMap;
