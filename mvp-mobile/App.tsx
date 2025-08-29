import React from 'react';
import { View, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Toast from 'react-native-toast-message';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AppKitProvider } from './src/AppKitProvider';
import { SnowPay } from './src/pages/SnowPay';
import { EERC } from './src/pages/EERC';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <AppKitProvider>
      <View style={styles.container}>
        <StatusBar style="auto" />
        <NavigationContainer>
          <Tab.Navigator
            screenOptions={{
              headerShown: false,
              tabBarStyle: styles.tabBar,
              tabBarActiveTintColor: '#00D4AA',
              tabBarInactiveTintColor: '#666',
            }}
          >
            <Tab.Screen 
              name="SnowPay" 
              component={SnowPay}
              options={{
                tabBarLabel: 'Wallet',
              }}
            />
            <Tab.Screen 
              name="EERC" 
              component={EERC}
              options={{
                tabBarLabel: 'Privacy',
              }}
            />
          </Tab.Navigator>
        </NavigationContainer>
        <Toast />
      </View>
    </AppKitProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F9',
  },
  tabBar: {
    backgroundColor: '#FFFFFF',
    borderTopColor: '#F5F5F9',
    paddingTop: 5,
  },
});