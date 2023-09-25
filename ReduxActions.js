// ReduxActions.js

import axios from 'axios'; // Import axios
import { ipAddress } from './constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const SET_USER_TOKEN = 'SET_USER_TOKEN';
export const SET_USER_INFO = 'SET_USER_INFO';
export const UPDATE_USER_PROFILE = 'UPDATE_USER_PROFILE';
export const SET_PROFILE_IMAGE_URI = 'SET_PROFILE_IMAGE_URI';
export const UPDATE_SAVINGS_GOAL = 'UPDATE_SAVINGS_GOAL';
export const ADD_MESSAGE = 'ADD_MESSAGE';
export const CLEAR_MESSAGES = 'CLEAR_MESSAGES';

export const UPDATE_ACCOUNT_BALANCES = 'UPDATE_ACCOUNT_BALANCES';
export const UPDATE_SAVINGS_BALANCE = 'UPDATE_SAVINGS_BALANCE';
export const UPDATE_USER_TRANSACTIONS = 'UPDATE_USER_TRANSACTIONS';

export const ADD_BANK_ACCOUNT = 'ADD_BANK_ACCOUNT';
export const DELETE_BANK_ACCOUNT = 'DELETE_BANK_ACCOUNT'; // Define DELETE_BANK_ACCOUNT action type
export const LOAD_BANK_ACCOUNTS = 'LOAD_BANK_ACCOUNTS';

export const ADD_CARD = 'ADD_CARD';
export const LOAD_CARDS = 'LOAD_CARDS';
export const FETCH_CARDS_SUCCESS = 'FETCH_CARDS_SUCCESS';
export const ADD_CARD_SUCCESS = 'ADD_CARD_SUCCESS';
export const DELETE_CARD_SUCCESS = 'DELETE_CARD_SUCCESS';

export const UPDATE_AUTO_SAVE_STATUS = 'UPDATE_AUTO_SAVE_STATUS';



export const setUserToken = (token) => ({
  type: SET_USER_TOKEN,
  payload: token,
});

export const updateUserProfile = (updatedProfile) => ({
  type: UPDATE_USER_PROFILE,
  payload: updatedProfile,
});

export const setProfileImageUri = (newUri) => ({
  type: SET_PROFILE_IMAGE_URI,
  payload: newUri,
});

export const addMessage = (message) => ({
  type: ADD_MESSAGE,
  payload: message,
});

export const clearMessages = () => ({
  type: CLEAR_MESSAGES,
});


export const updateSavingsGoal = ({ preferred_asset, savings_goal_amount, time_period }) => ({
  type: UPDATE_SAVINGS_GOAL,
  payload: { preferred_asset, savings_goal_amount, time_period },
});


export const addBankAccount = (newBankAccount) => ({
  type: ADD_BANK_ACCOUNT,
  payload: newBankAccount,
});

export const deleteBankAccount = (accountNumber) => ({
  type: DELETE_BANK_ACCOUNT,
  payload: accountNumber,
});

export const updateAccountBalances = (newAccountBalances) => ({
  type: UPDATE_ACCOUNT_BALANCES,
  payload: newAccountBalances,
});

export const updateUserTransactions = (transactions) => ({
  type: UPDATE_USER_TRANSACTIONS,
  payload: transactions,
});

export const loadBankAccounts = (bankAccounts) => ({
  type: LOAD_BANK_ACCOUNTS,
  payload: bankAccounts,
});


export const addCard = (newCard) => ({
  type: ADD_CARD,
  payload: newCard,
});


export const loadCards = (cards) => ({
  type: LOAD_CARDS,
  payload: cards,
});

export const fetchCardsSuccess = (cards) => ({
  type: FETCH_CARDS_SUCCESS,
  payload: cards,
});

export const addCardSuccess = (card) => ({
  type: ADD_CARD_SUCCESS,
  payload: card,
});

export const deleteCardSuccess = (cardId) => ({
  type: DELETE_CARD_SUCCESS,
  payload: cardId,
});


export const updateAutoSaveStatus = (status) => ({
  type: UPDATE_AUTO_SAVE_STATUS,
  payload: status,
});

// Fetch user data and update the Redux store with user information
export const fetchUserData = () => async (dispatch, getState) => {
  const userInfo = getState().bank.userInfo;
  
  // Check if userInfo is defined and contains the token property
  if (!userInfo || !userInfo.token) {
    console.error('Authentication Error: User is not authenticated.');
    return;
  }

  try {
    const response = await axios.get(`${ipAddress}/api/get-user-profile/`, {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    });

    if (response.status === 200) {
      const profileData = response.data;

      // Dispatch the action to set user information in the Redux store
      dispatch({
        type: SET_USER_INFO,
        payload: {
          ...profileData,
          id: profileData.id,
          profileImageUrl: profileData.profile_picture
            ? ipAddress + profileData.profile_picture
            : null,
        },
      });

      // Dispatch other actions as needed
      dispatch(setProfileImageUri(profileData.profile_picture)); // Set profile image URI
      dispatch(fetchAccountBalances()); // Fetch account balances
      dispatch(fetchUserTransactions()); // Fetch user transactions
      dispatch(loadBankAccounts(profileData.bankRecords)); // Load user's bank accounts
      dispatch(fetchUserBankAccounts()); // Load user's bank accounts

      // If you have other actions to dispatch (e.g., setSavingsGoal), add them here
    }
  } catch (profileError) {
    console.error('API Error:', profileError);
    alert('Error fetching user profile');
  }
};


export const fetchAccountBalances = () => async (dispatch, getState) => {
  const userInfo = getState().bank.userInfo;
  if (!userInfo.token) {
    return;
  }

  try {
    const response = await axios.get(`${ipAddress}/api/get-account-balances/`, {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    });

    if (response.status === 200) {
      dispatch(updateAccountBalances(response.data));
    }
  } catch (error) {
    console.error('Fetch Error:', error);
  }
};



export const fetchUserTransactions = () => async (dispatch, getState) => {
  const userInfo = getState().bank.userInfo;
  if (!userInfo.token) {
    return;
  }

  try {
    const response = await axios.get(`${ipAddress}/api/user-transactions/`, {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    });

    if (response.status === 200) {
      dispatch(updateUserTransactions(response.data));
    }
  } catch (error) {
    console.error('Fetch Error:', error);
  }
};




export const fetchUserBankAccounts = () => async (dispatch, getState) => {
  const userInfo = getState().bank.userInfo;
  if (!userInfo.token) {
    return;
  }

  try {
    const response = await axios.get(`${ipAddress}/api/bank-accounts/get-bank-accounts/`, {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    });

    if (response.status === 200) {
      dispatch(loadBankAccounts(response.data)); // Dispatch the action to load bank accounts
    }
  } catch (error) {
    console.error('Fetch Error:', error);
  }
};


export const fetchUserCards = () => async (dispatch, getState) => {
  const userInfo = getState().bank.userInfo;
  if (!userInfo || !userInfo.token) {
    console.error('Authentication Error: User is not authenticated');
    return;
  }

  try {
    const response = await axios.get(`${ipAddress}/api/get-cards/`, {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    });

    if (response.status === 200) {
      const userCards = response.data;
      console.log('Fetched Cards:', userCards);
      dispatch(fetchCardsSuccess(userCards)); // Dispatch success action
    }
  } catch (error) {
    console.error('Fetch Error:', error);
  }
};