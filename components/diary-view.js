// Diary view UI component - displays extended Q&A entries and detailed reflections
// Shows complete daily entries with questions, answers, mood, and activities in journal format
import { MOODS, ACTIVITIES } from '../modules/config.js';

export class DiaryView {
    constructor() {
        this.container = null;
        this.entries = [];
        this.currentPeriod = 'week';
        this.sortOrder = 'newest'; // newest, oldest
        
        // Bind methods
        this.handlePeriodChange = this.handlePeriodChange.bind(this);
        this.handleSortChange = this.handleSortChange.bind(this);
        this.handleBackToStats = this.handleBackToStats.bind(this);
    }

    async init(container, entries = []) {
        this.container = container;
        this.entries = entries;
        
        this.render();
        this.setupEventListeners();
        this.displayEntries();
        
        // Emit ready event
        this.container.dispatchEvent(new CustomEvent('diary-view-ready'));
    }

    render() {
        if (!this.container) return;

        this.container.innerHTML = `
            <div class="diary-view-component">
                <div class="diary-header">
                    <div class="header-left">
                        <button class="back-btn" title="Back to Statistics">
                            ← 📊 Statistics
                        </button>
                        <h2 class="diary-title">📖 Personal Diary</h2>
                    </div>
                    <div class="diary-controls">
                        <div class="period-selector">
                            <button class="period-btn active" data-period="week">Week</button>
                            <button class="period-btn" data-period="month">Month</button>
                            <button class="period-btn" data-period="all">All Time</button>
                        </div>
                        <div class="sort-selector">
                            <button class="sort-btn active" data-sort="newest">Newest First</button>
                            <button class="sort-btn" data-sort="oldest">Oldest First</button>
                        </div>
                    </div>
                </div>

                <div class="diary-content">
                    <div class="entries-container" id="entries-container">
                        <!-- Diary entries will be populated here -->
                    </div>
                </div>
            </div>
        `;
    }

    setupEventListeners() {
        // Back button
        const backBtn = this.container.querySelector('.back-btn');
        if (backBtn) {
            backBtn.addEventListener('click', this.handleBackToStats);
        }

        // Period selector
        const periodButtons = this.container.querySelectorAll('.period-btn');
        periodButtons.forEach(btn => {
            btn.addEventListener('click', this.handlePeriodChange);
        });

        // Sort selector
        const sortButtons = this.container.querySelectorAll('.sort-btn');
        sortButtons.forEach(btn => {
            btn.addEventListener('click', this.handleSortChange);
        });
    }

    handleBackToStats() {
        // Emit navigation event back to statistics
        this.container.dispatchEvent(new CustomEvent('navigate', {
            detail: {
                route: 'stats'
            },
            bubbles: true
        }));
    }

