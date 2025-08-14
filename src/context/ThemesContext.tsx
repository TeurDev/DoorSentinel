// src/context/ThemesContext.tsx

import React, {
  createContext,
  useState,
  useEffect,
  ReactNode,
  useContext,
} from 'react';
import { Appearance, useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

type ThemeOption = 'light' | 'dark' | 'auto';
type RealTheme = 'light' | 'dark';

interface ThemeContextValue {
  theme: RealTheme;
  setOption: (opt: ThemeOption) => void;
}

const STORAGE_KEY = 'USER_THEME_OPTION';

const ThemeContext = createContext<ThemeContextValue>({
  theme: 'light',
  setOption: () => {},
});

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const sys = useColorScheme(); // 'light' o 'dark' según el sistema
  const [option, setOptionState] = useState<ThemeOption>('auto');
  const [theme, setTheme] = useState<RealTheme>('light');
  const [initialized, setInitialized] = useState(false);

  // 1) Al montar, leo la preferencia guardada (light/dark/auto)
  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);
        if (saved === 'light' || saved === 'dark' || saved === 'auto') {
          setOptionState(saved);
        }
      } catch (e) {
        console.warn('Error leyendo tema guardado', e);
      } finally {
        setInitialized(true);
      }
    })();
  }, []);

  // 2) Cada vez que cambie "option" o "sys", recalculo el theme real
  useEffect(() => {
    let newTheme: RealTheme = 'light';
    if (option === 'light') newTheme = 'light';
    else if (option === 'dark') newTheme = 'dark';
    else newTheme = sys === 'dark' ? 'dark' : 'light';
    setTheme(newTheme);
  }, [option, sys]);

  // 3) Cuando el usuario cambie opción, guardo o elimino de AsyncStorage
  const setOption = async (opt: ThemeOption) => {
    setOptionState(opt);
    try {
      if (opt === 'auto') {
        await AsyncStorage.removeItem(STORAGE_KEY);
      } else {
        await AsyncStorage.setItem(STORAGE_KEY, opt);
      }
    } catch (e) {
      console.warn('Error guardando tema', e);
    }
  };

  // 4) Hasta que no haya leído la preferencia, no renderizo nada
  if (!initialized) return null;

  return (
    <ThemeContext.Provider value={{ theme, setOption }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
export default ThemeContext;
