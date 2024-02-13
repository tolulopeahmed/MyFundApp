import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet } from 'react-native';

const FloatingLabelInput = ({ label, value, onChangeText }) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    if (!value) {
      setIsFocused(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.label, isFocused || value ? styles.labelFocused : null]}>{label}</Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
    width: '90%',
  },
  label: {
    fontSize: 16,
    color: 'gray',
    position: 'absolute',
    marginLeft: 60,
    zIndex: 1,
    marginTop: 10,
  },
  labelFocused: {
    position: 'absolute',
    top: 0,
    left: 0,
    fontSize: 8,
    marginTop: 1.5,
    color: 'grey', // Color when focused
  },
  input: {
    fontSize: 17,
    height: 45,
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'green',
    paddingLeft: 59,
    paddingTop: 5,
  },
});

export default FloatingLabelInput;
