import React, { useState, useEffect } from 'react';
import { Modal, Alert, Text, StyleSheet, ActivityIndicator, View, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Divider from '../components/Divider';
import axios from 'axios';
import { ipAddress } from '../../constants';
import { useSelector } from 'react-redux';
import LoadingModal from '../components/LoadingModal';

const DeactivateAutoSaveModal = ({ navigation, frequency, deactivateAutoSaveModalVisible, onConfirm, setDeactivateAutoSaveModalVisible, setAutoSave }) => {
  const userInfo = useSelector((state) => state.bank.userInfo);
  const [isLoading, setIsLoading] = useState(false); // State to manage loading indicator


  const closeModal = () => {
    setDeactivateAutoSaveModalVisible(false);
  };


  console.log('Autosave Frequency:', frequency);





  const handleConfirmDeactivateAutoSave = async () => {
    setIsLoading(true); // Start loading indicator

    try {
      const response = await axios.post(`${ipAddress}/api/deactivate-autosave/`, {
        frequency: frequency,
      }, {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      });

      if (response.status === 200 && response.data.message === 'AutoSave deactivated') {
        setAutoSave(false);
        setDeactivateAutoSaveModalVisible(false);

        // Show an alert confirming AutoSave deactivation
        Alert.alert('AutoSave Deactivated!', 'Your AutoSave has been deactivated successfully.');
      }
    } catch (error) {
      console.error('Error deactivating AutoSave:', error);
      // Handle error, display a message to the user, or log it as needed
    } finally {
      setIsLoading(false); // Stop loading indicator
     }
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
              <Text style={styles.modalHeader}>Deactivate AutoSave?</Text>
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
                <Text style={styles.primaryButtonText}>Yes, Deactivate!</Text>
              </TouchableOpacity>
            </View>

          </View>
        </TouchableOpacity>
      </TouchableOpacity>

      <LoadingModal visible={isLoading} />

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
    marginBottom: 40,
    alignSelf: 'center'
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
