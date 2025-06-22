import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import HomeScreen from './src/screens/HomeScreen';
import IdentityScreen from './src/screens/IdentityScreen';
import ReputationScreen from './src/screens/ReputationScreen';
import EarnScreen from './src/screens/EarnScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import TabBarIcon from './src/components/TabBarIcon';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar style="light" backgroundColor="#0f0f0f" />
        <Tab.Navigator
          screenOptions={{
            headerShown: false,
            tabBarStyle: {
              backgroundColor: '#1a1a1a',
              borderTopColor: '#262626',
              borderTopWidth: 1,
              paddingBottom: 8,
              paddingTop: 8,
              height: 70,
            },
            tabBarActiveTintColor: '#ef4444',
            tabBarInactiveTintColor: '#a3a3a3',
            tabBarLabelStyle: {
              fontSize: 12,
              fontWeight: '500',
            },
          }}
        >
          <Tab.Screen
            name="Home"
            component={HomeScreen}
            options={{
              tabBarIcon: ({ color, size }) => (
                <TabBarIcon name="home" color={color} size={size} />
              ),
            }}
          />
          <Tab.Screen
            name="Identity"
            component={IdentityScreen}
            options={{
              tabBarIcon: ({ color, size }) => (
                <TabBarIcon name="credit-card" color={color} size={size} />
              ),
            }}
          />
          <Tab.Screen
            name="Reputation"
            component={ReputationScreen}
            options={{
              tabBarIcon: ({ color, size }) => (
                <TabBarIcon name="star" color={color} size={size} />
              ),
            }}
          />
          <Tab.Screen
            name="Earn"
            component={EarnScreen}
            options={{
              tabBarIcon: ({ color, size }) => (
                <TabBarIcon name="trending-up" color={color} size={size} />
              ),
            }}
          />
          <Tab.Screen
            name="Settings"
            component={SettingsScreen}
            options={{
              tabBarIcon: ({ color, size }) => (
                <TabBarIcon name="settings" color={color} size={size} />
              ),
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}