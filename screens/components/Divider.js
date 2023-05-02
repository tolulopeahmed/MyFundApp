import React from 'react';
import { View } from 'react-native';

const Divider = () => {
  return (
    <View
      style={{
        marginTop: 15,
        marginBottom: 20,
        alignSelf: 'center',
        width: '90%',
        borderBottomWidth: 0.4,
        borderBottomColor: 'gray',
        borderBottomStyle: 'solid',
        marginVertical: 10,
      }}
    />
  );
};

export default Divider;
