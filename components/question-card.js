// Question card UI component - displays daily reflection questions one by one
// Shows questions based on selected mood and activities, handles answer input
import { QUESTIONS, APP_SETTINGS, getQuestionsByMood, getRandomQuestions } from '../modules/config.js';

export class QuestionCard {
    constructor(container) {
        this.container = container;
        this.currentQuestionIndex = 0;
        this.questions = [];
        this.answers = {};
        this.isVisible = false;
        this.autoSaveTimeout = null;
        this.mood = null;
        
        this.render();
        this.bindEvents();
    }
    
    setMood(moodValue) {
        this.mood = moodValue;
        this.questions = getRandomQuestions(getQuestionsByMood(moodValue), APP_SETTINGS.maxQuestionsPerDay);
        this.currentQuestionIndex = 0;
        this.answers = {};
        this.updateDisplay();
    }
    
    render() {
        this.container.innerHTML = `
            <div class="question-card-component">
                <div class="question-progress">
                    <div class="progress-bar">
                        <div class="progress-fill"></div>
                    </div>
                    <div class="progress-text">
                        <span class="current-question">1</span> of <span class="total-questions">3</span>
                    </div>
                </div>
                
                <div class="question-container">
                    <div class="question-header">
                        <div class="question-mood-indicator">
                            <span class="mood-emoji"></span>
                            <span class="mood-label"></span>
                        </div>
                        <h2 class="question-text">Loading question...</h2>
                    </div>
                    
                    <div class="answer-section">
                        <div class="answer-input-container">
                            <textarea 
                                class="answer-textarea"
                                placeholder="Share your thoughts... (minimum ${APP_SETTINGS.validation.minAnswerLength} characters)"
                                maxlength="${APP_SETTINGS.validation.maxAnswerLength}"
                                rows="6"
                            ></textarea>
                            
                            <div class="answer-feedback">
                                <div class="character-counter">
                                    <span class="current-length">0</span>/<span class="max-length">${APP_SETTINGS.validation.maxAnswerLength}</span>
                                </div>
                                <div class="validation-message"></div>
                            </div>
                        </div>
                        
                    </div>
                    
                    <div class="question-navigation">
                        <button class="question-nav-btn previous-btn" disabled>
                            <span>← Previous</span>
                        </button>
                        
                        <div class="question-dots">
                            <!-- Progress dots will be generated here -->
                        </div>
                        
                        <button class="question-nav-btn next-btn" disabled>
                            <span>Next →</span>
                        </button>
                        
                        <button class="question-nav-btn stats-btn">
                            <span>📊 Statistics</span>
                        </button>
                    </div>
                    
                    <div class="auto-save-indicator">
                        <span class="save-status">✓ Saved</span>
                    </div>
                </div>
                
                <div class="completion-section" style="display: none;">
                    <div class="completion-message">
                        <h2>Great job! 🎉</h2>
                        <p>You've answered all the questions. Ready to continue?</p>
                    </div>
                    <button class="complete-btn primary-btn">Continue to Activities</button>
                </div>
                
            </div>
        `;
    }
    
