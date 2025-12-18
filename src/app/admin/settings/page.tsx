'use client'

import { useState, useEffect } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import {
    Settings, Save, AlertTriangle, DollarSign,
    ToggleLeft, Power
} from 'lucide-react'
import { useAdmin } from '@/contexts/AdminContext'
import { getSystemSettings, updateSystemSettings, SystemSettings } from '@/lib/admin/settings-service'

export default function SettingsPage() {
    const { adminUser } = useAdmin()
    const [settings, setSettings] = useState<SystemSettings | null>(null)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)

    useEffect(() => {
        loadData()
    }, [])

    const loadData = async () => {
        setLoading(true)
        const data = await getSystemSettings()
        setSettings(data)
        setLoading(false)
    }

    const handleChange = (field: keyof SystemSettings, value: any) => {
        if (!settings) return
        setSettings({ ...settings, [field]: value })
    }

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!settings || !adminUser) return

        if (!confirm('ยืนยันการบันทึกการตั้งค่าระบบ? (Confirm Save)')) return

        setSaving(true)
        try {
            await updateSystemSettings(adminUser, settings)
            alert('บันทึกการตั้งค่าเรียบร้อย (Saved Successfully)')
        } catch (e) {
            alert('เกิดข้อผิดพลาดในการบันทึก')
            console.error(e)
        } finally {
            setSaving(false)
        }
    }

    if (loading || !settings) {
        return <AdminLayout><div>Loading settings...</div></AdminLayout>
    }

    return (
        <AdminLayout>
            <div className="max-w-4xl mx-auto space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <Settings className="w-8 h-8 text-gray-700 dark:text-gray-300" />
                        ตั้งค่าระบบ (System Settings)
                    </h1>
                    <p className="text-gray-500 mt-1">
                        กำหนดค่าธรรมเนียม และสถานะการทำงานของระบบ
                    </p>
                </div>

                <form onSubmit={handleSave} className="space-y-6">

                    {/* Fees & Financial */}
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                            <DollarSign className="w-5 h-5 text-green-600" />
                            การเงินและค่าธรรมเนียม (Fees & Commission)
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    ค่าธรรมเนียมแพลตฟอร์ม (%)
                                </label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        step="0.1"
                                        value={settings.platform_fee_percent}
                                        onChange={(e) => handleChange('platform_fee_percent', parseFloat(e.target.value))}
                                        className="w-full pl-3 pr-8 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                                    />
                                    <span className="absolute right-3 top-2 text-gray-400 text-sm">%</span>
                                </div>
                                <p className="text-xs text-gray-500 mt-1">เก็บจากยอดขายรวมทุกออเดอร์</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    ค่าคอมมิชชั่น (%)
                                </label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        step="0.1"
                                        value={settings.commission_rate_percent}
                                        onChange={(e) => handleChange('commission_rate_percent', parseFloat(e.target.value))}
                                        className="w-full pl-3 pr-8 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                                    />
                                    <span className="absolute right-3 top-2 text-gray-400 text-sm">%</span>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    ยอดถอนขั้นต่ำ (บาท)
                                </label>
                                <input
                                    type="number"
                                    value={settings.min_withdrawal_amount}
                                    onChange={(e) => handleChange('min_withdrawal_amount', parseFloat(e.target.value))}
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    ค่าลงสินค้า (Listing Fee)
                                </label>
                                <input
                                    type="number"
                                    value={settings.listing_fee}
                                    onChange={(e) => handleChange('listing_fee', parseFloat(e.target.value))}
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                                />
                                <p className="text-xs text-gray-500 mt-1">0 = ลงฟรี</p>
                            </div>
                        </div>
                    </div>

                    {/* System Status */}
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                            <Power className="w-5 h-5 text-red-600" />
                            สถานะและการเข้าถึง (Status & Access)
                        </h2>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-xl">
                                <div>
                                    <div className="font-bold text-gray-900 dark:text-white">Maintenance Mode</div>
                                    <div className="text-sm text-gray-500">ปิดปรับปรุงระบบชั่วคราว ผู้ใช้ทั่วไปจะเข้าไม่ได้</div>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => handleChange('maintenance_mode', !settings.maintenance_mode)}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${settings.maintenance_mode ? 'bg-red-600' : 'bg-gray-300'}`}
                                >
                                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition duration-200 ${settings.maintenance_mode ? 'translate-x-6' : 'translate-x-1'}`} />
                                </button>
                            </div>

                            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-xl">
                                <div>
                                    <div className="font-bold text-gray-900 dark:text-white">Allow New Registrations</div>
                                    <div className="text-sm text-gray-500">อนุญาตให้สมัครสมาชิกใหม่</div>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => handleChange('allow_new_registrations', !settings.allow_new_registrations)}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${settings.allow_new_registrations ? 'bg-green-600' : 'bg-gray-300'}`}
                                >
                                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition duration-200 ${settings.allow_new_registrations ? 'translate-x-6' : 'translate-x-1'}`} />
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={saving}
                            className={`flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-700 shadow-lg transition-all ${saving ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            <Save className="w-5 h-5" />
                            {saving ? 'กำลังบันทึก...' : 'บันทึกการตั้งค่า'}
                        </button>
                    </div>

                </form>
            </div>
        </AdminLayout>
    )
}
