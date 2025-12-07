/**
 * AI Price Estimator
 * ระบบประเมินราคาอัจฉริยะโดยใช้ Category Schema และข้อมูลตลาด
 */

import { getCategorySchema, type CategorySchema, type PriceFactors } from '@/config/category-schemas';

export interface ProductData {
    categoryId: string;
    attributes: Record<string, any>;
    images?: string[];
    purchaseDate?: Date; // วันที่ซื้อ (สำหรับคำนวณอายุ)
    originalPrice?: number; // ราคาเดิมตอนซื้อมาใหม่
}

export interface PriceEstimation {
    estimatedPrice: number;
    priceRange: {
        min: number;
        max: number;
    };
    confidence: number; // ความมั่นใจในการประเมิน (0-1)
    factors: {
        factor: string;
        impact: number; // ผลกระทบต่อราคา (%)
        description: string;
    }[];
    marketComparison?: {
        averagePrice: number;
        similarListings: number;
    };
    recommendations: string[];
}

/**
 * ประเมินราคาสินค้าโดยใช้ AI และ Schema
 */
export async function estimatePrice(productData: ProductData): Promise<PriceEstimation> {
    const schema = getCategorySchema(productData.categoryId);

    if (!schema) {
        throw new Error(`Schema not found for category: ${productData.categoryId}`);
    }

    // 1. คำนวณราคาพื้นฐาน (Base Price)
    const basePrice = await calculateBasePrice(productData, schema);

    // 2. คำนวณผลกระทบจาก Price Factors
    const factorImpacts = calculateFactorImpacts(productData, schema);

    // 3. คำนวณราคาสุดท้าย
    let estimatedPrice = basePrice;
    factorImpacts.forEach(factor => {
        estimatedPrice *= (1 + factor.impact / 100);
    });

    // 4. ปรับราคาตามข้อมูลตลาด (ถ้ามี)
    const marketData = await getMarketData(productData, schema);
    if (marketData) {
        // ปรับให้ใกล้เคียงกับราคาตลาด
        estimatedPrice = (estimatedPrice * 0.7) + (marketData.averagePrice * 0.3);
    }

    // 5. คำนวณช่วงราคา
    const priceRange = {
        min: Math.round(estimatedPrice * 0.85),
        max: Math.round(estimatedPrice * 1.15)
    };

    // 6. คำนวณความมั่นใจ
    const confidence = calculateConfidence(productData, schema, marketData);

    // 7. สร้างคำแนะนำ
    const recommendations = generateRecommendations(productData, schema, estimatedPrice, marketData);

    return {
        estimatedPrice: Math.round(estimatedPrice),
        priceRange,
        confidence,
        factors: factorImpacts,
        marketComparison: marketData,
        recommendations
    };
}

/**
 * คำนวณราคาพื้นฐาน
 */
async function calculateBasePrice(productData: ProductData, schema: CategorySchema): Promise<number> {
    // ถ้ามีราคาเดิม ใช้เป็นฐาน
    if (productData.originalPrice) {
        return productData.originalPrice;
    }

    // ถ้าไม่มี ใช้ราคากลางของหมวดหมู่
    const midPrice = (schema.priceRange.min + schema.priceRange.max) / 2;

    // ปรับตามแบรนด์และรุ่น (ถ้ามี)
    let basePrice = midPrice;

    if (productData.attributes.brand) {
        const brandMultiplier = getBrandMultiplier(productData.attributes.brand, schema.categoryId);
        basePrice *= brandMultiplier;
    }

    return basePrice;
}

/**
 * คำนวณผลกระทบจาก Price Factors
 */
function calculateFactorImpacts(productData: ProductData, schema: CategorySchema) {
    const impacts: { factor: string; impact: number; description: string }[] = [];

    schema.priceFactors.forEach(factor => {
        let impact = 0;

        switch (factor.type) {
            case 'depreciation':
                impact = calculateDepreciationImpact(productData, schema);
                break;
            case 'condition':
                impact = calculateConditionImpact(productData, factor);
                break;
            case 'brand':
                impact = calculateBrandImpact(productData, factor);
                break;
            case 'specs':
                impact = calculateSpecsImpact(productData, factor);
                break;
            case 'market':
                impact = calculateMarketImpact(productData, factor);
                break;
            case 'rarity':
                impact = calculateRarityImpact(productData, factor);
                break;
        }

        // คูณด้วยน้ำหนัก
        const weightedImpact = impact * factor.weight;

        impacts.push({
            factor: factor.label,
            impact: weightedImpact,
            description: factor.description
        });
    });

    return impacts;
}

/**
 * คำนวณผลกระทบจากการเสื่อมราคา
 */
