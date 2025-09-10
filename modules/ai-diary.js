// AI diary generator - creates readable diary entries from collected data
// Processes mood, activities, and question responses into personalized diary format
import { MOODS, ACTIVITIES } from './config.js';

// Diary entry templates organized by mood level
const DIARY_TEMPLATES = Object.freeze({
    // High mood templates (4-5)
    positive: [
        "Today was {moodWord}! I felt {moodEmoji} throughout the day. {activitySummary} {questionInsight} {encouragement}",
        "What a {moodWord} day! {moodEmoji} {activitySummary} {questionInsight} I'm grateful for these positive moments.",
        "Feeling {moodWord} today {moodEmoji}. {activitySummary} {questionInsight} {positiveReflection}",
        "Today brought a sense of being {moodWord} {moodEmoji}. {activitySummary} {questionInsight} These are the days to remember!"
    ],
    
    // Neutral mood templates (3)
    neutral: [
        "Today was an okay day {moodEmoji}. {activitySummary} {questionInsight} {neutralReflection}",
        "A steady, {moodWord} sort of day {moodEmoji}. {activitySummary} {questionInsight} Sometimes these balanced days are exactly what we need.",
        "Feeling {moodWord} today {moodEmoji}. {activitySummary} {questionInsight} {neutralEncouragement}",
        "Today felt {moodWord} and balanced {moodEmoji}. {activitySummary} {questionInsight} Progress comes in all forms."
    ],
    
    // Low mood templates (1-2)
    negative: [
        "Today was challenging - feeling {moodWord} {moodEmoji}. {activitySummary} {questionInsight} {supportiveMessage}",
        "A tough day where I felt {moodWord} {moodEmoji}. {activitySummary} {questionInsight} Tomorrow is a new opportunity.",
        "Struggled with feeling {moodWord} today {moodEmoji}. {activitySummary} {questionInsight} {selfCompassion}",
        "Today I felt {moodWord} {moodEmoji}. {activitySummary} {questionInsight} It's okay to have difficult days."
    ]
});

const ENCOURAGEMENT_PHRASES = Object.freeze([
    "Keep building on this positive energy!",
    "These good vibes are worth celebrating.",
    "This kind of day shows your strength.",
    "You're creating beautiful moments.",
    "This positivity is contagious!"
]);

const POSITIVE_REFLECTIONS = Object.freeze([
    "Days like this remind me why life is beautiful.",
    "I want to remember this feeling.",
    "This is the energy I want to carry forward.",
    "These are the moments that matter most.",
    "I feel aligned with who I want to be."
]);

const NEUTRAL_REFLECTIONS = Object.freeze([
    "Not every day needs to be extraordinary.",
    "Steady progress is still progress.",
    "Balance is its own kind of success.",
    "These calm days have their own value.",
    "Sometimes okay is perfectly enough."
]);

const NEUTRAL_ENCOURAGEMENTS = Object.freeze([
    "Small steps still count as movement.",
    "Consistency beats intensity in the long run.",
    "You're building sustainable habits.",
    "Every day contributes to your growth.",
    "Showing up is half the battle."
]);

const SUPPORTIVE_MESSAGES = Object.freeze([
    "I'm learning to be gentle with myself.",
    "Every difficult day teaches me something.",
    "I'm stronger than I sometimes feel.",
    "This feeling will pass, and I'll get through it.",
    "I deserve compassion, especially from myself."
]);

const SELF_COMPASSION = Object.freeze([
    "I'm treating myself with the kindness I'd show a good friend.",
    "Difficult emotions are part of being human.",
    "I'm doing the best I can with what I have today.",
    "This is temporary, and I am resilient.",
    "I acknowledge this pain without judgment."
]);

/**
 * Generate a diary entry from mood entry data
 * @param {Object} entry - Mood entry with mood, activities, questions, and responses
 * @returns {string} Generated diary entry
 */
