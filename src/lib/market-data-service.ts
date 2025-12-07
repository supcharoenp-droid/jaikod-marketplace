/**
 * Market Data Service
 * ระบบรวบรวมและอัพเดทข้อมูลราคาตลาดอัตโนมัติ
 */

export interface MarketDataPoint {
    productId?: string;
    categoryId: string;
    brand: string;
    model: string;
    condition: string;
    soldPrice: number;
    listedPrice: number;
    soldDate: Date;
    source: 'internal' | 'external_api' | 'web_scraping';
    location?: string;
}

export interface MarketTrend {
    categoryId: string;
    brand?: string;
    model?: string;
    averagePrice: number;
    medianPrice: number;
    priceRange: {
        min: number;
        max: number;
        percentile25: number;
        percentile75: number;
    };
    totalListings: number;
    soldInLast30Days: number;
    priceChange30Days: number; // % เปลี่ยนแปลงใน 30 วัน
    priceChange90Days: number; // % เปลี่ยนแปลงใน 90 วัน
    demandScore: number; // 0-100
    lastUpdated: Date;
}

export interface DepreciationRate {
    categoryId: string;
    brand?: string;
    yearlyRate: number; // % ต่อปี
    monthlyRate: number; // % ต่อเดือน
    accelerationFactor: number; // ความเร็วในการเสื่อมราคา (1.0 = ปกติ, >1.0 = เร็วกว่าปกติ)
    lastUpdated: Date;
}

// ========================================
// 1. ดึงข้อมูลจากแหล่งต่างๆ
// ========================================

/**
 * ดึงข้อมูลจากระบบภายใน (Firestore)
 */
export async function fetchInternalMarketData(
    categoryId: string,
    brand?: string,
    model?: string
): Promise<MarketDataPoint[]> {
    // TODO: Implement Firestore query
    // Query products ที่ขายไปแล้วใน 90 วันที่ผ่านมา

    // ตัวอย่าง:
    // const db = getFirestore();
    // const productsRef = collection(db, 'products');
    // const q = query(
    //     productsRef,
    //     where('categoryId', '==', categoryId),
    //     where('status', '==', 'sold'),
    //     where('soldDate', '>=', new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)),
    //     orderBy('soldDate', 'desc')
    // );

    return [];
}

/**
 * ดึงข้อมูลจาก External APIs (Kaidee, Mercari, etc.)
 */
export async function fetchExternalMarketData(
    categoryId: string,
    brand?: string,
    model?: string
): Promise<MarketDataPoint[]> {
    // TODO: Implement API calls to external sources
    // - Kaidee API (ถ้ามี)
    // - Mercari API
    // - Facebook Marketplace API

    return [];
}

/**
 * ดึงข้อมูลจาก Web Scraping (ระมัดระวังเรื่อง Legal)
 */
export async function fetchScrapedMarketData(
    categoryId: string,
    brand?: string,
    model?: string
): Promise<MarketDataPoint[]> {
    // TODO: Implement web scraping
    // ⚠️ ต้องตรวจสอบ Terms of Service ของเว็บไซต์เป้าหมาย

    return [];
}

// ========================================
// 2. คำนวณ Market Trends
// ========================================

/**
 * คำนวณแนวโน้มตลาดจากข้อมูลที่รวบรวม
 */
export function calculateMarketTrend(dataPoints: MarketDataPoint[]): MarketTrend | null {
    if (dataPoints.length === 0) return null;

    // คำนวณราคาเฉลี่ย
    const prices = dataPoints.map(d => d.soldPrice || d.listedPrice);
    const averagePrice = prices.reduce((sum, p) => sum + p, 0) / prices.length;

    // คำนวณ Median
    const sortedPrices = [...prices].sort((a, b) => a - b);
    const medianPrice = sortedPrices[Math.floor(sortedPrices.length / 2)];

    // คำนวณ Percentiles
    const percentile25 = sortedPrices[Math.floor(sortedPrices.length * 0.25)];
    const percentile75 = sortedPrices[Math.floor(sortedPrices.length * 0.75)];

    // คำนวณการเปลี่ยนแปลงราคา
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const ninetyDaysAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);

    const recent30Days = dataPoints.filter(d => d.soldDate >= thirtyDaysAgo);
    const recent90Days = dataPoints.filter(d => d.soldDate >= ninetyDaysAgo);

    const avg30Days = recent30Days.length > 0
        ? recent30Days.reduce((sum, d) => sum + (d.soldPrice || d.listedPrice), 0) / recent30Days.length
        : averagePrice;

    const avg90Days = recent90Days.length > 0
        ? recent90Days.reduce((sum, d) => sum + (d.soldPrice || d.listedPrice), 0) / recent90Days.length
        : averagePrice;

    const priceChange30Days = ((avg30Days - averagePrice) / averagePrice) * 100;
    const priceChange90Days = ((avg90Days - averagePrice) / averagePrice) * 100;

    // คำนวณ Demand Score (ความต้องการในตลาด)
    const soldCount = dataPoints.filter(d => d.soldPrice > 0).length;
    const demandScore = Math.min(100, (soldCount / dataPoints.length) * 100);

    return {
        categoryId: dataPoints[0].categoryId,
        brand: dataPoints[0].brand,
        model: dataPoints[0].model,
        averagePrice,
        medianPrice,
        priceRange: {
            min: Math.min(...prices),
            max: Math.max(...prices),
            percentile25,
            percentile75
        },
        totalListings: dataPoints.length,
        soldInLast30Days: recent30Days.filter(d => d.soldPrice > 0).length,
        priceChange30Days,
        priceChange90Days,
        demandScore,
        lastUpdated: new Date()
    };
}

