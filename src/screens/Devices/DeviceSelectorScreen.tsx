// src/screens/DeviceSelector.tsx

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  StyleSheet,
  Alert,
} from 'react-native';
import API from '../../api/api';
import { useNavigation, useRoute, RouteProp, useTheme } from '@react-navigation/native';
import DeviceIcon from '../../../assets/icons/DeviceIcon';
import { useTranslation } from 'react-i18next';
import { lightColors, darkColors, DeviceSelectorColors } from '../../../assets/themes/colors';

type ApiDevice = {
  _id: string;
  name: string;
  lockActive: boolean;
  group?: string | null;
};

type FavItem = {
  kind: 'Device' | 'Group';
  item: { _id: string; name: string };
};

type MeResponse = {
  favoriteMain: FavItem | null;
  favoriteList: FavItem[];
};

type Params = {
  mode: 'principal' | 'list';
};

export default function DeviceSelector() {
  const navigation = useNavigation<any>();
  const { params } = useRoute<RouteProp<Record<string, Params>, string>>();
  const { t } = useTranslation();
  const { dark } = useTheme();
  const colors: DeviceSelectorColors = dark
    ? darkColors.deviceSelector
    : lightColors.deviceSelector;

  const [devices, setDevices] = useState<ApiDevice[]>([]);
  const [loading, setLoading] = useState(true);
  const [mainFavorite, setMainFavorite] = useState<FavItem | null>(null);
  const [listFavorites, setListFavorites] = useState<FavItem[]>([]);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const [devRes, meRes] = await Promise.all([
          API.get<ApiDevice[]>('/devices/my'),
          API.get<MeResponse>('/auth/me'),
        ]);
        setDevices(devRes.data);
        setMainFavorite(meRes.data.favoriteMain);
        setListFavorites(meRes.data.favoriteList);
      } catch (err) {
        console.error(err);
        Alert.alert(
          t('deviceSelector.errorLoadDevicesTitle'),
          t('deviceSelector.errorLoadDevicesMessage')
        );
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const mainId = mainFavorite?.item?._id ?? null;
  const listIds = listFavorites
    .filter((f) => f.kind === 'Device')
    .map((f) => f.item._id);

  const eligibleDevices = devices.filter((d) => {
    const notInGroup = !d.group;
    const notMain = !mainId || d._id !== mainId;
    const notInList = !listIds.includes(d._id);
    return notInGroup && notMain && (params.mode === 'list' ? notInList : true);
  });

  const onSelect = async (d: ApiDevice) => {
    try {
      if (params.mode === 'principal') {
        await API.patch('/auth/favorite-main', { kind: 'Device', itemId: d._id });
        Alert.alert(t('deviceSelector.successTitle'), t('deviceSelector.successMain'));
      } else {
        await API.post('/auth/favorite-list', { kind: 'Device', itemId: d._id });
        Alert.alert(t('deviceSelector.successTitle'), t('deviceSelector.successList'));
      }
      navigation.goBack();
    } catch (error: any) {
      console.error(error);
      Alert.alert(
        t('deviceSelector.errorAddTitle'),
        t('deviceSelector.errorAddMessage')
      );
    }
  };

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: colors.containerBg }]}>
        <ActivityIndicator size="large" color={colors.activityIndicator} />
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.containerBg }]}>
      <FlatList
        data={eligibleDevices}
        keyExtractor={(d) => d._id}
        contentContainerStyle={[styles.list, { backgroundColor: colors.listBg }]}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.row,
              {
                backgroundColor: colors.rowBg,
                shadowColor: colors.rowShadowColor,
              },
            ]}
            onPress={() => onSelect(item)}
            activeOpacity={0.7}
          >
            <View style={[styles.iconContainer, { backgroundColor: colors.iconContainerBg }]}>
              <DeviceIcon width={32} height={32} color={colors.iconColor} stroke={1.7} />
            </View>
            <View style={styles.textColumn}>
              <Text style={[styles.name, { color: colors.nameText }]}>{item.name}</Text>
              <Text style={[styles.sub, { color: colors.subText }]}>
                {item.lockActive
                  ? t('deviceSelector.statusLocked')
                  : t('deviceSelector.statusUnlocked')}
              </Text>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={[styles.center, { backgroundColor: colors.containerBg }]}>
            <Text style={[styles.emptyText, { color: colors.emptyText }]}>
              {t('deviceSelector.emptyMessage')}
            </Text>
          </View>
        }
      />

      <TouchableOpacity
        style={[styles.back, { backgroundColor: colors.backBg }]}
        onPress={() => navigation.goBack()}
        activeOpacity={0.7}
      >
        <Text style={[styles.backText, { color: colors.backText }]}>
          {t('deviceSelector.cancel')}
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 40},
  list: { padding: 20 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 24,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  textColumn: { flex: 1 },
  name: { fontSize: 18, fontWeight: '600' },
  sub: { fontSize: 14, marginTop: 6 },
  emptyText: { fontSize: 14 },
  back: {
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: 'center',
    margin: 20,
  },
  backText: { fontSize: 16, fontWeight: '500' },
});
