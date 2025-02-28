import React, { useCallback, useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AuthContext, AuthProvider } from './authContext';
import { Image, View, StyleSheet } from 'react-native';
import SCREENS from './src/screens';
import LikeRecipeScreen from './src/screens/tabs/like-recipe.screen';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import ProfileScreen from './src/screens/tabs/profile.screen';
import HomeScreen from './src/screens/tabs/home.screen';
import ApiHandler from './src/_utils/api/apiHandler';
import SignUpScreen from './src/screens/tabs/auth/signUp.screen';
import SignInScreen from './src/screens/tabs/auth/signIn.screen';
import CameraFunction from './src/screens/takePicture.screen';
import PhotoFormScreen from './src/screens/photoForm.screen';
import DishesScreen from "./screens/dishes.screen";
import DishDetailsScreen from "./screens/dish.details.screen";

export type RootStackParamList = {
  HomeScreen: undefined;
  SignIn: undefined;
  SignUp: undefined;
  TakePicture: undefined;
  PhotoForm: { imageUri: string };
};

SplashScreen.preventAutoHideAsync();

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();
const queryClient = new QueryClient()

const TabNavigator: React.FC = () => {
  const apiHandler = new ApiHandler();
  return (
    <QueryClientProvider client={queryClient}>
      <Tab.Navigator
        screenOptions={{
          tabBarShowLabel: false,
          tabBarStyle: styles.tabBar,
        }}
      >
        <Tab.Screen
          name={SCREENS.HOME}
          component={HomeScreen}
          initialParams={{ apiHandler }}
          options={{
            headerShown: false,
            tabBarIcon: ({ focused }) => (
              <View style={focused ? styles.focusedIconContainer : styles.iconContainer}>
                <Image
                  source={require("./assets/images/home.png")}
                  style={[
                    styles.icon,
                    { tintColor: focused ? "#FFF" : "#000" }
                  ]}
                />
              </View>
            ),
          }}
        />
        <Tab.Screen
          name={SCREENS.CREATE_RECIPE}
          component={PhotoFormScreen}
          options={{
            headerShown: false,
            tabBarIcon: ({ focused }) => (
              <View style={focused ? styles.focusedIconContainer : styles.iconContainer}>
                <Image
                  source={require("./assets/images/create.png")}
                  style={[
                    styles.icon,
                    { tintColor: focused ? "#FFF" : "#000" }
                  ]}
                />
              </View>
            ),
          }}
        />
        <Tab.Screen
          name={SCREENS.RECIPE_LIKED}
          component={LikeRecipeScreen}
          options={{
            headerShown: false,
            tabBarIcon: ({ focused }) => (
              <View style={focused ? styles.focusedIconContainer : styles.iconContainer}>
                <Image
                  source={require("./assets/images/like.png")}
                  style={[
                    styles.icon,
                    { tintColor: focused ? "#FFF" : "#000" }
                  ]}
                />
              </View>
            ),
          }}
        />
        <Tab.Screen
          name="Profile"
          component={ProfileScreen}
          options={{
            headerShown: false,
            tabBarIcon: ({ focused }) => (
              <View style={focused ? styles.focusedIconContainer : styles.iconContainer}>
                <Image
                  source={require("./assets/images/profile.png")}
                  style={[
                    styles.icon,
                    { tintColor: focused ? "#FFF" : "#000" }
                  ]}
                />
              </View>
            ),
          }}
        />
      </Tab.Navigator>
    </QueryClientProvider>
  );
};

const AppNavigator: React.FC = () => {
  const auth = useContext(AuthContext);

  if (!auth) return null;

  const { isLoggedIn, loading } = auth;

  if (loading) {
    return null;
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isLoggedIn ? (
        <>
          <Stack.Screen name="HomeScreen" component={TabNavigator} />
          <Stack.Screen name="TakePicture" component={CameraFunction} /> 
          <Stack.Screen name="PhotoForm" component={PhotoFormScreen} />
          <Stack.Screen name="HomeScreen" component={HomeScreen} />
          <Stack.Screen name="DishesScreen" component={DishesScreen} />
          <Stack.Screen name="DishDetailsScreen" component={DishDetailsScreen} />
        </>
      ) : (
        <>
          <Stack.Screen name="SignIn" component={SignInScreen} />
          <Stack.Screen name="SignUp" component={SignUpScreen} />
        </>
      )}
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    height: 100,
    backgroundColor: "#fff",
    borderTopWidth: 0,
    elevation: 10,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 13,
  },
  iconContainer: {
    marginTop: 35,
    alignItems: "center",
    justifyContent: "center",    
    width: 50,
    height: 50,
  },
  focusedIconContainer: {
    marginTop: 35,
    alignItems: "center",
    justifyContent: "center",
    width: 40,
    height: 40,
    backgroundColor: "#EBB502",
    borderRadius: 10, 
  },
  icon: {
    width: 20,
    height: 20,
  },
});

const App: React.FC = () => {

  const [fontsLoaded, error] = useFonts({
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
