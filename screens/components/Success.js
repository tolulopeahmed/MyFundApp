import React, { useState, useEffect } from 'react';
import { Text, View, TouchableOpacity, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const Success = ({ navigation }) => {
  const [animation] = useState(new Animated.Value(0));

  useEffect(() => {
    startAnimation();
  }, []);

  const startAnimation = () => {
    Animated.timing(animation, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  };

  return (
    <View style={styles.modalContainer}>
      <View style={styles.modalContent}>
        <View style={styles.modalHeaderContainer}>
          <Text style={styles.modalHeader}>Success!</Text>
          <Ionicons
            name="close-outline"
            size={24}
            color="grey"
            onPress={() => navigation.goBack()}
          />
        </View>
        <Text style={styles.modalSubText}>
          Your transaction is successful 
          {'\n'}and has been updated!
        </Text>

        <Animated.View style={[styles.checkmarkContainer, { opacity: animation, transform: [{ scale: animation }] }]}>
          <Ionicons name="checkmark-circle-outline" size={170} color="green" />
        </Animated.View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.primaryButtonText}>OK</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = {
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  modalContent: {
    backgroundColor: '#F6F3FF',
    width: '85%',
    alignItems: 'center',
    borderRadius: 10,
    padding: 20,
  },
  modalHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
  },
  modalHeader: {
    fontSize: 25,
    fontFamily: 'proxima',
    color: '#4C28BC',
  },
  modalSubText: {
    fontSize: 14,
    fontFamily: 'karla',
    color: 'black',
    textAlign: 'center',
    marginHorizontal: 30,
    marginBottom: 20,
  },
  checkmarkContainer: {
    marginBottom: 20,
  },
  buttonContainer: {
    marginTop: 'auto',
    width: '95%',
    marginBottom: 10,
  },
  primaryButton: {
    backgroundColor: '#4C28BC',
    width: '100%',
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'ProductSans',
  },
};

export default Success;
