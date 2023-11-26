import React from 'react';
import { TouchableOpacity, Text, Dimensions, StyleSheet } from 'react-native';
import { useTheme } from '../../ThemeContext';

const { width } = Dimensions.get('window');



export const PrimaryButton = ({ title, onPress }) => {
  const { isDarkMode, colors } = useTheme(null);
  const styles = createStyles(isDarkMode);

  return (
    <TouchableOpacity style={styles.primaryButton} onPress={onPress}>
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
};

export const SecondaryButton = ({ title, onPress }) => {
  const { isDarkMode, colors } = useTheme(null);
  const styles = createStyles(isDarkMode);
  
  return (
    <TouchableOpacity style={styles.secondaryButton} onPress={onPress}>
      <Text style={[styles.buttonText, { color: '#4C28BC' }]}>{title}</Text>
    </TouchableOpacity>
  );
};


const createStyles = (isDarkMode) => {
  return StyleSheet.create({
    primaryButton: {
    backgroundColor: '#4C28BC',
    width: width * 0.7,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
    marginBottom: 17,
  },
  secondaryButton: {
    backgroundColor: isDarkMode ? '#DCD1FF' : '#fff',
    width: width * 0.7,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#4C28BC',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'proxima',
  },
});
}
