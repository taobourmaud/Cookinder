import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../src/screens/tabs/home.screen';
import SCREENS from '../src/screens'
import { Image } from 'react-native';

const Tab = createBottomTabNavigator();

const TabNavigator: React.FC = () => {
    return (
        <Tab.Navigator>
            <Tab.Screen 
                name={SCREENS.HOME} 
                component={HomeScreen} 
                options={{
                headerShown: false,
                tabBarIcon: ({focused}) => (
                    <Image
                        source={require("../assets/images/Vector.png")}
                        style={{
                        height: 30,
                        width: 30,
                        // tintColor: focused ? COLORS.ORANGE : COLORS.BLACK,
                        }}
                    />
                    ),
            }}/>
            {/* <Tab.Screen name="Profile" component={ProfileScreen} /> */}
        </Tab.Navigator>
    );
};

export default TabNavigator;
