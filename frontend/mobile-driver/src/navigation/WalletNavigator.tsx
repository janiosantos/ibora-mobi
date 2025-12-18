import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import WalletScreen from '../screens/main/WalletScreen';
import WithdrawalScreen from '../screens/main/WithdrawalScreen';

const Stack = createStackNavigator();

export default function WalletNavigator() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="WalletOverview"
                component={WalletScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="Withdraw"
                component={WithdrawalScreen}
                options={{ title: 'Solicitar Saque', headerBackTitle: 'Voltar' }}
            />
        </Stack.Navigator>
    );
}
