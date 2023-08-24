import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, ScrollView, Pressable, TouchableOpacity, StyleSheet, Switch } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { MaterialIcons } from '@expo/vector-icons';
import AddBankModal from './AddBankModal';
import SectionTitle from '../components/SectionTitle';
import axios from 'axios';
import { ipAddress } from '../../constants';


const Bank = ({ navigation, initialBankRecords}) => {
  const [addBankModalVisible, setAddBankModalVisible] = useState(false); // define modalVisible state
  const [bankRecords, setBankRecords] = useState([]);





  useEffect(() => {
    // Fetch bank account records from the backend when the component mounts
    fetchBankRecords();
  }, []);


  const fetchBankRecords = async () => {
    try {
      const response = await axios.get(
        `${ipAddress}/api/bank-accounts/`); // Replace with your API endpoint
      if (response.status === 200) {
        setBankRecords(response.data);
      } else {
        // Handle API error
      }
    } catch (error) {
      // Handle fetch error
    }
  };


  
  
  
  const deleteBankRecord = async (accountNumber) => {
    try {
      const response = await axios.delete(`${ipAddress}/api/delete-bank-account/${accountNumber}/`);
      if (response.status === 204) {
        // Remove the deleted bank record from the state
        const updatedBankRecords = bankRecords.filter(
          (record) => record.accountNumber !== accountNumber
        );
        setBankRecords(updatedBankRecords);
      } else {
        // Handle API error
      }
    } catch (error) {
      // Handle fetch error
    }
  };
  





 



  
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
        <Pressable style={styles.cardContainer} onPress={() => navigation.navigate('Card')}>
            <Text style={styles.title}>My Cards</Text>
            </Pressable>
        
      <View style={styles.bankContainer}>
        <Text style={styles.title2}>My Bank Accounts</Text>
        </View>
      </View>

      <View style={styles.propertyContainer}>
        <MaterialIcons name="account-balance" size={34} color="#4C28BC" style={{ marginRight: 15 }} />
        <Text style={styles.propertyText}>Set up your bank accounts so you can perform faster withdrawals locally.</Text>
      </View>
      
      <SectionTitle>LIST OF BANK ACCOUNTS</SectionTitle>

      {bankRecords.map((bankRecord, index) => (
  <View style={styles.bankCard} key={`${bankRecord.accountNumber}-${index}`}>
    <View style={styles.bankCardHeader}>
      <Ionicons name="ios-briefcase-outline" size={35} color="white" margin={20} />
      <Text style={styles.bankCardAccountName}>{bankRecord.account_name}</Text>
    </View>
    <View style={styles.bankCardContent}>
  <Text style={styles.bankCardBankName}>{bankRecord.bank_name}</Text>
  <Text style={styles.bankCardAccountNumber}>
    (*****{bankRecord.account_number.slice(-5)})
  </Text>
  <Text style={styles.bankCardAccountName}>
    {bankRecord.account_name}
  </Text>
</View>
<TouchableOpacity
  style={styles.deleteButtonContainer}
  onPress={() => deleteBankRecord(bankRecord.account_number)}
>
  <MaterialIcons name="delete-outline" size={20} color="#4C28BC" />
</TouchableOpacity>

  </View>
))}















      <View style={styles.buttonsContainer}>
                <TouchableOpacity style={styles.primaryButton} onPress={() => setAddBankModalVisible(true)}>
                <MaterialIcons name="add" size={30} color="#fff" marginRight={5}/>
                <Text style={styles.primaryButtonText}>Add New Account</Text>
                </TouchableOpacity>

               </View>

               <AddBankModal
                navigation={navigation}
                addBankModalVisible={addBankModalVisible}
                setAddBankModalVisible={setAddBankModalVisible}
                initialBankRecords={initialBankRecords}
                bankRecords={bankRecords} // Pass the bankRecords state as a prop
                setBankRecords={setBankRecords}
                deleteBankRecord={deleteBankRecord}
              />


     
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },


   header: {
        marginTop: 50,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 15,
      backgroundColor: '#F5F1FF',
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

  
    bankContainer: {
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
    

        deleteButtonContainer: {
          position: 'absolute',
          top: 10,
          right: 10,
        },
        
        cardContainer: {
            borderWidth: 0.8,
            borderColor: '#4C28BC',
            alignItems: 'center',
            flex: 1,
            borderTopWidth: 0,
            borderRightWidth: 0,
            borderLeftWidth: 0,
            backgroundColor: '#F5F1FF'
            },
    
      title2: {
        fontSize: 16,
        fontFamily: 'proxima',
        color: '#fff',
        marginTop: 5,
        marginBottom: 5,
      },
    
       
      title: {
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
        width: '70%',
        fontFamily: 'karla',
        letterSpacing: -0.2,
        color: 'black',
    
        },
 


        bankCard: {
          backgroundColor: '#4C28BC', // Orange background
          borderRadius: 15,
          marginVertical: 10,
          marginHorizontal: 20,
          padding: 10,
          elevation: 2,
          flexDirection: 'row'

        },
        bankCardHeader: {
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: 10,
        },
        bankCardAccountName: {
          marginLeft: 10,
          fontSize: 18,
          fontWeight: 'bold',
          color: 'white',
          fontFamily: 'proxima',
        },
        bankCardContent: {
          flexDirection: 'column',
          marginLeft: 34,
        },
        bankCardBankName: {
          fontSize: 16,
          color: 'silver',
          fontFamily: 'karla',
        },
        bankCardAccountNumber: {
          fontSize: 14,
          color: 'silver',
          fontFamily: 'karla',
        },
        deleteButton: {
          marginTop: 5,
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

export default Bank;
