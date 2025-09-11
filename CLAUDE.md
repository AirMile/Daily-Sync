This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm install        # Install dependencies (live-server)
npm run dev        # Start development server on port 3000
```

No test/build commands configured yet (vanilla JS with ES6 modules, no build process required).

## Architecture

### Tech Stack
- **Frontend**: Vanilla JavaScript with ES6 modules
- **Storage**: LocalStorage for data persistence
- **UI Language**: **ENGLISH ONLY** - All user-facing text, questions, labels, and interface elements must be in English
- **Styling**: **ALL CSS MUST BE GLOBAL WITH :ROOT VARIABLES** - No hardcoded values in code

### Module Structure
ES6 modules with clear separation:

- **`modules/`** - Core business logic (config.js, app.js, storage.js, mood.js, questions.js, stats.js, ai-diary.js)
- **`components/`** - UI components (event-driven, emit custom events for loose coupling)

### Key Patterns
1. **Configuration-driven**: All data in `config.js` using `Object.freeze()`
2. **Event-driven**: Components communicate via custom events
3. **Global styling**: All CSS variables in :root for easy customization
4. **No build step**: Direct ES6 module imports in browser

## Development Guidelines

### Implementation Rules
1. Check `DEVELOPMENT_PLAN.md` for detailed guidance
2. Follow ES6 module patterns, keep config in `config.js`
3. Use event-driven communication between components
4. **Use only :root CSS variables - no hardcoded styling values**
5. **ENGLISH ONLY** for all UI text - no Dutch or other languages
6. Validate user inputs 

### Project Notes
- Prototype/proof of concept for TLE project
- "AI diary" is template-based, not actual AI
- Focus on functionality over performance initially

## Mirror Documentation

**Mirror documentation approach**: The entire codebase structure is mirrored in a `docs/` directory, where each file has a corresponding `.md` documentation file that explains what the original file does.

### Structure
- `docs/` directory mirrors the complete codebase structure
- Each source file gets a corresponding `.md` file explaining its purpose and functionality
- Example: `modules/app.js` → `docs/modules/app.md`
- Example: `components/mood-selector.js` → `docs/components/mood-selector.md`
- Example: `index.html` → `docs/index.md`

### Workflow
1. **Before coding**: Read relevant documentation file(s) in `docs/`
2. **During development**: Follow documented functionality and patterns
3. **After changes**: Update corresponding documentation file to reflect changes

### Critical Rule
**When modifying any file, update the corresponding documentation file in `docs/`** - they serve as the single source of truth for explaining what each file does and must document any CSS variable requirements.

## MCP Server Workflow

**Standard workflow for all tasks using MCP servers:**

### 1. Sequential-thinking (Always First)
- Use `sequential-thinking` MCP for every task to break down steps and plan approach
- Do NOT show the thinking process - keep it internal for planning only
- Split complex tasks into manageable steps with clear reasoning

### 2. Context7 (Best Practices & Knowledge)
- Use `context7` MCP to gather best practices for relevant libraries/frameworks
- Search for patterns related to the specific task:
  - Vanilla JavaScript best practices
  - ES6 modules patterns
  - Event-driven architecture
  - LocalStorage patterns
  - CSS custom properties (:root variables)
  - Web components
- Apply gathered knowledge as foundation for implementation

### 3. Serena (Code Analysis & Implementation)  
- Use `serena` MCP for all code reading and writing in this codebase
- Analyze existing code structure before making changes
- Use symbolic tools to understand relationships between components
- Implement changes following established patterns

### Workflow Execution Order
1. **Think** → Use sequential-thinking to understand task and plan steps
2. **Research** → Use context7 to gather relevant best practices and patterns  
3. **Analyze** → Use serena to understand existing codebase structure
4. **Implement** → Apply knowledge from steps 1-3 to write/modify code