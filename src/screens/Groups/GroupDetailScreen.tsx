// src/screens/GroupDetailScreen.tsx

import React, { useEffect, useState, useContext } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
  Modal,
  TextInput,
  Pressable,
  Alert,
  Platform,
} from 'react-native';
import { useRoute, useNavigation, useTheme } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import API from '../../api/api';
import { AuthContext } from '../../context/AuthContext';

import NotificationIcon from '../../../assets/icons/NotificationIcon';
import GroupIcon from '../../../assets/icons/GroupIcon';
import DeviceIcon from '../../../assets/icons/DeviceIcon';
import AddIcon from '../../../assets/icons/AddIcon';
import DeleteIcon from '../../../assets/icons/TrashIcon';
import LockBlocked from '../../../assets/icons/LockBlocked';
import LockOpen from '../../../assets/icons/LockOpen';
import BackIcon from '../../../assets/icons/BackIcon';

import { lightColors, darkColors, GroupDetailColors } from '../../../assets/themes/colors';

const { width } = Dimensions.get('window');
const CARD_PADDING = 20;
const BUTTON_HEIGHT = 48;

interface Event {
  _id: string;
  date: string;
  device: { name: string; serialNumber: string };
}
interface Device {
  _id: string;
  name: string;
  serialNumber: string;
}

