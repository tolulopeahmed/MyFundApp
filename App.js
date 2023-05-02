import { StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as Font from 'expo-font';

import Splash from './screens/Splash';
import OnboardingScreens from './screens/onboarding/OnboardingScreens';
import CreateAccount from './screens/login/CreateAccount';
import Confirmation from './screens/login/Confirmation';
import Login from './screens/login/Login';
import MainTab from './screens/menu/MainTab';
import Sponsorship from './screens/menu/Sponsorship';
import DrawerTab from './screens/menu/DrawerTab';





const Stack = createStackNavigator();

const App = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadFonts() {
      await Font.loadAsync({
        'karla': require('./screens/fonts/Karla-Regular.ttf'),
        'proxima': require('./screens/fonts/Proxima-Nova-Bold.otf'),
        'productSans': require('./screens/fonts/ProductSans-Black.ttf'),
        'ProductSans': require('./screens/fonts/ProductSans-Regular.ttf'),
        'ProductSansBold': require('./screens/fonts/ProductSans-Black.ttf')
      });
      setTimeout(() => setIsLoading(false), 2000);
    }
    loadFonts();
  }, []);

  if (isLoading) {
     return <Splash />;
  }

  setTimeout(() => {
    setIsLoading(false);
  }, 2000);

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="OnboardingScreens"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="OnboardingScreens" component={OnboardingScreens} />
        <Stack.Screen name="CreateAccount" component={CreateAccount} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Confirmation" component={Confirmation} />
        <Stack.Screen name="DrawerTab" component={DrawerTab} />
        <Stack.Screen name="Sponsorship" component={Sponsorship} />



      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
