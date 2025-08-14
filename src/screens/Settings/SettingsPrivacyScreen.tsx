// src/screens/Settings/SettingsPrivacyScreen.tsx

import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../context/ThemesContext';
import BackIcon from '../../../assets/icons/BackIcon';
import { lightColors, darkColors, SettingsGeneralColors } from '../../../assets/themes/colors';
import { useTranslation } from 'react-i18next';

export default function SettingsPrivacyScreen() {
  const navigation = useNavigation<any>();
  const { theme } = useTheme();
  const { t } = useTranslation();

  const colors: SettingsGeneralColors =
    theme === 'light'
      ? lightColors.settingsGeneral
      : darkColors.settingsGeneral;

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.containerBg }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.headerBg }]}>
        <TouchableOpacity onPress={handleBack}>
          <BackIcon width={28} height={28} color={colors.headerText} stroke={2.2} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.headerText }]}>
          {t('settingsPrivacy.headerTitle')}
        </Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        {/* Privacy Policy Section */}
        <View style={styles.section}>
          {/* Título grande en negrita */}
          <Text style={[styles.sectionTitle, { color: colors.sectionTitle }]}>
            {t('settingsPrivacy.sectionPrivacy')}
          </Text>

          {/* Párrafo introductorio */}
          <Text style={[styles.paragraph, { color: colors.rowText }]}>
            {t('settingsPrivacy.contentPrivacyIntro')}
          </Text>

          {/* Separador del apartado */}
          <View style={[styles.divider, { backgroundColor: colors.separator }]} />

          {/* Subtítulo en color secundario */}
          <Text style={[styles.subHeading, { color: colors.subheading }]}>
            {t('settingsPrivacy.collectHeading')}
          </Text>
          <Text style={[styles.paragraph, { color: colors.rowText }]}>
            {t('settingsPrivacy.collectText')}
          </Text>
          <View style={styles.bulletContainer}>
            <Text style={[styles.bullet, { color: colors.bullet }]}>
              • {t('settingsPrivacy.collectPoint1')}
            </Text>
            <Text style={[styles.bullet, { color: colors.bullet }]}>
              • {t('settingsPrivacy.collectPoint2')}
            </Text>
            <Text style={[styles.bullet, { color: colors.bullet }]}>
              • {t('settingsPrivacy.collectPoint3')}
            </Text>
          </View>

          <Text style={[styles.subHeading, { color: colors.subheading }]}>
            {t('settingsPrivacy.useHeading')}
          </Text>
          <Text style={[styles.paragraph, { color: colors.rowText }]}>
            {t('settingsPrivacy.useTextIntro')}
          </Text>
          <View style={styles.bulletContainer}>
            <Text style={[styles.bullet, { color: colors.bullet }]}>
              • {t('settingsPrivacy.usePoint1')}
            </Text>
            <Text style={[styles.bullet, { color: colors.bullet }]}>
              • {t('settingsPrivacy.usePoint2')}
            </Text>
            <Text style={[styles.bullet, { color: colors.bullet }]}>
              • {t('settingsPrivacy.usePoint3')}
            </Text>
            <Text style={[styles.bullet, { color: colors.bullet }]}>
              • {t('settingsPrivacy.usePoint4')}
            </Text>
          </View>

          <Text style={[styles.subHeading, { color: colors.subheading }]}>
            {t('settingsPrivacy.sharingHeading')}
          </Text>
          <Text style={[styles.paragraph, { color: colors.rowText }]}>
            {t('settingsPrivacy.sharingTextIntro')}
          </Text>
          <View style={styles.bulletContainer}>
            <Text style={[styles.bullet, { color: colors.bullet }]}>
              • {t('settingsPrivacy.sharingPoint1')}
            </Text>
            <Text style={[styles.bullet, { color: colors.bullet }]}>
              • {t('settingsPrivacy.sharingPoint2')}
            </Text>
            <Text style={[styles.bullet, { color: colors.bullet }]}>
              • {t('settingsPrivacy.sharingPoint3')}
            </Text>
          </View>

          <Text style={[styles.subHeading, { color: colors.subheading }]}>
            {t('settingsPrivacy.securityHeading')}
          </Text>
          <Text style={[styles.paragraph, { color: colors.rowText }]}>
            {t('settingsPrivacy.securityText')}
          </Text>

          <Text style={[styles.subHeading, { color: colors.subheading }]}>
            {t('settingsPrivacy.rightsHeading')}
          </Text>
          <Text style={[styles.paragraph, { color: colors.rowText }]}>
            {t('settingsPrivacy.rightsTextIntro')}
          </Text>
          <View style={styles.bulletContainer}>
            <Text style={[styles.bullet, { color: colors.bullet }]}>
              • {t('settingsPrivacy.rightsPoint1')}
            </Text>
            <Text style={[styles.bullet, { color: colors.bullet }]}>
              • {t('settingsPrivacy.rightsPoint2')}
            </Text>
            <Text style={[styles.bullet, { color: colors.bullet }]}>
              • {t('settingsPrivacy.rightsPoint3')}
            </Text>
            <Text style={[styles.bullet, { color: colors.bullet }]}>
              • {t('settingsPrivacy.rightsPoint4')}
            </Text>
          </View>

          <Text style={[styles.subHeading, { color: colors.subheading }]}>
            {t('settingsPrivacy.retentionHeading')}
          </Text>
          <Text style={[styles.paragraph, { color: colors.rowText }]}>
            {t('settingsPrivacy.retentionText')}
          </Text>

          <Text style={[styles.subHeading, { color: colors.subheading }]}>
            {t('settingsPrivacy.childrenHeading')}
          </Text>
          <Text style={[styles.paragraph, { color: colors.rowText }]}>
            {t('settingsPrivacy.childrenText')}
          </Text>
        </View>

        {/* Separador principal */}
        <View style={[styles.mainDivider, { backgroundColor: colors.separator }]} />

        {/* Terms of Use Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.sectionTitle }]}>
            {t('settingsPrivacy.sectionTerms')}
          </Text>

          <Text style={[styles.paragraph, { color: colors.rowText }]}>
            {t('settingsPrivacy.contentTermsIntro')}
          </Text>

          <Text style={[styles.subHeading, { color: colors.subheading }]}>
            {t('settingsPrivacy.acceptanceHeading')}
          </Text>
          <Text style={[styles.paragraph, { color: colors.rowText }]}>
            {t('settingsPrivacy.acceptanceText')}
          </Text>

          <Text style={[styles.subHeading, { color: colors.subheading }]}>
            {t('settingsPrivacy.accountHeading')}
          </Text>
          <Text style={[styles.paragraph, { color: colors.rowText }]}>
            {t('settingsPrivacy.accountText')}
          </Text>

          <Text style={[styles.subHeading, { color: colors.subheading }]}>
            {t('settingsPrivacy.allowedHeading')}
          </Text>
          <Text style={[styles.paragraph, { color: colors.rowText }]}>
            {t('settingsPrivacy.allowedTextIntro')}
          </Text>
          <View style={styles.bulletContainer}>
            <Text style={[styles.bullet, { color: colors.bullet }]}>
              • {t('settingsPrivacy.allowedPoint1')}
            </Text>
            <Text style={[styles.bullet, { color: colors.bullet }]}>
              • {t('settingsPrivacy.allowedPoint2')}
            </Text>
            <Text style={[styles.bullet, { color: colors.bullet }]}>
              • {t('settingsPrivacy.allowedPoint3')}
            </Text>
          </View>

          <Text style={[styles.subHeading, { color: colors.subheading }]}>
            {t('settingsPrivacy.ipHeading')}
          </Text>
          <Text style={[styles.paragraph, { color: colors.rowText }]}>
            {t('settingsPrivacy.ipText')}
          </Text>

          <Text style={[styles.subHeading, { color: colors.subheading }]}>
            {t('settingsPrivacy.terminationHeading')}
          </Text>
          <Text style={[styles.paragraph, { color: colors.rowText }]}>
            {t('settingsPrivacy.terminationText')}
          </Text>

          <Text style={[styles.subHeading, { color: colors.subheading }]}>
            {t('settingsPrivacy.disclaimerHeading')}
          </Text>
          <Text style={[styles.paragraph, { color: colors.rowText }]}>
            {t('settingsPrivacy.disclaimerText')}
          </Text>

          <Text style={[styles.subHeading, { color: colors.subheading }]}>
            {t('settingsPrivacy.changesHeading')}
          </Text>
          <Text style={[styles.paragraph, { color: colors.rowText }]}>
            {t('settingsPrivacy.changesText')}
          </Text>

          <Text style={[styles.subHeading, { color: colors.subheading }]}>
            {t('settingsPrivacy.lawHeading')}
          </Text>
          <Text style={[styles.paragraph, { color: colors.rowText }]}>
            {t('settingsPrivacy.lawText')}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  header: {
    paddingTop: Platform.select({ ios: 20, android: 30, default: 20 }),
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  container: {
    padding: 20,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  subHeading: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 6,
  },
  paragraph: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  bulletContainer: {
    marginLeft: 12,
    marginBottom: 8,
  },
  bullet: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 4,
  },
  divider: {
    height: 1,
    width: '10%',
    marginVertical: 12,
  },
  mainDivider: {
    height: 1,
    width: '100%',
    marginVertical: 24,
  },
});
