// ReduxActions.js

import axios from 'axios'; // Import axios
import { ipAddress } from './constants';
import { useContext } from 'react'; // Import useContext from 'react'
import { UserContext } from './UserContext'; // Update this import to match your context
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage

export const ADD_BANK_ACCOUNT = 'ADD_BANK_ACCOUNT';
export const DELETE_BANK_ACCOUNT = 'DELETE_BANK_ACCOUNT'; // Define DELETE_BANK_ACCOUNT action type

export const addBankAccount = (bankAccount) => async (dispatch) => {
  try {
    // Dispatch ADD_BANK_ACCOUNT action
    dispatch({
      type: ADD_BANK_ACCOUNT,
      payload: bankAccount,
    });

    // Get the existing bank account data from storage
    const existingData = await AsyncStorage.getItem('bankAccounts');

    // Parse the existing data or initialize an empty array
    const parsedData = existingData ? JSON.parse(existingData) : [];

    // Add the new bank account data to the array
    parsedData.push(bankAccount);

    // Store the updated data back in AsyncStorage
    await AsyncStorage.setItem('bankAccounts', JSON.stringify(parsedData));
  } catch (error) {
    console.error('Add Bank Account Error:', error);
  }
};






export const deleteBankAccount = (accountNumber, userToken) => async (dispatch) => {
  try {
    if (!userToken) {
      // Handle the case where the user is not authenticated (e.g., show an error message)
      console.error('Authentication Error: User is not authenticated.');
      return;
    }

    // Make an API request to delete the bank account on the backend
    const response = await axios.delete(`${ipAddress}/api/delete-bank-account/${accountNumber}/`, {
      headers: {
        Authorization: `Bearer ${userToken}`, // Use the user token passed as an argument
      },
    });

    if (response.status === 204) {
      // If the deletion was successful on the backend, dispatch the action to remove it from the Redux store
      dispatch({
        type: DELETE_BANK_ACCOUNT, // Use the DELETE_BANK_ACCOUNT action type
        payload: accountNumber,
      });
    }
  } catch (error) {
    console.error('Delete Error:', error);
  }
};






export const loadBankAccountData = () => async (dispatch) => {
  try {
    // Fetch the bank account data from AsyncStorage
    const bankAccountData = await AsyncStorage.getItem('bankAccounts');

    if (bankAccountData) {
      // If data exists, parse it and dispatch ADD_BANK_ACCOUNT actions
      const parsedData = JSON.parse(bankAccountData);
      parsedData.forEach((bankAccount) => {
        dispatch(addBankAccount(bankAccount));
      });
    }
  } catch (error) {
    console.error('Load Bank Account Data Error:', error);
  }
};