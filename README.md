# 📱 Daily Sync App - Prototype

## Quick Start

```bash
# Open index.html in browser
# Of gebruik live-server:
npm install
npm run dev
```

## Folder Structuur

```
prototype/
├── index.html              # Main HTML (ES6 modules support)
├── package.json           # NPM configuratie
├── modules/               # JavaScript ES6 modules
│   ├── app.js            # Main app controller
│   ├── config.js         # Hard-coded vragen & settings
│   ├── storage.js        # LocalStorage wrapper
│   ├── mood.js           # Mood selector logic
│   ├── questions.js      # Question bank logic
│   ├── stats.js          # Statistics calculator
│   └── ai-diary.js       # AI diary generator (hardcoded prototype)
├── components/           # UI Components
│   ├── mood-selector.js # Mood UI component
│   ├── activity-selector.js # Activity tracking UI (Daylio-style)
│   ├── question-card.js # Question UI component
│   ├── stats-view.js    # Stats UI component
│   └── diary-view.js    # AI diary display component
├── styles/              # CSS files
│   ├── main.css        # Tailwind imports
│   └── custom.css      # Custom styles
└── assets/             # Static files
    ├── icons/          # Mood emojis
    └── sounds/         # Feedback sounds
```

## Architectuur Principes

### 1. **ES6 Modules** (MDN Best Practice)
- Alle JavaScript is modulair
- Import/Export syntax
- Module preloading voor performance

### 2. **Building Blocks Approach**
- Elk module is onafhankelijk
- Herbruikbare componenten
- Clear separation of concerns

### 3. **Configuration-Driven**
- Alle vragen hard-coded in `config.js`
- Makkelijk aan te passen zonder code wijzigingen
- Frozen objects voor immutability

### 4. **Event-Driven Architecture**
- Loose coupling tussen modules
- Custom event emitters
- Reactive UI updates

## Development Workflow

1. **Start met config.js**
   - Pas moods aan
   - Voeg/wijzig vragen toe
   - Configureer app settings

2. **Test mood selector**
   - Open index.html
   - Selecteer mood
   - Check localStorage

3. **Implementeer vragen flow**
   - Mood-based question selection
   - Answer storage
   - Navigation tussen screens

4. **Voeg statistieken toe**
   - Mood trends
   - Answer patterns
   - Visualisaties

## Browser Support

- Chrome 90+ (recommended)
- Firefox 88+
- Safari 14+
- Edge 90+

Vereist native ES6 module support.

## Next Steps

- [ ] Implementeer alle UI componenten
- [ ] Voeg Tailwind styling toe
- [ ] Test op mobile devices
- [ ] Deploy naar GitHub Pages
- [ ] Integreer met backend (fase 2)

---
*TLE Experimenteren - September 2025*
