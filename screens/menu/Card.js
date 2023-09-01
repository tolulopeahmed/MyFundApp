import React, { useEffect, useState } from 'react';
import { View, Text, Alert, ScrollView, Pressable, TouchableOpacity, StyleSheet, Switch } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { MaterialIcons } from '@expo/vector-icons';
import AddCardModal from './AddCardModal';
import SectionTitle from '../components/SectionTitle';
import { useUserContext } from '../../UserContext';

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
      return "#0C2B5C";
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

const Card = ({ navigation, route }) => {
  const [addCardModalVisible, setAddCardModalVisible] = useState(false); // define modalVisible state
  const { userInfo, setUserCards, userCards, deleteCard } = useUserContext();
  const [cards, setCards] = useState([]);
  const userAllCards = [ ...(userCards[userInfo.token] || [])]; // Use userCards from the context


  useEffect(() => {
    if (route.params?.addCardModalVisible) {
      setAddCardModalVisible(true);
    }
  }, [route.params]);


  useEffect(() => {
    console.log('Fetching user cards with token:', userInfo.token);
    if (userCards && userCards[userInfo.token]) {
      userInfo.cards = userCards[userInfo.token];
    }
  }, [userCards, userInfo.token]);
  

  
  useEffect(() => {
    if (userCards[userInfo.token]) {
      setCards(userCards[userInfo.token]);
    }
  }, [userCards[userInfo.token]]);


  const confirmDeleteCard = async (userToken, cardId) => {
    Alert.alert(
      'Delete Card',
      'Are you sure you want to delete this card?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              // Call the deleteCard function
              await deleteCard(userToken, cardId);
  
              // Remove the deleted card from the userAllCards list
              const updatedUserAllCards = userAllCards.filter((card) => card.id !== cardId);
  
              // Update the context directly to make the card disappear from the UI
              setUserCards((prevUserCards) => {
                const updatedUserCardsObj = { ...prevUserCards };
                updatedUserCardsObj[userToken] = updatedUserAllCards;
                return updatedUserCardsObj;
              });
  
              console.log('Card deleted successfully.');
            } catch (error) {
              console.error('Error deleting card:', error);
            }
          },
        },
      ],
      { cancelable: false }
    );
  };
  
  
  
  
  
  
  
  
  

 
  
  const addCardToList = (newCard) => {
    // Check if the card with the same number already exists in userAllCards
    const isCardAlreadyAdded = userAllCards.some((card) => card.card_number === newCard.card_number);
  
    if (isCardAlreadyAdded) {
      Alert.alert('Error', 'This card has already been added.');
      return;
    }
  
    const updatedCards = [...cards, newCard];
    setCards(updatedCards);
  
    // Update the context with the new card
    setUserCards((prevUserCards) => {
      const updatedUserCardsObj = { ...prevUserCards };
      updatedUserCardsObj[userInfo.token] = updatedCards;
      return updatedUserCardsObj;
    });
  };
  
  
  
  
  
  

  console.log('UserCards:', userCards);

  
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
        <Text style={styles.propertyText}>Set up your cards so you can perform faster transactions including AutoSave, AutoInvest, etc.</Text>
      </View>
      
    <SectionTitle>LIST OF CARDS</SectionTitle>

    <ScrollView contentContainerStyle={styles.scrollViewContent}>

    {userAllCards.length > 0 ? (
  userAllCards.map((card, index) => (
      <View
      style={[
        styles.bankCard,
        { backgroundColor: getBackgroundColor(card.bank_name) },
      ]}
      key={`${card.id}-${index}`}
    >
      <View style={styles.bankCardContent}>
        <View style={styles.bankCardHeader}>
          <Ionicons name="card-outline" size={35} color="white" margin={20} />
          <View style={styles.accountDetails}>
            <Text style={styles.bankCardAccountNumber}>
              {card.card_number.slice(0, 4)} **** **** {card.card_number.slice(-4)}
            </Text>
            <Text style={styles.bankCardBankName}>{card.bank_name}</Text>
            <View style={styles.bankCardExpiry}>
              <Text style={styles.bankCardExpiryText}>Expiry: {card.expiry_date}</Text>
            </View>
          </View>
        </View>
        <View style={styles.deleteButtonContainer}>

        <View style={styles.addBankButtonMargin} />

          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => confirmDeleteCard(userInfo.token, card.id)}
            >
            <Ionicons name="trash-outline" size={18} color="red" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  ))
) : (
<View style={styles.cardAddedcontainer}>
  <Text style={styles.cardAddedInfo}>No cards added yet.</Text>
</View>
)}

</ScrollView>





      <View style={styles.buttonsContainer}>
                <TouchableOpacity style={styles.primaryButton} onPress={() => setAddCardModalVisible(true)}>
                <MaterialIcons name="add" size={30} color="#fff" marginRight={5}/>
                <Text style={styles.primaryButtonText}>Add New Card</Text>
                </TouchableOpacity>
               </View>
              
               <AddCardModal 
               navigation={navigation} 
               addCardModalVisible={addCardModalVisible} 
               setAddCardModalVisible={setAddCardModalVisible}
               addCardToList={addCardToList} // Pass the function to add a new card to the list
              cards={cards} // Pass the current list of cards
               setCards={setCards} // Pass the function to update the list of cards
               />
     
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




    bankCard: {
      backgroundColor: '#4C28BC',
      borderRadius: 10,
      marginVertical: 10,
      marginHorizontal: 35,
      padding: 10,
      elevation: 2,
      flexDirection: 'row',
    },
    bankCardHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 10,
    },
    bankCardBankName: {
      fontSize: 16,
      color: 'white',
      fontFamily: 'karla',
      letterSpacing: -0.5,
      marginTop: 5,

    },
    bankCardContent: {
      flexDirection: 'column',
      justifyContent: 'space-between',
      flex: 1,
    },
    bankCardAccountNumber: {
      fontSize: 24,
      color: 'white',
      fontFamily: 'karla',
    },
    deleteButtonContainer: {
      alignItems: 'flex-end',
    },
    deleteButton: {
      marginTop: -5,
    },

    bankCardExpiry: {
      alignItems: 'flex-start',
    },
    bankCardExpiryText: {
      fontSize: 15,
      color: 'silver',
      fontFamily: 'karla',
      marginTop: 3,
    },
 
    cardAddedcontainer: {
      flex: 1,
      justifyContent: 'center', // Center vertically
      alignItems: 'center', // Center horizontally
    },
    cardAddedInfo: {
      fontSize: 15,
      color: 'silver',
      fontFamily: 'karla',
      marginTop: 140,
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

export default Card;
