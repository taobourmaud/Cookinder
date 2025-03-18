import React, { useCallback } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { View } from 'react-native';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { AuthProvider } from './authContext';
import AppNavigator from './src/navigation/AppNavigator';

SplashScreen.preventAutoHideAsync();

const App: React.FC = () => {
  const [fontsLoaded] = useFonts({
    'Montserrat': require('./assets/fonts/Montserrat/Montserrat-VariableFont_wght.ttf'),
    'Montserrat-Italic': require('./assets/fonts/Montserrat/Montserrat-Italic-VariableFont_wght.ttf'),
    'Montserrat-Light': require('./assets/fonts/Montserrat/static/Montserrat-Light.ttf'),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <AuthProvider>
      <NavigationContainer>
        <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
          <AppNavigator />
        </View>
      </NavigationContainer>
    </AuthProvider>
  );
};

export default App;
