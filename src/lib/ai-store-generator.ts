import { db } from '@/lib/firebase'
import { collection, query, where, getDocs, limit } from 'firebase/firestore'

export interface StoreNameGeneratorInput {
    keywords: string
    category: string
    style: 'modern' | 'minimal' | 'premium' | 'fun' | 'friendly'
}

export interface GeneratedStoreName {
    name: string
    meaning: string
    language: 'en' | 'th'
    score?: number
}

// Mock AI Logic to generate store names
export async function generateStoreNames(input: StoreNameGeneratorInput): Promise<GeneratedStoreName[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500))

    const { keywords, category, style } = input
    const baseNames: GeneratedStoreName[] = []

    // Helper to mix keywords with style
    const getPrefix = (s: string) => {
        if (s === 'modern') return ['Neo', 'The', 'Urban', 'Nova', 'Pro']
        if (s === 'minimal') return ['Simply', 'Pure', 'Mono', 'Just', 'Basic']
        if (s === 'premium') return ['Royal', 'Elite', 'Prime', 'Gold', 'Lux']
        if (s === 'fun') return ['Happy', 'Joy', 'Funky', 'Pop', 'Smile']
        return ['My', 'Our', 'Friendly', 'Home', 'Good']
    }

    const getSuffix = (s: string) => {
        if (s === 'modern') return ['Hub', 'Lab', 'Zone', 'Tech', 'X']
        if (s === 'minimal') return ['Co', 'Space', 'Room', 'Dot', 'Box']
        if (s === 'premium') return ['Select', 'Gallery', 'Collection', 'Studio', 'Club']
        if (s === 'fun') return ['Market', 'Shop', 'Store', 'Land', 'World']
        return ['Place', 'Corner', 'Spot', 'House', 'Station']
    }

    const prefixes = getPrefix(style)
    const suffixes = getSuffix(style)

    // Generate English Names
    for (let i = 0; i < 3; i++) {
        const p = prefixes[Math.floor(Math.random() * prefixes.length)]
        const s = suffixes[Math.floor(Math.random() * suffixes.length)]
        const kw = keywords.split(' ')[0] || 'Store'

        baseNames.push({
            name: `${p} ${kw} ${s}`,
            meaning: `A ${style} name incorporating '${kw}'`,
            language: 'en',
            score: Math.floor(Math.random() * 20) + 80 // 80-100
        })
    }

    // Generate Thai Names (Mock logic for demonstration)
    const thPrefixes = ['ร้าน', 'บ้าน', 'มุม', 'ศูนย์', 'คลับ']
    const thSuffixes = ['ถูกดี', 'พรีเมียม', 'สเตชั่น', 'ออนไลน์', 'ช็อป']

    for (let i = 0; i < 3; i++) {
        const p = thPrefixes[Math.floor(Math.random() * thPrefixes.length)]
        const s = thSuffixes[Math.floor(Math.random() * thSuffixes.length)]
        const kw = keywords || 'สินค้า'

        baseNames.push({
            name: `${p}${kw}${s}`,
            meaning: `ชื่อไทยสไตล์${style} จำง่าย`,
            language: 'th',
            score: Math.floor(Math.random() * 20) + 80
        })
    }

    return baseNames
}

// Beautify / Refine Name
export async function beautifyStoreName(currentName: string): Promise<GeneratedStoreName> {
    await new Promise(resolve => setTimeout(resolve, 1000))
    // Simple logic: Capitalize / Remove extra spaces / Add "Official" if short
    let refined = currentName.trim().replace(/\s+/g, ' ')

    // Capitalize first letters of output
    refined = refined.split(' ').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ')

    return {
        name: refined,
        meaning: 'Adjusted for better readability and professionalism',
        language: 'en', // Default assumption
        score: 90
    }
}

// Validation Service
export async function validateStoreName(name: string): Promise<{
    isValid: boolean
    error?: string
    seoScore: number
}> {
    if (!name || name.length < 3) {
        return { isValid: false, seoScore: 0, error: 'Name too short (min 3 chars)' }
    }

    if (name.length > 30) {
        return { isValid: false, seoScore: 0, error: 'Name too long (max 30 chars)' }
    }

    // Check prohibited words (Mock)
    const prohibited = ['admin', 'jaikod', 'system', 'root', 'support']
    if (prohibited.some(p => name.toLowerCase().includes(p))) {
        return { isValid: false, seoScore: 0, error: 'Contains restricted words' }
    }

    // Check duplicate in Firestore
    try {
        const sellersRef = collection(db, 'sellers')
        const q = query(sellersRef, where('shop_name', '==', name), limit(1))
        const snapshot = await getDocs(q)

        if (!snapshot.empty) {
            return { isValid: false, seoScore: 0, error: 'Shop name already taken' }
        }
    } catch (e) {
        console.error('Validation check failed', e)
        // For development safety, allow if check fails or handle as error
    }

    // Calculate Mock SEO Score
    let score = 70
    if (name.length >= 5 && name.length <= 15) score += 10
    if (/^[A-Za-z0-9 ]+$/.test(name)) score += 10 // Alphanumeric preferred for URL
    if (name.split(' ').length <= 3) score += 10 // Short word count

    return { isValid: true, seoScore: score }
}
