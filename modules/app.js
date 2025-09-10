// Main application controller - orchestrates the entire Daily Sync app
// Handles navigation between screens, manages app state, and coordinates all modules
import { APP_SETTINGS, getQuestionsByMood, getRandomQuestions } from './config.js';
import storageManager from './storage.js';
import { MoodSelector } from '../components/mood-selector.js';
import { ActivitySelector } from '../components/activity-selector.js';
import { QuestionCard } from '../components/question-card.js';
import { StatsView } from '../components/stats-view.js';
import { DiaryView } from '../components/diary-view.js';

class DailySyncApp {
    constructor() {
        this.state = {
            currentView: 'home',
            currentEntry: null,
            user: null,
            streak: 0,
            isLoading: false,
            error: null
        };
        
        // Component instances
        this.components = {
            moodSelector: null,
            activitySelector: null,
            questionCard: null,
            statsView: null,
            diaryView: null
        };
        
        this.routes = {
            'home': () => this.showHomeView(),
            'mood': () => this.showMoodView(),
            'questions': () => this.showQuestionsView(),
            'activities': () => this.showActivitiesView(),
            'diary': () => this.showDiaryView(),
            'stats': () => this.showStatsView()
        };
        
        this.initialize();
    }
    
    async initialize() {
        try {
            this.setState({ isLoading: true });
            
            // Load saved data
            const savedData = await storageManager.loadUserData();
            if (savedData) {
                this.state.user = savedData.user;
                this.state.streak = savedData.streak || 0;
            }
            
            // Load current streak
            const streak = await storageManager.getStreak();
            this.setState({ streak });
            
            // Setup event listeners
            this.setupEventListeners();
            
            // Check for unfinished entry
            const unfinishedEntry = await storageManager.getUnfinishedEntry();
            if (unfinishedEntry) {
                this.state.currentEntry = unfinishedEntry;
                this.navigateTo('questions');
            } else {
                // Check current route from URL
                const currentRoute = this.getCurrentRoute();
                this.navigateTo(currentRoute);
            }
            
        } catch (error) {
            this.handleError(error);
        } finally {
            this.setState({ isLoading: false });
        }
    }
    
    getCurrentRoute() {
        const hash = window.location.hash.slice(1) || 'home';
        return this.routes[hash] ? hash : 'home';
    }
    
    setState(newState) {
        this.state = { ...this.state, ...newState };
        this.render();
    }
    
    setupEventListeners() {
        // Custom component events
        document.addEventListener('mood-selected', (event) => this.handleMoodSelected(event));
        document.addEventListener('questions-completed', (event) => this.handleQuestionsCompleted(event));
        document.addEventListener('questions-auto-saved', (event) => this.handleQuestionsAutoSaved(event));
        document.addEventListener('activities-selected', (event) => this.handleActivitiesSelected(event));
        document.addEventListener('navigate', (event) => this.handleNavigation(event));
        
        // Browser navigation
        window.addEventListener('popstate', () => this.handleBrowserNavigation());
        window.addEventListener('hashchange', () => this.handleBrowserNavigation());
        
        // Navigation buttons
        document.addEventListener('click', (event) => {
            if (event.target.matches('.nav-btn')) {
                const route = event.target.getAttribute('data-route');
                this.navigateTo(route);
            }
        });
    }
    
    handleMoodSelected(event) {
        const { mood, label, emoji, color } = event.detail;
        
        // Start new entry or update existing
        if (!this.state.currentEntry) {
            this.state.currentEntry = this.createNewEntry();
        }
        
        this.state.currentEntry.mood = mood;
        this.state.currentEntry.moodData = { value: mood, label, emoji, color };
        this.state.currentEntry.timestamp = Date.now();
        
        // Save and navigate to activities
        storageManager.saveEntry(this.state.currentEntry);
        this.navigateTo('activities');
    }
    
