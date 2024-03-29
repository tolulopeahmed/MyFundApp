import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { View, Text, StyleSheet } from 'react-native';
import { useState } from 'react';
import { ImageProvider } from './ImageContext';
import { AutoSaveProvider } from '../components/AutoSaveContext';

import Home from './Home';
import Save from './Save';
import Invest from './Invest';
import Withdraw from './Withdraw';
import Profile from './Profile';

const Tab = createBottomTabNavigator();

const Dot = ({ color }) => (
  <View
    style={{
      width: 6,
      height: 6,
      borderRadius: 4,
      backgroundColor: color,
      marginTop: 4,
    }}
  />
);

const TabBarIcon = ({ focused, iconName, color, label }) => (
  <View style={{ alignItems: 'center' }}>
    <Ionicons name={iconName} size={focused ? 24 : 24} color={color} />
    <Text style={{ color: color, fontSize: 11, fontFamily: 'ProductSans' }}>{label}</Text>
    {focused && <Dot color={color} />}
  </View>
);

const MainTab = ({ navigation }) => {
  const [autoSave, setAutoSave] = useState(false);

  return (
    <ImageProvider>
      <AutoSaveProvider>
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size, focused }) => {
          let iconName;

          if (route.name === 'MyFund') {
            iconName = 'md-home';
          } else if (route.name === 'Save') {
            iconName = 'md-save';
          } else if (route.name === 'Invest') {
            iconName = 'md-trending-up';
          } else if (route.name === 'Withdraw') {
            iconName = 'md-wallet';
          } else if (route.name === 'More...') {
            iconName = 'md-menu';
          }

          return (
            <TabBarIcon
              focused={focused}
              iconName={iconName}
              color={color}
              label={route.name}
            />
          );
        },
        tabBarActiveTintColor: '#4C28BC',
        tabBarInactiveTintColor: 'grey',
        tabBarShowLabel: false,
        tabBarStyle: styles.tabStyle,
      })}
    >
      <Tab.Screen name="MyFund" component={Home} autoSave={autoSave} />
      <Tab.Screen name="Save" component={Save} autoSave={autoSave} setAutoSave={setAutoSave} />
      <Tab.Screen name="Invest" component={Invest} />
      <Tab.Screen name="Withdraw" component={Withdraw} />
      <Tab.Screen name="More..." component={Profile} />
    </Tab.Navigator>
    </AutoSaveProvider>
    </ImageProvider>
  );
};

const styles = StyleSheet.create({
  tabStyle: {
    backgroundColor: '#fff',
    height: 70,
    paddingBottom: 1,
  },
});

export default MainTab;
