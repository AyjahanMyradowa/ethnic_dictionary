
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DictionaryEntry } from '../data/dictionary';

const STORAGE_KEYS = {
  DICTIONARY_ENTRIES: 'dictionary_entries',
  USER_FAVORITES: 'user_favorites',
  APP_SETTINGS: 'app_settings',
  LAST_SYNC: 'last_sync',
};

export interface AppSettings {
  backendEnabled: boolean;
  autoSync: boolean;
  lastSyncTime?: string;
  theme: 'light' | 'dark';
}

export class StorageService {
  static async saveDictionaryEntries(entries: DictionaryEntry[]): Promise<void> {
    try {
      console.log('Saving', entries.length, 'dictionary entries to storage');
      await AsyncStorage.setItem(STORAGE_KEYS.DICTIONARY_ENTRIES, JSON.stringify(entries));
    } catch (error) {
      console.error('Error saving dictionary entries:', error);
      throw error;
    }
  }

  static async loadDictionaryEntries(): Promise<DictionaryEntry[]> {
    try {
      console.log('Loading dictionary entries from storage');
      const data = await AsyncStorage.getItem(STORAGE_KEYS.DICTIONARY_ENTRIES);
      if (data) {
        const entries = JSON.parse(data);
        console.log('Loaded', entries.length, 'dictionary entries');
        return entries;
      }
      console.log('No dictionary entries found in storage');
      return [];
    } catch (error) {
      console.error('Error loading dictionary entries:', error);
      return [];
    }
  }

  static async saveFavorites(favorites: string[]): Promise<void> {
    try {
      console.log('Saving', favorites.length, 'favorites to storage');
      await AsyncStorage.setItem(STORAGE_KEYS.USER_FAVORITES, JSON.stringify(favorites));
    } catch (error) {
      console.error('Error saving favorites:', error);
      throw error;
    }
  }

  static async loadFavorites(): Promise<string[]> {
    try {
      console.log('Loading favorites from storage');
      const data = await AsyncStorage.getItem(STORAGE_KEYS.USER_FAVORITES);
      if (data) {
        const favorites = JSON.parse(data);
        console.log('Loaded', favorites.length, 'favorites');
        return favorites;
      }
      return [];
    } catch (error) {
      console.error('Error loading favorites:', error);
      return [];
    }
  }

  static async saveSettings(settings: AppSettings): Promise<void> {
    try {
      console.log('Saving app settings:', settings);
      await AsyncStorage.setItem(STORAGE_KEYS.APP_SETTINGS, JSON.stringify(settings));
    } catch (error) {
      console.error('Error saving settings:', error);
      throw error;
    }
  }

  static async loadSettings(): Promise<AppSettings> {
    try {
      console.log('Loading app settings');
      const data = await AsyncStorage.getItem(STORAGE_KEYS.APP_SETTINGS);
      if (data) {
        const settings = JSON.parse(data);
        console.log('Loaded settings:', settings);
        return settings;
      }
      
      const defaultSettings: AppSettings = {
        backendEnabled: false,
        autoSync: false,
        theme: 'light',
      };
      console.log('Using default settings:', defaultSettings);
      return defaultSettings;
    } catch (error) {
      console.error('Error loading settings:', error);
      return {
        backendEnabled: false,
        autoSync: false,
        theme: 'light',
      };
    }
  }

  static async updateLastSyncTime(): Promise<void> {
    try {
      const now = new Date().toISOString();
      console.log('Updating last sync time:', now);
      await AsyncStorage.setItem(STORAGE_KEYS.LAST_SYNC, now);
    } catch (error) {
      console.error('Error updating last sync time:', error);
    }
  }

  static async getLastSyncTime(): Promise<string | null> {
    try {
      const time = await AsyncStorage.getItem(STORAGE_KEYS.LAST_SYNC);
      console.log('Last sync time:', time);
      return time;
    } catch (error) {
      console.error('Error getting last sync time:', error);
      return null;
    }
  }

  static async clearAllData(): Promise<void> {
    try {
      console.log('Clearing all app data');
      await AsyncStorage.multiRemove(Object.values(STORAGE_KEYS));
    } catch (error) {
      console.error('Error clearing data:', error);
      throw error;
    }
  }
}
