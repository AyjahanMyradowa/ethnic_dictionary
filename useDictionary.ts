
import { useState, useEffect, useCallback } from 'react';
import { DictionaryEntry, turkmenDictionary } from '../data/dictionary';
import { DataService, LocalDataService, RemoteDataService } from '../services/dataService';
import { StorageService, AppSettings } from '../services/storageService';

export function useDictionary() {
  const [entries, setEntries] = useState<DictionaryEntry[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [settings, setSettings] = useState<AppSettings>({
    backendEnabled: false,
    autoSync: false,
    theme: 'light',
  });
  const [dataService, setDataService] = useState<DataService | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);

  // Initialize data service and load data
  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      console.log('Initializing dictionary app');
      setIsLoading(true);

      // Load settings
      const loadedSettings = await StorageService.loadSettings();
      setSettings(loadedSettings);

      // Load stored entries or use default
      let storedEntries = await StorageService.loadDictionaryEntries();
      if (storedEntries.length === 0) {
        console.log('No stored entries, using default dictionary');
        storedEntries = turkmenDictionary;
        await StorageService.saveDictionaryEntries(storedEntries);
      }

      // Load favorites
      const loadedFavorites = await StorageService.loadFavorites();
      setFavorites(loadedFavorites);

      // Initialize data service
      const localService = new LocalDataService(storedEntries);
      let service: DataService;

      if (loadedSettings.backendEnabled) {
        console.log('Backend enabled, using remote service');
        service = new RemoteDataService(localService);
      } else {
        console.log('Using local service only');
        service = localService;
      }

      setDataService(service);
      setEntries(storedEntries);
      
      console.log('App initialization completed');
    } catch (error) {
      console.error('Error initializing app:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const searchEntries = useCallback(async (query: string): Promise<DictionaryEntry[]> => {
    if (!dataService) {
      console.log('Data service not initialized');
      return [];
    }

    try {
      console.log('Searching entries with query:', query);
      return await dataService.searchEntries(query);
    } catch (error) {
      console.error('Error searching entries:', error);
      return [];
    }
  }, [dataService]);

  const addEntry = useCallback(async (entry: DictionaryEntry): Promise<void> => {
    if (!dataService) {
      throw new Error('Data service not initialized');
    }

    try {
      console.log('Adding new entry:', entry.word);
      await dataService.addEntry(entry);
      
      // Update local state
      const updatedEntries = await dataService.getAllEntries();
      setEntries(updatedEntries);
      
      // Save to storage
      await StorageService.saveDictionaryEntries(updatedEntries);
      
      console.log('Entry added successfully');
    } catch (error) {
      console.error('Error adding entry:', error);
      throw error;
    }
  }, [dataService]);

  const updateEntry = useCallback(async (word: string, entry: DictionaryEntry): Promise<void> => {
    if (!dataService) {
      throw new Error('Data service not initialized');
    }

    try {
      console.log('Updating entry:', word);
      await dataService.updateEntry(word, entry);
      
      // Update local state
      const updatedEntries = await dataService.getAllEntries();
      setEntries(updatedEntries);
      
      // Save to storage
      await StorageService.saveDictionaryEntries(updatedEntries);
      
      console.log('Entry updated successfully');
    } catch (error) {
      console.error('Error updating entry:', error);
      throw error;
    }
  }, [dataService]);

  const deleteEntry = useCallback(async (word: string): Promise<void> => {
    if (!dataService) {
      throw new Error('Data service not initialized');
    }

    try {
      console.log('Deleting entry:', word);
      await dataService.deleteEntry(word);
      
      // Update local state
      const updatedEntries = await dataService.getAllEntries();
      setEntries(updatedEntries);
      
      // Save to storage
      await StorageService.saveDictionaryEntries(updatedEntries);
      
      // Remove from favorites if present
      const updatedFavorites = favorites.filter(fav => fav !== word);
      setFavorites(updatedFavorites);
      await StorageService.saveFavorites(updatedFavorites);
      
      console.log('Entry deleted successfully');
    } catch (error) {
      console.error('Error deleting entry:', error);
      throw error;
    }
  }, [dataService, favorites]);

  const toggleFavorite = useCallback(async (word: string): Promise<void> => {
    try {
      console.log('Toggling favorite for word:', word);
      const updatedFavorites = favorites.includes(word)
        ? favorites.filter(fav => fav !== word)
        : [...favorites, word];
      
      setFavorites(updatedFavorites);
      await StorageService.saveFavorites(updatedFavorites);
      
      console.log('Favorite toggled successfully');
    } catch (error) {
      console.error('Error toggling favorite:', error);
      throw error;
    }
  }, [favorites]);

  const syncData = useCallback(async (): Promise<void> => {
    if (!dataService) {
      throw new Error('Data service not initialized');
    }

    try {
      console.log('Starting data sync');
      setIsSyncing(true);
      
      await dataService.syncData();
      await StorageService.updateLastSyncTime();
      
      // Refresh entries after sync
      const updatedEntries = await dataService.getAllEntries();
      setEntries(updatedEntries);
      await StorageService.saveDictionaryEntries(updatedEntries);
      
      console.log('Data sync completed');
    } catch (error) {
      console.error('Error syncing data:', error);
      throw error;
    } finally {
      setIsSyncing(false);
    }
  }, [dataService]);

  const updateSettings = useCallback(async (newSettings: Partial<AppSettings>): Promise<void> => {
    try {
      console.log('Updating settings:', newSettings);
      const updatedSettings = { ...settings, ...newSettings };
      setSettings(updatedSettings);
      await StorageService.saveSettings(updatedSettings);
      
      // Reinitialize data service if backend setting changed
      if ('backendEnabled' in newSettings) {
        await initializeApp();
      }
      
      console.log('Settings updated successfully');
    } catch (error) {
      console.error('Error updating settings:', error);
      throw error;
    }
  }, [settings]);

  const getFavoriteEntries = useCallback((): DictionaryEntry[] => {
    return entries.filter(entry => favorites.includes(entry.word));
  }, [entries, favorites]);

  return {
    entries,
    favorites,
    settings,
    isLoading,
    isSyncing,
    searchEntries,
    addEntry,
    updateEntry,
    deleteEntry,
    toggleFavorite,
    syncData,
    updateSettings,
    getFavoriteEntries,
  };
}
