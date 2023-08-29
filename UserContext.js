import React, { Alert, createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ipAddress } from './constants';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [savingsGoal, setSavingsGoal] = useState({
    preferred_asset: '',
    savings_goal_amount: '',
    time_period: '',
  });

  const [profileImageUri, setProfileImageUri] = useState('');
  const [userBankRecords, setUserBankRecords] = useState({});
  const [userCards, setUserCards] = useState({});
  const [userInfo, setUserInfo] = useState({
    is_first_time_signup: false,
    id: '',
    firstName: '',
    lastName: '',
    mobileNumber: '',
    email: '',
    profileImageUrl: '',
    token: '',
    preferred_asset: '',
    savings_goal_amount: '',
    time_period: '',
    bankRecords: [], // Array to hold bank records
    cards: [], // Array to hold card information
  });
  
  const [accountBalances, setAccountBalances] = useState({
    savings: 0,
    investment: 0,
    properties: 0,
    wallet: 0,
  });



  useEffect(() => {
    const retrieveAuthToken = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        if (token !== null) {
          setUserInfo(prevUserInfo => ({
            ...prevUserInfo,
            token,
          }));
          fetchUserData(token);
        }
      } catch (error) {
        console.error('Error retrieving auth token:', error);
      }
    };
  
    retrieveAuthToken();
  }, []);
  
  const fetchUserData = async (userToken) => {
    try {
      const response = await axios.get(`${ipAddress}/api/get-user-profile/`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });
  
      if (response.status === 200) {
        const profileData = response.data;
  
        setUserInfo(prevUserInfo => ({
          ...prevUserInfo,
          ...profileData,
          id: profileData.id,
          profileImageUrl: profileData.profile_picture
            ? ipAddress + profileData.profile_picture
            : null,
        }));
  
        setSavingsGoal({
          preferred_asset: profileData.preferred_asset,
          savings_goal_amount: profileData.savings_goal_amount,
          time_period: profileData.time_period,
        });
  
        setProfileImageUri(
          profileData.profile_picture
            ? ipAddress + profileData.profile_picture
            : null
        );
                
       
      }
    } catch (profileError) {
      console.error('API Error:', profileError);
      alert('Error fetching user profile');
    }
  };


 
  const fetchUserBankRecords = async (userToken) => {
    try {
      const response = await axios.get(`${ipAddress}/api/bank-accounts/get-bank-accounts/`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });
  
      if (response.status === 200) {
        // Update bank records in user context
        setUserBankRecords(response.data);
  
        // If you want to store it in userInfo as well:
        setUserInfo(prevUserInfo => ({
          ...prevUserInfo,
          bankRecords: response.data,
        }));
      }
    } catch (error) {
      console.error('Fetch Error:', error);
    }
  };
  
  const fetchUserCards = async (userToken) => {
    try {
      const cardsResponse = await axios.get(`${ipAddress}/api/get-cards/`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });
  
      if (cardsResponse.status === 200) {
        setUserInfo(prevUserInfo => ({
          ...prevUserInfo,
          cards: cardsResponse.data,
        }));
      }
    } catch (error) {
      console.error('Fetch Error:', error);
    }
  };
  
  

  const fetchAccountBalances = async () => {
    try {
      const response = await axios.get(`${ipAddress}/api/get-account-balances/`, {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      });

      if (response.status === 200) {
        setAccountBalances(response.data);
      }
    } catch (error) {
      console.error('Fetch Error:', error);
    }
  };

  useEffect(() => {
    if (userInfo.token) {
      fetchUserData(userInfo.token);
      fetchUserCards(userInfo.token);
      fetchUserBankRecords(userInfo.token);
      fetchAccountBalances();
    }
  }, [userInfo.token]);












  useEffect(() => {
    if (userInfo.token) {

      setUserBankRecords({}); // Clear previous user's bank data
      setUserCards({}); // Clear previous user's card data
  
      fetchUserCards(userInfo.token); // Fetch card data for the new user
      fetchUserBankRecords(userInfo.token);
      fetchUserData(userInfo.token);

    }
  }, [userInfo.token]);
  

  
  const addCard = (userToken, newCard) => {
    const updatedUserCards = { ...userCards };
    updatedUserCards[userToken] = [...(updatedUserCards[userToken] || []), newCard];
    setUserCards(updatedUserCards);
  };

  const deleteCard = async (userToken, cardId) => {
    try {
      await axios.delete(`${ipAddress}/api/cards/${cardId}/`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });
  
      setUserCards(prevUserCards => ({
        ...prevUserCards,
        [userToken]: prevUserCards[userToken].filter(card => card.id !== cardId),
      }));
  
    } catch (error) {
      console.error('Delete Error:', error);
    }
  };
  
  

  const deleteBankRecord = async (accountNumber) => {
    try {
      await axios.delete(`${ipAddress}/api/delete-bank-account/${accountNumber}/`, {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      });
  
      setUserBankRecords((prevRecords) =>
        prevRecords.filter((record) => record.account_number !== accountNumber)
      );
    } catch (error) {
      console.error('Delete Error:', error);
    }
  };


    
  const updateProfileImageUri = newUri => {
    setProfileImageUri(newUri);
  };

  const updateUserProfile = updatedProfile => {
    setUserInfo(prevUserInfo => ({
      ...prevUserInfo,
      firstName: updatedProfile.first_name,
      lastName: updatedProfile.last_name,
      mobileNumber: updatedProfile.phone_number,
    }));
  };



  console.log('userInfo:', userInfo);
  console.log('userBankRecords:', userBankRecords);
  console.log('accountBalances:', accountBalances );



  return (
    <UserContext.Provider
      value={{
        userInfo, setUserInfo,
        updateUserProfile, profileImageUri,  updateProfileImageUri,
        savingsGoal, setSavingsGoal,
        userBankRecords, deleteBankRecord,
        userCards, addCard, deleteCard,
        accountBalances,

      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  return useContext(UserContext);
};
