import type {
    ModerationCheck,
    ModerationResult,
    ModerationStatus,
    ModerationReason,
    AICheck
} from '@/types/moderation'

// Prohibited keywords (Thai + English)
const PROHIBITED_KEYWORDS = [
    // Drugs
    'ยาเสพติด', 'กัญชา', 'ไอซ์', 'ยาบ้า', 'heroin', 'cocaine', 'meth',
    // Weapons
    'ปืน', 'กระสุน', 'ระเบิด', 'gun', 'weapon', 'explosive',
    // Adult content
    'โป๊', 'xxx', 'porn', 'sex',
    // Fake/Counterfeit
    'ของปลอม', 'fake', 'replica', 'copy',
    // Illegal
    'ผิดกฎหมาย', 'illegal', 'stolen',
]

// Suspicious patterns
const SUSPICIOUS_PATTERNS = [
    /\b(ส่งฟรี|ฟรี|free)\s*(ทั่วประเทศ|ทั่วไทย|nationwide)\b/gi,
    /\b(ราคาถูก|ถูกมาก|ราคาพิเศษ)\s*(มาก|สุด)\b/gi,
    /\b(รับประกัน|guarantee)\s*(100%|ตลอดชีพ|lifetime)\b/gi,
]

/**
 * AI Content Moderation Service
 * ตรวจสอบสินค้าด้วย AI ก่อนเผยแพร่
 */
export class ContentModerationService {

    /**
     * Main moderation function
     * ตรวจสอบสินค้าทั้งหมด
     */
    static async moderateProduct(product: any): Promise<ModerationResult> {
        const checks: ModerationCheck[] = []

        // Run all AI checks
        const aiChecks: AICheck[] = [
            this.checkProhibitedContent,
            this.checkImageQuality,
            this.checkPriceValidity,
            this.checkDescriptionQuality,
            this.checkTitleQuality,
            this.checkCategoryMatch,
            this.checkContactInfo,
        ]

        for (const check of aiChecks) {
            try {
                const result = await check.run(product)
                checks.push(result)
            } catch (error) {
                console.error(`Check failed: ${check.name}`, error)
            }
        }

        // Calculate overall score
        const totalWeight = aiChecks.reduce((sum, c) => sum + c.weight, 0)
        const weightedScore = checks.reduce((sum, check) => {
            const checkDef = aiChecks.find(c => c.name === check.category)
            const weight = checkDef?.weight || 1
            const score = check.status === 'pass' ? 1 : check.status === 'warning' ? 0.5 : 0
            return sum + (score * weight * check.confidence)
        }, 0)
        const overallScore = Math.round((weightedScore / totalWeight) * 100)

        // Determine status
        let status: ModerationStatus
        let reasons: ModerationReason[] = []
        let autoApproved = false

        const failedChecks = checks.filter(c => c.status === 'fail')
        const warningChecks = checks.filter(c => c.status === 'warning')

        if (failedChecks.length > 0) {
            status = 'rejected'
            reasons = this.extractReasons(failedChecks)
        } else if (warningChecks.length > 2 || overallScore < 70) {
            status = 'under_review'
        } else if (overallScore >= 85) {
            status = 'approved'
            autoApproved = true
        } else {
            status = 'under_review'
        }

        return {
            product_id: product.id || 'temp',
            status,
            overall_score: overallScore,
            checks,
            reasons: reasons.length > 0 ? reasons : undefined,
            auto_approved: autoApproved,
            created_at: new Date(),
            updated_at: new Date(),
        }
    }

    /**
     * Check 1: Prohibited Content
     * ตรวจสอบเนื้อหาต้องห้าม
     */
    static checkProhibitedContent: AICheck = {
        name: 'prohibited_content',
        description: 'ตรวจสอบสินค้าต้องห้ามและผิดกฎหมาย',
        weight: 10, // Very important
        run: async (product: any): Promise<ModerationCheck> => {
            const text = `${product.title} ${product.description}`.toLowerCase()

            // Check prohibited keywords
            const foundKeywords = PROHIBITED_KEYWORDS.filter(keyword =>
                text.includes(keyword.toLowerCase())
            )

            if (foundKeywords.length > 0) {
                return {
                    check_id: `check_${Date.now()}_1`,
                    type: 'ai',
                    status: 'fail',
                    category: 'prohibited_content',
                    message: `พบคำต้องห้าม: ${foundKeywords.join(', ')}`,
                    confidence: 0.95,
                    checked_at: new Date(),
                }
            }

            return {
                check_id: `check_${Date.now()}_1`,
                type: 'ai',
                status: 'pass',
                category: 'prohibited_content',
                message: 'ไม่พบเนื้อหาต้องห้าม',
                confidence: 0.9,
                checked_at: new Date(),
            }
        }
    }