export default function GroupDetailScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { logout } = useContext(AuthContext);
  const { t } = useTranslation();
  const { dark } = useTheme();
  const colors: GroupDetailColors = dark
    ? darkColors.groupDetail
    : lightColors.groupDetail;

  const { groupId } = route.params;

  const [events, setEvents] = useState<Event[]>([]);
  const [devices, setDevices] = useState<Device[]>([]);
  const [availableDevices, setAvailableDevices] = useState<Device[]>([]);
  const [groupLocked, setGroupLocked] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [loading, setLoading] = useState(true);

  // Modal state for renaming
  const [renameModalVisible, setRenameModalVisible] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');

  const [addModalVisible, setAddModalVisible] = useState(false);

  useEffect(() => {
    fetchData();
    fetchAvailableDevices();
  }, [groupId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [evRes, dvRes, grRes] = await Promise.all([
        API.get(`/groups/${groupId}/events`),
        API.get(`/groups/${groupId}/devices`),
        API.get(`/groups/${groupId}`),
      ]);
      setEvents(evRes.data);
      setDevices(dvRes.data);
      setGroupLocked(grRes.data.locked);
      setGroupName(grRes.data.name);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableDevices = async () => {
    try {
      const res = await API.get('/devices/my');
      setAvailableDevices(res.data.filter((d: any) => !d.group));
    } catch (err) {
      console.error(err);
    }
  };

  const handleBack = () => navigation.goBack();

  const handleGroupAction = async (action: 'lock' | 'unlock' | 'delete') => {
    try {
      if (action === 'delete') {
        const confirm = await new Promise(resolve =>
          Alert.alert(
            t('groupDetail.confirmTitle'),
            t('groupDetail.confirmDelete'),
            [
              { text: t('groupDetail.cancel'), style: 'cancel', onPress: () => resolve(false) },
              { text: t('groupDetail.delete'), style: 'destructive', onPress: () => resolve(true) },
            ]
          )
        );
        if (!confirm) return;
      }
      const endpoint =
        action === 'delete'
          ? `/groups/${groupId}`
          : `/groups/${groupId}/${action}`;
      const method = action === 'delete' ? 'delete' : 'post';
      await (API as any)[method](endpoint);
      if (action === 'delete') navigation.goBack();
      else fetchData();
    } catch (err: any) {
      console.error(err);
      Alert.alert(t('groupDetail.errorTitle'), t('groupDetail.addFavoriteError'));
    }
  };

  const handleAddDevice = async (deviceIdParam?: string) => {
    const idToAdd = deviceIdParam ?? '';
    if (!idToAdd) {
      return Alert.alert(t('groupDetail.errorTitle'), t('groupDetail.selectDevice'));
    }
    try {
      await API.post(`/groups/${groupId}/add-device`, { deviceId: idToAdd });
      Alert.alert(t('groupDetail.successTitle'), t('groupDetail.deviceAdded'));
      fetchData();
      fetchAvailableDevices();
    } catch (err) {
      console.error(err);
      Alert.alert(t('groupDetail.errorTitle'), t('groupDetail.addDeviceError'));
    }
  };

  const handleRemoveDevice = async (id: string) => {
    try {
      await API.post(`/groups/${groupId}/remove-device/${id}`);
      Alert.alert(t('groupDetail.successTitle'), t('groupDetail.deviceRemoved'));
      fetchData();
      fetchAvailableDevices();
    } catch (err) {
      console.error(err);
      Alert.alert(t('groupDetail.errorTitle'), t('groupDetail.removeDeviceError'));
    }
  };

  const openRenameModal = () => {
    setNewGroupName(groupName);
    setRenameModalVisible(true);
  };

  const handleRenameGroup = async () => {
    if (!newGroupName.trim()) {
      Alert.alert(t('groupDetail.errorTitle'), t('groupDetail.emptyName'));
      return;
    }
    try {
      await API.patch(`/groups/${groupId}/rename`, { name: newGroupName.trim() });
      // Refrescar datos para que se muestre el nuevo nombre
      await fetchData();
      setRenameModalVisible(false);
      Alert.alert(t('groupDetail.successTitle'), t('groupDetail.nameUpdated'));
    } catch (err) {
      console.error(err);
      Alert.alert(t('groupDetail.errorTitle'), t('groupDetail.renameError'));
    }
  };

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: colors.centerBg }]}>
        <ActivityIndicator size="large" color={colors.activityIndicator} />
      </View>
    );
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.containerBg }]}
    >
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.headerBg }]}>
        <TouchableOpacity onPress={handleBack}>
          <BackIcon
            width={28}
            height={28}
            color={colors.headerIcon}
            stroke={2.2}
          />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.headerTitle }]}>
          {groupName}
        </Text>
        <TouchableOpacity>
          <NotificationIcon width={28} height={28} color={""} stroke={2.2} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Información del grupo + Acciones */}
        <View
          style={[
            styles.card,
            {
              backgroundColor: colors.cardBg,
              shadowColor: colors.cardShadowColor,
            },
          ]}
        >
          <View style={styles.cardHeader}>
            <GroupIcon
              width={24}
              height={24}
              color={colors.groupNameText}
              stroke={2.2}
            />
            <Text style={[styles.cardTitle, { color: colors.cardTitleText }]}>
              {t("groupDetail.groupInfoTitle")}
            </Text>
          </View>
          <Text style={[styles.status, { color: colors.statusText }]}>
            {t("groupDetail.status")}{" "}
            {groupLocked ? t("groupDetail.locked") : t("groupDetail.unlocked")}
          </Text>

          {/* Inline row: botón de renombrar, lock/unlock, delete */}
          <View style={styles.inlineActions}>
            <TouchableOpacity
              style={[
                styles.buttonPrimary,
                { backgroundColor: colors.buttonPrimaryBg, flex: 1 },
              ]}
              onPress={openRenameModal}
            >
              <Text
                style={[styles.buttonText, { color: colors.buttonPrimaryText }]}
              >
                {t("groupDetail.renameTitle")}
              </Text>
            </TouchableOpacity>

            {/* Lock/Unlock Button (cuadro con borde y fondo) */}
            <TouchableOpacity
              style={[
                styles.iconButton,
                groupLocked
                  ? {
                      backgroundColor: colors.iconButtonBgLocked,
                      borderColor: colors.iconButtonBorderLocked,
                    }
                  : {
                      backgroundColor: colors.iconButtonBgDefault,
                      borderColor: colors.iconButtonBorderDefault,
                    },
              ]}
              onPress={() => handleGroupAction(groupLocked ? "unlock" : "lock")}
            >
              {groupLocked ? (
                <LockBlocked
                  width={20}
                  height={20}
                  color={colors.iconButtonColorLocked}
                  stroke={7}
                />
              ) : (
                <LockOpen
                  width={20}
                  height={20}
                  color={colors.iconButtonColorUnlocked}
                  stroke={7}
                />
              )}
            </TouchableOpacity>

            {/* Delete Button (cuadro con borde y fondo rojo) */}
            <TouchableOpacity
              style={[
                styles.iconButton,
                {
                  backgroundColor: colors.iconButtonBgDelete,
                  borderColor: colors.iconButtonBorderDelete,
                },
              ]}
              onPress={() => handleGroupAction("delete")}
            >
              <DeleteIcon
                width={20}
                height={20}
                color={colors.iconButtonColorDelete}
                stroke={2.2}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Dispositivos del grupo */}
        <View
          style={[
            styles.card,
            {
              backgroundColor: colors.cardBg,
              shadowColor: colors.cardShadowColor,
            },
          ]}
        >
          <View style={styles.cardHeader}>
            <DeviceIcon
              width={24}
              height={24}
              color={colors.deviceNameText}
              stroke={1.7}
            />
            <Text style={[styles.cardTitle, { color: colors.cardTitleText }]}>
              {t("groupDetail.groupDevicesTitle")}
            </Text>
          </View>
          {devices.length === 0 ? (
            <Text style={[styles.emptyText, { color: colors.emptyText }]}>
              {t("groupDetail.noDevices")}
            </Text>
          ) : (
            devices.map((d, idx) => (
              <View
                key={d._id}
                style={[
                  styles.deviceRow,
                  idx === devices.length - 1 && styles.lastItemSeparator,
                  { borderBottomColor: colors.separatorColor },
                ]}
              >
                <View style={styles.deviceInfo}>
                  <Text
                    style={[
                      styles.deviceName,
                      { color: colors.deviceNameText },
                    ]}
                  >
                    {d.name}
                  </Text>
                  <Text
                    style={[
                      styles.deviceSerial,
                      { color: colors.deviceSerialText },
                    ]}
                  >
                    {t("groupDetail.serial")} {d.serialNumber}
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.iconButtonSmall}
                  onPress={() => handleRemoveDevice(d._id)}
                >
                  <DeleteIcon
                    width={20}
                    height={20}
                    color={colors.iconButtonColorDelete}
                    stroke={2.2}
                  />
                </TouchableOpacity>
              </View>
            ))
          )}
          {/* Botón "Añadir dispositivo" dentro de la card */}
          <View style={{ marginTop: 12 }}>
            <TouchableOpacity
              style={[
                styles.buttonPrimary,
                availableDevices.length === 0 && styles.buttonDisabled,
                {
                  backgroundColor:
                    availableDevices.length === 0
                      ? colors.buttonDisabledBg
                      : colors.buttonPrimaryBg,
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                },
              ]}
              onPress={() => setAddModalVisible(true)}
              disabled={availableDevices.length === 0}
            >
              <AddIcon
                width={20}
                height={20}
                color={
                  availableDevices.length === 0
                    ? colors.buttonDisabledText
                    : colors.buttonPrimaryText
                }
                stroke={2}
              />
              <Text
                style={[
                  styles.buttonText,
                  {
                    color:
                      availableDevices.length === 0
                        ? colors.buttonDisabledText
                        : colors.buttonPrimaryText,
                    marginLeft: 8,
                  },
                ]}
              >
                {t("groupDetail.addDevice")}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Historial de eventos */}
        <View
          style={[
            styles.card,
            {
              backgroundColor: colors.cardBg,
              shadowColor: colors.cardShadowColor,
            },
          ]}
        >
          <View style={styles.cardHeader}>
            <NotificationIcon
              width={24}
              height={24}
              color={colors.groupNameText}
              stroke={2.2}
            />
            <Text style={[styles.cardTitle, { color: colors.cardTitleText }]}>
              {t("groupDetail.eventHistoryTitle")}
            </Text>
          </View>
          {events.length === 0 ? (
            <Text style={[styles.emptyText, { color: colors.emptyText }]}>
              {t("groupDetail.noEvents")}
            </Text>
          ) : (
            events.map((ev, idx) => (
              <View
                key={ev._id}
                style={[
                  styles.eventRow,
                  idx === events.length - 1 && styles.lastItemSeparator,
                  { borderBottomColor: colors.separatorColor },
                ]}
              >
                <NotificationIcon
                  width={16}
                  height={16}
                  color={colors.eventIconRegistered}
                  stroke={2}
                />
                <View style={styles.eventInfo}>
                  <Text
                    style={[
                      styles.deviceName,
                      { color: colors.deviceNameText },
                    ]}
                  >
                    {ev.device.name}
                  </Text>
                  <Text
                    style={[
                      styles.eventDate,
                      { color: colors.deviceSerialText },
                    ]}
                  >
                    {new Date(ev.date).toLocaleString()}
                  </Text>
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>

      {/* Modal para seleccionar dispositivo */}
      <Modal
        transparent
        visible={addModalVisible}
        animationType="fade"
        onRequestClose={() => setAddModalVisible(false)}
      >
        <View
          style={[
            styles.modalOverlay,
            { backgroundColor: colors.modalOverlayBg },
          ]}
        >
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={() => setAddModalVisible(false)}
          />
          <View
            style={[
              styles.modalContent,
              { backgroundColor: colors.modalContentBg },
            ]}
          >
            {availableDevices.length === 0 ? (
              <Text style={[styles.modalText, { color: colors.modalText }]}>
                {t("groupDetail.noAvailableDevices")}
              </Text>
            ) : (
              availableDevices.map((dev) => (
                <TouchableOpacity
                  key={dev._id}
                  style={[
                    styles.modalButton,
                    { backgroundColor: colors.modalButtonBg },
                  ]}
                  onPress={() => {
                    setAddModalVisible(false);
                    handleAddDevice(dev._id);
                  }}
                >
                  <Text style={[styles.modalText, { color: colors.modalText }]}>
                    {dev.name}
                  </Text>
                </TouchableOpacity>
              ))
            )}
          </View>
        </View>
      </Modal>

      {/* Modal para renombrar grupo */}
      <Modal
        transparent
        animationType="slide"
        visible={renameModalVisible}
        onRequestClose={() => setRenameModalVisible(false)}
      >
        <View
          style={[
            styles.modalOverlay,
            { backgroundColor: colors.modalOverlayBg },
          ]}
        >
          <View
            style={[
              styles.renameModalContent,
              { backgroundColor: colors.renameModalContentBg },
            ]}
          >
            <Text style={[styles.modalTitle, { color: colors.modalTitleText }]}>
              {t("groupDetail.renameTitle")}
            </Text>
            <TextInput
              style={[
                styles.modalInput,
                {
                  backgroundColor: colors.modalInputBg,
                  borderColor: colors.modalInputBorder,
                },
              ]}
              value={newGroupName}
              onChangeText={setNewGroupName}
              placeholder={t("groupDetail.renameTitle")}
              placeholderTextColor={colors.modalText}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity onPress={() => setRenameModalVisible(false)}>
                <Text
                  style={[
                    styles.modalCancel,
                    { color: colors.modalCancelText },
                  ]}
                >
                  {t("groupDetail.cancel")}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleRenameGroup}>
                <Text
                  style={[styles.modalSave, { color: colors.modalSaveText }]}
                >
                  {t("groupDetail.save")}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingTop: Platform.select({ ios: 20, android: 30, default: 20 }),
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: { fontSize: 20, fontWeight: 'bold' },
  scrollContent: { paddingBottom: 20 },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    margin: 16,
    borderRadius: 16,
    padding: CARD_PADDING,
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },
  status: { fontSize: 16, marginBottom: 12 },
  inlineActions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  buttonPrimary: {
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: 'center',
  },
  buttonDisabled: {
    /* backgroundColor dinámico en código */
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 8,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 16,
  },
  buttonText: { fontSize: 16, fontWeight: 'bold' },
  emptyText: {
    textAlign: 'center',
    fontStyle: 'italic',
    marginBottom: 12,
  },
  deviceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 0.5,
    /* borderBottomColor dinámico en código */
  },
  eventRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 0.5,
    /* borderBottomColor dinámico en código */
  },
  lastItemSeparator: {
    borderBottomWidth: 0,
  },
  deviceInfo: { flex: 1 },
  deviceName: { fontSize: 16, fontWeight: '600' },
  deviceSerial: { fontSize: 14, marginTop: 4 },
  iconButtonSmall: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  eventInfo: { marginLeft: 8 },
  eventDate: { fontSize: 14, marginTop: 4 },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  logoutButton: {
    flex: 1,
    paddingVertical: BUTTON_HEIGHT / 2,
    borderRadius: 25,
    alignItems: 'center',
    marginLeft: 8,
  },
  logoutText: { fontSize: 16, fontWeight: 'bold' },
  /* Modal styles */
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    borderRadius: 16,
    padding: 20,
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
  renameModalContent: {
    width: width * 0.8,
    borderRadius: 16,
    padding: 20,
    /* backgroundColor dinámico en código */
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    /* color dinámico en código */
  },
  modalInput: {
    width: '100%',
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 12,
    marginBottom: 20,
    /* backgroundColor y borderColor dinámicos en código */
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalCancel: {
    fontSize: 16,
    fontWeight: '500',
    /* color dinámico en código */
  },
  modalSave: {
    fontSize: 16,
    fontWeight: '500',
    /* color dinámico en código */
  },
});
