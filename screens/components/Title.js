import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { useTheme } from '../../ThemeContext';


const Title = ({ children }) => {
  const { isDarkMode, colors } = useTheme();
  const styles = createStyles(isDarkMode);

  return <Text style={styles.title}>{children}</Text>;
};

const createStyles = (isDarkMode) => {
  return StyleSheet.create({
  title: {
    fontSize: 46,
    marginLeft: 25,
    fontFamily: 'proxima',
    color: isDarkMode ? '#fff' : '#4C28BC',
    marginTop: 10,
    marginBottom: 5,
    marginLeft: 20,
    letterSpacing: -2,
  },
});
}
export default Title;
