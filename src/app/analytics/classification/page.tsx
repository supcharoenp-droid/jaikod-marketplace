'use client'

/**
 * CLASSIFICATION ANALYTICS DASHBOARD
 * 
 * Real-time monitoring and analytics for classification system
 * - Accuracy metrics
 * - Category breakdown
 * - Error patterns
 * - Performance monitoring
 * - Historical trends
 */

import { useState, useEffect } from 'react'
import { getClassifier } from '@/lib/integrated-classification'
import { CATEGORIES } from '@/constants/categories'

export default function ClassificationAnalyticsPage() {
    const [stats, setStats] = useState<any>(null)
    const [isLive, setIsLive] = useState(false)
    const [refreshInterval, setRefreshInterval] = useState(5000) // 5 seconds

    useEffect(() => {
        fetchStats()

        if (isLive) {
            const interval = setInterval(fetchStats, refreshInterval)
            return () => clearInterval(interval)
        }
    }, [isLive, refreshInterval])

    const fetchStats = () => {
        const classifier = getClassifier()
        const statistics = classifier.getStatistics()
        setStats(statistics)
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-8 border border-white/20">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-4xl font-bold text-white mb-2">
                                📊 Classification Analytics
                            </h1>
                            <p className="text-white/60">Real-time monitoring dashboard</p>
                        </div>

                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setIsLive(!isLive)}
                                className={`px-6 py-3 rounded-xl font-semibold transition-all ${isLive
                                    ? 'bg-green-500 text-white shadow-lg shadow-green-500/50'
                                    : 'bg-white/10 text-white/60 hover:bg-white/20'
                                    }`}
                            >
                                {isLive ? '🟢 LIVE' : '⚪ Paused'}
                            </button>

                            <button
                                onClick={fetchStats}
                                className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-semibold transition-all shadow-lg"
                            >
                                🔄 Refresh
                            </button>
                        </div>
                    </div>
                </div>

                {stats ? (
                    <>
                        {/* Main Metrics */}
                        <div className="grid grid-cols-4 gap-6 mb-8">
                            <MetricCard
                                title="Total Classifications"
                                value={stats.totalClassifications}
                                icon="📈"
                                color="blue"
                            />

                            <MetricCard
                                title="Avg Confidence"
                                value={`${(stats.avgConfidence * 100).toFixed(1)}%`}
                                icon="🎯"
                                color="green"
                            />

                            <MetricCard
                                title="Avg Processing Time"
                                value={`${stats.avgProcessingTime.toFixed(1)}ms`}
                                icon="⚡"
                                color="yellow"
                            />

                            <MetricCard
                                title="Advanced Engine"
                                value={`${stats.advancedEngine.percentage.toFixed(1)}%`}
                                icon="🧠"
                                color="purple"
                            />
                        </div>

                        {/* Engine Usage */}
                        <div className="grid grid-cols-2 gap-6 mb-8">
                            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                                <h3 className="text-xl font-bold text-white mb-4">🔀 Engine Distribution</h3>

                                <div className="space-y-4">
                                    <EngineBar
                                        label="Advanced Engine"
                                        count={stats.advancedEngine.count}
                                        percentage={stats.advancedEngine.percentage}
                                        color="from-purple-500 to-pink-500"
                                    />

                                    <EngineBar
                                        label="Legacy Engine"
                                        count={stats.legacyEngine.count}
                                        percentage={stats.legacyEngine.percentage}
                                        color="from-gray-500 to-gray-600"
                                    />
                                </div>
                            </div>

                            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                                <h3 className="text-xl font-bold text-white mb-4">📊 Performance Graph</h3>

                                <div className="h-48 flex items-end gap-2">
                                    {stats.logs.slice(-10).map((log: any, idx: number) => (
                                        <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                                            <div
                                                className="w-full bg-gradient-to-t from-blue-500 to-cyan-400 rounded-t-lg transition-all"
                                                style={{
                                                    height: `${log.confidence * 180}px`,
                                                    minHeight: '20px'
                                                }}
                                            />
                                            <div className="text-white/40 text-xs">
                                                {log.confidence.toFixed(2)}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="text-center text-white/60 text-sm mt-4">
                                    Last 10 Classifications • Confidence Scores
                                </div>
                            </div>
                        </div>

                        {/* Recent Classifications */}
                        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 mb-8">
                            <h3 className="text-xl font-bold text-white mb-4">📝 Recent Classifications</h3>

                            <div className="space-y-2">
                                {stats.logs.slice(-10).reverse().map((log: any, idx: number) => (
                                    <div
                                        key={idx}
                                        className="flex items-center justify-between bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-all"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={`w-3 h-3 rounded-full ${log.engine === 'advanced' ? 'bg-purple-400' : 'bg-gray-400'
                                                }`} />

                                            <div>
                                                <div className="text-white font-semibold">
                                                    {CATEGORIES.find(c => c.id === log.categoryId)?.name_en || 'Unknown'}
                                                </div>
                                                <div className="text-white/60 text-sm">
                                                    {log.engine === 'advanced' ? '🧠 Advanced' : '⚙️ Legacy'} Engine
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-6">
                                            <div className="text-right">
                                                <div className="text-white/60 text-xs">Confidence</div>
                                                <div className={`font-bold ${log.confidence >= 0.8 ? 'text-green-400' :
                                                    log.confidence >= 0.6 ? 'text-yellow-400' :
                                                        'text-red-400'
                                                    }`}>
                                                    {(log.confidence * 100).toFixed(1)}%
                                                </div>
                                            </div>

                                            <div className="text-right">
                                                <div className="text-white/60 text-xs">Time</div>
                                                <div className="text-white font-semibold">
                                                    {log.processingTime?.toFixed(1) || 0}ms
                                                </div>
                                            </div>

                                            <div className="text-white/40 text-xs">
                                                {new Date(log.timestamp).toLocaleTimeString()}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Health Status */}
                        <div className="grid grid-cols-3 gap-6">
                            <HealthCard
                                title="System Health"
                                status={stats.avgConfidence >= 0.8 ? 'Excellent' : stats.avgConfidence >= 0.6 ? 'Good' : 'Needs Attention'}
                                color={stats.avgConfidence >= 0.8 ? 'green' : stats.avgConfidence >= 0.6 ? 'yellow' : 'red'}
                                metrics={[
                                    { label: 'Avg Confidence', value: `${(stats.avgConfidence * 100).toFixed(1)}%` },
                                    { label: 'Classifications', value: stats.totalClassifications }
                                ]}
                            />

                            <HealthCard
                                title="Performance"
                                status={stats.avgProcessingTime < 100 ? 'Fast' : stats.avgProcessingTime < 200 ? 'Normal' : 'Slow'}
                                color={stats.avgProcessingTime < 100 ? 'green' : stats.avgProcessingTime < 200 ? 'yellow' : 'red'}
                                metrics={[
                                    { label: 'Avg Time', value: `${stats.avgProcessingTime.toFixed(1)}ms` },
                                    { label: 'Target', value: '< 100ms' }
                                ]}
                            />

                            <HealthCard
                                title="Engine Status"
                                status={stats.advancedEngine.percentage >= 50 ? 'Active' : 'Limited'}
                                color={stats.advancedEngine.percentage >= 50 ? 'green' : 'yellow'}
                                metrics={[
                                    { label: 'Advanced', value: `${stats.advancedEngine.percentage.toFixed(0)}%` },
                                    { label: 'Legacy', value: `${stats.legacyEngine.percentage.toFixed(0)}%` }
                                ]}
                            />
                        </div>
                    </>
                ) : (
                    <div className="flex items-center justify-center h-96">
                        <div className="text-center">
                            <div className="text-6xl mb-4">📊</div>
                            <div className="text-white/60 text-lg">No data available yet</div>
                            <div className="text-white/40 text-sm mt-2">
                                Start classifying products to see analytics
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

// ========================================
// COMPONENTS
// ========================================

function MetricCard({ title, value, icon, color }: any) {
    const colorClasses = {
        blue: 'from-blue-500 to-cyan-500',
        green: 'from-green-500 to-emerald-500',
        yellow: 'from-yellow-500 to-orange-500',
        purple: 'from-purple-500 to-pink-500'
    }

    return (
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-3">
                <div className="text-white/60 text-sm font-semibold">{title}</div>
                <div className="text-3xl">{icon}</div>
            </div>
            <div className={`text-4xl font-bold bg-gradient-to-r ${colorClasses[color as keyof typeof colorClasses]} bg-clip-text text-transparent`}>
                {value}
            </div>
        </div>
    )
}

function EngineBar({ label, count, percentage, color }: any) {
    return (
        <div>
            <div className="flex items-center justify-between mb-2">
                <div className="text-white/80">{label}</div>
                <div className="text-white/60 text-sm">{count} ({percentage.toFixed(1)}%)</div>
            </div>
            <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
                <div
                    className={`h-full bg-gradient-to-r ${color} rounded-full transition-all duration-500`}
                    style={{ width: `${percentage}%` }}
                />
            </div>
        </div>
    )
}

function HealthCard({ title, status, color, metrics }: any) {
    const colorClasses = {
        green: 'bg-green-500/20 border-green-500/40 text-green-400',
        yellow: 'bg-yellow-500/20 border-yellow-500/40 text-yellow-400',
        red: 'bg-red-500/20 border-red-500/40 text-red-400'
    }

    return (
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <h4 className="text-white font-semibold mb-3">{title}</h4>

            <div className={`inline-block px-4 py-2 rounded-full font-bold mb-4 ${colorClasses[color as keyof typeof colorClasses]}`}>
                {status}
            </div>

            <div className="space-y-2">
                {metrics.map((metric: any, idx: number) => (
                    <div key={idx} className="flex items-center justify-between text-sm">
                        <div className="text-white/60">{metric.label}</div>
                        <div className="text-white font-semibold">{metric.value}</div>
                    </div>
                ))}
            </div>
        </div>
    )
}
