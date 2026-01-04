'use client'

/**
 * DATA MIGRATION PAGE
 * 
 * Admin tool to fix orphaned listings by creating placeholder users
 */

import { useState } from 'react'
import { migrateOrphanedListings, verifyMigration, type MigrationResult } from '@/services/migrate-orphaned-listings'
import { Shield, Play, CheckCircle, XCircle, Loader2, RefreshCw } from 'lucide-react'

export default function AdminDataMigrationPage() {
    const [running, setRunning] = useState(false)
    const [verifying, setVerifying] = useState(false)
    const [result, setResult] = useState<MigrationResult | null>(null)
    const [verified, setVerified] = useState<{ allSellersExist: boolean, details: any[] } | null>(null)

    const handleMigrate = async () => {
        if (!confirm('⚠️ คุณแน่ใจหรือไม่?\n\nการ Migration นี้จะสร้าง placeholder users สำหรับ seller IDs ที่หายไป\n\nกด OK เพื่อดำเนินการต่อ')) {
            return
        }

        setRunning(true)
        setResult(null)

        try {
            console.log('🚀 Starting migration...')
            const migrationResult = await migrateOrphanedListings()
            setResult(migrationResult)
            console.log('✅ Migration complete!')
        } catch (error) {
            console.error('❌ Migration failed:', error)
            alert('เกิดข้อผิดพลาดในการ migrate กรุณาตรวจสอบ console')
        } finally {
            setRunning(false)
        }
    }

    const handleVerify = async () => {
        setVerifying(true)
        setVerified(null)

        try {
            const verifyResult = await verifyMigration()
            setVerified(verifyResult)
        } catch (error) {
            console.error('❌ Verification failed:', error)
        } finally {
            setVerifying(false)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 p-6">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="flex items-center gap-3 mb-8">
                    <Shield className="w-10 h-10 text-purple-400" />
                    <div>
                        <h1 className="text-3xl font-bold text-white">Data Migration</h1>
                        <p className="text-gray-400">Fix orphaned listings by creating placeholder users</p>
                    </div>
                </div>

                {/* Warning Box */}
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-6 mb-6">
                    <h3 className="text-lg font-bold text-yellow-300 mb-2">⚠️ Important Information</h3>
                    <div className="text-sm text-yellow-200 space-y-2">
                        <p>This migration will create **placeholder user documents** for the following orphaned seller IDs:</p>
                        <ul className="list-disc list-inside ml-4 space-y-1">
                            <li><code className="bg-black/30 px-2 py-0.5 rounded">QSNb9fGPr5dFaBUiKMBAhJT7kFs2</code> - 7 listings</li>
                            <li><code className="bg-black/30 px-2 py-0.5 rounded">seed_seller_002</code> - 1 listing</li>
                            <li><code className="bg-black/30 px-2 py-0.5 rounded">7iHeSD9GY6StvbxiJdwtDpbLcAA3</code> - 1 listing</li>
                        </ul>
                        <p className="mt-3">✅ This will fix **9 orphaned listings** total</p>
                        <p>✅ Shop pages will no longer crash for these sellers</p>
                        <p>✅ Anonymous Seller badges will still show (trust score = 0)</p>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 mb-6">
                    <button
                        onClick={handleMigrate}
                        disabled={running}
                        className="flex-1 flex items-center justify-center gap-3 px-6 py-4 bg-purple-500 hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl text-white font-medium transition-colors"
                    >
                        {running ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Running Migration...
                            </>
                        ) : (
                            <>
                                <Play className="w-5 h-5" />
                                Run Migration
                            </>
                        )}
                    </button>

                    <button
                        onClick={handleVerify}
                        disabled={verifying}
                        className="flex items-center gap-2 px-6 py-4 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 rounded-xl text-white font-medium transition-colors"
                    >
                        {verifying ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <RefreshCw className="w-5 h-5" />
                        )}
                        Verify
                    </button>
                </div>

                {/* Migration Result */}
                {result && (
                    <div className={`rounded-xl p-6 mb-6 border ${result.success
                            ? 'bg-green-500/10 border-green-500/30'
                            : 'bg-red-500/10 border-red-500/30'
                        }`}>
                        <div className="flex items-start gap-3 mb-4">
                            {result.success ? (
                                <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0" />
                            ) : (
                                <XCircle className="w-6 h-6 text-red-400 flex-shrink-0" />
                            )}
                            <div>
                                <h3 className={`text-lg font-bold mb-1 ${result.success ? 'text-green-300' : 'text-red-300'}`}>
                                    {result.success ? '✅ Migration Successful!' : '⚠️ Migration Completed with Errors'}
                                </h3>
                                <div className="grid grid-cols-3 gap-4 mt-3">
                                    <div className="bg-black/20 rounded-lg p-3">
                                        <div className="text-sm text-gray-400">Sellers Processed</div>
                                        <div className="text-2xl font-bold text-white">{result.sellersProcessed}</div>
                                    </div>
                                    <div className="bg-black/20 rounded-lg p-3">
                                        <div className="text-sm text-gray-400">Listings Fixed</div>
                                        <div className="text-2xl font-bold text-white">{result.listingsFixed}</div>
                                    </div>
                                    <div className="bg-black/20 rounded-lg p-3">
                                        <div className="text-sm text-gray-400">Errors</div>
                                        <div className="text-2xl font-bold text-white">{result.errors.length}</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Logs */}
                        <details className="mt-4">
                            <summary className="cursor-pointer text-sm text-gray-400 hover:text-gray-300">
                                View detailed logs ({result.log.length} lines)
                            </summary>
                            <pre className="mt-2 p-4 bg-black/30 rounded-lg text-xs text-gray-300 overflow-x-auto max-h-96 overflow-y-auto">
                                {result.log.join('\n')}
                            </pre>
                        </details>
                    </div>
                )}

                {/* Verification Result */}
                {verified && (
                    <div className={`rounded-xl p-6 border ${verified.allSellersExist
                            ? 'bg-green-500/10 border-green-500/30'
                            : 'bg-yellow-500/10 border-yellow-500/30'
                        }`}>
                        <div className="flex items-start gap-3">
                            {verified.allSellersExist ? (
                                <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0" />
                            ) : (
                                <XCircle className="w-6 h-6 text-yellow-400 flex-shrink-0" />
                            )}
                            <div>
                                <h3 className={`text-lg font-bold mb-3 ${verified.allSellersExist ? 'text-green-300' : 'text-yellow-300'}`}>
                                    {verified.allSellersExist ? '✅ All Sellers Verified!' : '⚠️ Some Sellers Missing'}
                                </h3>
                                <div className="space-y-2">
                                    {verified.details.map((detail, index) => (
                                        <div key={index} className="flex items-center gap-2 text-sm">
                                            {detail.exists ? (
                                                <CheckCircle className="w-4 h-4 text-green-400" />
                                            ) : (
                                                <XCircle className="w-4 h-4 text-red-400" />
                                            )}
                                            <code className="bg-black/30 px-2 py-0.5 rounded font-mono text-xs">
                                                {detail.seller_id}
                                            </code>
                                            <span className={detail.exists ? 'text-green-300' : 'text-red-300'}>
                                                {detail.exists ? 'EXISTS' : 'MISSING'}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Instructions */}
                <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
                    <h3 className="text-lg font-bold text-white mb-3">📋 Instructions</h3>
                    <ol className="list-decimal list-inside space-y-2 text-sm text-gray-300">
                        <li>Click **"Run Migration"** to create placeholder users</li>
                        <li>Wait for the process to complete (usually 5-10 seconds)</li>
                        <li>Click **"Verify"** to confirm all sellers now exist</li>
                        <li>Visit affected shop pages to verify they load correctly</li>
                        <li>Check that Anonymous Seller badges are displayed</li>
                    </ol>

                    <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                        <div className="flex items-start gap-2">
                            <Shield className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                            <p className="text-xs text-blue-300">
                                **Note:** Placeholder users are marked with `isPlaceholder: true` and have 0 trust score.
                                Shop pages will show Anonymous Seller warnings for these users.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
