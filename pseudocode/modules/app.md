# App Module - Pseudocode

## Purpose
Main controller for the Daily Sync application. Manages routing, state management and coordinates all modules.

## Structure

```pseudocode
MODULE app

IMPORT config FROM './config'
IMPORT storage FROM './storage'
IMPORT mood FROM './mood'
IMPORT questions FROM './questions'
IMPORT stats FROM './stats'
IMPORT aiDiary FROM './ai-diary'

CLASS DailySyncApp
    PRIVATE state = {
        currentView: 'home',
        currentEntry: null,
        user: null,
        streak: 0,
        isLoading: false,
        error: null
    }
    
    PRIVATE routes = {
        'home': HomeView,
        'mood': MoodView,
        'questions': QuestionsView,
        'activities': ActivitiesView,
        'diary': DiaryView,
        'stats': StatsView
    }
    
    CONSTRUCTOR()
        this.initialize()
    END CONSTRUCTOR
    
    ASYNC FUNCTION initialize()
        TRY
            SET state.isLoading = true
            
            // Load saved data
            savedData = AWAIT storage.loadUserData()
            IF savedData THEN
                state.user = savedData.user
                state.streak = savedData.streak
            END IF
            
            // Initialize event listeners
            this.setupEventListeners()
            
            // Check for unfinished entries
            unfinishedEntry = AWAIT storage.getUnfinishedEntry()
            IF unfinishedEntry THEN
                state.currentEntry = unfinishedEntry
                this.navigateTo('questions')
            ELSE
                this.navigateTo('home')
            END IF
            
        CATCH error
            this.handleError(error)
        FINALLY
            SET state.isLoading = false
        END TRY
    END FUNCTION
    
    FUNCTION setupEventListeners()
        // Listen to custom events from components
        document.addEventListener('mood-selected', this.handleMoodSelected)
        document.addEventListener('question-answered', this.handleQuestionAnswered)
        document.addEventListener('activity-logged', this.handleActivityLogged)
        document.addEventListener('navigate', this.handleNavigation)
        
        // Browser back button
        window.addEventListener('popstate', this.handleBrowserNavigation)
    END FUNCTION
    
    FUNCTION handleMoodSelected(event)
        moodValue = event.detail.mood
        
        // Start new entry or update existing
        IF NOT state.currentEntry THEN
            state.currentEntry = this.createNewEntry()
        END IF
        
        state.currentEntry.mood = moodValue
        state.currentEntry.timestamp = Date.now()
        
        // Save and go to questions
        AWAIT storage.saveEntry(state.currentEntry)
        this.navigateTo('questions')
    END FUNCTION
    
    FUNCTION handleQuestionAnswered(event)
        questionId = event.detail.questionId
        answer = event.detail.answer
        
        IF NOT state.currentEntry.answers THEN
            state.currentEntry.answers = {}
        END IF
        
        state.currentEntry.answers[questionId] = answer
        
        // Validate answer length
        IF answer.length < config.APP_SETTINGS.validation.minAnswerLength THEN
            this.showError("Answer must be at least 10 characters")
            RETURN
        END IF
        
        // Save
        AWAIT storage.saveEntry(state.currentEntry)
        
        // Check if all questions are answered
        IF this.allQuestionsAnswered() THEN
            this.navigateTo('activities')
        END IF
    END FUNCTION
    
    FUNCTION handleActivityLogged(event)
        activities = event.detail.activities
        
        state.currentEntry.activities = activities
        
        // Generate AI diary entry
        diaryEntry = AWAIT aiDiary.generateEntry(state.currentEntry)
        state.currentEntry.diaryText = diaryEntry
        
        // Mark entry as complete
        state.currentEntry.completed = true
        
        // Save and update streak
        AWAIT storage.saveEntry(state.currentEntry)
        this.updateStreak()
        
        // Reset current entry and go to diary view
        state.currentEntry = null
        this.navigateTo('diary')
    END FUNCTION
    
    FUNCTION navigateTo(viewName)
        IF NOT routes[viewName] THEN
            this.handleError(new Error(`Unknown view: ${viewName}`))
            RETURN
        END IF
        
        // Update state
        previousView = state.currentView
        state.currentView = viewName
        
        // Update browser history
        history.pushState({ view: viewName }, '', `#${viewName}`)
        
        // Render new view
        this.render()
        
        // Emit navigation event
        this.emit('navigation-complete', {
            from: previousView,
            to: viewName
        })
    END FUNCTION
    
    FUNCTION render()
        container = document.getElementById('app')
        ViewComponent = routes[state.currentView]
        
        // Clear container
        container.innerHTML = ''
        
        // Render loading state
        IF state.isLoading THEN
            container.innerHTML = this.renderLoadingState()
            RETURN
        END IF
        
        // Render error state
        IF state.error THEN
            container.innerHTML = this.renderErrorState()
            RETURN
        END IF
        
        // Render current view
        viewInstance = new ViewComponent(state)
        container.appendChild(viewInstance.render())
    END FUNCTION
    
    FUNCTION createNewEntry()
        RETURN {
            id: this.generateId(),
            date: new Date().toISOString(),
            mood: null,
            answers: {},
            activities: [],
            diaryText: '',
            completed: false
        }
    END FUNCTION
    
    FUNCTION generateId()
        RETURN `entry_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    END FUNCTION
    
    FUNCTION allQuestionsAnswered()
        requiredQuestions = questions.getSelectedQuestions()
        answeredQuestions = Object.keys(state.currentEntry.answers || {})
        
        RETURN requiredQuestions.every(q => answeredQuestions.includes(q.id))
    END FUNCTION
    
    FUNCTION updateStreak()
        lastEntry = AWAIT storage.getLastCompletedEntry()
        
        IF this.isConsecutiveDay(lastEntry) THEN
            state.streak++
        ELSE
            state.streak = 1
        END IF
        
        AWAIT storage.saveStreak(state.streak)
    END FUNCTION
    
    FUNCTION isConsecutiveDay(lastEntry)
        IF NOT lastEntry THEN RETURN false
        
        lastDate = new Date(lastEntry.date)
        today = new Date()
        
        // Check if dates are consecutive
        diffTime = Math.abs(today - lastDate)
        diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
        
        RETURN diffDays === 1
    END FUNCTION
    
    FUNCTION handleError(error)
        console.error('App Error:', error)
        state.error = error.message
        this.render()
    END FUNCTION
    
    FUNCTION emit(eventName, detail)
        customEvent = new CustomEvent(eventName, { detail })
        document.dispatchEvent(customEvent)
    END FUNCTION
END CLASS

// Singleton instance
LET appInstance = null

FUNCTION initApp()
    IF NOT appInstance THEN
        appInstance = new DailySyncApp()
    END IF
    RETURN appInstance
END FUNCTION

EXPORT default initApp
```

## Data Flow
1. App initializes on page load
2. Loads saved state from localStorage
3. Listens to events from components
4. Manages navigation between views
5. Coordinates data flow between modules
6. Saves state on important actions

## State Management
- Central state in app module
- Components communicate via custom events
- State is persisted to localStorage
- Immutable updates where possible

## Error Handling
- Try-catch blocks for async operations
- User-friendly error messages
- Fallback UI for error states
- Console logging for debugging

## Dependencies
- config: For app settings and validation
- storage: For data persistence
- mood: For mood selection logic
- questions: For question bank management
- stats: For statistics calculations
- ai-diary: For diary generation