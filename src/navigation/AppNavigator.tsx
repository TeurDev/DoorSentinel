// src/navigation/AppNavigator.tsx

import React, { useContext, useEffect, useState } from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { AuthContext } from '../context/AuthContext';
import ThemeContext from '../context/ThemesContext'; // ← Asegúrate de que exista

import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import HomeScreen from '../screens/HomeScreen';
import DevicesScreen from '../screens/Devices/DevicesScreen';
import DeviceSettingsScreen from '../screens/Devices/DeviceSettingsScreen';
import GroupDetailScreen from '../screens/Groups/GroupDetailScreen';
import GroupsScreen from '../screens/Groups/GroupsScreen';
import WelcomeHelpScreen from '../screens/WelcomeHelpScreen';
import HelpScreen from '../screens/WelcomeHelpScreen';
import DeviceSelectorScreen from '../screens/Devices/DeviceSelectorScreen';
import GroupSelectorScreen from '../screens/Groups/GroupSelectorScreen';
import SettingsGeneralScreen from '../screens/Settings/SettingsGeneralScreen';
import SettingsAccountScreen from '../screens/Settings/SettingsAccountScreen';
import SettingsPrivacyScreen from '../screens/Settings/SettingsPrivacyScreen';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const { isAuthenticated } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext); // 'light' o 'dark'
  const [initialRoute, setInitialRoute] = useState<'WelcomeHelp' | 'Home' | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      setInitialRoute(null);
      return;
    }
    (async () => {
      const seen = await AsyncStorage.getItem('hasSeenWelcome');
      setInitialRoute(seen === 'true' ? 'Home' : 'WelcomeHelp');
    })();
  }, [isAuthenticated]);

  // Mientras calculamos initialRoute, devolvemos null para evitar parpadeos
  if (isAuthenticated && initialRoute === null) return null;

  const navTheme = theme === 'dark' ? DarkTheme : DefaultTheme;

  return (
    <NavigationContainer theme={navTheme}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isAuthenticated ? (
          <>
            {initialRoute === 'WelcomeHelp' && (
              <Stack.Screen name="WelcomeHelp" component={WelcomeHelpScreen} />
            )}
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Devices" component={DevicesScreen} />
            <Stack.Screen name="DeviceSettings" component={DeviceSettingsScreen} />
            <Stack.Screen name="GroupDetail" component={GroupDetailScreen} />
            <Stack.Screen name="Groups" component={GroupsScreen} />
            <Stack.Screen name="DeviceSelector" component={DeviceSelectorScreen} />
            <Stack.Screen name="GroupSelector" component={GroupSelectorScreen} />
            <Stack.Screen name="SettingsGeneral" component={SettingsGeneralScreen} />
            <Stack.Screen name="SettingsAccount" component={SettingsAccountScreen} />
            <Stack.Screen name="SettingsPrivacy" component={SettingsPrivacyScreen} />
            <Stack.Screen name="Help" component={HelpScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
