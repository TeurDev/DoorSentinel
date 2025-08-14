// src/screens/Settings/SettingsAccountScreen.tsx

import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Platform,
} from 'react-native';
import { AuthContext } from '../../context/AuthContext';
import API from '../../api/api';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../context/ThemesContext';
import BackIcon from '../../../assets/icons/BackIcon';
import UserIcon from '../../../assets/icons/AccountIcon';
import LockOpen from '../../../assets/icons/LockOpen';
import LockBlocked from '../../../assets/icons/LockBlocked';
import StarIcon from '../../../assets/icons/StarMainIcon';
import StarGroupIcon from '../../../assets/icons/StarGroupIcon';
import { lightColors, darkColors, SettingsGeneralColors } from '../../../assets/themes/colors';
import { useTranslation } from 'react-i18next';

interface FavoriteItem {
  _id: string;
  name: string;
  serialNumber?: string;
  lockActive?: boolean;
  locked?: boolean;
}

interface Favorite {
  kind: string; // "device" or "group"
  item: FavoriteItem | null;
}

interface UserProfile {
  name: string;
  email: string;
  favoriteMain: Favorite | null;
  favoriteList: Favorite[];
}

export default function SettingsAccountScreen() {
  const navigation = useNavigation<any>();
  const { logout } = useContext(AuthContext);
  const { theme } = useTheme();
  const { t } = useTranslation();

  const colors: SettingsGeneralColors =
    theme === 'light'
      ? lightColors.settingsGeneral
      : darkColors.settingsGeneral;

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [deviceCounts, setDeviceCounts] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    const fetchProfileAndCounts = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await API.get('/auth/me');

        const rawMain = res.data.favoriteMain;
        const rawList = res.data.favoriteList;
        const favoriteMain: Favorite | null = rawMain && rawMain.item
          ? { kind: rawMain.kind ?? '', item: rawMain.item }
          : null;
        const favoriteList: Favorite[] = Array.isArray(rawList)
          ? rawList.map((f: any) => ({ kind: f.kind ?? '', item: f.item ?? null }))
          : [];

        setProfile({
          name: res.data.name ?? '',
          email: res.data.email ?? '',
          favoriteMain,
          favoriteList,
        });

        const counts: { [key: string]: number } = {};
        const countDevicesForGroup = async (groupId: string) => {
          try {
            const resp = await API.get(`/groups/${groupId}/devices`);
            return Array.isArray(resp.data) ? resp.data.length : 0;
          } catch {
            return 0;
          }
        };

        const promises: Promise<void>[] = [];
        if (favoriteMain?.kind.toLowerCase() === 'group' && favoriteMain.item) {
          const gid = favoriteMain.item._id;
          promises.push(
            countDevicesForGroup(gid).then(cnt => { counts[gid] = cnt; })
          );
        }
        for (const fav of favoriteList) {
          if (fav.kind.toLowerCase() === 'group' && fav.item) {
            const gid = fav.item._id;
            promises.push(
              countDevicesForGroup(gid).then(cnt => { counts[gid] = cnt; })
            );
          }
        }
        await Promise.all(promises);
        setDeviceCounts(counts);

      } catch (err: any) {
        const message = err.response?.data?.error || t('settingsAccount.errorProfile');
        setError(message);
        setProfile(null);
        Alert.alert(t('settingsAccount.errorTitle'), message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileAndCounts();
  }, [t]);

  const handleBack = () => navigation.goBack();

  if (loading) {
    return (
      <View style={[styles.centered, { backgroundColor: colors.containerBg }]}>  
        <ActivityIndicator size="large" color={colors.headerText} />
      </View>
    );
  }

  if (!profile) {
    return (
      <View style={[styles.centered, { backgroundColor: colors.containerBg }]}>  
        <Text style={[styles.errorText, { color: colors.headerText }]}>  
          {error || t('settingsAccount.unexpectedError')}
        </Text>
      </View>
    );
  }

  const name = profile.name;
  const email = profile.email;
  const favoriteMain = profile.favoriteMain;
  const favoriteList = profile.favoriteList;

  const renderFavoriteCard = (fav: Favorite) => {
    if (!fav.item) return null;
    const kindLower = (fav.kind || '').toLowerCase();
    const isGroup = kindLower === 'group';
    const isDevice = kindLower === 'device';
    const count = isGroup ? deviceCounts[fav.item._id] : undefined;
    const tipo = isDevice
      ? t('settingsAccount.device')
      : isGroup
        ? t('settingsAccount.group')
        : fav.kind;

    return (
      <View key={fav.item._id} style={[
        styles.card,
        { backgroundColor: colors.cardBg, borderColor: colors.separator },
      ]}>
        <View style={styles.cardRow}>
          <Text style={[styles.cardLabel, { color: colors.rowText }]}>  
            {t('settingsAccount.type')}:
          </Text>
          <Text style={[styles.cardValue, { color: colors.headerText }]}>  
            {tipo}
          </Text>
        </View>

        <View style={styles.cardRow}>
          <Text style={[styles.cardLabel, { color: colors.rowText }]}>  
            {t('settingsAccount.name')}:
          </Text>
          <Text style={[styles.cardValue, { color: colors.headerText }]}>  
            {fav.item.name}
          </Text>
        </View>

        {!isGroup && fav.item.serialNumber && (
          <View style={styles.cardRow}>
            <Text style={[styles.cardLabel, { color: colors.rowText }]}>  
              {t('settingsAccount.serial')}:
            </Text>
            <Text style={[styles.cardValue, { color: colors.headerText }]}>  
              {fav.item.serialNumber}
            </Text>
          </View>
        )}

        {isGroup && (
          <View style={styles.cardRow}>
            <Text style={[styles.cardLabel, { color: colors.rowText }]}>  
              {t('settingsAccount.deviceCount')}:
            </Text>
            <Text style={[
              styles.cardValue,
              { color: count === undefined ? colors.rowText : colors.headerText }
            ]}>
              {count !== undefined ? count : t('settingsAccount.loading')}
            </Text>
          </View>
        )}

        {(isGroup || isDevice) && (
          <View style={styles.cardRow}>
            {((isGroup ? fav.item.locked : fav.item.lockActive)) ? (
              <LockBlocked width={18} height={18} color={colors.rowText} />
            ) : (
              <LockOpen width={18} height={18} color={colors.rowText} />
            )}
            <Text style={[
              styles.cardValue,
              { color: colors.headerText, marginLeft: 6 }
            ]}>
              {(isGroup ? fav.item.locked : fav.item.lockActive)
                ? t('settingsAccount.locked')
                : t('settingsAccount.unlocked')}
            </Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.containerBg }]}>  
      <View style={[styles.header, { backgroundColor: colors.headerBg }]}>  
        <TouchableOpacity onPress={handleBack}>
          <BackIcon width={28} height={28} color={colors.headerText} stroke={2.2} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.headerText }]}>  
          {t('settingsAccount.headerTitle')}
        </Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.profileHeader}>
          <View style={[styles.avatarContainer, { borderColor: colors.separator }]}>  
            <UserIcon width={90} height={90} color={colors.iconTint} stroke={1.1} />
          </View>
          <Text style={[styles.profileName, { color: colors.headerText }]}>  
            {name}
          </Text>
          <Text style={[styles.profileEmail, { color: colors.rowText }]}>  
            {email}
          </Text>
        </View>

        <View style={[styles.separator, { backgroundColor: colors.separator }]} />

        {favoriteMain && favoriteMain.item && (
          <>  
            <View style={styles.sectionHeader}>
              <StarIcon width={20} height={20} color={colors.iconTint} />
              <Text style={[styles.sectionTitle, { color: colors.sectionTitle }]}>  
                {t('settingsAccount.primaryFavorite')}
              </Text>
            </View>
            {renderFavoriteCard(favoriteMain)}
          </>
        )}

        {favoriteList.length > 0 &&(
          <>  
            <View style={styles.sectionHeader}>
              <StarGroupIcon width={20} height={20} color={colors.iconTint} />
              <Text style={[styles.sectionTitle, { color: colors.sectionTitle }]}>  
                {t('settingsAccount.myFavorites')}
              </Text>
            </View>
            {favoriteList.map(fav => renderFavoriteCard(fav))}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  header: {
    paddingTop: Platform.select({ ios: 20, android: 30, default: 20 }),
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: { fontSize: 20, fontWeight: 'bold' },
  container: { padding: 20, paddingBottom: 40 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorText: { fontSize: 16, textAlign: 'center' },
  profileHeader: { alignItems: 'center', marginBottom: 20 },
  avatarContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  profileName: { fontSize: 22, fontWeight: '600' },
  profileEmail: { fontSize: 14, marginTop: 4, fontStyle: 'italic' },
  separator: { height: 1, marginVertical: 10, width: '100%' },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', marginTop: 15, marginBottom: 8 },
  sectionTitle: { fontSize: 18, fontWeight: '600', marginLeft: 8 },
  card: { borderRadius: 16, padding: 15, borderWidth: 1, marginBottom: 12 },
  cardRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  cardLabel: { fontSize: 14, marginRight: 6 },
  cardValue: { fontSize: 14 },
});
