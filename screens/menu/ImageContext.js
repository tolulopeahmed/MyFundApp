import React, { createContext, useState, useEffect } from 'react';
import { useSelector } from 'react-redux'; // Import the useSelector hook from Redux
import AsyncStorage from '@react-native-async-storage/async-storage';

const ImageContext = createContext({
  profileImageUri: null,
  setProfileImageUri: () => {},
  selectedImage: null,
  setSelectedImage: () => {},
});

export const ImageProvider = ({ children }) => {
  const [profileImageUri, setProfileImageUri] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const userInfo = useSelector((state) => state.bank.userInfo); // Get user info from Redux

  // Fetch the profile image URI from AsyncStorage on component mount
  useEffect(() => {
    const getProfileImageUri = async () => {
      const storedUri = await AsyncStorage.getItem('profileImageUri');
      if (storedUri) {
        setSelectedImage(storedUri);
      } else if (userInfo.profileImageUrl) {
        setSelectedImage(userInfo.profileImageUrl); // Set the image from Redux if available
      } else {
        setSelectedImage('defaultImageUri'); // Set a default image URI here
      }
    };

    getProfileImageUri();
  }, [userInfo]);

  return (
    <ImageContext.Provider
      value={{ profileImageUri, setProfileImageUri, selectedImage, setSelectedImage }}
    >
      {children}
    </ImageContext.Provider>
  );
};

export default ImageContext;