function calculateDepreciationImpact(productData: ProductData, schema: CategorySchema): number {
    if (!productData.purchaseDate) {
        // ถ้าไม่มีวันที่ซื้อ ประมาณจากสภาพ
        const condition = productData.attributes.condition || '';
        if (condition.includes('ใหม่')) return 0;
        if (condition.includes('สภาพดีมาก')) return -15;
        if (condition.includes('สภาพดี')) return -30;
        return -45;
    }

    const ageInYears = (Date.now() - productData.purchaseDate.getTime()) / (1000 * 60 * 60 * 24 * 365);
    const depreciationRate = schema.depreciationRate;

    // ลดราคาตามอัตราต่อปี
    return -(ageInYears * depreciationRate);
}

/**
 * คำนวณผลกระทบจากสภาพสินค้า
 */
function calculateConditionImpact(productData: ProductData, factor: PriceFactors): number {
    const condition = productData.attributes.condition || '';

    // สำหรับโทรศัพท์และคอมพิวเตอร์
    if (condition.includes('ใหม่ ไม่แกะกล่อง')) return 10;
    if (condition.includes('ใหม่ แกะกล่องแล้ว')) return 5;
    if (condition.includes('สภาพดีมาก')) return 0;
    if (condition.includes('สภาพดี')) return -10;
    if (condition.includes('สภาพใช้งานได้')) return -25;

    // สำหรับสัตว์เลี้ยง - ดูจากสุขภาพ
    if (factor.key === 'health_status') {
        const health = productData.attributes.health || '';
        const vaccinated = productData.attributes.vaccinated || '';
        const sterilized = productData.attributes.sterilized || '';

        let impact = 0;
        if (health === 'แข็งแรงดี') impact += 10;
        if (health === 'มีประวัติป่วย') impact -= 15;
        if (health === 'กำลังรักษา') impact -= 30;

        if (vaccinated === 'ครบถ้วน') impact += 15;
        if (sterilized === 'ทำแล้ว') impact += 10;

        return impact;
    }

    // สำหรับกล้อง - ดูจาก Shutter Count
    if (factor.key === 'shutter_count') {
        const shutterCount = productData.attributes.shutterCount || 0;
        if (shutterCount < 5000) return 10;
        if (shutterCount < 20000) return 0;
        if (shutterCount < 50000) return -10;
        if (shutterCount < 100000) return -20;
        return -30;
    }

    // สำหรับแบตเตอรี่ (โทรศัพท์)
    if (factor.key === 'battery_health') {
        const batteryHealth = productData.attributes.batteryHealth || 100;
        if (batteryHealth >= 90) return 5;
        if (batteryHealth >= 80) return 0;
        if (batteryHealth >= 70) return -10;
        return -20;
    }

    return 0;
}

/**
 * คำนวณผลกระทบจากแบรนด์
 */
function calculateBrandImpact(productData: ProductData, factor: PriceFactors): number {
    const brand = productData.attributes.brand || '';
    const categoryId = productData.categoryId;

    // Premium brands
    const premiumBrands: Record<string, string[]> = {
        mobiles: ['Apple', 'Samsung'],
        computers: ['Apple', 'Razer', 'Microsoft'],
        cameras: ['Canon', 'Nikon', 'Sony'],
        pets: [] // สัตว์เลี้ยงดูจากสายพันธุ์มากกว่า
    };

    if (premiumBrands[categoryId]?.includes(brand)) {
        return 15;
    }

    // สำหรับสัตว์เลี้ยง - ดูจากใบเพ็ดดิกรี
    if (factor.key === 'pedigree_premium') {
        const pedigree = productData.attributes.pedigree || '';
        if (pedigree === 'มี') return 25;
    }

    return 0;
}

/**
 * คำนวณผลกระทบจากสเปค
 */
function calculateSpecsImpact(productData: ProductData, factor: PriceFactors): number {
    let impact = 0;

    // สำหรับคอมพิวเตอร์
    if (productData.categoryId === 'computers') {
        const ram = productData.attributes.ram || '';
        const storage = productData.attributes.storage || '';
        const gpu = productData.attributes.gpu || '';

        if (ram.includes('32GB') || ram.includes('64GB')) impact += 15;
        else if (ram.includes('16GB')) impact += 5;

        if (storage.includes('1TB') || storage.includes('2TB')) impact += 10;
        else if (storage.includes('512GB')) impact += 5;

        if (gpu && (gpu.includes('RTX') || gpu.includes('RX'))) impact += 20;
    }

    // สำหรับโทรศัพท์
    if (productData.categoryId === 'mobiles') {
        const storage = productData.attributes.storage || '';
        if (storage === '1TB') impact += 20;
        else if (storage === '512GB') impact += 10;
        else if (storage === '256GB') impact += 5;
    }

    // สำหรับกล้อง
    if (productData.categoryId === 'cameras') {
        const sensor = productData.attributes.sensor || '';
        if (sensor === 'Full Frame') impact += 25;
        else if (sensor === 'APS-C') impact += 10;
    }

    return impact;
}

/**
 * คำนวณผลกระทบจากตลาด
 */
