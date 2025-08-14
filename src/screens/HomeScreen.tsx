// src/screens/HomeScreen.tsx

import React, {
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  PanResponder,
  Dimensions,
  Pressable,
  Modal,
  ActivityIndicator,
  Alert,
  SafeAreaView,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from '../context/AuthContext';
import API from '../api/api';
import { useNavigation, useFocusEffect, useTheme } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import {
  GestureHandlerRootView,
  Swipeable,
} from 'react-native-gesture-handler';
import { LinearGradient } from 'expo-linear-gradient';

import LockBlocked from '../../assets/icons/LockBlocked';
import LockOpen from '../../assets/icons/LockOpen';
import Notification from '../../assets/icons/NotificationIcon';
import MenuIcon from '../../assets/icons/MenuIcon';
import StarIcon from '../../assets/icons/StarIcon';
import GridIcon from '../../assets/icons/GridIcon';
import SelectMain from '../../assets/icons/SelectMain';
import DeviceIcon from '../../assets/icons/DeviceIcon';
import GroupIcon from '../../assets/icons/GroupIcon';
import DeleteIcon from '../../assets/icons/TrashIcon';
import AddIcon from '../../assets/icons/AddIcon';
import Add2Icon from '../../assets/icons/Add2Icon';

import { lightColors, darkColors } from '../../assets/themes/colors';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH * 0.8;
const ACTION_WIDTH = CARD_WIDTH * 0.25;
const COLLAPSED_HEIGHT = 80;
const EXPANDED_HEIGHT = SCREEN_HEIGHT * 0.35;
const STORAGE_KEY = 'HomeScreen:isListView';

type FavoriteKind = 'Device' | 'Group';
type FavItem = {
  kind: FavoriteKind;
  item: {
    _id: string;
    name: string;
    serialNumber?: string;
    lockActive?: boolean;
    locked?: boolean;
  };
};

export default function HomeScreen() {
  const navigation = useNavigation<any>();
  const { logout } = useContext(AuthContext);
  const { t } = useTranslation();

  // 1) Usar useTheme para detectar claro/oscuro:
  const { dark } = useTheme();
  const colors = dark
    ? darkColors.homeScreen
    : lightColors.homeScreen;

  const [isListView, setIsListView] = useState(false);
  const [mainFavorite, setMainFavorite] = useState<FavItem | null>(null);
  const [listFavorites, setListFavorites] = useState<FavItem[]>([]);
  const [loadingFavs, setLoadingFavs] = useState(true);

  const [catModalVisible, setCatModalVisible] = useState(false);
  const [selectingMain, setSelectingMain] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((v) => {
      if (v === 'true' || v === 'false') {
        setIsListView(v === 'true');
      }
    });
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchFavorites();
    }, [])
  );

  const fetchFavorites = async () => {
    try {
      setLoadingFavs(true);
      const res = await API.get('/auth/me');
      setMainFavorite(res.data.favoriteMain ?? null);
      setListFavorites(res.data.favoriteList ?? []);
    } catch (err: any) {
      console.error(err);
      Alert.alert(
        t('home.errorLoadFavsTitle'),
        t('home.errorLoadFavsMessage')
      );
    } finally {
      setLoadingFavs(false);
    }
  };

  const toggleView = (list: boolean) => {
    setIsListView(list);
    AsyncStorage.setItem(STORAGE_KEY, list ? 'true' : 'false').catch(() => {});
  };

  const onPressAddSlot = () => {
    setSelectingMain(false);
    setCatModalVisible(true);
  };

  const onPressEditMain = () => {
    setSelectingMain(true);
    setCatModalVisible(true);
  };

  // Determina si el favorito principal está bloqueado
  const mainActive = mainFavorite?.item
    ? mainFavorite.kind === 'Device'
      ? !!mainFavorite.item.lockActive
      : !!mainFavorite.item.locked
    : false;

  const handleToggleMainLock = async () => {
    if (!mainFavorite?.item) return;
    const { kind, item } = mainFavorite;
    try {
      if (kind === 'Device') {
        const current = !!item.lockActive;
        await API.patch(`/devices/lock/${item._id}`, { lockActive: !current });
        setMainFavorite((prev) =>
          prev ? { ...prev, item: { ...prev.item, lockActive: !current } } : prev
        );
      } else {
        const current = !!item.locked;
        const action = current ? 'unlock' : 'lock';
        await API.post(`/groups/${item._id}/${action}`);
        setMainFavorite((prev) =>
          prev ? { ...prev, item: { ...prev.item, locked: !current } } : prev
        );
      }
    } catch (err: any) {
      console.error(err);
      Alert.alert(
        t('home.errorToggleStateTitle'),
        err.response?.data?.error || t('home.errorToggleStateMessage')
      );
    }
  };

  const handleToggleListLock = async (fav: FavItem) => {
    const { kind, item } = fav;
    try {
      if (kind === 'Device') {
        const current = !!item.lockActive;
        await API.patch(`/devices/lock/${item._id}`, { lockActive: !current });
        setListFavorites((prev) =>
          prev.map((f) =>
            f.item._id === item._id
              ? { ...f, item: { ...f.item, lockActive: !current } }
              : f
          )
        );
      } else {
        const current = !!item.locked;
        const action = current ? 'unlock' : 'lock';
        await API.post(`/groups/${item._id}/${action}`);
        setListFavorites((prev) =>
          prev.map((f) =>
            f.item._id === item._id
              ? { ...f, item: { ...f.item, locked: !current } }
              : f
          )
        );
      }
    } catch (err: any) {
      console.error(err);
      Alert.alert(
        t('home.errorToggleStateTitle'),
        err.response?.data?.error || t('home.errorToggleStateMessage')
      );
    }
  };

  // Prepara la lista para renderizar (añade un slot vacío si hay menos de 4)
  const listToRender = isListView
    ? [...listFavorites, ...(listFavorites.length < 4 ? [null] : [])]
    : [];

  // Drawer lógica
  const drawerHeight = useRef(new Animated.Value(COLLAPSED_HEIGHT)).current;
  const startHeight = useRef(COLLAPSED_HEIGHT);
  const [isDrawerExpanded, setIsDrawerExpanded] = useState(false);
  const collapseDrawer = () => {
    Animated.spring(drawerHeight, {
      toValue: COLLAPSED_HEIGHT,
      tension: 80,
      friction: 12,
      useNativeDriver: false,
    }).start(() => setIsDrawerExpanded(false));
  };
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dy) > 10,
      onPanResponderGrant: () =>
        drawerHeight.stopAnimation((v) => (startHeight.current = v)),
      onPanResponderMove: (_, g) => {
        let nh = startHeight.current - g.dy;
        nh = Math.max(Math.min(nh, EXPANDED_HEIGHT), COLLAPSED_HEIGHT);
        drawerHeight.setValue(nh);
      },
      onPanResponderRelease: (_, g) => {
        const midpoint = (COLLAPSED_HEIGHT + EXPANDED_HEIGHT) / 2;
        const open = startHeight.current - g.dy > midpoint;
        Animated.spring(drawerHeight, {
          toValue: open ? EXPANDED_HEIGHT : COLLAPSED_HEIGHT,
          tension: 80,
          friction: 12,
          useNativeDriver: false,
        }).start(() => setIsDrawerExpanded(open));
      },
    })
  ).current;
  const contentOpacity = drawerHeight.interpolate({
    inputRange: [COLLAPSED_HEIGHT, COLLAPSED_HEIGHT + 20],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const handleDeleteFavorite = (fav: FavItem) => {
    Alert.alert(
      t('home.confirmDeleteTitle'),
      t('home.confirmDeleteMessage', { name: fav.item.name }),
      [
        { text: t('home.cancel'), style: 'cancel' },
        {
          text: t('home.delete'),
          style: 'destructive',
          onPress: async () => {
            try {
              await API.delete(`/auth/favorite-list/${fav.item._id}`);
              fetchFavorites();
            } catch (err: any) {
              console.error(err);
              Alert.alert('Error', 'No se pudo eliminar de favoritos');
            }
          },
        },
      ]
    );
  };

  const renderRightActions = (fav: FavItem) => (
    <View style={{ width: ACTION_WIDTH, marginBottom: 12 }}>
      <TouchableOpacity
        style={[
          styles.deleteAction,
          { backgroundColor: colors.deleteActionBg },
        ]}
        onPress={() => handleDeleteFavorite(fav)}
        activeOpacity={0.7}
      >
        <DeleteIcon width={24} height={24} color="#FFF" stroke={2.2} />
      </TouchableOpacity>
    </View>
  );

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <LinearGradient
        colors={[colors.gradientStart, colors.gradientEnd]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={{ flex: 1 }}
      >
        <SafeAreaView style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => navigation.navigate('SettingsGeneral')}
            >
              <MenuIcon width={30} height={30} color={colors.headerIcon} stroke={2.2} />
            </TouchableOpacity>
            <TouchableOpacity>{/*  onPress={() => navigation.navigate('Groups')} */}
              <Notification width={30} height={30} color={''} stroke={2.2} />
            </TouchableOpacity>
          </View>

          {/* Category Modal */}
          <Modal
            transparent
            visible={catModalVisible}
            animationType="fade"
            onRequestClose={() => setCatModalVisible(false)}
          >
            <View style={[styles.modalOverlay, { backgroundColor: colors.modalOverlayBg }]}>
              <Pressable
                style={StyleSheet.absoluteFill}
                onPress={() => setCatModalVisible(false)}
              />
              <View style={[styles.modalContent, { backgroundColor: colors.modalContentBg }]}>
                <TouchableOpacity
                  style={[styles.modalButton, { backgroundColor: colors.modalButtonBg }]}
                  onPress={() => {
                    setCatModalVisible(false);
                    navigation.navigate('DeviceSelector', {
                      mode: selectingMain ? 'principal' : 'list',
                    });
                  }}
                >
                  <Text style={[styles.modalText, { color: colors.modalText }]}>
                    {t('home.device')}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, { backgroundColor: colors.modalButtonBg }]}
                  onPress={() => {
                    setCatModalVisible(false);
                    navigation.navigate('GroupSelector', {
                      mode: selectingMain ? 'principal' : 'list',
                    });
                  }}
                >
                  <Text style={[styles.modalText, { color: colors.modalText }]}>
                    {t('home.group')}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

          {/* Selector + Content */}
          <View style={styles.wrapper}>
            <View style={[styles.selectorContainer, { backgroundColor: colors.selectorContainerBg }]}>
              <TouchableOpacity
                style={[
                  styles.selectorButton,
                  { backgroundColor: colors.selectorButtonBg },
                  !isListView && { backgroundColor: colors.selectorButtonActiveBg },
                ]}
                onPress={() => toggleView(false)}
              >
                <StarIcon
                  width={24}
                  height={24}
                  color={!isListView ? colors.selectorIconActive : colors.selectorIconInactive}
                  stroke={2.2}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.selectorButton,
                  { backgroundColor: colors.selectorButtonBg },
                  isListView && { backgroundColor: colors.selectorButtonActiveBg },
                ]}
                onPress={() => toggleView(true)}
              >
                <GridIcon
                  width={24}
                  height={24}
                  color={isListView ? colors.selectorIconActive : colors.selectorIconInactive}
                  stroke={2.2}
                />
              </TouchableOpacity>
            </View>

            {isListView ? (
              loadingFavs ? (
                <ActivityIndicator
                  size="large"
                  color={colors.activityIndicator}
                  style={{ marginTop: 20 }}
                />
              ) : (
                <View style={styles.favListColumn}>
                  {listToRender.map((fav, idx) => {
                    if (!fav) {
                      return (
                        <TouchableOpacity
                          key={`slot-${idx}`}
                          style={[
                            styles.emptyCard,
                            {
                              borderColor: colors.emptyCardBorder,
                              backgroundColor: colors.emptyCardBg,
                            },
                          ]}
                          onPress={onPressAddSlot}
                          activeOpacity={0.7}
                        >
                          <AddIcon
                            width={32}
                            height={32}
                            color={colors.selectorIconInactive}
                            stroke={1.7}
                          />
                        </TouchableOpacity>
                      );
                    }
                    const isActive =
                      fav.kind === 'Device'
                        ? fav.item.lockActive
                        : fav.item.locked;
                    return (
                      <Swipeable
                        key={fav.item._id}
                        overshootRight={false}
                        renderRightActions={() => renderRightActions(fav)}
                      >
                        <View
                          style={[
                            styles.statusCard,
                            { backgroundColor: colors.favListCardBg },
                          ]}
                        >
                          <View style={styles.listIconContainer}>
                            {fav.kind === 'Device' ? (
                              <DeviceIcon
                                width={32}
                                height={32}
                                color={colors.headerIcon2}
                                stroke={1.7}
                              />
                            ) : (
                              <GroupIcon
                                width={32}
                                height={32}
                                color={colors.headerIcon2}
                                stroke={4}
                              />
                            )}
                          </View>
                          <View style={styles.cardInfo}>
                            <Text style={[styles.deviceName, { color: colors.favListText }]}>
                              {fav.item.name}
                            </Text>
                            <Text
                              style={[
                                styles.deviceStatus,
                                isActive
                                  ? { color: colors.favListStatusActive }
                                  : { color: colors.favListStatusInactive },
                              ]}
                            >
                              {t(isActive ? 'home.statusLocked' : 'home.statusUnlocked')}
                            </Text>
                          </View>
                          <TouchableOpacity
                            onPress={() => handleToggleListLock(fav)}
                            activeOpacity={0.7}
                          >
                            <View
                              style={[
                                styles.iconWrapper,
                                {
                                  borderColor: isActive
                                    ? colors.iconWrapperBorderActive
                                    : colors.iconWrapperBorderInactive,
                                  backgroundColor: isActive
                                    ? colors.iconWrapperBgActive
                                    : colors.iconWrapperBgInactive,
                                },
                              ]}
                            >
                              {isActive ? (
                                <LockBlocked
                                  width={32}
                                  height={32}
                                  color={colors.favListStatusActive}
                                  stroke={6}
                                />
                              ) : (
                                <LockOpen
                                  width={32}
                                  height={32}
                                  color={colors.selectorIconInactive}
                                  stroke={6}
                                />
                              )}
                            </View>
                          </TouchableOpacity>
                        </View>
                      </Swipeable>
                    );
                  })}
                </View>
              )
            ) : (
              <>
                {!loadingFavs ? (
                  mainFavorite?.item ? (
                    <TouchableOpacity
                      style={[
                        styles.lockCircle,
                        {
                          borderColor: mainActive
                            ? colors.lockCircleBorderActive
                            : colors.lockCircleBorderInactive,
                          borderWidth: 4,
                        },
                      ]}
                      activeOpacity={0.7}
                      onPress={handleToggleMainLock}
                    >
                      {mainActive ? (
                        <LockBlocked
                          width={60}
                          height={60}
                          color={colors.favListStatusActive}
                          stroke={6}
                        />
                      ) : (
                        <LockOpen
                          width={60}
                          height={60}
                          color={colors.selectorIconInactive}
                          stroke={6}
                        />
                      )}
                    </TouchableOpacity>
                  ) : (
                    <>
                      <LinearGradient
                        colors={[colors.lockCircleBgGradientStart, colors.lockCircleBgGradientEnd]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 0, y: 1 }}
                        style={styles.lockCircle}
                      >
                        <TouchableOpacity
                          style={[
                            styles.lockCircle,
                            {
                              backgroundColor: 'transparent',
                              borderColor: colors.selectorIconInactive,
                              borderWidth: 4,
                            },
                          ]}
                          activeOpacity={0.7}
                          onPress={() => {
                            setSelectingMain(true);
                            setCatModalVisible(true);
                          }}
                        >
                          <Add2Icon
                            width={60}
                            height={60}
                            color={colors.selectorIconInactive}
                            stroke={2}
                          />
                        </TouchableOpacity>
                      </LinearGradient>
                      <Text style={[styles.noMainText, { color: colors.noMainText }]}>
                        {t('home.noMainFavorite')}
                      </Text>
                    </>
                  )
                ) : (
                  <View style={styles.lockIconPlaceholder} />
                )}

                {mainFavorite?.item && !loadingFavs && (
                  <TouchableOpacity
                    style={[styles.mainCard, { backgroundColor: colors.mainCardBg }]}
                    onPress={onPressEditMain}
                    activeOpacity={0.7}
                  >
                    <View style={styles.mainIconContainer}>
                      {mainFavorite.kind === 'Device' ? (
                        <DeviceIcon
                          width={32}
                          height={32}
                          color={colors.headerIcon2}
                          stroke={1.7}
                        />
                      ) : (
                        <GroupIcon
                          width={32}
                          height={32}
                          color={colors.headerIcon2}
                          stroke={4}
                        />
                      )}
                    </View>
                    <View style={styles.mainTextContainer}>
                      <Text style={[styles.mainTitle, { color: colors.mainTitle }]}>
                        {mainFavorite.item.name}
                      </Text>
                      <Text style={[styles.mainSubtitle, { color: colors.mainSubtitle }]}>
                        {t(mainActive ? 'home.statusLocked' : 'home.statusUnlocked')}
                      </Text>
                    </View>
                    <SelectMain width={24} height={24} color={colors.headerIcon} stroke={2.2} />
                  </TouchableOpacity>
                )}
              </>
            )}
          </View>

          {/* Backdrop drawer */}
          {isDrawerExpanded && (
            <Pressable
              style={StyleSheet.absoluteFill}
              onPress={collapseDrawer}
            />
          )}

          {/* Bottom drawer */}
          <Animated.View
            style={[
              styles.drawer,
              { height: drawerHeight, backgroundColor: colors.drawerBg },
            ]}
            {...panResponder.panHandlers}
          >
            <View style={[styles.handle, { backgroundColor: colors.handleBg }]} />
            <Animated.View
              style={[styles.drawerContent, { opacity: contentOpacity }]}
            >
              <View style={styles.drawerButtonsRow}>
                <TouchableOpacity
                  style={[styles.drawerItemLarge, { backgroundColor: colors.drawerItemBg }]}
                  onPress={() => navigation.navigate('Devices')}
                >
                  <View style={styles.drawerIconPlaceholderLarge}>
                    <DeviceIcon
                      width={45}
                      height={45}
                      color={colors.headerIcon2}
                      stroke={1.7}
                    />
                  </View>
                  <Text style={[styles.drawerLabelLarge, { color: colors.drawerLabel }]}>
                    {t('home.drawerDevices')}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.drawerItemLarge, { backgroundColor: colors.drawerItemBg }]}
                  onPress={() => navigation.navigate('Groups')}
                >
                  <View style={styles.drawerIconPlaceholderLarge}>
                    <GroupIcon
                      width={45}
                      height={45}
                      color={colors.headerIcon2}
                      stroke={4}
                    />
                  </View>
                  <Text style={[styles.drawerLabelLarge, { color: colors.drawerLabel }]}>
                    {t('home.drawerGroups')}
                  </Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          </Animated.View>
        </SafeAreaView>
      </LinearGradient>
    </GestureHandlerRootView>
  );
}


