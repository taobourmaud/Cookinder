import React, { useContext } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import TabNavigator from './TabNavigator';
import CameraFunction from '../screens/takePicture.screen';
import PhotoFormScreen from '../screens/photoForm.screen';
import DishDetailScreen from '../screens/dish.details.screen';
import DishesCreatedScreen from '../screens/dishes.created.screen';
import SignInScreen from '../screens/tabs/auth/signIn.screen';
import SignUpScreen from '../screens/tabs/auth/signUp.screen';
import { AuthContext } from '../../authContext';

const Stack = createStackNavigator();

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
          <Stack.Screen name="DishDetailScreen" component={DishDetailScreen} />
          <Stack.Screen name="DishesCreatedScreen" component={DishesCreatedScreen} />
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

export default AppNavigator;
