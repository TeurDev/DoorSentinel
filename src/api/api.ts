import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode'; // Con las llaves { }

const API = axios.create({
  baseURL: 'xxxx',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Antes de cada request, hacemos esta comprobación:
API.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('token');

  if (token) {
    const decoded: any = jwtDecode(token);
    const now = Date.now();

    if (decoded.exp * 1000 < now) {
      // Token expirado → pedimos uno nuevo
      const response = await axios.post('xxxx', {}, {
        headers: { Authorization: token },
      });

      const newToken = response.data.token;
      await AsyncStorage.setItem('token', newToken);
      
      config.headers.Authorization = newToken; // Usamos el nuevo token
    } else {
      // Token válido → seguimos usando el actual
      config.headers.Authorization = token;
    }
  }

  return config;
}, (error) => {
  return Promise.reject(error);
});

export default API;
