// ImageContext.js
import React, { createContext, useState } from 'react';

const ImageContext = createContext({
  profileImageUri: null,
  setProfileImageUri: () => {},
  selectedImage: null, // Add selectedImage to the context
  setSelectedImage: () => {}, // Add setSelectedImage to the context
});



export const ImageProvider = ({ children }) => {
  const [profileImageUri, setProfileImageUri] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null); // Initialize selectedImage state


  return (
    <ImageContext.Provider value={{ profileImageUri, setProfileImageUri, selectedImage, setSelectedImage }}>
      {children}
    </ImageContext.Provider>
  );
};

export default ImageContext;
