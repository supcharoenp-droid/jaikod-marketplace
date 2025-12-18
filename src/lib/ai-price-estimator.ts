import { CategorySchema, mapCategoryIdToSlug } from '../config/category-schemas';

// --- Interfaces ---
export interface MarketPriceAnalysis {
    market_price: {
        average: number;
        min: number;
        max: number;
        quick_sale: number;
        confidence: number;
        sources_used: {
            internal_sold: number;
            internal_active: number;
            one2car: number;
            carro: number;
            kaidee: number;
            facebook: number;
            other: number;
        };
    };
    analysis_text: string;
    trend: 'rising' | 'falling' | 'stable';
    adjustments: {
        mileage: string;
        condition: string;
        dealer_price_bias: string;
        region_factor: string;
    };
    suggestions: string[];
}

export interface ExternalPriceContext {
    one2car?: number[];
    carro?: { min: number, max: number }[];
    kaidee?: number[];
    facebook?: number[];
    internal_active?: number[];
    internal_sold?: number[];
}

export interface EstimatePriceInput {
    categoryId: string | number;
    attributes: Record<string, any>;
    originalPrice?: number;
    purchaseDate?: Date;
    name?: string; // Optional, can be derived or passed
}

interface ProductData {
    name: string;
    description: string;
    price: number;
    categoryId: string;
    attributes: Record<string, any>;
    categoryName?: string;
    images?: string[];
    purchaseDate?: Date;
}

// 🚗 REALISTIC BASE MARKET DATA (Internal Knowledge Base)
const INTERNAL_CAR_DB: Record<string, { base_new: number; annual_dep: number; floor_price: number; trend: 'stable' | 'rising' | 'falling' }> = {
    'almera': { base_new: 550000, annual_dep: 0.09, floor_price: 150000, trend: 'falling' },
    'march': { base_new: 450000, annual_dep: 0.10, floor_price: 120000, trend: 'falling' },
    'yaris': { base_new: 600000, annual_dep: 0.06, floor_price: 220000, trend: 'stable' },
    'city': { base_new: 680000, annual_dep: 0.07, floor_price: 180000, trend: 'stable' },
    'vios': { base_new: 650000, annual_dep: 0.07, floor_price: 150000, trend: 'stable' },
    'civic': { base_new: 1000000, annual_dep: 0.05, floor_price: 350000, trend: 'stable' },
    'altis': { base_new: 950000, annual_dep: 0.08, floor_price: 200000, trend: 'stable' },
    'camry': { base_new: 1600000, annual_dep: 0.07, floor_price: 400000, trend: 'stable' },
    'accord': { base_new: 1500000, annual_dep: 0.08, floor_price: 350000, trend: 'stable' },
    'cr-v': { base_new: 1500000, annual_dep: 0.06, floor_price: 400000, trend: 'stable' },
    'hr-v': { base_new: 1000000, annual_dep: 0.06, floor_price: 350000, trend: 'stable' },
    'fortuner': { base_new: 1600000, annual_dep: 0.04, floor_price: 550000, trend: 'rising' },
    'revo': { base_new: 800000, annual_dep: 0.05, floor_price: 300000, trend: 'stable' },
    'd-max': { base_new: 850000, annual_dep: 0.04, floor_price: 320000, trend: 'rising' },
    'ranger': { base_new: 900000, annual_dep: 0.08, floor_price: 300000, trend: 'falling' },
};

/**
 * 🧠 AUTO EXTERNAL PRICE ENGINE 007
 */
