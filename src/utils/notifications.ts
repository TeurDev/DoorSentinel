// src/utils/notifications.ts

import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';

export async function registerForPushNotificationsAsync() {
  let token;

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      alert('¡No se concedieron permisos para notificaciones!');
      return;
    }

    token = (await Notifications.getExpoPushTokenAsync({
        projectId: "849a75c4-95ea-4fd3-97e8-f4deb79b2268", // el mismo que hay en app.json
      })).data;
    console.log('Token de notificación:', token);
  } else {
    alert('Debes usar un dispositivo físico para recibir notificaciones push.');
  }

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
      sound: 'true',
    });
  }

  return token;
}
