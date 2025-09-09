// Main application controller - orchestrates the entire Daily Sync app
// Handles navigation between screens, manages app state, and coordinates all modules
import { APP_SETTINGS, getQuestionsByMood, getRandomQuestions } from './config.js';
import storageManager from './storage.js';

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
        
        this.routes = {
            'home': () => this.renderHomeView(),
            'mood': () => this.renderMoodView(),
            'questions': () => this.renderQuestionsView(),
            'activities': () => this.renderActivitiesView(),
            'diary': () => this.renderDiaryView(),
            'stats': () => this.renderStatsView()
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
        document.addEventListener('question-answered', (event) => this.handleQuestionAnswered(event));
        document.addEventListener('activity-logged', (event) => this.handleActivityLogged(event));
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
        const moodValue = event.detail.mood;
        
        // Start new entry or update existing
        if (!this.state.currentEntry) {
            this.state.currentEntry = this.createNewEntry();
        }
        
        this.state.currentEntry.mood = moodValue;
        this.state.currentEntry.timestamp = Date.now();
        
        // Save and navigate to questions
        storageManager.saveEntry(this.state.currentEntry);
        this.navigateTo('questions');
    }
    
    async handleQuestionAnswered(event) {
        const { questionId, answer } = event.detail;
        
        if (!this.state.currentEntry.answers) {
            this.state.currentEntry.answers = {};
        }
        
        this.state.currentEntry.answers[questionId] = answer;
        
        // Validate answer length
        if (answer.length < APP_SETTINGS.validation.minAnswerLength) {
            this.showError("Answer must be at least 10 characters");
            return;
        }
        
        // Save entry
        await storageManager.saveEntry(this.state.currentEntry);
        
        // Check if all questions are answered
        if (this.allQuestionsAnswered()) {
            this.navigateTo('activities');
        }
    }
    
    async handleActivityLogged(event) {
        const activities = event.detail.activities;
        
        this.state.currentEntry.activities = activities;
        
        // Mark entry as complete
        this.state.currentEntry.completed = true;
        
        // Save entry and update streak
        await storageManager.saveEntry(this.state.currentEntry);
        await this.updateStreak();
        
        // Reset current entry and go to diary view
        this.state.currentEntry = null;
        this.navigateTo('diary');
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
        
        // Render current view
        const renderFunction = this.routes[this.state.currentView];
        if (renderFunction) {
            viewContainer.innerHTML = renderFunction();
        }
    }
    
    renderHomeView() {
        return `
            <div class="home-view">
                <h2>Welcome to Daily Sync</h2>
                <p>How do you feel today?</p>
                <button class="primary-btn" onclick="app.navigateTo('mood')">
                    Start today
                </button>
                <div class="streak-info">
                    <h3>Your streak: ${this.state.streak} days</h3>
                </div>
            </div>
        `;
    }
    
    renderMoodView() {
        return `
            <div class="mood-view">
                <h2>How do you feel today?</h2>
                <div class="mood-selector">
                    <button class="mood-btn" data-mood="5">😄</button>
                    <button class="mood-btn" data-mood="4">😊</button>
                    <button class="mood-btn" data-mood="3">😐</button>
                    <button class="mood-btn" data-mood="2">😔</button>
                    <button class="mood-btn" data-mood="1">😢</button>
                </div>
                <script>
                    document.querySelectorAll('.mood-btn').forEach(btn => {
                        btn.addEventListener('click', (e) => {
                            const mood = parseInt(e.target.getAttribute('data-mood'));
                            document.dispatchEvent(new CustomEvent('mood-selected', { 
                                detail: { mood } 
                            }));
                        });
                    });
                </script>
            </div>
        `;
    }
    
    renderQuestionsView() {
        if (!this.state.currentEntry || this.state.currentEntry.mood === null) {
            this.navigateTo('mood');
            return '';
        }
        
        const questions = getRandomQuestions(
            getQuestionsByMood(this.state.currentEntry.mood),
            3
        );
        
        return `
            <div class="questions-view">
                <h2>Tell us more about your day</h2>
                <div class="questions-container">
                    ${questions.map((q, index) => `
                        <div class="question-card" data-question-id="${q.id}">
                            <h3>${q.text}</h3>
                            <textarea 
                                placeholder="Your answer (minimum 10 characters)..."
                                data-question-id="${q.id}"
                            ></textarea>
                            <button class="submit-answer-btn" data-question-id="${q.id}">
                                Next
                            </button>
                        </div>
                    `).join('')}
                </div>
                <script>
                    document.querySelectorAll('.submit-answer-btn').forEach(btn => {
                        btn.addEventListener('click', (e) => {
                            const questionId = e.target.getAttribute('data-question-id');
                            const textarea = document.querySelector(\`textarea[data-question-id="\${questionId}"]\`);
                            const answer = textarea.value.trim();
                            
                            if (answer.length >= 10) {
                                document.dispatchEvent(new CustomEvent('question-answered', { 
                                    detail: { questionId, answer } 
                                }));
                                e.target.closest('.question-card').style.opacity = '0.5';
                                e.target.disabled = true;
                            } else {
                                alert('Answer must be at least 10 characters');
                            }
                        });
                    });
                </script>
            </div>
        `;
    }
    
    renderActivitiesView() {
        return `
            <div class="activities-view">
                <h2>What did you do today?</h2>
                <p>Select the activities you engaged in today.</p>
                <div class="activities-list">
                    <label><input type="checkbox" value="work"> Work</label>
                    <label><input type="checkbox" value="exercise"> Exercise</label>
                    <label><input type="checkbox" value="social"> Social</label>
                    <label><input type="checkbox" value="hobby"> Hobby</label>
                    <label><input type="checkbox" value="rest"> Rest</label>
                </div>
                <button class="primary-btn" onclick="this.submitActivities()">
                    Complete
                </button>
                <script>
                    function submitActivities() {
                        const checked = document.querySelectorAll('.activities-list input:checked');
                        const activities = Array.from(checked).map(input => input.value);
                        
                        document.dispatchEvent(new CustomEvent('activity-logged', { 
                            detail: { activities } 
                        }));
                    }
                    window.submitActivities = submitActivities;
                </script>
            </div>
        `;
    }
    
    renderDiaryView() {
        return `
            <div class="diary-view">
                <h2>Your diary entry</h2>
                <p>Thank you for completing your daily check-in!</p>
                <div class="diary-content">
                    <p>Your entry has been saved and added to your personal diary.</p>
                </div>
                <button class="primary-btn" onclick="app.navigateTo('home')">
                    Back to home
                </button>
            </div>
        `;
    }
    
    renderStatsView() {
        return `
            <div class="stats-view">
                <h2>Your statistics</h2>
                <p>Coming soon: your mood trends and insights.</p>
                <div class="stats-placeholder">
                    <p>Statistics will be implemented in Phase 3</p>
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