import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import HomeScreen from '../screens/main/HomeScreen';
import RideTrackingScreen from '../screens/ride/RideTrackingScreen';

import PaymentNavigator from './PaymentNavigator';
import ProfileNavigator from './ProfileNavigator';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function HomeStack() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="PassengerHome" component={HomeScreen} />
            <Stack.Screen name="RideTracking" component={RideTrackingScreen} />
        </Stack.Navigator>
    );
}

export default function MainNavigator() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName: any;
                    if (route.name === 'Home') iconName = focused ? 'map' : 'map-outline';
                    else if (route.name === 'Pagamentos') iconName = focused ? 'card' : 'card-outline';
                    else if (route.name === 'Perfil') iconName = focused ? 'person' : 'person-outline';
                    return <Ionicons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: '#007AFF',
                tabBarInactiveTintColor: 'gray',
                headerShown: false
            })}
        >
            <Tab.Screen name="Home" component={HomeStack} />
            <Tab.Screen name="Pagamentos" component={PaymentNavigator} />
            <Tab.Screen name="Perfil" component={ProfileNavigator} />
        </Tab.Navigator>
    );
}
