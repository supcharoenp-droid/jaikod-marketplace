'use client'

import { useState, useMemo } from 'react'
import {
    Store, ChevronRight, ChevronLeft, Check, Clock,
    Sparkles, ArrowRight, User2, Building2, BadgeCheck,
    Camera, FileText, CreditCard, Truck, Package, Brain,
    PartyPopper, AlertCircle, Star, TrendingUp, Zap
} from 'lucide-react'
import {
    WizardState, WizardStepId, StoreTypeOption, WizardStep,
    WIZARD_STEPS, STORE_TYPE_OPTIONS,
    getStepsForStoreType, getEstimatedTotalTime, getProgressPercentage,
    initialWizardState
} from '@/lib/store-wizard/types'

// ==========================================
// STEP ICONS
// ==========================================

const StepIcons: Record<WizardStepId, React.ReactNode> = {
    welcome: <Store className="w-6 h-6" />,
    store_type: <Building2 className="w-6 h-6" />,
    basic_info: <FileText className="w-6 h-6" />,
    business_verification: <BadgeCheck className="w-6 h-6" />,
    store_branding: <Camera className="w-6 h-6" />,
    payment_setup: <CreditCard className="w-6 h-6" />,
    shipping_config: <Truck className="w-6 h-6" />,
    first_product: <Package className="w-6 h-6" />,
    ai_analysis: <Brain className="w-6 h-6" />,
    completion: <PartyPopper className="w-6 h-6" />
}

// ==========================================
// STORE TYPE CARD COMPONENT
// ==========================================

interface StoreTypeCardProps {
    option: StoreTypeOption
    selected: boolean
    onClick: () => void
}

function StoreTypeCard({ option, selected, onClick }: StoreTypeCardProps) {
    return (
        <button
            onClick={onClick}
            className={`
                relative w-full text-left p-6 rounded-2xl border-2 transition-all duration-300
                ${selected
                    ? 'border-neon-purple bg-neon-purple/5 shadow-lg shadow-neon-purple/20 scale-[1.02]'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }
            `}
        >
            {/* Recommended Badge */}
            {option.id === 'general_store' && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-xs font-bold rounded-full shadow-sm">
                    ⭐ แนะนำ
                </div>
            )}

            {/* Icon & Title */}
            <div className="flex items-start gap-4 mb-4">
                <div className={`
                    w-14 h-14 rounded-xl bg-gradient-to-br ${option.gradient} 
                    flex items-center justify-center text-white text-2xl shadow-lg
                `}>
                    {option.icon}
                </div>
                <div className="flex-1">
                    <h3 className="font-bold text-lg">{option.name_th}</h3>
                    <p className="text-sm text-text-secondary">{option.tagline_th}</p>
                </div>
                {selected && (
                    <div className="w-8 h-8 rounded-full bg-neon-purple flex items-center justify-center">
                        <Check className="w-5 h-5 text-white" />
                    </div>
                )}
            </div>

            {/* Features */}
            <ul className="space-y-2 mb-4">
                {option.features_th.slice(0, 4).map((feature, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm">
                        <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                        <span className="text-text-secondary">{feature}</span>
                    </li>
                ))}
                {option.features_th.length > 4 && (
                    <li className="text-sm text-neon-purple font-medium">
                        + อีก {option.features_th.length - 4} ฟีเจอร์
                    </li>
                )}
            </ul>

            {/* Stats */}
            <div className="flex items-center gap-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                <div className="text-center">
                    <div className="text-lg font-bold">
                        {option.listing_limit === null ? '∞' : option.listing_limit}
                    </div>
                    <div className="text-xs text-text-secondary">รายการ</div>
                </div>
                <div className="w-px h-8 bg-gray-200 dark:bg-gray-700" />
                <div className="text-center">
                    <div className="text-lg font-bold text-emerald-600">{option.commission_rate}%</div>
                    <div className="text-xs text-text-secondary">ค่าธรรมเนียม</div>
                </div>
                <div className="w-px h-8 bg-gray-200 dark:bg-gray-700" />
                <div className="text-center">
                    <div className="text-lg font-bold text-blue-600">
                        {option.monthly_fee === 0 ? 'ฟรี' : `฿${option.monthly_fee}`}
                    </div>
                    <div className="text-xs text-text-secondary">ต่อเดือน</div>
                </div>
            </div>
        </button>
    )
}

