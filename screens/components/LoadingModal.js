import React from 'react';
import { Modal, Image, ActivityIndicator, View, StyleSheet } from 'react-native';

const LoadingModal = ({ visible }) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
    >
      <View style={styles.modalContainer}>
        <View style={styles.indicatorContainer}>
          <ActivityIndicator size={70} color="#fff" />
          {/* Centered Logo */}
          <View style={styles.logoContainer}>
            {/* Replace 'YourLogoImage' with the appropriate image source */}
            {/* <Image source={require('./myfundlogo.png')} style={styles.logoImage} /> */}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  indicatorContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    position: 'absolute',
    alignSelf: 'center',
    top: '50%', // Center vertically
    height: 40,
    width: 40,
    transform: [{ translateY: -40 }], // Adjust position based on logo dimensions
  },
  logoImage: {
    height: 80,
    width: 80,
    resizeMode: "cover",
  },
});

export default LoadingModal;
