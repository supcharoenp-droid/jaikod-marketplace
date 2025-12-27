'use client'

import React, { useState, useEffect } from 'react'
import {
    Save, Store, Globe, Truck, CreditCard, Bell, Shield, Palette,
    User, Mail, Phone, MapPin, Camera, Check, ChevronRight, Sparkles,
    Moon, Sun, Building2, AlertCircle, Wallet, FileText, Clock,
    Users, Key, Bot, Zap, Upload, ExternalLink, Calendar,
    Ban, Eye, Settings, Package, TrendingUp, MessageSquare
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useLanguage } from '@/contexts/LanguageContext'
import { getSellerProfile, updateSellerProfile } from '@/lib/seller'

// ==================== Types ====================
interface SettingsTab {
    id: string
    labelTh: string
    labelEn: string
    icon: React.ElementType
    badge?: string
    isNew?: boolean
}

interface BankAccount {
    bankName: string
    accountNumber: string
    accountName: string
    branch: string
    isDefault: boolean
}

// ==================== Helper Components ====================
function SettingsSection({
    title,
    description,
    children,
    badge
}: {
    title: string
    description?: string
    children: React.ReactNode
    badge?: string
}) {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
            <div className="p-5 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
                <div>
                    <h3 className="font-bold text-lg text-gray-900 dark:text-white flex items-center gap-2">
                        {title}
                        {badge && (
                            <span className="px-2 py-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-xs rounded-full">
                                {badge}
                            </span>
                        )}
                    </h3>
                    {description && <p className="text-sm text-gray-500 mt-1">{description}</p>}
                </div>
            </div>
            <div className="p-5">{children}</div>
        </div>
    )
}

function ToggleSwitch({
    enabled,
    onChange,
    label,
    description
}: {
    enabled: boolean
    onChange: (val: boolean) => void
    label: string
    description?: string
}) {
    return (
        <div className="flex items-center justify-between py-3">
            <div>
                <p className="font-medium text-gray-900 dark:text-white">{label}</p>
                {description && <p className="text-sm text-gray-500">{description}</p>}
            </div>
            <button
                onClick={() => onChange(!enabled)}
                className={`relative w-12 h-6 rounded-full transition-colors ${enabled ? 'bg-indigo-600' : 'bg-gray-300 dark:bg-gray-600'}`}
            >
                <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${enabled ? 'translate-x-6' : ''}`} />
            </button>
        </div>
    )
}

function InputField({
    label,
    value,
    onChange,
    placeholder,
    type = 'text',
    icon: Icon,
    hint,
    required
}: {
    label: string
    value: string
    onChange: (val: string) => void
    placeholder?: string
    type?: string
    icon?: React.ElementType
    hint?: string
    required?: boolean
}) {
    return (
        <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {label}
                {required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <div className="relative">
                {Icon && <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />}
                <input
                    type={type}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    className={`w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all ${Icon ? 'pl-10' : ''}`}
                />
            </div>
            {hint && <p className="text-xs text-gray-400">{hint}</p>}
        </div>
    )
}

function SelectField({
    label,
    value,
    onChange,
    options,
    icon: Icon
}: {
    label: string
    value: string
    onChange: (val: string) => void
    options: { value: string; label: string }[]
    icon?: React.ElementType
}) {
    return (
        <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
            <div className="relative">
                {Icon && <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />}
                <select
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none ${Icon ? 'pl-10' : ''}`}
                >
                    {options.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                </select>
                <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 rotate-90" />
            </div>
        </div>
    )
}

