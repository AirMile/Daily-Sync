# Mood Selector Component - Pseudocode Documentation

## Purpose
Interactive mood selection interface with 5-level emoji scale, keyboard navigation, and visual feedback.

## Component Structure

### Class: MoodSelector
- **Container**: DOM element that holds the component
- **State**: 
  - selectedMood: Currently selected mood object
  - isVisible: Component visibility state
  - autoContinueTimeout: Timer for automatic continuation

### CSS Variables Required
- `--mood-color`: Dynamic mood-specific color (set via style attribute)
- All standard spacing, color, and transition variables from :root

## Core Methods

### Constructor & Initialization
```
INITIALIZE MoodSelector(container)
  SET this.container = container
  SET this.selectedMood = null
  SET this.isVisible = false
  
  CALL this.render()
  CALL this.bindEvents()
END

FUNCTION render()
  CREATE HTML structure:
    - mood-selector-component wrapper
    - mood-selector-header (title + description)
    - mood-scale container with mood-button elements
    - mood-selected-feedback section (hidden initially)
    - keyboard-hint text
  
  FOR each mood in MOODS.levels:
    CREATE button with:
      - data-mood attribute
      - mood emoji and label
      - CSS custom property for mood color
      - ARIA attributes for accessibility
  END FOR
END
```

### Event Handling
```
FUNCTION bindEvents()
  FOR each mood button:
    ADD click listener → handleMoodSelection()
    ADD mouseenter listener → handleMoodHover()
    ADD mouseleave listener → handleMoodLeave()
  END FOR
  
  ADD continue button click → handleContinue()
  ADD document keydown → handleKeyPress()
  ADD container focus → handleFocus()
END

FUNCTION handleMoodSelection(event)
  GET button = event target
  GET moodValue = parseInt(button.data-mood)
  GET moodLabel = button.data-label
  
  // Clear previous selection
  FOR each mood button:
    REMOVE 'selected' class
    REMOVE 'aria-pressed' attribute
  END FOR
  
  // Mark new selection
  ADD 'selected' class to button
  SET 'aria-pressed' = 'true' on button
  
  // Store mood data
  SET selectedMood = {
    value: moodValue,
    label: moodLabel,
    emoji: MOODS.levels[moodValue].emoji,
    color: MOODS.levels[moodValue].color
  }
  
  CALL showSelectedMoodFeedback()
  
  // Animation effect
  SET button.style.transform = 'scale(1.1)'
  WAIT 200ms
  RESET button.style.transform
  
  // Auto-continue timer
  CLEAR autoContinueTimeout
  SET autoContinueTimeout = TIMEOUT(1500ms) → handleContinue()
END
```

### Visual Feedback
```
FUNCTION handleMoodHover(event)
  GET button = event target
  GET moodValue = button.data-mood
  GET mood = MOODS.levels[moodValue]
  
  IF mood exists AND button not selected:
    SET button.style.borderColor = mood.color
    SET button.style.boxShadow = mood.color + '33' // 20% opacity
  END IF
END

FUNCTION showSelectedMoodFeedback()
  IF no selectedMood: RETURN
  
  GET feedback = mood-selected-feedback element
  SET feedback emoji text = selectedMood.emoji
  SET feedback label text = selectedMood.label
  
  // Animate in
  SET feedback.display = 'block'
  SET feedback.opacity = '0'
  SET feedback.transform = 'translateY(10px)'
  
  ANIMATE:
    opacity: 0 → 1
    transform: translateY(10px) → translateY(0)
    duration: 300ms ease-in-out
END
```