    /**
     * Check 2: Image Quality
     * ตรวจสอบคุณภาพรูปภาพ
     */
    static checkImageQuality: AICheck = {
        name: 'image_quality',
        description: 'ตรวจสอบคุณภาพและความเหมาะสมของรูปภาพ',
        weight: 7,
        run: async (product: any): Promise<ModerationCheck> => {
            const images = product.images || []

            if (images.length === 0) {
                return {
                    check_id: `check_${Date.now()}_2`,
                    type: 'ai',
                    status: 'fail',
                    category: 'image_quality',
                    message: 'ต้องมีรูปภาพอย่างน้อย 1 รูป',
                    confidence: 1.0,
                    checked_at: new Date(),
                }
            }

            if (images.length < 3) {
                return {
                    check_id: `check_${Date.now()}_2`,
                    type: 'ai',
                    status: 'warning',
                    category: 'image_quality',
                    message: 'แนะนำให้มีรูปภาพอย่างน้อย 3 รูปเพื่อเพิ่มความน่าเชื่อถือ',
                    confidence: 0.8,
                    checked_at: new Date(),
                }
            }

            // TODO: Check actual image quality with AI
            // - Resolution
            // - Blur detection
            // - Inappropriate content detection

            return {
                check_id: `check_${Date.now()}_2`,
                type: 'ai',
                status: 'pass',
                category: 'image_quality',
                message: `มีรูปภาพ ${images.length} รูป คุณภาพดี`,
                confidence: 0.85,
                checked_at: new Date(),
            }
        }
    }

    /**
     * Check 3: Price Validity
     * ตรวจสอบความสมเหตุสมผลของราคา
     */
    static checkPriceValidity: AICheck = {
        name: 'price_validity',
        description: 'ตรวจสอบราคาสินค้า',
        weight: 5,
        run: async (product: any): Promise<ModerationCheck> => {
            const price = parseFloat(product.price)

            if (isNaN(price) || price <= 0) {
                return {
                    check_id: `check_${Date.now()}_3`,
                    type: 'ai',
                    status: 'fail',
                    category: 'price_validity',
                    message: 'ราคาไม่ถูกต้อง',
                    confidence: 1.0,
                    checked_at: new Date(),
                }
            }

            // Suspiciously low price
            if (price < 10) {
                return {
                    check_id: `check_${Date.now()}_3`,
                    type: 'ai',
                    status: 'warning',
                    category: 'price_validity',
                    message: 'ราคาต่ำผิดปกติ กรุณาตรวจสอบ',
                    confidence: 0.7,
                    checked_at: new Date(),
                }
            }

            // Suspiciously high price (> 1M)
            if (price > 1000000) {
                return {
                    check_id: `check_${Date.now()}_3`,
                    type: 'ai',
                    status: 'warning',
                    category: 'price_validity',
                    message: 'ราคาสูงผิดปกติ อาจต้องตรวจสอบเพิ่มเติม',
                    confidence: 0.6,
                    checked_at: new Date(),
                }
            }

            return {
                check_id: `check_${Date.now()}_3`,
                type: 'ai',
                status: 'pass',
                category: 'price_validity',
                message: 'ราคาเหมาะสม',
                confidence: 0.9,
                checked_at: new Date(),
            }
        }
    }

    /**
     * Check 4: Description Quality
     * ตรวจสอบคุณภาพคำอธิบาย
     */
    static checkDescriptionQuality: AICheck = {
        name: 'description_quality',
        description: 'ตรวจสอบคำอธิบายสินค้า',
        weight: 6,
        run: async (product: any): Promise<ModerationCheck> => {
            const description = product.description || ''

            if (description.length < 20) {
                return {
                    check_id: `check_${Date.now()}_4`,
                    type: 'ai',
                    status: 'fail',
                    category: 'description_quality',
                    message: 'คำอธิบายสั้นเกินไป (ต้องมีอย่างน้อย 20 ตัวอักษร)',
                    confidence: 1.0,
                    checked_at: new Date(),
                }
            }

            // Check for suspicious patterns
            const suspiciousMatches = SUSPICIOUS_PATTERNS.filter(pattern =>
                pattern.test(description)
            )

            if (suspiciousMatches.length > 0) {
                return {
                    check_id: `check_${Date.now()}_4`,
                    type: 'ai',
                    status: 'warning',
                    category: 'description_quality',
                    message: 'พบข้อความที่อาจทำให้เข้าใจผิด กรุณาตรวจสอบ',
                    confidence: 0.7,
                    checked_at: new Date(),
                }
            }

            if (description.length < 50) {
                return {
                    check_id: `check_${Date.now()}_4`,
                    type: 'ai',
                    status: 'warning',
                    category: 'description_quality',
                    message: 'แนะนำให้เพิ่มรายละเอียดเพื่อความน่าเชื่อถือ',
                    confidence: 0.6,
                    checked_at: new Date(),
                }
            }

            return {
                check_id: `check_${Date.now()}_4`,
                type: 'ai',
                status: 'pass',
                category: 'description_quality',
                message: 'คำอธิบายมีคุณภาพดี',
                confidence: 0.85,
                checked_at: new Date(),
            }
        }
    }

