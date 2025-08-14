// src/screens/LoginScreen.tsx

import React, { useState, useContext, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Image,
  TouchableOpacity,
  Animated,
  Easing,
  Keyboard,
  Platform,
  TouchableWithoutFeedback,
} from 'react-native';
import API from '../api/api';
import { AuthContext } from '../context/AuthContext';
import { registerForPushNotificationsAsync } from '../utils/notifications';
import EyeOpen from '../../assets/icons/eye_open';
import EyeClosed from '../../assets/icons/eye_closed';
import { useTheme } from '../context/ThemesContext';
import { lightColors, darkColors, LoginScreenColors } from '../../assets/themes/colors';
import { useTranslation } from 'react-i18next';

const COLLAPSED_HEIGHT = 135;
const EXPANDED_HEIGHT  = 330;

export default function LoginScreen({ navigation }: any) {
  const [showForm, setShowForm]    = useState(false);
  const [email, setEmail]          = useState('');
  const [password, setPassword]    = useState('');
  const [loading, setLoading]      = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const { login }                  = useContext(AuthContext);
  const isIos = Platform.OS === 'ios';

  // 1) Leer tema del contexto
  const { theme } = useTheme(); // 'light' | 'dark'
  const colors: LoginScreenColors =
    theme === 'light'
      ? lightColors.loginScreen
      : darkColors.loginScreen;

  // 2) Inicializar useTranslation:
  const { t } = useTranslation();

  // Animaciones...
  const cardSlide     = useRef(new Animated.Value(300)).current;
  const cardHeight    = useRef(new Animated.Value(COLLAPSED_HEIGHT)).current;
  const formOpacity   = useRef(new Animated.Value(0)).current;
  const formTranslate = useRef(new Animated.Value(50)).current;
  const kbPadding = useRef(new Animated.Value(0)).current;

  useEffect(() => {
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

  const showLoginForm = () => {
    setShowForm(true);
    Animated.parallel([
      Animated.timing(cardHeight, {
        toValue: EXPANDED_HEIGHT,
        duration: 600,
        easing: Easing.out(Easing.ease),
        useNativeDriver: false,
      }),
      Animated.timing(formOpacity, {
        toValue: 1,
        duration: 600,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(formTranslate, {
        toValue: 0,
        duration: 600,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert(t('login.errorTitle'), t('login.fillAllFields'));
      return;
    }
    try {
      setLoading(true);
      const res = await API.post('/auth/login', { email, password });
      await login(res.data.token);
      const pushToken = await registerForPushNotificationsAsync();
      if (pushToken) {
        await API.post('/auth/save-push-token', { pushToken });
      }
      setEmail('');
      setPassword('');
    } catch (err: any) {
      console.error(err);
      Alert.alert(
        t('login.errorTitle'),
        err.response?.data?.error || t('login.loginFailed')
      );
    } finally {
      setLoading(false);
    }
  };

  // 3) Crear estilos dinámicos
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.containerBg,
    },
    logoContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    logo: {
      width: '60%',
      height: 160,
    },
    pushView: {
      flex: 0,
      width: '100%',
      justifyContent: 'flex-end',
    },
    cardWrapper: {
      alignItems: 'center',
      width: '100%',
    },
    card: {
      width: '100%',
      backgroundColor: colors.cardBg,
      borderTopLeftRadius: 50,
      borderTopRightRadius: 50,
      padding: 40,
      alignItems: 'center',
      overflow: 'hidden',
    },
    formContainer: {
      width: '100%',
      gap: 12,
      alignItems: 'center',
    },
    input: {
      width: '100%',
      height: 50,
      borderWidth: 1,
      borderColor: colors.inputBorder,
      borderRadius: 15,
      paddingHorizontal: 10,
      backgroundColor: colors.inputBg,
      color: colors.textDefault,
    },
    passwordWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      width: '100%',
      backgroundColor: colors.passwordWrapperBg,
      borderWidth: 1,
      borderColor: colors.inputBorder,
      borderRadius: 15,
      paddingHorizontal: 10,
      height: 50,
      marginBottom: 12,
    },
    inputPassword: {
      flex: 1,
      height: '100%',
      color: colors.textDefault,
    },
    buttonPrimary: {
      width: '100%',
      backgroundColor: colors.buttonPrimaryBg,
      paddingVertical: 12,
      borderRadius: 25,
      alignItems: 'center',
      marginBottom: 10,
    },
    buttonPrimaryText: {
      color: colors.buttonPrimaryText,
      fontSize: 16,
      fontWeight: 'bold',
    },
    buttonSecondary: {
      width: '100%',
      borderWidth: 1.5,
      borderColor: colors.buttonSecondaryBorder,
      paddingVertical: 12,
      borderRadius: 25,
      alignItems: 'center',
    },
    buttonSecondaryText: {
      color: colors.buttonSecondaryText,
      fontSize: 16,
    },
  });

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.container}>
        {/* Logo */}
        <View style={styles.logoContainer}>
          <Image
            source={require('../../assets/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        {/* Empuja con padding sólo en iOS */}
        <Animated.View
          style={[
            styles.pushView,
            isIos && { paddingBottom: kbPadding },
          ]}
        >
          {/* Slide-in wrapper */}
          <Animated.View
            style={[
              styles.cardWrapper,
              { transform: [{ translateY: cardSlide }] },
            ]}
          >
            {/* Card con altura animada */}
            <Animated.View style={[styles.card, { height: cardHeight }]}>
              {showForm ? (
                <Animated.View
                  style={[
                    styles.formContainer,
                    {
                      opacity: formOpacity,
                      transform: [{ translateY: formTranslate }],
                    },
                  ]}
                >
                  <TextInput
                    placeholder={t('login.emailPlaceholder')}
                    placeholderTextColor={colors.textDefault + '99'}
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    style={styles.input}
                  />
                  <View style={styles.passwordWrapper}>
                    <TextInput
                      placeholder={t('login.passwordPlaceholder')}
                      placeholderTextColor={colors.textDefault + '99'}
                      value={password}
                      onChangeText={setPassword}
                      secureTextEntry={!passwordVisible}
                      style={styles.inputPassword}
                    />
                    <TouchableOpacity onPress={() => setPasswordVisible(v => !v)}>
                      {passwordVisible ? (
                        <EyeOpen
                          width={24}
                          height={24}
                          stroke={colors.eyeColor}
                          fill="none"
                        />
                      ) : (
                        <EyeClosed
                          width={24}
                          height={24}
                          stroke={colors.eyeColor}
                          fill="none"
                        />
                      )}
                    </TouchableOpacity>
                  </View>
                  {loading ? (
                    <ActivityIndicator size="large" color={colors.activityIndicator} />
                  ) : (
                    <TouchableOpacity
                      style={styles.buttonPrimary}
                      onPress={handleLogin}
                    >
                      <Text style={styles.buttonPrimaryText}>
                        {t('login.loginButton')}
                      </Text>
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity
                    style={styles.buttonSecondary}
                    onPress={() => navigation.replace('Register')}
                  >
                    <Text style={styles.buttonSecondaryText}>
                      {t('login.noAccountRegister')}
                    </Text>
                  </TouchableOpacity>
                </Animated.View>
              ) : (
                <TouchableOpacity
                  style={styles.buttonPrimary}
                  onPress={showLoginForm}
                >
                  <Text style={styles.buttonPrimaryText}>
                    {t('login.start')}
                  </Text>
                </TouchableOpacity>
              )}
            </Animated.View>
          </Animated.View>
        </Animated.View>
      </View>
    </TouchableWithoutFeedback>
  );
}
