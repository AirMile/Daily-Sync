# components/question-card.js

**Purpose:** Interactive question and answer component for collecting daily reflection responses based on selected mood.

## Core Functionality

### QuestionCard Class
Comprehensive component managing the question-answer flow with progress tracking, validation, and auto-save capabilities.

#### Question Management
- **Mood-Based Questions:** Dynamically loads questions based on selected mood level
- **Sequential Flow:** Guides users through questions one at a time
- **Progress Tracking:** Visual progress bar and dot indicators
- **Question Navigation:** Forward/backward navigation with validation

#### Answer Collection
- **Rich Text Input:** Large textarea for detailed responses
- **Character Counting:** Real-time character count with min/max validation
- **Auto-Save:** Automatic saving of answers with debounce
- **Input Validation:** Ensures minimum answer length requirements

#### Navigation System
- **Sequential Navigation:** Next/Previous buttons with smart labeling
- **Direct Navigation:** Click on progress dots to jump to specific questions
- **Keyboard Support:** Arrow keys, number keys, and shortcuts
- **Back to Mood:** Option to return to mood selection

### Key Methods

#### Lifecycle Management
- **constructor(container):** Initialize component with DOM container
- **setMood(moodValue):** Load questions based on selected mood
- **render():** Generate HTML structure with progress and input elements
- **show/hide():** Display management with animations
- **destroy():** Clean up event listeners and timers

#### Question Flow
- **navigateToQuestion(index):** Jump to specific question with validation
- **updateDisplay():** Refresh UI elements for current question
- **allQuestionsAnswered():** Check if all questions meet requirements
- **handleComplete():** Process completion and emit results

#### Answer Management
- **handleAnswerInput():** Process text input with validation and auto-save
- **updateValidation():** Show validation messages and character requirements
- **updateCharacterCounter():** Real-time character counting with warnings
- **scheduleAutoSave/performAutoSave():** Debounced automatic saving

#### Progress Visualization
- **updateProgressDots():** Update progress indicators showing completion status
- **updateNavigationButtons():** Enable/disable buttons based on validation
- **updateCharacterCounter():** Visual feedback on answer length

### Event Communication
Emits multiple custom events:

#### questions-completed
```javascript
{
  answers: { questionId: 'answer text' },
  questions: [question objects],
  mood: 4,
  totalAnswered: 3
}
```

#### questions-auto-saved
```javascript
{
  answers: { questionId: 'answer text' },
  currentQuestion: 1,
  totalQuestions: 3
}
```

#### navigate
```javascript
{
  route: 'mood' | 'stats',
  data: { answers, questions, mood }
}
```

### Advanced Features

#### Auto-Save System
- **Debounced Saving:** 2-second delay after typing stops
- **Visual Feedback:** Save status indicators (saving/saved)
- **Session Recovery:** Preserves answers across navigation

#### Keyboard Navigation
- **Arrow Keys:** Navigate between questions (when not in textarea)
- **Number Keys (1-9):** Direct question access
- **Tab:** Indentation support in textarea
- **Ctrl/Cmd + Enter:** Advance to next question

#### Validation System
- **Minimum Length:** Enforces minimum character requirements
- **Maximum Length:** Prevents excessive input with warnings
- **Real-time Feedback:** Immediate validation messages
- **Button State Management:** Disables navigation until requirements met

### CSS Dependencies
Requires extensive CSS variables and classes:
- `.question-card-component` - Main container
- `.progress-bar`, `.progress-fill` - Progress visualization
- `.question-container`, `.answer-section` - Layout structure
- `.answer-textarea` - Main input area
- `.progress-dot` - Navigation dots with states (current/completed)
- `.validation-message` - Feedback styling (warning/error/success)

### Integration Points
- **App.js:** Receives completion and navigation events
- **Config.js:** Uses QUESTIONS data and APP_SETTINGS for validation
- **Storage.js:** Auto-save integration for session persistence
- **MoodSelector:** Receives mood data to determine questions

### Accessibility Features
- **Keyboard Navigation:** Full keyboard operation support
- **Progress Indicators:** Clear visual and programmatic progress
- **Validation Messages:** Screen reader accessible feedback
- **Focus Management:** Logical tab order and focus handling

The component provides a complete question-answer experience with sophisticated validation, auto-save, and navigation capabilities.