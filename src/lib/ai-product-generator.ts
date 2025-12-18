
export interface ProductAIResult {
    title: string
    descriptionTh: string
    descriptionEn: string
    suggestedCategory: string
    suggestedPrices: number[]
}

export async function analyzeProductImage(file: File): Promise<{ tags: string[], category: string }> {
    // Mock analysis
    await new Promise(resolve => setTimeout(resolve, 1500))
    return {
        tags: ['Vintage', 'Fashion', 'Streetwear'],
        category: 'clothing' // Matches generic category ID
    }
}

export async function generateProductContent(name: string, tags: string[] = []): Promise<ProductAIResult> {
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Mock generation based on input
    const isFashion = name.toLowerCase().includes('shirt') || tags.includes('Fashion')
    const isTech = name.toLowerCase().includes('phone') || tags.includes('Tech')

    if (isFashion) {
        return {
            title: `${name} - สไตล์วินเทจ สภาพดี (Original)`,
            descriptionTh: `ขาย ${name} งานดี สภาพนางฟ้า ใส่สบาย เหมาะกับทุกโอกาส`,
            descriptionEn: `Selling ${name}, vintage style, mint condition. Comfortable and perfect for any occasion.`,
            suggestedCategory: 'clothing',
            suggestedPrices: [150, 290, 450]
        }
    }

    if (isTech) {
        return {
            title: `${name} (Used) - ใช้งานปกติ มีประกันใจ`,
            descriptionTh: `${name} มือสอง สภาพ 95% ใช้งานได้ปกติทุกฟังก์ชัน อุปกรณ์ครบกล่อง`,
            descriptionEn: `Used ${name} in 95% condition. Fully functional with all accessories included.`,
            suggestedCategory: 'electronics',
            suggestedPrices: [5900, 7500, 9900]
        }
    }

    // Default
    return {
        title: `${name} - คุณภาพดี พร้อมส่ง`,
        descriptionTh: `สินค้า ${name} สภาพดี ราคาเป็นกันเอง สนใจทักแชทสอบถามเพิ่มเติมได้ครับ`,
        descriptionEn: `${name} in good condition. Affordable price. DM for more info.`,
        suggestedCategory: 'misc',
        suggestedPrices: [100, 300, 500]
    }
}
