# Sample Data Loader Script

**File**: `scripts/load-sample-data.js`

## Purpose

Integration script that loads realistic sample data into localStorage for Daily Sync App prototype demonstration. Provides multiple loading options, data management utilities, and browser console helpers for development and testing.

## Key Features

### Loading Options
- **Quick Load**: 30 days of sample data with streaks
- **Extended Load**: 60 days for long-term pattern demonstration
- **Append Mode**: Add data without clearing existing entries
- **Configurable**: Custom days, clearing options, streak settings

### Data Management
- **Clear Existing**: Option to clear localStorage before loading
- **Statistics Calculation**: Automatic stats generation and logging
- **User Data**: Creates sample user preferences and goals
- **Streak Management**: Sets realistic current and longest streaks

### Console Integration
- **Browser Helpers**: Functions available in browser console
- **Progress Logging**: Detailed console output during loading
- **Error Handling**: Comprehensive error reporting and recovery

## Functions

### `loadSampleData(options)`
Main loading function with configuration options:
- `clearExisting`: Boolean to clear existing data (default: true)
- `daysBack`: Number of days to generate (default: 35)
- `includeStreak`: Whether to set sample streak (default: true)

### `quickLoadSampleData()`
Convenience function for quick 30-day demo data load with default settings.

### `loadExtendedSampleData()`
Loads 60 days of sample data for showcasing long-term patterns and trends.

### `appendSampleData(daysBack = 14)`
Adds historical data without clearing existing entries. Useful for extending demo data.

### `displayDataSummary()`
Shows current localStorage data summary including:
- Total entries count
- Current streak days
- User data presence
- Average mood calculation
- Date range coverage

### `exportCurrentData()`
Exports all current data from localStorage in JSON format for backup or analysis.

## Sample User Data

Creates realistic demo user profile:
```javascript
{
  name: 'Demo User',
  joinDate: calculated_from_data_range,
  preferences: {
    theme: 'light',
    notifications: true,
    dailyReminder: '20:00'
  },
  goals: {
    dailyTracking: true,
    moodTarget: 4,
    minActivitiesPerDay: 3
  }
}
```

## Console Helpers

When loaded in browser, provides global `DailySyncSampleData` object with methods:
- `load(options)` - Custom data loading
- `quickLoad()` - 30-day quick load
- `loadExtended()` - 60-day extended load
- `append(days)` - Append historical data
- `summary()` - Show current data summary
- `export()` - Export current data
- `clear()` - Clear all localStorage data

## Usage Examples

### In Browser Console
```javascript
// Quick demo data load
await DailySyncSampleData.quickLoad();

// Check what's currently loaded
await DailySyncSampleData.summary();

// Add more historical data
await DailySyncSampleData.append(30);

// Export for backup
const data = await DailySyncSampleData.export();
```

### In Module
```javascript
import { quickLoadSampleData, displayDataSummary } from './scripts/load-sample-data.js';

// Load sample data
const result = await quickLoadSampleData();
if (result.success) {
  console.log(`Loaded ${result.entriesLoaded} entries`);
}

// Show summary
await displayDataSummary();
```

## Output Format

### Success Response
```javascript
{
  success: true,
  entriesLoaded: 32,
  stats: {
    totalEntries: 32,
    averageMood: 3.24,
    streakInfo: { current: 8, longest: 15 },
    bestMoodActivity: 'exercise'
  },
  message: 'Sample data loaded successfully'
}
```

### Error Response
```javascript
{
  success: false,
  error: 'LocalStorage not available',
  message: 'Failed to load sample data'
}
```

## Integration

This script integrates with:
- **Sample Data Module**: For data generation
- **Storage Manager**: For localStorage operations
- **Config Module**: For accessing app settings
- **Demo HTML**: For browser-based testing interface

## CSS Variables Required

None - this is a data management script with no UI components.