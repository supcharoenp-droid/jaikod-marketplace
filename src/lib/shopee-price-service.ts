/**
 * SHOPEE PRICE SERVICE
 * 
 * ดึงราคาอ้างอิงจาก Shopee Affiliate API
 * ใช้เป็นข้อมูลประกอบการประเมินราคาสินค้ามือสอง
 * 
 * @requires Shopee Affiliate Account
 * @see https://affiliate.shopee.co.th
 */

import crypto from 'crypto';

// ============================================
// CONFIGURATION
// ============================================

// ⚠️ เก็บใน .env.local ห้าม commit!
const SHOPEE_PARTNER_ID = process.env.SHOPEE_PARTNER_ID || '';
const SHOPEE_PARTNER_KEY = process.env.SHOPEE_PARTNER_KEY || '';
const SHOPEE_API_BASE = 'https://open-api.affiliate.shopee.co.th';

// ============================================
// TYPES
// ============================================

export interface ShopeeProduct {
    itemId: number;
    shopId: number;
    name: string;
    image: string;
    price: number;              // ราคาปัจจุบัน (บาท)
    originalPrice: number;      // ราคาเต็ม (บาท)
    discount: number;           // ส่วนลด %
    rating: number;             // คะแนน 0-5
    sold: number;               // จำนวนที่ขายได้
    stock: number;              // สต็อกคงเหลือ
    shopName: string;
    shopRating: number;
    affiliateLink: string;
}

export interface PriceReference {
    keyword: string;
    source: 'shopee';
    fetchedAt: Date;
    products: ShopeeProduct[];
    priceStats: {
        min: number;
        max: number;
        avg: number;
        median: number;
        sampleSize: number;
    };
}

// ============================================
// SIGNATURE GENERATION
// ============================================

function generateSignature(path: string, timestamp: number): string {
    const baseString = `${SHOPEE_PARTNER_ID}${path}${timestamp}`;
    return crypto
        .createHmac('sha256', SHOPEE_PARTNER_KEY)
        .update(baseString)
        .digest('hex');
}

// ============================================
// API FUNCTIONS
// ============================================

/**
 * ค้นหาสินค้าจาก Shopee
 */
