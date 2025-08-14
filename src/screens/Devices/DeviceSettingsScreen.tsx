import React, { useEffect, useState, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  SafeAreaView,
  Alert,
  Modal,
  TextInput,
  Platform,
} from 'react-native';
import API from '../../api/api';
import { useRoute, useNavigation, useTheme } from '@react-navigation/native';
import { AuthContext } from '../../context/AuthContext';

import BackIcon from '../../../assets/icons/BackIcon';
import NotificationIcon from '../../../assets/icons/NotificationIcon';
import DeleteIcon from '../../../assets/icons/TrashIcon';
import LockOpen from '../../../assets/icons/LockOpen';

import { useTranslation } from 'react-i18next'; // <-- importamos useTranslation
import { lightColors, darkColors, DeviceSettingsColors } from '../../../assets/themes/colors';

const { width } = Dimensions.get('window');

type Event = { _id: string; date: string; notified: boolean; };

export default function DeviceSettingsScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { logout } = useContext(AuthContext);
  const { t } = useTranslation(); // <-- obtenemos t()
  const { dark } = useTheme();
  const colors: DeviceSettingsColors = dark
    ? darkColors.deviceSettings
    : lightColors.deviceSettings;

  const { deviceId, deviceName } = route.params;

  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deviceNameLocal, setDeviceNameLocal] = useState(deviceName);
  const [modalVisible, setModalVisible] = useState(false);
  const [newName, setNewName] = useState(deviceName);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const res = await API.get(`/events/device/${deviceId}`);
      setEvents(res.data);
      setError('');
    } catch (err: any) {
      console.error(err);
      setError(t('deviceSettings.errorLoadHistory'));
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => navigation.goBack();

  const handleUnassign = () => {
    Alert.alert(
      t('deviceSettings.warningUnassignTitle'),
      t('deviceSettings.warningUnassignMessage', { name: deviceNameLocal }),
      [
        { text: t('deviceSettings.cancel'), style: 'cancel' },
        {
          text: t('deviceSettings.unassign'),
          style: 'destructive',
          onPress: async () => {
            try {
              await API.post('/devices/unassign', { deviceId });
              Alert.alert(
                t('deviceSettings.successUnassignTitle'),
                t('deviceSettings.successUnassignMessage')
              );
              navigation.goBack();
            } catch (err: any) {
              console.error(err);
              Alert.alert(
                t('deviceSettings.errorUnassignTitle'),
                t('deviceSettings.errorUnassignMessage')
              );
            }
          },
        },
      ]
    );
  };

  const openRenameModal = () => {
    setNewName(deviceNameLocal);
    setModalVisible(true);
  };

  const handleRename = async () => {
    if (!newName.trim()) {
      Alert.alert(
        t('deviceSettings.renameEmptyErrorTitle'),
        t('deviceSettings.renameEmptyErrorMessage')
      );
      return;
    }
    try {
      const res = await API.patch(`/devices/rename/${deviceId}`, { name: newName.trim() });
      setDeviceNameLocal(res.data.device.name);
      setModalVisible(false);
      Alert.alert(
        t('deviceSettings.successRenameTitle'),
        t('deviceSettings.successRenameMessage')
      );
    } catch (err: any) {
      console.error(err);
      Alert.alert(
        t('deviceSettings.errorRenameTitle'),
        t('deviceSettings.errorRenameMessage')
      );
    }
  };

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: colors.centerBg }]}>
        <ActivityIndicator size="large" color={colors.activityIndicator} />
      </View>
    );
  }
  if (error) {
    return (
      <View style={[styles.center, { backgroundColor: colors.centerBg }]}>
        <Text style={[styles.errorText, { color: colors.errorText }]}>{error}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.containerBg }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.headerBg }]}>
        <TouchableOpacity onPress={handleBack}>
          <BackIcon width={28} height={28} color={colors.headerIcon} stroke={2.2} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.headerTitle }]}>
          {deviceNameLocal}
        </Text>
        <TouchableOpacity>
          <NotificationIcon width={28} height={28} color={''} stroke={2.2} />
        </TouchableOpacity>
      </View>

      {/* Actions: Rename & Unassign */}
      <View style={[styles.actionsContainer, { backgroundColor: colors.headerBg }]}>
        <TouchableOpacity style={[styles.renameButton, { backgroundColor: colors.primaryButtonBg }]} onPress={openRenameModal}>
          <Text style={[styles.buttonText, { color: colors.primaryButtonText }]}>
            {t('deviceSettings.renameTitle')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.dangerButton, { backgroundColor: colors.errorText }]} onPress={handleUnassign}>
          <DeleteIcon width={16} height={16} color="#fff" stroke={2.2} />
          <Text style={[styles.buttonText, { marginLeft: 6 }]}>
            {t('deviceSettings.unassign')}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView style={styles.content}>
        <View style={[styles.card, { backgroundColor: colors.cardBg, shadowColor: colors.cardShadowColor }]}>
          <Text style={[styles.cardTitle, { color: colors.cardTitleText }]}>
            {t('deviceSettings.eventHistory')} {/* El título permanece literal “Historial de Aperturas” */}
          </Text>
          {events.length === 0 ? (
            <Text style={[styles.emptyText, { color: colors.emptyText }]}>{t('deviceSettings.emptyHistory')}</Text>
          ) : (
            events.map(e => {
              const dateStr = new Date(e.date).toLocaleString();
              return (
                <View
                  key={e._id}
                  style={[
                    styles.eventRow,
                    { borderColor: colors.eventBorderColor },
                  ]}
                >
                  <Text style={[styles.eventDate, { color: colors.eventDateText }]}>{dateStr}</Text>
                  <View style={styles.eventStatusRow}>
                    <NotificationIcon
                      width={20}
                      height={20}
                      color={e.notified ? colors.eventIconNotified : colors.eventIconRegistered}
                      stroke={e.notified ? 3 : 2}
                    />
                    <Text
                      style={[
                        styles.eventStatusText,
                        e.notified
                          ? { color: colors.eventStatusNotifiedText }
                          : { color: colors.eventStatusRegisteredText },
                      ]}
                    >
                      {e.notified
                        ? t('deviceSettings.statusNotified')
                        : t('deviceSettings.statusRegistered')}
                    </Text>
                  </View>
                </View>
              );
            })
          )}
        </View>
      </ScrollView>

      {/* Back Button */}


      {/* Rename Modal */}
      <Modal
        transparent
        animationType="slide"
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={[styles.modalOverlay, { backgroundColor: colors.modalOverlayBg }]}>
          <View style={[styles.modalContent, { backgroundColor: colors.modalContentBg }]}>
            <Text style={[styles.modalTitle, { color: colors.modalTitleText }]}>
              {t('deviceSettings.renameTitle')}
            </Text>
            <TextInput
              style={[
                styles.modalInput,
                {
                  backgroundColor: colors.modalInputBg,
                  borderColor: colors.modalInputBorder,
                },
              ]}
              value={newName}
              onChangeText={setNewName}
              placeholder={t('deviceSettings.renameTitle')}
              placeholderTextColor={colors.modalText}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={[styles.modalCancel, { color: colors.modalCancelText }]}>
                  {t('deviceSettings.cancel')}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleRename}>
                <Text style={[styles.modalSave, { color: colors.modalSaveText }]}>
                  {t('deviceSettings.successRenameTitle')}
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
  container: {
    flex: 1,
    // backgroundColor dinámico en código
  },
  header: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    justifyContent: 'space-between',
    paddingTop: Platform.select({ ios: 20, android: 30, default: 20 }),
    alignItems: 'center',
    // backgroundColor dinámico en código
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    // color dinámico en código
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 10,
    // backgroundColor dinámico en código
  },
  renameButton: {
    // backgroundColor dinámico en código
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  dangerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    // backgroundColor dinámico en código
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  buttonText: {
    color: '#FFFFFF', // se sobreescribe color dinámico cuando corresponda
    fontSize: 14,
    fontWeight: 'bold',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor dinámico en código
  },
  errorText: {
    fontSize: 16,
    // color dinámico en código
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  card: {
    borderRadius: 16,
    padding: 20,
    marginTop: 10,
    marginBottom: 20,
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
    // backgroundColor y shadowColor dinámicos en código
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    // color dinámico en código
  },
  emptyText: {
    textAlign: 'center',
    fontStyle: 'italic',
    // color dinámico en código
  },
  eventRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    // borderColor dinámico en código
  },
  eventDate: {
    fontSize: 14,
    // color dinámico en código
  },
  eventStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  eventStatusText: {
    fontSize: 14,
    marginLeft: 6,
    // color dinámico en código en cada caso
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    // backgroundColor dinámico en código
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    // backgroundColor dinámico en código
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor dinámico en código
  },
  modalContent: {
    width: width * 0.8,
    borderRadius: 16,
    padding: 20,
    // backgroundColor dinámico en código
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    // color dinámico en código
  },
  modalInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
    // backgroundColor y borderColor dinámicos en código
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalCancel: {
    fontSize: 16,
    fontWeight: '500',
    // color dinámico en código
  },
  modalSave: {
    fontSize: 16,
    fontWeight: '500',
    // color dinámico en código
  },
});
