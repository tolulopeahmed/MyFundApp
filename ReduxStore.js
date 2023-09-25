// ReduxStore.js

import { combineReducers } from 'redux';
import { configureStore } from '@reduxjs/toolkit';
import Reducer from './ReduxReducers';
import { setUserToken, fetchAccountBalances, fetchUserTransactions, fetchUserBankAccounts, fetchUserCards, updateAutoSaveStatus } from './ReduxActions'; // Import the updated action
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage

const rootReducer = combineReducers({
  bank: Reducer,
  // ... (other reducers)
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

  }
});

const getInitialAutoSaveStatus = async () => {
  try {
    const autoSaveStatus = await AsyncStorage.getItem('autoSaveStatus');
    return autoSaveStatus === 'true';
  } catch (error) {
    console.error('Error retrieving auto-save status from AsyncStorage:', error);
    return false;
  }
};

// Dispatch an action to set the initial auto-save status if available
getInitialAutoSaveStatus().then((initialStatus) => {
  store.dispatch(updateAutoSaveStatus(initialStatus));
});

export default store;
