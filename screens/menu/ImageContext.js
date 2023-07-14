// ImageContext.js
import React, { createContext, useState } from 'react';

const ImageContext = createContext();

export const ImageProvider = ({ children }) => {
  const [profileImageUri, setProfileImageUri] = useState(null);

  return (
    <ImageContext.Provider value={{ profileImageUri, setProfileImageUri }}>
      {children}
    </ImageContext.Provider>
  );
};

export default ImageContext;
