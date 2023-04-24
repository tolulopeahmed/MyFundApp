import React from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';

const Splash = () => {
  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image style={styles.logo} source={require('./images/logo.png')} />
        <View style={styles.arrowContainer}>
        <View style={styles.arrow} />
          <Text style={[styles.text, styles.whiteText]}>Save, </Text>
          <Text style={[styles.text, styles.greyText]}>Buy Properties, </Text>
          <Text style={[styles.text, styles.whiteText]}>Earn Rent</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#4C28BC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
  },
  logo: {
    width: 150,
    height: 100,
    resizeMode: "contain",
  },
  arrowContainer: {
    flexDirection: 'row',
    marginTop: 0,
    alignItems: 'center',
  },
  arrow: {
    borderTopWidth: 7,
    borderRightWidth: 6,
    borderBottomWidth: 7,
    borderLeftWidth: 8,
    borderTopColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: 'transparent',
    borderLeftColor: '#FF9933',
    marginTop: 0,
    rotation: 180,
  },
  text: {
    fontSize: 16,
    marginBottom: 5,
    fontFamily: 'karla'
  },
  whiteText: {
    color: '#FFFFFF',
  },
  greyText: {
    color: '#CCCCCC',
  },
});

export default Splash;
