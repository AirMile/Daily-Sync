# package.json

**Purpose:** Node.js project configuration and dependency management for the Daily Sync prototype application.

## Project Configuration

### Basic Info
- **Name:** daily-sync-app
- **Version:** 1.0.0
- **Type:** module (enables ES6 modules)
- **Description:** TLE Prototype - Mood Tracker met AI-gedreven vragen
- **License:** MIT

### Scripts
- **`npm run dev`:** Starts live-server on port 3000 for development
- **`npm run build`:** No-op for prototype (no build process needed)
- **`npm run test`:** Placeholder (no tests configured yet)

### Dependencies
- **live-server (v1.2.2):** Development server with hot reload
  - Serves files on localhost:3000
  - Automatically refreshes browser on file changes
  - No browser auto-open (--no-browser flag)

### Project Keywords
- mood-tracker
- mental-health  
- prototype
- TLE

### Development Workflow
1. Run `npm install` to install live-server
2. Run `npm run dev` to start development server
3. Access application at http://localhost:3000

### Architecture Notes
- No build process required (vanilla JS with ES6 modules)
- No test framework configured (prototype stage)
- Uses ES6 modules directly in browser
- Simple development setup for rapid prototyping