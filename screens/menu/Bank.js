import React, { useState, useEffect } from 'react';
import { View, Text, Alert, ScrollView, Pressable, TouchableOpacity, StyleSheet, Switch } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { MaterialIcons } from '@expo/vector-icons';
import AddBankModal from './AddBankModal';
import SectionTitle from '../components/SectionTitle';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useUserContext } from '../../UserContext';

const Bank = ({ navigation, initialBankRecords}) => {
  const [addBankModalVisible, setAddBankModalVisible] = useState(false); // define modalVisible state
  const [bankRecords, setBankRecords] = useState([]);
  const { userBankRecords, deleteBankRecord } = useUserContext();
  const mergedBankRecords = [...(userBankRecords || []), ...(bankRecords || [])];



  const getBackgroundColor = (bankName) => {
    switch (bankName) {
      case "Access Bank":
        return "#91A62A";
      case "Guaranty Trust Bank":
        return "#C3460E";
      case "Zenith Bank":
        return "#E6000D";
      case "United Bank for Africa":
        return "#D42C07";
      case "First City Monument Bank":
        return "#702699";
      case "Wema Bank":
        return "#72235A";
      case "Polaris Bank":
        return "#8834AE";
      case "Union Bank":
        return "#00ADEF";
      case "Ecobank":
        return "#00537F";
      case "Stanbic IBTC Bank":
        return "#04009D";
      case "First Bank of Nigeria":
        return "#13233C";
      case "Keystone Bank":
        return "#014888";
      case "Sterling Bank":
        return "#DB3539";
      case "Unity Bank Plc":
        return "#88BB52";
      case "Citibank":
        return "#0275D0";
      case "Heritage Bank Plc":
        return "#439B2D";
      case "Standard Chartered Bank":
        return "#0671A9";
      case "Jaiz Bank":
        return "#0B411F";
      case "Fidelity Bank":
        return "#232B69";
      case "Opay":
        return "#08A67C";
      case "Palmpay":
        return "#7F13CB";
      case "Moniepoint Microfinance Bank":
        return "#0649C4";
      default:
        return "#4C28BC"; // Default color
    }
  };
  

  const confirmDelete = (accountNumber) => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this bank account?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: () => performDelete(accountNumber),
        },
      ],
      { cancelable: true }
    );
  };
  
  const handleDelete = (accountNumber) => {
    confirmDelete(accountNumber);
  };
  
  
 
  const performDelete = async (accountNumber) => {
    try {
      // Call your deleteBankRecord function here
      await deleteBankRecord(accountNumber);
      // Optionally, you can update the local state here to remove the deleted bank record
    } catch (error) {
      console.error('Delete Error:', error);
    }
  };
  


  useEffect(() => {
    const loadBankRecords = async () => {
      try {
        const storedBankRecords = await AsyncStorage.getItem('bankRecords');
        if (storedBankRecords) {
          setBankRecords(JSON.parse(storedBankRecords));
        }
      } catch (error) {
        console.error('Error loading bank records:', error);
      }
    };
  
    loadBankRecords();
  }, []);
  

  console.log('Bank Records:', bankRecords);
  console.log('UserBank Records from context:', userBankRecords);



  
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
        <Text style={styles.propertyText}>Set up your bank accounts so you can perform faster withdrawals.</Text>
      </View>
      
      <SectionTitle>LIST OF BANK ACCOUNTS</SectionTitle>


      <ScrollView contentContainerStyle={styles.scrollViewContent}>
      {mergedBankRecords.length > 0 ? (
        mergedBankRecords.map((bankRecord, index) => (
          <View
    style={[
      styles.bankCard,
      { backgroundColor: getBackgroundColor(bankRecord.bank_name) },
    ]}
    key={`${bankRecord.accountNumber}-${index}`}
  >
    <View style={styles.bankCardContent}>
      <View style={styles.bankCardHeader}>
        <MaterialIcons name="account-balance" size={35} color="white" margin={20} />
        <View style={styles.accountDetails}>
          <Text style={styles.bankCardAccountName}>{bankRecord.account_name}</Text>
          <Text style={styles.bankCardBankName}>{bankRecord.bank_name}</Text>
          <Text style={styles.bankCardAccountNumber}>
            (*****{bankRecord.account_number.slice(-5)})
          </Text>
        </View>
      </View>
      <View style={styles.deleteButtonContainer}>

      <View style={styles.addBankButtonMargin} />

        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDelete(bankRecord.account_number)}
          >
          <MaterialIcons name="delete-outline" size={20} color="red" />
        </TouchableOpacity>
      </View>
    </View>
  </View>
))
) : (
  <View style={styles.bankAddedcontainer}>
    <Text style={styles.bankAddedInfo}>No bank accounts added yet.</Text>
  </View>
)}
</ScrollView>




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
          backgroundColor: '#4C28BC',
          borderRadius: 0,
          borderTopLeftRadius: 20, // Set to 0 for straight top left corner
          borderTopRightRadius: 20, // Set to 0 for straight top right corner
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
          fontSize: 18,
          color: 'white',
          fontFamily: 'proxima',
        },
        bankCardContent: {
          flexDirection: 'column',
          justifyContent: 'space-between', // Arrange content vertically
          flex: 1, // Take up remaining space


        },
        bankCardBankName: {
          fontSize: 16,
          color: 'white',
          fontFamily: 'karla',
        },
        bankCardAccountNumber: {
          fontSize: 14,
          color: 'silver',
          fontFamily: 'karla',
        },

        deleteButtonContainer: {
          alignItems: 'flex-end', // Align the button to the right
        },

        deleteButton: {
          marginTop: -25,
        },
        bankAddedcontainer: {
          flex: 1,
          justifyContent: 'center', // Center vertically
          alignItems: 'center', // Center horizontally
        },
        bankAddedInfo: {
          fontSize: 17,
          color: 'silver',
          fontFamily: 'karla',
          marginTop: -90,
        },
      
      
        addBankButtonMargin: {
          height: 5, // Adjust this value to control the size of the white margin area
          backgroundColor: 'white', // Set the color of the white margin area
        },

        


        buttonsContainer: {
          flexDirection: 'row',
          justifyContent: 'center',
          position: 'relative',
          bottom: 30,
          left: 0,
          right: 0,
          marginTop: 50,
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
