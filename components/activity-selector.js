// Activity selector UI component - Daylio-style activity tracking interface
// Shows categorized activity buttons after mood selection (emotions, health, hobbies, etc.)
import { ACTIVITIES } from '../modules/config.js';

export class ActivitySelector {
    constructor(container) {
        this.container = container;
        this.selectedActivities = new Set();
        this.isVisible = false;
        this.expandedCategories = new Set(['emotions']); // Start with emotions expanded
        
        this.render();
        this.bindEvents();
    }
    
    render() {
        this.container.innerHTML = `
            <div class="activity-selector-component">
                <div class="activity-selector-header">
                    <h2>What did you do today?</h2>
                    <p>Select activities that describe your day</p>
                </div>
                
                <div class="activities-grid">
                    ${Object.entries(ACTIVITIES).map(([categoryName, activities]) => `
                        <div class="activity-category" data-category="${categoryName}">
                            <div class="category-header" data-category="${categoryName}">
                                <h3 class="category-title">
                                    <span class="category-icon">${this.getCategoryIcon(categoryName)}</span>
                                    ${this.getCategoryDisplayName(categoryName)}
                                    <span class="category-count">(${activities.length})</span>
                                </h3>
                                <button class="category-toggle" aria-label="Toggle ${categoryName} category">
                                    <span class="toggle-icon">${this.expandedCategories.has(categoryName) ? '▼' : '▶'}</span>
                                </button>
                            </div>
                            
                            <div class="category-activities ${this.expandedCategories.has(categoryName) ? 'expanded' : 'collapsed'}">
                                ${activities.map(activity => `
                                    <button 
                                        class="activity-button" 
                                        data-activity="${activity.id}"
                                        data-category="${categoryName}"
                                        style="--activity-color: ${activity.color}"
                                        aria-label="Select ${activity.label}"
                                        title="${activity.label}"
                                    >
                                        <span class="activity-emoji">${activity.emoji}</span>
                                        <span class="activity-label">${activity.label}</span>
                                        <span class="activity-checkmark">✓</span>
                                    </button>
                                `).join('')}
                            </div>
                        </div>
                    `).join('')}
                </div>
                
                <div class="notes-section">
                    <div class="notes-header">
                        <h3>Notes</h3>
                        <p>Add any thoughts about your day</p>
                    </div>
                    <textarea 
                        class="notes-field" 
                        placeholder="What's on your mind today? How are you feeling?"
                        maxlength="500"
                        rows="4"
                    ></textarea>
                    <div class="notes-counter">
                        <small><span class="char-count">0</span>/500 characters</small>
                    </div>
                </div>
                
                <div class="activity-summary">
                    <div class="selected-count">
                        Selected: <span class="count">0</span> activities
                    </div>
                    <div class="selected-activities-preview"></div>
                </div>
                
                <div class="action-buttons">
                    <button class="clear-selection-btn secondary-btn">Clear All</button>
                    <button class="continue-btn primary-btn" disabled>Continue</button>
                </div>
                
                <div class="activity-hints">
                    <small>💡 Tip: You can select multiple activities from each category</small>
                </div>
            </div>
        `;
    }
    
