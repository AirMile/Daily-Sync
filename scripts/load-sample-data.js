// Sample data loader script for Daily Sync App
// Loads realistic sample data into localStorage for prototype demonstration
import { generateSampleEntries, calculateSampleStats } from '../modules/sample-data.js';
import storageManager from '../modules/storage.js';
import { APP_SETTINGS } from '../modules/config.js';

/**
 * Load sample data into localStorage
 * @param {Object} options - Configuration options
 * @param {boolean} options.clearExisting - Whether to clear existing data first
 * @param {number} options.daysBack - Number of days of data to generate
 * @param {boolean} options.includeStreak - Whether to set a sample streak
 */
export async function loadSampleData(options = {}) {
    const {
        clearExisting = true,
        daysBack = 35,
        includeStreak = true
    } = options;

    try {
        console.log('🚀 Starting sample data generation...');
        
        // Clear existing data if requested
        if (clearExisting) {
            console.log('🧹 Clearing existing data...');
            storageManager.clearAll();
        }
        
        // Generate sample entries
        console.log(`📊 Generating ${daysBack} days of sample data...`);
        const sampleEntries = generateSampleEntries(daysBack);
        console.log(`✅ Generated ${sampleEntries.length} entries`);
        
        // Save entries to storage
        console.log('💾 Saving entries to localStorage...');
        for (const entry of sampleEntries) {
            await storageManager.saveEntry(entry);
        }
        
        // Calculate and log statistics
        const stats = calculateSampleStats(sampleEntries);
        console.log('📈 Sample Data Statistics:');
        console.log(`   • Total entries: ${stats.totalEntries}`);
        console.log(`   • Average mood: ${stats.averageMood}/5.0`);
        console.log(`   • Current streak: ${stats.streakInfo.current} days`);
        console.log(`   • Longest streak: ${stats.streakInfo.longest} days`);
        console.log(`   • Best mood activity: ${stats.bestMoodActivity} (avg: ${stats.bestAverageMood})`);
        
        // Set sample streak
        if (includeStreak) {
            await storageManager.saveStreak(stats.streakInfo.current);
            console.log(`🔥 Set current streak to ${stats.streakInfo.current} days`);
        }
        
        // Save sample user data
        const sampleUserData = {
            name: 'Demo User',
            joinDate: new Date(Date.now() - (daysBack * 24 * 60 * 60 * 1000)).toISOString(),
            preferences: {
                theme: 'light',
                notifications: true,
                dailyReminder: '20:00'
            },
            goals: {
                dailyTracking: true,
                moodTarget: 4,
                minActivitiesPerDay: 3
            }
        };
        
        await storageManager.saveUserData(sampleUserData);
        console.log('👤 Saved sample user preferences');
        
        // Display mood distribution
        console.log('😊 Mood Distribution:');
        for (let mood = 5; mood >= 1; mood--) {
            const count = stats.moodDistribution[mood] || 0;
            const percentage = ((count / stats.totalEntries) * 100).toFixed(1);
            const bar = '█'.repeat(Math.round(percentage / 5));
            console.log(`   ${mood}: ${count} entries (${percentage}%) ${bar}`);
        }
        
        console.log('\n🎉 Sample data loaded successfully!');
        console.log('📱 You can now use the Daily Sync App with realistic demo data.');
        
        return {
            success: true,
            entriesLoaded: sampleEntries.length,
            stats,
            message: 'Sample data loaded successfully'
        };
        
    } catch (error) {
        console.error('❌ Error loading sample data:', error);
        return {
            success: false,
            error: error.message,
            message: 'Failed to load sample data'
        };
    }
}

/**
 * Quick load function for development
 * Loads 30 days of sample data with default settings
 */
export async function quickLoadSampleData() {
    return await loadSampleData({
        clearExisting: true,
        daysBack: 30,
        includeStreak: true
    });
}

/**
 * Load sample data for extended demo (60 days)
 * Useful for showcasing long-term patterns
 */
export async function loadExtendedSampleData() {
    return await loadSampleData({
        clearExisting: true,
        daysBack: 60,
        includeStreak: true
    });
}

/**
 * Add sample data without clearing existing data
 * Useful for adding more historical data
 */
export async function appendSampleData(daysBack = 14) {
    return await loadSampleData({
        clearExisting: false,
        daysBack,
        includeStreak: false
    });
}

/**
 * Display current data summary
 */
export async function displayDataSummary() {
    try {
        const entries = await storageManager.getAllEntries();
        const streak = await storageManager.getStreak();
        const userData = await storageManager.loadUserData();
        
        console.log('📊 Current Data Summary:');
        console.log(`   • Total entries: ${entries.length}`);
        console.log(`   • Current streak: ${streak} days`);
        console.log(`   • User data: ${userData ? 'Present' : 'Not set'}`);
        
        if (entries.length > 0) {
            const stats = calculateSampleStats(entries);
            console.log(`   • Average mood: ${stats.averageMood}/5.0`);
            console.log(`   • Date range: ${new Date(entries[entries.length - 1].date).toDateString()} to ${new Date(entries[0].date).toDateString()}`);
        }
        
        return { entries: entries.length, streak, hasUserData: !!userData };
    } catch (error) {
        console.error('❌ Error getting data summary:', error);
        return null;
    }
}

/**
 * Export current data for backup
 */
export async function exportCurrentData() {
    try {
        const exportData = storageManager.exportData();
        if (exportData) {
            console.log('📄 Current data exported');
            return exportData;
        } else {
            console.log('❌ No data to export');
            return null;
        }
    } catch (error) {
        console.error('❌ Error exporting data:', error);
        return null;
    }
}

// Browser console helpers - make functions available in console
if (typeof window !== 'undefined') {
    window.DailySyncSampleData = {
        load: loadSampleData,
        quickLoad: quickLoadSampleData,
        loadExtended: loadExtendedSampleData,
        append: appendSampleData,
        summary: displayDataSummary,
        export: exportCurrentData,
        clear: () => storageManager.clearAll()
    };
    
    console.log('🔧 Sample data functions available:');
    console.log('   • DailySyncSampleData.quickLoad() - Load 30 days of demo data');
    console.log('   • DailySyncSampleData.loadExtended() - Load 60 days of demo data');
    console.log('   • DailySyncSampleData.summary() - Show current data summary');
    console.log('   • DailySyncSampleData.clear() - Clear all data');
}