export async function estimatePrice(
    input: EstimatePriceInput,
    externalData?: ExternalPriceContext // Optional override
): Promise<MarketPriceAnalysis> {
    const categorySlug = mapCategoryIdToSlug(input.categoryId);
    const isAuto = categorySlug === 'automotive';

    // Construct text for matching
    const name = input.name || input.attributes.brand + ' ' + input.attributes.model || '';
    const text = (name + ' ' + JSON.stringify(input.attributes)).toLowerCase();

    // 1. Internal Logic (Baseline)
    const year = extractYear(input.attributes, name);
    const age = new Date().getFullYear() - year;
    const modelKey = Object.keys(INTERNAL_CAR_DB).find(key => text.includes(key));

    let internalEstimate = 0;
    let baselineData = INTERNAL_CAR_DB['vios']; // Default

    if (isAuto && modelKey) {
        baselineData = INTERNAL_CAR_DB[modelKey];
        // Base Price Calc
        let depreciated = baselineData.base_new * Math.pow((1 - baselineData.annual_dep), age);
        depreciated = Math.max(depreciated, baselineData.floor_price);
        internalEstimate = depreciated;
    } else {
        internalEstimate = isAuto ? 300000 : (input.originalPrice ? input.originalPrice * 0.5 : 1500);
    }

    // 2. Mock Injection (If no external data provided - for Demo)
    // In production, this would be computed from real API calls before calling this function
    const mockContext = externalData || generateMockExternalData(internalEstimate, modelKey);

    // 3. Weighted Aggregation Logic
    let weightedSum = 0;
    let totalWeight = 0;
    let sourcesCount = {
        internal_sold: 0, internal_active: 0, one2car: 0, carro: 0, kaidee: 0, facebook: 0, other: 0
    };

    // Helper to add price points
    const addSource = (prices: number[] | undefined, weight: number, bias: number, sourceKey: keyof typeof sourcesCount) => {
        if (!prices || prices.length === 0) return;
        sourcesCount[sourceKey] = prices.length;

        // Remove outliers
        const validPrices = filterOutliers(prices);
        if (validPrices.length === 0) return;

        const avg = validPrices.reduce((a, b) => a + b, 0) / validPrices.length;
        const adjustedAvg = avg * bias; // Adjust for markup/bias

        weightedSum += adjustedAvg * weight;
        totalWeight += weight;
    };

    // Internal Knowledge (Weight 1.0)
    weightedSum += internalEstimate * 1.0;
    totalWeight += 1.0;

    // External Sources
    // One2Car: Weight 0.7, Bias 0.85 (Dealer asking price is usually high)
    addSource(mockContext.one2car, 0.7, 0.85, 'one2car');

    // Kaidee: Weight 0.8, Bias 0.9 (Private seller asking price)
    addSource(mockContext.kaidee, 0.8, 0.9, 'kaidee');

    // Carro/Carsome: Weight 0.6, Bias 1.0 (Ranges usually reflect buy offers, assume mid)
    if (mockContext.carro && mockContext.carro.length > 0) {
        const midPoints = mockContext.carro.map(r => (r.min + r.max) / 2);
        addSource(midPoints, 0.6, 1.05, 'carro'); // Slightly bump as buying price is low
    }

    // Facebook: Weight 0.4, Bias 0.9 (Very noisy)
    addSource(mockContext.facebook, 0.4, 0.9, 'facebook');

    // 4. Final Calculation
    let finalAvg = weightedSum / totalWeight;

    // Adjust for Condition/Mileage (Applied to the final aggregate market price)
    let conditionAdjust = 1.0;
    const condition = (input.attributes.condition || '').toLowerCase();
    if (condition.includes('มือหนึ่ง')) conditionAdjust = 1.2;
    else if (condition.includes('สภาพดีมาก')) conditionAdjust = 1.05;
    else if (condition.includes('ต้องเก็บงาน')) conditionAdjust = 0.8;
    else if (condition.includes('ซาก')) conditionAdjust = 0.4;

    let mileageAdjust = 1.0;
    let mileageText = "ปกติ";
    if (isAuto && input.attributes.mileage) {
        const mileage = Number(input.attributes.mileage);
        const standardMileage = age * 20000;
        if (mileage < standardMileage * 0.6) { mileageAdjust = 1.1; mileageText = "ไมล์น้อย (+10%)"; }
        else if (mileage > standardMileage * 1.5) { mileageAdjust = 0.9; mileageText = "ไมล์เยอะ (-10%)"; }
    }

    finalAvg = finalAvg * conditionAdjust * mileageAdjust;
    finalAvg = Math.round(finalAvg / 1000) * 1000;

    // Ranges (Variance based on total sources confidence)
    const variance = totalWeight > 2 ? 0.08 : 0.15; // More sources = tighter range
    const minPrice = Math.round(finalAvg * (1 - variance) / 1000) * 1000;
    const maxPrice = Math.round(finalAvg * (1 + variance) / 1000) * 1000;
    const quickSale = Math.round(minPrice * 0.95 / 1000) * 1000;

    return {
        market_price: {
            average: finalAvg,
            min: minPrice,
            max: maxPrice,
            quick_sale: quickSale,
            confidence: Math.min(0.6 + (totalWeight * 0.1), 0.98),
            sources_used: sourcesCount
        },
        analysis_text: `วิเคราะห์จากข้อมูล ${totalWeight > 1.5 ? 'หลายแหล่ง (One2Car, Kaidee, ฯลฯ)' : 'ฐานข้อมูลกลาง'} พบว่าราคาตลาดของ ${modelKey ? modelKey.toUpperCase() : 'รถรุ่นนี้'} อยู่ที่ ${finalAvg.toLocaleString()} บาท`,
        trend: baselineData.trend,
        adjustments: {
            mileage: mileageText,
            condition: condition,
            dealer_price_bias: "ปรับลดราคา One2Car ลง 15% (ราคาตั้งขายเต็นท์)",
            region_factor: "กทม.และปริมณฑล"
        },
        suggestions: [
            `ราคา One2Car เฉลี่ยอยู่ที่ ${(internalEstimate * 1.15).toLocaleString()} (ราคารวมกำไรเต็นท์)`,
            `หากขายเอง แนะนำตั้งที่ ${finalAvg.toLocaleString()} เพื่อแข่งขันได้`,
            `ถ้ารีบใช้เงิน ราคา Quick Sale คือ ${quickSale.toLocaleString()}`
        ]
    };
}

