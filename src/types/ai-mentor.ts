import { SellerType } from './onboarding'

export type MentorContext =
    | 'onboarding_start'
    | 'goal_selection'
    | 'checklist_phone'
    | 'checklist_kyc'
    | 'checklist_bank'
    | 'checklist_product'
    | 'checklist_shipping'
    | 'checklist_bulk'
    | 'first_product'
    | 'pricing'
    | 'description'
    | 'images'
    | 'category'
    | 'completed'

export interface MentorMessage {
    context: MentorContext
    role?: SellerType
    language: 'th' | 'en'
    message: string
    tip?: string
    canSkip?: boolean
    priority?: 'low' | 'medium' | 'high'
}

// AI Mentor Messages Database
export const MENTOR_MESSAGES: Record<MentorContext, {
    th: { message: string; tip?: string; canSkip?: boolean }
    en: { message: string; tip?: string; canSkip?: boolean }
}> = {
    onboarding_start: {
        th: {
            message: 'สวัสดีครับ! ยินดีต้อนรับสู่ JaiKod 👋 ผมจะช่วยแนะนำคุณทีละขั้นตอนนะครับ ไม่ต้องกังวล ทุกอย่างง่ายมาก',
            tip: 'เริ่มต้นด้วยการบอกเป้าหมายของคุณก่อนนะครับ',
            canSkip: false
        },
        en: {
            message: 'Hello! Welcome to JaiKod 👋 I\'ll guide you step by step. Don\'t worry, it\'s super easy!',
            tip: 'Let\'s start by choosing your goal',
            canSkip: false
        }
    },
    goal_selection: {
        th: {
            message: 'คุณอยากขายแบบไหนครับ? เลือกตามความต้องการของคุณเลย ไม่มีผิด-ถูก',
            tip: 'เลือกตามจริง ๆ นะครับ เพราะเราจะปรับเครื่องมือให้เหมาะกับคุณ',
            canSkip: true
        },
        en: {
            message: 'How would you like to sell? Choose what fits you best - there\'s no wrong answer!',
            tip: 'Be honest! We\'ll customize tools just for you',
            canSkip: true
        }
    },
    checklist_phone: {
        th: {
            message: 'ยืนยันเบอร์โทรเพื่อความปลอดภัยครับ ใช้เวลาแค่ 1 นาที',
            tip: 'ลูกค้าจะมั่นใจมากขึ้นถ้าคุณยืนยันเบอร์แล้ว',
            canSkip: true
        },
        en: {
            message: 'Verify your phone for security. Takes just 1 minute!',
            tip: 'Buyers trust verified sellers more',
            canSkip: true
        }
    },
    checklist_kyc: {
        th: {
            message: 'ยืนยันตัวตนด้วยบัตรประชาชนครับ ช่วยสร้างความน่าเชื่อถือ',
            tip: 'ข้อมูลของคุณปลอดภัย เราเก็บแบบเข้ารหัส',
            canSkip: true
        },
        en: {
            message: 'Verify your identity with ID card. Builds trust with buyers!',
            tip: 'Your data is encrypted and secure',
            canSkip: true
        }
    },
    checklist_bank: {
        th: {
            message: 'เพิ่มบัญชีธนาคารเพื่อรับเงินครับ ไม่ยุ่งยาก กรอกแค่เลขบัญชี',
            tip: 'แนะนำให้ทำก่อนขายสินค้าแรก จะได้รับเงินได้เลย',
            canSkip: true
        },
        en: {
            message: 'Add your bank account to receive payments. Just enter your account number!',
            tip: 'Better to do this before your first sale',
            canSkip: true
        }
    },
    checklist_product: {
        th: {
            message: 'ถึงเวลาโพสสินค้าแรกแล้ว! 🎉 AI จะช่วยเติมรายละเอียดให้',
            tip: 'แค่ถ่ายรูป AI จะช่วยเดาราคาและเขียนคำอธิบายให้',
            canSkip: false
        },
        en: {
            message: 'Time to post your first product! 🎉 AI will help fill in the details',
            tip: 'Just take a photo, AI will suggest price and description',
            canSkip: false
        }
    },
    checklist_shipping: {
        th: {
            message: 'ตั้งค่าการจัดส่งครับ เลือกได้ว่าจะส่งแบบไหน',
            tip: 'ถ้ายังไม่แน่ใจ เลือก "มาตรฐาน" ไปก่อนได้',
            canSkip: true
        },
        en: {
            message: 'Set up shipping options. Choose how you want to deliver',
            tip: 'Not sure? Start with "Standard" for now',
            canSkip: true
        }
    },
    checklist_bulk: {
        th: {
            message: 'นำเข้าสินค้าจำนวนมากด้วย Excel ครับ ประหยัดเวลามาก',
            tip: 'มีเทมเพลตให้ดาวน์โหลด กรอกแล้วอัปโหลดเลย',
            canSkip: true
        },
        en: {
            message: 'Import multiple products with Excel. Saves tons of time!',
            tip: 'Download our template, fill it, and upload',
            canSkip: true
        }
    },
    first_product: {
        th: {
            message: 'มาเริ่มกันเลย! ถ่ายรูปสินค้าให้ชัด ๆ นะครับ ยิ่งสวยยิ่งขายดี',
            tip: 'ถ่ายในที่แสงสว่าง พื้นหลังเรียบ ๆ จะดูดีที่สุด',
            canSkip: false
        },
        en: {
            message: 'Let\'s start! Take clear photos of your product. Better photos = more sales',
            tip: 'Good lighting + clean background = best results',
            canSkip: false
        }
    },
    pricing: {
        th: {
            message: 'AI แนะนำราคาให้แล้ว แต่คุณปรับได้นะครับ',
            tip: 'ลองดูราคา "ขายไว" ถ้าอยากขายเร็ว หรือ "กำไร" ถ้าไม่รีบ',
            canSkip: false
        },
        en: {
            message: 'AI suggested a price, but you can adjust it!',
            tip: 'Try "Quick Sell" for fast sales, or "Profit" if not urgent',
            canSkip: false
        }
    },
    description: {
        th: {
            message: 'AI เขียนคำอธิบายให้แล้ว ลองอ่านดูครับ ถ้าไม่ชอบแก้ได้',
            tip: 'บอกสภาพสินค้าตรง ๆ จะช่วยสร้างความเชื่อถือ',
            canSkip: false
        },
        en: {
            message: 'AI wrote a description for you. Read it and edit if needed!',
            tip: 'Be honest about condition - builds trust',
            canSkip: false
        }
    },
    images: {
        th: {
            message: 'รูปเยอะ = โอกาสขายสูง! แนะนำอย่างน้อย 3 รูป',
            tip: 'ถ่ายมุมต่าง ๆ ให้ครบ หน้า-หลัง-ข้าง-รายละเอียด',
            canSkip: false
        },
        en: {
            message: 'More photos = higher chance to sell! At least 3 recommended',
            tip: 'Show different angles - front, back, sides, details',
            canSkip: false
        }
    },
    category: {
        th: {
            message: 'AI เดาหมวดหมู่ให้แล้ว ถ้าไม่ถูกแก้ได้นะครับ',
            tip: 'หมวดหมู่ถูกต้อง = ลูกค้าหาเจอง่าย',
            canSkip: false
        },
        en: {
            message: 'AI guessed the category. Change it if wrong!',
            tip: 'Correct category = easier for buyers to find',
            canSkip: false
        }
    },
    completed: {
        th: {
            message: 'เยี่ยมเลย! 🎉 คุณพร้อมขายแล้ว ขอให้ขายดีนะครับ',
            tip: 'ตอบแชทลูกค้าเร็ว ๆ จะช่วยเพิ่มโอกาสขายได้เยอะ',
            canSkip: false
        },
        en: {
            message: 'Awesome! 🎉 You\'re ready to sell. Good luck!',
            tip: 'Reply to buyers quickly to increase sales',
            canSkip: false
        }
    }
}

