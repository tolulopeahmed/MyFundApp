import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';
import { PrimaryButton, SecondaryButton } from '../components/MainButtons';
import { useTheme } from '../../ThemeContext';

const { width, height } = Dimensions.get('window');

const Onboarding1 = ({ navigation }) => {


  const { isDarkMode, colors } = useTheme(null);
  const styles = createStyles(isDarkMode);



  
  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image source={require('./save.png')} style={styles.image} />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.header}>SAVE</Text>
        <Text style={styles.subText}>Earn <Text style={{fontFamily: 'proxima'}}>20% p.a. every 6 months</Text> and develop the saving habit to reach millions.</Text>
      </View>
    
    </View>
  );
};

const createStyles = (isDarkMode) => {
  return StyleSheet.create({
  container: {
    backgroundColor: isDarkMode ? '#140A32' : '#DCD1FF',
    padding: 30,
    width: width,
    alignContent: 'center',
    alignSelf: 'center',
    alignItems: 'center',
  },
  imageContainer: {},
  image: {
    marginTop: 10,
    width: width - 60, // Adjust the image width to fit the screen
    height: height * 0.4, // Adjust the image height to fit the screen
    resizeMode: 'contain',
  },
  textContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    fontSize: 30,
    marginTop: 1,
    marginBottom: 10,
    marginTop: 15,
    fontFamily: 'proxima',
    color: isDarkMode ? '#fff' : '#4C28BC',
  },
  subText: {
    fontSize: 16,
    fontFamily: 'karla',
    color: isDarkMode ? 'silver' : 'black',
    textAlign: 'center',
    marginRight: 20,
    marginLeft: 20,
  },

  navigationIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#BDBDBD',
    marginHorizontal: 5,
  },
  activeIndicator: {
    backgroundColor: '#4C28BC',
    width: 25,
  },
});
}
export default Onboarding1;
