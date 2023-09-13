// ReduxActions.js

import axios from 'axios'; // Import axios
import { ipAddress } from './constants';

export const ADD_BANK_ACCOUNT = 'ADD_BANK_ACCOUNT';
export const DELETE_BANK_ACCOUNT = 'DELETE_BANK_ACCOUNT'; // Define DELETE_BANK_ACCOUNT action type
export const LOAD_BANK_ACCOUNTS = 'LOAD_BANK_ACCOUNTS';
export const SET_USER_INFO = 'SET_USER_INFO';
export const SET_PROFILE_IMAGE_URI = 'SET_PROFILE_IMAGE_URI';

export const setAuthToken = (token) => ({
  type: 'SET_USER_TOKEN', // Update the action type to match your reducer
  payload: token,
});



export const addBankAccount = (newBankAccount) => ({
  type: 'ADD_BANK_ACCOUNT',
  payload: newBankAccount,
});



export const loadBankAccounts = () => async (dispatch, getState) => {
  try {
    const userInfo = getState().bank.userInfo; // Get user info from the Redux store
    console.log('User Info:', userInfo);

    // Check if userInfo is defined and contains the token property
    if (!userInfo || !userInfo.token) {
      console.error('Authentication Error: User is not authenticated.');
      return;
    }

    // Send a request to the server to fetch the user's bank accounts
    const response = await axios.get(`${ipAddress}/api/bank-accounts/get-bank-accounts/`, {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    });

    if (response.status === 200) {
      // If the request is successful, dispatch the action to add the bank accounts to the Redux store
      dispatch({
        type: ADD_BANK_ACCOUNT,
        payload: response.data, // Assuming the response contains the user's bank accounts
      });
    }
  } catch (error) {
    console.error('Load Bank Accounts Error:', error);
  }
};






export const deleteBankAccount = (accountNumber) => async (dispatch, getState) => {
  try {
    const userInfo = getState().bank.userInfo; // Get user info from the Redux store
    if (!userInfo || !userInfo.token) {
      console.error('Authentication Error: User is not authenticated.');
      return;
    }

    // Send a request to the server to delete the bank account
    const response = await axios.delete(`${ipAddress}/api/delete-bank-account/${accountNumber}/`, {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    });

    if (response.status === 204) {
      // If the deletion was successful on the backend, dispatch the action to remove it from the Redux store
      dispatch({
        type: DELETE_BANK_ACCOUNT,
        payload: accountNumber,
      });

      // Remove the deleted bank account from the local state
      dispatch({
        type: 'REMOVE_LOCAL_BANK_ACCOUNT',
        payload: accountNumber,
      });
    }
  } catch (error) {
    console.error('Delete Bank Account Error:', error);
  }
};



// Fetch user data and update the Redux store with user information
export const fetchUserData = (userToken) => async (dispatch) => {
  try {
    const response = await axios.get(`${ipAddress}/api/get-user-profile/`, {
      headers: {
        Authorization: `Bearer ${userToken}`,
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

      // Dispatch other actions if needed (e.g., setSavingsGoal, setProfileImageUri)
    }
  } catch (profileError) {
    console.error('API Error:', profileError);
    alert('Error fetching user profile');
  }
};


// Set the profile image URI in the Redux store
export const setProfileImageUri = (newUri) => (dispatch) => {
  dispatch({
    type: SET_PROFILE_IMAGE_URI,
    payload: newUri,
  });
};