// ==================== Main Component ====================
export default function SellerSettingsPageV3() {
    const { user, refreshProfile } = useAuth()
    const { t, language } = useLanguage()

    const [activeTab, setActiveTab] = useState('profile')
    const [loading, setLoading] = useState(false)
    const [saved, setSaved] = useState(false)

    // Form Data - All Settings
    const [formData, setFormData] = useState({
        // Profile
        shopName: '',
        shopNameEn: '',
        description: '',
        descriptionEn: '',
        contactEmail: '',
        contactPhone: '',
        shopCategory: 'general',

        // Branding
        primaryColor: '#6366F1',
        secondaryColor: '#8B5CF6',

        // Shipping
        shippingFeeDefault: 50,
        freeShippingMin: 500,
        enableCod: true,
        prepareTime: 24,

        // Payments
        bankName: '',
        accountNumber: '',
        accountName: '',
        promptPayId: '',
        payoutSchedule: 'weekly',

        // Business
        businessType: 'individual',
        taxId: '',

        // Policies
        returnDays: 7,
        warrantyDays: 30,

        // Vacation
        vacationMode: false,
        vacationMessage: '',

        // Notifications
        notifyNewOrder: true,
        notifyNewChat: true,
        notifyLowStock: true,
        notifyPromotion: false,
        notifyChannel: 'all',

        // Security
        twoFaEnabled: false,

        // Appearance
        theme: 'light',

        // AI
        aiAssistantEnabled: true,
        aiAutoReply: false,
        aiPricingSuggestion: true,
    })

    // Tabs Configuration
    const tabs: SettingsTab[] = [
        { id: 'profile', labelTh: 'ข้อมูลร้านค้า', labelEn: 'Shop Profile', icon: Store },
        { id: 'branding', labelTh: 'ภาพลักษณ์', labelEn: 'Branding', icon: Palette, isNew: true },
        { id: 'shipping', labelTh: 'การจัดส่ง', labelEn: 'Shipping', icon: Truck },
        { id: 'payments', labelTh: 'การชำระเงิน', labelEn: 'Payments', icon: Wallet, isNew: true },
        { id: 'business', labelTh: 'ข้อมูลธุรกิจ', labelEn: 'Business', icon: Building2 },
        { id: 'policies', labelTh: 'นโยบาย', labelEn: 'Policies', icon: FileText },
        { id: 'vacation', labelTh: 'โหมดพักร้าน', labelEn: 'Vacation', icon: Calendar },
        { id: 'notifications', labelTh: 'การแจ้งเตือน', labelEn: 'Notifications', icon: Bell },
        { id: 'security', labelTh: 'ความปลอดภัย', labelEn: 'Security', icon: Shield },
        { id: 'appearance', labelTh: 'หน้าตาแอป', labelEn: 'Appearance', icon: Eye },
        { id: 'ai', labelTh: 'AI & ระบบอัตโนมัติ', labelEn: 'AI & Automation', icon: Bot, badge: 'AI', isNew: true },
    ]

    // Fetch profile on mount
    useEffect(() => {
        const fetchProfile = async () => {
            if (user) {
                const profile: any = await getSellerProfile(user.uid)
                if (profile) {
                    setFormData(prev => ({
                        ...prev,
                        shopName: profile.name || profile.shop_name || '',
                        shopNameEn: profile.name_en || '',
                        description: profile.description || '',
                        descriptionEn: profile.description_en || '',
                        contactEmail: profile.contact_email || user.email || '',
                        contactPhone: profile.contact_phone || '',
                        shippingFeeDefault: profile.shipping_fee_default || 50,
                        freeShippingMin: profile.free_shipping_min || 500,
                        enableCod: profile.enable_cod !== false,
                    }))
                }
            }
        }
        fetchProfile()
    }, [user])

    // Save handler
    const handleSave = async () => {
        if (!user) return
        setLoading(true)
        try {
            await updateSellerProfile(user.uid, {
                name: formData.shopName,
                shop_name: formData.shopName,
                name_en: formData.shopNameEn,
                description: formData.description,
                description_en: formData.descriptionEn,
                contact_email: formData.contactEmail,
                contact_phone: formData.contactPhone,
                shipping_fee_default: formData.shippingFeeDefault,
                free_shipping_min: formData.freeShippingMin,
                enable_cod: formData.enableCod,
            } as any)
            await refreshProfile()
            setSaved(true)
            setTimeout(() => setSaved(false), 3000)
        } catch (error) {
            console.error(error)
            alert(language === 'th' ? 'บันทึกล้มเหลว' : 'Save failed')
        } finally {
            setLoading(false)
        }
    }

    // Render tab content
    const renderTabContent = () => {
        switch (activeTab) {
            case 'profile':
                return <ProfileTab formData={formData} setFormData={setFormData} language={language} />
            case 'branding':
                return <BrandingTab formData={formData} setFormData={setFormData} language={language} />
            case 'shipping':
                return <ShippingTab formData={formData} setFormData={setFormData} language={language} />
            case 'payments':
                return <PaymentsTab formData={formData} setFormData={setFormData} language={language} />
            case 'business':
                return <BusinessTab formData={formData} setFormData={setFormData} language={language} />
            case 'policies':
                return <PoliciesTab formData={formData} setFormData={setFormData} language={language} />
            case 'vacation':
                return <VacationTab formData={formData} setFormData={setFormData} language={language} />
            case 'notifications':
                return <NotificationsTab formData={formData} setFormData={setFormData} language={language} />
            case 'security':
                return <SecurityTab formData={formData} setFormData={setFormData} language={language} />
            case 'appearance':
                return <AppearanceTab formData={formData} setFormData={setFormData} language={language} />
            case 'ai':
                return <AITab formData={formData} setFormData={setFormData} language={language} />
            default:
                return null
        }
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-2">
                        ⚙️ {language === 'th' ? 'ตั้งค่าร้านค้า' : 'Shop Settings'}
                        <span className="px-2 py-1 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-xs rounded-full">V3</span>
                    </h1>
                    <p className="text-gray-500 mt-1">
                        {language === 'th' ? 'จัดการข้อมูลและการตั้งค่าร้านค้าครบทุกด้าน' : 'Manage all aspects of your shop settings'}
                    </p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={loading}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${saved
                        ? 'bg-emerald-600 text-white'
                        : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg shadow-indigo-500/25'
                        } disabled:opacity-50`}
                >
                    {loading ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : saved ? (
                        <Check className="w-5 h-5" />
                    ) : (
                        <Save className="w-5 h-5" />
                    )}
                    {saved ? (language === 'th' ? 'บันทึกแล้ว' : 'Saved') : (language === 'th' ? 'บันทึกการเปลี่ยนแปลง' : 'Save Changes')}
                </button>
            </div>

            <div className="flex gap-6 flex-col lg:flex-row">
                {/* Sidebar */}
                <div className="w-full lg:w-72 flex-shrink-0">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-2 space-y-1 sticky top-4">
                        {tabs.map(tab => {
                            const TabIcon = tab.icon
                            const isActive = activeTab === tab.id
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`w-full text-left p-3 rounded-xl flex items-center justify-between font-medium transition-all ${isActive
                                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <TabIcon className="w-5 h-5" />
                                        <span>{language === 'th' ? tab.labelTh : tab.labelEn}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        {tab.isNew && !isActive && (
                                            <span className="px-1.5 py-0.5 bg-emerald-100 text-emerald-600 text-xs rounded">NEW</span>
                                        )}
                                        {tab.badge && (
                                            <span className={`px-1.5 py-0.5 text-xs rounded ${isActive ? 'bg-white/20 text-white' : 'bg-purple-100 text-purple-600'}`}>
                                                {tab.badge}
                                            </span>
                                        )}
                                    </div>
                                </button>
                            )
                        })}
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 space-y-6">
                    {renderTabContent()}
                </div>
            </div>
        </div>
    )
}

