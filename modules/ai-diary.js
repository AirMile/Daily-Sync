// AI diary generator - creates readable diary entries from collected data
// Processes mood, activities, and question responses into personalized diary format
import { MOODS, ACTIVITIES } from './config.js';

// Diary entry templates organized by mood level
const DIARY_TEMPLATES = Object.freeze({
    // High mood templates (4-5)
    positive: [
        "Today was wonderfully {moodWord}! {moodEmoji} {activitySummary} {questionInsight} {encouragement}",
        "What an energizing {moodWord} day! {moodEmoji} I found myself really enjoying {activitySummary} {questionInsight} These positive moments are exactly what I want to remember.",
        "I'm feeling genuinely {moodWord} today {moodEmoji}. {activitySummary} {questionInsight} {positiveReflection}",
        "Today brought such a beautiful sense of being {moodWord} {moodEmoji}. {activitySummary} When I reflected on my day, {questionInsight} Days like this remind me why life feels so full of possibility.",
        "Such a {moodWord} day! {moodEmoji} {activitySummary} {questionInsight} I want to carry this energy into tomorrow.",
        "Feeling incredibly {moodWord} today {moodEmoji}. {activitySummary} My heart feels full when I think about {questionInsight} These are the moments that make everything worthwhile."
    ],
    
    // Neutral mood templates (3)
    neutral: [
        "Today was a steady, {moodWord} kind of day {moodEmoji}. {activitySummary} {questionInsight} {neutralReflection}",
        "I'm feeling {moodWord} and grounded today {moodEmoji}. {activitySummary} When I paused to think about it, {questionInsight} Sometimes these quiet, balanced days are exactly what my soul needs.",
        "Today felt peacefully {moodWord} {moodEmoji}. {activitySummary} {questionInsight} {neutralEncouragement}",
        "A {moodWord}, contemplative day {moodEmoji}. {activitySummary} I found myself appreciating {questionInsight} There's something beautiful about these gentle, in-between moments.",
        "Today brought a sense of {moodWord} stability {moodEmoji}. {activitySummary} {questionInsight} I'm learning to value these calm, steady rhythms of life."
    ],
    
    // Low mood templates (1-2)
    negative: [
        "Today was challenging - I've been feeling {moodWord} {moodEmoji}. Even so, {activitySummary} When I reflected on my day, {questionInsight} {supportiveMessage}",
        "This was a tough day where I felt {moodWord} {moodEmoji}. Despite the difficulties, {activitySummary} {questionInsight} I'm reminding myself that tomorrow brings new possibilities.",
        "I struggled with feeling {moodWord} today {moodEmoji}. {activitySummary} In quiet moments, {questionInsight} {selfCompassion}",
        "Today my heart felt {moodWord} {moodEmoji}. {activitySummary} {questionInsight} I'm learning that difficult days are part of my human experience, and that's completely okay.",
        "A {moodWord} day that asked a lot of me {moodEmoji}. {activitySummary} {questionInsight} I'm proud of myself for showing up, even when it felt hard."
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
        return "I took time for quiet reflection.";
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
        return "I found meaning in the simple moments of my day.";
    }

    const templates = {
        single: [
            `I spent meaningful time with ${activityLabels[0]}.`,
            `${activityLabels[0]} filled an important part of my day.`,
            `I found joy in ${activityLabels[0]} today.`,
            `${activityLabels[0]} brought me a sense of connection to myself.`
        ],
        double: [
            `I wove together ${activityLabels[0]} and ${activityLabels[1]} in beautiful ways.`,
            `My day was enriched by both ${activityLabels[0]} and ${activityLabels[1]}.`,
            `I found a lovely rhythm between ${activityLabels[0]} and ${activityLabels[1]}.`,
            `${activityLabels[0]} and ${activityLabels[1]} both nourished different parts of me.`
        ],
        multiple: [
            `My day flowed between ${activityLabels.slice(0, 2).join(', ')}, and ${activityLabels.length > 2 ? 'other meaningful experiences' : activityLabels[2]}.`,
            `I felt grateful for the variety in my day - from ${activityLabels.slice(0, 2).join(' to ')}, and beyond.`,
            `There was something special about moving between ${activityLabels.slice(0, 2).join(', ')}, and the other activities that filled my day.`,
            `I appreciated how ${activityLabels.slice(0, 3).join(', ')} each added their own texture to my experience.`
        ]
    };

    if (activityLabels.length === 1) {
        return templates.single[Math.floor(Math.random() * templates.single.length)];
    }

    if (activityLabels.length === 2) {
        return templates.double[Math.floor(Math.random() * templates.double.length)];
    }

    return templates.multiple[Math.floor(Math.random() * templates.multiple.length)];
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