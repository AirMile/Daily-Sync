# modules/stats.js

**Purpose:** Statistics calculator - processes historical data for insights and trends

## Current Status
**✅ IMPLEMENTED** - Full statistical analysis functionality completed in Phase 3.

## Implemented Functionality

### Core Statistics Functions

#### calculateMoodTrends(entries, period)
Calculates mood trends over specified time periods ('week', 'month', 'year').
```javascript
// Returns: { trends: [...], average: number, change: number }
const weeklyTrends = calculateMoodTrends(entries, 'week');
```

#### analyzeActivityPatterns(entries)
Analyzes correlations between activities and mood levels.
```javascript
// Returns: { correlations: {...}, topPositive: [...], topNegative: [...] }
const patterns = analyzeActivityPatterns(entries);
```

#### calculateStreaks(entries)
Tracks consecutive days of logging with current and longest streaks.
```javascript
// Returns: { current: number, longest: number, streakHistory: [...] }
const streaks = calculateStreaks(entries);
```

#### generateSummaryStats(entries)
Creates comprehensive summary statistics.
```javascript
// Returns complete summary object with averages, distributions, and key activities
const summary = generateSummaryStats(entries);
```

#### getMoodDistribution(entries)
Calculates mood distribution as percentages.
```javascript
// Returns: { '1': 10, '2': 15, '3': 30, '4': 25, '5': 20 }
const distribution = getMoodDistribution(entries);
```

#### getActivityImpact(entries, activityId)
Analyzes specific activity's impact on mood compared to baseline.
```javascript
// Returns: { impact, comparison, confidence, avgWithActivity, avgWithoutActivity }
const impact = getActivityImpact(entries, 'exercise');
```

#### getTimePatterns(entries)
Analyzes time-based patterns (days of week, time of day).
```javascript
// Returns: { byDayOfWeek: {...}, byTimeOfDay: {...}, insights: [...] }
const timePatterns = getTimePatterns(entries);
```

### Integration Points
- **✅ Storage.js:** Integrates with getAllEntries() and getEntriesByDateRange()
- **✅ Config.js:** Uses MOODS and ACTIVITIES configurations for analysis
- **✅ AI-Diary.js:** Provides statistical data for personalized insights
- **✅ StatsView.js:** Powers all chart visualizations and summary cards

### Data Processing
Processes entry data format:
```javascript
{
  id: 'unique-id',
  date: '2024-01-01T12:00:00.000Z',
  mood: 4, // 1-5 scale
  activities: ['work', 'exercise'],
  questions: [/* question objects */],
  responses: ['response text'],
  completed: true
}
```

### Statistical Output Examples

#### Mood Trends
```javascript
{
  trends: [
    { date: '2024-01-01', mood: 4.2 },
    { date: '2024-01-02', mood: 3.8 }
  ],
  average: 4.0,
  change: 0.3 // Weekly trend change
}
```

#### Activity Patterns
```javascript
{
  correlations: {
    'exercise': { averageMood: 4.2, frequency: 15, impact: 'positive' },
    'work': { averageMood: 3.1, frequency: 20, impact: 'neutral' }
  },
  topPositive: [
    { activityId: 'exercise', averageMood: 4.2, frequency: 15, impact: 'positive' }
  ],
  topNegative: [
    { activityId: 'deadline', averageMood: 2.8, frequency: 8, impact: 'negative' }
  ]
}
```

#### Summary Statistics
```javascript
{
  totalEntries: 45,
  averageMood: 3.8,
  moodDistribution: { '1': 2, '2': 5, '3': 15, '4': 18, '5': 5 },
  mostCommonActivity: 'work',
  bestMoodActivity: 'exercise',
  streakInfo: { current: 7, longest: 12 }
}
```

### Features
- **Real-time Calculations:** All statistics calculated dynamically from current data
- **Robust Error Handling:** Handles empty data and edge cases gracefully  
- **Performance Optimized:** Efficient algorithms for large datasets
- **Flexible Time Periods:** Supports week/month/year analysis
- **Pattern Recognition:** Identifies trends and correlations automatically

This module successfully transforms raw tracking data into meaningful statistical insights that power the statistics dashboard and AI diary generation.