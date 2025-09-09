// Mood selector UI component - displays 5-level emoji mood scale interface
// Handles user interaction for mood selection and triggers next screen
import { MOODS } from '../modules/config.js';

export class MoodSelector {
    constructor(container) {
        this.container = container;
        this.selectedMood = null;
        this.isVisible = false;
        
        this.render();
        this.bindEvents();
    }
    
    render() {
        this.container.innerHTML = `
            <div class="mood-selector-component">
                <div class="mood-selector-header">
                    <h2>How do you feel today?</h2>
                    <p>Select your current mood to continue</p>
                </div>
                
                <div class="mood-scale">
                    ${MOODS.levels.map(mood => `
                        <button 
                            class="mood-button" 
                            data-mood="${mood.value}"
                            data-label="${mood.label}"
                            style="--mood-color: ${mood.color}"
                            aria-label="${mood.label} (${mood.value}/5)"
                            title="${mood.label}"
                        >
                            <span class="mood-emoji">${mood.emoji}</span>
                            <span class="mood-label">${mood.label}</span>
                        </button>
                    `).join('')}
                </div>
            </div>
        `;
    }
    
    bindEvents() {
        // Mood button clicks
        this.container.querySelectorAll('.mood-button').forEach(button => {
            button.addEventListener('click', (e) => this.handleMoodSelection(e));
            
            // Add hover effects
            button.addEventListener('mouseenter', (e) => this.handleMoodHover(e));
            button.addEventListener('mouseleave', (e) => this.handleMoodLeave(e));
        });
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => this.handleKeyPress(e));
        
        // Focus management
        this.container.addEventListener('focus', () => this.handleFocus(), true);
    }
    
    handleMoodSelection(event) {
        const button = event.currentTarget;
        const moodValue = parseInt(button.getAttribute('data-mood'));
        const moodLabel = button.getAttribute('data-label');
        
        // Remove previous selection
        this.container.querySelectorAll('.mood-button').forEach(btn => {
            btn.classList.remove('selected');
            btn.removeAttribute('aria-pressed');
        });
        
        // Mark new selection
        button.classList.add('selected');
        button.setAttribute('aria-pressed', 'true');
        
        // Store selection
        this.selectedMood = {
            value: moodValue,
            label: moodLabel,
            emoji: MOODS.levels.find(m => m.value === moodValue)?.emoji,
            color: MOODS.levels.find(m => m.value === moodValue)?.color
        };
        
        // Add animation effect
        button.style.transform = 'scale(1.1)';
        setTimeout(() => {
            button.style.transform = '';
        }, 200);
        
        // Immediately continue to next screen
        setTimeout(() => {
            this.handleContinue();
        }, 300); // Short delay to show selection animation
    }
    
    handleMoodHover(event) {
        const button = event.currentTarget;
        const moodValue = parseInt(button.getAttribute('data-mood'));
        const mood = MOODS.levels.find(m => m.value === moodValue);
        
        if (mood && !button.classList.contains('selected')) {
            button.style.borderColor = mood.color;
            button.style.boxShadow = `0 4px 12px ${mood.color}33`;
        }
    }
    
    handleMoodLeave(event) {
        const button = event.currentTarget;
        
        if (!button.classList.contains('selected')) {
            button.style.borderColor = '';
            button.style.boxShadow = '';
        }
    }
    
    handleKeyPress(event) {
        if (!this.isVisible) return;
        
        // Keys 1-5 for mood selection
        const key = event.key;
        if (key >= '1' && key <= '5') {
            event.preventDefault();
            const moodValue = parseInt(key);
            const button = this.container.querySelector(`[data-mood="${moodValue}"]`);
            if (button) {
                button.click();
                button.focus();
            }
        }
        
        // Enter to continue
        if (key === 'Enter' && this.selectedMood) {
            event.preventDefault();
            this.handleContinue();
        }
        
        // Arrow key navigation
        if (key === 'ArrowLeft' || key === 'ArrowRight') {
            event.preventDefault();
            this.handleArrowNavigation(key === 'ArrowRight' ? 1 : -1);
        }
    }
    
    handleArrowNavigation(direction) {
        const buttons = Array.from(this.container.querySelectorAll('.mood-button'));
        const currentFocus = document.activeElement;
        const currentIndex = buttons.indexOf(currentFocus);
        
        let nextIndex;
        if (currentIndex === -1) {
            nextIndex = direction > 0 ? 0 : buttons.length - 1;
        } else {
            nextIndex = (currentIndex + direction + buttons.length) % buttons.length;
        }
        
        buttons[nextIndex].focus();
    }
    
    handleFocus() {
        // Ensure keyboard navigation works when component gets focus
        if (!document.activeElement || !this.container.contains(document.activeElement)) {
            const firstButton = this.container.querySelector('.mood-button');
            if (firstButton) {
                firstButton.focus();
            }
        }
    }
    
    
    handleContinue() {
        if (!this.selectedMood) return;
        
        // Emit custom event with mood data
        const event = new CustomEvent('mood-selected', {
            detail: {
                mood: this.selectedMood.value,
                label: this.selectedMood.label,
                emoji: this.selectedMood.emoji,
                color: this.selectedMood.color
            },
            bubbles: true
        });
        
        this.container.dispatchEvent(event);
        
        // Add completion animation
        this.container.style.transition = 'all 0.3s ease-in-out';
        this.container.style.opacity = '0.7';
        this.container.style.transform = 'scale(0.95)';
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
        
        // Focus first button for keyboard accessibility
        setTimeout(() => {
            const firstButton = this.container.querySelector('.mood-button');
            if (firstButton) {
                firstButton.focus();
            }
        }, 300);
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
        this.selectedMood = null;
        
        // Clear selections
        this.container.querySelectorAll('.mood-button').forEach(btn => {
            btn.classList.remove('selected');
            btn.removeAttribute('aria-pressed');
            btn.style.borderColor = '';
            btn.style.boxShadow = '';
            btn.style.transform = '';
        });
        
        // Reset container styles
        this.container.style.opacity = '';
        this.container.style.transform = '';
    }
    
    getSelectedMood() {
        return this.selectedMood;
    }
    
    setSelectedMood(moodValue) {
        const button = this.container.querySelector(`[data-mood="${moodValue}"]`);
        if (button) {
            button.click();
        }
    }
    
    destroy() {
        // Clean up event listeners
        document.removeEventListener('keydown', this.handleKeyPress);
        this.container.innerHTML = '';
    }
}

// Factory function for easy instantiation
export function createMoodSelector(container) {
    return new MoodSelector(container);
}

// Export for direct use
export default MoodSelector;