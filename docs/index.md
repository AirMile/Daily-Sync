# index.html

**Purpose:** Main HTML entry point for the Daily Sync mood tracking application.

## Structure

### HTML Layout
- Single-page application with main container (`#app`)
- Fixed header with app title and streak counter
- Navigation bar with route buttons (Home, Mood, Statistics)
- Main content area with loading, error, and view states
- Footer with copyright information

### Key Elements
- **App Container:** `.app-container` - Main application wrapper
- **Header:** Contains app title "Daily Sync" and streak display
- **Navigation:** Route-based navigation with data-route attributes
- **Main Content:** Dynamic content rendering area (`#view-container`)
- **Loading State:** Spinner and loading message
- **Error State:** Error handling with retry functionality

### CSS Dependencies
Requires CSS variables from:
- `styles/main.css` - Core styling and :root variables
- `styles/custom.css` - Additional customizations

### JavaScript Integration
- Loads ES6 module `modules/app.js` as entry point
- No inline JavaScript - follows module-based architecture

### Navigation Structure
Three main routes:
- **Home:** Default landing view
- **Mood:** Mood tracking interface  
- **Statistics:** Data visualization and insights

The HTML provides the static structure while dynamic content is managed through JavaScript modules and components.