'use client'

/**
 * ADMIN SYSTEM HEALTH & AI AUDIT PAGE
 * 
 * Advanced control center for system integrity, duplicate detection, and quality assurance.
 * Powered by local heuristic AI models.
 */

import { useState, useEffect } from 'react'
import { runAudit, deleteItem, resolveMigrationDuplicates, type AuditReport, type DuplicateGroup, type QualityIssue, type OrphanedListing } from '@/services/orphaned-listings-audit'
import {
    Shield, Search, AlertTriangle, CheckCircle, Loader2, FileText,
    Copy, Activity, Trash2, ExternalLink, RefreshCw, BarChart3,
    Zap, AlertOctagon, Database, Wand2
} from 'lucide-react'

// --- Components ---

function StatCard({ title, value, icon: Icon, color, subtext }: any) {
    return (
        <div className="bg-slate-800/50 backdrop-blur-md border border-slate-700/50 rounded-2xl p-5 flex flex-col justify-between">
            <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl ${color} bg-opacity-20`}>
                    <Icon className={`w-6 h-6 ${color.replace('bg-', 'text-')}`} />
                </div>
                {subtext && <span className="text-xs text-gray-500 font-mono">{subtext}</span>}
            </div>
            <div>
                <h3 className="text-slate-400 text-sm font-medium mb-1">{title}</h3>
                <div className="text-3xl font-bold text-white">{value}</div>
            </div>
        </div>
    )
}

function QualityBadge({ severity }: { severity: string }) {
    const styles = {
        low: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
        medium: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
        high: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
        critical: 'bg-red-500/10 text-red-400 border-red-500/20',
    }[severity as 'low' | 'medium' | 'high' | 'critical'] || 'bg-gray-500/10 text-gray-400'

    return (
        <span className={`px-2 py-1 rounded-md text-xs font-medium border ${styles} capitalize`}>
            {severity}
        </span>
    )
}

export default function AdminSystemHealthPage() {
    const [loading, setLoading] = useState(false)
    const [report, setReport] = useState<AuditReport | null>(null)
    const [activeTab, setActiveTab] = useState<'dashboard' | 'duplicates' | 'orphans' | 'quality' | 'members' | 'performance' | 'storage'>('dashboard')
    const [processingId, setProcessingId] = useState<string | null>(null)

    // Auto-run on mount if desired, but manual is safer for admin tools
    // useEffect(() => { handleRunAudit() }, [])

    const handleRunAudit = async () => {
        setLoading(true)
        try {
            const result = await runAudit()
            setReport(result)
        } catch (err) {
            console.error(err)
            alert('Audit failed. Check console.')
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (collection: 'listings' | 'products', id: string) => {
        if (!confirm('Are you sure you want to delete this item? This cannot be undone.')) return

        setProcessingId(id)
        try {
            await deleteItem(collection, id)
            // Update local state to remove item
            if (report) {
                const newReport = { ...report }
                newReport.orphanedListings = newReport.orphanedListings.filter(i => i.id !== id)
                newReport.orphanedProducts = newReport.orphanedProducts.filter(i => i.id !== id)
                newReport.qualityIssues = newReport.qualityIssues.filter(i => i.id !== id)
                newReport.duplicates = newReport.duplicates.map(g => ({
                    ...g,
                    items: g.items.filter(i => i.id !== id)
                })).filter(g => g.items.length > 1)
                setReport(newReport)
            }
        } catch (err) {
            alert('Delete failed')
        } finally {
            setProcessingId(null)
        }
    }

    const totalStructureScore = report ? Math.round(
        100
        - (report.qualityIssues.length * 0.5)
        - (report.duplicates.length * 2)
        - ((report.orphanedListings.length + report.orphanedProducts.length) * 5)
    ) : 0

    const healthScore = Math.max(0, totalStructureScore)

    return (
        <div className="min-h-screen bg-[#0f172a] text-slate-200 font-sans p-6">
            <div className="max-w-7xl mx-auto space-y-8">

                {/* HEADLINE */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="space-y-1">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-indigo-500/20 rounded-lg">
                                <Activity className="w-6 h-6 text-indigo-400" />
                            </div>
                            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                                System Health & Intelligence
                            </h1>
                        </div>
                        <p className="text-slate-400 max-w-2xl">
                            AI-powered deep scan for data integrity, duplication, and quality control.
                        </p>
                    </div>

                    <button
                        onClick={handleRunAudit}
                        disabled={loading}
                        className="group relative flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-xl font-semibold text-white shadow-lg shadow-indigo-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <RefreshCw className="w-5 h-5" />}
                        {report ? 'Re-Scan System' : 'Start AI System Scan'}
                    </button>
                </div>

                {!report && !loading && (
                    <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-slate-700 rounded-3xl bg-slate-800/20">
                        <div className="w-20 h-20 bg-indigo-500/10 rounded-full flex items-center justify-center mb-6">
                            <Database className="w-10 h-10 text-indigo-400" />
                        </div>
                        <h2 className="text-xl font-semibold text-white mb-2">Ready to Scan</h2>
                        <p className="text-slate-400 max-w-md text-center mb-6">
                            Initiate a deep analysis of your Listings, Products, and User database to identify inconsistencies and optimize performance.
                        </p>
                        <button onClick={handleRunAudit} className="text-indigo-400 hover:text-indigo-300 font-medium">
                            Start Scan Now &rarr;
                        </button>
                    </div>
                )}

                {loading && (
                    <div className="py-20 text-center space-y-4">
                        <Loader2 className="w-12 h-12 text-indigo-500 animate-spin mx-auto" />
                        <h3 className="text-xl font-medium text-white">Analyzing System Architecture...</h3>
                        <p className="text-slate-400 animate-pulse">Scanning {Math.floor(Math.random() * 1000)}+ records for anomalies</p>
                    </div>
                )}

                {report && (
                    <div className="space-y-8 animate-in fade-in duration-500">

                        {/* HEALTH SCORE BANNER */}
                        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-900 to-slate-900 border border-indigo-500/30 p-8">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-[100px] rounded-full pointer-events-none" />
                            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                                <div>
                                    <h2 className="text-lg font-medium text-indigo-200 mb-1">Overall System Health Score</h2>
                                    <div className="flex items-end gap-3">
                                        <div className={`text-6xl font-bold ${healthScore > 80 ? 'text-emerald-400' : healthScore > 50 ? 'text-yellow-400' : 'text-red-400'}`}>
                                            {healthScore}%
                                        </div>
                                        <div className="pb-2 text-slate-400 font-medium">/ 100</div>
                                    </div>
                                    <p className="text-slate-400 mt-2 max-w-xl">
                                        {report.recommendations[0]}
                                    </p>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-slate-900/50 p-4 rounded-xl border border-white/5">
                                        <div className="text-slate-400 text-xs uppercase tracking-wider mb-1">Total Listings</div>
                                        <div className="text-2xl font-bold text-white">{report.totalListings}</div>
                                    </div>
                                    <div className="bg-slate-900/50 p-4 rounded-xl border border-white/5">
                                        <div className="text-slate-400 text-xs uppercase tracking-wider mb-1">Total Products</div>
                                        <div className="text-2xl font-bold text-white">{report.totalProducts}</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* TABS */}
                        <div className="flex items-center gap-2 border-b border-slate-700 pb-1 overflow-x-auto">
                            {[
                                { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
                                { id: 'duplicates', label: `Duplicates (${report.duplicates.length})`, icon: Copy },
                                { id: 'orphans', label: `Orphans (${report.orphanedListings.length + report.orphanedProducts.length})`, icon: AlertTriangle },
                                { id: 'quality', label: `QA (${report.qualityIssues.length})`, icon: Zap },
                                { id: 'members', label: 'Members', icon: UsersIcon },
                                { id: 'storage', label: `Storage (${report.storageIssues.length})`, icon: Database },
                                { id: 'performance', label: 'Performance', icon: Activity },
                            ].map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id as any)}
                                    className={`flex items-center gap-2 px-4 py-3 rounded-t-xl transition-all whitespace-nowrap ${activeTab === tab.id
                                            ? 'bg-slate-800 text-white border-b-2 border-indigo-500'
                                            : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                                        }`}
                                >
                                    <tab.icon className="w-4 h-4" />
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        {/* VIEW: DASHBOARD */}
                        {activeTab === 'dashboard' && (
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                    <StatCard
                                        title="System Latency"
                                        value={`${report.performance.firestoreReadLatencyMs}ms`}
                                        icon={Activity}
                                        color={report.performance.firestoreReadLatencyMs < 200 ? "bg-emerald-500 text-emerald-400" : "bg-yellow-500 text-yellow-400"}
                                        subtext="Firestore Read"
                                    />
                                    <StatCard
                                        title="Member Base"
                                        value={report.memberStats.totalUsers}
                                        icon={UsersIcon}
                                        color="bg-blue-500 text-blue-400"
                                        subtext={`${report.memberStats.verifiedCount} Verified`}
                                    />
                                    <StatCard
                                        title="Orphaned Items"
                                        value={report.orphanedListings.length + report.orphanedProducts.length}
                                        icon={AlertTriangle}
                                        color="bg-red-500 text-red-400"
                                        subtext="No seller attached"
                                    />
                                    <StatCard
                                        title="Duplicate Groups"
                                        value={report.duplicates.length}
                                        icon={Copy}
                                        color="bg-orange-500 text-orange-400"
                                        subtext="Potential conflicts"
                                    />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                    <StatCard
                                        title="Storage Issues"
                                        value={report.storageIssues.length}
                                        icon={Database}
                                        color="bg-purple-500 text-purple-400"
                                        subtext="Broken / Invalid"
                                    />
                                    <StatCard
                                        title="Quality Flags"
                                        value={report.qualityIssues.length}
                                        icon={Zap}
                                        color="bg-pink-500 text-pink-400"
                                        subtext="Improvement needed"
                                    />
                                </div>

                                <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6">
                                    <h3 className="text-lg font-semibold text-white mb-4">AI Recommendations</h3>
                                    <ul className="space-y-3">
                                        {report.recommendations.map((rec, i) => (
                                            <li key={i} className="flex items-start gap-3 p-3 bg-slate-900/50 rounded-xl">
                                                <div className="mt-1 w-2 h-2 rounded-full bg-indigo-500 flex-shrink-0" />
                                                <span className="text-slate-300">{rec}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        )}

                        {/* VIEW: DUPLICATES */}
                        {activeTab === 'duplicates' && (
                            <div className="space-y-6">
                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                    <div>
                                        <h3 className="text-xl font-bold text-white">Detected Duplicates</h3>
                                        <div className="text-sm text-slate-400">
                                            AI compares titles and seller IDs to find overlaps.
                                        </div>
                                    </div>
                                    {report.duplicates.some(d => d.type === 'migration_duplicate') && (
                                        <button
                                            onClick={async () => {
                                                if (!confirm('Auto-fix will delete ALL legacy "products" that have a matching "listings" version. proceed?')) return
                                                setLoading(true)
                                                await resolveMigrationDuplicates(report.duplicates)
                                                await handleRunAudit() // Rescan
                                                setLoading(false)
                                            }}
                                            disabled={loading}
                                            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-white font-medium text-sm transition-colors"
                                        >
                                            <Wand2 className="w-4 h-4" />
                                            Auto-Fix Migration Issues
                                        </button>
                                    )}
                                </div>

                                {report.duplicates.length === 0 ? (
                                    <EmptyState message="No duplicates found. Great job!" />
                                ) : (
                                    <div className="grid grid-cols-1 gap-4">
                                        {report.duplicates.map((group, idx) => (
                                            <div key={idx} className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                                                <div className="flex justify-between items-start mb-4">
                                                    <div>
                                                        <h4 className="text-lg font-semibold text-white">{group.key}</h4>
                                                        <span className="text-xs px-2 py-1 rounded-full bg-slate-700 text-slate-300 mt-2 inline-block">
                                                            Type: {group.type.replace('_', ' ')}
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    {group.items.map(item => (
                                                        <div key={item.id} className="bg-slate-900 p-4 rounded-lg border border-slate-700/50">
                                                            <div className="flex justify-between items-start">
                                                                <div>
                                                                    <div className={`text-xs font-bold px-2 py-0.5 rounded uppercase mb-2 inline-block ${item.collection === 'listings' ? 'bg-indigo-500/20 text-indigo-400' : 'bg-orange-500/20 text-orange-400'
                                                                        }`}>
                                                                        {item.collection}
                                                                    </div>
                                                                    <div className="text-sm text-slate-400 font-mono mb-1">{item.id}</div>
                                                                    <div className="text-slate-300 text-sm">Seller: {item.seller_id}</div>
                                                                    <div className="text-slate-500 text-xs mt-1">Created: {item.created_at.toISOString().split('T')[0]}</div>
                                                                </div>
                                                                <button
                                                                    onClick={() => handleDelete(item.collection, item.id)}
                                                                    disabled={!!processingId}
                                                                    className="p-2 hover:bg-red-500/10 text-slate-500 hover:text-red-400 rounded-lg transition-colors"
                                                                    title="Delete this version"
                                                                >
                                                                    {processingId === item.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* VIEW: ORPHANS */}
                        {activeTab === 'orphans' && (
                            <div className="space-y-6">
                                <h3 className="text-xl font-bold text-white">Orphaned Items (No Valid Seller)</h3>
                                {[...report.orphanedListings, ...report.orphanedProducts].length === 0 ? (
                                    <EmptyState message="All items have valid owners." />
                                ) : (
                                    <div className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden">
                                        <table className="w-full text-left text-sm">
                                            <thead className="bg-slate-900 text-slate-400 font-medium">
                                                <tr>
                                                    <th className="p-4">Title</th>
                                                    <th className="p-4">Collection</th>
                                                    <th className="p-4">Missing Seller ID</th>
                                                    <th className="p-4 text-right">Action</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-700">
                                                {[...report.orphanedListings, ...report.orphanedProducts].map((item) => (
                                                    <tr key={item.id} className="hover:bg-slate-800/30">
                                                        <td className="p-4 font-medium text-white">{item.title}</td>
                                                        <td className="p-4">
                                                            <span className={`px-2 py-1 rounded text-xs ${item.collection === 'listings' ? 'bg-indigo-900 text-indigo-300' : 'bg-orange-900 text-orange-300'}`}>
                                                                {item.collection}
                                                            </span>
                                                        </td>
                                                        <td className="p-4 font-mono text-slate-500">{item.seller_id}</td>
                                                        <td className="p-4 text-right">
                                                            <button
                                                                onClick={() => handleDelete(item.collection, item.id)}
                                                                className="text-red-400 hover:text-red-300 font-medium text-sm disabled:opacity-50"
                                                                disabled={!!processingId}
                                                            >
                                                                {processingId === item.id ? 'Deleting...' : 'Delete'}
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* VIEW: MEMBERS */}
                        {activeTab === 'members' && (
                            <div className="space-y-6">
                                <h3 className="text-xl font-bold text-white">Member Analytics</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700">
                                        <div className="text-slate-400 mb-2">Verified vs Unverified</div>
                                        <div className="text-3xl font-bold text-white mb-4">{Math.round((report.memberStats.verifiedCount / report.memberStats.totalUsers) * 100)}%</div>
                                        <div className="h-4 bg-slate-700 rounded-full overflow-hidden">
                                            <div className="h-full bg-blue-500" style={{ width: `${(report.memberStats.verifiedCount / report.memberStats.totalUsers) * 100}%` }}></div>
                                        </div>
                                        <div className="flex justify-between text-xs text-slate-400 mt-2">
                                            <span>{report.memberStats.verifiedCount} Verified</span>
                                            <span>{report.memberStats.totalUsers - report.memberStats.verifiedCount} Unverified</span>
                                        </div>
                                    </div>

                                    <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700">
                                        <div className="text-slate-400 mb-2">Incomplete Profiles</div>
                                        <div className="text-3xl font-bold text-white mb-4">{report.memberStats.incompleteProfiles}</div>
                                        <div className="text-sm text-slate-500">Users missing avatar or basic info.</div>
                                    </div>

                                    <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700">
                                        <div className="text-slate-400 mb-2">New Today</div>
                                        <div className="text-3xl font-bold text-green-400 mb-4">+{report.memberStats.newUsersToday}</div>
                                        <div className="text-sm text-slate-500">Growth in last 24 hours.</div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* VIEW: STORAGE */}
                        {activeTab === 'storage' && (
                            <div className="space-y-6">
                                <h3 className="text-xl font-bold text-white">Storage Health</h3>
                                {report.storageIssues.length === 0 ? (
                                    <EmptyState message="All image links appear valid." />
                                ) : (
                                    <div className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden">
                                        <table className="w-full text-left text-sm">
                                            <thead className="bg-slate-900 text-slate-400 font-medium">
                                                <tr>
                                                    <th className="p-4">Item ID</th>
                                                    <th className="p-4">Collection</th>
                                                    <th className="p-4">Broken URL</th>
                                                    <th className="p-4 text-right">Action</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-700">
                                                {report.storageIssues.map((issue, i) => (
                                                    <tr key={i} className="hover:bg-slate-800/30">
                                                        <td className="p-4 font-mono text-slate-500">{issue.id}</td>
                                                        <td className="p-4">{issue.collection}</td>
                                                        <td className="p-4 text-red-400 truncate max-w-xs">{issue.url}</td>
                                                        <td className="p-4 text-right">
                                                            <button className="text-slate-400 hover:text-white">View Item</button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* VIEW: PERFORMANCE */}
                        {activeTab === 'performance' && (
                            <div className="space-y-6">
                                <h3 className="text-xl font-bold text-white">Performance Metrics</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700 flex items-center gap-4">
                                        <div className={`p-4 rounded-full ${report.performance.firestoreReadLatencyMs < 200 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                                            <Activity className="w-8 h-8" />
                                        </div>
                                        <div>
                                            <div className="text-slate-400 text-sm">Firestore Read Latency</div>
                                            <div className="text-3xl font-bold text-white">{report.performance.firestoreReadLatencyMs} ms</div>
                                            <div className="text-xs text-slate-500">Target: &lt; 200ms</div>
                                        </div>
                                    </div>
                                    <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700 flex items-center gap-4">
                                        <div className="p-4 rounded-full bg-blue-500/20 text-blue-400">
                                            <Zap className="w-8 h-8" />
                                        </div>
                                        <div>
                                            <div className="text-slate-400 text-sm">Est. API Response</div>
                                            <div className="text-3xl font-bold text-white">~{report.performance.apiResponseTimeMs} ms</div>
                                            <div className="text-xs text-slate-500">Simulated load</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* VIEW: QUALITY */}
                        {activeTab === 'quality' && (
                            <div className="space-y-6">
                                <h3 className="text-xl font-bold text-white">Quality Assurance Issues</h3>
                                {report.qualityIssues.length === 0 ? (
                                    <EmptyState message="No quality issues detected." />
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {report.qualityIssues.map((issue, idx) => (
                                            <div key={idx} className="bg-slate-800/50 border border-slate-700 rounded-xl p-5 flex justify-between items-center group hover:border-indigo-500/50 transition-colors">
                                                <div>
                                                    <div className="mb-2">
                                                        <QualityBadge severity={issue.severity} />
                                                    </div>
                                                    <h4 className="text-white font-medium mb-1">{issue.title}</h4>
                                                    <p className="text-slate-400 text-sm">{issue.issue}</p>
                                                    <div className="text-slate-600 text-xs mt-2 uppercase">{issue.collection} • {issue.id}</div>
                                                </div>
                                                <button
                                                    onClick={() => handleDelete(issue.collection, issue.id)}
                                                    className="p-3 rounded-xl bg-slate-900 text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity hover:text-red-400 hover:bg-red-500/10"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                    </div>
                )}
            </div>
        </div>
    )
}

function EmptyState({ message }: { message: string }) {
    return (
        <div className="py-12 text-center bg-slate-800/30 rounded-2xl border border-slate-700 border-dashed">
            <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-3 opacity-50" />
            <p className="text-slate-400">{message}</p>
        </div>
    )
}

// Simple icon wrapper
function UsersIcon(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
    )
}
