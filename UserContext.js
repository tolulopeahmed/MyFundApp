import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ipAddress, RedisAddress } from './constants';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userTransactions, setUserTransactions] = useState([]);
  const addTransaction = (transactionData) => {
    setUserTransactions([...userTransactions, transactionData]);
  };

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
    bankRecords: [],
    cards: [],
  });

  const [accountBalances, setAccountBalances] = useState({
    savings: 0,
    investment: 0,
    properties: 0,
    wallet: 0,
  });



  useEffect(() => {
    const transactionSocket = new WebSocket(`${RedisAddress}/ws/transaction_update/`);
        console.log('Transaction WebSocket connection opened successfully.');

    transactionSocket.onopen = () => {
      console.log('WebSocket connection opened successfully.');
    };

    transactionSocket.onmessage = (event) => {
      console.log('Received WebSocket message:', event.data);

      const data = JSON.parse(event.data);
      if (data.type === 'update_transaction') {
        const newTransaction = {
          transaction_type: data.transaction.transaction_type,
          amount: data.transaction.amount,
          date: data.transaction.date,
          time: data.transaction.time,
          transaction_id: data.transaction.transaction_id,
          description: data.transaction.description,
        };
  
        // Update userTransactions with the new transaction
        setUserTransactions(prevUserTransactions => [
          ...prevUserTransactions,
          newTransaction,
        ]);
      }
      console.log('Received WebSocket message:', event.data);

      transactionSocket.onclose = (event) => {
        console.log('WebSocket connection closed:', event);
      };
    
      transactionSocket.onerror = (error) => {
        console.error('WebSocket error:', error);
      };
    };




    const balanceSocket = new WebSocket(`${RedisAddress}/ws/balance_update/`);

    balanceSocket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'update_balances') {
        setAccountBalances(data.balances);
      }
    };

    return () => {
      transactionSocket.close();
      balanceSocket.close();
    };
  }, [userCards, userTransactions]); 





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
          fetchUserTransactions(token);
          
        }
      } catch (error) {
        console.error('Error retrieving auth token:', error);
      }
    };
  
    retrieveAuthToken();
  }, []);



  const fetchUserData = async (userToken) => {
    if (!userInfo.token) {
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
  }
  };

  
  const fetchUserBankRecords = async (userToken) => {
    if (!userToken) {
      return; // Do not make the API call if the user is not authenticated
    }
    try {
      const response = await axios.get(`${ipAddress}/api/bank-accounts/get-bank-accounts/`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });
  
      if (response.status === 200) {
        setUserBankRecords(response.data);
      }
    } catch (error) {
      console.error('Fetch Error:', error);
    }
  };





  
  
  const fetchUserCards = async () => {
    if (!userInfo.token) {
      return; // Do not make the API call if the user is not authenticated
    }
    try {
      const cardsResponse = await axios.get(`${ipAddress}/api/get-cards/`, {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      });
  
      if (cardsResponse.status === 200) {
        setUserCards(cardsResponse.data);
      }
    } catch (error) {
      console.error('Fetch Error:', error);
    }
  };


  const fetchAccountBalances = async () => {
    if (!userInfo.token) {
      return; // Do not make the API call if the user is not authenticated
    }
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

  const updateAccountBalances = (newBalances) => {
    setAccountBalances(newBalances);
  };






  const fetchUserTransactions = async (userToken) => {
    if (!userToken) {
      return; // Do not make the API call if the user is not authenticated
    }
    try {
      const response = await axios.get(`${ipAddress}/api/user-transactions/`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });

      if (response.status === 200) {
        setUserTransactions(response.data);
      }
    } catch (error) {
      console.error('Fetch Error:', error);
    }
  };

  useEffect(() => {
    if (userInfo.token) {
      setUserBankRecords({});
      setUserCards({});
  
      fetchUserCards(userInfo.token);
      fetchUserBankRecords(userInfo.token);
      fetchUserData(userInfo.token);
      fetchAccountBalances();
      fetchUserTransactions(userInfo.token);
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
  
      setUserCards(prevUserCards => {
        const updatedUserCards = { ...prevUserCards };
        if (updatedUserCards[userToken]) {
          updatedUserCards[userToken] = updatedUserCards[userToken].filter(card => card.id !== cardId);
        }
        return updatedUserCards;
      });
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




  return (
    <UserContext.Provider
      value={{
        userInfo, setUserInfo,
        updateUserProfile, profileImageUri,  updateProfileImageUri,
        savingsGoal, setSavingsGoal,
        userBankRecords, deleteBankRecord,
        userCards, addCard, deleteCard, setUserCards,
        accountBalances, setAccountBalances, updateAccountBalances,
        userTransactions, addTransaction,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  return useContext(UserContext);
};
