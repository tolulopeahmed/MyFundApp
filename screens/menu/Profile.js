import React, { useState, useEffect, useContext } from 'react';
import { View, Text, Alert, Linking, Switch, StyleSheet, ScrollView, Pressable, SafeAreaView, TouchableOpacity, Image } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import * as ImagePicker from 'expo-image-picker';
import { MaterialIcons } from '@expo/vector-icons';
import Divider from '../components/Divider';
import SavingsGoalModal from './SavingsGoalModal';
import PinModal from '../components/PinModal';
import ProfileEditModal from './ProfileEditModal';
import axios from 'axios';  // Import axios for making API requests
import { ipAddress } from '../../constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SectionTitle from '../components/SectionTitle';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUserData, setProfileImageUri } from '../../ReduxActions';
import { useIsFocused } from '@react-navigation/native';

const Profile = ({ navigation, route }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [enableFingerprint, setEnableFingerprint] = useState(false);
  const [showBalances, setShowBalances] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [goalModalVisible, setGoalModalVisible] = useState(false); // define modalVisible state
  const [pinModalVisible, setPinModalVisible] = useState(false); // define modalVisible state

  const [profileEditModalVisible, setProfileEditModalVisible] = useState(false); // define modalVisible state
  const [profile, setProfile] = useState({});
  const userInfo = useSelector((state) => state.bank.userInfo);
  const dispatch = useDispatch(); // Get the dispatch function from Redux
  const profileImageUri = useSelector((state) => state.bank.profileImageUri);
  const isFocused = useIsFocused();



  useEffect(() => {
    if (userInfo.token) {
      dispatch(fetchUserData(userInfo.token));
    }
  }, [dispatch, userInfo.token]);

  
  
  useEffect(() => {
    if (route.params?.goalModalVisible) {
        setGoalModalVisible(true);
    }
}, [route.params?.goalModalVisible]);
  
  const handleRateMyFund = () => {
    const buyNowUrl = 'https://bit.ly/Vback';
    Linking.openURL(buyNowUrl);
  };


  const handlePickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  
    if (status === 'granted') {
      try {
        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 1,
        });
  
        if (!result.canceled) {
          const selectedAsset = result.assets[0];
  
          const formData = new FormData();
          formData.append('profile_picture', {
            uri: selectedAsset.uri,
            name: 'profile_picture.jpg',
            type: 'image/jpeg',
          });
  
          try {
            const response = await axios.patch(
              `${ipAddress}/api/profile-picture-update/`,
              formData,
              {
                headers: {
                  Authorization: `Bearer ${userInfo.token}`,
                  'Content-Type': 'multipart/form-data',
                },
              }
            );
  
            if (response.status === 200) {
              Alert.alert('Success', 'Profile picture updated successfully');
              console.log('New profile image URI:', selectedAsset.uri);
  
              setSelectedImage(selectedAsset.uri); // Update the selectedImage state
  
              // Dispatch the action to update the profile image URI in Redux
              dispatch(setProfileImageUri(selectedAsset.uri));
  
            } else {
              Alert.alert('Error', response.data.message); // Assuming the API returns an error message in the 'message' field
            }
          } catch (error) {
            Alert.alert('Error', 'An error occurred while updating the profile picture');
            console.error('API Request Error:', error);
          }
        }
      } catch (error) {
        Alert.alert('Error', 'Failed to access the image library');
        console.error('Image Picker Error:', error);
      }
    } else {
      Alert.alert('Permission Denied', 'You need to grant permission to access the image library');
    }
  };
  
    
  


  const darkModeStyles = StyleSheet.create({
    container: {
      backgroundColor: '#303030',
    },
    text: {
      color: 'white',
    },
    whiteBackground: {
      backgroundColor: '#303030',
    },
  });




  const handleLogout = () => {
    Alert.alert(
      'Confirm Logout',
      'Are you sure you want to log out of MyFund?',
      [
        {
          text: 'No',
          style: 'cancel',
        },
        {
          text: 'Yes, Logout',
          onPress: async () => {
            try {
              // Make an API call to log the user out
              await AsyncStorage.removeItem('authToken');
              await AsyncStorage.removeItem('profileImageUri');
  
              const keys = await AsyncStorage.getAllKeys();
                for (const key of keys) {
                  if (key.startsWith('chatMessages')) {
                    await AsyncStorage.removeItem(key);
                  }
                }

              try {
                
                // Attempt to send a logout request
                const response = await axios.post(`${ipAddress}/api/logout/`);
                
                if (response.status === 200) {
                  // Successfully logged out
                  navigation.reset({
                    index: 0,
                    routes: [{ name: 'Login' }],
                  });

                } else {
                  // Handle error cases
                  console.log('Logout failed:', response.data);
                }
              } catch (error) {
                // Handle logout request error
                console.log('Logout request error:', error);
  
                // Check if the error is due to a network issue
                if (error.message === 'Network Error') {
                  Alert.alert(
                    'Logout Failed',
                    'There was a problem logging you out. Please check your internet connection and try again.',
                    [
                      {
                        text: 'OK',
                      },
                    ]
                  );
                }
              }
            } catch (error) {
              console.log('Logout error:', error);
            }
          },
        },
      ],
      { cancelable: false }
    );
  };
  


  const handleEditProfile = () => {
    setProfileEditModalVisible(true); // Open the ProfileEditModal
  };


  const handleProfileEditModalClose = () => {
    setProfileEditModalVisible(false); // Close the ProfileEditModal
  };
  


  // Update the showBalances state when the switch is toggled
  const handleToggleShowBalances = async () => {
    try {
      // Toggle the showBalances state
      setShowBalances(!showBalances);
  
      // Save the showBalances setting to AsyncStorage
      await AsyncStorage.setItem('showBalances', showBalances ? 'true' : 'false');
    } catch (error) {
      console.error('Error saving showBalances setting:', error);
    }
  };


  
  
  console.log('Profile Image URI from update:', profileImageUri);
  console.log('Profile Image URL from Redux:', userInfo.profileImageUrl);
  console.log('userInfo.token-', userInfo.token);


  


  return (
   <View style={[styles.container, darkMode && darkModeStyles.container]}>

<View style={styles.header}>
      <TouchableOpacity onPress={() => navigation.toggleDrawer()}>
        <Ionicons name="menu-outline" size={30} color="#4C28BC" />
      </TouchableOpacity>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>MORE...</Text>
      
        </View>
    </View>

          <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

          <View style={styles.profileContainer}>

   

  <View flexDirection='row'>
  <View style={styles.leftContainer}>
  
  <View style={{marginTop: 10, alignSelf: 'flex-start', marginLeft: -28}}>
  <SectionTitle>PROFILE</SectionTitle>
  </View>
  <View style={styles.imageContainer}>
  <Pressable onPress={handlePickImage}>

  <Image
        source={
          selectedImage
            ? { uri: selectedImage } // Use selected image if available
            : userInfo.profileImageUrl
            ? { uri: userInfo.profileImageUrl } // Use profile picture URL if available
            : require('./Profile1.png') // Use a default image if both are null
        }
        style={styles.image}
      />



    
      <View style={styles.editIconContainer}>
        <Pressable onPress={handlePickImage}>
          <MaterialIcons name="edit" size={20} color="#fff" />
        </Pressable>
      </View>
    
  </Pressable>
</View>



    <Text style={styles.nameText}>{userInfo.firstName}</Text>
    <Text style={styles.usernameText}>{userInfo.email}</Text>
  </View>

  <View style={styles.rightContainer}>
  <View style={styles.buttonsContainer1}>
  <TouchableOpacity style={styles.primaryButton} onPress={handleEditProfile}>
  <MaterialIcons name="edit" size={14} color="white" marginLeft={10}/>
    <Text style={styles.primaryButtonText}>Update Profile</Text>
  </TouchableOpacity>
  </View>
  <Text style={styles.infoText}>Full Name</Text>
<Text style={styles.infoText2}>{userInfo.firstName} {userInfo.lastName}</Text>
<Text style={styles.infoText}>Mobile Number</Text>
<Text style={styles.infoText2}>+234{userInfo.mobileNumber}</Text>
<Text style={styles.infoText}>Email/Username</Text>
<Text style={styles.infoText3}>{userInfo.email}</Text>
<Text style={styles.infoText}>Points</Text>
<Text style={styles.infoText3}>Coming Soon</Text>

  </View>
  </View>
</View>

{profileEditModalVisible && (
 <ProfileEditModal
 navigation={navigation}
 profile={profile}
 setProfile={setProfile}
 profileEditModalVisible={profileEditModalVisible}
 setProfileEditModalVisible={setProfileEditModalVisible}
 onClose={handleProfileEditModalClose} // Pass the onClose function
 dispatch={dispatch} // Pass the dispatch function

 />

)}




      <Divider/>
      
     <View style={styles.settingsContainer}>
      <View style={styles.settingContainer}>
        <Text style={styles.settingText}>Enable Fingerprint</Text>
        <Switch
          trackColor={{ false: 'grey', true: '#4C28BC' }}
          thumbColor={enableFingerprint ? '#8976FF' : 'silver'}
          ios_backgroundColor="#3e3e3e"
          onValueChange={() => setEnableFingerprint(!enableFingerprint)}
          value={enableFingerprint}
        />
      </View>


      <View style={styles.settingContainer}>
        <Text style={styles.settingText}>Show/Hide Balances</Text>
        <Switch
          trackColor={{ false: 'grey', true: '#4C28BC' }}
          thumbColor={showBalances ? '#8976FF' : 'silver'}
          ios_backgroundColor="#3e3e3e"
          onValueChange={handleToggleShowBalances}
          value={showBalances}
        />
      </View>


      <View style={styles.settingContainer}>
        <Text style={styles.settingText}>Turn on Dark Mode</Text>
        <Switch
          trackColor={{ false: 'grey', true: '#4C28BC' }}
          thumbColor={darkMode ? '#8976FF' : 'silver'}
          ios_backgroundColor="#3e3e3e"
          onValueChange={() => setDarkMode(!darkMode)}
          value={darkMode}
        />
      </View>
      </View>
    
      <SavingsGoalModal 
        navigation={navigation} 
        goalModalVisible={goalModalVisible} 
        setGoalModalVisible={setGoalModalVisible} 
        dispatch={dispatch} // Pass the dispatch function
        />

{pinModalVisible && (
        <PinModal 
        navigation={navigation} 
        pinModalVisible={pinModalVisible} 
        setPinModalVisible={setPinModalVisible} 
        />
)}

    

<SectionTitle>SETTINGS</SectionTitle>
<View>
<View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={() => setGoalModalVisible(true)}>
          <MaterialIcons name="flag" size={25} color="#4C28BC" style={{ marginRight: 15 }} />
          <Text style={styles.buttonText}>Savings Goal Settings</Text>
        </TouchableOpacity>
        </View>
        
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Card')}>
          <Ionicons name="card" size={24} color="#4C28BC" style={{ marginRight: 15 }} />
          <Text style={styles.buttonText}>Bank and Card Settings</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('KYC')}>
          <Ionicons name="shield-checkmark" size={24} color="#4C28BC" style={{ marginRight: 15 }} />
          <Text style={styles.buttonText}>Update KYC</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={() => setPinModalVisible(true)}>
          <MaterialIcons name="lock" size={24} color="#4C28BC" style={{ marginRight: 15 }} />
          <Text style={styles.buttonText}>Set PIN</Text>
        </TouchableOpacity>
      </View>
 
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('TopSavers')}>
          <MaterialIcons name="leaderboard" size={24} color="#4C28BC" style={{ marginRight: 15 }} />
          <Text style={styles.buttonText}>Top Savers</Text>
        </TouchableOpacity>
      </View>
 
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('FAQ')}>
          <MaterialIcons name="forum" size={24} color="#4C28BC" style={{ marginRight: 15 }} />
          <Text style={styles.buttonText}>FAQs</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Chat')}>
          <Ionicons name="chatbubbles" size={24} color="#4C28BC" style={{ marginRight: 15 }} />
          <Text style={styles.buttonText}>Message Admin</Text>
        </TouchableOpacity>
      </View>

      

     

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleRateMyFund}>
          <Ionicons name="star" size={24} color="#4C28BC" style={{ marginRight: 15 }} />
          <Text style={styles.buttonText}>Rate MyFund</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.buttonContainer}>
      <TouchableOpacity style={styles.button} onPress={handleLogout}>
  <MaterialIcons name="logout" size={24} color="brown" style={{ marginRight: 15 }}/>
  <Text color='brown' style={styles.buttonText}>Log Out</Text>
