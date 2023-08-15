// UserContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ipAddress } from './constants';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState({
    firstName: '',
    lastName: '',
    mobileNumber: '',
    email: '',
  });

  useEffect(() => {
    const retrieveAuthToken = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        if (token !== null) {
          console.log('Retrieved Token:', token);
          // Now you have the token, proceed with the API request
          axios
            .get(`${ipAddress}/api/get_user_profile/`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            })
            .then(response => {
              console.log('API Response:', response.data);
              const profileData = response.data;
              setUserInfo({ ...profileData, token }); // Update the userInfo state with the fetched data and token
            })
            .catch(error => {
              console.error('API Error:', error);
              if (error.response && error.response.status === 401) {
                alert('Authentication failed. Please log in again.');
              } else {
                alert('Error fetching user profile');
              }
            });
        } else {
          console.log('No token found');
          // Handle case where no token is found
        }
      } catch (error) {
        console.error('Error retrieving auth token:', error);
      }
    };

    retrieveAuthToken();
  }, []);

  return (
    <UserContext.Provider value={{ userInfo }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  return useContext(UserContext);
};
