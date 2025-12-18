
export interface MarketPricingResult {
    low_price: number
    market_avg: number
    competitive: number
    explanation: string
    competitor_prices: number[] // For graph
}

export async function analyzeMarketPricing(category: string, productName: string): Promise<MarketPricingResult> {
    // Simulate AI Delay
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Mock logic based on input
    const isFashion = category === 'clothing' || productName.toLowerCase().includes('shirt')
    const isTech = category === 'electronics' || productName.toLowerCase().includes('phone')

    let basePrice = 300
    if (isFashion) basePrice = 250
    if (isTech) basePrice = 5000

    // Random variation
    const variation = Math.random() * 0.2

    const low = Math.floor(basePrice * (0.8 + variation))
    const avg = Math.floor(basePrice * (1.0 + variation))
    const comp = Math.floor(basePrice * (0.9 + variation))

    // Generate accurate looking competitor data points for graph
    const competitors = Array.from({ length: 10 }, () =>
        Math.floor(basePrice * (0.7 + Math.random() * 0.6))
    ).sort((a, b) => a - b)

    let explanation = `จากข้อมูลตลาด เราพบว่าสินค้าประเภท "${category}" มีความต้องการสูง ` +
        `ราคาเริ่มต้นที่ ${low} บาท จะช่วยดึงดูดลูกค้าได้ดีที่สุดสำหรับการเปิดร้านใหม่ ` +
        `แต่หากคุณมั่นใจในคุณภาพ ราคา ${comp} บาท ก็ยังเป็นราคาที่แข่งขันได้ดี`

    if (isTech) {
        explanation = `สินค้าไอทีมีการเปลี่ยนแปลงราคาเร็ว ราคา ${comp} บาท คือจุดที่คุ้มค่าที่สุดเมื่อเทียบกับสเปก ` +
            `กราฟแสดงให้เห็นว่าคู่แข่งส่วนใหญ่อยู่ที่ช่วง ${avg} บาท การตั้งราคาต่ำกว่าเล็กน้อยจะช่วยสร้างฐานลูกค้าได้เร็วขึ้น`
    }

    return {
        low_price: low,
        market_avg: avg,
        competitive: comp,
        explanation,
        competitor_prices: competitors
    }
}
