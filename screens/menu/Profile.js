import React, { useState } from 'react';
import { View, Text, Switch, StyleSheet, ScrollView, Pressable, SafeAreaView, TouchableOpacity, Image } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import * as ImagePicker from 'expo-image-picker';
import { MaterialIcons } from '@expo/vector-icons';
import Divider from '../components/Divider';
import SavingsGoalModal from './SavingsGoalModal';
import ProfileEditModal from './ProfileEditModal';


const Profile = ({ navigation, setProfileImageUri, }) => {
  const [imageUri, setImageUri] = useState(null);
  const [enableFingerprint, setEnableFingerprint] = useState(false);
  const [showMyFundInDollars, setShowMyFundInDollars] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [goalModalVisible, setGoalModalVisible] = useState(false); // define modalVisible state
  const [profileEditModalVisible, setProfileEditModalVisible] = useState(false); // define modalVisible state
  const [profile, setProfile] = useState({
    firstName: 'Tolulope',
    lastName: 'Oladimeji',
    mobileNumber: '+2348012345678',
    email: 'name@gmail.com',
  });
  

  const updateProfile = (updatedInfo) => {
    setProfile(updatedInfo);
  };  


  const handlePickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status === 'granted') {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
        });
      if (!result.canceled) {
        setImageUri(result.uri);
        setProfileImageUri(result.uri);

      }
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
    navigation.navigate('Login');
  }

  const handleEditProfile = () => {
    setProfileEditModalVisible(true); // Open the ProfileEditModal
  };

  const handleProfileEditModalClose = (updatedProfile) => {
    setProfileEditModalVisible(false); // Close the ProfileEditModal
    setProfile(updatedProfile); // Update the profile state with the new values
  };
  
  


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
    <View style={styles.imageContainer}>
      <Pressable>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.image} onPress={handlePickImage} />
        ) : (
          <Ionicons name="person-circle" size={160} color="silver" onPress={handlePickImage} />
        )}
      </Pressable>
    </View>
    <Text style={styles.nameText}>{profile.firstName}</Text>
    <Text style={styles.usernameText}>{profile.email}</Text>
  </View>

  <View style={styles.rightContainer}>
  <View style={styles.buttonsContainer1}>
  <TouchableOpacity style={styles.secondaryButton} onPress={handlePickImage}>
  <MaterialIcons name="edit" size={14} color="#4C28BC" style={{ marginRight: 7 }}/>
    <Text style={styles.secondaryButtonText}>Picture</Text>
  </TouchableOpacity>
  <TouchableOpacity style={styles.primaryButton} onPress={handleEditProfile}>
  <MaterialIcons name="edit" size={14} color="white" style={{ marginRight: 7 }}/>
    <Text style={styles.primaryButtonText}>Profile</Text>
  </TouchableOpacity>
  </View>
    <Text style={styles.infoText}>Full Name</Text>
    <Text style={styles.infoText2}>{updateProfile.firstName} {updateProfile.lastName}</Text>
    <Text style={styles.infoText}>Mobile Number</Text>
    <Text style={styles.infoText2}>{updateProfile.mobileNumber}</Text>
    <Text style={styles.infoText}>Email</Text>
    <Text style={styles.infoText2}>{updateProfile.email}</Text>
    <Text style={styles.infoText}>Points</Text>
    <Text style={styles.infoText2}>88888</Text>
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
        <Text style={styles.settingText}>Show MyFund in Dollars</Text>
        <Switch
          trackColor={{ false: 'grey', true: '#4C28BC' }}
          thumbColor={showMyFundInDollars ? '#8976FF' : 'silver'}
          ios_backgroundColor="#3e3e3e"
          onValueChange={() => setShowMyFundInDollars(!showMyFundInDollars)}
          value={showMyFundInDollars}
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
        setGoalModalVisible={setGoalModalVisible} />

<View>
<View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={() => setGoalModalVisible(true)}>
          <Ionicons name="save" size={24} color="#4C28BC" style={{ marginRight: 15 }} />
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
          <Ionicons name="document" size={24} color="#4C28BC" style={{ marginRight: 15 }} />
          <Text style={styles.buttonText}>Update KYC</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button}>
          <Ionicons name="wallet" size={24} color="#4C28BC" style={{ marginRight: 15 }} />
          <Text style={styles.buttonText}>Redeem Points</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('FAQ')}>
          <MaterialIcons name="forum" size={24} color="#4C28BC" style={{ marginRight: 15 }} />
          <Text style={styles.buttonText}>FAQs</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button}>
          <Ionicons name="chatbubbles" size={24} color="#4C28BC" style={{ marginRight: 15 }} />
          <Text style={styles.buttonText}>Chat Admin</Text>
        </TouchableOpacity>
      </View>

      

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button}>
          <Ionicons name="star" size={24} color="#4C28BC" style={{ marginRight: 15 }} />
          <Text style={styles.buttonText}>Rate MyFund</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleLogout}>
          <Ionicons name="exit" size={24} color="brown" style={{ marginRight: 15 }}/>
          <Text color='brown' style={styles.buttonText}>Log Out</Text>
        </TouchableOpacity>
      </View>
      </View>
      
      <Divider />
      <Text style={styles.credits}>MyFund</Text><Text style={{fontSize: 10,     marginBottom: 22, textAlign: 'center', fontFamily: 'karla'}}>version 1.0.0</Text>

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
    alignItems: 'flex-start',
    backgroundColor: '#F5F1FF',
  },

  image: {
    marginTop: 6,
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 3,
    borderColor: 'white',
  },
  nameText: {
    fontFamily: 'proxima',
    fontSize: 28,
    textAlign: 'center',
    color: '#4C28BC',
    backgroundColor: '#F5F1FF',
  },
  usernameText: {
    fontFamily: 'karla',
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
    fontFamily: 'karla',
    fontSize: 16,
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
    flex: 0.4,
    height: 25,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
  
  },

  primaryButtonText: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'ProductSans',
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
});

export default Profile;