// ==================== Tab Components ====================

// Profile Tab
function ProfileTab({ formData, setFormData, language }: any) {
    return (
        <>
            <SettingsSection
                title={language === 'th' ? '🖼️ โลโก้และรูปร้าน' : '🖼️ Shop Logo & Images'}
                description={language === 'th' ? 'รูปที่ดีช่วยสร้างความน่าเชื่อถือ' : 'Good images build trust'}
            >
                <div className="flex flex-wrap gap-6">
                    <div className="text-center">
                        <div className="w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-2xl flex items-center justify-center border-2 border-dashed border-gray-300 mb-2">
                            <Camera className="w-8 h-8 text-gray-400" />
                        </div>
                        <p className="text-xs text-gray-500">{language === 'th' ? 'โลโก้' : 'Logo'}</p>
                    </div>
                    <div className="text-center">
                        <div className="w-48 h-24 bg-gray-100 dark:bg-gray-700 rounded-2xl flex items-center justify-center border-2 border-dashed border-gray-300 mb-2">
                            <Upload className="w-8 h-8 text-gray-400" />
                        </div>
                        <p className="text-xs text-gray-500">{language === 'th' ? 'แบนเนอร์' : 'Banner'}</p>
                    </div>
                </div>
            </SettingsSection>

            <SettingsSection title={language === 'th' ? '🇹🇭 ข้อมูลภาษาไทย' : '🇹🇭 Thai Info'}>
                <div className="space-y-4">
                    <InputField
                        label={language === 'th' ? 'ชื่อร้านค้า' : 'Shop Name'}
                        value={formData.shopName}
                        onChange={(val) => setFormData((p: any) => ({ ...p, shopName: val }))}
                        placeholder={language === 'th' ? 'เช่น ร้านสมชาย' : 'e.g. My Shop'}
                        icon={Store}
                        required
                    />
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            {language === 'th' ? 'คำอธิบายร้าน' : 'Description'}
                        </label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData((p: any) => ({ ...p, description: e.target.value }))}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900 min-h-[100px]"
                            placeholder={language === 'th' ? 'บอกเล่าเกี่ยวกับร้านของคุณ...' : 'Tell about your shop...'}
                        />
                    </div>
                </div>
            </SettingsSection>

            <SettingsSection title={language === 'th' ? '📞 ข้อมูลติดต่อ' : '📞 Contact Info'}>
                <div className="grid md:grid-cols-2 gap-4">
                    <InputField
                        label={language === 'th' ? 'อีเมล' : 'Email'}
                        value={formData.contactEmail}
                        onChange={(val) => setFormData((p: any) => ({ ...p, contactEmail: val }))}
                        type="email"
                        icon={Mail}
                    />
                    <InputField
                        label={language === 'th' ? 'เบอร์โทร' : 'Phone'}
                        value={formData.contactPhone}
                        onChange={(val) => setFormData((p: any) => ({ ...p, contactPhone: val }))}
                        type="tel"
                        icon={Phone}
                    />
                </div>
            </SettingsSection>
        </>
    )
}

