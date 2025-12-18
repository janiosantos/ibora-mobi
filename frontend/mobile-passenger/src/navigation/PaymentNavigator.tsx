import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import PaymentMethodsScreen from '../screens/main/PaymentMethodsScreen';
import AddCardScreen from '../screens/payments/AddCardScreen';

const Stack = createStackNavigator();

export default function PaymentNavigator() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="PaymentList"
                component={PaymentMethodsScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="AddCard"
                component={AddCardScreen}
                options={{ title: 'Adicionar Cartão', headerBackTitle: 'Voltar' }}
            />
        </Stack.Navigator>
    );
}
