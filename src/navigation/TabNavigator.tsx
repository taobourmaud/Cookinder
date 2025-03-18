// src/navigation/TabNavigator.tsx
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { View, Image, StyleSheet } from 'react-native';
import SCREENS from '../screens';
import ApiHandler from '../_utils/api/apiHandler';
import HomeScreen from '../screens/tabs/home.screen';
import PhotoFormScreen from '../screens/photoForm.screen';
import DishesScreen from '../screens/dishes.liked.screen';
import ProfileScreen from '../screens/tabs/profile.screen';

const Tab = createBottomTabNavigator();
const queryClient = new QueryClient();

const TabNavigator: React.FC = () => {
  const apiHandler = new ApiHandler();
  return (
    <QueryClientProvider client={queryClient}>
      <Tab.Navigator screenOptions={{ tabBarShowLabel: false, tabBarStyle: styles.tabBar }}>
        <Tab.Screen name={SCREENS.HOME} component={HomeScreen} initialParams={{ apiHandler }} options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <View style={focused ? styles.focusedIconContainer : styles.iconContainer}>
              <Image source={require('../../assets/images/home.png')} style={[styles.icon, { tintColor: focused ? "#FFF" : "#000" }]} />
            </View>
          ),
        }} />
        <Tab.Screen name={SCREENS.CREATE_RECIPE} component={PhotoFormScreen} options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <View style={focused ? styles.focusedIconContainer : styles.iconContainer}>
              <Image source={require('../../assets/images/create.png')} style={[styles.icon, { tintColor: focused ? "#FFF" : "#000" }]} />
            </View>
          ),
        }} />
        <Tab.Screen name={SCREENS.RECIPE_LIKED} component={DishesScreen} initialParams={{ apiHandler }} options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <View style={focused ? styles.focusedIconContainer : styles.iconContainer}>
              <Image source={require('../../assets/images/like.png')} style={[styles.icon, { tintColor: focused ? "#FFF" : "#000" }]} />
            </View>
          ),
        }} />
        <Tab.Screen name={SCREENS.PROFILE} component={ProfileScreen} options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <View style={focused ? styles.focusedIconContainer : styles.iconContainer}>
              <Image source={require('../../assets/images/profile.png')} style={[styles.icon, { tintColor: focused ? "#FFF" : "#000" }]} />
            </View>
          ),
        }} />
      </Tab.Navigator>
    </QueryClientProvider>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    height: 90,
    borderTopWidth: 0,
    elevation: 10,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 13,
  },
  iconContainer: {
    marginTop: 35,
    alignItems: "center",
    justifyContent: "center",
    width: 50,
    height: 50,
    backgroundColor: '#fff',
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
    color: "#fff",
  },
});

export default TabNavigator;
