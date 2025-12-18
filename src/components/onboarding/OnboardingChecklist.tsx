'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, Circle, Phone, CreditCard, Wallet, Package, FileText, Truck, Upload, Sparkles } from 'lucide-react'
import { SellerType } from '@/types/onboarding'
import AiMentorBubble from './AiMentorBubble'
import { getMentorMessage, MentorContext } from '@/types/ai-mentor'

interface ChecklistItem {
    id: string
    icon: any
    title: string
    description: string
    completed: boolean
    action?: () => void
}

interface OnboardingChecklistProps {
    sellerType: SellerType
    language: 'th' | 'en'
    checklist: {
        phone_verified: boolean
        id_verified: boolean
        bank_added: boolean
        first_product_posted: boolean
    }
    onItemClick: (itemId: string) => void
    onComplete: () => void
}

const CHECKLIST_ITEMS = {
    individual: {
        th: [
            {
                id: 'phone_verified',
                icon: Phone,
                title: 'ยืนยันเบอร์โทร',
                description: 'รับ OTP เพื่อความปลอดภัย'
            },
            {
                id: 'first_product_posted',
                icon: Package,
                title: 'โพสสินค้าชิ้นแรก',
                description: 'AI จะช่วยเติมรายละเอียดให้'
            }
        ],
        en: [
            {
                id: 'phone_verified',
                icon: Phone,
                title: 'Verify Phone Number',
                description: 'Receive OTP for security'
            },
            {
                id: 'first_product_posted',
                icon: Package,
                title: 'Post First Product',
                description: 'AI will help fill details'
            }
        ]
    },
    pro: {
        th: [
            {
                id: 'phone_verified',
                icon: Phone,
                title: 'ยืนยันเบอร์โทร',
                description: 'รับ OTP เพื่อความปลอดภัย'
            },
            {
                id: 'id_verified',
                icon: CreditCard,
                title: 'ยืนยันตัวตน (KYC)',
                description: 'อัปโหลดบัตรประชาชน'
            },
            {
                id: 'bank_added',
                icon: Wallet,
                title: 'ตั้งค่าบัญชีรับเงิน',
                description: 'เพื่อรับเงินจากการขาย'
            },
            {
                id: 'first_product_posted',
                icon: Package,
                title: 'โพสสินค้าชิ้นแรก',
                description: 'เริ่มต้นขายได้เลย'
            }
        ],
        en: [
            {
                id: 'phone_verified',
                icon: Phone,
                title: 'Verify Phone',
                description: 'OTP verification'
            },
            {
                id: 'id_verified',
                icon: CreditCard,
                title: 'Identity Verification',
                description: 'Upload ID card'
            },
            {
                id: 'bank_added',
                icon: Wallet,
                title: 'Add Bank Account',
                description: 'To receive payments'
            },
            {
                id: 'first_product_posted',
                icon: Package,
                title: 'Post First Product',
                description: 'Start selling now'
            }
        ]
    },
    mall: {
        th: [
            {
                id: 'phone_verified',
                icon: Phone,
                title: 'ยืนยันเบอร์โทร',
                description: 'รับ OTP'
            },
            {
                id: 'id_verified',
                icon: FileText,
                title: 'อัปโหลดเอกสารนิติบุคคล',
                description: 'ใบจดทะเบียนบริษัท'
            },
            {
                id: 'bank_added',
                icon: Wallet,
                title: 'ตั้งค่าบัญชีธุรกิจ',
                description: 'บัญชีบริษัท + ภาษี'
            },
            {
                id: 'shipping_setup',
                icon: Truck,
                title: 'ตั้งค่าการจัดส่ง',
                description: 'Standard / DHL / Custom'
            },
            {
                id: 'bulk_upload',
                icon: Upload,
                title: 'นำเข้าสินค้า',
                description: 'Excel / CSV / API'
            }
        ],
        en: [
            {
                id: 'phone_verified',
                icon: Phone,
                title: 'Verify Phone',
                description: 'OTP verification'
            },
            {
                id: 'id_verified',
                icon: FileText,
                title: 'Upload Business Docs',
                description: 'Company registration'
            },
            {
                id: 'bank_added',
                icon: Wallet,
                title: 'Business Account',
                description: 'Company bank + Tax'
            },
            {
                id: 'shipping_setup',
                icon: Truck,
                title: 'Setup Shipping',
                description: 'Standard / DHL / Custom'
            },
            {
                id: 'bulk_upload',
                icon: Upload,
                title: 'Import Products',
                description: 'Excel / CSV / API'
            }
        ]
    }
}

