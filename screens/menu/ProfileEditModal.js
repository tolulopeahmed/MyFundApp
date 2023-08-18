import React, { useState, useEffect } from 'react';
import { Modal, Text, Alert, ActivityIndicator, View, TextInput, TouchableOpacity, Stylesheet } from 'react-native';
import Divider from '../components/Divider'
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';  // Import axios for making API requests
import { ipAddress } from '../../constants';
import { useUserContext } from '../../UserContext';

const ProfileEditModal = ({ navigation, profile, setProfile, profileEditModalVisible, setProfileEditModalVisible, onClose }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [updatingProfile, setUpdatingProfile] = useState(false);
  const { userInfo, setUserInfo } = useUserContext();

  
  const handleUpdateProfile = async () => {
    const updatedProfile = {
      first_name: firstName,
      last_name: lastName,
      phone_number: mobileNumber,
    };
  
    setUpdatingProfile(true);
  
    try {
      const response = await axios.patch(
        `${ipAddress}/api/update-user-profile/`,
        updatedProfile,
        {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        }
      );
  
      if (response.status === 200) {
        if (response.status === 200) {
          // Update the userInfo using the setUserInfo function from the context
          setUserInfo(prevUserInfo => ({
            ...prevUserInfo,
            first_name: updatedProfile.first_name,
            last_name: updatedProfile.last_name,
            phone_number: updatedProfile.phone_number,
          }));
      
          Alert.alert('Success', 'Profile updated successfully. Please login again to update. Do you want to do that now?', [
            {
              text: 'Yes, Logout',
              onPress: async () => {
                try {
                  // Make an API call to log the user out
                  const logoutResponse = await axios.post(`${ipAddress}/api/logout/`);
      
                  if (logoutResponse.status === 200) {
                    // Successfully logged out
                    navigation.reset({
                      index: 0,
                      routes: [{ name: 'Login' }],
                    });
                  }
                } catch (error) {
                  console.log('Logout error:', error);
                }
              },
            },
            {
              text: 'No, Later',
              onPress: () => {
                onClose();
                setProfileEditModalVisible(false);
              },
            },
          ]);
        } else {
          console.log('Profile update failed:', response.data);
        }
      };
    } catch (error) {
      console.log('Profile update error:', error);
    } finally {
      setUpdatingProfile(false);
    }
  };
  
  

    

    const closeModal = () => {
        setProfileEditModalVisible(false);
    };
    
   return (
    <>
    <Modal
      animationType="slide"
      transparent={true}
      visible={profileEditModalVisible}
      onRequestClose={closeModal}
    >

<TouchableOpacity
  style={styles.modalContainer}
  activeOpacity={1}
  onPress={closeModal}
  
>
  <TouchableOpacity
    activeOpacity={1}
    style={styles.modalContent}
    onPress={() => {}}
  >     
        <View style={styles.modalContent}>
         <View style={{flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center',  paddingLeft: 30,}}>
             <Text style={styles.modalHeader} >Edit Profile</Text>
             <Ionicons name="close-outline" size={24} color="grey" marginTop={22} paddingRight={25} onPress={() => setProfileEditModalVisible(false)}/>
         </View>
          <Divider />
        

  <View style={styles.fieldContainer2}>
    <Text style={styles.labelText}>First Name</Text>
    <View style={styles.inputContainer}>
    <TextInput
              style={styles.amountInput2}
              keyboardType="email-address"
              value={firstName}
              onChangeText={setFirstName}
            />
    </View>
</View>

<View style={styles.fieldContainer2}>
    <Text style={styles.labelText}>Last Name</Text>
    <View style={styles.inputContainer}>
    <TextInput
              style={styles.amountInput2}
              keyboardType="email-address"
              value={lastName}
              onChangeText={setLastName}
            />
    </View>
</View>


<View style={styles.fieldContainer2}>
    <Text style={styles.labelText}>Phone Number</Text>
    <View style={styles.inputContainer}>
    <TextInput
              style={styles.amountInput2}
              keyboardType="phone-pad"
              value={mobileNumber}
              onChangeText={setMobileNumber}
            />
    </View>
</View>


        
   



            <View style={styles.buttonsContainer}>
            <TouchableOpacity style={styles.primaryButton} onPress={handleUpdateProfile}>
              {updatingProfile ? (
                <ActivityIndicator color="#fff" size="small" style={{ marginRight: 10 }} />
              ) : (
                <Ionicons name="arrow-up-outline" size={24} color="#fff" marginRight={10} />
              )}
              <Text style={styles.primaryButtonText}>
                {updatingProfile ? " Updating profile..." : "Update"}
              </Text>
            </TouchableOpacity>


              </View>
        </View>
        </TouchableOpacity>
        </TouchableOpacity>

    </Modal>

    </>
  );
};

const styles = {
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
    marginTop: 20,
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
    marginHorizontal: 30,
    marginTop: 5,
    marginLeft: 15,

  },
   

  labelText: {
    fontFamily: 'proxima',
    marginLeft: 3,
    marginBottom: 5,
    textAlign: 'left',
  },

  fieldContainer3: {
    width: '100%',
  },

  fieldContainer2: {
    alignSelf: 'center',
    width: '85%',
  },

  amountInput: {
    color: 'black',
    fontFamily: 'ProductSans',
    backgroundColor: '#fff',
    height: 50,
    width: '100%',
    padding: 10,
    fontSize: 17,
    letterSpacing: 3,
    borderRadius: 5,
    marginBottom: 15,
  },

  amountInput2: {
    color: 'black',
    fontFamily: 'ProductSans',
    backgroundColor: '#E8E8E8',
    height: 40,
    width: '100%',
    padding: 10,
    fontSize: 17,
    borderRadius: 5,
    marginBottom: 15,
  },
  
  
  buttonsContainer: {
    flexDirection: 'row',
    marginTop: 15,
    position: 'relative',
    marginBottom: 35,


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

  

};

export default ProfileEditModal;