const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Platform.select({ ios: 20, android: 30, default: 20 }),
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    borderRadius: 16,
    padding: 20,
    zIndex: 1,
  },
  modalButton: {
    width: '100%',
    paddingVertical: 12,
    borderRadius: 12,
    marginVertical: 8,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 16,
    fontWeight: '500',
  },
  wrapper: {
    position: 'absolute',
    top: '30%',
    width: '100%',
    alignItems: 'center',
  },
  selectorContainer: {
    flexDirection: 'row',
    width: 100,
    justifyContent: 'space-around',
    paddingVertical: 4,
    borderRadius: 25,
    marginBottom: 16,
  },
  selectorButton: {
    padding: 8,
    borderRadius: 25,
  },
  favListColumn: {
    width: '80%',
    alignSelf: 'center',
  },
  statusCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  listIconContainer: {
    marginRight: 12,
  },
  cardInfo: {
    flex: 1,
    marginRight: 12,
  },
  deviceName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  deviceStatus: {
    fontSize: 14,
  },
  emptyCard: {
    borderWidth: 2,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 12,
    alignItems: 'center',
    justifyContent: 'center',
    height: 70,
  },
  iconWrapper: {
    width: 56,
    height: 56,
    borderRadius: 12,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lockCircle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lockIconPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: '#A495D6',
  },
  mainCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginBottom: 20,
    marginTop: 20,
    width: '80%',
    alignSelf: 'center',
  },
  mainIconContainer: {
    marginRight: 12,
  },
  mainTextContainer: {
    flex: 1,
  },
  mainTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  mainSubtitle: {
    fontSize: 14,
  },
  drawer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 10,
  },
  handle: {
    width: 140,
    height: 6,
    borderRadius: 3,
    alignSelf: 'center',
    marginVertical: 8,
    marginTop: 10,
  },
  drawerContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  deleteAction: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-end',
    borderRadius: 12,
    paddingEnd: 25,
  },
  noMainText: {
    marginTop: 8,
    fontSize: 14,
    textAlign: 'center',
  },
  drawerButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  drawerItemLarge: {
    width: '45%',
    borderRadius: 16,
    paddingVertical: 24,
    alignItems: 'center',
  },
  drawerIconPlaceholderLarge: {
    width: 56,
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  drawerLabelLarge: {
    width: '85%',
    marginTop: 0,
    fontSize: 16,
    textAlign: 'center',
  },
});