// Branding Tab (NEW)
function BrandingTab({ formData, setFormData, language }: any) {
    const colorPresets = [
        { name: 'Indigo', primary: '#6366F1', secondary: '#8B5CF6' },
        { name: 'Rose', primary: '#F43F5E', secondary: '#EC4899' },
        { name: 'Emerald', primary: '#10B981', secondary: '#14B8A6' },
        { name: 'Amber', primary: '#F59E0B', secondary: '#EAB308' },
        { name: 'Blue', primary: '#3B82F6', secondary: '#0EA5E9' },
    ]

    return (
        <>
            <SettingsSection
                title={language === 'th' ? '🎨 สีประจำร้าน' : '🎨 Brand Colors'}
                badge="AI"
            >
                <div className="space-y-4">
                    <p className="text-sm text-gray-500">
                        {language === 'th' ? 'เลือกสีที่เหมาะกับแบรนด์ของคุณ' : 'Choose colors that match your brand'}
                    </p>
                    <div className="flex flex-wrap gap-3">
                        {colorPresets.map(preset => (
                            <button
                                key={preset.name}
                                onClick={() => setFormData((p: any) => ({ ...p, primaryColor: preset.primary, secondaryColor: preset.secondary }))}
                                className={`flex items-center gap-2 px-4 py-2 rounded-xl border-2 transition-all ${formData.primaryColor === preset.primary
                                    ? 'border-indigo-500 bg-indigo-50'
                                    : 'border-gray-200 hover:border-gray-300'
                                    }`}
                            >
                                <div className="flex">
                                    <div className="w-6 h-6 rounded-l-lg" style={{ backgroundColor: preset.primary }} />
                                    <div className="w-6 h-6 rounded-r-lg" style={{ backgroundColor: preset.secondary }} />
                                </div>
                                <span className="text-sm">{preset.name}</span>
                            </button>
                        ))}
                    </div>
                    <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl flex items-center gap-3">
                        <Sparkles className="w-5 h-5 text-purple-600" />
                        <span className="text-sm text-purple-700 dark:text-purple-300">
                            {language === 'th' ? 'เร็วๆ นี้: AI จะช่วยเลือกสีจากโลโก้อัตโนมัติ' : 'Coming soon: AI will auto-pick colors from your logo'}
                        </span>
                    </div>
                </div>
            </SettingsSection>
        </>
    )
}

