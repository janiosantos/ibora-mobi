import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import EditProfileScreen from '../screens/profile/EditProfileScreen';

const Stack = createStackNavigator();

export default function ProfileNavigator() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="EditProfile"
                component={EditProfileScreen}
                options={{ title: 'Meu Perfil' }}
            />
        </Stack.Navigator>
    );
}
