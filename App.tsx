import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthContext, AuthProvider } from './authContext';
import HomeScreen from './screens/home.screen';
import SignInScreen from './screens/signIn.screen';
import SignUpScreen from './screens/signUp.screen';

export type RootStackParamList = {
  HomeScreen: undefined;
  SignIn: undefined;
  SignUp: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

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
        <Stack.Screen name="HomeScreen" component={HomeScreen} />
      ) : (
        <>
          <Stack.Screen name="SignIn" component={SignInScreen} />
          <Stack.Screen name="SignUp" component={SignUpScreen} />
        </>
      )}
    </Stack.Navigator>
  );
};

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
function useFonts(arg0: { MyFont: any; }): [any] {
  throw new Error('Function not implemented.');
}