// Shipping Tab
function ShippingTab({ formData, setFormData, language }: any) {
    return (
        <SettingsSection
            title={language === 'th' ? '🚚 ตั้งค่าการจัดส่ง' : '🚚 Shipping Settings'}
        >
            <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                    <InputField
                        label={language === 'th' ? 'ค่าจัดส่งเริ่มต้น (฿)' : 'Default Shipping (฿)'}
                        value={String(formData.shippingFeeDefault)}
                        onChange={(val) => setFormData((p: any) => ({ ...p, shippingFeeDefault: Number(val) }))}
                        type="number"
                        icon={Truck}
                    />
                    <InputField
                        label={language === 'th' ? 'ส่งฟรีเมื่อซื้อขั้นต่ำ (฿)' : 'Free Shipping Min (฿)'}
                        value={String(formData.freeShippingMin)}
                        onChange={(val) => setFormData((p: any) => ({ ...p, freeShippingMin: Number(val) }))}
                        type="number"
                        hint={language === 'th' ? 'ตั้ง 0 เพื่อปิด' : 'Set 0 to disable'}
                    />
                </div>
                <ToggleSwitch
                    enabled={formData.enableCod}
                    onChange={(val) => setFormData((p: any) => ({ ...p, enableCod: val }))}
                    label={language === 'th' ? 'รับชำระเงินปลายทาง (COD)' : 'Cash on Delivery (COD)'}
                    description={language === 'th' ? 'ลูกค้าจ่ายเงินตอนรับสินค้า' : 'Customer pays upon delivery'}
                />
            </div>
        </SettingsSection>
    )
}