// ==========================================
// PROGRESS BAR COMPONENT
// ==========================================

interface ProgressBarProps {
    steps: WizardStep[]
    currentStep: WizardStepId
    completedSteps: WizardStepId[]
}

function ProgressBar({ steps, currentStep, completedSteps }: ProgressBarProps) {
    const currentIndex = steps.findIndex(s => s.id === currentStep)
    const progress = ((currentIndex + 1) / steps.length) * 100

    return (
        <div className="mb-8">
            {/* Progress Line */}
            <div className="relative h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mb-4">
                <div
                    className="absolute left-0 top-0 h-full bg-gradient-to-r from-neon-purple to-neon-pink transition-all duration-500"
                    style={{ width: `${progress}%` }}
                />
            </div>

            {/* Step Indicators */}
            <div className="flex justify-between">
                {steps.map((step, index) => {
                    const isCompleted = completedSteps.includes(step.id)
                    const isCurrent = step.id === currentStep
                    const isPast = index < currentIndex

                    return (
                        <div
                            key={step.id}
                            className={`
                                flex flex-col items-center gap-1 transition-all
                                ${isCurrent ? 'scale-110' : ''}
                            `}
                        >
                            <div className={`
                                w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
                                ${isCompleted ? 'bg-emerald-500 text-white' : ''}
                                ${isCurrent ? 'bg-neon-purple text-white shadow-lg shadow-neon-purple/30' : ''}
                                ${!isCompleted && !isCurrent ? 'bg-gray-200 dark:bg-gray-700 text-gray-500' : ''}
                            `}>
                                {isCompleted ? <Check className="w-4 h-4" /> : index + 1}
                            </div>
                            {isCurrent && (
                                <span className="text-xs font-medium text-neon-purple hidden md:block">
                                    {step.title_th}
                                </span>
                            )}
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

// ==========================================
// WELCOME STEP
// ==========================================

interface WelcomeStepProps {
    onNext: () => void
    estimatedTime: number
}

function WelcomeStep({ onNext, estimatedTime }: WelcomeStepProps) {
    return (
        <div className="text-center max-w-2xl mx-auto py-8">
            {/* Hero Animation */}
            <div className="relative w-32 h-32 mx-auto mb-8">
                <div className="absolute inset-0 bg-gradient-to-br from-neon-purple to-neon-pink rounded-3xl animate-pulse" />
                <div className="absolute inset-2 bg-white dark:bg-gray-900 rounded-2xl flex items-center justify-center">
                    <Store className="w-16 h-16 text-neon-purple" />
                </div>
                <div className="absolute -right-2 -top-2 w-8 h-8 bg-amber-400 rounded-full flex items-center justify-center animate-bounce">
                    <Sparkles className="w-5 h-5 text-white" />
                </div>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold mb-4">
                ยินดีต้อนรับสู่ <span className="text-neon-purple">JaiKod</span>
            </h1>

            <p className="text-lg text-text-secondary mb-8">
                เริ่มต้นขายสินค้าของคุณได้ง่ายๆ ด้วยระบบช่วยสร้างร้านค้าอัจฉริยะ
            </p>

            {/* Benefits */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                {[
                    { icon: Zap, title: 'เริ่มต้นเร็ว', desc: 'ตั้งค่าเสร็จใน 5 นาที' },
                    { icon: Brain, title: 'AI ช่วยเหลือ', desc: 'แนะนำวิธีขายให้ดีขึ้น' },
                    { icon: TrendingUp, title: 'เติบโตได้', desc: 'อัปเกรดเมื่อพร้อม' }
                ].map((item, i) => (
                    <div key={i} className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                        <item.icon className="w-8 h-8 text-neon-purple mx-auto mb-2" />
                        <h3 className="font-semibold mb-1">{item.title}</h3>
                        <p className="text-sm text-text-secondary">{item.desc}</p>
                    </div>
                ))}
            </div>

            {/* Time Estimate */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-full text-sm mb-8">
                <Clock className="w-4 h-4" />
                <span>ใช้เวลาประมาณ {estimatedTime} นาที</span>
            </div>

            <button
                onClick={onNext}
                className="w-full md:w-auto px-8 py-4 bg-gradient-to-r from-neon-purple to-neon-pink text-white font-bold rounded-xl shadow-lg shadow-neon-purple/30 hover:shadow-xl hover:shadow-neon-purple/40 transition-all flex items-center justify-center gap-2 mx-auto"
            >
                <span>เริ่มต้นสร้างร้านค้า</span>
                <ArrowRight className="w-5 h-5" />
            </button>
        </div>
    )
}

// ==========================================
// STORE TYPE STEP
// ==========================================

interface StoreTypeStepProps {
    selectedType: 'individual' | 'general_store' | 'official_store' | null
    onSelect: (type: 'individual' | 'general_store' | 'official_store') => void
    onNext: () => void
    onBack: () => void
}

function StoreTypeStep({ selectedType, onSelect, onNext, onBack }: StoreTypeStepProps) {
    return (
        <div>
            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold mb-2">เลือกประเภทร้านค้า</h2>
                <p className="text-text-secondary">เลือกแบบที่เหมาะกับคุณ สามารถอัปเกรดได้ภายหลัง</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {STORE_TYPE_OPTIONS.map(option => (
                    <StoreTypeCard
                        key={option.id}
                        option={option}
                        selected={selectedType === option.id}
                        onClick={() => onSelect(option.id)}
                    />
                ))}
            </div>

            {/* Requirements Notice */}
            {selectedType === 'official_store' && (
                <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl mb-8">
                    <div className="flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                        <div>
                            <h4 className="font-semibold text-amber-800 dark:text-amber-200 mb-1">
                                ต้องมีเอกสารธุรกิจ
                            </h4>
                            <p className="text-sm text-amber-700 dark:text-amber-300">
                                ร้านค้าทางการต้องมีหลักฐานจดทะเบียนธุรกิจ เช่น หนังสือรับรอง ภ.พ.20 หรือ ทะเบียนพาณิชย์
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between">
                <button
                    onClick={onBack}
                    className="px-6 py-3 text-text-secondary hover:text-text-primary flex items-center gap-2"
                >
                    <ChevronLeft className="w-5 h-5" />
                    <span>ย้อนกลับ</span>
                </button>

                <button
                    onClick={onNext}
                    disabled={!selectedType}
                    className={`
                        px-8 py-3 rounded-xl font-semibold flex items-center gap-2
                        ${selectedType
                            ? 'bg-neon-purple text-white hover:bg-neon-purple/90'
                            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        }
                    `}
                >
                    <span>ถัดไป</span>
                    <ChevronRight className="w-5 h-5" />
                </button>
            </div>
        </div>
    )
}

// ==========================================
// MAIN WIZARD COMPONENT
// ==========================================

export default function StoreSetupWizard() {
    const [state, setState] = useState<WizardState>({
        ...initialWizardState,
        started_at: new Date(),
        last_updated: new Date()
    })

    const steps = useMemo(() => {
        if (!state.selected_store_type) return WIZARD_STEPS.slice(0, 2) // Only welcome and store_type
        return getStepsForStoreType(state.selected_store_type)
    }, [state.selected_store_type])

    const estimatedTime = useMemo(() => {
        if (!state.selected_store_type) return 10
        return getEstimatedTotalTime(state.selected_store_type)
    }, [state.selected_store_type])

    const currentStepIndex = steps.findIndex(s => s.id === state.current_step)

    const goNext = () => {
        if (currentStepIndex < steps.length - 1) {
            setState(prev => ({
                ...prev,
                completed_steps: [...prev.completed_steps, prev.current_step],
                current_step: steps[currentStepIndex + 1].id,
                last_updated: new Date()
            }))
        }
    }

    const goBack = () => {
        if (currentStepIndex > 0) {
            setState(prev => ({
                ...prev,
                current_step: steps[currentStepIndex - 1].id,
                last_updated: new Date()
            }))
        }
    }

    const selectStoreType = (type: 'individual' | 'general_store' | 'official_store') => {
        setState(prev => ({
            ...prev,
            selected_store_type: type,
            last_updated: new Date()
        }))
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-bg-dark">
            {/* Header */}
            <div className="bg-white dark:bg-surface-dark border-b border-gray-100 dark:border-gray-800 sticky top-0 z-50">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-neon-purple to-neon-pink rounded-xl flex items-center justify-center">
                                <Store className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="font-bold">สร้างร้านค้า</h1>
                                <p className="text-xs text-text-secondary">
                                    ขั้นตอน {currentStepIndex + 1} จาก {steps.length}
                                </p>
                            </div>
                        </div>

                        <div className="hidden md:flex items-center gap-2 text-sm text-text-secondary">
                            <Clock className="w-4 h-4" />
                            <span>~{estimatedTime} นาที</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-8 max-w-5xl">
                {/* Progress */}
                {state.current_step !== 'welcome' && (
                    <ProgressBar
                        steps={steps}
                        currentStep={state.current_step}
                        completedSteps={state.completed_steps}
                    />
                )}

                {/* Step Content */}
                <div className="bg-white dark:bg-surface-dark rounded-2xl p-6 md:p-8 shadow-sm">
                    {state.current_step === 'welcome' && (
                        <WelcomeStep
                            onNext={goNext}
                            estimatedTime={estimatedTime}
                        />
                    )}

                    {state.current_step === 'store_type' && (
                        <StoreTypeStep
                            selectedType={state.selected_store_type}
                            onSelect={selectStoreType}
                            onNext={goNext}
                            onBack={goBack}
                        />
                    )}

                    {state.current_step === 'basic_info' && (
                        <div className="text-center py-12">
                            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <h2 className="text-xl font-bold mb-2">ข้อมูลพื้นฐาน</h2>
                            <p className="text-text-secondary mb-6">กรอกชื่อร้าน คำอธิบาย และข้อมูลติดต่อ</p>
                            <p className="text-sm text-text-secondary">(ฟอร์มจะถูกสร้างในขั้นตอนต่อไป)</p>

                            <div className="flex justify-between mt-8">
                                <button onClick={goBack} className="px-6 py-3 text-text-secondary hover:text-text-primary flex items-center gap-2">
                                    <ChevronLeft className="w-5 h-5" />
                                    <span>ย้อนกลับ</span>
                                </button>
                                <button onClick={goNext} className="px-8 py-3 bg-neon-purple text-white rounded-xl font-semibold flex items-center gap-2">
                                    <span>ถัดไป</span>
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Placeholder for other steps */}
                    {!['welcome', 'store_type', 'basic_info'].includes(state.current_step) && (
                        <div className="text-center py-12">
                            {StepIcons[state.current_step]}
                            <h2 className="text-xl font-bold mb-2 mt-4">
                                {steps.find(s => s.id === state.current_step)?.title_th}
                            </h2>
                            <p className="text-text-secondary mb-6">
                                {steps.find(s => s.id === state.current_step)?.description_th}
                            </p>

                            <div className="flex justify-between mt-8">
                                <button onClick={goBack} className="px-6 py-3 text-text-secondary hover:text-text-primary flex items-center gap-2">
                                    <ChevronLeft className="w-5 h-5" />
                                    <span>ย้อนกลับ</span>
                                </button>
                                <button onClick={goNext} className="px-8 py-3 bg-neon-purple text-white rounded-xl font-semibold flex items-center gap-2">
                                    <span>ถัดไป</span>
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
