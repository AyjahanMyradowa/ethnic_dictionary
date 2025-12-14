
import { DictionaryEntry } from '../data/dictionary';

export interface DataService {
  getAllEntries(): Promise<DictionaryEntry[]>;
  searchEntries(query: string): Promise<DictionaryEntry[]>;
  addEntry(entry: DictionaryEntry): Promise<void>;
  updateEntry(word: string, entry: DictionaryEntry): Promise<void>;
  deleteEntry(word: string): Promise<void>;
  syncData(): Promise<void>;
}

export class LocalDataService implements DataService {
  private entries: DictionaryEntry[] = [];

  constructor(initialEntries: DictionaryEntry[] = []) {
    this.entries = [...initialEntries];
    console.log('LocalDataService initialized with', this.entries.length, 'entries');
  }

  async getAllEntries(): Promise<DictionaryEntry[]> {
    console.log('Getting all entries from local storage');
    return [...this.entries];
  }

  async searchEntries(query: string): Promise<DictionaryEntry[]> {
    console.log('Searching local entries for:', query);
    if (!query || !query.trim()) {
      return [];
    }

    const lowercaseQuery = query.toLowerCase().trim();
    return this.entries.filter(entry => 
      entry.word.toLowerCase().includes(lowercaseQuery) ||
      entry.definition.toLowerCase().includes(lowercaseQuery)
    );
  }

  async addEntry(entry: DictionaryEntry): Promise<void> {
    console.log('Adding entry to local storage:', entry.word);
    // Check if entry already exists
    const existingIndex = this.entries.findIndex(e => e.word === entry.word);
    if (existingIndex >= 0) {
      throw new Error('Söz eýýäm bar');
    }
    this.entries.push(entry);
  }

  async updateEntry(word: string, entry: DictionaryEntry): Promise<void> {
    console.log('Updating entry in local storage:', word);
    const index = this.entries.findIndex(e => e.word === word);
    if (index === -1) {
      throw new Error('Söz tapylmady');
    }
    this.entries[index] = entry;
  }

  async deleteEntry(word: string): Promise<void> {
    console.log('Deleting entry from local storage:', word);
    const index = this.entries.findIndex(e => e.word === word);
    if (index === -1) {
      throw new Error('Söz tapylmady');
    }
    this.entries.splice(index, 1);
  }

  async syncData(): Promise<void> {
    console.log('Local sync completed (no-op)');
    // No-op for local storage
  }
}

// Future: RemoteDataService for Supabase integration
export class RemoteDataService implements DataService {
  private localService: LocalDataService;
  private isConnected: boolean = false;

  constructor(localService: LocalDataService) {
    this.localService = localService;
    console.log('RemoteDataService initialized');
  }

  async getAllEntries(): Promise<DictionaryEntry[]> {
    console.log('Getting all entries from remote service');
    if (!this.isConnected) {
      console.log('Not connected to backend, using local data');
      return this.localService.getAllEntries();
    }
    
    // TODO: Implement Supabase integration
    return this.localService.getAllEntries();
  }

  async searchEntries(query: string): Promise<DictionaryEntry[]> {
    console.log('Searching remote entries for:', query);
    if (!this.isConnected) {
      return this.localService.searchEntries(query);
    }
    
    // TODO: Implement Supabase search
    return this.localService.searchEntries(query);
  }

  async addEntry(entry: DictionaryEntry): Promise<void> {
    console.log('Adding entry to remote service:', entry.word);
    // Always add to local first
    await this.localService.addEntry(entry);
    
    if (this.isConnected) {
      // TODO: Sync to Supabase
      console.log('Entry would be synced to backend');
    }
  }

  async updateEntry(word: string, entry: DictionaryEntry): Promise<void> {
    console.log('Updating entry in remote service:', word);
    await this.localService.updateEntry(word, entry);
    
    if (this.isConnected) {
      // TODO: Sync to Supabase
      console.log('Entry update would be synced to backend');
    }
  }

  async deleteEntry(word: string): Promise<void> {
    console.log('Deleting entry from remote service:', word);
    await this.localService.deleteEntry(word);
    
    if (this.isConnected) {
      // TODO: Sync to Supabase
      console.log('Entry deletion would be synced to backend');
    }
  }

  async syncData(): Promise<void> {
    console.log('Syncing data with remote service');
    if (!this.isConnected) {
      console.log('Cannot sync: not connected to backend');
      return;
    }
    
    // TODO: Implement full sync with Supabase
    console.log('Data sync would happen here');
  }

  setConnectionStatus(connected: boolean) {
    this.isConnected = connected;
    console.log('Backend connection status:', connected);
  }
}