// ========================================
// 3. คำนวณ Depreciation Rate (อัตราการเสื่อมราคา)
// ========================================

/**
 * คำนวณอัตราการเสื่อมราคาจากข้อมูลจริง
 */
export function calculateDepreciationRate(
    categoryId: string,
    dataPoints: MarketDataPoint[]
): DepreciationRate {
    // Default rates ตามประเภทสินค้า
    const defaultRates: Record<string, number> = {
        'mobiles': 30, // โทรศัพท์เสื่อมราคา 30% ต่อปี
        'computers': 25, // คอมพิวเตอร์เสื่อมราคา 25% ต่อปี
        'cameras': 15, // กล้องเสื่อมราคา 15% ต่อปี
        'cars': 20, // รถยนต์เสื่อมราคา 20% ต่อปี (ปีแรก)
        'motorcycles': 18, // มอเตอร์ไซค์เสื่อมราคา 18% ต่อปี
        'fashion': 40, // แฟชั่นเสื่อมราคา 40% ต่อปี
        'furniture': 10, // เฟอร์นิเจอร์เสื่อมราคา 10% ต่อปี
    };

    const yearlyRate = defaultRates[categoryId] || 20;
    const monthlyRate = yearlyRate / 12;

    // TODO: คำนวณจากข้อมูลจริงถ้ามีเพียงพอ
    // สามารถวิเคราะห์ราคาของสินค้าที่มีอายุต่างกันเพื่อหา depreciation curve

    return {
        categoryId,
        yearlyRate,
        monthlyRate,
        accelerationFactor: 1.0,
        lastUpdated: new Date()
    };
}

// ========================================
// 4. ระบบ Caching และ Auto-Update
// ========================================

/**
 * Cache สำหรับเก็บข้อมูล Market Trends
 */
const marketTrendCache = new Map<string, MarketTrend>();
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 ชั่วโมง

/**
 * ดึง Market Trend พร้อม Caching
 */
export async function getMarketTrend(
    categoryId: string,
    brand?: string,
    model?: string,
    forceRefresh: boolean = false
): Promise<MarketTrend | null> {
    const cacheKey = `${categoryId}-${brand || 'all'}-${model || 'all'}`;

    // ตรวจสอบ Cache
    if (!forceRefresh && marketTrendCache.has(cacheKey)) {
        const cached = marketTrendCache.get(cacheKey)!;
        const age = Date.now() - cached.lastUpdated.getTime();

        if (age < CACHE_DURATION) {
            return cached;
        }
    }

    // ดึงข้อมูลใหม่
    const [internal, external] = await Promise.all([
        fetchInternalMarketData(categoryId, brand, model),
        fetchExternalMarketData(categoryId, brand, model)
    ]);

    const allData = [...internal, ...external];
    const trend = calculateMarketTrend(allData);

    if (trend) {
        marketTrendCache.set(cacheKey, trend);
    }

    return trend;
}

// ========================================
// 5. Dynamic Price Adjustment
// ========================================

/**
 * ปรับราคาตามสภาวะตลาดปัจจุบัน
 */
export function adjustPriceByMarketCondition(
    basePrice: number,
    marketTrend: MarketTrend | null
): number {
    if (!marketTrend) return basePrice;

    let adjustedPrice = basePrice;

    // 1. ปรับตามแนวโน้มราคา 30 วัน
    if (Math.abs(marketTrend.priceChange30Days) > 5) {
        // ถ้าราคาเปลี่ยนแปลงมากกว่า 5% ให้ปรับตาม
        adjustedPrice *= (1 + marketTrend.priceChange30Days / 100);
    }

    // 2. ปรับตาม Demand Score
    if (marketTrend.demandScore > 70) {
        // ความต้องการสูง สามารถตั้งราคาสูงขึ้นได้
        adjustedPrice *= 1.05;
    } else if (marketTrend.demandScore < 30) {
        // ความต้องการต่ำ ควรลดราคา
        adjustedPrice *= 0.95;
    }

    // 3. ปรับให้อยู่ในช่วงที่เหมาะสม (Percentile 25-75)
    if (adjustedPrice < marketTrend.priceRange.percentile25) {
        adjustedPrice = marketTrend.priceRange.percentile25;
    } else if (adjustedPrice > marketTrend.priceRange.percentile75) {
        adjustedPrice = marketTrend.priceRange.percentile75;
    }

    return Math.round(adjustedPrice);
}