export function generateDiaryEntry(entry) {
    if (!entry || typeof entry.mood !== 'number') {
        return "Today I took time to check in with myself. Every moment of self-awareness is valuable.";
    }

    const moodLevel = entry.mood;
    const templateCategory = moodLevel >= 4 ? 'positive' : moodLevel === 3 ? 'neutral' : 'negative';
    const templates = DIARY_TEMPLATES[templateCategory];
    const selectedTemplate = templates[Math.floor(Math.random() * templates.length)];

    // Find mood configuration
    const moodConfig = MOODS.levels.find(m => m.value === moodLevel);
    const moodWord = moodConfig ? moodConfig.label.toLowerCase() : 'okay';
    const moodEmoji = moodConfig ? moodConfig.emoji : '😐';

    // Process activities
    const activitySummary = generateActivitySummary(entry.activities);
    
    // Process questions and responses
    const questionInsight = generateQuestionInsight(entry.questions, entry.responses);

    // Add contextual elements
    let contextualElement = '';
    if (templateCategory === 'positive') {
        contextualElement = ENCOURAGEMENT_PHRASES[Math.floor(Math.random() * ENCOURAGEMENT_PHRASES.length)];
    } else if (templateCategory === 'neutral') {
        contextualElement = Math.random() > 0.5 
            ? NEUTRAL_REFLECTIONS[Math.floor(Math.random() * NEUTRAL_REFLECTIONS.length)]
            : NEUTRAL_ENCOURAGEMENTS[Math.floor(Math.random() * NEUTRAL_ENCOURAGEMENTS.length)];
    } else {
        contextualElement = Math.random() > 0.5
            ? SUPPORTIVE_MESSAGES[Math.floor(Math.random() * SUPPORTIVE_MESSAGES.length)]
            : SELF_COMPASSION[Math.floor(Math.random() * SELF_COMPASSION.length)];
    }

    // Replace template placeholders
    return selectedTemplate
        .replace('{moodWord}', moodWord)
        .replace('{moodEmoji}', moodEmoji)
        .replace('{activitySummary}', activitySummary)
        .replace('{questionInsight}', questionInsight)
        .replace('{encouragement}', contextualElement)
        .replace('{positiveReflection}', contextualElement)
        .replace('{neutralReflection}', contextualElement)
        .replace('{neutralEncouragement}', contextualElement)
        .replace('{supportiveMessage}', contextualElement)
        .replace('{selfCompassion}', contextualElement);
}

/**
 * Generate activity summary text
 * @param {Array} activityIds - Array of activity IDs
 * @returns {string} Activity summary text
 */
function generateActivitySummary(activityIds) {
    if (!activityIds || activityIds.length === 0) {
        return "I spent time reflecting on my day.";
    }

    // Get activity labels
    const allActivities = [
        ...ACTIVITIES.emotions,
        ...ACTIVITIES.health,
        ...ACTIVITIES.hobbies,
        ...ACTIVITIES.social,
        ...ACTIVITIES.work,
        ...ACTIVITIES.lifestyle
    ];

    const activityLabels = activityIds.map(id => {
        const activity = allActivities.find(a => a.id === id);
        return activity ? activity.label.toLowerCase() : id;
    }).filter(Boolean);

    if (activityLabels.length === 0) {
        return "I engaged in various activities.";
    }

    if (activityLabels.length === 1) {
        return `I spent time with ${activityLabels[0]}.`;
    }

    if (activityLabels.length === 2) {
        return `I experienced ${activityLabels[0]} and ${activityLabels[1]}.`;
    }

    if (activityLabels.length <= 4) {
        const lastActivity = activityLabels.pop();
        return `I engaged with ${activityLabels.join(', ')}, and ${lastActivity}.`;
    }

    // For many activities
    return `I had a full day with ${activityLabels.slice(0, 3).join(', ')}, and several other activities.`;
}

/**
 * Generate insight from question responses
 * @param {Array} questions - Array of question objects
 * @param {Array} responses - Array of response strings
 * @returns {string} Question insight text
 */
function generateQuestionInsight(questions, responses) {
    if (!responses || responses.length === 0) {
        return "I took time for self-reflection.";
    }

    // Try to incorporate actual responses into the insight
    const firstResponse = responses[0];
    if (firstResponse && firstResponse.length > 20) {
        // Use part of the actual response if it's substantial
        const responseSnippet = firstResponse.length > 60 
            ? firstResponse.substring(0, 57) + "..." 
            : firstResponse;
        
        const contextualPhrases = [
            `I reflected deeply on this: "${responseSnippet}"`,
            `An important realization came to me: "${responseSnippet}"`,
            `I found myself thinking: "${responseSnippet}"`,
            `Today I acknowledged that ${responseSnippet.toLowerCase()}.`,
            `Something that stood out to me: "${responseSnippet}"`
        ];
        
        return contextualPhrases[Math.floor(Math.random() * contextualPhrases.length)];
    }

    // Fallback to generic insights if responses are too short
    const insights = [
        "My reflections revealed some important insights.",
        "I discovered something meaningful about myself today.", 
        "Taking time to answer deep questions helped me understand myself better.",
        "My inner thoughts showed me new perspectives.",
        "I gained clarity through thoughtful self-examination.",
        "These moments of introspection were valuable."
    ];

    return insights[Math.floor(Math.random() * insights.length)];
}

