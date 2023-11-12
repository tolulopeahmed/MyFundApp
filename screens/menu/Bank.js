import React, { useState, useEffect } from 'react';
import { View, Text, Alert, ScrollView, Pressable, TouchableOpacity, StyleSheet, Switch } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { MaterialIcons } from '@expo/vector-icons';
import AddBankModal from './AddBankModal';
import SectionTitle from '../components/SectionTitle';
import { useSelector, useDispatch } from 'react-redux';
import { deleteBankAccount, fetchUserBankAccounts  } from '../../ReduxActions';
import axios from 'axios';
import { ipAddress } from '../../constants';
import bankOptions from '../components/BankOptions';
import { useTheme } from '../../ThemeContext';

const Bank = ({ navigation, route, initialBankRecords}) => {
  const [addBankModalVisible, setAddBankModalVisible] = useState(false); // define modalVisible state
  const bankAccounts = useSelector((state) => state.bank.bankAccounts);
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.bank.userInfo);
  const [bankRecords, setBankRecords] = useState([]);
  const { isDarkMode, colors } = useTheme();
  const styles = createStyles(isDarkMode);

  useEffect(() => {
    dispatch(fetchUserBankAccounts()); // Use the correct action name here
  }, []);

  useEffect(() => {
    if (route.params?.addBankModalVisible) {
      setAddBankModalVisible(true);
    }
  }, [route.params]);

  useEffect(() => {
    console.log('Bank Accounts:', bankAccounts); // Log bankAccounts
    setBankRecords(bankAccounts);
  }, [bankAccounts]);
  
  console.log('Bank Records:', bankRecords); // Log bankRecords
  




  const getBackgroundColor = (bankName) => {
    const bank = bankOptions.find((option) => option.name === bankName);
    return bank ? bank.color : "#4C28BC"; // Default to your default color
  };



  
  const handleDelete = (accountNumber) => {
    confirmDelete(accountNumber);
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
          onPress: async () => {
            try {
              // Send a DELETE request to your backend API to delete the bank account
              const response = await axios.delete(
                `${ipAddress}/api/delete-bank-account/${accountNumber}/`,
                {
                  headers: {
                    Authorization: `Bearer ${userInfo.token}`,
                  },
                }
              );
  
              if (response.status === 204) {
                // If the backend successfully deleted the account, dispatch the action to update the Redux store
                dispatch(deleteBankAccount(accountNumber));
                Alert.alert('Success', 'Bank Account Deleted successfully', [
                  { text: 'OK' },
                ]);
              } else {
                console.error('Failed to delete bank account:', response.data);
                Alert.alert('Error', 'Failed to delete bank account. Please try again later.');
              }
            } catch (error) {
              console.error('An error occurred while deleting bank account:', error);
              Alert.alert('Error', 'An error occurred while deleting bank account. Please try again later.');
            }
          },
        },
      ],
      { cancelable: true }
    );
  };
  
  
  
 


  
  

  console.log('Bank Accounts:', bankAccounts);
  console.log('Bank Records:', bankRecords);



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
        <MaterialIcons name="account-balance" size={34} style={styles.icon}/>
        <Text style={styles.propertyText}>Set up your bank accounts so you can perform faster withdrawals.</Text>
      </View>
      
      <SectionTitle>LIST OF BANK ACCOUNTS</SectionTitle>


      <ScrollView contentContainerStyle={styles.scrollViewContent}>
      {bankRecords && bankRecords.length > 0 ? (
          bankRecords.map((bankAccount, index) => (
            <View
            style={[
              styles.bankCard,
              { backgroundColor: getBackgroundColor(bankAccount.bank_name) },
            ]}
            key={`${bankAccount.accountNumber}-${index}`}
            >
    <View style={styles.bankCardContent}>
      <View style={styles.bankCardHeader}>
        <MaterialIcons name="account-balance" size={35} color="white" margin={20} />
        <View style={styles.accountDetails}>
          <Text style={styles.bankCardAccountName}>{bankAccount.account_name}</Text>
          <Text style={styles.bankCardBankName}>{bankAccount.bank_name}</Text>
          <Text style={styles.bankCardAccountNumber}>
          {bankAccount.account_number}
          </Text>
        </View>
      </View>
      <View style={styles.deleteButtonContainer}>

      <View style={styles.addBankButtonMargin} />

        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDelete(bankAccount.account_number)}
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
                dispatch={dispatch} // Pass dispatch as a prop
                userInfo={userInfo} 
                />


     
    </View>
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
            borderTopRightRadius: 15,
            borderTopLeftRadius: 15,
            borderBottomWidth: 0.8,
            borderLeftWidth: 0.8,
            borderRightWidth: 0.8,
            backgroundColor: isDarkMode ? 'black' : 'white',
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
        backgroundColor: isDarkMode ? '#2B1667' : '#DCD1FF',
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
        color: isDarkMode ? 'silver' : 'black',
    
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
        icon: {
          marginRight: 15,
          color: isDarkMode ? '#6E3DFF' : '#4C28BC',
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
}
export default Bank;
