import React from 'react';
import { Text } from 'react-native';

const Subtitle = ({ children }) => {
  return (
    <Text
      style={{
        fontSize: 14,
        fontFamily: 'karla',
        marginLeft: 21,
        marginTop: -8,
        marginBottom: 12,
        letterSpacing: -0.5
      }}
    >
      {children}
    </Text>
  );
};

export default Subtitle;