    async handleQuestionsCompleted(event) {
        const { answers, questions, mood } = event.detail;
        
        if (!this.state.currentEntry) {
            this.state.currentEntry = this.createNewEntry();
        }
        
        // Store answers and questions
        this.state.currentEntry.answers = answers;
        this.state.currentEntry.questions = questions;
        
        // Mark entry as complete
        this.state.currentEntry.completed = true;
        this.state.currentEntry.completedAt = Date.now();
        
        // Save entry and update streak
        await storageManager.saveEntry(this.state.currentEntry);
        await this.updateStreak();
        
        // Reset current entry and go to statistics view
        this.state.currentEntry = null;
        this.navigateTo('stats');
    }
    
    async handleQuestionsAutoSaved(event) {
        const { answers, currentQuestion, totalQuestions } = event.detail;
        
        if (this.state.currentEntry) {
            this.state.currentEntry.answers = answers;
            this.state.currentEntry.currentQuestionIndex = currentQuestion;
            await storageManager.saveEntry(this.state.currentEntry);
        }
    }
    
    async handleActivitiesSelected(event) {
        const { activities, count } = event.detail;
        
        if (!this.state.currentEntry) {
            this.state.currentEntry = this.createNewEntry();
        }
        
        this.state.currentEntry.activities = activities;
        this.state.currentEntry.activityCount = count;
        
        // Save entry and navigate to questions
        await storageManager.saveEntry(this.state.currentEntry);
        this.navigateTo('questions');
    }
    
    handleNavigation(event) {
        const { route } = event.detail;
        this.navigateTo(route);
    }
    
    handleBrowserNavigation() {
        const currentRoute = this.getCurrentRoute();
        this.setState({ currentView: currentRoute });
    }
    
    navigateTo(viewName) {
        if (!this.routes[viewName]) {
            this.handleError(new Error(`Unknown view: ${viewName}`));
            return;
        }
        
        // Clear localStorage when navigating to home (reset app state)
        if (viewName === 'home') {
            localStorage.clear();
            this.state.currentEntry = null;
            this.destroyAllComponents();
        }
        
        // Update state
        const previousView = this.state.currentView;
        this.setState({ currentView: viewName });
        
        // Update browser history
        if (window.location.hash.slice(1) !== viewName) {
            history.pushState({ view: viewName }, '', `#${viewName}`);
        }
        
        // Emit navigation event
        this.emit('navigation-complete', {
            from: previousView,
            to: viewName
        });
    }
    
