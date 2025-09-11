// Statistics calculator - processes historical data for insights and trends
// Calculates mood patterns, activity correlations, and generates statistics

/**
 * Calculate mood trends over specified time periods
 * @param {Array} entries - Array of mood entries
 * @param {string} period - 'week', 'month', or 'year'
 * @returns {Object} Mood trend data
 */
export function calculateMoodTrends(entries, period = 'week') {
    if (!entries || entries.length === 0) {
        return { trends: [], average: 0, change: 0 };
    }

    const now = new Date();
    const periodMs = {
        week: 7 * 24 * 60 * 60 * 1000,
        month: 30 * 24 * 60 * 60 * 1000,
        year: 365 * 24 * 60 * 60 * 1000
    };

    const cutoffDate = new Date(now.getTime() - periodMs[period]);
    const filteredEntries = entries.filter(entry => 
        new Date(entry.date) >= cutoffDate
    );

    if (filteredEntries.length === 0) {
        return { trends: [], average: 0, change: 0 };
    }

    // Group entries by day
    const dailyMoods = {};
    filteredEntries.forEach(entry => {
        const date = entry.date.split('T')[0];
        if (!dailyMoods[date]) {
            dailyMoods[date] = [];
        }
        dailyMoods[date].push(entry.mood);
    });

    // Calculate daily averages
    const trends = Object.entries(dailyMoods).map(([date, moods]) => ({
        date,
        mood: moods.reduce((sum, mood) => sum + mood, 0) / moods.length
    })).sort((a, b) => new Date(a.date) - new Date(b.date));

    const totalMood = trends.reduce((sum, day) => sum + day.mood, 0);
    const average = totalMood / trends.length;

    // Calculate trend change (first vs last week average)
    let change = 0;
    if (trends.length >= 7) {
        const firstWeekAvg = trends.slice(0, 7).reduce((sum, day) => sum + day.mood, 0) / 7;
        const lastWeekAvg = trends.slice(-7).reduce((sum, day) => sum + day.mood, 0) / 7;
        change = lastWeekAvg - firstWeekAvg;
    }

    return { trends, average: Math.round(average * 10) / 10, change: Math.round(change * 10) / 10 };
}

/**
 * Analyze patterns between activities and mood
 * @param {Array} entries - Array of mood entries with activities
 * @returns {Object} Activity pattern analysis
 */
export function analyzeActivityPatterns(entries) {
    if (!entries || entries.length === 0) {
        return { correlations: {}, topPositive: [], topNegative: [] };
    }

    const activityMoods = {};
    
    entries.forEach(entry => {
        if (entry.activities && entry.activities.length > 0) {
            entry.activities.forEach(activityId => {
                if (!activityMoods[activityId]) {
                    activityMoods[activityId] = [];
                }
                activityMoods[activityId].push(entry.mood);
            });
        }
    });

    const correlations = {};
    Object.entries(activityMoods).forEach(([activityId, moods]) => {
        const averageMood = moods.reduce((sum, mood) => sum + mood, 0) / moods.length;
        correlations[activityId] = {
            averageMood: Math.round(averageMood * 10) / 10,
            frequency: moods.length,
            impact: averageMood > 3 ? 'positive' : averageMood < 3 ? 'negative' : 'neutral'
        };
    });

    // Sort activities by mood impact
    const sortedActivities = Object.entries(correlations)
        .filter(([_, data]) => data.frequency >= 2) // Only include activities with 2+ occurrences
        .sort(([_, a], [__, b]) => b.averageMood - a.averageMood);

    const topPositive = sortedActivities
        .filter(([_, data]) => data.averageMood > 3)
        .slice(0, 5)
        .map(([activityId, data]) => ({ activityId, ...data }));

    const topNegative = sortedActivities
        .filter(([_, data]) => data.averageMood < 3)
        .slice(-5)
        .map(([activityId, data]) => ({ activityId, ...data }));

    return { correlations, topPositive, topNegative };
}

/**
 * Calculate current streak and streak history
 * @param {Array} entries - Array of mood entries
 * @returns {Object} Streak information
 */
