import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

// Local Imports
import {StackRoute} from '../NavigationRoutes';
import {StackNav} from '../NavigationKeys';

const Stack = createNativeStackNavigator();

export default function StackNavigation() {
  // Main Stack
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName={StackNav.TabNavigation}>
      <Stack.Screen
        name={StackNav.TabNavigation}
        component={StackRoute.TabNavigation}
      />
      <Stack.Screen
        name={StackNav.ProductDetails}
        component={StackRoute.ProductDetails}
      />
      <Stack.Screen
        name={StackNav.VideoScreen}
        component={StackRoute.VideoScreen}
      />
    </Stack.Navigator>
  );
}
