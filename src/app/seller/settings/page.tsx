'use client'

import React, { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useLanguage } from '@/contexts/LanguageContext'
import { getSellerProfile, updateSellerProfile } from '@/lib/seller'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { Save, Store, Globe, Truck, RotateCcw } from 'lucide-react'

export default function SellerSettingsPage() {
    const { user, refreshProfile } = useAuth()
    const { t } = useLanguage()
    const [loading, setLoading] = useState(false)
    const [activeTab, setActiveTab] = useState<'profile' | 'shipping' | 'bank'>('profile')

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        contact_email: '',
        contact_phone: '',
        // Bilingual fields
        name_en: '',
        description_en: '',
        // Shipping defaults
        shipping_fee_default: 50,
        free_shipping_min: 500
    })

    useEffect(() => {
        const fetchProfile = async () => {
            if (user) {
                const profile: any = await getSellerProfile(user.uid)
                if (profile) {
                    setFormData({
                        name: profile.name || profile.shop_name || '',
                        description: profile.description || profile.shop_description || '',
                        contact_email: profile.contact_email || '',
                        contact_phone: profile.contact_phone || '',
                        name_en: profile.name_en || '',
                        description_en: profile.description_en || '',
                        shipping_fee_default: profile.shipping_fee_default || 50,
                        free_shipping_min: profile.free_shipping_min || 500
                    })
                }
            }
        }
        fetchProfile()
    }, [user])

    const handleSave = async () => {
        setLoading(true)
        try {
            await updateSellerProfile(user!.uid, {
                name: formData.name,
                shop_name: formData.name, // Legacy
                description: formData.description,
                shop_description: formData.description, // Legacy
                contact_email: formData.contact_email,
                contact_phone: formData.contact_phone,
                // New fields
                name_en: formData.name_en,
                description_en: formData.description_en,
                shipping_fee_default: Number(formData.shipping_fee_default),
                free_shipping_min: Number(formData.free_shipping_min)
            } as any)
            await refreshProfile()
            alert(t('seller_settings.settings_saved'))
        } catch (error) {
            console.error(error)
            alert(t('seller_settings.save_failed'))
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t('seller_settings.title')}</h1>
                    <p className="text-gray-500">{t('seller_settings.subtitle')}</p>
                </div>
                <Button onClick={handleSave} isLoading={loading}>
                    <Save className="w-5 h-5 mr-2" />
                    {t('seller_settings.save_changes')}
                </Button>
            </div>

            <div className="flex gap-6 flex-col md:flex-row">
                {/* Sidebar */}
                <div className="w-full md:w-64 space-y-2">
                    {[
                        { id: 'profile', label: t('seller_settings.tab_profile'), icon: Store },
                        { id: 'shipping', label: t('seller_settings.tab_shipping'), icon: Truck },
                        { id: 'bank', label: t('seller_settings.tab_bank'), icon: RotateCcw }
                    ].map(item => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id as any)}
                            className={`w-full text-left p-3 rounded-lg flex items-center gap-3 font-medium transition-colors ${activeTab === item.id
                                ? 'bg-white dark:bg-surface-dark shadow-sm text-neon-purple border border-gray-100 dark:border-gray-800'
                                : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800'
                                }`}
                        >
                            <item.icon className="w-4 h-4" />
                            {item.label}
                        </button>
                    ))}
                </div>

                {/* Content */}
                <div className="flex-1 bg-white dark:bg-surface-dark p-8 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm min-h-[500px]">
                    {activeTab === 'profile' && (
                        <div className="space-y-8">
                            {/* Logo */}
                            <div className="flex items-center gap-6 pb-6 border-b border-gray-100 dark:border-gray-800">
                                <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-700">
                                    <Store className="w-8 h-8 text-gray-400" />
                                </div>
                                <div>
                                    <h3 className="font-bold mb-1">{t('seller_settings.shop_logo')}</h3>
                                    <p className="text-sm text-gray-500 mb-4">{t('seller_settings.recommended_size')}</p>
                                    <Button variant="outline" size="sm">{t('seller_settings.upload_image')}</Button>
                                </div>
                            </div>

                            {/* Info */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center text-[10px] font-bold text-blue-600">TH</div>
                                        <h4 className="font-bold text-sm">{t('seller_settings.thai_info')}</h4>
                                    </div>
                                    <Input
                                        label={t('seller_settings.shop_name_th')}
                                        value={formData.name}
                                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                    />
                                    <div>
                                        <label className="block text-sm font-medium mb-2">{t('seller_settings.description_th')}</label>
                                        <textarea
                                            className="w-full p-3 border rounded-xl min-h-[120px] bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700"
                                            value={formData.description}
                                            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center text-[10px] font-bold text-red-600">EN</div>
                                        <h4 className="font-bold text-sm">{t('seller_settings.english_info')}</h4>
                                    </div>
                                    <Input
                                        label={t('seller_settings.shop_name_en')}
                                        value={formData.name_en}
                                        onChange={(e) => setFormData(prev => ({ ...prev, name_en: e.target.value }))}
                                        placeholder={t('seller_settings.name_in_english')}
                                    />
                                    <div>
                                        <label className="block text-sm font-medium mb-2">{t('seller_settings.description_en')}</label>
                                        <textarea
                                            className="w-full p-3 border rounded-xl min-h-[120px] bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700"
                                            value={formData.description_en}
                                            onChange={(e) => setFormData(prev => ({ ...prev, description_en: e.target.value }))}
                                            placeholder={t('seller_settings.desc_in_english')}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Contact */}
                            <div className="pt-6 border-t border-gray-100 dark:border-gray-800">
                                <h3 className="font-bold mb-4">{t('seller_settings.contact_info')}</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <Input
                                        label={t('seller_settings.contact_email')}
                                        value={formData.contact_email}
                                        onChange={(e) => setFormData(prev => ({ ...prev, contact_email: e.target.value }))}
                                    />
                                    <Input
                                        label={t('seller_settings.contact_phone')}
                                        value={formData.contact_phone}
                                        onChange={(e) => setFormData(prev => ({ ...prev, contact_phone: e.target.value }))}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'shipping' && (
                        <div className="space-y-6">
                            <h3 className="font-bold text-lg mb-4">{t('seller_settings.shipping_defaults')}</h3>
                            <div className="p-4 bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-200 rounded-lg text-sm border border-orange-100 dark:border-orange-800">
                                <span className="font-bold">Note:</span> {t('seller_settings.shipping_note')}
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <Input
                                    label={t('seller_settings.default_shipping_fee')}
                                    type="number"
                                    value={formData.shipping_fee_default}
                                    onChange={(e) => setFormData(prev => ({ ...prev, shipping_fee_default: Number(e.target.value) }))}
                                    placeholder="50"
                                />
                                <Input
                                    label={t('seller_settings.free_shipping_min')}
                                    type="number"
                                    value={formData.free_shipping_min}
                                    onChange={(e) => setFormData(prev => ({ ...prev, free_shipping_min: Number(e.target.value) }))}
                                    placeholder="500"
                                />
                            </div>

                            <div className="pt-4">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" className="rounded border-gray-300" defaultChecked />
                                    <span className="font-medium">{t('seller_settings.enable_cod')}</span>
                                </label>
                            </div>
                        </div>
                    )}

                    {activeTab === 'bank' && (
                        <div className="flex flex-col items-center justify-center h-full text-center py-20 text-gray-500">
                            <RotateCcw className="w-12 h-12 mb-4 text-gray-300" />
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">{t('seller_settings.bank_management')}</h3>
                            <p className="max-w-sm mb-6">{t('seller_settings.bank_desc')}</p>
                            <Button variant="outline">{t('seller_settings.manage_in_finance')}</Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