export function calculateStreaks(entries) {
    if (!entries || entries.length === 0) {
        return { current: 0, longest: 0, streakHistory: [] };
    }

    // Sort entries by date (newest first)
    const sortedEntries = [...entries].sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // Get unique dates
    const uniqueDates = [...new Set(sortedEntries.map(entry => entry.date.split('T')[0]))];
    uniqueDates.sort((a, b) => new Date(b) - new Date(a));

    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;
    const streakHistory = [];

    const today = new Date();
    const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);

    // Check current streak
    for (let i = 0; i < uniqueDates.length; i++) {
        const entryDate = new Date(uniqueDates[i]);
        const expectedDate = new Date(today.getTime() - i * 24 * 60 * 60 * 1000);
        
        // Allow for today or yesterday as start
        if (i === 0 && (
            entryDate.toDateString() === today.toDateString() || 
            entryDate.toDateString() === yesterday.toDateString()
        )) {
            currentStreak = 1;
            tempStreak = 1;
        } else if (entryDate.toDateString() === expectedDate.toDateString()) {
            currentStreak++;
            tempStreak++;
        } else {
            break;
        }
    }

    // Calculate longest streak
    let currentRun = 0;
    for (let i = uniqueDates.length - 1; i >= 0; i--) {
        const current = new Date(uniqueDates[i]);
        const next = i > 0 ? new Date(uniqueDates[i - 1]) : null;
        
        currentRun++;
        
        if (!next || (next.getTime() - current.getTime()) > 24 * 60 * 60 * 1000) {
            if (currentRun > longestStreak) {
                longestStreak = currentRun;
            }
            streakHistory.push({
                length: currentRun,
                endDate: uniqueDates[i],
                startDate: uniqueDates[i + currentRun - 1] || uniqueDates[i]
            });
            currentRun = 0;
        }
    }

    return {
        current: currentStreak,
        longest: longestStreak,
        streakHistory: streakHistory.reverse()
    };
}

/**
 * Generate comprehensive summary statistics
 * @param {Array} entries - Array of mood entries
 * @returns {Object} Summary statistics
 */
export function generateSummaryStats(entries) {
    if (!entries || entries.length === 0) {
        return {
            totalEntries: 0,
            averageMood: 0,
            moodDistribution: {},
            mostCommonActivity: null,
            bestMoodActivity: null,
            streakInfo: { current: 0, longest: 0 }
        };
    }

    const totalEntries = entries.length;
    const averageMood = entries.reduce((sum, entry) => sum + entry.mood, 0) / totalEntries;
    
    // Mood distribution
    const moodDistribution = entries.reduce((dist, entry) => {
        dist[entry.mood] = (dist[entry.mood] || 0) + 1;
        return dist;
    }, {});

    // Activity analysis
    const activityFrequency = {};
    entries.forEach(entry => {
        if (entry.activities) {
            entry.activities.forEach(activityId => {
                activityFrequency[activityId] = (activityFrequency[activityId] || 0) + 1;
            });
        }
    });

    const mostCommonActivity = Object.entries(activityFrequency)
        .sort(([_, a], [__, b]) => b - a)[0]?.[0] || null;

    const { topPositive } = analyzeActivityPatterns(entries);
    const bestMoodActivity = topPositive[0]?.activityId || null;

    const streakInfo = calculateStreaks(entries);

    return {
        totalEntries,
        averageMood: Math.round(averageMood * 10) / 10,
        moodDistribution,
        mostCommonActivity,
        bestMoodActivity,
        streakInfo: {
            current: streakInfo.current,
            longest: streakInfo.longest
        }
    };
}

/**
 * Get mood distribution as percentages
 * @param {Array} entries - Array of mood entries
 * @returns {Object} Mood distribution percentages
 */
export function getMoodDistribution(entries) {
    if (!entries || entries.length === 0) {
        return {};
    }

    const distribution = entries.reduce((dist, entry) => {
        dist[entry.mood] = (dist[entry.mood] || 0) + 1;
        return dist;
    }, {});

    const total = entries.length;
    const percentageDistribution = {};

    Object.entries(distribution).forEach(([mood, count]) => {
        percentageDistribution[mood] = Math.round((count / total) * 100);
    });

    return percentageDistribution;
}

/**
 * Analyze how specific activities impact mood compared to baseline
 * @param {Array} entries - Array of mood entries
 * @param {string} activityId - Specific activity to analyze
 * @returns {Object} Activity impact analysis
 */
