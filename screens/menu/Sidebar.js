import React, {useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Divider from '../components/Divider';
import QuickSaveModal from '../components/QuickSaveModal';
import { useDispatch, useSelector } from 'react-redux';

const Sidebar = ({ navigation, }) => {
  const [quickSaveModalVisible, setQuickSaveModalVisible] = useState(false);
  const userInfo = useSelector((state) => state.bank.userInfo); // Get userInfo from Redux state


  const handleLogout = () => {
    navigation.navigate('Login');
  }

  const handleSave = () => {
    navigation.navigate('Save');
    setQuickSaveModalVisible(true);
  }
  

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.profileContainer}>

      <Image source={require('../images/logo5.1.png')} style={styles.image} />



        <View style={styles.profileInfo}>
          <Text style={styles.firstName}>Hi</Text>
          <Text style={styles.username}>{userInfo?.firstName ? `${userInfo.firstName}` : ''}</Text>
        </View>
      </View>
      <View style={styles.menuItemsContainer}>
        <TouchableOpacity style={styles.menuItem} onPress={handleSave}>
          <Ionicons name="save-outline" size={24} color="#fff" style={{ marginRight: 15 }} />
          <Text style={styles.menuText}>Save</Text>
        </TouchableOpacity>

        {quickSaveModalVisible && (
      <QuickSaveModal
        navigation={navigation}
        quickSaveModalVisible={quickSaveModalVisible}
        setQuickSaveModalVisible={setQuickSaveModalVisible}
      />
    )}

        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Ownership')}>
          <Ionicons name="home-outline" size={24} color="#fff" style={{ marginRight: 15 }} />
          <Text style={styles.menuText}>Buy Properties</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Wallet')}>
          <Ionicons name="wallet-outline" size={24} color="#fff" style={{ marginRight: 15 }} />
          <Text style={styles.menuText}>Earn Rent</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.push('WealthMap')}>
              <View style={{ marginLeft: -29, marginRight: 15 }}>
        <View style={styles.arrow} />
        </View>
          <Ionicons name="cellular-outline" size={24} color="#fff" style={{ marginRight: 15 }} />
          <Text style={styles.menuText}>My WealthMap</Text>
        </TouchableOpacity>
      </View>


      <Divider />
      <View style={styles.subMenuItemsContainer}>
        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('More...')}>
          <Ionicons name="settings-outline" size={18} color="silver" style={{ marginRight: 15 }} />
          <Text style={styles.subMenuText}>Settings</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Chat')}>
          <Ionicons name="chatbubbles-outline" size={18} color="silver" style={{ marginRight: 15 }} />
          <Text style={styles.subMenuText}>Chat Admin</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={18} color="orange" style={{ marginRight: 15 }} />
          <Text style={styles.subMenuText}>Log Out</Text>
        </TouchableOpacity>
      </View>
      </ScrollView>
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
  image: {
    width: 110,
    height: 110,
    borderRadius: 67,
    marginRight: 5,
    marginLeft: -10,
    borderWidth: 0.5,
    resizeMode: 'center'
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
  arrow: {
    borderTopWidth: 7,
    borderRightWidth: 6,
    borderBottomWidth: 7,
    borderLeftWidth: 8,
    borderTopColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: 'transparent',
    borderLeftColor: '#FF9933',
    marginTop: 0,
    transform: [{ scaleX: -1 }]


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
