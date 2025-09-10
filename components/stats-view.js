// Statistics view UI component - displays mood trends, activity patterns, and AI diary
// Shows charts, graphs, and processed insights from collected data
import { MOODS, ACTIVITIES } from '../modules/config.js';
import { 
    calculateMoodTrends, 
    analyzeActivityPatterns, 
    generateSummaryStats,
    getMoodDistribution,
    getTimePatterns 
} from '../modules/stats.js';
import { 
    generateDiaryEntry, 
    generateWeeklySummary, 
    generatePersonalizedInsights 
} from '../modules/ai-diary.js';

export class StatsView {
    constructor() {
        this.container = null;
        this.data = null;
        this.currentPeriod = 'week';
        this.charts = {};
        
        // Event bindings
        this.handlePeriodChange = this.handlePeriodChange.bind(this);
        this.handleExport = this.handleExport.bind(this);
    }

    async init(container, entries) {
        this.container = container;
        this.data = entries || [];
        
        this.render();
        await this.loadStats();
        this.setupEventListeners();
        
        // Emit ready event
        this.container.dispatchEvent(new CustomEvent('stats-view-ready'));
    }

    render() {
        if (!this.container) return;

        this.container.innerHTML = `
            <div class="stats-view-component">
                <div class="stats-header">
                    <h2 class="stats-title">📊 Your Insights</h2>
                    <div class="stats-controls">
                        <div class="period-selector">
                            <button class="period-btn active" data-period="week">Week</button>
                            <button class="period-btn" data-period="month">Month</button>
                            <button class="period-btn" data-period="year">Year</button>
                        </div>
                        <button class="diary-btn" title="View Detailed Diary">
                            📖 Diary
                        </button>
                        <button class="export-btn" title="Export Data">
                            📤 Export
                        </button>
                    </div>
                </div>

                <div class="stats-content">
                    <!-- Summary Cards -->
                    <div class="summary-cards">
                        <div class="summary-card">
                            <div class="card-icon">😊</div>
                            <div class="card-content">
                                <div class="card-value" id="avg-mood">-</div>
                                <div class="card-label">Average Mood</div>
                            </div>
                        </div>
                    </div>

                    <!-- AI Insights Section -->
                    <div class="insights-section">
                        <div class="ai-diary-container">
                            <h3 class="section-title">📖 AI Diary</h3>
                            <div class="diary-content" id="diary-content">Loading diary entries...</div>
                        </div>
                        <div class="insights-container">
                            <h3 class="section-title">💡 Personalized Insights</h3>
                            <div class="insights-list" id="insights-list">Loading insights...</div>
                        </div>
                    </div>

                    <!-- Charts Section -->
                    <div class="charts-section">
                        <div class="chart-container">
                            <h3 class="chart-title">Mood Trends</h3>
                            <canvas id="mood-chart" width="400" height="300"></canvas>
                            <div class="chart-info" id="mood-chart-info">Loading...</div>
                        </div>
                        <div class="chart-container">
                            <h3 class="chart-title">Mood Distribution</h3>
                            <canvas id="mood-distribution-chart" width="400" height="300"></canvas>
                            <div class="chart-info" id="distribution-chart-info">Loading...</div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    async loadStats() {
        if (!this.data || this.data.length === 0) {
            this.showEmptyState();
            return;
        }

        try {
            // Calculate statistics
            const summaryStats = generateSummaryStats(this.data);
            const moodTrends = calculateMoodTrends(this.data, this.currentPeriod);
            const moodDistribution = getMoodDistribution(this.data);

            // Update summary cards
            this.updateSummaryCards(summaryStats);
            
            // Render charts
            this.renderMoodTrendsChart(moodTrends);
            this.renderMoodDistributionChart(moodDistribution);

            // Load AI content
            await this.loadAIContent(summaryStats);

        } catch (error) {
            console.error('Error loading stats:', error);
            this.showErrorState();
        }
    }

    updateSummaryCards(stats) {
        const avgMoodEl = document.getElementById('avg-mood');

        if (avgMoodEl) avgMoodEl.textContent = stats.averageMood || '-';
    }

    renderMoodTrendsChart(trends) {
        const canvas = document.getElementById('mood-chart');
        if (!canvas || !trends.trends.length) return;

        const ctx = canvas.getContext('2d');
        const { width, height } = canvas;
        
        // Clear canvas
        ctx.clearRect(0, 0, width, height);
        
        // Chart configuration
        const padding = 60;
        const chartWidth = width - 2 * padding;
        const chartHeight = height - 2 * padding;
        
        // Set up coordinates
        const dataPoints = trends.trends;
        const minMood = Math.min(...dataPoints.map(d => d.mood), 1);
        const maxMood = Math.max(...dataPoints.map(d => d.mood), 5);
        
        // Draw grid and axes
        this.drawChartBackground(ctx, padding, chartWidth, chartHeight, minMood, maxMood);
        
        // Draw trend line
        ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--primary-color') || '#60A5FA';
        ctx.lineWidth = 3;
        ctx.beginPath();
        
        dataPoints.forEach((point, index) => {
            const x = padding + (index / (dataPoints.length - 1)) * chartWidth;
            const y = padding + chartHeight - ((point.mood - minMood) / (maxMood - minMood)) * chartHeight;
            
            if (index === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });
        
        ctx.stroke();
        
        // Draw data points
        ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--primary-color') || '#60A5FA';
        dataPoints.forEach((point, index) => {
            const x = padding + (index / (dataPoints.length - 1)) * chartWidth;
            const y = padding + chartHeight - ((point.mood - minMood) / (maxMood - minMood)) * chartHeight;
            
            ctx.beginPath();
            ctx.arc(x, y, 4, 0, 2 * Math.PI);
            ctx.fill();
        });

        // Update chart info
        const infoEl = document.getElementById('mood-chart-info');
        if (infoEl) {
            const changeText = trends.change > 0 ? `↗️ +${trends.change}` : 
                              trends.change < 0 ? `↘️ ${trends.change}` : '→ 0';
            infoEl.textContent = `Average: ${trends.average} | Trend: ${changeText}`;
        }
    }

    renderMoodDistributionChart(distribution) {
        const canvas = document.getElementById('mood-distribution-chart');
        if (!canvas || Object.keys(distribution).length === 0) return;

        const ctx = canvas.getContext('2d');
        const { width, height } = canvas;
        
        // Clear canvas
        ctx.clearRect(0, 0, width, height);
        
        // Chart configuration
        const centerX = width / 2;
        const centerY = height / 2;
        const radius = Math.min(width, height) / 2 - 40;
        
        // Process data
        const total = Object.values(distribution).reduce((sum, count) => sum + count, 0);
        if (total === 0) return;
        
        let currentAngle = -Math.PI / 2; // Start at top
        
        Object.entries(distribution).forEach(([mood, percentage]) => {
            const moodValue = parseInt(mood);
            const moodConfig = MOODS.levels.find(m => m.value === moodValue);
            const color = moodConfig ? moodConfig.color : '#94A3B8';
            
            const sliceAngle = (percentage / 100) * 2 * Math.PI;
            
            // Draw slice
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
            ctx.closePath();
            ctx.fill();
            
            // Draw label
            const labelAngle = currentAngle + sliceAngle / 2;
            const labelX = centerX + Math.cos(labelAngle) * (radius * 0.7);
            const labelY = centerY + Math.sin(labelAngle) * (radius * 0.7);
            
            if (percentage >= 5) { // Only show labels for slices >= 5%
                ctx.fillStyle = '#FFFFFF';
                ctx.font = '14px -apple-system, BlinkMacSystemFont, sans-serif';
                ctx.textAlign = 'center';
                ctx.fillText(`${percentage}%`, labelX, labelY);
            }
            
            currentAngle += sliceAngle;
        });

        // Update chart info
        const infoEl = document.getElementById('distribution-chart-info');
        if (infoEl) {
            const mostCommon = Object.entries(distribution)
                .sort(([,a], [,b]) => b - a)[0];
            if (mostCommon) {
                const moodConfig = MOODS.levels.find(m => m.value === parseInt(mostCommon[0]));
                const label = moodConfig ? moodConfig.label : 'Unknown';
                infoEl.textContent = `Most common: ${label} (${mostCommon[1]}%)`;
            }
        }
    }


    drawChartBackground(ctx, padding, chartWidth, chartHeight, minValue, maxValue) {
        // Draw axes
        ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--border-color') || '#E2E8F0';
        ctx.lineWidth = 1;
        
        // Y-axis
        ctx.beginPath();
        ctx.moveTo(padding, padding);
        ctx.lineTo(padding, padding + chartHeight);
        ctx.stroke();
        
        // X-axis
        ctx.beginPath();
        ctx.moveTo(padding, padding + chartHeight);
        ctx.lineTo(padding + chartWidth, padding + chartHeight);
        ctx.stroke();
        
        // Grid lines
        ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--border-color') || '#F1F5F9';
        const gridLines = 4;
        for (let i = 0; i <= gridLines; i++) {
            const y = padding + (i / gridLines) * chartHeight;
            ctx.beginPath();
            ctx.moveTo(padding, y);
            ctx.lineTo(padding + chartWidth, y);
            ctx.stroke();
        }
        
        // Y-axis labels
        ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--text-secondary') || '#64748B';
        ctx.font = '12px -apple-system, BlinkMacSystemFont, sans-serif';
        ctx.textAlign = 'right';
        for (let i = 0; i <= gridLines; i++) {
            const value = maxValue - (i / gridLines) * (maxValue - minValue);
            const y = padding + (i / gridLines) * chartHeight + 4;
            ctx.fillText(value.toFixed(1), padding - 10, y);
        }
    }

    async loadAIContent(stats) {
        // Generate AI diary content
        const diaryEl = document.getElementById('diary-content');
        const insightsEl = document.getElementById('insights-list');
        
        if (this.data.length === 0) {
            if (diaryEl) diaryEl.textContent = 'Start tracking your mood to see AI-generated diary entries here.';
            if (insightsEl) insightsEl.textContent = 'Insights will appear as you build your mood history.';
            return;
        }

        try {
            // Generate weekly summary
            const recentEntries = this.data.slice(0, 7);
            const weeklySummary = generateWeeklySummary(recentEntries);
            
            if (diaryEl) {
                diaryEl.innerHTML = `
                    <div class="diary-entry">
                        <div class="diary-date">This Week</div>
                        <div class="diary-text">${weeklySummary}</div>
                    </div>
                `;
            }

            // Generate personalized insights
            const insights = generatePersonalizedInsights(stats, this.data);
            
            if (insightsEl) {
                insightsEl.innerHTML = insights.map((insight, index) => `
                    <div class="insight-item">
                        <div class="insight-icon">💡</div>
                        <div class="insight-text">${insight}</div>
                    </div>
                `).join('');
            }

        } catch (error) {
            console.error('Error loading AI content:', error);
            if (diaryEl) diaryEl.textContent = 'Error loading diary content.';
            if (insightsEl) insightsEl.textContent = 'Error loading insights.';
        }
    }

    setupEventListeners() {
        // Period selector
        const periodButtons = this.container.querySelectorAll('.period-btn');
        periodButtons.forEach(btn => {
            btn.addEventListener('click', this.handlePeriodChange);
        });

        // Diary button
        const diaryBtn = this.container.querySelector('.diary-btn');
        if (diaryBtn) {
            diaryBtn.addEventListener('click', () => this.handleDiaryView());
        }

        // Export button
        const exportBtn = this.container.querySelector('.export-btn');
        if (exportBtn) {
            exportBtn.addEventListener('click', this.handleExport);
        }
    }

    handlePeriodChange(event) {
        const newPeriod = event.target.dataset.period;
        if (newPeriod === this.currentPeriod) return;

        // Update active button
        this.container.querySelectorAll('.period-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        event.target.classList.add('active');

        this.currentPeriod = newPeriod;
        this.loadStats();
    }

    handleExport() {
        if (!this.data || this.data.length === 0) {
            alert('No data to export');
            return;
        }

        // Emit export event
        this.container.dispatchEvent(new CustomEvent('export-requested', {
            detail: { 
                data: this.data,
                format: 'json',
                period: this.currentPeriod
            }
        }));
    }

    handleDiaryView() {
        // Emit navigation event to diary view
        this.container.dispatchEvent(new CustomEvent('navigate', {
            detail: {
                route: 'diary'
            },
            bubbles: true
        }));
    }

    showEmptyState() {
        if (!this.container) return;
        
        this.container.innerHTML = `
            <div class="stats-view-component">
                <div class="empty-state">
                    <div class="empty-icon">📊</div>
                    <h3 class="empty-title">No Data Yet</h3>
                    <p class="empty-description">
                        Start tracking your moods to see beautiful insights and patterns here.
                    </p>
                    <button class="empty-action" onclick="window.location.hash = 'mood'">
                        Track Your Mood
                    </button>
                </div>
            </div>
        `;
    }

    showErrorState() {
        if (!this.container) return;
        
        this.container.innerHTML = `
            <div class="stats-view-component">
                <div class="error-state">
                    <div class="error-icon">⚠️</div>
                    <h3 class="error-title">Error Loading Stats</h3>
                    <p class="error-description">
                        There was a problem loading your statistics. Please try again.
                    </p>
                    <button class="error-action" onclick="location.reload()">
                        Refresh Page
                    </button>
                </div>
            </div>
        `;
    }

    destroy() {
        // Clean up event listeners and resources
        const periodButtons = this.container?.querySelectorAll('.period-btn');
        periodButtons?.forEach(btn => {
            btn.removeEventListener('click', this.handlePeriodChange);
        });

        const exportBtn = this.container?.querySelector('.export-btn');
        exportBtn?.removeEventListener('click', this.handleExport);

        this.container = null;
        this.data = null;
        this.charts = {};
    }
}