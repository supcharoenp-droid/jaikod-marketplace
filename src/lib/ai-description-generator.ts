
export interface DescriptionGeneratorInput {
    shopName: string
    keywords: string
    category?: string
}

export type DescriptionTone = 'Friendly' | 'Professional' | 'Minimal' | 'Bold' | 'Luxury' | 'Fun'

export interface GeneratedDescription {
    text: string
    tone: DescriptionTone
    language: 'th' | 'en'
}

// Mock AI Logic
export async function generateShopDescriptions(input: DescriptionGeneratorInput, language: 'th' | 'en'): Promise<GeneratedDescription[]> {
    await new Promise(resolve => setTimeout(resolve, 1500))

    const { shopName, keywords } = input
    const results: GeneratedDescription[] = []
    const tones: DescriptionTone[] = ['Friendly', 'Professional', 'Minimal', 'Bold', 'Luxury', 'Fun']

    const getTemplate = (t: DescriptionTone, l: 'th' | 'en') => {
        if (l === 'th') {
            switch (t) {
                case 'Friendly': return `ยินดีต้อนรับสู่ ${shopName}! เราคัดสรรสินค้า ${keywords} คุณภาพดีเพื่อคุณโดยเฉพาะ พร้อมบริการที่เป็นกันเองเหมือนเพื่อน`
                case 'Professional': return `${shopName} ผู้นำด้าน ${keywords} ที่ได้รับความไว้วางใจ มุ่งมั่นส่งมอบมาตรฐานสูงสุดและความพึงพอใจแก่ลูกค้าทุกท่าน`
                case 'Minimal': return `${shopName} — ${keywords} เรียบง่าย ลงตัว.`
                case 'Bold': return `ที่สุดของ ${keywords} ต้องที่ ${shopName} เท่านั้น! กล้าที่จะแตกต่าง ด้วยสไตล์ที่ไม่เหมือนใคร`
                case 'Luxury': return `สัมผัสประสบการณ์เหนือระดับกับ ${shopName} แหล่งรวม ${keywords} เกรดพรีเมียม ตอบโจทย์ไลฟ์สไตล์ที่หรูหราของคุณ`
                case 'Fun': return `สนุกไปกับการช้อป ${keywords} ที่ ${shopName}! ของดี ราคาโดนใจ อัปเดตใหม่ทุกวัน รออะไรช้อปเลย!`
                default: return ''
            }
        } else {
            switch (t) {
                case 'Friendly': return `Welcome to ${shopName}! We handpick quality ${keywords} just for you with friendly service.`
                case 'Professional': return `${shopName} is a trusted leader in ${keywords}, committed to delivering highest standards and customer satisfaction.`
                case 'Minimal': return `${shopName} — ${keywords}. Simple. Perfect.`
                case 'Bold': return `The ultimate destination for ${keywords} is ${shopName}! Dare to be different with our unique style.`
                case 'Luxury': return `Experience true luxury with ${shopName}. Premium ${keywords} curated for your exclusive lifestyle.`
                case 'Fun': return `Enjoy shopping for ${keywords} at ${shopName}! Great items, best prices, updated daily. Shop now!`
                default: return ''
            }
        }
    }

    tones.forEach(tone => {
        results.push({
            text: getTemplate(tone, language),
            tone: tone,
            language: language
        })
    })

    return results
}

export async function beautifyDescription(text: string): Promise<string> {
    await new Promise(resolve => setTimeout(resolve, 1000))
    // Simple mock enhancement
    if (!text) return ''
    return text.trim() + (text.endsWith('.') ? ' ✨' : '. ✨')
}
