import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Home from "./screens/home/Home";
import Rewards from './screens/rewards/Rewards';
import Profile from './screens/profile/Profile';

const Tab = createBottomTabNavigator();

export default function App() {
    return (
        <NavigationContainer>
            <Tab.Navigator initialRouteName="Home"
                           screenOptions={({ route }) => ({
                               tabBarIcon: ({ color, size }) => {
                                   let iconName;
                                   if (route.name === 'Home') {
                                       iconName = 'home';
                                   } else if (route.name === 'Rewards') {
                                       iconName = 'trophy';
                                   } else if (route.name === 'Profile') {
                                       iconName = 'person';
                                   }
                                   return <Ionicons name={iconName} size={size} color={color} />;
                               },
                               tabBarActiveTintColor: '#6200EE',
                               tabBarInactiveTintColor: 'gray',
                               tabBarStyle: { backgroundColor: '#f8f8f8', paddingBottom: 5 },
                               headerShown: false,
                           })}
            >
                <Tab.Screen name="Rewards" component={Rewards} options={{ unmountOnBlur: true }} />
                <Tab.Screen name="Home" component={Home} options={{ unmountOnBlur: true }} />
                <Tab.Screen name="Profile" component={Profile} options={{ unmountOnBlur: true }} />
            </Tab.Navigator>
        </NavigationContainer>
    );
}
