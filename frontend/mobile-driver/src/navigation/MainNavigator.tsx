import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { View, Text } from 'react-native';
import WalletNavigator from './WalletNavigator';
import ProfileNavigator from './ProfileNavigator';
import HomeScreen from '../screens/main/HomeScreen';
import RideTrackingScreen from '../screens/ride/RideTrackingScreen';
import { Ionicons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function HomeStack() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="DriverHome" component={HomeScreen} />
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
                    else if (route.name === 'Carteira') iconName = focused ? 'wallet' : 'wallet-outline';
                    else if (route.name === 'Perfil') iconName = focused ? 'person' : 'person-outline';
                    return <Ionicons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: '#007AFF',
                tabBarInactiveTintColor: 'gray',
                headerShown: false
            })}
        >
            <Tab.Screen name="Home" component={HomeStack} />
            <Tab.Screen name="Carteira" component={WalletNavigator} />
            <Tab.Screen name="Perfil" component={ProfileNavigator} />
        </Tab.Navigator>
    );
}
