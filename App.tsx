// App.tsx

import 'react-native-gesture-handler';
import React, { useState, useEffect, useContext } from 'react';
import { Alert, View, ActivityIndicator, StyleSheet, StatusBar as RNStatusBar } from 'react-native';
import * as Notifications from 'expo-notifications';

import AppNavigator from './src/navigation/AppNavigator';
import { AuthProvider } from './src/context/AuthContext';
import { ThemeProvider, useTheme } from './src/context/ThemesContext';
import { registerForPushNotificationsAsync } from './src/utils/notifications';

// i18n
import './src/utils/i18n';
import i18next from 'i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';

function Root() {
  const { theme } = useTheme(); // 'light' o 'dark'

  // Elegimos style y backgroundColor de la barra según el tema:
  const barStyle = theme === 'dark' ? 'light-content' : 'dark-content';
  const backgroundColor = theme === 'dark' ? '#1F1729' : '#F0F4FF';

  return (
    <>
      {/* StatusBar nativa */}
      <RNStatusBar
        backgroundColor={backgroundColor}
        barStyle={barStyle}
      />
      <AppNavigator />
    </>
  );
}

export default function App() {
  const [isI18nReady, setIsI18nReady] = useState(false);

  // Pedir permisos y listener de notificaciones
  useEffect(() => {
    (async () => {
      try {
        await registerForPushNotificationsAsync();
      } catch (error) {
        console.warn('Error pidiendo permisos de notificación', error);
      }
    })();

    const subscription = Notifications.addNotificationReceivedListener(notification => {
      const { title, body } = notification.request.content;
      Alert.alert(title || 'Notificación', body || '');
    });

    return () => subscription.remove();
  }, []);

  // Leer idioma guardado de AsyncStorage
  useEffect(() => {
    (async () => {
      try {
        const storedLang = await AsyncStorage.getItem('language');
        if (storedLang && storedLang !== i18next.language) {
          await i18next.changeLanguage(storedLang);
        }
      } catch (e) {
        console.warn('Error leyendo idioma de AsyncStorage', e);
      } finally {
        setIsI18nReady(true);
      }
    })();
  }, []);

  if (!isI18nReady) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ThemeProvider>
      <AuthProvider>
        <Root />
      </AuthProvider>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
