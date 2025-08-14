// src/i18n.ts

import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';

// Importar tus JSON de traducción
import en from '../../assets/locales/en.json';
import es from '../../assets/locales/es.json';
import ru from '../../assets/locales/ru.json';

// Leer el locale crudo (en formato "es-ES", "en-US", "ru-RU", etc.)
// Si no existe, caemos a 'en'
const rawLocale = Localization.locale ?? 'en';
// Tomamos sólo el código de idioma (los primeros 2 caracteres)
const language = rawLocale.substring(0, 2).toLowerCase(); 

// Inicializar i18next
i18next
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      es: { translation: es },
      ru: { translation: ru },
    },
    // Si rawLocale="es-AR" => language="es"
    // Si no coincide, fallback a 'en'
    lng: ['en', 'es', 'ru'].includes(language) ? language : 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18next;
