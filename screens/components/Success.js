import React, { useState, useEffect } from 'react';
import { Text, View, TouchableOpacity, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Modal from 'react-native-modal';

const Success = ({ isVisible, onClose, navigation }) => {
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
    <Modal
      isVisible={isVisible}
      backdropOpacity={0.6}
      style={styles.modal}
      onBackdropPress={onClose}
      animationIn="slideInUp" // Slide in from bottom animation
      animationOut="slideOutDown" // Slide out to bottom animation
      useNativeDriver={true}
    >
      <View style={styles.modalContent}>
        <View style={styles.modalHeaderContainer}>
          <Text style={styles.modalHeader}>Success!</Text>
          <Ionicons
            name="close-outline"
            size={24}
            color="grey"
            onPress={onClose}
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
            onPress={() => {
              onClose(); // Close the modal
            }}
          >
            <Text style={styles.primaryButtonText}>OK</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = {
  modal: {
    margin: 0,
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#F6F3FF',
    borderTopRightRadius: 25,
    borderTopLeftRadius: 25,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    padding: 20,
  },
  modalHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
    alignItems: 'center',
  },
  buttonContainer: {
    marginTop: 10,
    alignSelf: 'center',
    width: '85%',
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
