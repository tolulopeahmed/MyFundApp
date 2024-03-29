import React, { useEffect, useState } from 'react';
import { View, Text, SafeAreaView, ScrollView, Pressable, TouchableOpacity, StyleSheet, Switch } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { MaterialIcons } from '@expo/vector-icons';
import AddCardModal from './AddCardModal';
import SectionTitle from '../components/SectionTitle';


const Card = ({ navigation, route }) => {
  const [addCardModalVisible, setAddCardModalVisible] = useState(false); // define modalVisible state


  useEffect(() => {
    if (route.params?.addCardModalVisible) {
      setAddCardModalVisible(true);
    }
  }, [route.params]);
  
  return (
    <View style={styles.container}>

<View style={styles.header}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back-outline" size={30} color="#4C28BC" />
      </TouchableOpacity>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>BANK AND CARD SETTINGS</Text>
      
        </View>
    </View>

      <View flexDirection='row' alignSelf='center' padding={5} >
        <View style={styles.cardContainer}>
          <Text style={styles.title}>My Cards</Text>
          </View>
        
      <Pressable style={styles.bankContainer} onPress={() => navigation.navigate('Bank')}>
        <Text style={styles.title2}>My Bank Accounts</Text>
        </Pressable>
      </View>

      <View style={styles.propertyContainer}>
        <Ionicons name="card-outline" size={34} color="#4C28BC" style={{ marginRight: 15 }} />
        <Text style={styles.propertyText}>Set up your cards so you can perform faster transactions including AutoSave and AutoInvest</Text>
      </View>
      
    <SectionTitle>LIST OF CARDS</SectionTitle>

      <View style={styles.buttonsContainer}>
                <TouchableOpacity style={styles.primaryButton} onPress={() => setAddCardModalVisible(true)}>
                <MaterialIcons name="add" size={30} color="#fff" marginRight={5}/>
                <Text style={styles.primaryButtonText}>Add New Card</Text>
                </TouchableOpacity>
               </View>
               <AddCardModal navigation={navigation} addCardModalVisible={addCardModalVisible} setAddCardModalVisible={setAddCardModalVisible}/>
     
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
    },

  
    cardContainer: {
    borderWidth: 0.8,
    alignItems: 'center',
    flex: 1,
    backgroundColor: '#4C28BC',
    borderTopRightRadius: 15,
    borderTopLeftRadius: 15,
    borderBottomWidth: 0.8,
    borderLeftWidth: 0.8,
    borderRightWidth: 0.8,
    borderColor: '#4C28BC',
    },

    bankContainer: {
        borderWidth: 0.8,
        borderColor: '#4C28BC',
        alignItems: 'center',
        flex: 1,
        borderTopWidth: 0,
        borderRightWidth: 0,
        borderLeftWidth: 0,
        backgroundColor: 'white'
        },

  title: {
    fontSize: 16,
    fontFamily: 'proxima',
    color: '#fff',
    marginTop: 5,
    marginBottom: 5,
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
    marginBottom: 10,

  },
 
  propertyText: {
    flex: 1,
    fontSize: 14,
    fontWeight: 'regular',
    fontFamily: 'karla',
    letterSpacing: -0.2,
    color: 'black',

    },
    buttonsContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      position: 'absolute',
      bottom: 30,
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

export default Card;
