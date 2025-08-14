// src/screens/RegisterScreen.tsx

import React, { useState, useRef, useEffect, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Image,
  TouchableOpacity,
  Keyboard,
  Platform,
  TouchableWithoutFeedback,
  Animated,
  Easing,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import API from '../api/api';
import { AuthContext } from '../context/AuthContext';
import EyeOpen from '../../assets/icons/eye_open';
import EyeClosed from '../../assets/icons/eye_closed';
import { registerForPushNotificationsAsync } from '../utils/notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../context/ThemesContext';
import { lightColors, darkColors, RegisterScreenColors } from '../../assets/themes/colors';

const COLLAPSED_HEIGHT = 300; // no lo usas aquí, pero mantenemos animación
export default function RegisterScreen({ navigation }: any) {
  const { t } = useTranslation();

  const [name, setName]                       = useState('');
  const [email, setEmail]                     = useState('');
  const [confirmEmail, setConfirmEmail]       = useState('');
  const [password, setPassword]               = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading]                 = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);

  const { login } = useContext(AuthContext);

  // flags de error
  const [errName, setErrName]                   = useState(false);
  const [errEmail, setErrEmail]                 = useState(false);
  const [errConfirmEmail, setErrConfirmEmail]   = useState(false);
  const [errPassword, setErrPassword]           = useState(false);
  const [errConfirmPassword, setErrConfirmPassword] = useState(false);

  const isIos = Platform.OS === 'ios';

  // validaciones
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

  // animaciones
  const cardSlide = useRef(new Animated.Value(300)).current;
  const kbPadding = useRef(new Animated.Value(0)).current;

  // Tema dinámico
  const { theme } = useTheme(); // 'light' | 'dark'
  const colors: RegisterScreenColors =
    theme === 'light'
      ? lightColors.registerScreen
      : darkColors.registerScreen;

  useEffect(() => {
    // animación de slide-in
    Animated.timing(cardSlide, {
      toValue: 0,
      duration: 500,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();

    if (isIos) {
      const showEvt = 'keyboardWillShow';
      const hideEvt = 'keyboardWillHide';

      const subShow = Keyboard.addListener(showEvt, (e: any) => {
        Animated.timing(kbPadding, {
          toValue: e.endCoordinates.height,
          duration: e.duration,
          easing: Easing.out(Easing.ease),
          useNativeDriver: false,
        }).start();
      });
      const subHide = Keyboard.addListener(hideEvt, (e: any) => {
        Animated.timing(kbPadding, {
          toValue: 0,
          duration: e.duration,
          easing: Easing.out(Easing.ease),
          useNativeDriver: false,
        }).start();
      });
      return () => {
        subShow.remove();
        subHide.remove();
      };
    }
  }, []);

  const handleRegister = async () => {
    // resetear flags de error
    setErrName(false);
    setErrEmail(false);
    setErrConfirmEmail(false);
    setErrPassword(false);
    setErrConfirmPassword(false);

    // validar vacíos
    let hasError = false;
    if (!name.trim())        { setErrName(true); hasError = true; }
    if (!email.trim())       { setErrEmail(true); hasError = true; }
    if (!confirmEmail.trim()){ setErrConfirmEmail(true); hasError = true; }
    if (!password)           { setErrPassword(true); hasError = true; }
    if (!confirmPassword)    { setErrConfirmPassword(true); hasError = true; }
    if (hasError) return;

    // validar formato email
    if (!emailRegex.test(email)) {
      setErrEmail(true);
      Alert.alert(t('register.errorTitle'), t('register.invalidEmail'));
      return;
    }
    // validar match email
    if (email.trim() !== confirmEmail.trim()) {
      setErrEmail(true);
      setErrConfirmEmail(true);
      Alert.alert(t('register.errorTitle'), t('register.emailsDontMatch'));
      return;
    }
    // validar patrón contraseña
    if (!passwordRegex.test(password)) {
      setErrPassword(true);
      Alert.alert(t('register.errorTitle'), t('register.weakPassword'));
      return;
    }
    // validar match contraseña
    if (password !== confirmPassword) {
      setErrPassword(true);
      setErrConfirmPassword(true);
      Alert.alert(t('register.errorTitle'), t('register.passwordsDontMatch'));
      return;
    }

    // todo correcto, enviar al backend
    try {
      setLoading(true);

      // 1. Registrar usuario
      await API.post('/auth/register', { name, email, password });

      // 2. Marcar como no visto WelcomeHelp
      await AsyncStorage.setItem('hasSeenWelcome', 'false');

      // 3. Login automático
      const loginRes = await API.post('/auth/login', { email, password });
      await login(loginRes.data.token);

      // 4. Registrar Push Token
      const pushToken = await registerForPushNotificationsAsync();
      if (pushToken) {
        try {
          await API.post('/auth/save-push-token', { pushToken });
        } catch (err) {
          console.warn('Error guardando push token:', err);
        }
      }

      // 5. Limpiar campos
      setName('');
      setEmail('');
      setConfirmEmail('');
      setPassword('');
      setConfirmPassword('');

      // 6. Redirigir a WelcomeHelp (opcional)
      // navigation.reset({ index: 0, routes: [{ name: 'WelcomeHelp' }] });

    } catch (err: any) {
      console.error('Error en el registro:', err.response?.data || err.message);
      Alert.alert(
        t('register.errorTitle'),
        err.response?.data?.error || t('register.registrationFailed')
      );
    } finally {
      setLoading(false);
    }
  };

  // 2) Crear estilos dinámicos usando los colores de la paleta
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.containerBg,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    logo: {
      width: '60%',
      height: 120,
      marginBottom: 20,
    },
    card: {
      width: '100%',
      backgroundColor: colors.cardBg,
      borderRadius: 20,
      padding: 30,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOpacity: 0.1,
      shadowRadius: 10,
      elevation: 5,
      marginBottom: 20,
    },
    title: {
      fontSize: 22,
      fontWeight: 'bold',
      color: colors.titleText,
      marginBottom: 20,
    },
    input: {
      width: '100%',
      height: 50,
      borderWidth: 1,
      borderColor: colors.inputBorder,
      borderRadius: 10,
      paddingHorizontal: 15,
      backgroundColor: colors.inputBg,
      marginBottom: 15,
      color: colors.titleText,
    },
    inputError: {
      borderColor: colors.inputErrorBorder,
    },
    passwordWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      width: '100%',
      borderWidth: 1,
      borderColor: colors.inputBorder,
      borderRadius: 10,
      paddingHorizontal: 15,
      backgroundColor: colors.passwordWrapperBg,
      marginBottom: 15,
      height: 50,
    },
    inputPassword: {
      flex: 1,
      height: '100%',
      color: colors.titleText,
    },
    buttonPrimary: {
      width: '100%',
      backgroundColor: colors.buttonPrimaryBg,
      paddingVertical: 14,
      borderRadius: 25,
      alignItems: 'center',
      marginBottom: 10,
    },
    buttonPrimaryText: {
      color: colors.buttonPrimaryText,
      fontSize: 16,
      fontWeight: 'bold',
    },
    linkText: {
      color: colors.linkText,
      textAlign: 'center',
      marginTop: 10,
      textDecorationLine: 'underline',
    },
    errorText: {
      color: colors.errorText,
      marginBottom: 10,
    },
  });

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <Animated.View style={[styles.container, isIos && { paddingBottom: kbPadding }]}>
        {/* Logo */}
        <Image
          source={require('../../assets/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />

        <Animated.View style={[styles.card, { transform: [{ translateY: cardSlide }] }]}>
          {/* Título */}
          <Text style={styles.title}>{t('register.title')}</Text>

          {/* Input Nombre */}
          <TextInput
            placeholder={t('register.namePlaceholder')}
            placeholderTextColor={errName ? colors.errorText : colors.inputPlaceholder}
            value={name}
            onChangeText={setName}
            style={[styles.input, errName && styles.inputError]}
          />

          {/* Input Email */}
          <TextInput
            placeholder={t('register.emailPlaceholder')}
            placeholderTextColor={errEmail ? colors.errorText : colors.inputPlaceholder}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            style={[styles.input, errEmail && styles.inputError]}
          />

          {/* Input Confirmar Email */}
          <TextInput
            placeholder={t('register.confirmEmailPlaceholder')}
            placeholderTextColor={errConfirmEmail ? colors.errorText : colors.inputPlaceholder}
            value={confirmEmail}
            onChangeText={setConfirmEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            style={[styles.input, errConfirmEmail && styles.inputError]}
          />

          {/* Input Contraseña con ícono para mostrar/esconder */}
          <View style={[styles.passwordWrapper, errPassword && styles.inputError]}>
            <TextInput
              placeholder={t('register.passwordPlaceholder')}
              placeholderTextColor={errPassword ? colors.errorText : colors.inputPlaceholder}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!passwordVisible}
              style={styles.inputPassword}
              textContentType="none"
              autoComplete="off"
              autoCorrect={false}
            />
            <TouchableOpacity onPress={() => setPasswordVisible(v => !v)}>
              {passwordVisible ? (
                <EyeOpen width={24} height={24} color={colors.eyeColor} />
              ) : (
                <EyeClosed width={24} height={24} color={colors.eyeColor} />
              )}
            </TouchableOpacity>
          </View>

          {/* Input Confirmar Contraseña */}
          <TextInput
            placeholder={t('register.confirmPasswordPlaceholder')}
            placeholderTextColor={errConfirmPassword ? colors.errorText : colors.inputPlaceholder}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={!passwordVisible}
            style={[styles.input, errConfirmPassword && styles.inputError]}
            textContentType="none"
            autoComplete="off"
            autoCorrect={false}
          />

          {/* Botón Registrar o spinner */}
          {loading ? (
            <ActivityIndicator size="large" color={colors.activityIndicator} />
          ) : (
            <TouchableOpacity style={styles.buttonPrimary} onPress={handleRegister}>
              <Text style={styles.buttonPrimaryText}>{t('register.registerButton')}</Text>
            </TouchableOpacity>
          )}

          {/* Link a Login */}
          <TouchableOpacity onPress={() => navigation.replace('Login')}>
            <Text style={styles.linkText}>{t('register.haveAccountLogin')}</Text>
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>
    </TouchableWithoutFeedback>
  );
}