function calculateMarketImpact(productData: ProductData, factor: PriceFactors): number {
    // ในอนาคตสามารถดึงข้อมูลจาก API หรือ Database
    // ตอนนี้ใช้ค่าประมาณ
    return 0;
}

/**
 * คำนวณผลกระทบจากความหายาก
 */
function calculateRarityImpact(productData: ProductData, factor: PriceFactors): number {
    // สำหรับสัตว์เลี้ยง
    if (productData.categoryId === 'pets') {
        const breed = productData.attributes.breed || '';
        const rareBreeds = ['Scottish Fold', 'Ragdoll', 'Maine Coon', 'Savannah', 'Bengal'];

        if (rareBreeds.some(rare => breed.includes(rare))) {
            return 30;
        }
    }

    return 0;
}

/**
 * ดึงข้อมูลราคาจากตลาด
 */
async function getMarketData(productData: ProductData, schema: CategorySchema) {
    // TODO: Implement actual market data fetching
    // ในอนาคตสามารถดึงข้อมูลจาก:
    // 1. Database ของเราเอง (ราคาสินค้าที่ขายไปแล้ว)
    // 2. External APIs (Mercari, Kaidee, etc.)
    // 3. Web scraping

    return null;
}

/**
 * คำนวณความมั่นใจในการประเมิน
 */
function calculateConfidence(
    productData: ProductData,
    schema: CategorySchema,
    marketData: any
): number {
    let confidence = 0.5; // เริ่มที่ 50%

    // มีข้อมูลครบถ้วน +20%
    const requiredAttrs = schema.attributes.filter(a => a.required);
    const providedAttrs = requiredAttrs.filter(a => productData.attributes[a.key]);
    const completeness = providedAttrs.length / requiredAttrs.length;
    confidence += completeness * 0.2;

    // มีราคาเดิม +15%
    if (productData.originalPrice) {
        confidence += 0.15;
    }

    // มีวันที่ซื้อ +10%
    if (productData.purchaseDate) {
        confidence += 0.1;
    }

    // มีข้อมูลตลาด +15%
    if (marketData) {
        confidence += 0.15;
    }

    return Math.min(confidence, 1); // สูงสุด 100%
}

/**
 * สร้างคำแนะนำ
 */
function generateRecommendations(
    productData: ProductData,
    schema: CategorySchema,
    estimatedPrice: number,
    marketData: any
): string[] {
    const recommendations: string[] = [];

    // แนะนำตามสภาพ
    const condition = productData.attributes.condition || '';
    if (condition.includes('สภาพใช้งานได้')) {
        recommendations.push('💡 ลดราคาเล็กน้อยเพื่อขายเร็วขึ้น');
    }

    // แนะนำตามอุปกรณ์
    if (productData.categoryId === 'mobiles' || productData.categoryId === 'computers') {
        const accessories = productData.attributes.accessories || [];
        if (accessories.length < 2) {
            recommendations.push('📦 เพิ่มอุปกรณ์ครบชุดจะช่วยเพิ่มมูลค่า');
        }
    }

    // แนะนำตามการรับประกัน
    const warranty = productData.attributes.warranty || '';
    if (warranty === 'ยังไม่หมดประกัน') {
        recommendations.push('✅ เน้นการรับประกันในรายละเอียดจะช่วยเพิ่มความน่าเชื่อถือ');
    }

    // แนะนำตามราคาตลาด
    if (marketData) {
        const diff = ((estimatedPrice - marketData.averagePrice) / marketData.averagePrice) * 100;
        if (diff > 15) {
            recommendations.push('⚠️ ราคาสูงกว่าตลาด พิจารณาปรับลดเพื่อแข่งขันได้');
        } else if (diff < -15) {
            recommendations.push('💰 ราคาต่ำกว่าตลาด อาจเพิ่มราคาได้');
        }
    }

    // แนะนำเพิ่มรูปภาพ
    if (!productData.images || productData.images.length < 3) {
        recommendations.push('📸 เพิ่มรูปภาพอย่างน้อย 5 รูปเพื่อดึงดูดผู้ซื้อ');
    }

    return recommendations;
}

/**
 * ดึงค่า Brand Multiplier
 */
function getBrandMultiplier(brand: string, categoryId: string): number {
    const multipliers: Record<string, Record<string, number>> = {
        mobiles: {
            'Apple': 1.5,
            'Samsung': 1.3,
            'Xiaomi': 1.0,
            'OPPO': 0.9,
            'Vivo': 0.9
        },
        computers: {
            'Apple': 1.6,
            'Razer': 1.4,
            'Dell': 1.2,
            'HP': 1.1,
            'Asus': 1.1
        },
        cameras: {
            'Canon': 1.3,
            'Nikon': 1.3,
            'Sony': 1.4,
            'Fujifilm': 1.2
        }
    };

    return multipliers[categoryId]?.[brand] || 1.0;
}