export function getActivityImpact(entries, activityId) {
    if (!entries || entries.length === 0) {
        return { impact: 0, comparison: 'neutral', confidence: 'low' };
    }

    const entriesWithActivity = entries.filter(entry => 
        entry.activities && entry.activities.includes(activityId)
    );

    const entriesWithoutActivity = entries.filter(entry => 
        !entry.activities || !entry.activities.includes(activityId)
    );

    if (entriesWithActivity.length === 0) {
        return { impact: 0, comparison: 'no data', confidence: 'none' };
    }

    const avgWithActivity = entriesWithActivity.reduce((sum, entry) => sum + entry.mood, 0) / entriesWithActivity.length;
    const avgWithoutActivity = entriesWithoutActivity.length > 0 
        ? entriesWithoutActivity.reduce((sum, entry) => sum + entry.mood, 0) / entriesWithoutActivity.length
        : avgWithActivity;

    const impact = Math.round((avgWithActivity - avgWithoutActivity) * 10) / 10;
    
    let comparison = 'neutral';
    if (impact > 0.3) comparison = 'positive';
    else if (impact < -0.3) comparison = 'negative';

    let confidence = 'low';
    if (entriesWithActivity.length >= 5 && entriesWithoutActivity.length >= 5) confidence = 'high';
    else if (entriesWithActivity.length >= 3) confidence = 'medium';

    return { 
        impact, 
        comparison, 
        confidence,
        avgWithActivity: Math.round(avgWithActivity * 10) / 10,
        avgWithoutActivity: Math.round(avgWithoutActivity * 10) / 10,
        sampleSize: entriesWithActivity.length
    };
}

/**
 * Get time-based patterns (best/worst times, days of week)
 * @param {Array} entries - Array of mood entries
 * @returns {Object} Time-based pattern analysis
 */
export function getTimePatterns(entries) {
    if (!entries || entries.length === 0) {
        return { byDayOfWeek: {}, byTimeOfDay: {}, insights: [] };
    }

    const byDayOfWeek = {};
    const byTimeOfDay = {};
    const insights = [];

    entries.forEach(entry => {
        const date = new Date(entry.date);
        const dayOfWeek = date.toLocaleDateString('en', { weekday: 'long' });
        const hour = date.getHours();

        // Day of week analysis
        if (!byDayOfWeek[dayOfWeek]) {
            byDayOfWeek[dayOfWeek] = { moods: [], total: 0 };
        }
        byDayOfWeek[dayOfWeek].moods.push(entry.mood);
        byDayOfWeek[dayOfWeek].total++;

        // Time of day analysis (group by 4-hour blocks)
        const timeBlock = Math.floor(hour / 4) * 4;
        const timeLabel = `${timeBlock}:00-${timeBlock + 3}:59`;
        
        if (!byTimeOfDay[timeLabel]) {
            byTimeOfDay[timeLabel] = { moods: [], total: 0 };
        }
        byTimeOfDay[timeLabel].moods.push(entry.mood);
        byTimeOfDay[timeLabel].total++;
    });

    // Calculate averages
    Object.keys(byDayOfWeek).forEach(day => {
        const moods = byDayOfWeek[day].moods;
        byDayOfWeek[day].average = Math.round((moods.reduce((sum, mood) => sum + mood, 0) / moods.length) * 10) / 10;
    });

    Object.keys(byTimeOfDay).forEach(time => {
        const moods = byTimeOfDay[time].moods;
        byTimeOfDay[time].average = Math.round((moods.reduce((sum, mood) => sum + mood, 0) / moods.length) * 10) / 10;
    });

    // Generate insights
    const dayAverages = Object.entries(byDayOfWeek)
        .filter(([_, data]) => data.total >= 2)
        .sort(([_, a], [__, b]) => b.average - a.average);

    if (dayAverages.length > 0) {
        insights.push(`Your best day is typically ${dayAverages[0][0]} (avg: ${dayAverages[0][1].average})`);
        if (dayAverages.length > 1) {
            insights.push(`Your most challenging day is typically ${dayAverages[dayAverages.length - 1][0]} (avg: ${dayAverages[dayAverages.length - 1][1].average})`);
        }
    }

    return { byDayOfWeek, byTimeOfDay, insights };
}