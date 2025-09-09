// Export configuration as frozen objects for immutability
export const MOODS = Object.freeze({
    levels: [
        { value: 5, emoji: '😄', label: 'Amazing', color: '#10B981' },
        { value: 4, emoji: '😊', label: 'Good', color: '#60A5FA' },
        { value: 3, emoji: '😐', label: 'Okay', color: '#FBBF24' },
        { value: 2, emoji: '😔', label: 'Bad', color: '#FB923C' },
        { value: 1, emoji: '😢', label: 'Terrible', color: '#EF4444' }
    ]
});

export const ACTIVITIES = Object.freeze({
    emotions: [
        { id: 'happy', label: 'Happy', emoji: '😊', color: '#10B981' },
        { id: 'excited', label: 'Excited', emoji: '🤩', color: '#FBBF24' },
        { id: 'calm', label: 'Calm', emoji: '😌', color: '#60A5FA' },
        { id: 'stressed', label: 'Stressed', emoji: '😰', color: '#FB923C' },
        { id: 'tired', label: 'Tired', emoji: '😴', color: '#94A3B8' },
        { id: 'anxious', label: 'Anxious', emoji: '😟', color: '#EF4444' },
        { id: 'grateful', label: 'Grateful', emoji: '🙏', color: '#10B981' },
        { id: 'frustrated', label: 'Frustrated', emoji: '😤', color: '#FB923C' }
    ],
    
    health: [
        { id: 'exercise', label: 'Exercise', emoji: '💪', color: '#10B981' },
        { id: 'walk', label: 'Walk', emoji: '🚶', color: '#60A5FA' },
        { id: 'yoga', label: 'Yoga', emoji: '🧘', color: '#8B5CF6' },
        { id: 'meditation', label: 'Meditation', emoji: '🧘‍♂️', color: '#8B5CF6' },
        { id: 'sleep_well', label: 'Slept Well', emoji: '😴', color: '#64748B' },
        { id: 'headache', label: 'Headache', emoji: '🤕', color: '#EF4444' },
        { id: 'sick', label: 'Feeling Sick', emoji: '🤒', color: '#EF4444' }
    ],
    
    hobbies: [
        { id: 'reading', label: 'Reading', emoji: '📚', color: '#8B5CF6' },
        { id: 'music', label: 'Music', emoji: '🎵', color: '#EC4899' },
        { id: 'gaming', label: 'Gaming', emoji: '🎮', color: '#06B6D4' },
        { id: 'cooking', label: 'Cooking', emoji: '👨‍🍳', color: '#F59E0B' },
        { id: 'art', label: 'Art/Drawing', emoji: '🎨', color: '#EC4899' },
        { id: 'photography', label: 'Photography', emoji: '📷', color: '#64748B' },
        { id: 'gardening', label: 'Gardening', emoji: '🌱', color: '#10B981' }
    ],
    
    social: [
        { id: 'friends', label: 'Time with Friends', emoji: '👥', color: '#FBBF24' },
        { id: 'family', label: 'Time with Family', emoji: '👨‍👩‍👧‍👦', color: '#EC4899' },
        { id: 'partner', label: 'Time with Partner', emoji: '💕', color: '#EF4444' },
        { id: 'party', label: 'Party/Event', emoji: '🎉', color: '#8B5CF6' },
        { id: 'alone_time', label: 'Alone Time', emoji: '🧘', color: '#60A5FA' },
        { id: 'phone_call', label: 'Phone Call', emoji: '📞', color: '#06B6D4' }
    ],
    
    work: [
        { id: 'productive', label: 'Productive', emoji: '💼', color: '#10B981' },
        { id: 'meeting', label: 'Meetings', emoji: '👥', color: '#60A5FA' },
        { id: 'deadline', label: 'Deadline Pressure', emoji: '⏰', color: '#FB923C' },
        { id: 'learning', label: 'Learning', emoji: '📚', color: '#8B5CF6' },
        { id: 'creative', label: 'Creative Work', emoji: '💡', color: '#FBBF24' },
        { id: 'teamwork', label: 'Teamwork', emoji: '🤝', color: '#06B6D4' }
    ],
    
    lifestyle: [
        { id: 'travel', label: 'Travel', emoji: '✈️', color: '#06B6D4' },
        { id: 'shopping', label: 'Shopping', emoji: '🛍️', color: '#EC4899' },
        { id: 'cleaning', label: 'Cleaning', emoji: '🧹', color: '#64748B' },
        { id: 'nature', label: 'Time in Nature', emoji: '🌿', color: '#10B981' },
        { id: 'movies', label: 'Movies/TV', emoji: '🍿', color: '#F59E0B' },
        { id: 'restaurant', label: 'Restaurant/Dining', emoji: '🍽️', color: '#EF4444' }
    ]
});

