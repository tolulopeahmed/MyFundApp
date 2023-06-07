import React, { useRef, useEffect, useState } from 'react';
import { StyleSheet, SafeAreaView, View, ScrollView, TouchableOpacity, Text, Dimensions } from 'react-native';
import Onboarding1 from './Onboarding1';
import Onboarding2 from './Onboarding2';
import Onboarding3 from './Onboarding3';
import { PrimaryButton, SecondaryButton } from '../components/MainButtons';

const { width } = Dimensions.get('window');

const OnboardingScreens = ({ navigation }) => {
  const scrollViewRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const nextPage = currentPage < 2 ? currentPage + 1 : 0;
      setCurrentPage(nextPage);
      scrollViewRef.current.scrollTo({ x: nextPage * width });
    }, 5000);
    return () => clearInterval(interval);
  }, [currentPage]);

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.skipButton} onPress={() => navigation.navigate('Login')}>
        <Text style={styles.skipButtonText}>SKIP</Text>
      </TouchableOpacity>
      <View style={styles.content}>
        <ScrollView
          ref={scrollViewRef}
          horizontal={true}
          pagingEnabled={true}
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={(event) => {
            const pageNumber = Math.round(event.nativeEvent.contentOffset.x / width);
            setCurrentPage(pageNumber);
          }}
        >
          <Onboarding1 />
          <Onboarding2 />
          <Onboarding3 />
        </ScrollView>

        <View style={styles.indicatorContainer}>
          <View style={styles.indicatorWrapper}>
            {Array.from({ length: 3 }, (_, index) => (
              <View
                key={index}
                style={[styles.dot, index === currentPage && styles.activeDot]}
              />
            ))}
          </View>
        </View>


        <View style={styles.buttonContainer}>
          <PrimaryButton title="CREATE ACCOUNT" onPress={() => navigation.navigate('CreateAccount')} />
          <SecondaryButton title="LOG IN" onPress={() => navigation.navigate('Login')} />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    alignContent: 'center',
    alignSelf: 'center',
    backgroundColor: '#DCD1FF',
    borderWidth: 0.5,
  },
  content: {
    flex: 1,
    alignContent: 'center',
    alignSelf: 'center',
    alignItems: 'center',
  },
  
  skipButton: {
    position: 'absolute',
    top: 45,
    right: 20,
    zIndex: 1,
  },
  skipButtonText: {
    fontSize: 18,
    color: '#4C28BC',
    fontFamily: 'proxima',
  },

  indicatorContainer: {
    marginBottom: 45,
    alignItems: 'center',
    width: '100%',
  },
  
  indicatorWrapper: {
    flexDirection: 'row',
  },

  dot: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#BDBDBD',
    marginHorizontal: 5,
  },
  activeDot: {
    backgroundColor: '#4C28BC',
    width: 25,
    height: 8,
    borderRadius: 5,
  },

  paginationContainer: {
    bottom: 150,
  },

  buttonContainer: {
    alignItems: 'center',
    marginBottom: 45,
  },
});

export default OnboardingScreens;
