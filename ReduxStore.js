// ReduxStore.js

import { combineReducers } from 'redux';
import { configureStore } from '@reduxjs/toolkit';
import Reducer from './ReduxReducers';
import { setUserToken, fetchAccountBalances, fetchUserTransactions, fetchUserBankAccounts, fetchUserCards, fetchAutoSaveSettings, fetchAutoInvestSettings, fetchTopSaversData, fetchKYCStatus, addAlertMessage } from './ReduxActions'; // Import the updated action
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage

const rootReducer = combineReducers({
  bank: Reducer,
});

const store = configureStore({
  reducer: rootReducer,
  // ... (other store configuration options)
});

// Retrieve the initial token from AsyncStorage or elsewhere
const getInitialToken = async () => {
  try {
    const token = await AsyncStorage.getItem('authToken'); // Replace 'authToken' with the key you use to store the token in AsyncStorage
    return token;
  } catch (error) {
    console.error('Error retrieving auth token from AsyncStorage:', error);
    return null;
  }
};

// Dispatch an action to set the initial token if it's available
getInitialToken().then((initialToken) => {
  if (initialToken) {
    store.dispatch(setUserToken(initialToken)); // Updated to setUserToken
    store.dispatch(fetchAccountBalances()); // Dispatch the action to fetch account balances
    store.dispatch(fetchUserTransactions()); // Dispatch the action to fetch user transactions
    store.dispatch(fetchUserBankAccounts()); // Dispatch the action to fetch user's bank accounts
    store.dispatch(fetchUserCards());
    store.dispatch(fetchAutoSaveSettings()); // Fetch auto-save status and settings
    store.dispatch(fetchAutoInvestSettings()); // Fetch auto-invest status and settings
    store.dispatch(fetchTopSaversData()); // Dispatch the action to fetch top savers data
    store.dispatch(fetchKYCStatus());
    // Dispatch an action to add an initial alert message if needed
    const initialAlertMessage = {
      id: Date.now(), // Generate a unique ID
      type: 'message',
      description: 'Welcome to MyFund!',
      date: new Date().toLocaleString(),
    };
    store.dispatch(addAlertMessage(initialAlertMessage));
  }
});



export default store;