export const QUESTIONS = Object.freeze({
    // Positive questions (mood >= 4)
    positive: [
        { id: 1, text: "What makes you happiest in life?", category: "happiness" },
        { id: 2, text: "What are you most grateful for?", category: "gratitude" },
        { id: 3, text: "What do you consider your biggest achievements?", category: "achievement" },
        { id: 4, text: "How do you practice self-care?", category: "self-care" },
        { id: 5, text: "What energizes you?", category: "energy" },
        { id: 6, text: "What do you love most about yourself?", category: "self-love" },
        { id: 7, text: "What inspires you?", category: "inspiration" },
        { id: 8, text: "What positive changes have you made in your life?", category: "growth" },
        { id: 9, text: "Who or what brings joy to your life?", category: "connection" },
        { id: 10, text: "What tends to exceed your expectations?", category: "surprise" }
    ],
    
    // Negative questions (mood <= 2)
    negative: [
        { id: 11, text: "What typically causes you stress?", category: "stress" },
        { id: 12, text: "What are your main worries?", category: "worry" },
        { id: 13, text: "What would you like to change about yourself?", category: "regret" },
        { id: 14, text: "What drains your energy?", category: "drain" },
        { id: 15, text: "What do you need help with?", category: "support" },
        { id: 16, text: "What thoughts tend to occupy your mind?", category: "rumination" },
        { id: 17, text: "What feels like an obstacle in your life?", category: "challenge" },
        { id: 18, text: "What makes you feel insecure?", category: "insecurity" },
        { id: 19, text: "What makes you sad or disappointed?", category: "sadness" },
        { id: 20, text: "What do you tend to avoid?", category: "avoidance" }
    ],
    
    // Neutral/reflective questions (mood = 3)
    neutral: [
        { id: 21, text: "How would you describe yourself in one word?", category: "reflection" },
        { id: 22, text: "What have you learned about yourself recently?", category: "learning" },
        { id: 23, text: "What memories are most important to you?", category: "memory" },
        { id: 24, text: "What surprises you about life?", category: "unexpected" },
        { id: 25, text: "What are you passionate about?", category: "activity" },
        { id: 26, text: "What are your goals and aspirations?", category: "future" },
        { id: 27, text: "How would you describe your physical well-being?", category: "physical" },
        { id: 28, text: "What advice would you give your younger self?", category: "wisdom" },
        { id: 29, text: "What important decisions have shaped who you are?", category: "decision" },
        { id: 30, text: "What does success mean to you?", category: "values" }
    ],
    
    // Follow-up questions (context-based)
    followUp: [
        { id: 31, text: "Can you tell me more about that?", category: "elaboration" },
        { id: 32, text: "How does that make you feel?", category: "emotion" },
        { id: 33, text: "What would you do differently?", category: "improvement" },
        { id: 34, text: "What have you learned from that?", category: "insight" },
        { id: 35, text: "How do you cope with that?", category: "coping" }
    ]
});

export const APP_SETTINGS = Object.freeze({
    // Storage keys
    storageKeys: {
        entries: 'dailySync_entries',
        settings: 'dailySync_settings',
        currentStreak: 'dailySync_streak'
    },
    
    // Validation rules
    validation: {
        minAnswerLength: 10,
        maxAnswerLength: 500
    },
    
    // Question settings
    maxQuestionsPerDay: 3,
    
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
        home: '#home',
        mood: '#mood',
        questions: '#questions',
        activities: '#activities',
        diary: '#diary',
        stats: '#stats'
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