// Payments Tab (NEW)
function PaymentsTab({ formData, setFormData, language }: any) {
    return (
        <>
            <SettingsSection title={language === 'th' ? '🏦 บัญชีธนาคาร' : '🏦 Bank Account'}>
                <div className="space-y-4">
                    <SelectField
                        label={language === 'th' ? 'ธนาคาร' : 'Bank'}
                        value={formData.bankName}
                        onChange={(val) => setFormData((p: any) => ({ ...p, bankName: val }))}
                        options={[
                            { value: '', label: language === 'th' ? 'เลือกธนาคาร' : 'Select Bank' },
                            { value: 'kbank', label: 'ธนาคารกสิกรไทย (KBank)' },
                            { value: 'scb', label: 'ธนาคารไทยพาณิชย์ (SCB)' },
                            { value: 'bbl', label: 'ธนาคารกรุงเทพ (BBL)' },
                            { value: 'ktb', label: 'ธนาคารกรุงไทย (KTB)' },
                            { value: 'ttb', label: 'ธนาคารทหารไทยธนชาต (TTB)' },
                        ]}
                        icon={Building2}
                    />
                    <div className="grid md:grid-cols-2 gap-4">
                        <InputField
                            label={language === 'th' ? 'เลขบัญชี' : 'Account Number'}
                            value={formData.accountNumber}
                            onChange={(val) => setFormData((p: any) => ({ ...p, accountNumber: val }))}
                            placeholder="xxx-x-xxxxx-x"
                        />
                        <InputField
                            label={language === 'th' ? 'ชื่อบัญชี' : 'Account Name'}
                            value={formData.accountName}
                            onChange={(val) => setFormData((p: any) => ({ ...p, accountName: val }))}
                            placeholder={language === 'th' ? 'ชื่อตามบัญชี' : 'Name on account'}
                        />
                    </div>
                </div>
            </SettingsSection>

            <SettingsSection title={language === 'th' ? '📱 พร้อมเพย์' : '📱 PromptPay'}>
                <InputField
                    label={language === 'th' ? 'เลขพร้อมเพย์' : 'PromptPay ID'}
                    value={formData.promptPayId}
                    onChange={(val) => setFormData((p: any) => ({ ...p, promptPayId: val }))}
                    placeholder={language === 'th' ? 'เบอร์โทร หรือ เลขบัตรประชาชน' : 'Phone or ID number'}
                    icon={Phone}
                />
            </SettingsSection>
        </>
    )
}

// Business Tab
function BusinessTab({ formData, setFormData, language }: any) {
    return (
        <SettingsSection title={language === 'th' ? '🏢 ข้อมูลธุรกิจ' : '🏢 Business Info'}>
            <div className="space-y-4">
                <SelectField
                    label={language === 'th' ? 'ประเภทผู้ขาย' : 'Business Type'}
                    value={formData.businessType}
                    onChange={(val) => setFormData((p: any) => ({ ...p, businessType: val }))}
                    options={[
                        { value: 'individual', label: language === 'th' ? 'บุคคลธรรมดา' : 'Individual' },
                        { value: 'company', label: language === 'th' ? 'นิติบุคคล/บริษัท' : 'Company' },
                    ]}
                    icon={Building2}
                />
                <InputField
                    label={language === 'th' ? 'เลขประจำตัวผู้เสียภาษี' : 'Tax ID'}
                    value={formData.taxId}
                    onChange={(val) => setFormData((p: any) => ({ ...p, taxId: val }))}
                    placeholder="x-xxxx-xxxxx-xx-x"
                    hint={language === 'th' ? 'สำหรับออกใบกำกับภาษี' : 'For tax invoices'}
                />
            </div>
        </SettingsSection>
    )
}

// Policies Tab
function PoliciesTab({ formData, setFormData, language }: any) {
    return (
        <SettingsSection title={language === 'th' ? '📋 นโยบายร้านค้า' : '📋 Shop Policies'}>
            <div className="space-y-4">
                <InputField
                    label={language === 'th' ? 'รับคืนสินค้าภายใน (วัน)' : 'Return Period (days)'}
                    value={String(formData.returnDays)}
                    onChange={(val) => setFormData((p: any) => ({ ...p, returnDays: Number(val) }))}
                    type="number"
                    hint={language === 'th' ? 'ตั้ง 0 เพื่อไม่รับคืน' : 'Set 0 to disable returns'}
                />
                <InputField
                    label={language === 'th' ? 'รับประกันสินค้า (วัน)' : 'Warranty Period (days)'}
                    value={String(formData.warrantyDays)}
                    onChange={(val) => setFormData((p: any) => ({ ...p, warrantyDays: Number(val) }))}
                    type="number"
                />
            </div>
        </SettingsSection>
    )
}