/**
 * Generate weekly summary from multiple entries
 * @param {Array} entries - Array of mood entries from the past week
 * @returns {string} Weekly summary diary entry
 */
export function generateWeeklySummary(entries) {
    if (!entries || entries.length === 0) {
        return "This week I focused on self-awareness and building healthy habits. Every small step counts.";
    }

    const averageMood = entries.reduce((sum, entry) => sum + entry.mood, 0) / entries.length;
    const moodTrend = averageMood >= 4 ? 'positive' : averageMood >= 3 ? 'steady' : 'challenging';
    
    // Get most common activities
    const allActivities = entries.flatMap(entry => entry.activities || []);
    const activityFrequency = {};
    allActivities.forEach(activity => {
        activityFrequency[activity] = (activityFrequency[activity] || 0) + 1;
    });

    const topActivities = Object.entries(activityFrequency)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 3)
        .map(([activity,]) => activity);

    const weeklyTemplates = {
        positive: [
            `This week has been largely ${moodTrend}! I averaged ${averageMood.toFixed(1)} on my mood scale. I found myself frequently engaged with {activities}. This pattern shows I'm building momentum in positive directions.`,
            `What a ${moodTrend} week this has been! My average mood of ${averageMood.toFixed(1)} reflects the good energy I've been cultivating. {activities} featured prominently in my days, contributing to this upward trend.`,
            `Looking back on a ${moodTrend} week with an average mood of ${averageMood.toFixed(1)}. The activities that stood out most were {activities}. I'm grateful for these consistent good feelings.`
        ],
        steady: [
            `This week felt ${moodTrend} and balanced, with an average mood of ${averageMood.toFixed(1)}. I consistently engaged with {activities}. Sometimes steady progress is exactly what we need.`,
            `A ${moodTrend} week overall, averaging ${averageMood.toFixed(1)} in mood. {activities} were my go-to activities. There's value in this kind of consistent, grounded approach to life.`,
            `This week maintained a ${moodTrend} rhythm with an average mood of ${averageMood.toFixed(1)}. I found myself drawn to {activities}. Balance and consistency have their own rewards.`
        ],
        challenging: [
            `This week was ${moodTrend}, with an average mood of ${averageMood.toFixed(1)}. Even during difficult times, I engaged with {activities}. I'm proud of myself for continuing to show up.`,
            `A ${moodTrend} week that averaged ${averageMood.toFixed(1)} in mood. Despite the struggles, I still found time for {activities}. This resilience is something to acknowledge.`,
            `This ${moodTrend} week brought an average mood of ${averageMood.toFixed(1)}. Through it all, {activities} remained part of my routine. I'm learning that difficult weeks teach us about our strength.`
        ]
    };

    const selectedTemplate = weeklyTemplates[moodTrend][Math.floor(Math.random() * weeklyTemplates[moodTrend].length)];
    
    // Get activity labels for template
    const allActivityConfigs = [
        ...ACTIVITIES.emotions,
        ...ACTIVITIES.health,
        ...ACTIVITIES.hobbies,
        ...ACTIVITIES.social,
        ...ACTIVITIES.work,
        ...ACTIVITIES.lifestyle
    ];

    const activityLabels = topActivities.map(id => {
        const activity = allActivityConfigs.find(a => a.id === id);
        return activity ? activity.label.toLowerCase() : id;
    }).filter(Boolean);

    const activityText = activityLabels.length > 0 
        ? activityLabels.slice(0, 2).join(' and ')
        : 'various activities';

    return selectedTemplate.replace('{activities}', activityText);
}

/**
 * Generate personalized insights based on patterns
 * @param {Object} stats - Statistics object from stats module
 * @param {Array} entries - Recent mood entries
 * @returns {Array} Array of insight strings
 */
