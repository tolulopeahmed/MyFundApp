import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import MainTab from './MainTab';
import Sidebar from './Sidebar';
import { UserProvider } from '../../UserContext';
import ImageContext, { ImageProvider } from './ImageContext';

const Drawer = createDrawerNavigator();

const DrawerTab = ({ navigation, firstName, route }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [profileImageUri, setProfileImageUri] = useState(null);

  
  useEffect(() => {
    // Check if the user is a first-time signup and came from the Confirmation Screen
    if (route.name === 'Confirmation') {
      // Set the SavingsGoalModal to be visible
      setGoalModalVisible(true);
      setTimeout(() => {
        // Navigate to the correct "More..." screen after 3 seconds
        navigation.navigate('More...');
      }, 3000); // 3 seconds delay
    }
  }, [route]);
  


  useEffect(() => {
    console.log('profileImageUri:', profileImageUri);
  }, [profileImageUri]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <View style={styles.container}>
      <ImageProvider>
      <UserProvider>
      <Drawer.Navigator
  drawerContent={(props) => <Sidebar {...props} firstName={firstName} profileImageUri={profileImageUri} />}
  drawerStyle={{ width: '80%' }}
  drawerPosition="left"
  edgeWidth={0}
  screenOptions={{ headerShown: false }}
  drawerAnimationEnabled
>
        <Drawer.Screen
          name="MainTab"
          component={MainTab}
        />
      </Drawer.Navigator>
      {isSidebarOpen && (
        <View
          style={styles.overlay}
          onTouchStart={() => setIsSidebarOpen(false)}
        />
      )}
      </UserProvider>
      </ImageProvider>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
});

export default DrawerTab;
