import { CATEGORY_FORMS } from '@/config/category-forms'

export interface ImageAnalysis {
    qualityScore: number // 0-100
    isBlurry: boolean
    tags: string[]
    conditionScore: number // 0-100 (AI guess of item condition)
    detectedCategory?: string
}

export interface AIListingAnalysis {
    detectedCategoryId: string
    confidence: number
    extractedFields: Record<string, any>
    suggestedPrice: {
        min: number
        max: number
        avg: number
        confidence: number
        goodDealThreshold: number
    }
    issues: string[]
    description: string
    suggestedTags: string[]
    imageAnalysis: ImageAnalysis
}

// Mock AI Service - Image Analysis
export async function analyzeImageQuality(file: File): Promise<ImageAnalysis> {
    await new Promise(resolve => setTimeout(resolve, 800)) // Sim delay

    // Simulate random quality for demo
    const isBlurry = Math.random() > 0.9
    const qualityScore = isBlurry ? 45 : 85 + Math.floor(Math.random() * 15)

    // Simulate tags based on file name or random
    const mockTags = ['electronics', 'black', 'device', 'screen']

    return {
        qualityScore,
        isBlurry,
        tags: mockTags,
        conditionScore: 90
    }
}

// Mock AI Service - Full Scan
export async function analyzeListingImage(file: File, title: string): Promise<AIListingAnalysis> {
    // Simulate AI Latency
    await new Promise(resolve => setTimeout(resolve, 1500))

    // Heuristic Simulation based on inputs
    const lowerTitle = title.toLowerCase()
    const fileName = file.name.toLowerCase()

    let categoryId = '99' // Default to "Others"
    let mockTitle = title

    // 1. Detect Category Logic (Mock)
    if (lowerTitle) {
        if (lowerTitle.includes('iphone')) categoryId = '3' // Mobile
        else if (lowerTitle.includes('benz') || lowerTitle.includes('toyota') || lowerTitle.includes('honda')) categoryId = '1' // Automotive
        else if (lowerTitle.includes('รถ')) categoryId = '1'
        else if (lowerTitle.includes('nike') || lowerTitle.includes('dress') || lowerTitle.includes('shirt')) categoryId = '6' // Fashion
        else if (lowerTitle.includes('watch') || lowerTitle.includes('rolex') || lowerTitle.includes('seiko') || lowerTitle.includes('garmin')) categoryId = '6' // Fashion -> Watches
        else if (lowerTitle.includes('พระ') || lowerTitle.includes('amulet') || lowerTitle.includes('buddha')) categoryId = '9' // Amulets
    } else {
        // If no title, try to guess from filename
        if (fileName.includes('amulet') || fileName.includes('phra') || fileName.includes('hanuman')) {
            categoryId = '9'
            mockTitle = 'Premium Thai Amulet (AI Detected)'
        } else if (fileName.includes('car') || fileName.includes('auto')) {
            categoryId = '1'
            mockTitle = 'Automotive Item (AI Detected)'
        } else if (fileName.includes('phone') || fileName.includes('screen')) {
            categoryId = '3'
            mockTitle = 'Mobile Device (AI Detected)'
        } else if (fileName.includes('watch') || fileName.includes('clock') || fileName.includes('time')) {
            categoryId = '6'
            mockTitle = 'Wristwatch (AI Detected)'
        } else if (fileName.includes('camera') || fileName.includes('lens')) {
            categoryId = '8'
            mockTitle = 'Camera Equipment (AI Detected)'
        } else if (fileName.startsWith('uploaded_image') || fileName.startsWith('image')) {
            // [DEMO HACK] Priority for generic uploads -> Assume Watch for this demo scenario
            categoryId = '6'
            mockTitle = 'Seiko 5 Automatic Sport (AI Detected)'
        } else {
            // Smart Fallback: Use filename hash to pick a "Guess" to make demo feel "Alive"
            // instead of always "Misc"
            const hash = fileName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
            const guesses = [
                { id: '6', title: 'Fashion Item / Watch (AI Detected)' },
                { id: '8', title: 'Digital Camera (AI Detected)' },
                { id: '9', title: 'Sacred Object (AI Detected)' },
                { id: '7', title: 'Gaming Gadget (AI Detected)' },
                { id: '3', title: 'Mobile/Tablet (AI Detected)' }
            ]
            const selected = guesses[hash % guesses.length]
            categoryId = selected.id
            mockTitle = selected.title
        }
    }

    // 2. Extract Fields Logic (Mock NLP)
    const extracted: Record<string, any> = {
        title: mockTitle // Pass back the guessed title
    }

    if (categoryId === '3' && (mockTitle.toLowerCase().includes('iphone') || lowerTitle.includes('iphone'))) {
        extracted.brand = 'Apple'
        extracted.storage = '256gb'
    }

    if (categoryId === '6' && (mockTitle.toLowerCase().includes('watch'))) {
        extracted.brand = 'Generic'
        extracted.material = 'Stainless Steel'
    }

    // 3. Price Suggestion (Mock)
    let basePrice = 1000
    if (categoryId === '1') basePrice = 450000
    if (categoryId === '3') basePrice = 12000
    if (categoryId === '6') basePrice = 4500 // Watches
    if (categoryId === '8') basePrice = 15900 // Cameras
    if (categoryId === '9') basePrice = 2500 // Amulets range

    const suggestedPrice = {
        min: Math.floor(basePrice * 0.9),
        max: Math.floor(basePrice * 1.1),
        avg: basePrice,
        confidence: 0.75,
        goodDealThreshold: Math.floor(basePrice * 0.95)
    }

    // 4. Missing Info / Issues
    const issues = []
    if (!mockTitle || mockTitle.length < 5) issues.push('Please specify a product name for better reach')

    // 5. Image Analysis (Reuse or simplify)
    const imageAnalysis: ImageAnalysis = {
        qualityScore: 88,
        isBlurry: false,
        tags: ['object', 'item'],
        conditionScore: 90
    }

    return {
        detectedCategoryId: categoryId,
        confidence: 0.8,
        extractedFields: extracted,
        suggestedPrice,
        issues,
        description: `สินค้าสภาพดี พร้อมใช้งาน (AI Generated)\nสนใจสอบถามเพิ่มเติมได้ครับ`,
        suggestedTags: [...imageAnalysis.tags],
        imageAnalysis
    }
}