export function generatePersonalizedInsights(stats, entries) {
    const insights = [];

    if (!stats || !entries || entries.length === 0) {
        return ["Keep tracking your moods to unlock personalized insights!", "Every entry helps build a clearer picture of your patterns."];
    }

    // Mood pattern insights
    if (stats.averageMood) {
        if (stats.averageMood >= 4) {
            insights.push("You're maintaining consistently positive moods - whatever you're doing, keep it up!");
        } else if (stats.averageMood >= 3) {
            insights.push("Your mood has been steady and balanced. This stability is a strength to build upon.");
        } else {
            insights.push("You've been going through a challenging period. Remember that reaching out for support is a sign of strength.");
        }
    }

    // Streak insights
    if (stats.streakInfo && stats.streakInfo.current > 0) {
        if (stats.streakInfo.current >= 7) {
            insights.push(`Amazing! You've been consistently tracking for ${stats.streakInfo.current} days. This self-awareness is a powerful habit.`);
        } else if (stats.streakInfo.current >= 3) {
            insights.push(`You're building momentum with a ${stats.streakInfo.current}-day tracking streak. Consistency is key!`);
        }
    }

    // Activity insights
    if (stats.bestMoodActivity) {
        const allActivityConfigs = [
            ...ACTIVITIES.emotions,
            ...ACTIVITIES.health,
            ...ACTIVITIES.hobbies,
            ...ACTIVITIES.social,
            ...ACTIVITIES.work,
            ...ACTIVITIES.lifestyle
        ];
        const activity = allActivityConfigs.find(a => a.id === stats.bestMoodActivity);
        if (activity) {
            insights.push(`${activity.label} seems to have the most positive impact on your mood. Consider incorporating it more often!`);
        }
    }

    // Add general encouragement if we don't have many insights
    if (insights.length < 2) {
        const encouragements = [
            "Your commitment to self-awareness is already a significant step toward well-being.",
            "Each day of tracking builds a clearer picture of what supports your mental health.",
            "You're developing valuable insights about your emotional patterns.",
            "This mindful approach to tracking your moods shows real self-care."
        ];
        insights.push(encouragements[Math.floor(Math.random() * encouragements.length)]);
    }

    return insights.slice(0, 3); // Limit to 3 insights
}

/**
 * Suggest conversation starters for next session
 * @param {Array} entries - Recent mood entries
 * @param {Object} stats - Statistics object
 * @returns {Array} Array of conversation starter strings
 */
export function suggestConversationStarters(entries, stats) {
    const suggestions = [];

    if (!entries || entries.length === 0) {
        return [
            "What's one thing you're looking forward to this week?",
            "How has your mood been lately?",
            "What activities make you feel most like yourself?"
        ];
    }

    // Recent mood-based suggestions
    const recentEntries = entries.slice(0, 7); // Last week
    const recentAverage = recentEntries.reduce((sum, entry) => sum + entry.mood, 0) / recentEntries.length;

    if (recentAverage >= 4) {
        suggestions.push("What's been contributing to your positive mood lately?");
        suggestions.push("How can you maintain this positive energy going forward?");
    } else if (recentAverage <= 2) {
        suggestions.push("What kind of support would be most helpful right now?");
        suggestions.push("Are there any small changes that might help you feel better?");
    } else {
        suggestions.push("What would help you feel more energized this week?");
        suggestions.push("What's one thing you're grateful for right now?");
    }

    // Activity-based suggestions
    if (stats && stats.bestMoodActivity) {
        const allActivityConfigs = [
            ...ACTIVITIES.emotions,
            ...ACTIVITIES.health,
            ...ACTIVITIES.hobbies,
            ...ACTIVITIES.social,
            ...ACTIVITIES.work,
            ...ACTIVITIES.lifestyle
        ];
        const activity = allActivityConfigs.find(a => a.id === stats.bestMoodActivity);
        if (activity) {
            suggestions.push(`How do you feel after engaging with ${activity.label.toLowerCase()}?`);
        }
    }

    // General reflective questions
    const generalQuestions = [
        "What pattern in your mood tracking surprises you most?",
        "If you could change one thing about your daily routine, what would it be?",
        "What does a perfect day look like for you?",
        "What's something you've learned about yourself recently?",
        "How do you typically recharge when you're feeling drained?"
    ];

    // Add random general questions if we need more
    while (suggestions.length < 3) {
        const randomQuestion = generalQuestions[Math.floor(Math.random() * generalQuestions.length)];
        if (!suggestions.includes(randomQuestion)) {
            suggestions.push(randomQuestion);
        }
    }

    return suggestions.slice(0, 3);
}