import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text } from 'react-native';
import WalletNavigator from './WalletNavigator';

// Placeholder Screens
const HomeScreen = () => <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><Text>Home Screen</Text></View>;

const Tab = createBottomTabNavigator();

export default function MainNavigator() {
    return (
        <Tab.Navigator>
            <Tab.Screen name="Home" component={HomeScreen} />
            <Tab.Screen name="Carteira" component={WalletNavigator} />
        </Tab.Navigator>
    );
}