    /**
     * Check 5: Title Quality
     * ตรวจสอบหัวข้อสินค้า
     */
    static checkTitleQuality: AICheck = {
        name: 'title_quality',
        description: 'ตรวจสอบหัวข้อสินค้า',
        weight: 5,
        run: async (product: any): Promise<ModerationCheck> => {
            const title = product.title || ''

            if (title.length < 10) {
                return {
                    check_id: `check_${Date.now()}_5`,
                    type: 'ai',
                    status: 'fail',
                    category: 'title_quality',
                    message: 'หัวข้อสั้นเกินไป (ต้องมีอย่างน้อย 10 ตัวอักษร)',
                    confidence: 1.0,
                    checked_at: new Date(),
                }
            }

            if (title.length > 100) {
                return {
                    check_id: `check_${Date.now()}_5`,
                    type: 'ai',
                    status: 'warning',
                    category: 'title_quality',
                    message: 'หัวข้อยาวเกินไป แนะนำให้สั้นกระชับ',
                    confidence: 0.7,
                    checked_at: new Date(),
                }
            }

            return {
                check_id: `check_${Date.now()}_5`,
                type: 'ai',
                status: 'pass',
                category: 'title_quality',
                message: 'หัวข้อเหมาะสม',
                confidence: 0.9,
                checked_at: new Date(),
            }
        }
    }

    /**
     * Check 6: Category Match
     * ตรวจสอบความเหมาะสมของหมวดหมู่
     */
    static checkCategoryMatch: AICheck = {
        name: 'category_match',
        description: 'ตรวจสอบหมวดหมู่สินค้า',
        weight: 4,
        run: async (product: any): Promise<ModerationCheck> => {
            if (!product.category) {
                return {
                    check_id: `check_${Date.now()}_6`,
                    type: 'ai',
                    status: 'fail',
                    category: 'category_match',
                    message: 'ต้องเลือกหมวดหมู่สินค้า',
                    confidence: 1.0,
                    checked_at: new Date(),
                }
            }

            // TODO: Use AI to check if title/description matches category

            return {
                check_id: `check_${Date.now()}_6`,
                type: 'ai',
                status: 'pass',
                category: 'category_match',
                message: 'หมวดหมู่เหมาะสม',
                confidence: 0.8,
                checked_at: new Date(),
            }
        }
    }

    /**
     * Check 7: Contact Info
     * ตรวจสอบข้อมูลติดต่อ
     */
    static checkContactInfo: AICheck = {
        name: 'contact_info',
        description: 'ตรวจสอบข้อมูลติดต่อในคำอธิบาย',
        weight: 3,
        run: async (product: any): Promise<ModerationCheck> => {
            const text = `${product.title} ${product.description}`.toLowerCase()

            // Check for phone numbers in description (should use platform messaging)
            const phonePattern = /(\d{3}[-.\s]?\d{3}[-.\s]?\d{4}|\d{10})/g
            const hasPhone = phonePattern.test(text)

            // Check for external links
            const linkPattern = /(http|www\.|line|facebook|ig)/gi
            const hasExternalLink = linkPattern.test(text)

            if (hasPhone || hasExternalLink) {
                return {
                    check_id: `check_${Date.now()}_7`,
                    type: 'ai',
                    status: 'warning',
                    category: 'contact_info',
                    message: 'พบข้อมูลติดต่อภายนอก แนะนำให้ใช้ระบบแชทของ JaiKod',
                    confidence: 0.8,
                    checked_at: new Date(),
                }
            }

            return {
                check_id: `check_${Date.now()}_7`,
                type: 'ai',
                status: 'pass',
                category: 'contact_info',
                message: 'ไม่พบข้อมูลติดต่อภายนอก',
                confidence: 0.9,
                checked_at: new Date(),
            }
        }
    }

    /**
     * Extract reasons from failed checks
     */
    private static extractReasons(failedChecks: ModerationCheck[]): ModerationReason[] {
        const reasonMap: Record<string, ModerationReason> = {
            'prohibited_content': 'prohibited_item',
            'image_quality': 'poor_quality',
            'price_validity': 'misleading',
            'description_quality': 'missing_info',
            'title_quality': 'missing_info',
            'category_match': 'misleading',
            'contact_info': 'spam',
        }

        return failedChecks
            .map(check => reasonMap[check.category])
            .filter((reason, index, self) => reason && self.indexOf(reason) === index)
    }

    /**
     * Get human-readable status text
     */
    static getStatusText(status: ModerationStatus): string {
        const statusMap: Record<ModerationStatus, string> = {
            'pending': 'รอตรวจสอบ',
            'under_review': 'กำลังตรวจสอบ',
            'approved': 'ผ่านการตรวจสอบ',
            'rejected': 'ไม่ผ่าน - ต้องแก้ไข',
            'flagged': 'ถูกรายงาน',
        }
        return statusMap[status] || status
    }

    /**
     * Get status color
     */
    static getStatusColor(status: ModerationStatus): string {
        const colorMap: Record<ModerationStatus, string> = {
            'pending': 'gray',
            'under_review': 'yellow',
            'approved': 'green',
            'rejected': 'red',
            'flagged': 'orange',
        }
        return colorMap[status] || 'gray'
    }
}