    bindEvents() {
        // Category toggle buttons
        this.container.querySelectorAll('.category-header').forEach(header => {
            header.addEventListener('click', (e) => this.handleCategoryToggle(e));
        });
        
        // Activity buttons
        this.container.querySelectorAll('.activity-button').forEach(button => {
            button.addEventListener('click', (e) => this.handleActivitySelection(e));
        });
        
        // Notes input
        const notesField = this.container.querySelector('.notes-field');
        const charCount = this.container.querySelector('.char-count');
        
        notesField.addEventListener('input', (e) => {
            charCount.textContent = e.target.value.length;
        });
        
        // Action buttons
        this.container.querySelector('.clear-selection-btn').addEventListener('click', () => {
            this.clearAllSelections();
        });
        
        this.container.querySelector('.continue-btn').addEventListener('click', () => {
            this.handleContinue();
        });
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => this.handleKeyPress(e));
    }
    
    getCategoryIcon(categoryName) {
        const icons = {
            emotions: '❤️',
            health: '💪',
            hobbies: '🎨',
            social: '👥',
            work: '💼',
            lifestyle: '🌟'
        };
        return icons[categoryName] || '📋';
    }
    
    getCategoryDisplayName(categoryName) {
        const displayNames = {
            emotions: 'Emotions',
            health: 'Health & Wellness',
            hobbies: 'Hobbies & Interests',
            social: 'Social',
            work: 'Work & Productivity',
            lifestyle: 'Lifestyle'
        };
        return displayNames[categoryName] || categoryName.charAt(0).toUpperCase() + categoryName.slice(1);
    }
    
    handleCategoryToggle(event) {
        const categoryName = event.currentTarget.getAttribute('data-category');
        const categoryDiv = this.container.querySelector(`[data-category="${categoryName}"]`);
        const activitiesDiv = categoryDiv.querySelector('.category-activities');
        const toggleIcon = categoryDiv.querySelector('.toggle-icon');
        
        if (this.expandedCategories.has(categoryName)) {
            // Collapse
            this.expandedCategories.delete(categoryName);
            activitiesDiv.classList.remove('expanded');
            activitiesDiv.classList.add('collapsed');
            toggleIcon.textContent = '▶';
        } else {
            // Expand
            this.expandedCategories.add(categoryName);
            activitiesDiv.classList.remove('collapsed');
            activitiesDiv.classList.add('expanded');
            toggleIcon.textContent = '▼';
        }
        
        // Add animation
        activitiesDiv.style.transition = 'all 0.3s ease-in-out';
    }
    
    handleActivitySelection(event) {
        const button = event.currentTarget;
        const activityId = button.getAttribute('data-activity');
        const categoryName = button.getAttribute('data-category');
        const activity = ACTIVITIES[categoryName].find(a => a.id === activityId);
        
        if (!activity) return;
        
        if (this.selectedActivities.has(activityId)) {
            // Deselect
            this.selectedActivities.delete(activityId);
            button.classList.remove('selected');
            button.setAttribute('aria-pressed', 'false');
        } else {
            // Select
            this.selectedActivities.add(activityId);
            button.classList.add('selected');
            button.setAttribute('aria-pressed', 'true');
            
            // Add selection animation
            button.style.transform = 'scale(1.05)';
            setTimeout(() => {
                button.style.transform = '';
            }, 150);
        }
        
        this.updateSummary();
        this.updateContinueButton();
    }
    
    
    updateSummary() {
        const countSpan = this.container.querySelector('.selected-count .count');
        const previewDiv = this.container.querySelector('.selected-activities-preview');
        
        countSpan.textContent = this.selectedActivities.size;
        
        // Show preview of selected activities
        if (this.selectedActivities.size > 0) {
            const selectedList = Array.from(this.selectedActivities).slice(0, 5); // Show first 5
            const previewHtml = selectedList.map(activityId => {
                const activity = this.findActivityById(activityId);
                if (activity) {
                    return `<span class="activity-preview" title="${activity.label}">
                        ${activity.emoji} ${activity.label}
                    </span>`;
                }
                return '';
            }).join(' ');
            
            const moreCount = this.selectedActivities.size - 5;
            previewDiv.innerHTML = previewHtml + (moreCount > 0 ? ` <span class="more-count">+${moreCount} more</span>` : '');
        } else {
            previewDiv.innerHTML = '<span class="no-selection">No activities selected yet</span>';
        }
    }
    
    updateContinueButton() {
        const continueBtn = this.container.querySelector('.continue-btn');
        const hasSelection = this.selectedActivities.size > 0;
        
        continueBtn.disabled = !hasSelection;
        continueBtn.textContent = hasSelection ? 
            `Continue (${this.selectedActivities.size} selected)` : 
            'Select at least one activity';
    }
    
    findActivityById(activityId) {
        // Check regular activities
        for (const [categoryName, activities] of Object.entries(ACTIVITIES)) {
            const activity = activities.find(a => a.id === activityId);
            if (activity) {
                return activity;
            }
        }
        
        return null;
    }
    
    clearAllSelections() {
        // Clear selected activities set
        this.selectedActivities.clear();
        
        // Update UI
        this.container.querySelectorAll('.activity-button').forEach(button => {
            button.classList.remove('selected');
            button.setAttribute('aria-pressed', 'false');
        });
        
        // Clear notes
        this.container.querySelector('.notes-field').value = '';
        this.container.querySelector('.char-count').textContent = '0';
        
        this.updateSummary();
        this.updateContinueButton();
        
        // Show feedback animation
        const summary = this.container.querySelector('.activity-summary');
        summary.style.transform = 'scale(1.02)';
        setTimeout(() => {
            summary.style.transform = '';
        }, 200);
    }
    
    handleKeyPress(event) {
        if (!this.isVisible) return;
        
        const key = event.key;
        
        // Space or Enter on focused activity button
        if ((key === ' ' || key === 'Enter') && 
            document.activeElement && 
            document.activeElement.classList.contains('activity-button')) {
            event.preventDefault();
            document.activeElement.click();
        }
        
        
        // Escape to clear all
        if (key === 'Escape') {
            event.preventDefault();
            this.clearAllSelections();
        }
    }
    
    handleContinue() {
        if (this.selectedActivities.size === 0) return;
        
        // Collect selected activity data
        const selectedActivityData = Array.from(this.selectedActivities).map(activityId => {
            const activity = this.findActivityById(activityId);
            return activity ? {
                id: activityId,
                label: activity.label,
                emoji: activity.emoji,
                color: activity.color,
                category: this.findActivityCategory(activityId)
            } : null;
        }).filter(Boolean);
        
        // Get notes data
        const notesField = this.container.querySelector('.notes-field');
        const notes = notesField ? notesField.value.trim() : '';
        
        // Emit custom event
        const event = new CustomEvent('activities-selected', {
            detail: {
                activities: selectedActivityData,
                count: this.selectedActivities.size,
                notes: notes
            },
            bubbles: true
        });
        
        this.container.dispatchEvent(event);
        
        // Add completion animation
        this.container.style.transition = 'all 0.3s ease-in-out';
        this.container.style.opacity = '0.7';
        this.container.style.transform = 'scale(0.95)';
    }
    
    findActivityCategory(activityId) {
        for (const [categoryName, activities] of Object.entries(ACTIVITIES)) {
            if (activities.find(a => a.id === activityId)) {
                return categoryName;
            }
        }
        return 'unknown';
    }
    
    show() {
        this.isVisible = true;
        this.container.style.display = 'block';
        this.container.style.opacity = '0';
        this.container.style.transform = 'translateY(20px)';
        
        requestAnimationFrame(() => {
            this.container.style.transition = 'all 0.3s ease-in-out';
            this.container.style.opacity = '1';
            this.container.style.transform = 'translateY(0)';
        });
    }
    
    hide() {
        this.isVisible = false;
        this.container.style.transition = 'all 0.3s ease-in-out';
        this.container.style.opacity = '0';
        this.container.style.transform = 'translateY(-20px)';
        
        setTimeout(() => {
            this.container.style.display = 'none';
        }, 300);
    }
    
    reset() {
        this.selectedActivities.clear();
        this.expandedCategories.clear();
        this.expandedCategories.add('emotions'); // Reset to default
        
        // Reset UI
        this.render();
        this.bindEvents();
        this.updateSummary();
        this.updateContinueButton();
        
        // Reset container styles
        this.container.style.opacity = '';
        this.container.style.transform = '';
    }
    
    getSelectedActivities() {
        return Array.from(this.selectedActivities).map(activityId => {
            return this.findActivityById(activityId);
        }).filter(Boolean);
    }
    
    setSelectedActivities(activityIds) {
        this.clearAllSelections();
        
        activityIds.forEach(activityId => {
            const button = this.container.querySelector(`[data-activity="${activityId}"]`);
            if (button) {
                button.click();
            }
        });
    }
    
    destroy() {
        // Clean up event listeners
        document.removeEventListener('keydown', this.handleKeyPress);
        this.container.innerHTML = '';
    }
}

// Factory function for easy instantiation
export function createActivitySelector(container) {
    return new ActivitySelector(container);
}

// Export for direct use
export default ActivitySelector;