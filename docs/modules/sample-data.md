# Sample Data Module

**File**: `modules/sample-data.js`

## Purpose

Generates realistic sample data for the Daily Sync App prototype, including mood entries, activities, question responses, and AI-generated diary entries. This module enables demonstration of all app features with meaningful historical data spanning multiple weeks.

## Key Features

### Data Generation
- **Realistic Patterns**: Generates mood data with weekly cycles (higher moods on weekends, lower on Mondays)
- **Activity Correlation**: Associates activities with appropriate mood levels
- **Varied Responses**: Creates diverse, thoughtful responses to questions from different categories
- **Time Distribution**: Spreads entries across different times of day (8 AM - 8 PM)

### Data Structure
Each generated entry includes:
- `id`: Unique identifier
- `date`: ISO timestamp with realistic time variation
- `mood`: Integer 1-5 with pattern-based distribution
- `activities`: Array of 3-7 activity IDs from various categories
- `questions`: Selected questions appropriate for mood level
- `responses`: Realistic answers using category-specific templates
- `answers`: Mapped responses for storage compatibility
- `diaryEntry`: AI-generated diary entry using existing templates
- `completed`: Always true for sample data

### Response Templates
Includes realistic response templates for question categories:
- **happiness**: Family time, personal goals, nature, creativity
- **gratitude**: Health, relationships, opportunities, basic comforts
- **achievement**: Education, relationships, personal growth, contributions
- **stress**: Work deadlines, finances, responsibilities, uncertainty
- **worry**: Life choices, family health, job security, environment
- **energy**: Exercise, sleep, nutrition, creativity, outdoor time
- **learning**: Self-awareness insights about resilience, boundaries, habits

## Functions

### `generateSampleEntries(daysBack = 35)`
- Generates array of sample mood entries for specified number of days
- Implements realistic patterns and correlations
- Includes 85-95% completion rate for authenticity
- Returns entries sorted by date (most recent first)

### `calculateSampleStats(entries)`
- Calculates comprehensive statistics from sample entries
- Returns average mood, streak information, mood distribution
- Identifies best mood activity with minimum occurrence threshold
- Provides activity correlation data

### `exportSampleDataAsJSON(entries)`
- Exports sample data with metadata for inspection
- Includes generation timestamp, statistics, and complete entries
- Formatted JSON for easy analysis and debugging

## Mood Patterns

### Weekly Cycles
- **Weekends (Sat/Sun)**: Base mood 3.8 (higher)
- **Mondays**: Base mood 2.5 (lower - "Monday blues")
- **Fridays**: Base mood 3.6 (anticipation boost)
- **Other weekdays**: Base mood 3.0 (neutral)

### Activity Associations
- **High mood (4-5)**: Positive emotions, exercise, social activities, creative work
- **Low mood (1-2)**: Stress/tiredness emotions, coping activities (meditation, alone time)
- **Neutral mood (3)**: Balanced mix of all activity types

## Usage

```javascript
import { generateSampleEntries, calculateSampleStats } from './sample-data.js';

// Generate 30 days of sample data
const entries = generateSampleEntries(30);

// Calculate statistics
const stats = calculateSampleStats(entries);

// Export for analysis
const exportData = exportSampleDataAsJSON(entries);
```

## Integration

This module integrates with:
- **Storage Manager**: For saving entries to localStorage
- **AI Diary Module**: For generating diary entries
- **Config Module**: For accessing mood, activity, and question definitions
- **Load Script**: For automated sample data loading

## CSS Variables Required

None - this module only generates data and doesn't handle UI rendering.