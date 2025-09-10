// Sample data generator for Daily Sync App prototype
// Creates realistic mood entries, activities, and diary entries for demonstration
import { MOODS, ACTIVITIES, QUESTIONS, getQuestionsByMood } from './config.js';
import { generateDiaryEntry } from './ai-diary.js';

/**
 * Generate sample mood entries for the past 30-45 days
 * @param {number} daysBack - Number of days to generate data for (default: 35)
 * @returns {Array} Array of sample mood entries
 */
export function generateSampleEntries(daysBack = 35) {
    const entries = [];
    // Start from yesterday to leave room for today's entries during demo
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    
    // Define realistic response templates for each question category
    const responseTemplates = {
        happiness: [
            "Spending quality time with my family and friends",
            "Achieving personal goals I've set for myself",
            "Being in nature and enjoying peaceful moments",
            "Creating something meaningful or helping others",
            "Making progress on projects I care about"
        ],
        gratitude: [
            "My health and the health of my loved ones",
            "Having a supportive network of friends and family", 
            "The opportunities I have to learn and grow",
            "Access to basic necessities and small daily comforts",
            "Being able to pursue things that bring me joy"
        ],
        achievement: [
            "Completing my education and developing new skills",
            "Building meaningful relationships with people I care about",
            "Overcoming personal challenges that once seemed impossible",
            "Making positive contributions to my community",
            "Learning to maintain better work-life balance"
        ],
        stress: [
            "Work deadlines and overwhelming project loads",
            "Financial planning and managing monthly expenses",
            "Balancing multiple responsibilities at once",
            "Uncertainty about future career decisions",
            "Managing expectations from family and friends"
        ],
        worry: [
            "Whether I'm making the right life choices",
            "The health and wellbeing of family members",
            "Economic stability and job security",
            "Climate change and environmental issues",
            "Maintaining important relationships over time"
        ],
        energy: [
            "Regular exercise and staying physically active",
            "Getting enough quality sleep each night",
            "Eating nutritious meals and staying hydrated",
            "Engaging in creative activities and hobbies",
            "Spending time outdoors in fresh air"
        ],
        learning: [
            "I'm more resilient than I previously thought",
            "Setting boundaries is essential for my wellbeing",
            "Small daily habits compound into significant changes",
            "It's okay to ask for help when I need it",
            "Taking breaks actually makes me more productive"
        ]
    };

    for (let i = 1; i <= daysBack; i++) {
        const entryDate = new Date(yesterday);
        entryDate.setDate(yesterday.getDate() - i);
        entryDate.setHours(Math.floor(Math.random() * 12) + 8); // Random time between 8 AM - 8 PM
        
        // Skip some entries to make it look realistic (85-95% completion rate)
        if (Math.random() < 0.1) continue;
        
        // Generate mood with weekly patterns (better weekends, harder Mondays)
        const dayOfWeek = entryDate.getDay();
        let baseMood = 3;
        
        if (dayOfWeek === 0 || dayOfWeek === 6) { // Weekend
            baseMood = 3.8;
        } else if (dayOfWeek === 1) { // Monday
            baseMood = 2.5;
        } else if (dayOfWeek === 5) { // Friday
            baseMood = 3.6;
        }
        
        // Add some randomness
        const moodVariation = (Math.random() - 0.5) * 2;
        const finalMood = Math.max(1, Math.min(5, Math.round(baseMood + moodVariation)));
        
        // Generate activities (3-7 activities per entry)
        const numActivities = Math.floor(Math.random() * 5) + 3;
        const selectedActivities = generateRandomActivities(numActivities, finalMood);
        
        // Generate questions and responses
        const questionsForMood = getQuestionsByMood(finalMood);
        const numQuestions = Math.floor(Math.random() * 2) + 2; // 2-3 questions
        const selectedQuestions = [];
        const responses = [];
        
        // Select random questions
        const shuffledQuestions = [...questionsForMood].sort(() => 0.5 - Math.random());
        for (let j = 0; j < numQuestions && j < shuffledQuestions.length; j++) {
            const question = shuffledQuestions[j];
            selectedQuestions.push(question);
            
            // Generate realistic response
            const response = generateRealisticResponse(question, responseTemplates);
            responses.push(response);
        }
        
        // Create entry object with proper timestamp fields
        const entry = {
            id: `sample_${Date.now()}_${i}`,
            date: entryDate.toISOString(),
            timestamp: entryDate.getTime(), // Add timestamp in milliseconds
            completedAt: entryDate.getTime(), // Add completedAt for diary view
            mood: finalMood,
            activities: selectedActivities,
            questions: selectedQuestions,
            responses: responses,
            answers: {}, // Map responses to question IDs for compatibility
            completed: true
        };
        
        // Map responses to answers object for storage compatibility
        selectedQuestions.forEach((question, index) => {
            entry.answers[question.id] = responses[index];
        });
        
        // Generate diary entry
        entry.diaryEntry = generateDiaryEntry(entry);
        
        entries.push(entry);
    }
    
    // Sort by date (most recent first)
    entries.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    return entries;
}

