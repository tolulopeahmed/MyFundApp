import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Divider from '../components/Divider';

const Sidebar = ({ navigation, firstName, profileImageUri }) => {
  return (
    <View style={styles.container}>
      <View style={styles.profileContainer}>

      {profileImageUri ? (
          <Image source={{ uri: profileImageUri }} style={styles.profileImage} />
        ) : (
          <Ionicons name="person-circle-outline" size={120} color="grey" />
        )}


        <View style={styles.profileInfo}>
          <Text style={styles.firstName}>Hi</Text>
          <Text style={styles.username}>Tolulope</Text>
        </View>
      </View>
      <View style={styles.menuItemsContainer}>
        <TouchableOpacity style={styles.menuItem}>
          <Ionicons name="save-outline" size={24} color="#fff" style={{ marginRight: 15 }} />
          <Text style={styles.menuText}>Save</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <Ionicons name="trending-up-outline" size={24} color="#fff" style={{ marginRight: 15 }} />
          <Text style={styles.menuText}>Invest</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <Ionicons name="wallet-outline" size={24} color="#fff" style={{ marginRight: 15 }} />
          <Text style={styles.menuText}>Wallet</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <Ionicons name="cellular-outline" size={24} color="#fff" style={{ marginRight: 15 }} />
          <Text style={styles.menuText}>My WealthMap</Text>
        </TouchableOpacity>
      </View>
      <Divider />
      <View style={styles.subMenuItemsContainer}>
        <TouchableOpacity style={styles.menuItem}>
          <Ionicons name="settings-outline" size={18} color="silver" style={{ marginRight: 15 }} />
          <Text style={styles.subMenuText}>Settings</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <Ionicons name="chatbubbles-outline" size={18} color="silver" style={{ marginRight: 15 }} />
          <Text style={styles.subMenuText}>Chat Admin</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <Ionicons name="log-out-outline" size={18} color="orange" style={{ marginRight: 15 }} />
          <Text style={styles.subMenuText}>Log Out</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#4C28BC',
    paddingTop: 60,
    paddingHorizontal: 20,
    
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 50,
    marginTop: 55,

  },
  profileImage: {
    width: 110,
    height: 110,
    borderRadius: 67,
    marginRight: 13,
    marginLeft: -10,
    borderWidth: 0.5,
    borderColor: 'grey',
  },
  profileInfo: {
    flexDirection: 'column',
    justifyContent: 'center',
    
  },
  firstName: {
    fontSize: 40,
    color: '#fff',
    fontFamily: 'karla',
    marginBottom: 2,
    letterSpacing: -2,
  },
  username: {
    fontSize: 17,
    color: '#A9A9A9',
    fontFamily: 'ProductSans',

  },
  menuItemsContainer: {
    marginBottom: 40,
    marginLeft: 10

  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    marginBottom: 10,
  },
  menuText: {
    fontSize: 20,
    color: '#fff',
    fontFamily: 'ProductSans'
  },

  subMenuItemsContainer: {
    marginBottom: 10,
    marginLeft: 10

  },
  subMenuText: {
    fontSize: 15,
    color: 'silver',
    fontFamily: 'ProductSans'
  }
 
});

export default Sidebar;
