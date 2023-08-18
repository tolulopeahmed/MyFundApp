// UserContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ipAddress } from './constants';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [profileImageUri, setProfileImageUri] = useState('');
    const [userInfo, setUserInfo] = useState({
            firstName: '',
            lastName: '',
            mobileNumber: '',
            email: '',
            profileImageUrl: '', // Initialize with an empty string or default image URL
            token: '', // Initialize with an empty string
        });

  

  useEffect(() => {
    const retrieveAuthToken = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        if (token !== null) {
          console.log('Retrieved Token:', token);
          setUserInfo(prevUserInfo => ({
            ...prevUserInfo,
            token,
          }));
  
          // Fetch user profile data after retrieving the token
          axios
            .get(`${ipAddress}/api/get-user-profile/`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            })
            .then(profileResponse => {
              console.log('API Response:', profileResponse.data);
              const profileData = profileResponse.data;
  
              // Set user info in UserContext
              setUserInfo(prevUserInfo => ({
                ...prevUserInfo,
                ...profileData,
                profileImageUrl: profileData.profile_picture,
              }));

              setProfileImageUri(profileData.profile_picture);

            })
            .catch(profileError => {
              console.error('API Error:', profileError);
              alert('Error fetching user profile');
            });
        }
      } catch (error) {
        console.error('Error retrieving auth token:', error);
      }
    };
  
    retrieveAuthToken();
  }, []);
  



  useEffect(() => {
    if (userInfo.token) {
      axios
        .get(`${ipAddress}/api/get-user-profile/`, {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        })
        .then(response => {
          console.log('API Response:', response.data);
          const profileData = response.data;

          // Set user info in UserContext
          setUserInfo(prevUserInfo => ({
            ...prevUserInfo,
            ...profileData,
            profileImageUrl: profileData.profile_picture, // Set the profileImageUrl based on the API response
          }));
        
     
        })
        .catch(error => {
          console.error('API Error:', error);
          if (error.response && error.response.status === 401) {
            alert('Authentication failed. Please log in again.');
          } else {
            alert('Error fetching user profile');
          }
        });
    }
  }, [userInfo.token]);
  
  const updateProfileImageUri = (newUri) => {
    setProfileImageUri(newUri);
  };
  


  // Add a function to update user profile
  const updateUserProfile = (updatedProfile) => {
    setUserInfo(prevUserInfo => ({
      ...prevUserInfo,
      firstName: updatedProfile.first_name,
      lastName: updatedProfile.last_name,
      mobileNumber: updatedProfile.phone_number,
      profileImageUrl: updatedProfile.profile_picture, // Update the profile image URL
    }));
  };

  
 

  useEffect(() => {
    console.log('Profile Image URL in context:', userInfo.profileImageUrl);
  }, [userInfo.profileImageUrl]);
  
  

  return (
    <UserContext.Provider 
        value={{ 
            userInfo,
            setUserInfo,
            profileImageUri,
            updateUserProfile,
            updateProfileImageUri,
        }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  return useContext(UserContext);
};
