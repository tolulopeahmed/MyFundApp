import React, { useRef, useEffect, useState } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, Text } from 'react-native';
import Onboarding1 from './Onboarding1';
import Onboarding2 from './Onboarding2';
import Onboarding3 from './Onboarding3';
import { PrimaryButton, SecondaryButton } from '../components/MainButtons';


const OnboardingScreens = ({ navigation }) => {
  const scrollViewRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const nextPage = currentPage < 2 ? currentPage + 1 : 0;
      setCurrentPage(nextPage);
      scrollViewRef.current.scrollTo({ x: nextPage * 375 });
    }, 5000);
    return () => clearInterval(interval);
  }, [currentPage]);

  return (
    <View style={styles.container}>
        <TouchableOpacity style={styles.skipButton} onPress={() => navigation.navigate('Login')}>
        <Text style={styles.skipButtonText}>SKIP</Text>
      </TouchableOpacity>
      <View style={styles.content}>
        <ScrollView
          ref={scrollViewRef}
          horizontal={true}
          pagingEnabled={true}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ width: 1200 }}
          onMomentumScrollEnd={(event) => {
            const pageNumber = Math.round(event.nativeEvent.contentOffset.x / 375);
            setCurrentPage(pageNumber);
          }}
        >
          <Onboarding1 />
          <Onboarding2 />
          <Onboarding3 />
        </ScrollView>

        <View style={styles.buttonContainer}>
          <PrimaryButton title="CREATE ACCOUNT" onPress={() => navigation.navigate('CreateAccount')} />
          <SecondaryButton title="LOG IN" onPress={() => navigation.navigate('Login')} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#DCD1FF',
  },
  content: {
    flex: 1,
  },

  skipButton: {
   alignItems: 'center',
   marginTop: 70,
   marginLeft: 300,

  },
  skipButtonText: {
    fontSize: 18,
    color: '#4C28BC',
    fontFamily: 'proxima',
  },

  buttonContainer: {
    alignItems: 'center',
    marginBottom: 45,
  }

});

export default OnboardingScreens;
