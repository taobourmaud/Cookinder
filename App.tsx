import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AuthContext, AuthProvider } from './authContext';
import HomeScreen from './screens/tabs/home.screen';
import SignInScreen from './screens/auth/signIn.screen';
import SignUpScreen from './screens/auth/signUp.screen';
import { Image, View, StyleSheet } from 'react-native';
import ProfileScreen from './screens/tabs/profile.screen';
import CreateRecipeScreen from './screens/tabs/create-recipe.screen';
import SCREENS from './screens';
import LikeRecipeScreen from './screens/tabs/like-recipe.screen';
import ApiHandler  from './screens/_utils/api/apiHandler';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

export type RootStackParamList = {
  HomeScreen: undefined;
  SignIn: undefined;
  SignUp: undefined;
};

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
          component={CreateRecipeScreen}
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
        <Stack.Screen name="HomeScreen" component={TabNavigator} />
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
  return (
    <AuthProvider>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
};

export default App;
