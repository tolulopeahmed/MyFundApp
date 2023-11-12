import { StyleSheet, SafeAreaView, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import * as Font from 'expo-font';

import Splash from './screens/Splash';
import OnboardingScreens from './screens/onboarding/OnboardingScreens';
import CreateAccount from './screens/login/CreateAccount';
import Confirmation from './screens/login/Confirmation';
import Login from './screens/login/Login';
import Ownership from './screens/menu/Ownership';
import Sponsorship from './screens/menu/Sponsorship';
import DrawerTab from './screens/menu/DrawerTab';
import MainTab from './screens/menu/MainTab';
import PropertyList from './screens/menu/PropertyList';
import WealthMap from './screens/menu/WealthMap';
import Resources from './screens/menu/Resources';
import Wallet from './screens/menu/Wallet';
import Card from './screens/menu/Card';
import Bank from './screens/menu/Bank'
import KYC from './screens/menu/KYC'
import Notifications from './screens/menu/Notifications';
import FAQ from './screens/menu/FAQ';
import Chat from './screens/menu/Chat'
import Success from './screens/components/Success';
import ReferAndEarn from './screens/menu/ReferAndEarn';
import PaystackWebViewScreen from './screens/menu/PaystackWebViewScreen';
import { ImageProvider } from './screens/menu/ImageContext';
import { AutoInvestProvider } from './screens/components/AutoInvestContext';
import { UserProvider } from './UserContext';
import store from './ReduxStore';
import { Provider } from 'react-redux';
import TopSavers from './screens/menu/TopSavers';
import PasswordForgot from './screens/menu/PasswordForgot';
import PasswordConfirm from './screens/menu/PasswordConfirm';
import { ThemeProvider } from './ThemeContext';


const Stack = createStackNavigator();

const App = ({ styles, darkModeStyles, }) => {
  const [isLoading, setIsLoading] = useState(true);
  


  useEffect(() => {
      async function loadFonts() {
      await Font.loadAsync({
        'karla': require('./screens/fonts/Karla-Regular.ttf'),
        'nexa': require('./screens/fonts/Nexa-Regular.otf'),
        'karla-italic': require('./screens/fonts/Karla-Italic.ttf'),
        'proxima': require('./screens/fonts/Proxima-Nova-Bold.otf'),
        'productSansBlack': require('./screens/fonts/ProductSans-Black.ttf'),
        'ProductSans': require('./screens/fonts/ProductSans-Regular.ttf'),
        'ProductSansBold': require('./screens/fonts/ProductSans-Black.ttf')
      });
      setIsLoading(false);
    }
    loadFonts();
  }, []);



  if (isLoading) {
     return <Splash />;
  }



  return (
    <SafeAreaView style={{ flex: 1 }}>
     <Provider store={store}> 
      <UserProvider>
      <ThemeProvider>
        <ImageProvider>
        <AutoInvestProvider>
    <NavigationContainer>

      <Stack.Navigator
       initialRouteName="OnboardingScreens"
        screenOptions={{
          headerShown: false,
          ...TransitionPresets.SlideFromRightIOS, // Apply slide push animation
        }}
      >
        <Stack.Screen name="OnboardingScreens" component={OnboardingScreens} />
        <Stack.Screen name="CreateAccount" component={CreateAccount} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Confirmation" component={Confirmation} />
        <Stack.Screen name="PasswordForgot" component={PasswordForgot} />
        <Stack.Screen name="PasswordConfirm" component={PasswordConfirm} />      
        <Stack.Screen name="DrawerTab" component={DrawerTab} />
        <Stack.Screen name="Sponsorship" component={Sponsorship} />
        <Stack.Screen name="Ownership" component={Ownership} />
        <Stack.Screen name="MainTab" component={MainTab} />
        <Stack.Screen name="PropertyList" component={PropertyList} />
        <Stack.Screen name="WealthMap" component={WealthMap} />
        <Stack.Screen name="Resources" component={Resources} />
        <Stack.Screen name="Wallet" component={Wallet} />
        <Stack.Screen name="Card" component={Card} />
        <Stack.Screen name="Bank" component={Bank} />
        <Stack.Screen name="KYC" component={KYC} />
        <Stack.Screen name="Notifications" component={Notifications} />
        <Stack.Screen name="FAQ" component={FAQ} />
        <Stack.Screen name="Chat" component={Chat} />
        <Stack.Screen name="Success" component={Success} />
        <Stack.Screen name="ReferAndEarn" component={ReferAndEarn} />
        <Stack.Screen name="PaystackWebViewScreen" component={PaystackWebViewScreen} />
        <Stack.Screen name="TopSavers" component={TopSavers} />




      </Stack.Navigator>
    </NavigationContainer>
    </AutoInvestProvider>
    </ImageProvider>
    </ThemeProvider>
    </UserProvider>
    </Provider>
    </SafeAreaView>

  );
};

export default App;
