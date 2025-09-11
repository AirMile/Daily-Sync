# components/mood-selector.js

**Purpose:** Interactive mood selection component providing a 5-level emoji-based mood scale interface.

## Core Functionality

### MoodSelector Class
Self-contained component for mood selection with rich interaction capabilities.

#### Visual Interface
- **5-Level Scale:** Visual buttons for moods from 1 (Terrible) to 5 (Amazing)
- **Emoji Representation:** Each mood level displays corresponding emoji
- **Color Coding:** Mood-specific colors from config (green=good, red=bad, etc.)
- **Hover Effects:** Visual feedback with color borders and shadows

#### Interaction Methods
- **Click Selection:** Direct clicking on mood buttons
- **Keyboard Navigation:** Arrow keys for navigation, 1-5 keys for direct selection
- **Focus Management:** Automatic focus handling for accessibility
- **Enter Key:** Confirm selection and continue

#### Animation System
- **Selection Animation:** Scale effect on mood selection
- **Show/Hide Transitions:** Smooth opacity and transform animations
- **Completion Effect:** Visual feedback when continuing to next screen

### Key Methods

#### Lifecycle Management
- **constructor(container):** Initialize component in DOM container
- **render():** Generate HTML structure with mood buttons
- **show():** Display component with entrance animation
- **hide():** Hide component with exit animation
- **destroy():** Clean up event listeners and DOM

#### Event Handling
- **handleMoodSelection():** Process mood button clicks and selection
- **handleKeyPress():** Keyboard navigation (1-5 keys, arrows, enter)
- **handleMoodHover/Leave():** Visual hover effects
- **handleArrowNavigation():** Arrow key focus management

#### State Management
- **selectedMood:** Current mood selection with value, label, emoji, color
- **reset():** Clear selection and return to initial state
- **getSelectedMood():** Retrieve current selection
- **setSelectedMood(value):** Programmatically set mood selection

### Event Communication
Emits custom `mood-selected` event with details:
```javascript
{
  mood: 4,           // Numeric value (1-5)
  label: 'Good',     // Text description
  emoji: '😊',       // Visual emoji
  color: '#60A5FA'   // Theme color
}
```

### Accessibility Features
- **ARIA Labels:** Screen reader support with mood descriptions
- **ARIA Pressed:** Selection state for assistive technology
- **Keyboard Navigation:** Full keyboard operation support
- **Focus Management:** Logical tab order and focus handling
- **Visual Indicators:** Clear selection states and hover feedback

### CSS Dependencies
Requires CSS variables and classes:
- `.mood-selector-component` - Main container
- `.mood-button` - Individual mood buttons
- `--mood-color` - Dynamic color variable per button
- Hover and selection state styles

### Integration Points
- **App.js:** Receives mood-selected events for navigation
- **Config.js:** Uses MOODS configuration for button generation
- **Storage.js:** Selection data saved for session persistence

The component provides a complete mood selection experience with rich interactions, accessibility support, and smooth animations.