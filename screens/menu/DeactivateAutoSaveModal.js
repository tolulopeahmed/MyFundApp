import React, { useState } from 'react';
import { Modal, Text, StyleSheet, View, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Divider from '../components/Divider';

const DeactivateAutoSaveModal = ({ deactivateAutoSaveModalVisible, setDeactivateAutoSaveModalVisible }) => {

  const closeModal = () => {
    setDeactivateAutoSaveModalVisible(false);
  };

  const handleConfirmDeactivateAutoSave = () => {
    setAutoSave(false);
    setDeactivateAutoSaveModalVisible(false);
  };
  

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={deactivateAutoSaveModalVisible}
      onRequestClose={() => setDeactivateAutoSaveModalVisible(false)}
    >
      <TouchableOpacity
        style={styles.modalContainer}
        activeOpacity={1}
        onPress={() => setDeactivateAutoSaveModalVisible(false)}

      >
        <TouchableOpacity
          activeOpacity={1}
          style={styles.modalContent}
          onPress={() => {}}
        >
          <View style={styles.modalContent}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', paddingLeft: 30 }}>
              <Text style={styles.modalHeader}>Deactivate AutoSave</Text>
              <Ionicons name="close-outline" size={24} color="grey" marginTop={22} paddingRight={25}   onPress={closeModal}/>
            </View>
            <Divider />
            <Text style={styles.modalSubText}>
              Are you sure you want to deactivate AutoSave?
            </Text>
            <View style={styles.iconContainer}>
              <Ionicons name="help-outline" size={170} color="#4C28BC" />
            </View>
            <View style={styles.buttonsContainer}>
              <TouchableOpacity style={styles.primaryButton} onPress={handleConfirmDeactivateAutoSave}>
                <Text style={styles.primaryButtonText}>Yes, Deactivate</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
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
    alignItems: 'center',
    borderTopRightRadius: 25,
    borderTopLeftRadius: 25,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  modalHeader: {
    marginTop: 30,
    alignItems: 'flex-start',
    fontSize: 25,
    fontFamily: 'proxima',
    color: '#4C28BC',
    flex: 1,
  },
  modalSubText: {
    fontSize: 14,
    fontFamily: 'karla',
    color: 'black',
    textAlign: 'left',
    marginHorizontal: 40,
    marginTop: 10,
  },
  iconContainer: {
    marginTop: 20,
    marginBottom: 30,
  },
  buttonsContainer: {
    flexDirection: 'row',
    marginTop: 10,
    position: 'relative',
    marginBottom: 35,
    alignSelf: 'center',
  },
  primaryButton: {
    flexDirection: 'row',
    backgroundColor: '#4C28BC',
    width: '85%',
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
});

export default DeactivateAutoSaveModal;