</TouchableOpacity>
      </View>
      </View>
      
      <View marginTop={10}>
        <Divider />
        </View>


        <View style={styles.logoContainer}>
  <Image source={require('../images/MyFundlogo.png')} style={styles.logo} />
  <View style={styles.creditsContainer}>
    <Text style={styles.version}>version 1.0.0</Text>
  </View>
</View>

    </ScrollView>
    </View> 
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F1FF',
  },

  header: {
    marginTop: 50,
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingHorizontal: 15,
  backgroundColor: 'white',
  height: 43,
},
icon: {
  marginRight: 0,
},

  headerContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',

    },
 
    headerText:{
    flex: 1,
    color: 'silver',
    alignSelf: 'center',
    marginLeft: 15,
    fontFamily: 'karla',
    letterSpacing: 3,
    },

    person: {
        borderWidth: 1.5,
        padding: 4.5,
        borderRadius: 80,
        borderColor: '#4C28BC',
        height: 35,
        width: 35,
        alignSelf: 'center',
        alignItems: 'center',
        alignContent: 'center'
    },

    bell: {
        marginLeft: 6,
        borderWidth: 1.5,
        borderColor: '#4C28BC',
        padding: 4.5,
        height: 35,
        width: 35,
        borderRadius: 80,
        alignSelf: 'center',
        alignItems: 'center',
        alignContent: 'center'
    },

  
  leftContainer: {
    width: "40%",
    marginLeft: 30,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },

  profileContainer: {
    backgroundColor: '#F5F1FF',
  },

  imageContainer: {
    marginBottom: 10,
    alignItems: 'flex-start',
    backgroundColor: '#F5F1FF',
    resizeMode: 'cover',
    borderRadius: 150,
    width: 160,
    height: 160,
  },

  image: {
    marginTop: 10,
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 3,
    borderColor: 'white',
  },

  editIconContainer: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: '#4C28BC',
    borderRadius: 20,
    padding: 5,
    elevation: 2,
  },

  nameText: {
    fontFamily: 'proxima',
    fontSize: 28,
    textAlign: 'center',
    color: '#4C28BC',
    backgroundColor: '#F5F1FF',
    letterSpacing: -1,
  },
  usernameText: {
    fontFamily: 'karla-italic',
    fontSize: 12,
    letterSpacing: -0.5,
    color: 'gray',
    textAlign: 'center',
    color: '#4C28BC',
    backgroundColor: '#F5F1FF',
  },
  rightContainer: {
    flex: 1,
    marginRight: 20,
    alignItems: 'flex-end',
    justifyContent: 'flex-start',
  },

  infoText: {
    fontFamily: 'proxima',
    fontSize: 11,
    color: 'silver',
    textAlign: 'left',
    letterSpacing: -0.5,
  },

  infoText2: {
    fontFamily: 'karla-italic',
    fontSize: 16,
    marginBottom: 10,
    color: '#4C28BC',
    letterSpacing: -0.5,
  },

  infoText3: {
    fontFamily: 'karla-italic',
    fontSize: 14.5,
    marginBottom: 10,
    color: '#4C28BC',
    letterSpacing: -0.5,
  },

  credits: {
    fontFamily: 'karla',
    fontSize: 12,
    letterSpacing: -0.5,
    color: 'gray',
    textAlign: 'center',
    color: 'grey',
    backgroundColor: '#F5F1FF',
    marginBottom: 2,
  },

  settingsContainer:{
    marginTop: 20,
    marginBottom: 20,

  },

  settingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 25,
    marginTop: -14,
  },
  settingText: {
    fontFamily: 'ProductSans',
    letterSpacing: -0.1,
    fontSize: 16,
    marginLeft: 10,
  },

  buttonsContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  buttonContainer: {
    alignItems: 'center',
    marginTop: 13,
  },
  button: {
    flexDirection: 'row',
  borderColor: 'silver',
  backgroundColor: 'white',
  height: 45,
  width: '90%',
  padding: 8,
  borderWidth: 1,
  borderRadius: 9,
  },
  buttonText: {
    marginTop: 5,
   fontSize: 16,
    fontFamily: 'ProductSans',
    color: '#4C28BC',
    flex: 1,
  },

  buttonsContainer1: {
    flexDirection: 'row',
    marginTop: 10,
    position: 'relative',
    marginBottom: 10,
    alignSelf: 'flex-end',
  },


  primaryButton: {
    flexDirection: 'row',
    backgroundColor: '#4C28BC',
    height: 25,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    marginTop: 25,
  },

  primaryButtonText: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'ProductSans',
    paddingHorizontal: 10,
  },

  
  secondaryButton: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    flex: 0.4,
    height: 25,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    marginRight: 5,
    borderWidth: 0.5,
    borderColor: '#4C28BC',
  
  },

  secondaryButtonText: {
    color: '#4C28BC',
    fontSize: 14,
    fontFamily: 'ProductSans',
  },

  logoContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    alignSelf: 'center',
    alignContent: 'center',
  },
  logo: {
  width: 90, // Adjust the width as needed
  height: 25, // Adjust the height as needed
    marginRight: 10,
    resizeMode: 'contain',

  },
  creditsContainer: {
    flexDirection: 'column',
  },
  
  version: {
    fontSize: 10,
    fontFamily: 'karla',
    textAlign: 'center',
    marginBottom: 15,

  },
});

export default Profile;

