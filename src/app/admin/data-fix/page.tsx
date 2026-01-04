'use client'

import React, { useState, useEffect } from 'react'
import { collection, getDocs, doc, setDoc, query, where } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { useAuth } from '@/contexts/AuthContext'
import { Loader2, AlertTriangle, CheckCircle, Database, UserPlus, ShieldAlert } from 'lucide-react'

interface OrphanedItem {
    id: string
    title: string
    sellerId: string
    collection: 'listings' | 'products'
}

interface MissingSeller {
    id: string
    count: number
    sampleName: string
}

export default function DataFixPage() {
    const { user } = useAuth()
    const [loading, setLoading] = useState(false)
    const [step, setStep] = useState<'idle' | 'scanning' | 'ready' | 'fixing' | 'done'>('idle')
    const [orphans, setOrphans] = useState<OrphanedItem[]>([])
    const [missingSellers, setMissingSellers] = useState<MissingSeller[]>([])
    const [logs, setLogs] = useState<string[]>([])

    const addLog = (msg: string) => setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${msg}`])

    const scanData = async () => {
        if (!user) {
            alert('Please login first')
            return
        }

        setLoading(true)
        setStep('scanning')
        setLogs([])
        addLog('Starting scan...')

        try {
            // 1. Fetch all users IDs
            addLog('Fetching users...')
            const usersSnap = await getDocs(collection(db, 'users'))
            const userIds = new Set<string>()
            usersSnap.forEach(doc => userIds.add(doc.id))
            addLog(`Found ${userIds.size} existing users.`)

            // 2. Scan Listings
            addLog('Scanning listings...')
            const listingsSnap = await getDocs(collection(db, 'listings'))
            const tempOrphans: OrphanedItem[] = []

            listingsSnap.forEach(doc => {
                const data = doc.data()
                const sid = data.seller_id
                if (sid && !userIds.has(sid)) {
                    tempOrphans.push({
                        id: doc.id,
                        title: data.title || 'Untitled',
                        sellerId: sid,
                        collection: 'listings'
                    })
                }
            })

            // 3. Scan Products
            addLog('Scanning products...')
            const productsSnap = await getDocs(collection(db, 'products'))

            productsSnap.forEach(doc => {
                const data = doc.data()
                const sid = data.seller_id || data.sellerId
                if (sid && !userIds.has(sid)) {
                    tempOrphans.push({
                        id: doc.id,
                        title: data.title || data.name || 'Untitled',
                        sellerId: sid,
                        collection: 'products'
                    })
                }
            })

            setOrphans(tempOrphans)
            addLog(`Found ${tempOrphans.length} orphaned items.`)

            // Group by seller
            const sellerMap = new Map<string, { count: number, name: string }>()
            tempOrphans.forEach(item => {
                const current = sellerMap.get(item.sellerId) || { count: 0, name: 'Unknown' }
                sellerMap.set(item.sellerId, {
                    count: current.count + 1,
                    // Try to guess name? For now just use 'Restored User'
                    name: `Restored Seller (${item.sellerId.slice(0, 4)})`
                })
            })

            const missingList = Array.from(sellerMap.entries()).map(([id, data]) => ({
                id,
                count: data.count,
                sampleName: data.name
            }))

            setMissingSellers(missingList)
            setStep('ready')

        } catch (error) {
            console.error(error)
            addLog(`Error: ${(error as Error).message}`)
        } finally {
            setLoading(false)
        }
    }

    const fixOrphans = async () => {
        setLoading(true)
        setStep('fixing')
        addLog(`Creating ${missingSellers.length} placeholder users...`)

        try {
            let successCount = 0
            for (const seller of missingSellers) {
                try {
                    await setDoc(doc(db, 'users', seller.id), {
                        uid: seller.id,
                        displayName: seller.sampleName,
                        email: `restored_${seller.id.slice(0, 8)}@example.com`,
                        photoURL: null,
                        role: 'user',
                        isVerified: false,
                        trustScore: 50,
                        createdAt: new Date(),
                        isActive: true,
                        isPlaceholder: true // Important for Security Rules
                    })
                    successCount++
                    addLog(`Created user: ${seller.id}`)
                } catch (err) {
                    addLog(`Failed to create ${seller.id}: ${(err as Error).message}`)
                }
            }
            addLog(`Successfully restored ${successCount} users.`)
            setStep('done')
        } catch (error) {
            addLog(`Fatal Error: ${(error as Error).message}`)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 pt-20 px-4 pb-12">
            <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                <div className="bg-purple-600 p-6 text-white flex items-center gap-4">
                    <Database className="w-8 h-8" />
                    <div>
                        <h1 className="text-2xl font-bold">Data Integrity Fix Tool</h1>
                        <p className="opacity-80 text-sm">Scan and fix orphaned listings (Missing Sellers)</p>
                    </div>
                </div>

                <div className="p-6">
                    {/* Status Box */}
                    <div className="mb-8 p-4 bg-blue-50 text-blue-800 rounded-xl border border-blue-100">
                        <h3 className="font-bold flex items-center gap-2 mb-2">
                            <ShieldAlert className="w-5 h-5" />
                            Current Status
                        </h3>
                        <p className="text-sm opacity-80 mb-4">
                            This tool will scan all listings and check if their "seller_id" exists in the "users" collection.
                            If missing, it will create a "Placeholder User" to fix the Shop Page and Chat crashes.
                        </p>

                        {!user ? (
                            <div className="bg-red-100 text-red-700 p-3 rounded-lg text-sm font-bold text-center">
                                Please Login to use this tool
                            </div>
                        ) : (
                            <div className="flex gap-3">
                                <button
                                    onClick={scanData}
                                    disabled={loading || step === 'fixing'}
                                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold transition-colors disabled:opacity-50 flex items-center gap-2"
                                >
                                    {loading && step === 'scanning' ? <Loader2 className="animate-spin w-4 h-4" /> : <Database className="w-4 h-4" />}
                                    Scan Database
                                </button>

                                {missingSellers.length > 0 && step === 'ready' && (
                                    <button
                                        onClick={fixOrphans}
                                        disabled={loading}
                                        className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-bold transition-colors disabled:opacity-50 flex items-center gap-2"
                                    >
                                        <UserPlus className="w-4 h-4" />
                                        Restore {missingSellers.length} Users
                                    </button>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Results Area */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        {/* Stats */}
                        <div className="border border-gray-200 rounded-xl p-4">
                            <h3 className="font-bold text-gray-700 mb-4">Scan Results</h3>
                            <div className="space-y-2">
                                <div className="flex justify-between p-2 bg-gray-50 rounded">
                                    <span className="text-gray-500">Orphaned Items</span>
                                    <span className="font-bold text-gray-900">{orphans.length}</span>
                                </div>
                                <div className="flex justify-between p-2 bg-gray-50 rounded">
                                    <span className="text-gray-500">Missing Seller Accounts</span>
                                    <span className="font-bold text-red-600">{missingSellers.length}</span>
                                </div>
                            </div>
                        </div>

                        {/* Logs */}
                        <div className="border border-gray-200 rounded-xl p-4 bg-gray-900 text-green-400 font-mono text-xs h-64 overflow-y-auto">
                            {logs.length === 0 && <span className="opacity-50">{`// Ready to scan...`}</span>}
                            {logs.map((log, i) => (
                                <div key={i} className="mb-1">{log}</div>
                            ))}
                        </div>
                    </div>

                    {/* Missing Sellers List */}
                    {missingSellers.length > 0 && (
                        <div className="mt-8">
                            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                                <AlertTriangle className="w-5 h-5 text-amber-500" />
                                Missing Sellers Found
                            </h3>
                            <div className="border border-gray-200 rounded-xl overflow-hidden max-h-80 overflow-y-auto">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-200">
                                        <tr>
                                            <th className="p-3">Seller ID</th>
                                            <th className="p-3">Orphaned Items</th>
                                            <th className="p-3">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {missingSellers.map((s) => (
                                            <tr key={s.id} className="hover:bg-gray-50">
                                                <td className="p-3 font-mono text-xs">{s.id}</td>
                                                <td className="p-3">{s.count}</td>
                                                <td className="p-3">
                                                    {step === 'done' ? (
                                                        <span className="text-green-600 flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Restored</span>
                                                    ) : (
                                                        <span className="text-red-500">Missing</span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
