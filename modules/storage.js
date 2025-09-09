// LocalStorage wrapper for persistent data storage
// Provides safe read/write operations for mood entries, activities, and question responses
import { APP_SETTINGS } from './config.js';

class StorageManager {
    constructor() {
        this.storageKeys = APP_SETTINGS.storageKeys;
        this.checkStorageAvailability();
    }
    
    checkStorageAvailability() {
        try {
            const testKey = '__storage_test__';
            localStorage.setItem(testKey, 'test');
            localStorage.removeItem(testKey);
            return true;
        } catch (error) {
            console.error('LocalStorage not available:', error);
            throw new Error('LocalStorage is niet beschikbaar');
        }
    }
    
    async saveEntry(entry) {
        try {
            if (!this.validateEntry(entry)) {
                throw new Error('Invalid entry format');
            }
            
            const entries = await this.getAllEntries();
            const existingIndex = entries.findIndex(e => e.id === entry.id);
            
            if (existingIndex >= 0) {
                entries[existingIndex] = entry;
            } else {
                entries.push(entry);
            }
            
            entries.sort((a, b) => new Date(b.date) - new Date(a.date));
            this.setItem(this.storageKeys.entries, entries);
            
            return entry;
        } catch (error) {
            console.error('Error saving entry:', error);
            throw error;
        }
    }
    
    async getAllEntries() {
        try {
            const entries = this.getItem(this.storageKeys.entries);
            return entries || [];
        } catch (error) {
            console.error('Error getting entries:', error);
            return [];
        }
    }
    
    async getEntriesByDateRange(startDate, endDate) {
        try {
            const allEntries = await this.getAllEntries();
            
            return allEntries.filter(entry => {
                const entryDate = new Date(entry.date);
                return entryDate >= startDate && entryDate <= endDate;
            });
        } catch (error) {
            console.error('Error getting entries by date:', error);
            return [];
        }
    }
    
    async getEntryById(id) {
        try {
            const entries = await this.getAllEntries();
            return entries.find(entry => entry.id === id);
        } catch (error) {
            console.error('Error getting entry:', error);
            return null;
        }
    }
    
    async deleteEntry(id) {
        try {
            const entries = await this.getAllEntries();
            const filteredEntries = entries.filter(entry => entry.id !== id);
            
            this.setItem(this.storageKeys.entries, filteredEntries);
            return true;
        } catch (error) {
            console.error('Error deleting entry:', error);
            return false;
        }
    }
    
    async getUnfinishedEntry() {
        try {
            const entries = await this.getAllEntries();
            return entries.find(entry => !entry.completed);
        } catch (error) {
            console.error('Error getting unfinished entry:', error);
            return null;
        }
    }
    
    async getLastCompletedEntry() {
        try {
            const entries = await this.getAllEntries();
            const completedEntries = entries.filter(entry => entry.completed);
            
            if (completedEntries.length > 0) {
                return completedEntries[0]; // Already sorted by date
            }
            
            return null;
        } catch (error) {
            console.error('Error getting last entry:', error);
            return null;
        }
    }
    
    async saveUserData(userData) {
        try {
            this.setItem(this.storageKeys.settings, userData);
            return true;
        } catch (error) {
            console.error('Error saving user data:', error);
            return false;
        }
    }
    
    async loadUserData() {
        try {
            return this.getItem(this.storageKeys.settings);
        } catch (error) {
            console.error('Error loading user data:', error);
            return null;
        }
    }
    
    async saveStreak(streak) {
        try {
            this.setItem(this.storageKeys.currentStreak, streak);
            return true;
        } catch (error) {
            console.error('Error saving streak:', error);
            return false;
        }
    }
    
    async getStreak() {
        try {
            const streak = this.getItem(this.storageKeys.currentStreak);
            return streak || 0;
        } catch (error) {
            console.error('Error getting streak:', error);
            return 0;
        }
    }
    
    validateEntry(entry) {
        if (!entry.id || !entry.date) {
            return false;
        }
        
        if (entry.mood !== undefined && entry.mood !== null) {
            if (entry.mood < 1 || entry.mood > 5) {
                return false;
            }
        }
        
        if (entry.answers) {
            for (const answer of Object.values(entry.answers)) {
                if (typeof answer !== 'string') {
                    return false;
                }
                
                if (answer.length < APP_SETTINGS.validation.minAnswerLength ||
                    answer.length > APP_SETTINGS.validation.maxAnswerLength) {
                    return false;
                }
            }
        }
        
        return true;
    }
    
    setItem(key, value) {
        try {
            const serialized = JSON.stringify(value);
            localStorage.setItem(key, serialized);
        } catch (error) {
            if (error.name === 'QuotaExceededError') {
                this.handleQuotaExceeded();
            } else {
                console.error('Error setting item:', error);
                throw new Error('Failed to save data');
            }
        }
    }
    
    getItem(key) {
        try {
            const serialized = localStorage.getItem(key);
            if (serialized === null) {
                return null;
            }
            return JSON.parse(serialized);
        } catch (error) {
            console.error('Error getting item:', error);
            return null;
        }
    }
    
    removeItem(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.error('Error removing item:', error);
            return false;
        }
    }
    
    clearAll() {
        try {
            for (const key of Object.values(this.storageKeys)) {
                this.removeItem(key);
            }
            return true;
        } catch (error) {
            console.error('Error clearing storage:', error);
            return false;
        }
    }
    
    handleQuotaExceeded() {
        console.warn('Storage quota exceeded, attempting cleanup');
        // Remove oldest entries if needed
        this.cleanupOldEntries();
    }
    
    async cleanupOldEntries() {
        try {
            const entries = await this.getAllEntries();
            if (entries.length > 100) {
                const recentEntries = entries.slice(0, 50);
                this.setItem(this.storageKeys.entries, recentEntries);
            }
        } catch (error) {
            console.error('Error during cleanup:', error);
        }
    }
    
    exportData() {
        try {
            const data = {
                entries: this.getItem(this.storageKeys.entries),
                settings: this.getItem(this.storageKeys.settings),
                streak: this.getItem(this.storageKeys.currentStreak),
                exportDate: new Date().toISOString()
            };
            
            return JSON.stringify(data, null, 2);
        } catch (error) {
            console.error('Error exporting data:', error);
            return null;
        }
    }
    
    importData(jsonData) {
        try {
            const data = JSON.parse(jsonData);
            
            if (data.entries) {
                this.setItem(this.storageKeys.entries, data.entries);
            }
            
            if (data.settings) {
                this.setItem(this.storageKeys.settings, data.settings);
            }
            
            if (data.streak) {
                this.setItem(this.storageKeys.currentStreak, data.streak);
            }
            
            return true;
        } catch (error) {
            console.error('Error importing data:', error);
            return false;
        }
    }
}

// Singleton instance
let storageInstance = null;

function getStorageManager() {
    if (!storageInstance) {
        storageInstance = new StorageManager();
    }
    return storageInstance;
}

export default getStorageManager();