// src/screens/DevicesScreen.tsx

import React, { useEffect, useState, useContext, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TextInput,
  TouchableOpacity,
  Alert,
  Dimensions,
  SafeAreaView,
  Modal,
  Pressable,
  Platform,
} from 'react-native';
import { useNavigation, useFocusEffect, useTheme } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import API from '../../api/api';
import { AuthContext } from '../../context/AuthContext';

import BackIcon from '../../../assets/icons/BackIcon';
import Notification from '../../../assets/icons/NotificationIcon';
import DeviceIcon from '../../../assets/icons/DeviceIcon';
import LockOpen from '../../../assets/icons/LockOpen';
import LockBlocked from '../../../assets/icons/LockBlocked';
import AddIcon from '../../../assets/icons/AddIcon';

import { lightColors, darkColors, DevicesScreenColors } from '../../../assets/themes/colors';

const { width } = Dimensions.get('window');

type Device = {
  _id: string;
  name: string;
  lockActive: boolean;
};

export default function DevicesScreen() {
  const navigation = useNavigation<any>();
  const { logout } = useContext(AuthContext);
  const { t } = useTranslation();
  const { dark } = useTheme();
  const colors: DevicesScreenColors = dark
    ? darkColors.devicesScreen
    : lightColors.devicesScreen;

  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [serialNumber, setSerialNumber] = useState('');
  const [adding, setAdding] = useState(false);
  const [addModalVisible, setAddModalVisible] = useState(false);

  const fetchDevices = async () => {
    try {
      setLoading(true);
      const res = await API.get('/devices/my');
      setDevices(res.data);
      setError('');
    } catch (err: any) {
      console.error(err);
      setError(t('devices.loadError'));
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchDevices();
    }, [])
  );

  const handleBack = () => navigation.goBack();

  const handleAssignDevice = async () => {
    if (!serialNumber.trim()) {
      return Alert.alert(t('devices.errorTitle'), t('devices.enterSerialNumber'));
    }
    try {
      setAdding(true);
      await API.post('/devices/assign', { serialNumber });
      Alert.alert(t('devices.successTitle'), t('devices.deviceAdded'));
      setSerialNumber('');
      fetchDevices();
      setAddModalVisible(false);
    } catch (err: any) {
      console.error(err);
      Alert.alert(
        t('devices.errorTitle'),
        err.response?.data?.error || t('devices.assignError')
      );
    } finally {
      setAdding(false);
    }
  };

  const handleToggleLock = async (id: string, current: boolean) => {
    try {
      await API.patch(`/devices/lock/${id}`, { lockActive: !current });
      fetchDevices();
    } catch (err: any) {
      console.error(err);
      Alert.alert(t('devices.errorTitle'), t('devices.toggleError'));
    }
  };

  const renderItem = ({ item }: { item: Device }) => {
    const isActive = item.lockActive;
    // Definimos el color del borde e ícono según estado:
    const borderColor = isActive
      ? colors.iconButtonActiveBorder
      : colors.iconButtonBorder;
    const backgroundColor = isActive
      ? colors.iconButtonActiveBg
      : colors.iconButtonBg;

    return (
      <View
        style={[
          styles.deviceCard,
          {
            backgroundColor: colors.deviceCardBg,
            shadowColor: colors.deviceCardShadowColor,
          },
        ]}
      >
        <DeviceIcon width={36} height={36} color={colors.deviceName} stroke={1.7} />
        <TouchableOpacity
          style={styles.info}
          onPress={() =>
            navigation.navigate('DeviceSettings', {
              deviceId: item._id,
              deviceName: item.name,
            })
          }
        >
          <Text style={[styles.deviceName, { color: colors.deviceName }]}>
            {item.name}
          </Text>
          <Text style={[styles.deviceStatus, { color: colors.deviceStatus }]}>
            {t('devices.status')}{' '}
            {isActive ? t('devices.locked') : t('devices.unlocked')}
          </Text>
        </TouchableOpacity>

        <View style={styles.actions}>
          <TouchableOpacity
            onPress={() => handleToggleLock(item._id, isActive)}
            style={{
              width: 48,
              height: 48,
              borderRadius: 12,
              alignItems: 'center',
              justifyContent: 'center',
              marginLeft: 8,
              borderWidth: 2,
              backgroundColor: backgroundColor,
              borderColor: borderColor,
            }}
          >
            {isActive ? (
              <LockBlocked width={20} height={20} color={borderColor} stroke={7} />
            ) : (
              <LockOpen width={20} height={20} color={borderColor} stroke={7} />
            )}
          </TouchableOpacity>
        </View>
      </View>
    );
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
          {t('devices.myDevices')}
        </Text>
        <TouchableOpacity>
          <Notification width={28} height={28} color={''} stroke={2.2} />
        </TouchableOpacity>
      </View>

      {/* Lista de dispositivos */}
      <FlatList
        data={devices}
        keyExtractor={(d) => d._id}
        renderItem={renderItem}
        contentContainerStyle={[styles.listContent, { backgroundColor: colors.listBg }]}
        ListEmptyComponent={
          <Text style={[styles.emptyListText, { color: colors.emptyListText }]}>
            {t('devices.noDevices')}
          </Text>
        }
      />

      {/* Botón para abrir modal de agregar */}
      <View style={styles.addButtonContainer}>
        <TouchableOpacity
          style={[styles.addMainButton, { backgroundColor: colors.addMainButtonBg }]}
          onPress={() => setAddModalVisible(true)}
        >
          <AddIcon width={20} height={20} color={colors.addButtonText} stroke={2} />
          <Text style={[styles.addButtonText, { color: colors.addButtonText }]}>
            {t('devices.addDevice')}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Modal para agregar dispositivo */}
      <Modal
        transparent
        visible={addModalVisible}
        animationType="fade"
        onRequestClose={() => setAddModalVisible(false)}
      >
        <View style={[styles.modalOverlay, { backgroundColor: colors.modalOverlayBg }]}>
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={() => setAddModalVisible(false)}
          />
          <View style={[styles.modalContent, { backgroundColor: colors.modalContentBg }]}>
            <TextInput
              placeholder={t('devices.serialNumberPlaceholder')}
              value={serialNumber}
              onChangeText={setSerialNumber}
              style={[
                styles.input,
                {
                  backgroundColor: colors.inputBg,
                  borderColor: colors.inputBorder,
                },
              ]}
            />
            {adding ? (
              <ActivityIndicator size="large" color={colors.activityIndicator} />
            ) : (
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: colors.modalButtonBg }]}
                onPress={handleAssignDevice}
              >
                <Text style={[styles.modalText, { color: colors.modalText }]}>
                  {t('devices.addDeviceButton')}
                </Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={[
                styles.modalButton,
                styles.modalCancelButton,
                { backgroundColor: colors.modalCancelButtonBg },
              ]}
              onPress={() => setAddModalVisible(false)}
            >
              <Text style={[styles.modalText, { color: colors.modalCancelText }]}>
                {t('devices.cancel')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 40,
  },
  header: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: Platform.select({ ios: 20, android: 30, default: 20 }),
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  emptyListText: {
    textAlign: 'center',
    marginTop: 40,
    fontStyle: 'italic',
  },
  deviceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    elevation: 3,
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  info: {
    flex: 1,
    marginLeft: 12,
  },
  deviceName: {
    fontSize: 16,
    fontWeight: '600',
  },
  deviceStatus: {
    fontSize: 14,
    marginTop: 4,
  },
  actions: {
    flexDirection: 'row',
    marginLeft: 8,
  },
  iconButton: {
    // Ya no se utiliza, ya que definimos ancho/alto, borderRadius, borderWidth y borderColor en línea
  },
  addButtonContainer: {
    padding: 20,
    alignItems: 'center',
  },
  addMainButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },

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
  input: {
    width: '100%',
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  modalButton: {
    width: '100%',
    paddingVertical: 12,
    borderRadius: 12,
    marginVertical: 8,
    alignItems: 'center',
  },
  modalCancelButton: {
    /* se agrega backgroundColor dinámico en código */
  },
  modalText: {
    fontSize: 16,
    fontWeight: '500',
  },
});
