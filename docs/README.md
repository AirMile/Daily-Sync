# Daily Sync Documentation

This documentation provides comprehensive coverage of every file and component in the Daily Sync mood tracking application.

## Documentation Structure

The `docs/` directory mirrors the complete codebase structure, with each source file having a corresponding `.md` documentation file that explains its purpose and functionality.

### Root Level Documentation
- [`index.md`](index.md) - Main HTML structure and application layout
- [`package.md`](package.md) - Node.js configuration, dependencies, and scripts

### Module Documentation (`modules/`)
Core business logic and application functionality:

- [`app.md`](modules/app.md) - Main application controller and routing system
- [`config.md`](modules/config.md) - Configuration constants (moods, activities, questions, settings)
- [`storage.md`](modules/storage.md) - Data persistence layer using LocalStorage
- [`mood.md`](modules/mood.md) - Mood processing logic (placeholder for future implementation)
- [`questions.md`](modules/questions.md) - Question selection and management (placeholder)
- [`stats.md`](modules/stats.md) - Statistics calculation and analysis (placeholder)
- [`ai-diary.md`](modules/ai-diary.md) - Template-based diary generation (placeholder)

### Component Documentation (`components/`)
Interactive UI components with event-driven architecture:

- [`mood-selector.md`](components/mood-selector.md) - 5-level emoji mood selection interface
- [`activity-selector.md`](components/activity-selector.md) - Multi-select activity choosing interface
- [`question-card.md`](components/question-card.md) - Question-answer flow with validation and auto-save
- [`diary-view.md`](components/diary-view.md) - AI-generated diary display (placeholder)
- [`stats-view.md`](components/stats-view.md) - Statistics visualization component (placeholder)

### Style Documentation (`styles/`)
CSS architecture and theming system:

- [`main.md`](styles/main.md) - Global CSS variables and core styling system
- [`custom.md`](styles/custom.md) - Additional customization layer (placeholder)

## Application Architecture

### Technology Stack
- **Frontend:** Vanilla JavaScript with ES6 modules
- **Storage:** Browser LocalStorage for data persistence
- **Styling:** CSS with :root variables (no hardcoded values)
- **Language:** English only for all UI text

### Key Patterns
- **Configuration-driven:** All data centralized in `config.js`
- **Event-driven:** Components communicate via custom events
- **CSS Variables:** Global theming with :root CSS custom properties
- **Module Architecture:** ES6 modules with clear separation of concerns

### Development Phases
- **Phase 1:** Core functionality (mood selection, basic flow)
- **Phase 2:** Enhanced UI components and interactions
- **Phase 3:** Statistics, insights, and AI diary features

## File Status Legend
- **✅ Implemented:** Fully functional with complete implementation
- **🚧 Placeholder:** TODO comments with planned functionality
- **📝 Empty:** File exists but contains no implementation

### Current Implementation Status

#### Fully Implemented (✅)
- `index.html` - Complete HTML structure
- `modules/app.js` - Full application controller with routing
- `modules/config.js` - Complete configuration system
- `modules/storage.js` - Full LocalStorage implementation
- `components/mood-selector.js` - Complete mood selection component
- `components/question-card.js` - Full question-answer interface
- `styles/main.css` - Complete CSS variable system

#### Placeholder/Planned (🚧)
- `modules/mood.js` - Mood processing logic
- `modules/questions.js` - Question selection algorithms
- `modules/stats.js` - Statistical analysis functions
- `modules/ai-diary.js` - Template-based diary generation
- `components/activity-selector.js` - Activity selection interface
- `components/diary-view.js` - Diary display component
- `components/stats-view.js` - Statistics visualization

#### Empty/Minimal (📝)
- `styles/custom.css` - Additional styling layer

## Usage Guidelines

### For Developers
1. **Read documentation first:** Check relevant `.md` files before modifying code
2. **Update documentation:** Modify corresponding `.md` file when changing implementation
3. **Follow patterns:** Maintain consistency with documented architecture
4. **CSS Variables:** Use only :root variables, never hardcoded values

### For Project Understanding
1. **Start with `app.md`:** Understand main application flow
2. **Review `config.md`:** See all data structures and constants
3. **Check component docs:** Understand UI component interactions
4. **Study architecture:** Follow event-driven and module patterns

## Mirror Documentation Approach

This documentation follows the "Mirror documentation approach" specified in CLAUDE.md:
- Every source file has a corresponding documentation file
- Documentation structure mirrors codebase structure exactly
- Serves as single source of truth for file functionality
- Must be updated when corresponding source files change

The documentation ensures that the purpose and functionality of every file in the Daily Sync codebase is clearly explained and maintained.