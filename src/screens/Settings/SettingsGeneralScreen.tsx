// src/screens/Settings/SettingsGeneralScreen.tsx

import React, { useContext, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Platform,
  Modal,
  TouchableWithoutFeedback,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import BackIcon from '../../../assets/icons/BackIcon';
import AccountIcon from '../../../assets/icons/AccountIcon';
import ThemeIcon from '../../../assets/icons/ThemeIcon';
import LanguageIcon from '../../../assets/icons/LanguageIcon';
import TermsIcon from '../../../assets/icons/TermsIcon';
import HelpIcon from '../../../assets/icons/HelpIcon';
import LogOutIcon from '../../../assets/icons/LogOutIcon';
import { AuthContext } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';
import i18next from 'i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../../context/ThemesContext';
import { lightColors, darkColors, SettingsGeneralColors } from '../../../assets/themes/colors';

type ThemeOption = 'light' | 'dark' | 'auto';

const SettingsGeneralScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { logout } = useContext(AuthContext);
  const { t } = useTranslation();
  const { theme, setOption } = useTheme(); // 'light' | 'dark'
  const colors: SettingsGeneralColors =
    theme === 'light'
      ? lightColors.settingsGeneral
      : darkColors.settingsGeneral;

  // Modal de idioma
  const [modalLangVisible, setModalLangVisible] = useState(false);
  // Modal de tema
  const [modalThemeVisible, setModalThemeVisible] = useState(false);
  // Lee la preferencia actual de AsyncStorage para tema
  const [currentOption, setCurrentOption] = useState<ThemeOption>('auto');

  React.useEffect(() => {
    (async () => {
      const saved = await AsyncStorage.getItem('USER_THEME_OPTION');
      if (saved === 'light' || saved === 'dark' || saved === 'auto') {
        setCurrentOption(saved as ThemeOption);
      }
    })();
  }, []);

  const handleBack = () => navigation.goBack();

  // Cambiar idioma (igual que antes)
  const changeLanguage = async (lang: 'en' | 'es' | 'ru') => {
    try {
      await i18next.changeLanguage(lang);
      await AsyncStorage.setItem('language', lang);
    } catch (e) {
      console.warn('Error al cambiar idioma:', e);
    } finally {
      setModalLangVisible(false);
    }
  };

  // Cambiar tema y cerrar modal
  const changeTheme = async (opt: ThemeOption) => {
    try {
      setCurrentOption(opt);
      setOption(opt); // guarda en AsyncStorage o borra en caso 'auto'
    } catch (e) {
      console.warn('Error al cambiar tema:', e);
    } finally {
      setModalThemeVisible(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.containerBg }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.headerBg }]}>
        <TouchableOpacity onPress={handleBack}>
          <BackIcon width={28} height={28} color={colors.iconTint} stroke={2.2} />
        </TouchableOpacity>

        <Text style={[styles.headerTitle, { color: colors.headerText }]}>
          {t('settingsGeneral.headerTitle')}
        </Text>

        <View style={{ width: 28 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Manage */}
        <Text style={[styles.sectionTitle, { color: colors.sectionTitle }]}>
          {t('settingsGeneral.sectionManage')}
        </Text>
        <View style={[styles.card, { backgroundColor: colors.cardBg }]}>
          <TouchableOpacity style={styles.row} onPress={() => navigation.navigate('SettingsAccount')}>
            <AccountIcon width={27} height={27} color={colors.iconTint} />
            <Text style={[styles.rowText, { color: colors.rowText }]}>
              {t('settingsGeneral.account')}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Preferences */}
        <Text style={[styles.sectionTitle, { color: colors.sectionTitle }]}>
          {t('settingsGeneral.sectionPreferences')}
        </Text>
        <View style={[styles.card, { backgroundColor: colors.cardBg }]}>
          {/* oprimir para abrir modalTheme */}
          <TouchableOpacity
            style={styles.row}
            onPress={() => setModalThemeVisible(true)}
          >
            <ThemeIcon width={27} height={27} color={colors.iconTint} />
            <Text style={[styles.rowText, { color: colors.rowText, marginLeft: 12 }]}>
              {t('settingsGeneral.theme')}
            </Text>
          </TouchableOpacity>

          <View style={[styles.separator, { backgroundColor: colors.separator }]} />

          <TouchableOpacity
            style={styles.row}
            onPress={() => setModalLangVisible(true)}
          >
            <LanguageIcon width={27} height={27} color={colors.iconTint} />
            <Text style={[styles.rowText, { color: colors.rowText, marginLeft: 12 }]}>
              {t('settingsGeneral.language')}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Other */}
        <Text style={[styles.sectionTitle, { color: colors.sectionTitle }]}>
          {t('settingsGeneral.sectionOther')}
        </Text>
        <View style={[styles.card, { backgroundColor: colors.cardBg }]}>
          <TouchableOpacity style={styles.row} onPress={() => navigation.navigate('SettingsPrivacy')}>
            <TermsIcon width={27} height={27} color={colors.iconTint} />
            <Text style={[styles.rowText, { color: colors.rowText, marginLeft: 12 }]}>
              {t('settingsGeneral.privacy')}
            </Text>
          </TouchableOpacity>

          <View style={[styles.separator, { backgroundColor: colors.separator }]} />

          <TouchableOpacity
            style={styles.row}
            onPress={() => navigation.navigate('Help')}
          >
            <HelpIcon width={27} height={27} color={colors.iconTint} />
            <Text style={[styles.rowText, { color: colors.rowText, marginLeft: 12 }]}>
              {t('settingsGeneral.help')}
            </Text>
          </TouchableOpacity>

          <View style={[styles.separator, { backgroundColor: colors.separator }]} />

          <TouchableOpacity style={styles.row} onPress={logout}>
            <LogOutIcon width={27} height={27} color={colors.iconTint} />
            <Text style={[styles.rowText, { color: colors.rowText, marginLeft: 12 }]}>
              {t('settingsGeneral.logout')}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Modal de IDIOMA */}
      <Modal
        visible={modalLangVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalLangVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setModalLangVisible(false)}>
          <View style={[styles.modalOverlay, { backgroundColor: colors.modalOverlayBg }]} />
        </TouchableWithoutFeedback>
        <View style={[styles.modalContainer, { backgroundColor: colors.modalContainerBg }]}>
          <Text style={[styles.modalTitle, { color: colors.modalTitle }]}>
            {t('settingsGeneral.chooseLanguage')}
          </Text>

          <TouchableOpacity
            style={styles.modalOption}
            onPress={() => changeLanguage('en')}
          >
            <Text style={[styles.modalOptionText, { color: colors.modalOptionText }]}>
              {t('settingsGeneral.modalEnglish')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.modalOption}
            onPress={() => changeLanguage('es')}
          >
            <Text style={[styles.modalOptionText, { color: colors.modalOptionText }]}>
              {t('settingsGeneral.modalSpanish')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.modalOption}
            onPress={() => changeLanguage('ru')}
          >
            <Text style={[styles.modalOptionText, { color: colors.modalOptionText }]}>
              {t('settingsGeneral.modalRussian')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.modalOption, styles.modalCancel]}
            onPress={() => setModalLangVisible(false)}
          >
            <Text style={[styles.modalOptionText, { color: colors.modalCancelText }]}>
              {t('settingsGeneral.cancel')}
            </Text>
          </TouchableOpacity>
        </View>
      </Modal>

      {/* Modal de TEMA */}
      <Modal
        visible={modalThemeVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalThemeVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setModalThemeVisible(false)}>
          <View style={[styles.modalOverlay, { backgroundColor: colors.modalOverlayBg }]} />
        </TouchableWithoutFeedback>
        <View style={[styles.modalContainer, { backgroundColor: colors.modalContainerBg }]}>
          <Text style={[styles.modalTitle, { color: colors.modalTitle }]}>
            {t('settingsGeneral.chooseTheme')}
          </Text>


          <TouchableOpacity
            style={styles.modalOption}
            onPress={() => changeTheme('light')}
          >
            <Text style={[styles.modalOptionText, { color: colors.modalOptionText }]}>
              {t('settingsGeneral.modalLight')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.modalOption}
            onPress={() => changeTheme('dark')}
          >
            <Text style={[styles.modalOptionText, { color: colors.modalOptionText }]}>
              {t('settingsGeneral.modalDark')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.modalOption, styles.modalCancel]}
            onPress={() => setModalThemeVisible(false)}
          >
            <Text style={[styles.modalOptionText, { color: colors.modalCancelText }]}>
              {t('settingsGeneral.cancel')}
            </Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingTop: Platform.select({ ios: 20, android: 30, default: 20 }),
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: { fontSize: 20, fontWeight: 'bold' },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
    marginTop: 16,
  },
  card: {
    borderRadius: 16,
    padding: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    marginLeft: 30,
  },
  rowText: { fontSize: 14 },
  separator: {
    width: '85%',
    height: 1,
    marginVertical: 5,
    alignSelf: 'center',
  },
  /* Modal */
  modalOverlay: {
    flex: 1,
  },
  modalContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 24,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  modalOption: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  modalOptionText: {
    fontSize: 16,
    textAlign: 'center',
  },
  modalCancel: {
    borderBottomWidth: 0,
    marginTop: 10,
  },
  modalCancelText: {
    fontWeight: '500',
  },
});

export default SettingsGeneralScreen;
