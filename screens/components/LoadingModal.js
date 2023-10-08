import React, { useState, useEffect } from 'react';
import { Modal, Text, ActivityIndicator, View, StyleSheet } from 'react-native';

const LoadingModal = ({ visible }) => {
  const [ellipses, setEllipses] = useState(''); // State to store the ellipses

  useEffect(() => {
    // Function to update the ellipses
    const updateEllipses = () => {
      setEllipses((prevEllipses) => {
        if (prevEllipses === '...') {
          return '';
        } else {
          return prevEllipses + '.';
        }
      });
    };

    // Start the animation with a delay and repeat every second
    const interval = setInterval(updateEllipses, 1000);

    return () => {
      // Cleanup the interval when the component unmounts
      clearInterval(interval);
    };
  }, []);

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
    >
      <View style={styles.modalContainer}>
        <Text style={styles.waitText}>Please wait{ellipses}</Text>
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
  waitText: {
    color: '#fff',
    fontSize: 14,
    marginBottom: 20, 
    fontFamily: 'nexa',
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
