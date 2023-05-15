import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { PrimaryButton, SecondaryButton } from '../components/MainButtons';


const Onboarding2 = ({ navigation }) => {
  return (
    <View style={styles.container}>
          <View style={styles.imageContainer}>
        <Image source={require('./landlord.png')} style={styles.image} />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.header}>BUY PROPERTIES</Text>
        <Text style={styles.subText}>Buy and own a fraction of any of our hostels across the country</Text>
      </View>
      <View style={styles.navigationIndicatorContainer}>
        <View style={styles.navigationIndicator} />
        <View style={[styles.navigationIndicator, styles.activeIndicator]} />
        <View style={styles.navigationIndicator} />
      </View>
   
     
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#DCD1FF',
    width: 400,
    padding: 30,
    alignContent: 'center',
    alignSelf: 'center',
    alignItems: 'center',
  },

  imageContainer: {
  },
  
  image: {
    marginTop: 10,
    width: 300,
    height: 300,
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
    color: '#4C28BC',

  },
  subText: {
    fontSize: 16,
    fontFamily: 'karla',
    color: 'black',
    textAlign: 'center',
    marginRight: 20,
    marginLeft: 20,
  },

  navigationIndicatorContainer: {
    marginTop: 50,
    flexDirection: 'row',
    position: 'relative',
    bottom: 10,
    color: '#4C28BC',
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

export default Onboarding2