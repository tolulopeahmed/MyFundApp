import React from 'react';
import { View, Text, Image, ScrollView, Switch, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
//import { styles } from './styles';

const Profile = ({ navigation }) => {
  const [isEnabled, setIsEnabled] = React.useState(false);
  const toggleSwitch = () => setIsEnabled(previousState => !previousState);

  return (
    <><ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
          <Icon name="menu-outline" size={30} color="#4C28BC" />
        </TouchableOpacity>
        <View style={styles.headerRight}>
          <TouchableOpacity onPress={() => alert('Notifications')}>
            <Icon name="notifications-outline" size={30} color="#4C28BC" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => alert('Profile')}>
            <Image source={{ uri: 'https://via.placeholder.com/150' }} style={styles.profileImage} />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.content}>
        <TouchableOpacity onPress={() => alert('Select Profile Picture')}>
          <Image source={{ uri: 'https://via.placeholder.com/150' }} style={styles.profileImage} />
        </TouchableOpacity>
        <Text style={styles.name}>[FirstName]</Text>
        <Text style={styles.username}>@[first part of user email]</Text>
        <View style={styles.options}>
          <Text style={styles.optionText}>Enable Fingerprint</Text>
          <Switch
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            thumbColor={isEnabled ? "#f5dd4b" : "#f4f3f4"}
            onValueChange={toggleSwitch}
            value={isEnabled}
          />
        </View>
        <View style={styles.points}>
          <Text style={styles.pointsText}>Total Points</Text>
          <Text style={styles.pointsNumber}>[Points]</Text>
        </View>
        <View style={styles.referral}>
          <Text style={styles.referralText}>Referral Bonus (# of Referrals)</Text>
          <View style={styles.referralAmount}>
            <Text style={styles.referralAmountText}>[$Amount]</Text>
            <Text style={styles.referralCount}>[#]</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.button} onPress={() => alert('General Settings')}>
          <Icon name="settings-outline" size={25} color="#FFFFFF" />
          <Text style={styles.buttonText}>General Settings</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => alert('Bank and Card Settings')}>
          <Icon name="card-outline" size={25} color="#FFFFFF" />
          <Text style={styles.buttonText}>Bank and Card Settings</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => alert('Fill KYC Form')}>
          <Icon name="document-text-outline" size={25} color="#FFFFFF" />
          <Text style={styles.buttonText}>Fill KYC Form</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => alert('Redeem Points')}>
        <Icon name="checkmark-outline" size={25} color="#FFFFFF" />
        <Text style={styles.buttonText}>Redeem Points</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => alert('Share Testimony')}>
        <Icon name="chatbox-ellipses-outline" size={25} color="#FFFFFF" />
        <Text style={styles.buttonText}>Share Testimony</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => alert('Rate MyFund')}>
        <Icon name="star-outline" size={25} color="#FFFFFF" />
        <Text style={styles.buttonText}>Rate MyFund</Text>
      </TouchableOpacity>

    </View>

  </ScrollView>

  <View style={styles.tabContainer}>

    <TouchableOpacity style={styles.tabItem} onPress={() => alert('Home')}>
      <Icon name="home-outline" size={25} color="#4C28BC" />
      <Text style={styles.tabText}>Home</Text>
    </TouchableOpacity>

    <TouchableOpacity style={styles.tabItem} onPress={() => alert('Save')}>
      <Icon name="save-outline" size={25} color="#4C28BC" />
      <Text style={styles.tabText}>Save</Text>
    </TouchableOpacity>

    <TouchableOpacity style={styles.tabItem} onPress={() => alert('Invest')}>
      <Icon name="cash-outline" size={25} color="#4C28BC" />
      <Text style={styles.tabText}>Invest</Text>
    </TouchableOpacity>

    <TouchableOpacity style={styles.tabItem} onPress={() => alert('Withdraw')}>
      <Icon name="card-outline" size={25} color="#4C28BC" />
      <Text style={styles.tabText}>Withdraw</Text>
    </TouchableOpacity>

    <TouchableOpacity style={styles.tabItem} onPress={() => alert('More')}>
      <Icon name="ellipsis-horizontal-outline" size={25} color="#4C28BC" />
      <Text style={styles.tabText}>More</Text>
    </TouchableOpacity>

  </View>
  </>
);
  }


export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F1FF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F5F1FF',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
  },
  profileIcon: {
    marginRight: 10,
  },
  menuIcon: {
    marginLeft: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4C28BC',
  },
  contentContainer: {
    backgroundColor: '#F5F1FF',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  profilePictureContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  profilePicture: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#4C28BC',
    alignSelf: 'center',
    marginTop: 30,
    },
    name: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    textAlign: 'center',
    },
    username: {
    fontSize: 16,
    color: '#999999',
    textAlign: 'center',
    marginBottom: 20,
    },
    switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
    },
    switchText: {
    fontSize: 16,
    fontWeight: 'bold',
    },
    pointsContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#DCD1FF',
    paddingHorizontal: 20,
    paddingVertical: 30,
    },
    pointsText: {
    fontSize: 18,
    fontWeight: 'bold',
    },
    referralsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
    },
    referralsText: {
    fontSize: 16,
    },
    referralAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    },
    referralCount: {
    fontSize: 18,
    },
    button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#4C28BC',
    paddingHorizontal: 20,
    paddingVertical: 15,
    marginTop: 20,
    },
    buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    marginLeft: 10,
    },
    });
    