### Keyboard Navigation
```
FUNCTION handleKeyPress(event)
  IF not visible: RETURN
  
  GET key = event.key
  
  // Number keys 1-5 for direct mood selection
  IF key >= '1' AND key <= '5':
    PREVENT default
    GET moodValue = parseInt(key)
    GET button = mood button with data-mood = moodValue
    IF button exists:
      CLICK button
      FOCUS button
    END IF
  END IF
  
  // Enter to continue
  IF key = 'Enter' AND selectedMood exists:
    PREVENT default
    CALL handleContinue()
  END IF
  
  // Arrow key navigation
  IF key = 'ArrowLeft' OR key = 'ArrowRight':
    PREVENT default
    GET direction = key = 'ArrowRight' ? 1 : -1
    CALL handleArrowNavigation(direction)
  END IF
END

FUNCTION handleArrowNavigation(direction)
  GET buttons = array of all mood buttons
  GET currentFocus = document.activeElement
  GET currentIndex = buttons.indexOf(currentFocus)
  
  IF currentIndex = -1:
    SET nextIndex = direction > 0 ? 0 : buttons.length - 1
  ELSE:
    SET nextIndex = (currentIndex + direction + buttons.length) % buttons.length
  END IF
  
  FOCUS buttons[nextIndex]
END
```

### Component Lifecycle
```
FUNCTION show()
  SET isVisible = true
  SET container.display = 'block'
  
  // Fade in animation
  SET container.opacity = '0'
  SET container.transform = 'translateY(20px)'
  
  ANIMATE:
    opacity: 0 → 1
    transform: translateY(20px) → translateY(0)
    duration: 300ms ease-in-out
  
  // Focus first button for accessibility
  WAIT 300ms
  FOCUS first mood button
END

FUNCTION hide()
  SET isVisible = false
  
  ANIMATE:
    opacity: 1 → 0
    transform: translateY(0) → translateY(-20px)
    duration: 300ms ease-in-out
  
  WAIT 300ms
  SET container.display = 'none'
END

FUNCTION reset()
  SET selectedMood = null
  
  FOR each mood button:
    REMOVE 'selected' class
    REMOVE 'aria-pressed' attribute
    RESET style properties (borderColor, boxShadow, transform)
  END FOR
  
  HIDE mood-selected-feedback
  CLEAR autoContinueTimeout
  RESET container styles
END
```

### Event Emission
```
FUNCTION handleContinue()
  IF no selectedMood: RETURN
  
  CLEAR autoContinueTimeout
  
  // Create custom event
  CREATE event = 'mood-selected' with details:
    mood: selectedMood.value
    label: selectedMood.label
    emoji: selectedMood.emoji
    color: selectedMood.color
  
  DISPATCH event on container (bubbles: true)
  
  // Completion animation
  ANIMATE container:
    opacity: 1 → 0.7
    transform: scale(1) → scale(0.95)
    duration: 300ms ease-in-out
END
```

## Data Flow

### Input
- User clicks mood button OR presses number key 1-5
- Keyboard navigation with arrow keys
- Enter key to continue

### Processing  
- Store selected mood with full data (value, label, emoji, color)
- Update visual state and feedback
- Set auto-continue timer

### Output
- Emits 'mood-selected' custom event with mood data
- Event bubbles up to parent components
- App controller handles navigation to next step

## Accessibility Features

### ARIA Implementation
- mood buttons have `aria-label` with mood name and scale position
- Selected button has `aria-pressed="true"`
- Keyboard navigation with arrow keys and direct number selection
- Focus management for screen readers

### Visual Accessibility  
- High contrast mode support via CSS variables
- Clear visual feedback for hover and selection states
- Keyboard focus indicators
- Sufficient color contrast for mood colors

## Dependencies
- `../modules/config.js`: MOODS configuration object
- CSS custom properties from :root in main.css
- Event system for component communication

## CSS Classes Structure
```
.mood-selector-component
├── .mood-selector-header
│   ├── h2 (title)
│   └── p (description)
├── .mood-scale
│   └── .mood-button[.selected]
│       ├── .mood-emoji
│       └── .mood-label
├── .mood-selected-feedback
│   ├── .selected-mood-display
│   │   ├── .selected-emoji
│   │   └── .selected-text > .selected-label
│   └── .continue-btn.primary-btn
└── .keyboard-hint
```

## Performance Considerations
- Event delegation for mood buttons
- Debounced auto-continue timer
- Efficient DOM updates using CSS custom properties
- Minimal DOM manipulation during state changes