/**
 * Generate random activities based on mood and realistic patterns
 * @param {number} numActivities - Number of activities to generate
 * @param {number} mood - Current mood level (1-5)
 * @returns {Array} Array of activity IDs
 */
function generateRandomActivities(numActivities, mood) {
    const allActivities = [
        ...ACTIVITIES.emotions,
        ...ACTIVITIES.health, 
        ...ACTIVITIES.hobbies,
        ...ACTIVITIES.social,
        ...ACTIVITIES.work,
        ...ACTIVITIES.lifestyle
    ];
    
    // Define common activities that appear frequently to ensure top activity calculation works
    const commonActivities = ['walk', 'reading', 'music', 'friends', 'exercise', 'meditation'];
    
    // Create weighted pools based on mood
    let weightedActivities = [];
    
    if (mood >= 4) {
        // Positive mood - more positive activities
        weightedActivities = [
            ...ACTIVITIES.emotions.filter(a => ['happy', 'excited', 'calm', 'grateful'].includes(a.id)),
            ...ACTIVITIES.health.filter(a => ['exercise', 'walk', 'yoga', 'meditation', 'sleep_well'].includes(a.id)),
            ...ACTIVITIES.hobbies,
            ...ACTIVITIES.social.filter(a => !a.id.includes('alone')),
            ...ACTIVITIES.work.filter(a => ['productive', 'creative', 'learning'].includes(a.id)),
            ...ACTIVITIES.lifestyle.filter(a => ['nature', 'travel', 'restaurant'].includes(a.id))
        ];
    } else if (mood <= 2) {
        // Negative mood - include stress/tiredness but also coping activities
        weightedActivities = [
            ...ACTIVITIES.emotions.filter(a => ['stressed', 'tired', 'anxious', 'frustrated'].includes(a.id)),
            ...ACTIVITIES.health.filter(a => ['meditation', 'walk'].includes(a.id)),
            ...ACTIVITIES.hobbies.filter(a => ['reading', 'music'].includes(a.id)),
            ...ACTIVITIES.social.filter(a => a.id === 'alone_time'),
            ...ACTIVITIES.work.filter(a => a.id === 'deadline'),
            ...ACTIVITIES.lifestyle.filter(a => ['movies', 'cleaning'].includes(a.id))
        ];
    } else {
        // Neutral mood - mix of everything
        weightedActivities = allActivities;
    }
    
    // Select random activities without duplicates
    const selectedActivities = [];
    
    // Ensure at least one common activity for consistency (60% chance)
    if (Math.random() < 0.6 && weightedActivities.length > 0) {
        const availableCommon = commonActivities.filter(id => 
            weightedActivities.some(a => a.id === id)
        );
        if (availableCommon.length > 0) {
            const commonId = availableCommon[Math.floor(Math.random() * availableCommon.length)];
            selectedActivities.push(commonId);
        }
    }
    
    // Fill remaining slots with random activities
    const shuffledActivities = [...weightedActivities].sort(() => 0.5 - Math.random());
    
    for (let i = 0; i < numActivities && selectedActivities.length < numActivities; i++) {
        const activity = shuffledActivities[i];
        if (activity && !selectedActivities.includes(activity.id)) {
            selectedActivities.push(activity.id);
        }
    }
    
    return selectedActivities;
}

/**
 * Generate realistic response to a question
 * @param {Object} question - Question object with category
 * @param {Object} responseTemplates - Templates for different categories
 * @returns {string} Realistic response
 */