    handlePeriodChange(event) {
        const newPeriod = event.target.dataset.period;
        if (newPeriod === this.currentPeriod) return;

        // Update active button
        this.container.querySelectorAll('.period-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        event.target.classList.add('active');

        this.currentPeriod = newPeriod;
        this.displayEntries();
    }

    handleSortChange(event) {
        const newSort = event.target.dataset.sort;
        if (newSort === this.sortOrder) return;

        // Update active button
        this.container.querySelectorAll('.sort-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        event.target.classList.add('active');

        this.sortOrder = newSort;
        this.displayEntries();
    }

    displayEntries() {
        const entriesContainer = document.getElementById('entries-container');
        if (!entriesContainer) return;

        // Filter entries by period
        const filteredEntries = this.filterEntriesByPeriod(this.entries);
        
        // Sort entries
        const sortedEntries = this.sortEntries(filteredEntries);

        if (sortedEntries.length === 0) {
            entriesContainer.innerHTML = this.getEmptyStateHTML();
            return;
        }

        // Render entries
        entriesContainer.innerHTML = sortedEntries.map(entry => 
            this.renderEntry(entry)
        ).join('');
    }

    filterEntriesByPeriod(entries) {
        if (this.currentPeriod === 'all') return entries;
        
        const now = Date.now();
        const periodMs = this.currentPeriod === 'week' ? 7 * 24 * 60 * 60 * 1000 : 30 * 24 * 60 * 60 * 1000;
        const cutoff = now - periodMs;
        
        return entries.filter(entry => {
            const entryTime = entry.completedAt || entry.timestamp || 0;
            return entryTime >= cutoff;
        });
    }

    sortEntries(entries) {
        return [...entries].sort((a, b) => {
            const timeA = a.completedAt || a.timestamp || 0;
            const timeB = b.completedAt || b.timestamp || 0;
            
            return this.sortOrder === 'newest' ? timeB - timeA : timeA - timeB;
        });
    }

    renderEntry(entry) {
        if (!entry.completed || !entry.questions || !entry.answers) {
            return ''; // Skip incomplete entries
        }

        const entryDate = new Date(entry.completedAt || entry.timestamp);
        const formattedDate = entryDate.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        const formattedTime = entryDate.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });

        // Get mood data
        const moodData = this.getMoodData(entry.mood);
        const moodDisplay = moodData ? `${moodData.emoji} ${moodData.label}` : 'Unknown mood';

        // Get activities
        const activitiesDisplay = this.getActivitiesDisplay(entry.activities);

        // Render questions and answers
        const questionsHTML = entry.questions.map((question, index) => {
            const answer = entry.answers[question.id] || '';
            if (!answer.trim()) return ''; // Skip unanswered questions

            return `
                <div class="qa-pair">
                    <div class="question">
                        <span class="question-number">Q${index + 1}:</span>
                        <span class="question-text">${question.text}</span>
                    </div>
                    <div class="answer">
                        <p class="answer-text">${this.formatAnswer(answer)}</p>
                    </div>
                </div>
            `;
        }).filter(html => html).join('');

        return `
            <div class="diary-entry">
                <div class="entry-header">
                    <div class="entry-date">
                        <h3>${formattedDate}</h3>
                        <span class="entry-time">${formattedTime}</span>
                    </div>
                    <div class="entry-mood">
                        <span class="mood-display">${moodDisplay}</span>
                    </div>
                </div>
                
                <div class="entry-activities">
                    <h4>Activities</h4>
                    <div class="activities-list">${activitiesDisplay}</div>
                </div>

                <div class="entry-reflections">
                    <h4>Daily Reflections</h4>
                    <div class="questions-answers">
                        ${questionsHTML}
                    </div>
                </div>

                ${entry.notes ? `
                    <div class="entry-notes">
                        <h4>Notes</h4>
                        <p class="notes-text">${this.formatAnswer(entry.notes)}</p>
                    </div>
                ` : ''}
            </div>
        `;
    }

    getMoodData(moodValue) {
        if (!moodValue) return null;
        
        return MOODS.levels.find(mood => mood.value === moodValue);
    }

    getActivitiesDisplay(activityIds = []) {
        if (!Array.isArray(activityIds) || activityIds.length === 0) {
            return '<span class="no-activities">No activities recorded</span>';
        }

        // Get all activities from config
        const allActivities = [
            ...ACTIVITIES.emotions,
            ...ACTIVITIES.health,
            ...ACTIVITIES.hobbies,
            ...ACTIVITIES.social,
            ...ACTIVITIES.work,
            ...ACTIVITIES.lifestyle
        ];

        const selectedActivities = activityIds
            .map(id => allActivities.find(activity => activity.id === id))
            .filter(activity => activity);

        if (selectedActivities.length === 0) {
            return '<span class="no-activities">No activities found</span>';
        }

        return selectedActivities
            .map(activity => `
                <span class="activity-tag" style="--activity-color: ${activity.color}">
                    ${activity.emoji} ${activity.label}
                </span>
            `)
            .join('');
    }

    formatAnswer(text) {
        if (!text) return '';
        
        // Convert line breaks to paragraphs
        return text
            .split('\n')
            .filter(paragraph => paragraph.trim())
            .map(paragraph => paragraph.trim())
            .join('</p><p>');
    }

    getEmptyStateHTML() {
        return `
            <div class="empty-state">
                <div class="empty-icon">📝</div>
                <h3>No Diary Entries</h3>
                <p>Complete your daily check-ins to see your reflections here.</p>
                <button class="start-entry-btn primary-btn" onclick="window.location.hash='home'">
                    Start Your First Entry
                </button>
            </div>
        `;
    }

    updateEntries(entries) {
        this.entries = entries;
        this.displayEntries();
    }

    show() {
        if (this.container) {
            this.container.style.display = 'block';
        }
    }

    hide() {
        if (this.container) {
            this.container.style.display = 'none';
        }
    }

    destroy() {
        if (this.container) {
            this.container.innerHTML = '';
        }
    }
}

// Factory function
export function createDiaryView() {
    return new DiaryView();
}

export default DiaryView;