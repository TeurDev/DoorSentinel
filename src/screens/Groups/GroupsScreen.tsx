// src/screens/GroupsScreen.tsx

import React, { useEffect, useState, useContext, useCallback } from 'react';
import {
  SafeAreaView,
  FlatList,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  StyleSheet,
  Dimensions,
  Modal,
  Pressable,
  TextInput,
  Platform,
} from 'react-native';
import { useNavigation, useFocusEffect, useTheme } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import API from '../../api/api';
import { AuthContext } from '../../context/AuthContext';

import NotificationIcon from '../../../assets/icons/NotificationIcon';
import GroupIcon from '../../../assets/icons/GroupIcon';
import AddIcon from '../../../assets/icons/AddIcon';
import LockOpen from '../../../assets/icons/LockOpen';
import LockBlocked from '../../../assets/icons/LockBlocked';
import BackIcon from '../../../assets/icons/BackIcon';

import { lightColors, darkColors, GroupsScreenColors } from '../../../assets/themes/colors';

const { width } = Dimensions.get('window');
const CARD_PADDING = 20;
const BUTTON_HEIGHT = 48;

interface Group {
  _id: string;
  name: string;
  locked: boolean;
}

export default function GroupsScreen() {
  const navigation = useNavigation<any>();
  const { t } = useTranslation();
  const { dark } = useTheme();
  const colors: GroupsScreenColors = dark
    ? darkColors.groupsScreen
    : lightColors.groupsScreen;

  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [newGroupName, setNewGroupName] = useState('');
  const [addModalVisible, setAddModalVisible] = useState(false);

  const fetchGroups = async () => {
    try {
      setLoading(true);
      const res = await API.get('/groups/my');
      setGroups(res.data);
    } catch (err) {
      console.error('Error fetching groups:', err);
      Alert.alert(t('groupList.errorTitle'), t('groupList.loadError'));
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchGroups();
    }, [])
  );
  useEffect(() => {
    fetchGroups();
  }, []);

  const handleBack = () => navigation.goBack();

  const handleCreateGroup = async () => {
    if (!newGroupName.trim()) {
      return Alert.alert(t('groupList.errorTitle'), t('groupList.emptyNameError'));
    }
    try {
      await API.post('/groups/create', { name: newGroupName });
      setNewGroupName('');
      fetchGroups();
      setAddModalVisible(false);
    } catch (err) {
      console.error('Error creating group:', err);
      Alert.alert(t('groupList.errorTitle'), t('groupList.createError'));
    }
  };

  const handleToggleLock = async (id: string, locked: boolean) => {
    try {
      const action = locked ? 'unlock' : 'lock';
      await API.post(`/groups/${id}/${action}`);
      fetchGroups();
    } catch (err) {
      console.error('Error toggling lock:', err);
      Alert.alert(t('groupList.errorTitle'), t('groupList.toggleLockError'));
    }
  };

  const renderItem = ({ item }: { item: Group }) => {
    // Colores hardcodeados para modo claro:
    const borderColor = item.locked
      ? colors.lockIconBorderLocked
      : colors.lockIconBorderUnlocked;
    const backgroundColor = item.locked
      ? colors.lockIconBgLocked
      : colors.lockIconBgUnlocked;
    const iconColor = item.locked
      ? colors.lockIconColorLocked
      : colors.lockIconColorUnlocked;

    return (
      <View
        style={[
          styles.groupCard,
          {
            backgroundColor: colors.groupCardBg,
            shadowColor: colors.groupCardShadowColor,
          },
        ]}
      >
        <TouchableOpacity
          style={styles.groupInfo}
          activeOpacity={0.7}
          onPress={() =>
            navigation.navigate('GroupDetail', { groupId: item._id })
          }
        >
          <GroupIcon width={32} height={32} color={colors.groupIconColor} stroke={3.5} />
          <Text style={[styles.groupName, { color: colors.groupNameText }]}>
            {item.name}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleToggleLock(item._id, item.locked)}
          style={{
            width: 48,
            height: 48,
            borderRadius: 12,
            alignItems: 'center',
            justifyContent: 'center',
            marginLeft: 8,
            backgroundColor,
            borderWidth: 2,
            borderColor,
          }}
        >
          {item.locked ? (
            <LockBlocked width={24} height={24} color={iconColor} stroke={7} />
          ) : (
            <LockOpen width={24} height={24} color={iconColor} stroke={7} />
          )}
        </TouchableOpacity>
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

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.containerBg }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.headerBg }]}>
        <TouchableOpacity onPress={handleBack}>
          <BackIcon width={28} height={28} color={colors.headerIcon} stroke={2.2} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.headerTitle }]}>
          {t('groupList.headerTitle')}
        </Text>
        <TouchableOpacity>
          <NotificationIcon width={28} height={28} color={''} stroke={2.2} />
        </TouchableOpacity>
      </View>

      {/* Lista de grupos */}
      <FlatList
        data={groups}
        keyExtractor={(g) => g._id}
        renderItem={renderItem}
        contentContainerStyle={[styles.listContent, { backgroundColor: colors.listBg }]}
        ListEmptyComponent={
          <Text style={[styles.emptyListText, { color: colors.emptyListText }]}>
            {t('groupList.noGroups')}
          </Text>
        }
      />

      {/* Botón de agregar abajo */}
      <View style={[styles.addButtonContainer, { backgroundColor: colors.containerBg }]}>
        <TouchableOpacity
          style={[styles.addMainButton, { backgroundColor: colors.addMainButtonBg }]}
          onPress={() => setAddModalVisible(true)}
        >
          <AddIcon width={20} height={20} color={colors.addButtonText} stroke={2} />
          <Text style={[styles.addButtonText, { color: colors.addButtonText }]}>
            {t('groupList.addGroup')}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Modal para crear grupo */}
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
              placeholder={t('groupList.newNamePlaceholder')}
              placeholderTextColor={colors.modalText}
              value={newGroupName}
              onChangeText={setNewGroupName}
              style={[
                styles.input,
                {
                  backgroundColor: colors.inputBg,
                  borderColor: colors.inputBorder,
                },
              ]}
            />
            <TouchableOpacity
              style={[styles.modalButton, { backgroundColor: colors.modalButtonBg }]}
              onPress={handleCreateGroup}
            >
              <Text style={[styles.modalText, { color: colors.modalText }]}>
                {t('groupList.createButton')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.modalButton,
                styles.modalCancelButton,
                { backgroundColor: colors.modalCancelButtonBg },
              ]}
              onPress={() => setAddModalVisible(false)}
            >
              <Text style={[styles.modalText, { color: colors.modalCancelText }]}>
                {t('groupList.cancel')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, marginBottom: 40 },
  header: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingTop: Platform.select({ ios: 20, android: 30, default: 20 }),
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: { fontSize: 20, fontWeight: 'bold' },

  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: { paddingHorizontal: 20, paddingBottom: 20 },
  emptyListText: {
    textAlign: 'center',
    marginTop: 40,
    fontStyle: 'italic',
  },

  groupCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  groupInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  groupName: {
    marginLeft: 12,
    fontSize: 16,
    fontWeight: '600',
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
    padding: CARD_PADDING,
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
    /* backgroundColor dinámico en código */
  },
  modalText: {
    fontSize: 16,
    fontWeight: '500',
  },
  modalCancelText: {
    /* color dinámico en código */
  },
});
