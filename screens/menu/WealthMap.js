import React, { useState } from 'react';
import { View, Text, Image, SafeAreaView, ScrollView, TouchableOpacity, StyleSheet, Switch } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Title from '../components/Title';


const WealthMap = ({ navigation, firstName }) => {


  
  return (
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
        <Ionicons name="cellular-outline" size={34} color="#4C28BC" style={{ marginRight: 15 }} />
        <View style={styles.progressBarContainer}> 
        <Text style={styles.propertyText}>Based on your usage, your financial status is <Text style={{fontFamily: 'proxima', color: 'green'}}>Stage 6: Assets.</Text> Keep growing your funds to move up the 9 stages to financial freedom.</Text>
      </View>
      </View>
      
      <View style={styles.savingsContainer}>
        <View style={styles.savingsLine1}>
          <Ionicons name="cellular-outline" size={17} color="#43FF8E" style={{ marginLeft: 16 }} />
          <Text style={styles.greyText}>Stage 6              </Text>
        </View>
        <View style={styles.amountContainer}>
        <Text style={styles.savingsAmount}>Assets</Text>
        </View>
        <Text style={styles.greyText2}>You have acquired one or more properties</Text>
      </View>

      <Image source={require('./9steps.png')} style={styles.image} />

          
      <View style={styles.buttonsContainer}>
          <TouchableOpacity style={styles.primaryButton} onPress={() => navigation.push('Resources')}>
          <Text style={styles.primaryButtonText}>Learn More</Text>
        </TouchableOpacity>
        </View>



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
    backgroundColor: '#DCD1FF',
    padding: 15,
    marginHorizontal: 20,
    borderRadius: 10,
    marginTop: 2,
    height: 80,
  },
 

    welcomeText: {
     color: '#4C28BC',
     fontFamily: 'ProductSansBold',
    },
    
    image: {
      width: "85%",
      height: '35%',
      resizeMode: 'center',
      borderRadius: 9,
      marginTop: 20,
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
    color: 'black',

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
    height: 125,
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
    color: '#43FF8E',
    fontFamily: 'karla',
    textAlign: 'center',
    },

    greyText2: {
      marginLeft: 8,
      fontSize: 12,
      marginTop: -10,
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
      height: 80,
    },
  
    

    savingsAmount: {
    fontSize: 70,
    fontFamily: 'karla',
    textAlign: 'center',
    letterSpacing: -4,
    marginRight: 0,
    marginTop: -5,
      color: '#fff',
},


      autoSaveContainer: {
        flexDirection: 'row',
      },

      autoSaveText: {
        color: 'silver',
        fontFamily: 'karla',
        marginRight: 5,
      },

  

      
      buttonIcon: {
        color: '#FFFFFF',
        marginRight: 7,
      },
     
 
      buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        position: 'relative',
        top: 30,
        left: 0,
        right: 0,
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

export default WealthMap;