    bindEvents() {
        // Answer textarea
        const textarea = this.container.querySelector('.answer-textarea');
        textarea.addEventListener('input', (e) => this.handleAnswerInput(e));
        textarea.addEventListener('keydown', (e) => this.handleTextareaKeydown(e));
        textarea.addEventListener('focus', () => this.handleTextareaFocus());
        textarea.addEventListener('blur', () => this.handleTextareaBlur());
        
        // Navigation buttons
        this.container.querySelector('.previous-btn').addEventListener('click', () => {
            if (this.currentQuestionIndex === 0) {
                // Go back to mood selection
                this.handleBackToActivities();
            } else {
                // Navigate to previous question
                this.navigateToQuestion(this.currentQuestionIndex - 1);
            }
        });
        
        this.container.querySelector('.next-btn').addEventListener('click', () => {
            // Check if we're on the last question and should complete
            const isLastQuestion = this.currentQuestionIndex === this.questions.length - 1;
            const currentAnswer = this.answers[this.questions[this.currentQuestionIndex]?.id] || '';
            const isValidAnswer = currentAnswer.trim().length >= APP_SETTINGS.validation.minAnswerLength;
            
            if (isLastQuestion && isValidAnswer) {
                // Complete the questions and navigate to activities
                this.handleComplete();
            } else if (!isLastQuestion && isValidAnswer) {
                // Navigate to next question
                this.navigateToQuestion(this.currentQuestionIndex + 1);
            }
            // If answer is not valid, button should be disabled anyway
        });
        
        // Statistics button
        this.container.querySelector('.stats-btn').addEventListener('click', () => {
            this.handleGoToStats();
        });
        
        // Complete button
        this.container.querySelector('.complete-btn').addEventListener('click', () => {
            this.handleComplete();
        });
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => this.handleKeyPress(e));
    }
    
    updateDisplay() {
        if (this.questions.length === 0) return;
        
        // Validate current question index
        if (this.currentQuestionIndex >= this.questions.length || this.currentQuestionIndex < 0) {
            this.currentQuestionIndex = 0;
        }
        
        const currentQuestion = this.questions[this.currentQuestionIndex];
        if (!currentQuestion) return;
        
        // Update progress
        const progressFill = this.container.querySelector('.progress-fill');
        const progressPercent = ((this.currentQuestionIndex + 1) / this.questions.length) * 100;
        progressFill.style.width = `${progressPercent}%`;
        
        this.container.querySelector('.current-question').textContent = this.currentQuestionIndex + 1;
        this.container.querySelector('.total-questions').textContent = this.questions.length;
        
        // Update question
        this.container.querySelector('.question-text').textContent = currentQuestion.text;
        
        // Update mood indicator
        if (this.mood) {
            import('../modules/config.js').then(({ MOODS }) => {
                const moodData = MOODS.levels.find(m => m.value === this.mood);
                if (moodData) {
                    this.container.querySelector('.mood-emoji').textContent = moodData.emoji;
                    this.container.querySelector('.mood-label').textContent = moodData.label;
                }
            });
        }
        
        // Update answer textarea
        const textarea = this.container.querySelector('.answer-textarea');
        textarea.value = this.answers[currentQuestion.id] || '';
        this.updateCharacterCounter();
        this.updateValidation();
        
        // Update navigation buttons
        this.updateNavigationButtons();
        
        // Update progress dots
        this.updateProgressDots();
        
        // Focus textarea
        setTimeout(() => {
            textarea.focus();
        }, 100);
    }
    
    updateNavigationButtons() {
        const prevBtn = this.container.querySelector('.previous-btn');
        const nextBtn = this.container.querySelector('.next-btn');
        
        // Previous button is always enabled
        prevBtn.disabled = false;
        
        // Change text based on whether we're on first question or not
        if (this.currentQuestionIndex === 0) {
            prevBtn.innerHTML = '<span>← Back to Activities</span>';
        } else {
            prevBtn.innerHTML = '<span>← Previous</span>';
        }
        
        const currentAnswer = this.answers[this.questions[this.currentQuestionIndex]?.id] || '';
        const isValidAnswer = currentAnswer.length >= APP_SETTINGS.validation.minAnswerLength;
        const isLastQuestion = this.currentQuestionIndex === this.questions.length - 1;
        
        if (isLastQuestion) {
            nextBtn.textContent = isValidAnswer ? 'Complete ✓' : 'Answer Required';
            nextBtn.disabled = !isValidAnswer;
        } else {
            nextBtn.textContent = isValidAnswer ? 'Next →' : 'Answer Required';
            nextBtn.disabled = !isValidAnswer;
        }
    }
    
    updateProgressDots() {
        const dotsContainer = this.container.querySelector('.question-dots');
        dotsContainer.innerHTML = '';
        
        this.questions.forEach((question, index) => {
            const dot = document.createElement('button');
            dot.className = 'progress-dot';
            dot.setAttribute('data-question-index', index);
            dot.title = `Question ${index + 1}`;
            
            const hasAnswer = this.answers[question.id] && 
                             this.answers[question.id].length >= APP_SETTINGS.validation.minAnswerLength;
            
            if (index === this.currentQuestionIndex) {
                dot.classList.add('current');
            } else if (hasAnswer) {
                dot.classList.add('completed');
            }
            
            dot.addEventListener('click', () => {
                if (index < this.currentQuestionIndex || hasAnswer) {
                    this.navigateToQuestion(index);
                }
            });
            
            dotsContainer.appendChild(dot);
        });
    }
    
    
    handleAnswerInput(event) {
        const textarea = event.target;
        const currentQuestion = this.questions[this.currentQuestionIndex];
        
        if (!currentQuestion) return;
        
        // Store answer
        this.answers[currentQuestion.id] = textarea.value;
        
        // Update UI
        this.updateCharacterCounter();
        this.updateValidation();
        this.updateNavigationButtons();
        this.updateProgressDots();
        
        // Auto-save with debounce
        this.scheduleAutoSave();
    }
    
    handleTextareaKeydown(event) {
        // Allow Tab for indentation but prevent losing focus
        if (event.key === 'Tab') {
            event.preventDefault();
            const textarea = event.target;
            const start = textarea.selectionStart;
            const end = textarea.selectionEnd;
            
            textarea.value = textarea.value.substring(0, start) + '\t' + textarea.value.substring(end);
            textarea.selectionStart = textarea.selectionEnd = start + 1;
        }
        
        // Ctrl/Cmd + Enter to go to next question
        if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
            event.preventDefault();
            if (this.currentQuestionIndex < this.questions.length - 1) {
                this.navigateToQuestion(this.currentQuestionIndex + 1);
            } else if (this.allQuestionsAnswered()) {
                this.handleComplete();
            }
        }
    }
    
    handleTextareaFocus() {
        const answerSection = this.container.querySelector('.answer-section');
        answerSection.classList.add('focused');
    }
    
    handleTextareaBlur() {
        const answerSection = this.container.querySelector('.answer-section');
        answerSection.classList.remove('focused');
    }
    
    updateCharacterCounter() {
        const textarea = this.container.querySelector('.answer-textarea');
        const currentLength = textarea.value.length;
        
        this.container.querySelector('.current-length').textContent = currentLength;
        
        const counter = this.container.querySelector('.character-counter');
        counter.classList.toggle('warning', currentLength > APP_SETTINGS.validation.maxAnswerLength * 0.9);
        counter.classList.toggle('error', currentLength > APP_SETTINGS.validation.maxAnswerLength);
    }
    
    updateValidation() {
        const textarea = this.container.querySelector('.answer-textarea');
        const validationMessage = this.container.querySelector('.validation-message');
        const currentLength = textarea.value.trim().length;
        const minLength = APP_SETTINGS.validation.minAnswerLength;
        const maxLength = APP_SETTINGS.validation.maxAnswerLength;
        
        validationMessage.innerHTML = '';
        
        if (currentLength > 0 && currentLength < minLength) {
            validationMessage.innerHTML = `<span class="warning">Need ${minLength - currentLength} more characters</span>`;
        } else if (currentLength > maxLength) {
            validationMessage.innerHTML = `<span class="error">Too long by ${currentLength - maxLength} characters</span>`;
        } else if (currentLength >= minLength) {
            validationMessage.innerHTML = `<span class="success">✓ Good answer!</span>`;
        }
    }
    
    scheduleAutoSave() {
        clearTimeout(this.autoSaveTimeout);
        
        // Show saving indicator
        const saveStatus = this.container.querySelector('.save-status');
        saveStatus.textContent = '💾 Saving...';
        saveStatus.className = 'save-status saving';
        
        this.autoSaveTimeout = setTimeout(() => {
            this.performAutoSave();
        }, APP_SETTINGS.autoSaveDelay);
    }
    
    performAutoSave() {
        // Emit auto-save event
        const event = new CustomEvent('questions-auto-saved', {
            detail: {
                answers: { ...this.answers },
                currentQuestion: this.currentQuestionIndex,
                totalQuestions: this.questions.length
            },
            bubbles: true
        });
        
        this.container.dispatchEvent(event);
        
        // Update save status
        const saveStatus = this.container.querySelector('.save-status');
        saveStatus.textContent = '✓ Saved';
        saveStatus.className = 'save-status saved';
        
        setTimeout(() => {
            saveStatus.className = 'save-status';
        }, 2000);
    }
    
    navigateToQuestion(questionIndex) {
        if (questionIndex < 0 || questionIndex >= this.questions.length) return;
        
        this.currentQuestionIndex = questionIndex;
        this.updateDisplay();
        
        // Add transition effect
        const container = this.container.querySelector('.question-container');
        container.style.opacity = '0';
        container.style.transform = 'translateX(10px)';
        
        setTimeout(() => {
            container.style.transition = 'all 0.3s ease-in-out';
            container.style.opacity = '1';
            container.style.transform = 'translateX(0)';
        }, 50);
    }
    
    handleBackToActivities() {
        // Emit custom event to navigate back to activity selection
        const event = new CustomEvent('navigate', {
            detail: {
                route: 'activities'
            },
            bubbles: true
        });
        
        this.container.dispatchEvent(event);
    }
    
    handleKeyPress(event) {
        if (!this.isVisible) return;
        
        const key = event.key;
        
        // Arrow key navigation (when not focused on textarea)
        if (document.activeElement.tagName !== 'TEXTAREA') {
            if (key === 'ArrowLeft') {
                event.preventDefault();
                if (this.currentQuestionIndex === 0) {
                    // Go back to mood selection
                    this.handleBackToActivities();
                } else {
                    // Navigate to previous question
                    this.navigateToQuestion(this.currentQuestionIndex - 1);
                }
            } else if (key === 'ArrowRight' && this.currentQuestionIndex < this.questions.length - 1) {
                event.preventDefault();
                const currentAnswer = this.answers[this.questions[this.currentQuestionIndex]?.id] || '';
                if (currentAnswer.length >= APP_SETTINGS.validation.minAnswerLength) {
                    this.navigateToQuestion(this.currentQuestionIndex + 1);
                }
            }
        }
        
        // Number keys for direct navigation
        if (key >= '1' && key <= '9') {
            const questionIndex = parseInt(key) - 1;
            if (questionIndex < this.questions.length) {
                event.preventDefault();
                this.navigateToQuestion(questionIndex);
            }
        }
    }
    
    allQuestionsAnswered() {
        return this.questions.every(question => {
            const answer = this.answers[question.id];
            return answer && answer.trim().length >= APP_SETTINGS.validation.minAnswerLength;
        });
    }
    
    handleComplete() {
        if (!this.allQuestionsAnswered()) {
            // Show completion section
            this.container.querySelector('.completion-section').style.display = 'none';
            return;
        }
        
        // Emit completion event
        const completionEvent = new CustomEvent('questions-completed', {
            detail: {
                answers: { ...this.answers },
                questions: this.questions,
                mood: this.mood,
                totalAnswered: Object.keys(this.answers).length
            },
            bubbles: true
        });
        
        this.container.dispatchEvent(completionEvent);
        
        // Navigate to activities view
        const navigationEvent = new CustomEvent('navigate', {
            detail: {
                route: 'activities',
                data: {
                    answers: { ...this.answers },
                    questions: this.questions,
                    mood: this.mood
                }
            },
            bubbles: true
        });
        
        this.container.dispatchEvent(navigationEvent);
    }
    
    handleGoToStats() {
        // Filter answers to only include those with valid minimum length
        const validAnswers = {};
        const validQuestions = [];
        
        this.questions.forEach(question => {
            const answer = this.answers[question.id];
            if (answer && answer.trim().length >= APP_SETTINGS.validation.minAnswerLength) {
                validAnswers[question.id] = answer;
                validQuestions.push(question);
            }
        });
        
        // Emit event to navigate to statistics with filtered data
        const event = new CustomEvent('navigate', {
            detail: {
                route: 'stats',
                data: {
                    answers: validAnswers,
                    questions: validQuestions,
                    mood: this.mood,
                    totalAnswered: Object.keys(validAnswers).length,
                    totalQuestions: this.questions.length
                }
            },
            bubbles: true
        });
        
        this.container.dispatchEvent(event);
    }
    
    showCompletionSection() {
        const completionSection = this.container.querySelector('.completion-section');
        const questionContainer = this.container.querySelector('.question-container');
        
        questionContainer.style.display = 'none';
        completionSection.style.display = 'block';
        completionSection.style.opacity = '0';
        
        requestAnimationFrame(() => {
            completionSection.style.transition = 'all 0.3s ease-in-out';
            completionSection.style.opacity = '1';
        });
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
        this.currentQuestionIndex = 0;
        this.questions = [];
        this.answers = {};
        this.mood = null;
        
        clearTimeout(this.autoSaveTimeout);
        
        // Reset UI
        this.container.querySelector('.completion-section').style.display = 'none';
        this.container.querySelector('.question-container').style.display = 'block';
        this.container.querySelector('.answer-textarea').value = '';
        
        // Reset container styles
        this.container.style.opacity = '';
        this.container.style.transform = '';
    }
    
    getAnswers() {
        return { ...this.answers };
    }
    
    setAnswers(answers) {
        this.answers = { ...answers };
        this.updateDisplay();
    }
    
    getCurrentProgress() {
        return {
            currentQuestion: this.currentQuestionIndex,
            totalQuestions: this.questions.length,
            answeredQuestions: Object.keys(this.answers).length,
            isComplete: this.allQuestionsAnswered()
        };
    }
    
    destroy() {
        document.removeEventListener('keydown', this.handleKeyPress);
        clearTimeout(this.autoSaveTimeout);
        this.container.innerHTML = '';
    }
}

// Factory function for easy instantiation
export function createQuestionCard(container) {
    return new QuestionCard(container);
}

// Export for direct use
export default QuestionCard;