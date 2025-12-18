'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
    User,
    Mail,
    Phone,
    Lock,
    Globe,
    Bell,
    Shield,
    Moon,
    Sun,
    Sparkles,
    LogOut,
    Save,
    Camera
} from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { useAuth } from '@/contexts/AuthContext'
import useProfile from '@/hooks/useProfile'
import ProfileLayout from '@/components/profile/v2/ProfileLayout'
import { useRouter } from 'next/navigation'

export default function SettingsPage() {
    const { t, language, setLanguage } = useLanguage()
    const { user, logout } = useAuth()
    const { profile } = useProfile()
    const router = useRouter()

    const [settings, setSettings] = useState({
        displayName: user?.displayName || '',
        email: user?.email || '',
        phone: user?.phoneNumber || '',
        language: language,
        theme: 'light',
        notifications: {
            email: true,
            sms: false,
            push: true
        },
        privacy: {
            showPhone: false,
            showEmail: false
        }
    })

    const [saving, setSaving] = useState(false)

    const handleSave = async () => {
        setSaving(true)
        try {
            // TODO: Save to API
            await new Promise(resolve => setTimeout(resolve, 1000))
            alert(language === 'th' ? 'บันทึกสำเร็จ!' : 'Settings saved!')
        } catch (error) {
            alert(language === 'th' ? 'เกิดข้อผิดพลาด' : 'Error saving settings')
        } finally {
            setSaving(false)
        }
    }

    const handleLanguageChange = async (newLang: 'th' | 'en') => {
        setSettings({ ...settings, language: newLang })
        await setLanguage(newLang)
        // Reload page to ensure all components update
        setTimeout(() => {
            window.location.reload()
        }, 100)
    }

    const handleLogout = async () => {
        if (confirm(language === 'th' ? 'ต้องการออกจากระบบ?' : 'Are you sure you want to logout?')) {
            try {
                console.log('Logging out...')
                await logout()
                console.log('Logout successful, redirecting...')
                // Use window.location for more reliable redirect
                window.location.href = '/'
            } catch (error) {
                console.error('Logout error:', error)
                alert(language === 'th' ? 'เกิดข้อผิดพลาดในการออกจากระบบ' : 'Error logging out')
            }
        }
    }

    return (
        <ProfileLayout>
            <div className="space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                        {language === 'th' ? 'ตั้งค่า' : 'Settings'}
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                        {language === 'th' ? 'จัดการบัญชีและการตั้งค่าของคุณ' : 'Manage your account and preferences'}
                    </p>
                </div>

                {/* AI Privacy Coach */}
                <div className="flex items-start gap-3 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-200 dark:border-purple-800">
                    <Sparkles className="w-5 h-5 text-purple-500 shrink-0 mt-0.5" />
                    <div>
                        <p className="text-sm font-medium text-purple-700 dark:text-purple-300 mb-1">
                            {language === 'th' ? 'AI แนะนำความปลอดภัย' : 'AI Privacy Coach'}
                        </p>
                        <p className="text-sm text-purple-600 dark:text-purple-400">
                            {language === 'th'
                                ? 'แนะนำให้ซ่อนเบอร์โทรศัพท์เมื่อขายสินค้า เพื่อความปลอดภัย'
                                : 'We recommend hiding your phone number when selling for better privacy'
                            }
                        </p>
                    </div>
                </div>

                {/* Profile Section */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                        <User className="w-5 h-5" />
                        {language === 'th' ? 'ข้อมูลส่วนตัว' : 'Profile Information'}
                    </h2>

                    {/* Profile Photo */}
                    <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
                        <div className="relative">
                            <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                                {user?.displayName?.[0] || 'U'}
                            </div>
                            <button className="absolute bottom-0 right-0 p-1.5 bg-purple-500 text-white rounded-full hover:bg-purple-600 transition-colors">
                                <Camera className="w-4 h-4" />
                            </button>
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900 dark:text-white">
                                {user?.displayName}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                {user?.email}
                            </p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                {language === 'th' ? 'ชื่อที่แสดง' : 'Display Name'}
                            </label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    value={settings.displayName}
                                    onChange={(e) => setSettings({ ...settings, displayName: e.target.value })}
                                    className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                {language === 'th' ? 'อีเมล' : 'Email'}
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="email"
                                    value={settings.email}
                                    disabled
                                    className="w-full pl-10 pr-4 py-3 bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-500 cursor-not-allowed"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                {language === 'th' ? 'เบอร์โทรศัพท์' : 'Phone Number'}
                            </label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="tel"
                                    value={settings.phone}
                                    onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                                    className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Preferences */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                        <Globe className="w-5 h-5" />
                        {language === 'th' ? 'การตั้งค่า' : 'Preferences'}
                    </h2>

                    <div className="space-y-4">
                        {/* Language */}
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium text-gray-900 dark:text-white">
                                    {language === 'th' ? 'ภาษา' : 'Language'}
                                </p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {language === 'th' ? 'เลือกภาษาที่ต้องการ' : 'Choose your preferred language'}
                                </p>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleLanguageChange('th')}
                                    className={`px-4 py-2 rounded-lg font-medium transition-all ${settings.language === 'th'
                                        ? 'bg-purple-500 text-white'
                                        : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                                        }`}
                                >
                                    ไทย
                                </button>
                                <button
                                    onClick={() => handleLanguageChange('en')}
                                    className={`px-4 py-2 rounded-lg font-medium transition-all ${settings.language === 'en'
                                        ? 'bg-purple-500 text-white'
                                        : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                                        }`}
                                >
                                    EN
                                </button>
                            </div>
                        </div>

                        {/* Theme */}
                        <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                            <div>
                                <p className="font-medium text-gray-900 dark:text-white">
                                    {language === 'th' ? 'ธีม' : 'Theme'}
                                </p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {language === 'th' ? 'เลือกธีมที่ต้องการ' : 'Choose your theme'}
                                </p>
                            </div>
                            <div className="flex gap-2">
                                <button className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                                    <Sun className="w-5 h-5" />
                                </button>
                                <button className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                                    <Moon className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Notifications */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                        <Bell className="w-5 h-5" />
                        {language === 'th' ? 'การแจ้งเตือน' : 'Notifications'}
                    </h2>

                    <div className="space-y-4">
                        {Object.entries(settings.notifications).map(([key, value]) => (
                            <div key={key} className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium text-gray-900 dark:text-white capitalize">
                                        {key === 'email' ? (language === 'th' ? 'อีเมล' : 'Email') :
                                            key === 'sms' ? 'SMS' :
                                                language === 'th' ? 'แจ้งเตือนแอป' : 'Push Notifications'}
                                    </p>
                                </div>
                                <button
                                    onClick={() => setSettings({
                                        ...settings,
                                        notifications: { ...settings.notifications, [key]: !value }
                                    })}
                                    className={`
                                        relative w-12 h-6 rounded-full transition-colors
                                        ${value ? 'bg-purple-500' : 'bg-gray-300 dark:bg-gray-600'}
                                    `}
                                >
                                    <div className={`
                                        absolute top-1 w-4 h-4 bg-white rounded-full transition-transform
                                        ${value ? 'translate-x-7' : 'translate-x-1'}
                                    `} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Privacy */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                        <Shield className="w-5 h-5" />
                        {language === 'th' ? 'ความเป็นส่วนตัว' : 'Privacy'}
                    </h2>

                    <div className="space-y-4">
                        {Object.entries(settings.privacy).map(([key, value]) => (
                            <div key={key} className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium text-gray-900 dark:text-white">
                                        {key === 'showPhone'
                                            ? (language === 'th' ? 'แสดงเบอร์โทร' : 'Show Phone Number')
                                            : (language === 'th' ? 'แสดงอีเมล' : 'Show Email')
                                        }
                                    </p>
                                </div>
                                <button
                                    onClick={() => setSettings({
                                        ...settings,
                                        privacy: { ...settings.privacy, [key]: !value }
                                    })}
                                    className={`
                                        relative w-12 h-6 rounded-full transition-colors
                                        ${value ? 'bg-purple-500' : 'bg-gray-300 dark:bg-gray-600'}
                                    `}
                                >
                                    <div className={`
                                        absolute top-1 w-4 h-4 bg-white rounded-full transition-transform
                                        ${value ? 'translate-x-7' : 'translate-x-1'}
                                    `} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3">
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium hover:shadow-lg transition-all disabled:opacity-50"
                    >
                        <Save className="w-5 h-5" />
                        {saving
                            ? (language === 'th' ? 'กำลังบันทึก...' : 'Saving...')
                            : (language === 'th' ? 'บันทึกการเปลี่ยนแปลง' : 'Save Changes')
                        }
                    </button>
                    <button
                        onClick={handleLogout}
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-red-500 text-white rounded-xl font-medium hover:bg-red-600 transition-colors"
                    >
                        <LogOut className="w-5 h-5" />
                        {language === 'th' ? 'ออกจากระบบ' : 'Logout'}
                    </button>
                </div>
            </div>
        </ProfileLayout>
    )
}