function generateRealisticResponse(question, responseTemplates) {
    const templates = responseTemplates[question.category];
    
    if (templates && templates.length > 0) {
        const baseResponse = templates[Math.floor(Math.random() * templates.length)];
        
        // Add some variation to responses
        const variations = [
            baseResponse,
            `${baseResponse}. This has been really important for my wellbeing lately.`,
            `I've been thinking about this a lot lately - ${baseResponse.toLowerCase()}.`,
            `${baseResponse}. It's something I'm trying to focus on more.`
        ];
        
        return variations[Math.floor(Math.random() * variations.length)];
    }
    
    // Fallback responses for unknown categories
    const fallbackResponses = [
        "This is something I've been reflecting on recently.",
        "I think this varies from day to day, but overall it's important to me.",
        "This question really makes me think about what matters most.",
        "I'm still learning about this aspect of myself.",
        "It's interesting to consider how this affects my daily life."
    ];
    
    return fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
}

/**
 * Calculate sample statistics from entries
 * @param {Array} entries - Array of mood entries
 * @returns {Object} Statistics object
 */
export function calculateSampleStats(entries) {
    if (!entries || entries.length === 0) {
        return {
            totalEntries: 0,
            averageMood: 0,
            streakInfo: { current: 0, longest: 0 },
            moodDistribution: {},
            bestMoodActivity: null
        };
    }
    
    // Calculate average mood
    const averageMood = entries.reduce((sum, entry) => sum + entry.mood, 0) / entries.length;
    
    // Calculate mood distribution
    const moodDistribution = {};
    entries.forEach(entry => {
        moodDistribution[entry.mood] = (moodDistribution[entry.mood] || 0) + 1;
    });
    
    // Calculate streaks (simplified - assume recent entries are consecutive)
    const currentStreak = Math.min(entries.length, Math.floor(Math.random() * 5) + 8); // 8-12 days
    const longestStreak = Math.max(currentStreak, Math.floor(Math.random() * 8) + 15); // 15-22 days
    
    // Find activity with best average mood
    const activityMoods = {};
    const activityCounts = {};
    
    entries.forEach(entry => {
        entry.activities.forEach(activityId => {
            if (!activityMoods[activityId]) {
                activityMoods[activityId] = 0;
                activityCounts[activityId] = 0;
            }
            activityMoods[activityId] += entry.mood;
            activityCounts[activityId]++;
        });
    });
    
    let bestMoodActivity = null;
    let bestAverageMood = 0;
    
    Object.keys(activityMoods).forEach(activityId => {
        const avgMood = activityMoods[activityId] / activityCounts[activityId];
        if (avgMood > bestAverageMood && activityCounts[activityId] >= 2) { // Reduced to at least 2 occurrences
            bestAverageMood = avgMood;
            bestMoodActivity = activityId;
        }
    });
    
    // Fallback: if no activity meets criteria, pick the most frequent one
    if (!bestMoodActivity) {
        let maxCount = 0;
        Object.keys(activityCounts).forEach(activityId => {
            if (activityCounts[activityId] > maxCount) {
                maxCount = activityCounts[activityId];
                bestMoodActivity = activityId;
                bestAverageMood = activityMoods[activityId] / activityCounts[activityId];
            }
        });
    }
    
    return {
        totalEntries: entries.length,
        averageMood: parseFloat(averageMood.toFixed(2)),
        streakInfo: {
            current: currentStreak,
            longest: longestStreak
        },
        moodDistribution,
        bestMoodActivity,
        bestAverageMood: parseFloat(bestAverageMood.toFixed(2)),
        activityStats: {
            moods: activityMoods,
            counts: activityCounts
        }
    };
}

/**
 * Export sample data as JSON for easy inspection
 * @param {Array} entries - Sample entries
 * @returns {string} JSON string of sample data
 */
export function exportSampleDataAsJSON(entries) {
    const stats = calculateSampleStats(entries);
    
    const exportData = {
        metadata: {
            generatedAt: new Date().toISOString(),
            totalEntries: entries.length,
            dateRange: {
                oldest: entries[entries.length - 1]?.date,
                newest: entries[0]?.date
            },
            stats
        },
        entries
    };
    
    return JSON.stringify(exportData, null, 2);
}