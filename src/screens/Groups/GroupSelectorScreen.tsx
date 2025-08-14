// src/screens/GroupSelector.tsx

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
import { useTranslation } from 'react-i18next';
import GroupIcon from '../../../assets/icons/GroupIcon';
import { lightColors, darkColors, GroupSelectorColors } from '../../../assets/themes/colors';

type ApiGroup = {
  _id: string;
  name: string;
  locked: boolean;
};

type FavItem = {
  kind: 'Device' | 'Group';
  item: {
    _id: string;
    name: string;
  };
};

type MeResponse = {
  favoriteMain: FavItem | null;
  favoriteList: FavItem[];
};

type Params = {
  mode: 'principal' | 'list';
};

export default function GroupSelector() {
  const navigation = useNavigation<any>();
  const { params } = useRoute<RouteProp<Record<string, Params>, string>>();
  const { t } = useTranslation();
  const { dark } = useTheme();
  const colors: GroupSelectorColors = dark
    ? darkColors.groupSelector
    : lightColors.groupSelector;

  const [groups, setGroups] = useState<ApiGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [mainFavorite, setMainFavorite] = useState<FavItem | null>(null);
  const [listFavorites, setListFavorites] = useState<FavItem[]>([]);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const [grpRes, meRes] = await Promise.all([
          API.get<ApiGroup[]>('/groups/my'),
          API.get<MeResponse>('/auth/me'),
        ]);
        setGroups(grpRes.data);
        setMainFavorite(meRes.data.favoriteMain);
        setListFavorites(meRes.data.favoriteList);
      } catch (err) {
        console.error(err);
        Alert.alert(t('groups.errorTitle'), t('groups.loadError'));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const mainGroupId =
    mainFavorite?.kind === 'Group' ? mainFavorite.item._id : null;
  const listGroupIds = listFavorites
    .filter((f) => f.kind === 'Group')
    .map((f) => f.item._id);

  const eligibleGroups = groups.filter((g) => {
    const notMain = !mainGroupId || g._id !== mainGroupId;
    const notInList = !listGroupIds.includes(g._id);
    return notMain && (params.mode === 'list' ? notInList : true);
  });

  const onSelect = async (g: ApiGroup) => {
    try {
      if (params.mode === 'principal') {
        await API.patch('/auth/favorite-main', {
          kind: 'Group',
          itemId: g._id,
        });
        Alert.alert(t('groups.successTitle'), t('groups.groupMarkedPrincipal'));
      } else {
        await API.post('/auth/favorite-list', {
          kind: 'Group',
          itemId: g._id,
        });
        Alert.alert(t('groups.successTitle'), t('groups.groupMarkedList'));
      }
      navigation.goBack();
    } catch (error: any) {
      console.error(error);
      Alert.alert(
        t('groups.errorTitle'),
        error.response?.data?.error || t('groups.addFavoriteError')
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
        data={eligibleGroups}
        keyExtractor={(g) => g._id}
        contentContainerStyle={[styles.list, { backgroundColor: colors.listBg }]}
        renderItem={({ item }) => {
          const isLocked = item.locked;
          return (
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
                <GroupIcon width={32} height={32} color={colors.iconColor} stroke={4} />
              </View>
              <View style={styles.textColumn}>
                <Text style={[styles.name, { color: colors.nameText }]}>
                  {item.name}
                </Text>
                <Text style={[styles.sub, { color: colors.subText }]}>
                  {t('groups.status')} {isLocked ? t('groups.locked') : t('groups.unlocked')}
                </Text>
              </View>
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={
          <View style={[styles.center, { backgroundColor: colors.containerBg }]}>
            <Text style={[styles.emptyText, { color: colors.emptyText }]}>
              {t('groups.noGroups')}
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
          {t('groups.cancel')}
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 40 },
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