// Role-specific mentor tips
export const ROLE_SPECIFIC_TIPS: Record<SellerType, {
    th: string[]
    en: string[]
}> = {
    individual: {
        th: [
            'เริ่มต้นง่าย ๆ ไม่ต้องเปิดร้าน โพสได้เลย',
            'ถ่ายรูปด้วยมือถือก็ได้ แค่ให้ชัด',
            'ตั้งราคาตามใจ ปรับได้ทุกเมื่อ'
        ],
        en: [
            'Start simple - no shop needed, just post',
            'Phone photos are fine, just keep them clear',
            'Set your own price, adjust anytime'
        ]
    },
    pro: {
        th: [
            'ร้านของคุณจะมีหน้าตาเป็นของตัวเอง',
            'ใช้เครื่องมือวิเคราะห์ดูว่าสินค้าไหนขายดี',
            'ตั้งแคมเปญลดราคาได้ด้วยตัวเอง'
        ],
        en: [
            'Your shop will have its own unique look',
            'Use analytics to see what sells best',
            'Create your own discount campaigns'
        ]
    },
    mall: {
        th: [
            'เชื่อมต่อระบบของคุณผ่าน API ได้',
            'จัดการทีมงานและมอบหมายงาน',
            'AI จะช่วยคาดการณ์สต็อกให้'
        ],
        en: [
            'Connect your systems via API',
            'Manage team and assign tasks',
            'AI will forecast your inventory needs'
        ]
    }
}

// Get mentor message for context
export function getMentorMessage(
    context: MentorContext,
    language: 'th' | 'en',
    role?: SellerType
): MentorMessage {
    const baseMessage = MENTOR_MESSAGES[context][language]

    return {
        context,
        role,
        language,
        message: baseMessage.message,
        tip: baseMessage.tip,
        canSkip: baseMessage.canSkip,
        priority: context.includes('checklist') ? 'medium' : 'high'
    }
}

// Get role-specific tip
export function getRoleTip(role: SellerType, language: 'th' | 'en'): string {
    const tips = ROLE_SPECIFIC_TIPS[role][language]
    return tips[Math.floor(Math.random() * tips.length)]
}
