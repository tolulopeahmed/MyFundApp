import React, { useState } from 'react';
import { View, Text, Switch, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, Image } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import * as ImagePicker from 'expo-image-picker';
import Header from '../components/Header';
import Divider from '../components/Divider';
import SavingsGoalModal from './SavingsGoalModal';


const Profile = ({ navigation, setProfileImageUri }) => {
  const [imageUri, setImageUri] = useState(null);
  const [enableFingerprint, setEnableFingerprint] = useState(false);
  const [showMyFundInDollars, setShowMyFundInDollars] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [goalModalVisible, setGoalModalVisible] = useState(false); // define modalVisible state

  const handlePickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status === 'granted') {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
        });
      if (!result.cancelled) {
        setImageUri(result.uri);
        setProfileImageUri(result.uri);

      }
    }
  };

  const handleLogout = () => {
    navigation.navigate('Login');
  }
 

  return (
   <>
          <Header navigation={navigation} headerText='PROFILE'/>
          <View style={styles.imageContainer}>
          <TouchableOpacity>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.image} onPress={handlePickImage}/>
        ) : (
          <Ionicons name="person-circle" size={120} color="silver" onPress={handlePickImage}/>
        )}
      </TouchableOpacity>
      <Text style={styles.nameText}>Tolulope</Text>
      <Text style={styles.usernameText}>ceo@myfundmobile.com</Text>
      <Divider backgroundColor='#fff'/>
      </View>
<ScrollView style={styles.container}>
      
     
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

      <View style={styles.buttonsContainer}>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={() => setGoalModalVisible(true)}>
          <Ionicons name="save-outline" size={24} color="#4C28BC" style={{ marginRight: 15 }} />
          <Text style={styles.buttonText}>Savings Goal Settings</Text>
        </TouchableOpacity>
        </View>
        <SavingsGoalModal navigation={navigation} goalModalVisible={goalModalVisible} setGoalModalVisible={setGoalModalVisible} />


      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Card')}>
          <Ionicons name="card-outline" size={24} color="#4C28BC" style={{ marginRight: 15 }} />
          <Text style={styles.buttonText}>Bank and Card Settings</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('KYC')}>
          <Ionicons name="document-outline" size={24} color="#4C28BC" style={{ marginRight: 15 }} />
          <Text style={styles.buttonText}>Fill KYC Form</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button}>
          <Ionicons name="wallet-outline" size={24} color="#4C28BC" style={{ marginRight: 15 }} />
          <Text style={styles.buttonText}>Redeem Points</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button}>
          <Ionicons name="chatbubbles-outline" size={24} color="#4C28BC" style={{ marginRight: 15 }} />
          <Text style={styles.buttonText}>Chat Admin</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button}>
          <Ionicons name="star-half-outline" size={24} color="#4C28BC" style={{ marginRight: 15 }} />
          <Text style={styles.buttonText}>Rate MyFund</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleLogout}>
          <Ionicons name="exit-outline" size={24} color="brown" style={{ marginRight: 15 }}/>
          <Text color='brown' style={styles.buttonText}>Log Out</Text>
        </TouchableOpacity>
      </View>
      </View>
      <Divider />
      <Text style={styles.credits}>MyFund</Text><Text style={{fontSize: 10,     marginBottom: 22, textAlign: 'center', fontFamily: 'karla'}}>version 1.0.0</Text>

    </ScrollView>
    </> 
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F1FF',
  },

  imageContainer: {
    alignItems: 'center',
    marginTop: 6,
    backgroundColor: '#F5F1FF',

    
  },
  image: {
    marginTop: 6,
    width: 130,
    height: 130,
    borderRadius: 80,
    borderWidth: 3,
    borderColor: 'white',
  },
  nameText: {
    marginTop: 2,
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

  settingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 25,
    marginTop: -14,
  },
  settingText: {
    fontFamily: 'karla',
    letterSpacing: -0.3,
    fontSize: 16,
    marginLeft: 10,
  },

  buttonsContainer: {
    alignItems: 'center',
    marginTop: 30,
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
});

export default Profile;

