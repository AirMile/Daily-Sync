# components/stats-view.js

**Purpose:** Statistics visualization component displaying mood trends, activity patterns, and AI-generated insights.

## Current Status
**Fully implemented** - Active component providing comprehensive mood and activity statistics with AI-generated diary entries and personalized insights.

## Implementation Details

### StatsView Class
ES6 class-based component for visualizing historical mood and activity data through charts, statistics, and AI insights.

#### Component Structure
1. **Summary Cards Section** - Key metrics displayed prominently
2. **AI Insights Section** - AI-generated diary entries and personalized insights
3. **Charts Section** - Visual representations of mood and activity data

### Current Features

#### Summary Cards (1 card total)
- **Average Mood** (😊) - Shows calculated average mood for selected period

**Note:** Previously included Current Streak (🔥), Total Entries (📝), and Top Activity (⭐) cards - these have been removed to simplify the interface and focus on the core mood metric.

#### AI Insights Section (positioned above charts)
- **📖 AI Diary** - Template-based weekly summaries of mood patterns
- **💡 Personalized Insights** - Generated insights based on user data patterns

#### Charts Section 
- **Mood Trends** - Line chart showing mood progression over time
- **Mood Distribution** - Pie chart showing distribution of mood levels

#### Time Period Controls
- **Week/Month/Year toggles** - Filter data by time period
- **Diary button** - Navigate to detailed diary view
- **Export button** - Export data functionality

### Key Methods

#### Core Functionality
- **init(container, entries)** - Initialize component with data
- **render()** - Generate HTML structure
- **loadStats()** - Calculate and display statistics
- **updateSummaryCards(stats)** - Update summary card values (only average mood)

#### Chart Rendering
- **renderMoodTrendsChart(trends)** - Canvas-based line chart for mood trends
- **renderMoodDistributionChart(distribution)** - Canvas-based pie chart for mood distribution
- **drawChartBackground()** - Utility for chart axes and grid lines

#### AI Content
- **loadAIContent(stats)** - Load AI diary entries and personalized insights

#### Event Handling
- **handlePeriodChange()** - Switch time periods (week/month/year)
- **handleExport()** - Export data functionality
- **handleDiaryView()** - Navigate to diary view

### Data Integration
- **Storage.js** - Retrieves historical entry data
- **Stats.js** - Statistical calculation functions (trends, patterns, distributions)
- **AI-Diary.js** - Template-based diary and insight generation
- **Config.js** - Mood and activity configuration data

### Canvas-Based Charts
Uses native HTML5 Canvas API for all chart rendering:
- Custom line charts with data points and trend lines
- Pie charts with percentage labels and mood-based colors
- Consistent styling using CSS custom properties

### CSS Dependencies  
Uses global CSS variables (following project :root pattern):
- `--primary-color` - Chart line and accent colors
- `--success-color` - Positive activity impact bars
- `--danger-color` - Negative activity impact bars  
- `--text-primary` - Chart labels and text
- `--border-color` - Chart axes and grid lines

### Event System
Emits custom events for component communication:
- `stats-view-ready` - Component initialization complete
- `export-requested` - User requests data export
- `navigate` - Navigation to diary view

### Error Handling
- **showEmptyState()** - Display when no data available
- **showErrorState()** - Display when loading fails
- **destroy()** - Cleanup method for component removal

### Current Layout Order
1. Summary Cards (Average Mood only)
2. AI Insights (📖 AI Diary, 💡 Personalized Insights) 
3. Charts (Mood Trends, Mood Distribution)

This minimal layout focuses on the essential mood metric while prioritizing AI-generated insights over raw statistical charts, creating a clean and actionable user interface with only the most relevant visualizations.