// ==========================================
// FEATURE: QUICK_SELL_AI_ASSISTANT
// ==========================================

export interface QuickSellInput {
    images: File[]
    manualTitle?: string
    manualDescription?: string
    manualPrice?: number
    currency?: string
    language?: 'th' | 'en'
}

export interface QuickSellOutput {
    category: {
        id: string
        name: string
        confidence: number
    }
    titles: string[]
    descriptions: {
        short: string
        standard: string
        detailed: string
    }
    price_suggestion: {
        quick_sell_price: number
        market_price: number
        max_profit_price: number
        price_tip: string
    }
    product_analysis: {
        type: string
        condition: string
        highlights: string[]
    }
    confidence_note: string
}

export async function quickSellAiAssistant(input: QuickSellInput): Promise<QuickSellOutput> {
    // Simulate AI Latency
    await new Promise(resolve => setTimeout(resolve, 2000))

    const lang = input.language || 'th'
    const hasManualTitle = !!input.manualTitle && input.manualTitle.length > 3

    // 1. Analyze Image (Mock)
    // In a real app, we would send the image to Vision API here.
    // For mock, we guess from manualTitle or fallback to random/hash logic
    let detectedType = 'General Item'
    let condition = 'Used - Good'

    // Simple Keyword Detection for Mocking
    const keywords = (input.manualTitle || '').toLowerCase()
    let categoryId = '99'
    let categoryName = 'Others'

    if (keywords.includes('iphone') || keywords.includes('phone')) {
        detectedType = 'Smartphone'
        categoryId = '3'
        categoryName = 'Mobiles & Tablets'
    } else if (keywords.includes('watch') || keywords.includes('rolex') || keywords.includes('seiko')) {
        detectedType = 'Luxury Watch'
        categoryId = '6'
        categoryName = 'Fashion / Watches'
    } else if (keywords.includes('car') || keywords.includes('honda') || keywords.includes('toyota')) {
        detectedType = 'Car'
        categoryId = '1'
        categoryName = 'Automotive'
    } else if (keywords.includes('camera') || keywords.includes('sony') || keywords.includes('canon')) {
        detectedType = 'Camera'
        categoryId = '8'
        categoryName = 'Cameras'
    } else if (keywords.includes('amulet') || keywords.includes('phra')) {
        detectedType = 'Thai Amulet'
        categoryId = '9'
        categoryName = 'Amulets'
    }

    // 2. Generate Titles
    let titles: string[] = []
    if (hasManualTitle) {
        // Enhance existing title
        titles = [
            input.manualTitle!, // Keep original
            `✨ ${input.manualTitle} (สภาพคัดเกรด)`,
            `🔥 [พร้อมส่ง] ${input.manualTitle} ของแท้ 100%`
        ]
    } else {
        // Generate new titles based on detected type
        if (detectedType === 'Smartphone') {
            titles = [
                'iPhone 13 Pro Max 256GB สี Sierra Blue สภาพนางฟ้า เครื่องศูนย์ไทย',
                'iPhone 13 Pro Max 256GB ครบกล่อง สุขภาพแบต 90%+',
                'ส่งต่อ iPhone 13 Pro Max 256GB (Blue) มือเดียว ใช้งานน้อยมาก'
            ]
        } else if (detectedType === 'Luxury Watch') {
            titles = [
                'Seiko 5 Sports Automatic หน้าปัดเขียว สภาพ 95% พร้อมกล่อง',
                'นาฬิกา Seiko 5 Auto Men\'s Watch สายแสตนเลส แท้ 100%',
                'Seiko 5 Sports (Used Good) รุ่นยอดนิยม หายาก'
            ]
        } else {
            // General Fallback
            titles = [
                'สินค้ามือสอง สภาพดี พร้อมใช้งาน ราคาคุ้มค่า',
                'ส่งต่อของสะสม สภาพสวย ดูแลอย่างดี',
                'สินค้าคุณภาพดี (Used Good Condition) พร้อมส่ง'
            ]
        }
    }

    // 3. Generate Descriptions
    const conditionText = lang === 'th' ? 'สภาพดี ใช้งานได้ปกติ' : 'Good condition, fully functional.'
    const highlightText = lang === 'th' ? 'ไม่มีรอยหนัก อุปกรณ์ครบ' : 'No heavy scratches, full accessories.'

    // Dynamic Description Generation
    const descShort = lang === 'th'
        ? `✅ ${detectedType} ${conditionText}\n✅ ${highlightText}\n🚀 พร้อมส่งทันที`
        : `✅ ${detectedType} ${conditionText}\n✅ ${highlightText}\n🚀 Ready to ship`

    const descStandard = lang === 'th'
        ? `✨ ขาย ${input.manualTitle || detectedType} \n\n📌 รายละเอียด:\n- ประเภท: ${detectedType}\n- สภาพ: ${conditionText}\n- จุดเด่น: ${highlightText}\n\n📦 สิ่งที่จะได้รับ:\n- ตัวสินค้า\n- กล่องและอุปกรณ์ครบ\n\n💬 สนใจทักแชทสอบถามได้เลยครับ ยินดีถ่ายรูปเพิ่มเติม`
        : `✨ Selling ${input.manualTitle || detectedType} \n\n📌 Details:\n- Type: ${detectedType}\n- Condition: ${conditionText}\n- Highlights: ${highlightText}\n\n📦 What's included:\n- Main unit\n- Box and accessories\n\n💬 Chat for more info!`

    const descDetailed = lang === 'th'
        ? `🔥 ขออนุญาตส่งต่อครับ ${input.manualTitle || detectedType}\n\n📝 ข้อมูลสินค้า:\n- สินค้า: ${detectedType} มือสอง\n- สภาพภายนอก: 95% ${highlightText}\n- การใช้งาน: 100% เต็มระบบ ไม่ติดปัญหาใดๆ\n- ประวัติ: ซื้อมาใช้เอง มือเดียว\n\n🔎 ตำหนิ: รอยขนแมวบางๆ ตามการใช้งานทั่วไป (ดูจากรูป)\n\n💰 เหตุผลที่ขาย: เปลี่ยนรุ่นใหม่\n\n✅ นัดรับได้ที่: BKK / แนวรถไฟฟ้า\n✅ จัดส่ง: Kerry / Flash (+50 บาท)\n\nสนใจสอบถาม/ต่อรองราคาได้ครับ พ่อค้าใจดี 😊`
        : `🔥 WTS ${input.manualTitle || detectedType}\n\n📝 Specs:\n- Item: Used ${detectedType}\n- Cosmetic: 95% ${highlightText}\n- Function: 100% Working perfectly\n- History: Personal use, 1st owner\n\n🔎 Defects: Minor hairline scratches (see photos)\n\n💰 Reason: Upgrading\n\n✅ Pickup: BTS/MRT lines\n✅ Shipping: Available (+Cost)\n\nDM for details! 😊`

    // 4. Price Analysis
    let basePrice = 0
    // Mock base prices
    if (detectedType === 'Smartphone') basePrice = 18000
    else if (detectedType === 'Luxury Watch') basePrice = 6500
    else if (detectedType === 'Car') basePrice = 350000
    else if (detectedType === 'Camera') basePrice = 22000
    else if (detectedType === 'Thai Amulet') basePrice = 3000
    else basePrice = 1000

    // Randomize slightly
    basePrice = basePrice * (0.9 + Math.random() * 0.2)
    basePrice = Math.floor(basePrice / 100) * 100 // Round

    const quickSell = Math.floor(basePrice * 0.85)
    const marketPrice = Math.floor(basePrice)
    const maxProfit = Math.floor(basePrice * 1.15)

    // 5. Build Response
    return {
        category: {
            id: categoryId,
            name: categoryName,
            confidence: 0.85
        },
        titles: titles,
        descriptions: {
            short: descShort,
            standard: descStandard,
            detailed: descDetailed
        },
        price_suggestion: {
            quick_sell_price: quickSell,
            market_price: marketPrice,
            max_profit_price: maxProfit,
            price_tip: lang === 'th'
                ? `💡 ขายไวที่ ฿${quickSell.toLocaleString()} หรือตั้ง ฿${marketPrice.toLocaleString()} เพื่อกำไรที่ดีกว่า`
                : `💡 Quick sell at ฿${quickSell.toLocaleString()} or aim for ฿${marketPrice.toLocaleString()} for better margin.`
        },
        product_analysis: {
            type: detectedType,
            condition: condition,
            highlights: ['Clean background', 'Good lighting', 'Clear details']
        },
        confidence_note: lang === 'th'
            ? `📸 รูปสวยมากครับ! เพิ่มโอกาสขายได้ +20% ข้อมูลครบถ้วนพร้อมโพสเลย`
            : `📸 Great photos! Sales chance +20%. Ready to post.`
    }
}