export async function searchShopeeProducts(
    keyword: string,
    limit: number = 20
): Promise<ShopeeProduct[]> {

    if (!SHOPEE_PARTNER_ID || !SHOPEE_PARTNER_KEY) {
        console.warn('⚠️ Shopee API credentials not configured');
        return [];
    }

    const timestamp = Math.floor(Date.now() / 1000);
    const path = '/graphql';
    const signature = generateSignature(path, timestamp);

    try {
        const response = await fetch(`${SHOPEE_API_BASE}${path}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `SHA256 Credential=${SHOPEE_PARTNER_ID}, Timestamp=${timestamp}, Signature=${signature}`,
            },
            body: JSON.stringify({
                query: `
                    query SearchItem($keyword: String!, $limit: Int) {
                        productOfferV2(keyword: $keyword, limit: $limit, sortType: 2) {
                            nodes {
                                itemId
                                shopId
                                productName
                                imageUrl
                                priceMin
                                priceMax
                                discount
                                ratingStar
                                sales
                                stock
                                shopName
                                shopRating
                                productLink
                            }
                        }
                    }
                `,
                variables: { keyword, limit }
            })
        });

        if (!response.ok) {
            console.error('Shopee API error:', response.status);
            return [];
        }

        const data = await response.json();
        const items = data?.data?.productOfferV2?.nodes || [];

        return items.map((item: any) => ({
            itemId: item.itemId,
            shopId: item.shopId,
            name: item.productName,
            image: item.imageUrl,
            price: item.priceMin / 100000,  // Shopee stores price × 100000
            originalPrice: item.priceMax / 100000,
            discount: item.discount || 0,
            rating: item.ratingStar || 0,
            sold: item.sales || 0,
            stock: item.stock || 0,
            shopName: item.shopName,
            shopRating: item.shopRating || 0,
            affiliateLink: item.productLink,
        }));

    } catch (error) {
        console.error('Failed to fetch Shopee products:', error);
        return [];
    }
}

/**
 * ดึงราคาอ้างอิงสำหรับสินค้า
 */
export async function getShopeeReferencePrice(
    productName: string,
    brand?: string
): Promise<PriceReference | null> {

    // สร้าง keyword ที่เหมาะสม
    const keyword = brand ? `${brand} ${productName}` : productName;

    console.log(`🛒 Fetching Shopee prices for: "${keyword}"`);

    const products = await searchShopeeProducts(keyword, 30);

    if (products.length === 0) {
        console.log('No products found on Shopee');
        return null;
    }

    // คำนวณสถิติราคา
    const prices = products.map(p => p.price).filter(p => p > 0);
    const sortedPrices = [...prices].sort((a, b) => a - b);

    const stats = {
        min: Math.min(...prices),
        max: Math.max(...prices),
        avg: Math.round(prices.reduce((a, b) => a + b, 0) / prices.length),
        median: sortedPrices[Math.floor(sortedPrices.length / 2)],
        sampleSize: prices.length,
    };

    console.log(`📊 Shopee price stats: ฿${stats.min.toLocaleString()} - ฿${stats.max.toLocaleString()} (avg: ฿${stats.avg.toLocaleString()})`);

    return {
        keyword,
        source: 'shopee',
        fetchedAt: new Date(),
        products,
        priceStats: stats,
    };
}

/**
 * ประเมินราคามือสองจากราคา Shopee (ราคาใหม่)
 */
export async function estimateUsedPriceFromShopee(
    productName: string,
    brand: string | undefined,
    condition: string,
    ageMonths: number = 0
): Promise<{
    newPrice: number;
    usedPrice: number;
    confidence: number;
    source: string;
} | null> {

    const reference = await getShopeeReferencePrice(productName, brand);

    if (!reference || reference.priceStats.sampleSize < 3) {
        return null;
    }

    // ใช้ราคา median เป็นฐาน (เสถียรกว่า avg)
    const newPrice = reference.priceStats.median;

    // Condition multipliers (สอดคล้องกับ smart-price-estimator.ts)
    const conditionMultipliers: Record<string, number> = {
        'new': 1.00,
        'like_new': 0.85,
        'good': 0.70,
        'fair': 0.50,
        'poor': 0.20,
    };

    const conditionMultiplier = conditionMultipliers[condition] || 0.70;

    // Age depreciation (ลด 1.5% ต่อเดือน, สูงสุด 50%)
    const ageDepreciation = Math.min(ageMonths * 0.015, 0.50);

    // คำนวณราคามือสอง
    const usedPrice = Math.round(newPrice * conditionMultiplier * (1 - ageDepreciation));

    // Confidence based on sample size
    const confidence = Math.min(reference.priceStats.sampleSize * 3, 90);

    return {
        newPrice,
        usedPrice,
        confidence,
        source: `Shopee (${reference.priceStats.sampleSize} products)`,
    };
}

// ============================================
// CACHE LAYER (Optional)
// ============================================

const priceCache = new Map<string, { data: PriceReference; expiry: number }>();
const CACHE_TTL = 60 * 60 * 1000; // 1 hour

export async function getCachedShopeePrice(
    keyword: string
): Promise<PriceReference | null> {

    const cacheKey = keyword.toLowerCase().trim();
    const cached = priceCache.get(cacheKey);

    if (cached && cached.expiry > Date.now()) {
        console.log('📦 Using cached Shopee price');
        return cached.data;
    }

    const fresh = await getShopeeReferencePrice(keyword);

    if (fresh) {
        priceCache.set(cacheKey, {
            data: fresh,
            expiry: Date.now() + CACHE_TTL,
        });
    }

    return fresh;
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * ตรวจสอบว่า API พร้อมใช้งานหรือไม่
 */
export function isShopeeApiConfigured(): boolean {
    return !!(SHOPEE_PARTNER_ID && SHOPEE_PARTNER_KEY);
}

/**
 * ดึง Top sellers สำหรับ category
 */
export async function getTopSellersInCategory(
    categoryKeyword: string,
    limit: number = 10
): Promise<ShopeeProduct[]> {

    const products = await searchShopeeProducts(categoryKeyword, 50);

    // Sort by sales
    return products
        .sort((a, b) => b.sold - a.sold)
        .slice(0, limit);
}