// Vacation Tab
function VacationTab({ formData, setFormData, language }: any) {
    return (
        <SettingsSection title={language === 'th' ? '🏖️ โหมดพักร้าน' : '🏖️ Vacation Mode'}>
            <div className="space-y-4">
                <ToggleSwitch
                    enabled={formData.vacationMode}
                    onChange={(val) => setFormData((p: any) => ({ ...p, vacationMode: val }))}
                    label={language === 'th' ? 'เปิดโหมดพักร้าน' : 'Enable Vacation Mode'}
                    description={language === 'th' ? 'ร้านจะแสดงสถานะปิดชั่วคราว' : 'Shop will show as temporarily closed'}
                />
                {formData.vacationMode && (
                    <div className="space-y-2">
                        <label className="block text-sm font-medium">{language === 'th' ? 'ข้อความแจ้งลูกค้า' : 'Message to customers'}</label>
                        <textarea
                            value={formData.vacationMessage}
                            onChange={(e) => setFormData((p: any) => ({ ...p, vacationMessage: e.target.value }))}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 min-h-[80px]"
                            placeholder={language === 'th' ? 'เช่น ร้านหยุดพัก 1-5 ม.ค.' : 'e.g. Shop closed Jan 1-5'}
                        />
                    </div>
                )}
            </div>
        </SettingsSection>
    )
}

// Notifications Tab
function NotificationsTab({ formData, setFormData, language }: any) {
    return (
        <SettingsSection title={language === 'th' ? '🔔 การแจ้งเตือน' : '🔔 Notifications'}>
            <div className="space-y-1 divide-y divide-gray-100">
                <ToggleSwitch
                    enabled={formData.notifyNewOrder}
                    onChange={(val) => setFormData((p: any) => ({ ...p, notifyNewOrder: val }))}
                    label={language === 'th' ? 'คำสั่งซื้อใหม่' : 'New Orders'}
                />
                <ToggleSwitch
                    enabled={formData.notifyNewChat}
                    onChange={(val) => setFormData((p: any) => ({ ...p, notifyNewChat: val }))}
                    label={language === 'th' ? 'ข้อความใหม่' : 'New Messages'}
                />
                <ToggleSwitch
                    enabled={formData.notifyLowStock}
                    onChange={(val) => setFormData((p: any) => ({ ...p, notifyLowStock: val }))}
                    label={language === 'th' ? 'สต็อกต่ำ' : 'Low Stock'}
                />
                <ToggleSwitch
                    enabled={formData.notifyPromotion}
                    onChange={(val) => setFormData((p: any) => ({ ...p, notifyPromotion: val }))}
                    label={language === 'th' ? 'โปรโมชั่นและข่าวสาร' : 'Promotions & News'}
                />
            </div>
        </SettingsSection>
    )
}

// Security Tab
function SecurityTab({ formData, setFormData, language }: any) {
    return (
        <SettingsSection title={language === 'th' ? '🔐 ความปลอดภัย' : '🔐 Security'}>
            <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-xl">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                            <Shield className="w-5 h-5 text-emerald-600" />
                        </div>
                        <div>
                            <p className="font-medium">{language === 'th' ? 'สถานะยืนยันตัวตน' : 'Verification Status'}</p>
                            <p className="text-sm text-emerald-600">{language === 'th' ? 'ยืนยันแล้ว' : 'Verified'}</p>
                        </div>
                    </div>
                    <Check className="w-6 h-6 text-emerald-600" />
                </div>
                <ToggleSwitch
                    enabled={formData.twoFaEnabled}
                    onChange={(val) => setFormData((p: any) => ({ ...p, twoFaEnabled: val }))}
                    label={language === 'th' ? 'ยืนยันตัวตน 2 ชั้น (2FA)' : 'Two-Factor Authentication'}
                    description={language === 'th' ? 'เพิ่มความปลอดภัยให้บัญชี' : 'Extra security for your account'}
                />
            </div>
        </SettingsSection>
    )
}

