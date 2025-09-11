# modules/app.js

**Purpose:** Main application controller and entry point for the Daily Sync mood tracking application.

## Core Components

### DailySyncApp Class
Main application class that manages state, routing, and component orchestration.

#### State Management
- **currentView:** Active route/view ('home', 'mood', 'questions', etc.)
- **currentEntry:** Active mood tracking entry being completed
- **user:** User data and preferences
- **streak:** Consecutive days streak counter
- **isLoading/error:** Application status states

#### Component Integration
Manages instances of UI components:
- **MoodSelector:** Mood selection interface
- **ActivitySelector:** Activity selection interface  
- **QuestionCard:** Question and answer interface

#### Routing System
Hash-based routing with these views:
- **home:** Welcome screen with streak display
- **mood:** Mood selection interface
- **questions:** Question answering flow
- **activities:** Activity selection
- **diary:** Completion confirmation
- **stats:** Statistics view (placeholder)

### Key Methods

#### Navigation & State
- **navigateTo(viewName):** Route to specific view with history management
- **setState(newState):** Update state and trigger re-render
- **getCurrentRoute():** Parse current route from URL hash

#### Event Handling
- **handleMoodSelected:** Process mood selection and navigate to activities
- **handleQuestionsCompleted:** Save completed entry and update streak
- **handleActivitiesSelected:** Process activity selection and navigate to questions

#### View Management
- **showHomeView():** Welcome screen with start button
- **showMoodView():** Initialize and show mood selector
- **showQuestionsView():** Load questions based on mood and activities
- **showActivitiesView():** Activity selection interface
- **showDiaryView():** Success confirmation screen
- **showStatsView():** Statistics placeholder

#### Data Management
- **createNewEntry():** Generate new tracking entry with unique ID
- **updateStreak():** Calculate and save consecutive day streak
- **isConsecutiveDay():** Check if entries are on consecutive days

### Event-Driven Architecture
Listens for custom component events:
- `mood-selected` - Mood selection completed
- `questions-completed` - All questions answered
- `questions-auto-saved` - Progress auto-saved
- `activities-selected` - Activities selected
- `navigate` - Navigation request

### Initialization Flow
1. Load saved user data and streak from storage
2. Setup event listeners for components and navigation
3. Check for unfinished entry and resume if found
4. Navigate to current route or default to home

### Integration Points
- **StorageManager:** Data persistence via `storageManager` global
- **Config:** Uses mood/question data from `config.js`
- **Components:** Manages lifecycle of UI component instances

The app follows a single-page application pattern with hash-based routing and event-driven component communication.