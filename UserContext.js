// UserContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ipAddress } from './constants';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [isFirstTimeSignup, setIsFirstTimeSignup] = useState(false);

  const [savingsGoal, setSavingsGoal] = useState({
      preferred_asset: '',
      savings_goal_amount: '',
      time_period: '',
  }); // New savings goal state
  const [profileImageUri, setProfileImageUri] = useState('');
  const [userInfo, setUserInfo] = useState({
    is_first_time_signup: false, // Initialize with false
    id: '', // Add the 'id' field to store the user's ID

    firstName: '',
    lastName: '',
    mobileNumber: '',
    email: '',
    profileImageUrl: '', // Initialize with an empty string or default image URL
    token: '', // Initialize with an empty string

    preferred_asset: '',
    savings_goal_amount: '',
    time_period: '',
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
              console.log('API Response (from API):', profileResponse.data);
              const profileData = profileResponse.data;
  
              if (profileResponse.data.is_first_time_signup) {
                setGoalModalVisible(true); // Open the modal
              }
              // Set user info in UserContext
              setUserInfo(prevUserInfo => ({
                ...prevUserInfo,
                ...profileData,
                id: profileData.id, // Include the user's ID
                profileImageUrl: profileData.profile_picture
                  ? ipAddress + profileData.profile_picture
                  : null, // Handle no profile picture case

              }));
  
              setSavingsGoal({
                preferred_asset: profileData.preferred_asset,
                savings_goal_amount: profileData.savings_goal_amount,
                time_period: profileData.time_period,
              });
  
              // Set the profileImageUri in the context as well
              setProfileImageUri(
                profileData.profile_picture
                  ? ipAddress + profileData.profile_picture
                  : null // Handle no profile picture case
              );
              


            })
            .catch(profileError => {
              console.error('API Error:', profileError);
              alert('Error fetching user profile');
            });
        }
      } catch (error) {
        console.error('Error retrieving auth token (not API error):', error);
      }
    };
  
    retrieveAuthToken();
  }, []);
  







  

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
    }));
  };


  useEffect(() => {
     // Check if the user is a first-time signup
  if (userInfo && userInfo.is_first_time_signup) {
    setIsFirstTimeSignup(true);
  }
    console.log('Profile Image URL in context:', userInfo.profileImageUrl);
  }, [userInfo, userInfo.profileImageUrl]);
  
  

  

  return (
    <UserContext.Provider 
        value={{ 
            userInfo,setUserInfo,
            updateUserProfile, 
            profileImageUri, updateProfileImageUri,
            savingsGoal, setSavingsGoal
        }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  return useContext(UserContext);
};