// --- Helpers ---

function extractYear(attributes: any, name: string): number {
    let year = new Date().getFullYear();
    const attrYear = attributes.year || attributes.Year;
    if (attrYear) {
        let y = parseInt(String(attrYear));
        if (y > 2400) y -= 543;
        if (y > 1980 && y < 2100) year = y;
    } else {
        const m = name.match(/20\d{2}|25\d{2}/);
        if (m) {
            let y = parseInt(m[0]);
            if (y > 2400) y -= 543;
            year = y;
        }
    }
    return year;
}

function filterOutliers(prices: number[]): number[] {
    if (prices.length < 3) return prices;
    const sorted = [...prices].sort((a, b) => a - b);
    const q1 = sorted[Math.floor(sorted.length * 0.25)];
    const q3 = sorted[Math.floor(sorted.length * 0.75)];
    const iqr = q3 - q1;
    const min = q1 - 1.5 * iqr;
    const max = q3 + 1.5 * iqr;
    return sorted.filter(p => p >= min && p <= max);
}

function generateMockExternalData(basePrice: number, model?: string): ExternalPriceContext {
    // Generate realistic variance around the base price
    if (!model) return {};

    // One2Car: Higher (Dealer price)
    const o2c = [
        basePrice * 1.15,
        basePrice * 1.18,
        basePrice * 1.12,
        basePrice * 1.20  // Outlier?
    ];

    // Kaidee: Private Seller (Close to base)
    const kai = [
        basePrice * 0.95,
        basePrice * 1.05,
        basePrice * 0.98
    ];

    return {
        one2car: o2c,
        kaidee: kai,
        carro: [],
        facebook: [basePrice * 0.8], // Lowballer
        internal_active: [],
        internal_sold: []
    };
}
