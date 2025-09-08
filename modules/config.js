// Export configuration as frozen objects for immutability
export const MOODS = Object.freeze({
    levels: [
        { value: 5, emoji: '😄', label: 'Geweldig', color: '#10B981' },
        { value: 4, emoji: '😊', label: 'Goed', color: '#60A5FA' },
        { value: 3, emoji: '😐', label: 'Oké', color: '#FBBF24' },
        { value: 2, emoji: '😔', label: 'Slecht', color: '#FB923C' },
        { value: 1, emoji: '😢', label: 'Vreselijk', color: '#EF4444' }
    ]
});

export const QUESTIONS = Object.freeze({
    // Positieve vragen (mood >= 4)
    positive: [
        { id: 1, text: "Wat maakte je vandaag het meest blij?", category: "happiness" },
        { id: 2, text: "Waar ben je vandaag dankbaar voor?", category: "gratitude" },
        { id: 3, text: "Wat was je grootste overwinning vandaag?", category: "achievement" },
        { id: 4, text: "Hoe heb je vandaag voor jezelf gezorgd?", category: "self-care" },
        { id: 5, text: "Wat gaf je energie vandaag?", category: "energy" },
        { id: 6, text: "Welk compliment zou je jezelf vandaag geven?", category: "self-love" },
        { id: 7, text: "Wat heeft je vandaag geïnspireerd?", category: "inspiration" },
        { id: 8, text: "Welke positieve verandering heb je vandaag gemaakt?", category: "growth" },
        { id: 9, text: "Wie of wat heeft je vandaag een glimlach bezorgd?", category: "connection" },
        { id: 10, text: "Wat ging er vandaag beter dan verwacht?", category: "surprise" }
    ],
    
    // Negatieve vragen (mood <= 2)
    negative: [
        { id: 11, text: "Wat maakte je vandaag gespannen?", category: "stress" },
        { id: 12, text: "Waar maak je je zorgen over?", category: "worry" },
        { id: 13, text: "Wat zou je anders willen doen?", category: "regret" },
        { id: 14, text: "Wat kostte je vandaag energie?", category: "drain" },
        { id: 15, text: "Waar heb je hulp bij nodig?", category: "support" },
        { id: 16, text: "Welke gedachte blijft maar terugkomen?", category: "rumination" },
        { id: 17, text: "Wat voelde vandaag als een obstakel?", category: "challenge" },
        { id: 18, text: "Waar voel je je onzeker over?", category: "insecurity" },
        { id: 19, text: "Wat maakt je verdrietig of teleurgesteld?", category: "sadness" },
        { id: 20, text: "Wat heb je vandaag vermeden?", category: "avoidance" }
    ],
    
    // Neutrale/reflectieve vragen (mood = 3)
    neutral: [
        { id: 21, text: "Hoe zou je vandaag in één woord beschrijven?", category: "reflection" },
        { id: 22, text: "Wat heb je vandaag geleerd?", category: "learning" },
        { id: 23, text: "Welk moment blijft je het meest bij?", category: "memory" },
        { id: 24, text: "Wat heeft je vandaag verrast?", category: "unexpected" },
        { id: 25, text: "Waar ben je vandaag mee bezig geweest?", category: "activity" },
        { id: 26, text: "Wat staat er morgen op je planning?", category: "future" },
        { id: 27, text: "Hoe voel je je fysiek vandaag?", category: "physical" },
        { id: 28, text: "Wat zou je tegen je jongere zelf zeggen?", category: "wisdom" },
        { id: 29, text: "Welke keuze heeft vandaag impact gehad?", category: "decision" },
        { id: 30, text: "Wat betekent succes voor jou vandaag?", category: "values" }
    ],
    
    // Follow-up vragen (context-based)
    followUp: [
        { id: 31, text: "Kun je daar meer over vertellen?", category: "elaboration" },
        { id: 32, text: "Hoe voelde dat voor jou?", category: "emotion" },
        { id: 33, text: "Wat zou je de volgende keer anders doen?", category: "improvement" },
        { id: 34, text: "Wat heb je daarvan geleerd?", category: "insight" },
        { id: 35, text: "Hoe ga je daarmee om?", category: "coping" }
    ]
});

export const APP_CONFIG = Object.freeze({
    // Storage
    storageKey: 'dailySyncData',
    backupKey: 'dailySyncBackup',
    
    // Question settings
    maxQuestionsPerDay: 3,
    minAnswerLength: 10, // minimum characters
    maxAnswerLength: 500, // maximum characters
    
    // UI settings
    defaultTheme: 'light',
    animationDuration: 300,
    autoSaveDelay: 1000, // milliseconds
    
    // Features
    enableSpeech: true,
    enableNotifications: false,
    enableAnalytics: false,
    
    // Navigation
    routes: {
        mood: '#mood',
        questions: '#questions',
        stats: '#stats',
        settings: '#settings'
    },
    
    // Time settings
    timezone: 'Europe/Amsterdam',
    dayStartHour: 4, // Day resets at 4 AM
    reminderTimes: ['09:00', '13:00', '20:00']
});

// Statistics configurations
export const STATS_CONFIG = Object.freeze({
    charts: {
        moodTrend: {
            type: 'line',
            days: 7,
            color: '#60A5FA'
        },
        moodDistribution: {
            type: 'pie',
            showPercentage: true
        },
        streaks: {
            type: 'calendar',
            showCurrentStreak: true
        }
    },
    
    insights: {
        minDataDays: 3, // Minimum days needed for insights
        patterns: ['weekly', 'daily', 'monthly']
    }
});

// Export helper function to get questions by mood
export function getQuestionsByMood(moodValue) {
    if (moodValue >= 4) {
        return QUESTIONS.positive;
    } else if (moodValue <= 2) {
        return QUESTIONS.negative;
    } else {
        return QUESTIONS.neutral;
    }
}

// Export helper to get random questions
export function getRandomQuestions(questions, count = 3) {
    const shuffled = [...questions].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}
