import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';

import MainTab from './MainTab';
import Sidebar from './Sidebar';

const Drawer = createDrawerNavigator();

const DrawerTab = (navigation, firstName) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [profileImageUri, setProfileImageUri] = useState(null);

  useEffect(() => {
    console.log('profileImageUri:', profileImageUri);
  }, [profileImageUri]);
  

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <View style={styles.container}>
      <Drawer.Navigator
        drawerStyle={{
            width: '80%',
            animationType: 'slide',
            edgeWidth: 0,
        }}
        drawerContent={(props) => <Sidebar {...props} toggleSidebar={toggleSidebar} navigation={navigation} firstName={firstName} profileImageUri={profileImageUri} />}
      >
        <Drawer.Screen name="MainTab" component={MainTab}  options={{
            headerShown: false,
            headerTitle: '',
            }}
            initialParams={{setProfileImageUri}}
            />
      </Drawer.Navigator>
      {isSidebarOpen && (
        <View style={styles.overlay} onTouchStart={() => setIsSidebarOpen(false)} />
      )}
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
