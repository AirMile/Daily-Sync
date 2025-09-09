# modules/config.js

**Purpose:** Centralized configuration file containing all data constants used throughout the Daily Sync application.

## Configuration Objects

### MOODS
Mood level definitions with visual and data properties:
- **value:** Numeric scale 1-5 (1=Terrible, 5=Amazing)
- **emoji:** Visual emoji representation
- **label:** Human-readable mood description
- **color:** Hex color code for UI styling

### ACTIVITIES
Activity options for daily tracking:
- Categorized activity types (work, exercise, social, etc.)
- Each activity has name and optional emoji/icon
- Used in activity selector component

### QUESTIONS
Question sets for mood-based inquiry:
- Questions organized by mood level
- Template-based question generation
- Different question sets for different emotional states

### APP_SETTINGS
Application behavior configuration:
- **validation:** Input validation rules (min answer length, etc.)
- **ui:** Interface settings (animation delays, transitions)
- **storage:** Data persistence settings
- **features:** Feature flags and toggles

### STATS_CONFIG
Statistics and analytics configuration:
- Chart settings and data visualization options
- Calculation parameters for insights
- Display preferences for statistics view

## Helper Functions

### getQuestionsByMood(moodValue)
Returns appropriate question set based on mood level:
- Takes mood value (1-5) as parameter
- Returns filtered questions relevant to that emotional state
- Ensures contextually appropriate questions

### getRandomQuestions(questionSet, count)
Selects random subset of questions:
- Takes question array and desired count
- Returns randomized selection
- Prevents question repetition within same session

## Data Architecture

### Object.freeze() Pattern
All configuration objects are frozen to prevent modification:
- Ensures data integrity throughout application
- Prevents accidental mutation of core configuration
- Makes configuration immutable and reliable

### Separation of Concerns
Configuration is separated by domain:
- **MOODS:** Emotional state data
- **ACTIVITIES:** Daily activity options  
- **QUESTIONS:** Survey/inquiry content
- **APP_SETTINGS:** Application behavior
- **STATS_CONFIG:** Analytics and insights

This centralized approach ensures consistent data access and easy maintenance of application constants.