export default function OnboardingChecklist({
    sellerType,
    language,
    checklist,
    onItemClick,
    onComplete
}: OnboardingChecklistProps) {
    const items = CHECKLIST_ITEMS[sellerType][language]

    const copy = {
        th: {
            title: 'เริ่มต้นใช้งาน',
            subtitle: 'ทำตามขั้นตอนเหล่านี้เพื่อเริ่มขาย',
            aiMentor: 'AI Mentor พร้อมช่วยเหลือคุณทุกขั้นตอน',
            complete: 'เสร็จสิ้น',
            skip: 'ข้ามไปก่อน'
        },
        en: {
            title: 'Getting Started',
            subtitle: 'Complete these steps to start selling',
            aiMentor: 'AI Mentor ready to help at every step',
            complete: 'Complete',
            skip: 'Skip for now'
        }
    }

    const checklistWithStatus = items.map(item => ({
        ...item,
        completed: (checklist as any)[item.id] || false
    }))

    const completedCount = checklistWithStatus.filter(item => item.completed).length
    const progress = (completedCount / checklistWithStatus.length) * 100

    return (
        <div className="max-w-2xl mx-auto p-6">
            {/* Header */}
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    {copy[language].title}
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                    {copy[language].subtitle}
                </p>
            </div>

            {/* Progress Bar */}
            <div className="mb-8">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {completedCount} / {checklistWithStatus.length}
                    </span>
                    <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
                        {Math.round(progress)}%
                    </span>
                </div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.5, ease: 'easeOut' }}
                        className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
                    />
                </div>
            </div>

            {/* AI Mentor Hint */}
            <div className="mb-6 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-200 dark:border-purple-800 rounded-xl p-4 flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                    <p className="text-sm font-medium text-purple-900 dark:text-purple-100">
                        {copy[language].aiMentor}
                    </p>
                </div>
            </div>

            {/* AI Mentor - Dynamic based on next incomplete item */}
            {(() => {
                const nextIncomplete = checklistWithStatus.find(item => !item.completed)
                if (nextIncomplete) {
                    const contextMap: Record<string, MentorContext> = {
                        'phone_verified': 'checklist_phone',
                        'id_verified': 'checklist_kyc',
                        'bank_added': 'checklist_bank',
                        'first_product_posted': 'checklist_product',
                        'shipping_setup': 'checklist_shipping',
                        'bulk_upload': 'checklist_bulk'
                    }
                    const context = contextMap[nextIncomplete.id] || 'onboarding_start'
                    return (
                        <div className="mb-6">
                            <AiMentorBubble
                                message={getMentorMessage(context, language, sellerType)}
                                compact={true}
                            />
                        </div>
                    )
                }
                return null
            })()}

            {/* Checklist Items */}
            <div className="space-y-3">
                {checklistWithStatus.map((item, index) => {
                    const Icon = item.icon
                    return (
                        <motion.button
                            key={item.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            onClick={() => onItemClick(item.id)}
                            className={`w-full text-left p-4 rounded-xl border-2 transition-all ${item.completed
                                ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                                : 'border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-600 hover:shadow-md'
                                }`}
                        >
                            <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${item.completed
                                    ? 'bg-green-500'
                                    : 'bg-gray-100 dark:bg-gray-800'
                                    }`}>
                                    <Icon className={`w-6 h-6 ${item.completed ? 'text-white' : 'text-gray-600 dark:text-gray-400'
                                        }`} />
                                </div>
                                <div className="flex-1">
                                    <h3 className={`font-bold mb-1 ${item.completed
                                        ? 'text-green-900 dark:text-green-100'
                                        : 'text-gray-900 dark:text-white'
                                        }`}>
                                        {item.title}
                                    </h3>
                                    <p className={`text-sm ${item.completed
                                        ? 'text-green-700 dark:text-green-300'
                                        : 'text-gray-600 dark:text-gray-400'
                                        }`}>
                                        {item.description}
                                    </p>
                                </div>
                                {item.completed ? (
                                    <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0" />
                                ) : (
                                    <Circle className="w-6 h-6 text-gray-300 dark:text-gray-600 flex-shrink-0" />
                                )}
                            </div>
                        </motion.button>
                    )
                })}
            </div>

            {/* Footer Actions */}
            <div className="mt-8 flex items-center justify-between">
                <button
                    onClick={onComplete}
                    className="px-6 py-3 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white font-medium transition-colors"
                >
                    {copy[language].skip}
                </button>
                {progress === 100 && (
                    <motion.button
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        onClick={onComplete}
                        className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-bold hover:shadow-lg hover:scale-105 transition-all"
                    >
                        {copy[language].complete} ✨
                    </motion.button>
                )}
            </div>
        </div>
    )
}
