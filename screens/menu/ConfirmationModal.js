import React, { useState } from 'react';
import { Modal, Text, animation, StyleSheet, View, TextInput, TouchableOpacity, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ConfirmationModal = ({ modalVisible, setModalVisible, navigation }) => {

  const [animation, setAnimation] = useState(new Animated.Value(0));

    return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}
    >
      <View style={styles.modalContainer} onPress={() => setModalVisible(false)} >
        <View style={styles.modalContent}>
          <Text style={styles.modalHeader}>Confirmed!</Text>
          <Text style={styles.modalSubText}>AutoSave is ON</Text>
          <Animated.View style={[styles.checkmarkContainer, { opacity: animation }]}>
            <Ionicons name="checkmark" size={170} color="green" />
          </Animated.View>          
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({

  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  modalContent: {
    backgroundColor: '#F6F3FF',
    width: '100%',
    height: '45%',
    alignItems: 'center',
    borderTopRightRadius: 25,
    borderTopLeftRadius: 25,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,      
  },

  modalHeader: {
    marginTop: 50,
    fontSize: 25,
    fontFamily: 'proxima',
    color: '#4C28BC',
  },
  modalSubText: {
    fontSize: 14,
    fontFamily: 'karla',
    color: 'black',
    textAlign: 'center',
    marginHorizontal: 40,
    marginTop: 10,
  },

});

export default ConfirmationModal;
