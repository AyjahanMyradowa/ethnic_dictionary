
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Switch,
  Alert,
} from 'react-native';
import { colors } from '../styles/commonStyles';
import Icon from './Icon';
import { AppSettings } from '../services/storageService';

interface SettingsModalProps {
  visible: boolean;
  onClose: () => void;
  settings: AppSettings;
  onUpdateSettings: (settings: Partial<AppSettings>) => Promise<void>;
  onSync: () => Promise<void>;
  isSyncing: boolean;
  lastSyncTime?: string | null;
}

export default function SettingsModal({
  visible,
  onClose,
  settings,
  onUpdateSettings,
  onSync,
  isSyncing,
  lastSyncTime,
}: SettingsModalProps) {
  const [isUpdating, setIsUpdating] = useState(false);

  const handleSettingChange = async (key: keyof AppSettings, value: any) => {
    try {
      setIsUpdating(true);
      console.log('Updating setting:', key, value);
      await onUpdateSettings({ [key]: value });
    } catch (error) {
      console.error('Error updating setting:', error);
      Alert.alert('Ýalňyşlyk', 'Sazlamalary üýtgetmekde ýalňyşlyk');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSync = async () => {
    try {
      console.log('Manual sync requested');
      await onSync();
      Alert.alert('Üstünlik', 'Maglumatlar sinhronly');
    } catch (error) {
      console.error('Error syncing:', error);
      Alert.alert('Ýalňyşlyk', 'Sinhronizasiýada ýalňyşlyk');
    }
  };

  const handleBackendToggle = () => {
    if (!settings.backendEnabled) {
      Alert.alert(
        'Backend funksiýasy',
        'Backend funksiýasyny açmak üçin Supabase düýmesine basyň we taslamany birikdiriň. Ilki Supabase-da taslama döretmeli bolup biler.',
        [
          { text: 'Ýatyr', style: 'cancel' },
          { 
            text: 'Düşündim', 
            onPress: () => console.log('User acknowledged backend requirement')
          }
        ]
      );
    } else {
      handleSettingChange('backendEnabled', false);
    }
  };

  const formatLastSyncTime = (time: string | null | undefined): string => {
    if (!time) return 'Hiç wagt';
    
    try {
      const date = new Date(time);
      return date.toLocaleString('tk-TM', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return 'Näbelli';
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Icon name="close" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.title}>Sazlamalar</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Backend we sinhronizasiýa</Text>
            
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>Backend funksiýasy</Text>
                <Text style={styles.settingDescription}>
                  Maglumatlary bulut ulgamynda saklamak we enjamlar arasynda paýlaşmak
                </Text>
              </View>
              <Switch
                value={settings.backendEnabled}
                onValueChange={handleBackendToggle}
                trackColor={{ false: colors.accent, true: colors.primary }}
                thumbColor={colors.background}
                disabled={isUpdating}
              />
            </View>

            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>Awtomatik sinhronizasiýa</Text>
                <Text style={styles.settingDescription}>
                  Maglumatlary awtomatik usulda täzelemek
                </Text>
              </View>
              <Switch
                value={settings.autoSync}
                onValueChange={(value) => handleSettingChange('autoSync', value)}
                trackColor={{ false: colors.accent, true: colors.primary }}
                thumbColor={colors.background}
                disabled={isUpdating || !settings.backendEnabled}
              />
            </View>

            {settings.backendEnabled && (
              <View style={styles.syncSection}>
                <View style={styles.syncInfo}>
                  <Text style={styles.syncLabel}>Soňky sinhronizasiýa</Text>
                  <Text style={styles.syncTime}>
                    {formatLastSyncTime(lastSyncTime)}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={handleSync}
                  style={[styles.syncButton, isSyncing && styles.syncButtonDisabled]}
                  disabled={isSyncing}
                >
                  <Icon 
                    name={isSyncing ? "sync" : "cloud-download"} 
                    size={20} 
                    color={colors.background} 
                  />
                  <Text style={styles.syncButtonText}>
                    {isSyncing ? 'Sinhronlanýar...' : 'Sinhronla'}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Tema</Text>
            
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>Açyk tema</Text>
                <Text style={styles.settingDescription}>
                  Programmanyň daşky görnüşi
                </Text>
              </View>
              <Switch
                value={settings.theme === 'light'}
                onValueChange={(value) => handleSettingChange('theme', value ? 'light' : 'dark')}
                trackColor={{ false: colors.accent, true: colors.primary }}
                thumbColor={colors.background}
                disabled={isUpdating}
              />
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Maglumat</Text>
            
            <View style={styles.infoCard}>
              <Icon name="information-circle" size={24} color={colors.primary} />
              <View style={styles.infoText}>
                <Text style={styles.infoTitle}>Backend barada</Text>
                <Text style={styles.infoDescription}>
                  Backend funksiýasyny açmak üçin Supabase düýmesine basyň we öz taslamaňyzy birikdiriň. 
                  Bu size maglumatlary bulut ulgamynda saklamaga we beýleki enjamlar bilen paýlaşmaga mümkinçilik berýär.
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.accent,
  },
  closeButton: {
    padding: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginVertical: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  settingInfo: {
    flex: 1,
    marginRight: 16,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: colors.textLight,
    lineHeight: 20,
  },
  syncSection: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
  },
  syncInfo: {
    marginBottom: 16,
  },
  syncLabel: {
    fontSize: 14,
    color: colors.textLight,
    marginBottom: 4,
  },
  syncTime: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  syncButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  syncButtonDisabled: {
    backgroundColor: colors.textLight,
  },
  syncButtonText: {
    color: colors.background,
    fontWeight: '600',
    marginLeft: 8,
    fontSize: 16,
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  infoText: {
    flex: 1,
    marginLeft: 12,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  infoDescription: {
    fontSize: 14,
    color: colors.textLight,
    lineHeight: 20,
  },
});
