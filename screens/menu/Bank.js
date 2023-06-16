import React, { useState } from 'react';
import { View, Text, SafeAreaView, ScrollView, Pressable, TouchableOpacity, StyleSheet, Switch } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { MaterialIcons } from '@expo/vector-icons';
import AddBankModal from './AddBankModal'

const Bank = ({ navigation, initialBankRecords}) => {
  const [addBankModalVisible, setAddBankModalVisible] = useState(false); // define modalVisible state
  const [bankRecords, setBankRecords] = useState(initialBankRecords);

  const deleteBankRecord = (accountNumber) => {
    const updatedBankRecords = bankRecords.filter(
      (record) => record.accountNumber !== accountNumber
    );
    setBankRecords(updatedBankRecords);
  };

  const addBankRecord = (bankRecord) => {
    if (!bankRecord || typeof bankRecord !== 'object') {
      console.error('Invalid bank record:', bankRecord);
      return;
    }
  
    const updatedBankRecords = [bankRecord, ...bankRecords];
    setBankRecords(updatedBankRecords);
    setAddBankModalVisible(false);
  };

  const renderBankAccounts = () => {
    if (!Array.isArray(bankRecords)) {
      return null; // Return early if bankRecords is not an array
    }

    return bankRecords.map((bankRecord) => (
      <View style={styles.bankContainer} key={bankRecord.accountNumber}>
        <Text style={styles.bankName}>{bankRecord.bank}</Text>
        <Text style={styles.accountNumber}>{bankRecord.accountNumber}</Text>
        <TouchableOpacity onPress={() => deleteBankRecord(bankRecord.accountNumber)}>
          <Ionicons name="trash-outline" size={24} color="grey" />
        </TouchableOpacity>
      </View>
    ));
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
        <View style={styles.progressBarContainer}> 
        <Text style={styles.propertyText}>Set up your bank accounts so you can perform faster withdrawals locally.</Text>
      </View>
      </View>
      
         
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
                addBankRecord={addBankRecord}
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
      },
     
      propertyText: {
        flex: 1,
        fontSize: 14,
        width: '70%',
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

export default Bank;
