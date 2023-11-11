import React from 'react';
import { Text , StyleSheet} from 'react-native';
import { useTheme } from '../../ThemeContext';



const Subtitle = ({ children }) => {
  const { isDarkMode, colors } = useTheme();
  const styles = createStyles(isDarkMode);
  
  return (
    <Text style={styles.subtitle}>
      {children}
    </Text>
  );
};

const createStyles = (isDarkMode) => {
  return StyleSheet.create({
  subtitle: {
      fontSize: 14,
      fontFamily: 'karla',
      marginLeft: 21,
      marginTop: -8,
      marginBottom: 12,
      letterSpacing: -0.5,
      color: isDarkMode ? 'silver' : 'black',
    },
});
}

export default Subtitle;
