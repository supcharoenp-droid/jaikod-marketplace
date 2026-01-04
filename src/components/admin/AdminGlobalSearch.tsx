'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Search, Loader2, User, Package, ShoppingCart, FileText } from 'lucide-react'
import { db } from '@/lib/firebase'
import { collection, query, where, getDocs, limit, doc, getDoc } from 'firebase/firestore'

// Simple interface for search results
interface SearchResult {
    id: string
    type: 'user' | 'listing' | 'product' | 'order'
    title: string
    subtitle: string
    url: string
}

export default function AdminGlobalSearch() {
    const router = useRouter()
    const [searchTerm, setSearchTerm] = useState('')
    const [results, setResults] = useState<SearchResult[]>([])
    const [loading, setLoading] = useState(false)
    const [showResults, setShowResults] = useState(false)
    const searchRef = useRef<HTMLDivElement>(null)

    // Close results when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setShowResults(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (searchTerm.length > 2) {
                performSearch(searchTerm)
            } else {
                setResults([])
            }
        }, 500)

        return () => clearTimeout(delayDebounceFn)
    }, [searchTerm])

    const performSearch = async (term: string) => {
        setLoading(true)
        const combinedResults: SearchResult[] = []
        const lowerTerm = term.toLowerCase()

        try {
            // 1. Check exact ID match first (Fastest)
            // Users
            const userDoc = await getDoc(doc(db, 'users', term))
            if (userDoc.exists()) {
                const data = userDoc.data()
                combinedResults.push({
                    id: userDoc.id,
                    type: 'user',
                    title: data.displayName || 'Unknown User',
                    subtitle: data.email || userDoc.id,
                    url: `/admin/users?search=${userDoc.id}` // Ideally navigate to detail
                })
            }

            // Listings
            if (combinedResults.length === 0) {
                const listingDoc = await getDoc(doc(db, 'listings', term))
                if (listingDoc.exists()) {
                    const data = listingDoc.data()
                    combinedResults.push({
                        id: listingDoc.id,
                        type: 'listing',
                        title: data.title || 'Untitled Listing',
                        subtitle: `Price: ${data.price}`,
                        url: `/admin/data-audit?search=${listingDoc.id}` // Navigate to audit or detail
                    })
                }
            }

            // 2. Search by Name/Email if no exact ID match or just always search
            // Note: Firestore doesn't do substring search easily.
            // We'll use startAt/endAt or just simple '==' for exact matches in strict mode, 
            // but for this "Global Search" we might just rely on exact ID or specific indexed fields.
            // For MVP, we simulated "client side" filtering if we had a dedicated search service (like Algolia).
            // Here we'll just try to find by 'email' for users and 'title' (exact) or simple prefix.

            // Search Users by Email
            const usersQ = query(collection(db, 'users'), where('email', '>=', lowerTerm), where('email', '<=', lowerTerm + '\uf8ff'), limit(3))
            const usersSnap = await getDocs(usersQ)
            usersSnap.forEach(d => {
                const data = d.data()
                if (!combinedResults.find(r => r.id === d.id)) {
                    combinedResults.push({
                        id: d.id,
                        type: 'user',
                        title: data.displayName || 'User',
                        subtitle: data.email,
                        url: `/admin/users?q=${data.email}`
                    })
                }
            })

            // Search Orders by ID prefix (often manually typed)
            // Assuming we store order_number or just use ID
            if (term.startsWith('ORD') || !isNaN(Number(term))) {
                // Mocking order search logic or simple ID check
            }

        } catch (error) {
            console.error(error)
        }

        setResults(combinedResults)
        setShowResults(true)
        setLoading(false)
    }

    const handleSelect = (result: SearchResult) => {
        setSearchTerm('')
        setShowResults(false)
        router.push(result.url)
    }

    const getIcon = (type: string) => {
        switch (type) {
            case 'user': return <User className="w-4 h-4 text-blue-500" />
            case 'listing': return <Package className="w-4 h-4 text-purple-500" />
            case 'order': return <ShoppingCart className="w-4 h-4 text-orange-500" />
            default: return <FileText className="w-4 h-4 text-gray-500" />
        }
    }

    return (
        <div className="relative hidden md:block w-64 lg:w-96" ref={searchRef}>
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
                type="text"
                placeholder="Search ID, Email, or Name..."
                className="pl-10 pr-4 py-2 w-full border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                value={searchTerm}
                onChange={(e) => {
                    setSearchTerm(e.target.value)
                    if (e.target.value.length === 0) setShowResults(false)
                }}
                onFocus={() => {
                    if (results.length > 0) setShowResults(true)
                }}
            />

            {/* Results Dropdown */}
            {showResults && (searchTerm.length > 2) && (
                <div className="absolute top-full mt-2 w-full bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden z-50">
                    {loading ? (
                        <div className="p-4 text-center text-gray-400 flex items-center justify-center gap-2">
                            <Loader2 className="w-4 h-4 animate-spin" /> Searching...
                        </div>
                    ) : results.length > 0 ? (
                        <div className="py-2">
                            <div className="px-3 py-1 text-[10px] uppercase font-bold text-gray-400 tracking-wider">Top Results</div>
                            {results.map(result => (
                                <button
                                    key={`${result.type}-${result.id}`}
                                    onClick={() => handleSelect(result)}
                                    className="w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 flex items-center gap-3 transition-colors"
                                >
                                    <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                                        {getIcon(result.type)}
                                    </div>
                                    <div>
                                        <div className="font-medium text-sm text-gray-900 dark:text-white line-clamp-1">{result.title}</div>
                                        <div className="text-xs text-gray-500 font-mono line-clamp-1">{result.type} • {result.subtitle}</div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    ) : (
                        <div className="p-4 text-center text-gray-500 text-sm">
                            No results found for "{searchTerm}"
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