    render() {
        const container = document.getElementById('main-content');
        const loadingElement = document.getElementById('loading');
        const errorElement = document.getElementById('error');
        const viewContainer = document.getElementById('view-container');
        
        // Show/hide loading state
        if (this.state.isLoading) {
            loadingElement.style.display = 'block';
            errorElement.style.display = 'none';
            viewContainer.style.display = 'none';
            return;
        }
        
        loadingElement.style.display = 'none';
        
        // Show/hide error state
        if (this.state.error) {
            errorElement.style.display = 'block';
            viewContainer.style.display = 'none';
            document.getElementById('error-message').textContent = this.state.error;
            return;
        }
        
        errorElement.style.display = 'none';
        viewContainer.style.display = 'block';
        
        // Update streak display
        const streakCounter = document.getElementById('streak-counter');
        if (streakCounter) {
            streakCounter.textContent = this.state.streak;
        }
        
        // Update navigation buttons
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.getAttribute('data-route') === this.state.currentView) {
                btn.classList.add('active');
            }
        });
        
        // Show current view
        const showFunction = this.routes[this.state.currentView];
        if (showFunction) {
            showFunction();
        }
    }
    
    showHomeView() {
        const viewContainer = document.getElementById('view-container');
        viewContainer.innerHTML = `
            <div class="home-view">
                <h2>Welcome to Daily Sync</h2>
                <p>How do you feel today?</p>
                <button class="primary-btn start-today-btn">
                    Start today
                </button>
                <div class="streak-info">
                    <h3>Your streak: ${this.state.streak} days</h3>
                </div>
            </div>
        `;
        
        // Bind start button
        viewContainer.querySelector('.start-today-btn').addEventListener('click', () => {
            this.navigateTo('mood');
        });
        
        // Hide all components
        this.hideAllComponents();
    }
    
    showMoodView() {
        const viewContainer = document.getElementById('view-container');
        
        // Initialize mood selector component if not exists
        if (!this.components.moodSelector) {
            viewContainer.innerHTML = '<div id="mood-selector-container"></div>';
            const container = document.getElementById('mood-selector-container');
            this.components.moodSelector = new MoodSelector(container);
        }
        
        // Hide other components but not the mood selector
        if (this.components.activitySelector) {
            this.components.activitySelector.hide();
        }
        if (this.components.questionCard) {
            this.components.questionCard.hide();
        }
        
        this.components.moodSelector.reset();
        this.components.moodSelector.show();
    }
    
    showQuestionsView() {
        if (!this.state.currentEntry || (this.state.currentEntry.mood === null && this.state.currentEntry.mood !== 0) || !this.state.currentEntry.activities) {
            this.navigateTo('mood');
            return;
        }
        
        const viewContainer = document.getElementById('view-container');
        
        // Initialize question card component if not exists
        if (!this.components.questionCard) {
            viewContainer.innerHTML = '<div id="question-card-container"></div>';
            const container = document.getElementById('question-card-container');
            this.components.questionCard = new QuestionCard(container);
        }
        
        // Hide other components but not the question card
        if (this.components.moodSelector) {
            this.components.moodSelector.hide();
        }
        if (this.components.activitySelector) {
            this.components.activitySelector.hide();
        }
        
        this.components.questionCard.setMood(this.state.currentEntry.mood);
        
        // Load existing answers if any
        if (this.state.currentEntry.answers) {
            this.components.questionCard.setAnswers(this.state.currentEntry.answers);
        }
        
        this.components.questionCard.show();
    }
    
    showActivitiesView() {
        const viewContainer = document.getElementById('view-container');
        
        // Initialize activity selector component if not exists
        if (!this.components.activitySelector) {
            viewContainer.innerHTML = '<div id="activity-selector-container"></div>';
            const container = document.getElementById('activity-selector-container');
            this.components.activitySelector = new ActivitySelector(container);
        }
        
        // Hide other components but not the activity selector
        if (this.components.moodSelector) {
            this.components.moodSelector.hide();
        }
        if (this.components.questionCard) {
            this.components.questionCard.hide();
        }
        
        this.components.activitySelector.reset();
        this.components.activitySelector.show();
    }
    
    async showDiaryView() {
        const viewContainer = document.getElementById('view-container');
        
        try {
            // Load all entries for diary view
            const entries = await storageManager.getAllEntries();
            
            // Initialize diary view component if not exists
            if (!this.components.diaryView) {
                viewContainer.innerHTML = '<div id="diary-view-container"></div>';
                const container = document.getElementById('diary-view-container');
                this.components.diaryView = new DiaryView();
                await this.components.diaryView.init(container, entries);
            } else {
                // Update existing diary view with latest entries
                this.components.diaryView.updateEntries(entries);
            }
            
            this.hideAllComponents();
            this.components.diaryView.show();
            
        } catch (error) {
            console.error('Error loading diary view:', error);
            this.handleError(error);
        }
    }
    
    async showStatsView() {
        const viewContainer = document.getElementById('view-container');
        
        try {
            // Load all entries for statistics
            const entries = await storageManager.getAllEntries();
            
            // Initialize stats view component if not exists
            if (!this.components.statsView) {
                viewContainer.innerHTML = '<div id="stats-view-container"></div>';
                const container = document.getElementById('stats-view-container');
                this.components.statsView = new StatsView();
                
                // Setup export event listener
                container.addEventListener('export-requested', (event) => {
                    this.handleExportRequest(event.detail);
                });
            }
            
            // Hide other components
            this.hideAllComponents();
            
            // Initialize stats view with data
            const container = document.getElementById('stats-view-container');
            await this.components.statsView.init(container, entries);
            
        } catch (error) {
            console.error('Error loading stats view:', error);
            this.showStatsError();
        }
    }
    
    async handleExportRequest(exportDetails) {
        try {
            const { format } = exportDetails;
            
            if (format === 'csv') {
                const success = await storageManager.downloadExport('csv');
                if (!success) {
                    alert('Failed to export data as CSV. Please try again.');
                }
            } else {
                const success = await storageManager.downloadExport('json');
                if (!success) {
                    alert('Failed to export data as JSON. Please try again.');
                }
            }
        } catch (error) {
            console.error('Error during export:', error);
            alert('Export failed. Please try again.');
        }
    }
    
    showStatsError() {
        const viewContainer = document.getElementById('view-container');
        viewContainer.innerHTML = `
            <div class="stats-view">
                <div class="error-state">
                    <div class="error-icon">⚠️</div>
                    <h3 class="error-title">Error Loading Statistics</h3>
                    <p class="error-description">
                        There was a problem loading your statistics. Please try refreshing the page.
                    </p>
                    <button class="error-action" onclick="location.reload()">
                        Refresh Page
                    </button>
                </div>
            </div>
        `;
    }
    
    createNewEntry() {
        return {
            id: this.generateId(),
            date: new Date().toISOString(),
            mood: null,
            answers: {},
            activities: [],
            diaryText: '',
            completed: false
        };
    }
    
    generateId() {
        return `entry_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
    
    allQuestionsAnswered() {
        if (!this.state.currentEntry || !this.state.currentEntry.answers) {
            return false;
        }
        
        const questions = getRandomQuestions(
            getQuestionsByMood(this.state.currentEntry.mood),
            3
        );
        
        return questions.every(q => 
            this.state.currentEntry.answers[q.id] && 
            this.state.currentEntry.answers[q.id].length >= APP_SETTINGS.validation.minAnswerLength
        );
    }
    
    async updateStreak() {
        const lastEntry = await storageManager.getLastCompletedEntry();
        
        if (this.isConsecutiveDay(lastEntry)) {
            this.state.streak++;
        } else {
            this.state.streak = 1;
        }
        
        await storageManager.saveStreak(this.state.streak);
        this.setState({ streak: this.state.streak });
    }
    
    isConsecutiveDay(lastEntry) {
        if (!lastEntry) return false;
        
        const lastDate = new Date(lastEntry.date);
        const today = new Date();
        
        // Check if dates are consecutive
        const diffTime = Math.abs(today - lastDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        return diffDays === 1;
    }
    
    handleError(error) {
        console.error('App Error:', error);
        this.setState({ error: error.message });
    }
    
    showError(message) {
        this.setState({ error: message });
        // Clear error after 3 seconds
        setTimeout(() => {
            this.setState({ error: null });
        }, 3000);
    }
    
    hideAllComponents() {
        // Hide all component instances
        if (this.components.moodSelector) {
            this.components.moodSelector.hide();
        }
        if (this.components.activitySelector) {
            this.components.activitySelector.hide();
        }
        if (this.components.questionCard) {
            this.components.questionCard.hide();
        }
        if (this.components.diaryView) {
            this.components.diaryView.hide();
        }
        // StatsView doesn't have a hide method - it manages its own container
    }
    
    destroyAllComponents() {
        // Clean up all component instances
        Object.values(this.components).forEach(component => {
            if (component && typeof component.destroy === 'function') {
                component.destroy();
            }
        });
        
        this.components = {
            moodSelector: null,
            activitySelector: null,
            questionCard: null,
            statsView: null
        };
    }

    emit(eventName, detail) {
        const customEvent = new CustomEvent(eventName, { detail });
        document.dispatchEvent(customEvent);
    }
}

// Initialize app when DOM is ready
let appInstance = null;

function initApp() {
    if (!appInstance) {
        appInstance = new DailySyncApp();
    }
    return appInstance;
}

// Wait for DOM content to load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.app = initApp();
    });
} else {
    window.app = initApp();
}

export default initApp;