// Appearance Tab
function AppearanceTab({ formData, setFormData, language }: any) {
    return (
        <SettingsSection title={language === 'th' ? '🎨 หน้าตาแอป' : '🎨 Appearance'}>
            <div className="space-y-6">
                <div>
                    <p className="font-medium mb-3">{language === 'th' ? 'ธีมสี' : 'Theme'}</p>
                    <div className="grid grid-cols-3 gap-3">
                        {[
                            { id: 'light', labelTh: 'สว่าง', labelEn: 'Light', icon: Sun },
                            { id: 'dark', labelTh: 'มืด', labelEn: 'Dark', icon: Moon },
                            { id: 'system', labelTh: 'ตามระบบ', labelEn: 'System', icon: Settings },
                        ].map(theme => {
                            const ThemeIcon = theme.icon
                            return (
                                <button
                                    key={theme.id}
                                    onClick={() => setFormData((p: any) => ({ ...p, theme: theme.id }))}
                                    className={`p-4 rounded-xl border-2 transition-all ${formData.theme === theme.id
                                        ? 'border-indigo-500 bg-indigo-50'
                                        : 'border-gray-200'
                                        }`}
                                >
                                    <ThemeIcon className={`w-6 h-6 mx-auto mb-2 ${formData.theme === theme.id ? 'text-indigo-600' : 'text-gray-400'}`} />
                                    <p className="text-sm text-center">{language === 'th' ? theme.labelTh : theme.labelEn}</p>
                                </button>
                            )
                        })}
                    </div>
                </div>
            </div>
        </SettingsSection>
    )
}

// AI Tab (NEW)
function AITab({ formData, setFormData, language }: any) {
    return (
        <>
            <SettingsSection
                title={language === 'th' ? '🤖 AI Assistant' : '🤖 AI Assistant'}
                badge="NEW"
            >
                <div className="space-y-4">
                    <ToggleSwitch
                        enabled={formData.aiAssistantEnabled}
                        onChange={(val) => setFormData((p: any) => ({ ...p, aiAssistantEnabled: val }))}
                        label={language === 'th' ? 'เปิดใช้ AI Assistant' : 'Enable AI Assistant'}
                        description={language === 'th' ? 'AI จะช่วยแนะนำและให้คำปรึกษาตลอด 24 ชม.' : 'AI will help guide you 24/7'}
                    />
                    <ToggleSwitch
                        enabled={formData.aiAutoReply}
                        onChange={(val) => setFormData((p: any) => ({ ...p, aiAutoReply: val }))}
                        label={language === 'th' ? 'ตอบแชทอัตโนมัติ' : 'Auto-reply Chat'}
                        description={language === 'th' ? 'AI ตอบคำถามลูกค้าเบื้องต้น' : 'AI answers common customer questions'}
                    />
                    <ToggleSwitch
                        enabled={formData.aiPricingSuggestion}
                        onChange={(val) => setFormData((p: any) => ({ ...p, aiPricingSuggestion: val }))}
                        label={language === 'th' ? 'แนะนำราคาอัจฉริยะ' : 'Smart Pricing Suggestions'}
                        description={language === 'th' ? 'AI วิเคราะห์และแนะนำราคาที่เหมาะสม' : 'AI analyzes and suggests optimal pricing'}
                    />
                </div>
            </SettingsSection>

            <SettingsSection title={language === 'th' ? '⚡ ระบบอัตโนมัติ' : '⚡ Automation'}>
                <div className="space-y-4">
                    <div className="p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl">
                        <div className="flex items-center gap-3 mb-2">
                            <Bot className="w-6 h-6 text-purple-600" />
                            <h4 className="font-bold text-purple-900">{language === 'th' ? 'โหมด Auto-Pilot' : 'Auto-Pilot Mode'}</h4>
                            <span className="px-2 py-0.5 bg-purple-200 text-purple-700 text-xs rounded-full">Coming Soon</span>
                        </div>
                        <p className="text-sm text-purple-700">
                            {language === 'th'
                                ? 'ให้ AI จัดการร้านอัตโนมัติ: ปรับราคา, ตอบแชท, สร้างโปรโมชั่น'
                                : 'Let AI manage your shop: adjust prices, reply chats, create promotions'}
                        </p>
                    </div>
                </div>
            </SettingsSection>
        </>
    )
}
