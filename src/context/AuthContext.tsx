// src/context/AuthContext.tsx

import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import API from '../api/api';
import { jwtDecode } from 'jwt-decode';
import { registerForPushNotificationsAsync } from '../utils/notifications'; // asegúrate de tener esta función



interface AuthContextType {
  isAuthenticated: boolean;
  login: (token: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  login: async () => {},
  logout: async () => {},
});

export const AuthProvider = ({ children }: any) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const token = await AsyncStorage.getItem('token');

      if (token) {
        const isExpired = checkIfTokenExpired(token);

        if (isExpired) {
          // Si expiró, intentar refresh
          const success = await refreshToken(token);
          if (success) {
            setIsAuthenticated(true);
          } else {
            await AsyncStorage.removeItem('token');
            await AsyncStorage.removeItem('token_expiration');
            setIsAuthenticated(false);
          }
        } else {
          setIsAuthenticated(true);
        }
      }
    };

    checkAuth();
  }, []);

  const login = async (token: string) => {
    await AsyncStorage.setItem('token', token);

    const decoded: any = jwtDecode(token);
    const expiration = decoded.exp * 1000; // de segundos a milisegundos
    await AsyncStorage.setItem('token_expiration', expiration.toString());

    setIsAuthenticated(true);
  };

  const logout = async () => {
    try {
      // Obtener el push token actual del dispositivo
      const pushToken = await registerForPushNotificationsAsync();
  
      // Enviar petición al backend para eliminar ese token del usuario
      if (pushToken) {
        await API.post('/auth/clear-push-token', { pushToken });
      }
    } catch (error: any) {
      console.error('Error eliminando push token del backend:', error.response?.data || error.message);
    }
  
    // Limpiar sesión local
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('token_expiration');
    setIsAuthenticated(false);
  };

  const checkIfTokenExpired = (token: string) => {
    try {
      const decoded: any = jwtDecode(token);
      const now = Date.now();
      return decoded.exp * 1000 < now; // true si expiró
    } catch (error) {
      console.error('Error decoding token:', error);
      return true; // Si no se puede decodificar, lo tratamos como expirado
    }
  };

  const refreshToken = async (oldToken: string) => {
    try {
      const response = await API.post('/auth/refresh', {}, {
        headers: {
          Authorization: oldToken,
        },
      });

      const newToken = response.data.token;
      await login(newToken);

      console.log('Token refrescado automáticamente');

      return true;
    } catch (error) {
      console.error('Error refreshing token:', error);
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
