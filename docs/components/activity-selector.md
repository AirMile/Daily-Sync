# components/activity-selector.js

**Purpose:** Interactive activity selection component allowing users to choose daily activities that influenced their mood.

## Core Functionality

### ActivitySelector Class
Self-contained component for selecting multiple daily activities from categorized options.

#### Visual Interface
- **Categorized Activities:** Activities grouped by type (work, exercise, social, etc.)
- **Multi-Selection:** Users can select multiple activities that apply
- **Visual Feedback:** Selected activities highlighted with distinct styling
- **Category Organization:** Activities organized in logical groups for easy browsing

#### Selection Features
- **Multiple Choice:** Users can select any number of relevant activities
- **Toggle Selection:** Click to select/deselect activities
- **Selection Counter:** Display count of selected activities
- **Continue Button:** Proceed when at least one activity is selected

### Key Methods

#### Lifecycle Management
- **constructor(container):** Initialize component in specified DOM container
- **render():** Generate HTML structure with categorized activity options
- **show():** Display component with entrance animation
- **hide():** Hide component with exit animation
- **reset():** Clear all selections and return to initial state

#### Event Handling
- **handleActivityToggle():** Process activity selection/deselection
- **handleContinue():** Emit selection event and proceed to next screen
- **validateSelection():** Ensure at least one activity is selected

#### State Management
- **selectedActivities:** Array of selected activity objects
- **getSelectedActivities():** Retrieve current selections
- **setSelectedActivities(activities):** Programmatically set selections

### Event Communication
Emits custom `activities-selected` event with details:
```javascript
{
  activities: [
    { id: 'work', name: 'Work/Study', category: 'productivity' },
    { id: 'exercise', name: 'Exercise', category: 'health' }
  ],
  count: 2
}
```

### Activity Categories
Based on ACTIVITIES configuration:
- **Productivity:** Work, study, learning activities
- **Health:** Exercise, nutrition, sleep-related activities
- **Social:** Time with friends, family, social events
- **Relaxation:** Entertainment, rest, leisure activities
- **Personal:** Self-care, hobbies, personal projects

### CSS Dependencies
Requires CSS variables and classes:
- `.activity-selector-component` - Main container
- `.activity-category` - Category group containers
- `.activity-button` - Individual activity buttons
- `.activity-button.selected` - Selected state styling
- `.continue-btn` - Continue button styling

### Accessibility Features
- **Keyboard Navigation:** Tab through activities and use space/enter to toggle
- **ARIA Labels:** Screen reader support for activity descriptions
- **Selection State:** Clear visual and programmatic indication of selections
- **Focus Management:** Logical focus order through activity options

### Integration Points
- **App.js:** Receives activities-selected events for data processing
- **Config.js:** Uses ACTIVITIES configuration for button generation
- **Storage.js:** Selected activities saved as part of daily entry
- **Question Flow:** Activities influence which questions are presented

The component provides a comprehensive activity selection interface that helps users identify what activities may have influenced their daily mood.