// ========================================
// 6. ตัวอย่างการใช้งาน
// ========================================

/**
 * ตัวอย่าง: ประเมินราคารถยนต์มือสอง
 */
export async function estimateCarPrice(
    brand: string,
    model: string,
    year: number,
    mileage: number,
    condition: string
): Promise<{
    estimatedPrice: number;
    priceRange: { min: number; max: number };
    marketInsights: string[];
}> {
    // 1. ดึงข้อมูลตลาด
    const marketTrend = await getMarketTrend('cars', brand, model);

    // 2. คำนวณราคาพื้นฐานจากปีและสภาพ
    const currentYear = new Date().getFullYear();
    const age = currentYear - year;

    // สมมติราคาใหม่ (ควรดึงจาก Database)
    const newCarPrice = 800000; // ฿800,000

    // 3. คำนวณการเสื่อมราคา (แบบ Compound)
    const depreciationRate = calculateDepreciationRate('cars', []);

    // รถยนต์เสื่อมราคาแบบ Accelerated ในปีแรก
    let remainingValue = 1.0; // เริ่มที่ 100%

    if (age >= 1) {
        remainingValue *= (1 - 0.15); // ปีแรกเสื่อม 15%
    }
    if (age >= 2) {
        remainingValue *= (1 - 0.12); // ปีที่ 2 เสื่อมเพิ่ม 12%
    }
    if (age >= 3) {
        // ปีที่ 3 เป็นต้นไป เสื่อมตาม depreciationRate
        const yearsAfterTwo = age - 2;
        remainingValue *= Math.pow(1 - (depreciationRate.yearlyRate / 100), yearsAfterTwo);
    }

    let basePrice = newCarPrice * remainingValue;

    // 4. ปรับตามเลขไมล์
    const expectedMileage = age * 15000; // คาดว่าขับ 15,000 km/ปี
    const mileageDiff = mileage - expectedMileage;

    if (mileageDiff > 0) {
        // ไมล์มากกว่าปกติ ลดราคา
        const mileagePenalty = Math.min(0.2, (mileageDiff / 100000) * 0.1);
        basePrice *= (1 - mileagePenalty);
    }

    // 5. ปรับตามสภาพ
    const conditionMultiplier: Record<string, number> = {
        'ใหม่': 1.0,
        'สภาพดีมาก': 0.95,
        'สภาพดี': 0.85,
        'สภาพใช้งานได้': 0.70,
        'ต้องซ่อม': 0.50
    };

    basePrice *= (conditionMultiplier[condition] || 0.85);

    // 6. ปรับตามสภาวะตลาด
    const estimatedPrice = adjustPriceByMarketCondition(basePrice, marketTrend);

    // 7. คำนวณช่วงราคา
    const priceRange = {
        min: Math.round(estimatedPrice * 0.9),
        max: Math.round(estimatedPrice * 1.1)
    };

    // 8. สร้าง Market Insights
    const insights: string[] = [];

    if (marketTrend) {
        if (marketTrend.priceChange30Days > 5) {
            insights.push(`📈 ราคาตลาดเพิ่มขึ้น ${marketTrend.priceChange30Days.toFixed(1)}% ใน 30 วันที่ผ่านมา`);
        } else if (marketTrend.priceChange30Days < -5) {
            insights.push(`📉 ราคาตลาดลดลง ${Math.abs(marketTrend.priceChange30Days).toFixed(1)}% ใน 30 วันที่ผ่านมา`);
        }

        if (marketTrend.demandScore > 70) {
            insights.push(`🔥 ความต้องการสูง (${marketTrend.demandScore.toFixed(0)}/100) - ขายได้ง่าย`);
        } else if (marketTrend.demandScore < 30) {
            insights.push(`⚠️ ความต้องการต่ำ (${marketTrend.demandScore.toFixed(0)}/100) - อาจต้องลดราคา`);
        }

        insights.push(`📊 มีรถคล้ายกันขายไปแล้ว ${marketTrend.soldInLast30Days} คันใน 30 วัน`);
    }

    if (mileage > expectedMileage) {
        insights.push(`🚗 เลขไมล์สูงกว่าค่าเฉลี่ย ${(mileageDiff / 1000).toFixed(0)}k km`);
    }

    return {
        estimatedPrice,
        priceRange,
        marketInsights: insights
    };
}
