'use client'

import React, { useState, useEffect } from 'react'
import {
    Save, Store, Globe, Truck, Bell, Shield, Palette,
    Phone, Mail, Check, ChevronRight, Camera,
    Sun, Moon, AlertCircle, Rocket
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useLanguage } from '@/contexts/LanguageContext'
import Image from 'next/image'
import Link from 'next/link'
import { getSellerProfile, updateSellerProfile } from '@/lib/seller'
import ActiveCampaignsWidget from '../ActiveCampaignsWidget'
import { useRouter } from 'next/navigation'

// ==================== Types ====================
interface SettingsTab {
    id: string
    labelTh: string
    labelEn: string
    icon: React.ElementType
    description?: string
}

// ==================== Helper Components ====================

function SettingsSection({
    title,
    description,
    children
}: {
    title: string
    description?: string
    children: React.ReactNode
}) {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl border-2 border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h3 className="font-bold text-lg text-gray-900 dark:text-white">{title}</h3>
                {description && <p className="text-sm text-gray-500 mt-1">{description}</p>}
            </div>
            <div className="p-6">
                {children}
            </div>
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
                className={`relative w-12 h-6 rounded-full transition-colors ${enabled ? 'bg-indigo-600' : 'bg-gray-300 dark:bg-gray-600'
                    }`}
            >
                <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${enabled ? 'translate-x-6' : ''
                    }`} />
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
    hint
}: {
    label: string
    value: string
    onChange: (val: string) => void
    placeholder?: string
    type?: string
    icon?: React.ElementType
    hint?: string
}) {
    return (
        <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
            <div className="relative">
                {Icon && (
                    <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                )}
                <input
                    type={type}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    className={`w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900 focus:outline-none focus:border-indigo-500 transition-colors ${Icon ? 'pl-10' : ''
                        }`}
                />
            </div>
            {hint && <p className="text-xs text-gray-400">{hint}</p>}
        </div>
    )
}

// ==================== Main Component ====================
export default function SellerSettingsPageV2() {
    const { user, refreshProfile } = useAuth()
    const { t, language } = useLanguage()
    const router = useRouter()

    // State
    const [activeTab, setActiveTab] = useState('profile')
    const [loading, setLoading] = useState(false)
    const [saved, setSaved] = useState(false)

    // Form Data
    const [formData, setFormData] = useState({
        // Shop Profile
        name: '',
        name_en: '',
        description: '',
        description_en: '',
        contact_email: '',
        contact_phone: '',
        // Shipping
        shipping_fee_default: 50,
        free_shipping_min: 500,
        enable_cod: true,
        // Notifications
        notify_new_order: true,
        notify_new_chat: true,
        notify_low_stock: true,
        notify_promotion: false,
        // Appearance
        theme: 'light'
    })

    // Tabs
    const tabs: SettingsTab[] = [
        { id: 'profile', labelTh: 'ข้อมูลร้านค้า', labelEn: 'Shop Profile', icon: Store },
        { id: 'marketing', labelTh: 'การตลาด & โปรโมชั่น', labelEn: 'Marketing & Promo', icon: Rocket },
        { id: 'shipping', labelTh: 'การจัดส่ง', labelEn: 'Shipping', icon: Truck },
        { id: 'notifications', labelTh: 'การแจ้งเตือน', labelEn: 'Notifications', icon: Bell },
        { id: 'security', labelTh: 'ความปลอดภัย', labelEn: 'Security', icon: Shield },
        { id: 'appearance', labelTh: 'หน้าตาแอป', labelEn: 'Appearance', icon: Palette },
    ]

    // Fetch profile
    useEffect(() => {
        const fetchProfile = async () => {
            if (user) {
                const profile: any = await getSellerProfile(user.uid)
                if (profile) {
                    setFormData(prev => ({
                        ...prev,
                        name: profile.name || profile.shop_name || '',
                        name_en: profile.name_en || '',
                        description: profile.description || profile.shop_description || '',
                        description_en: profile.description_en || '',
                        contact_email: profile.contact_email || '',
                        contact_phone: profile.contact_phone || '',
                        shipping_fee_default: profile.shipping_fee_default || 50,
                        free_shipping_min: profile.free_shipping_min || 500,
                        enable_cod: profile.enable_cod !== false
                    }))
                    // Auto switch light/dark based on user pref? Or leave handled by layout.
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
                name: formData.name,
                shop_name: formData.name,
                name_en: formData.name_en,
                description: formData.description,
                shop_description: formData.description,
                description_en: formData.description_en,
                contact_email: formData.contact_email,
                contact_phone: formData.contact_phone,
                shipping_fee_default: Number(formData.shipping_fee_default),
                free_shipping_min: Number(formData.free_shipping_min),
                enable_cod: formData.enable_cod
                // Note: Theme and Notifications typically saved in user settings not seller profile,
                // but for this MVP assuming they share or are mocked here for now.
            } as any)
            await refreshProfile()
            setSaved(true)
            setTimeout(() => setSaved(false), 3000)
        } catch (error) {
            console.error(error)
            alert(t('บันทึกล้มเหลว', 'Save failed'))
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black text-gray-900 dark:text-white">
                        {t('⚙️ ตั้งค่าร้านค้า', '⚙️ Shop Settings')}
                    </h1>
                    <p className="text-gray-500 mt-1">
                        {t('จัดการข้อมูลและการตั้งค่าร้านค้า', 'Manage your shop information and settings')}
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
                    {saved ? t('บันทึกแล้ว', 'Saved') : t('บันทึกการเปลี่ยนแปลง', 'Save Changes')}
                </button>
            </div>

            <div className="flex gap-6 flex-col lg:flex-row">
                {/* Sidebar */}
                <div className="w-full lg:w-64 flex-shrink-0">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl border-2 border-gray-200 dark:border-gray-700 p-2 space-y-1 sticky top-4">
                        {tabs.map(tab => {
                            const TabIcon = tab.icon
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`w-full text-left p-3 rounded-xl flex items-center gap-3 font-medium transition-all ${activeTab === tab.id
                                        ? 'bg-indigo-600 text-white shadow-md'
                                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                                        }`}
                                >
                                    <TabIcon className="w-5 h-5" />
                                    {language === 'th' ? tab.labelTh : tab.labelEn}
                                </button>
                            )
                        })}
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 space-y-6">
                    {/* Profile Tab */}
                    {activeTab === 'profile' && (
                        <>
                            {/* Shop Logo */}
                            <SettingsSection
                                title={t('โลโก้ร้านค้า', 'Shop Logo')}
                                description={t('แนะนำขนาด 200x200 px', 'Recommended size 200x200 px')}
                            >
                                <div className="flex items-center gap-6">
                                    <div className="w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-2xl flex items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600">
                                        <Camera className="w-8 h-8 text-gray-400" />
                                    </div>
                                    <div>
                                        <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-colors">
                                            {t('อัพโหลดรูป', 'Upload Image')}
                                        </button>
                                        <p className="text-xs text-gray-400 mt-2">PNG, JPG, GIF (max 2MB)</p>
                                    </div>
                                </div>
                            </SettingsSection>

                            {/* Shop Info Thai */}
                            <SettingsSection
                                title={t('🇹🇭 ข้อมูลภาษาไทย', '🇹🇭 Thai Information')}
                            >
                                <div className="space-y-4">
                                    <InputField
                                        label={t('ชื่อร้านค้า', 'Shop Name')}
                                        value={formData.name}
                                        onChange={(val) => setFormData(prev => ({ ...prev, name: val }))}
                                        placeholder={t('ร้านค้าของฉัน', 'My Shop')}
                                        icon={Store}
                                    />
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                            {t('คำอธิบายร้านค้า', 'Shop Description')}
                                        </label>
                                        <textarea
                                            value={formData.description}
                                            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900 focus:outline-none focus:border-indigo-500 min-h-[120px]"
                                            placeholder={t('บอกเล่าเกี่ยวกับร้านค้าของคุณ...', 'Tell us about your shop...')}
                                        />
                                    </div>
                                </div>
                            </SettingsSection>

                            {/* Shop Info English */}
                            <SettingsSection
                                title={t('🇺🇸 ข้อมูลภาษาอังกฤษ', '🇺🇸 English Information')}
                            >
                                <div className="space-y-4">
                                    <InputField
                                        label={t('Shop Name (English)', 'Shop Name (English)')}
                                        value={formData.name_en}
                                        onChange={(val) => setFormData(prev => ({ ...prev, name_en: val }))}
                                        placeholder="My Shop"
                                        icon={Globe}
                                    />
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Description (English)
                                        </label>
                                        <textarea
                                            value={formData.description_en}
                                            onChange={(e) => setFormData(prev => ({ ...prev, description_en: e.target.value }))}
                                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900 focus:outline-none focus:border-indigo-500 min-h-[120px]"
                                            placeholder="Tell us about your shop..."
                                        />
                                    </div>
                                </div>
                            </SettingsSection>

                            {/* Contact Info */}
                            <SettingsSection
                                title={t('ข้อมูลติดต่อ', 'Contact Information')}
                            >
                                <div className="grid md:grid-cols-2 gap-4">
                                    <InputField
                                        label={t('อีเมล', 'Email')}
                                        value={formData.contact_email}
                                        onChange={(val) => setFormData(prev => ({ ...prev, contact_email: val }))}
                                        type="email"
                                        icon={Mail}
                                    />
                                    <InputField
                                        label={t('เบอร์โทรศัพท์', 'Phone')}
                                        value={formData.contact_phone}
                                        onChange={(val) => setFormData(prev => ({ ...prev, contact_phone: val }))}
                                        type="tel"
                                        icon={Phone}
                                    />
                                </div>
                            </SettingsSection>
                        </>
                    )}

                    {/* Marketing Tab */}
                    {activeTab === 'marketing' && (
                        <>
                            {/* Active Campaigns Widget */}
                            <ActiveCampaignsWidget />

                            <SettingsSection
                                title={t('ภาพรวมการโปรโมท', 'Promotion Overview')}
                                description={t('จัดการโฆษณาและแคมเปญของคุณ', 'Manage your ads and campaigns')}
                            >
                                <div className="text-center py-8">
                                    <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Rocket className="w-8 h-8 text-purple-600" />
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                                        {t('เพิ่มยอดขายด้วยการโปรโมท', 'Boost Sales with Promotion')}
                                    </h3>
                                    <p className="text-gray-500 mb-6 max-w-md mx-auto">
                                        {t('ใช้เครื่องมือ AI Auto-Boost เพื่อดันสินค้าของคุณให้คนเห็นมากขึ้น', 'Use AI Auto-Boost tools to push your products to more visibility.')}
                                    </p>
                                    <button
                                        onClick={() => router.push('/seller/insights')}
                                        className="px-6 py-2 bg-neon-purple text-white rounded-lg hover:bg-purple-700 transition-colors font-bold"
                                    >
                                        {t('ไปที่แดชบอร์ดการตลาด', 'Go to Marketing Dashboard')}
                                    </button>
                                </div>
                            </SettingsSection>
                        </>
                    )}

                    {/* Shipping Tab */}
                    {activeTab === 'shipping' && (
                        <SettingsSection
                            title={t('ตั้งค่าการจัดส่ง', 'Shipping Settings')}
                            description={t('กำหนดค่าเริ่มต้นสำหรับการจัดส่งสินค้า', 'Set default shipping options')}
                        >
                            <div className="space-y-6">
                                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl text-sm text-blue-700 dark:text-blue-300">
                                    <AlertCircle className="w-4 h-4 inline mr-2" />
                                    {t('ค่าจัดส่งสามารถตั้งเป็นรายสินค้าได้ในหน้าแก้ไขสินค้า', 'Shipping can be set per product in product editor')}
                                </div>

                                <div className="grid md:grid-cols-2 gap-4">
                                    <InputField
                                        label={t('ค่าจัดส่งเริ่มต้น (฿)', 'Default Shipping Fee (฿)')}
                                        value={String(formData.shipping_fee_default)}
                                        onChange={(val) => setFormData(prev => ({ ...prev, shipping_fee_default: Number(val) }))}
                                        type="number"
                                        icon={Truck}
                                    />
                                    <InputField
                                        label={t('ส่งฟรีเมื่อซื้อขั้นต่ำ (฿)', 'Free Shipping Min (฿)')}
                                        value={String(formData.free_shipping_min)}
                                        onChange={(val) => setFormData(prev => ({ ...prev, free_shipping_min: Number(val) }))}
                                        type="number"
                                        hint={t('ตั้ง 0 เพื่อปิดใช้งาน', 'Set 0 to disable')}
                                    />
                                </div>

                                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                                    <ToggleSwitch
                                        enabled={formData.enable_cod}
                                        onChange={(val) => setFormData(prev => ({ ...prev, enable_cod: val }))}
                                        label={t('เปิดรับชำระเงินปลายทาง (COD)', 'Accept Cash on Delivery (COD)')}
                                        description={t('อนุญาตให้ลูกค้าจ่ายเงินตอนรับสินค้า', 'Allow customers to pay upon delivery')}
                                    />
                                </div>
                            </div>
                        </SettingsSection>
                    )}

                    {/* Notifications Tab */}
                    {activeTab === 'notifications' && (
                        <SettingsSection
                            title={t('การแจ้งเตือน', 'Notifications')}
                            description={t('เลือกประเภทการแจ้งเตือนที่ต้องการรับ', 'Choose which notifications to receive')}
                        >
                            <div className="space-y-1 divide-y divide-gray-100 dark:divide-gray-700">
                                <ToggleSwitch
                                    enabled={formData.notify_new_order}
                                    onChange={(val) => setFormData(prev => ({ ...prev, notify_new_order: val }))}
                                    label={t('คำสั่งซื้อใหม่', 'New Orders')}
                                    description={t('แจ้งเตือนเมื่อมีคำสั่งซื้อใหม่เข้ามา', 'Get notified when a new order is placed')}
                                />
                                <ToggleSwitch
                                    enabled={formData.notify_new_chat}
                                    onChange={(val) => setFormData(prev => ({ ...prev, notify_new_chat: val }))}
                                    label={t('ข้อความใหม่', 'New Messages')}
                                    description={t('แจ้งเตือนเมื่อมีข้อความจากลูกค้า', 'Get notified when customers message you')}
                                />
                                <ToggleSwitch
                                    enabled={formData.notify_low_stock}
                                    onChange={(val) => setFormData(prev => ({ ...prev, notify_low_stock: val }))}
                                    label={t('สต็อกต่ำ', 'Low Stock')}
                                    description={t('แจ้งเตือนเมื่อสินค้าใกล้หมด', 'Get notified when products are running low')}
                                />
                                <ToggleSwitch
                                    enabled={formData.notify_promotion}
                                    onChange={(val) => setFormData(prev => ({ ...prev, notify_promotion: val }))}
                                    label={t('โปรโมชั่นและข่าวสาร', 'Promotions & News')}
                                    description={t('รับข่าวสารและโปรโมชั่นจาก JaiKod', 'Receive promotional updates from JaiKod')}
                                />
                            </div>
                        </SettingsSection>
                    )}

                    {/* Security Tab */}
                    {activeTab === 'security' && (
                        <SettingsSection
                            title={t('ความปลอดภัย', 'Security')}
                            description={t('จัดการความปลอดภัยของบัญชี', 'Manage your account security')}
                        >
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-xl">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                                            <Shield className="w-5 h-5 text-emerald-600" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900 dark:text-white">{t('สถานะการยืนยันตัวตน', 'Verification Status')}</p>
                                            <p className="text-sm text-emerald-600">{t('ยืนยันแล้ว', 'Verified')}</p>
                                        </div>
                                    </div>
                                    <Check className="w-6 h-6 text-emerald-600" />
                                </div>

                                <button className="w-full p-4 bg-gray-50 dark:bg-gray-900 rounded-xl flex items-center justify-between hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                                    <span className="font-medium text-gray-900 dark:text-white">{t('เปลี่ยนรหัสผ่าน', 'Change Password')}</span>
                                    <ChevronRight className="w-5 h-5 text-gray-400" />
                                </button>

                                <button className="w-full p-4 bg-gray-50 dark:bg-gray-900 rounded-xl flex items-center justify-between hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                                    <span className="font-medium text-gray-900 dark:text-white">{t('ตั้งค่า 2FA', 'Setup 2FA')}</span>
                                    <ChevronRight className="w-5 h-5 text-gray-400" />
                                </button>
                            </div>
                        </SettingsSection>
                    )}

                    {/* Appearance Tab */}
                    {activeTab === 'appearance' && (
                        <SettingsSection
                            title={t('หน้าตาแอป', 'Appearance')}
                            description={t('ปรับแต่งรูปลักษณ์ตามต้องการ', 'Customize your experience')}
                        >
                            <div className="space-y-6">
                                <div>
                                    <p className="font-medium text-gray-900 dark:text-white mb-3">{t('ธีมสี', 'Theme')}</p>
                                    <div className="grid grid-cols-3 gap-3">
                                        {[
                                            { id: 'light', labelTh: 'สว่าง', labelEn: 'Light', icon: Sun },
                                            { id: 'dark', labelTh: 'มืด', labelEn: 'Dark', icon: Moon },
                                            { id: 'system', labelTh: 'ตามระบบ', labelEn: 'System', icon: Palette },
                                        ].map(theme => {
                                            const ThemeIcon = theme.icon
                                            return (
                                                <button
                                                    key={theme.id}
                                                    onClick={() => setFormData(prev => ({ ...prev, theme: theme.id }))}
                                                    className={`p-4 rounded-xl border-2 transition-all ${formData.theme === theme.id
                                                        ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                                                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                                                        }`}
                                                >
                                                    <ThemeIcon className={`w-6 h-6 mx-auto mb-2 ${formData.theme === theme.id ? 'text-indigo-600' : 'text-gray-400'
                                                        }`} />
                                                    <p className={`text-sm font-medium ${formData.theme === theme.id ? 'text-indigo-600' : 'text-gray-600 dark:text-gray-400'
                                                        }`}>
                                                        {language === 'th' ? theme.labelTh : theme.labelEn}
                                                    </p>
                                                </button>
                                            )
                                        })}
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                                    <p className="font-medium text-gray-900 dark:text-white mb-3">{t('ภาษา', 'Language')}</p>
                                    <div className="grid grid-cols-2 gap-3">
                                        {[
                                            { id: 'th', label: '🇹🇭 ไทย' },
                                            { id: 'en', label: '🇺🇸 English' },
                                        ].map(lang => (
                                            <button
                                                key={lang.id}
                                                className={`p-4 rounded-xl border-2 transition-all ${language === lang.id
                                                    ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                                                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                                                    }`}
                                            >
                                                <p className={`text-lg font-medium ${language === lang.id ? 'text-indigo-600' : 'text-gray-600'
                                                    }`}>
                                                    {lang.label}
                                                </p>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </SettingsSection>
                    )}
                </div>
            </div>
        </div>
    )
}
