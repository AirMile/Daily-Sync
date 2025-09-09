# styles/main.css

**Purpose:** Main stylesheet containing global CSS custom properties (:root variables) and core styling for the Daily Sync application.

## CSS Variable System

### Color Scheme
**Primary Colors:**
- `--primary-color: #60A5FA` - Main brand blue
- `--secondary-color: #10B981` - Success green
- `--accent-color: #FBBF24` - Warning yellow
- `--danger-color: #EF4444` - Error red
- `--warning-color: #FB923C` - Warning orange
- `--success-color: #10B981` - Success green

**Mood-Specific Colors:**
- `--mood-5-color: #10B981` - Amazing (Green)
- `--mood-4-color: #60A5FA` - Good (Blue)
- `--mood-3-color: #FBBF24` - Okay (Yellow)
- `--mood-2-color: #FB923C` - Bad (Orange)
- `--mood-1-color: #EF4444` - Terrible (Red)

**Neutral Colors:**
- `--bg-color: #F8FAFC` - Background
- `--surface-color: #FFFFFF` - Card/surface backgrounds
- `--border-color: #E2E8F0` - Borders and dividers
- `--text-primary: #1E293B` - Primary text
- `--text-secondary: #64748B` - Secondary text
- `--text-muted: #94A3B8` - Muted/disabled text

### Typography System
**Font Family:**
- `--font-family` - System font stack (Apple, Windows, fallbacks)

**Font Sizes:**
- `--font-size-xs: 0.75rem` (12px)
- `--font-size-sm: 0.875rem` (14px)
- `--font-size-base: 1rem` (16px)
- `--font-size-lg: 1.125rem` (18px)
- `--font-size-xl: 1.25rem` (20px)
- `--font-size-2xl: 1.5rem` (24px)
- `--font-size-3xl: 1.875rem` (30px)

**Font Weights:**
- `--font-weight-normal: 400` - Regular text
- `--font-weight-medium: 500` - Medium emphasis
- `--font-weight-semibold: 600` - Semi-bold headings
- `--font-weight-bold: 700` - Bold emphasis

### Spacing System
**Consistent Spacing Scale:**
- `--spacing-1: 0.25rem` (4px)
- `--spacing-2: 0.5rem` (8px)
- `--spacing-3: 0.75rem` (12px)
- `--spacing-4: 1rem` (16px)
- `--spacing-5: 1.25rem` (20px)
- `--spacing-6: 1.5rem` (24px)
- `--spacing-8: 2rem` (32px)
- `--spacing-10: 2.5rem` (40px)
- `--spacing-12: 3rem` (48px)
- `--spacing-16: 4rem` (64px)

### Layout Variables
**Borders and Radius:**
- Border radius values for consistent rounded corners
- Shadow definitions for depth and elevation
- Transition timing for smooth animations

**Breakpoints:**
- Responsive design breakpoints for mobile/tablet/desktop
- Container max-widths for different screen sizes

## Global Styling Rules

### Base Elements
- **Body:** Font family, color, and background styling
- **Headings (h1-h6):** Consistent typography scale
- **Buttons:** Base button styling with CSS variable integration
- **Form Elements:** Input, textarea, and form control styling

### Utility Classes
- **Layout Utilities:** Flexbox, grid, spacing utilities
- **Typography Utilities:** Text sizes, weights, and colors
- **Color Utilities:** Background and text color classes
- **State Utilities:** Hover, active, disabled states

### Component Base Styles
- **Cards:** Surface styling with shadows and borders
- **Navigation:** Menu and navigation element styles
- **Modal/Dialog:** Overlay and dialog base styling
- **Animation:** Transition and animation base classes

## Architecture Notes

### CSS Custom Properties Benefits
- **Consistent Theming:** Single source of truth for colors and values
- **Easy Customization:** Change variables to update entire app theme
- **Dynamic Updates:** JavaScript can modify CSS variables at runtime
- **Maintenance:** Centralized styling reduces duplication

### No Hardcoded Values Rule
As specified in project requirements:
- **All styling values must use CSS variables**
- **No hardcoded colors, sizes, or spacing in components**
- **Easy theme switching and customization**
- **Consistent visual design across all components**

### Integration Points
- **Components:** All components reference these CSS variables
- **Custom.css:** Additional customizations build on these variables
- **JavaScript:** Components can access and modify CSS variables
- **Theme System:** Foundation for light/dark mode or custom themes

This CSS architecture ensures consistent, maintainable, and customizable styling throughout the Daily Sync application.