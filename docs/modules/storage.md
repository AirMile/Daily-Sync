# modules/storage.js

**Purpose:** Data persistence layer using LocalStorage for the Daily Sync application.

## Core Components

### StorageManager Class
Singleton class managing all data storage operations using browser LocalStorage.

#### Key Features
- **Singleton Pattern:** Single instance ensures consistent data access
- **LocalStorage Integration:** Browser-based persistence for offline functionality
- **Error Handling:** Graceful degradation when storage is unavailable
- **Data Validation:** Ensures data integrity on save/load operations

#### Storage Keys
- **entries:** Daily mood tracking entries
- **userData:** User profile and preferences
- **streak:** Consecutive days streak counter
- **unfinishedEntry:** In-progress entry for session recovery
- **settings:** Application configuration and user preferences

### Main Methods

#### Entry Management
- **saveEntry(entry):** Store daily tracking entry
- **getEntries():** Retrieve all saved entries
- **getLastCompletedEntry():** Get most recent completed entry
- **getUnfinishedEntry():** Retrieve in-progress entry
- **clearUnfinishedEntry():** Remove temporary entry data

#### User Data
- **saveUserData(userData):** Store user profile
- **loadUserData():** Retrieve user information
- **saveStreak(streakCount):** Update consecutive days streak
- **getStreak():** Get current streak value

#### Utility Functions
- **clearAllData():** Reset all stored data (for debugging/reset)
- **exportData():** Generate data export for backup
- **importData(data):** Restore from exported data
- **getStorageInfo():** Storage usage statistics

### Data Structure

#### Entry Object
```javascript
{
  id: 'entry_timestamp_random',
  date: '2024-01-01T12:00:00.000Z',
  mood: 4, // 1-5 scale
  moodData: { value, label, emoji, color },
  activities: ['work', 'exercise'],
  answers: { questionId: 'answer text' },
  completed: true,
  completedAt: timestamp
}
```

#### User Data Object
```javascript
{
  user: {
    name: 'User Name',
    preferences: {}
  },
  streak: 5,
  lastActive: timestamp,
  settings: {}
}
```

### Error Handling
- **Storage Unavailable:** Fallback to in-memory storage
- **Data Corruption:** Attempt recovery with backup data
- **Quota Exceeded:** Cleanup old entries automatically
- **Parse Errors:** Graceful handling of invalid JSON data

### Singleton Access
Export provides global singleton instance:
```javascript
const storageManager = getStorageManager();
```

### Integration Points
- **App.js:** Main application data persistence
- **Components:** Auto-save functionality for form data
- **Config:** Settings and preferences storage

The storage module ensures reliable data persistence across browser sessions while maintaining good performance and error resilience.