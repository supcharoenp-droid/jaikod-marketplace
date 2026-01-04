'use client'

import { useState, useEffect } from 'react'
import { getProvinces, getAmphoes, getDistricts, getZipcode } from '@/services/thaiAddress'
import { MapPin, ChevronDown, Loader2 } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

export interface AddressSelectorProps {
    onAddressChange?: (address: {
        province: string
        amphoe: string
        district: string
        zipcode: string
    }) => void
    // Alternative: allow v1 pattern, can use initialValues
    initialValues?: {
        province: string
        amphoe: string
        district: string
        zipcode: string
    }
    // Alternative: allow v2 pattern for direct props
    selectedProvince?: string
    selectedAmphoe?: string
    selectedDistrict?: string
    selectedZipcode?: string
    // Alternative: SmartListingPage uses onLocationChange
    onLocationChange?: (loc: { province: string; amphoe: string; district: string; zipcode: string }) => void
}

export default function AddressSelector({
    onAddressChange,
    initialValues,
    selectedProvince,
    selectedAmphoe,
    selectedDistrict,
    selectedZipcode,
    onLocationChange
}: AddressSelectorProps) {
    const { t } = useLanguage()
    const [loading, setLoading] = useState(true)
    const [provinces, setProvinces] = useState<string[]>([])
    const [amphoes, setAmphoes] = useState<string[]>([])
    const [districts, setDistricts] = useState<string[]>([])

    // Support both v1 (initialValues) and v2 (selectedXxx) patterns
    const [selected, setSelected] = useState({
        province: selectedProvince || initialValues?.province || '',
        amphoe: selectedAmphoe || initialValues?.amphoe || '',
        district: selectedDistrict || initialValues?.district || '',
        zipcode: selectedZipcode || initialValues?.zipcode || ''
    })

    // Load Provinces on Mount
    useEffect(() => {
        const loadProvinces = async () => {
            try {
                const list = await getProvinces()
                setProvinces(list)
            } finally {
                setLoading(false)
            }
        }
        loadProvinces()
    }, [])

    // Sync with external initialValues changes (e.g. fill test data)
    useEffect(() => {
        if (initialValues) {
            setSelected(prev => ({
                province: initialValues.province || prev.province,
                amphoe: initialValues.amphoe || prev.amphoe,
                district: initialValues.district || prev.district,
                zipcode: initialValues.zipcode || prev.zipcode
            }))
        }
    }, [initialValues])

    // Handler when Province changes
    const handleProvinceChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const province = e.target.value
        setSelected(prev => ({ ...prev, province, amphoe: '', district: '', zipcode: '' }))
        setAmphoes([])
        setDistricts([])

        if (province) {
            setLoading(true)
            const list = await getAmphoes(province)
            setAmphoes(list)
            setLoading(false)
        }

        notifyChange(province, '', '', '')
    }

    // Handler when Amphoe changes
    const handleAmphoeChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const amphoe = e.target.value
        setSelected(prev => ({ ...prev, amphoe, district: '', zipcode: '' }))
        setDistricts([])

        if (amphoe) {
            setLoading(true)
            const list = await getDistricts(selected.province, amphoe)
            setDistricts(list)
            setLoading(false)
        }

        notifyChange(selected.province, amphoe, '', '')
    }

    // Handler when District changes
    const handleDistrictChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const district = e.target.value
        let zipcode = ''

        if (district) {
            const code = await getZipcode(selected.province, selected.amphoe, district)
            zipcode = code ? code.toString() : ''
        }

        setSelected(prev => ({ ...prev, district, zipcode }))
        notifyChange(selected.province, selected.amphoe, district, zipcode)
    }

    const notifyChange = (province: string, amphoe: string, district: string, zipcode: string) => {
        const address = { province, amphoe, district, zipcode }
        onAddressChange?.(address)
        onLocationChange?.(address)
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Province */}
            <div className="space-y-1">
                <label className="text-sm font-medium text-text-primary dark:text-text-light">
                    {t('profile.address_province')}
                </label>
                <div className="relative">
                    <select
                        value={selected.province}
                        onChange={handleProvinceChange}
                        disabled={loading && provinces.length === 0}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-surface-dark focus:ring-2 focus:ring-neon-purple focus:border-transparent outline-none appearance-none transition-all disabled:opacity-50"
                    >
                        <option value="">{t('profile.address_province')}</option>
                        {provinces.map(p => (
                            <option key={p} value={p}>{p}</option>
                        ))}
                    </select>
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
            </div>

            {/* Amphoe */}
            <div className="space-y-1">
                <label className="text-sm font-medium text-text-primary dark:text-text-light">
                    {t('profile.address_district')}
                </label>
                <div className="relative">
                    <select
                        value={selected.amphoe}
                        onChange={handleAmphoeChange}
                        disabled={!selected.province}
                        className="w-full pl-4 pr-10 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-surface-dark focus:ring-2 focus:ring-neon-purple focus:border-transparent outline-none appearance-none transition-all disabled:opacity-50 disabled:bg-gray-50 dark:disabled:bg-gray-800"
                    >
                        <option value="">{t('profile.address_district')}</option>
                        {amphoes.map(a => (
                            <option key={a} value={a}>{a}</option>
                        ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
            </div>

            {/* District */}
            <div className="space-y-1">
                <label className="text-sm font-medium text-text-primary dark:text-text-light">
                    {t('profile.address_subdistrict')}
                </label>
                <div className="relative">
                    <select
                        value={selected.district}
                        onChange={handleDistrictChange}
                        disabled={!selected.amphoe}
                        className="w-full pl-4 pr-10 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-surface-dark focus:ring-2 focus:ring-neon-purple focus:border-transparent outline-none appearance-none transition-all disabled:opacity-50 disabled:bg-gray-50 dark:disabled:bg-gray-800"
                    >
                        <option value="">{t('profile.address_subdistrict')}</option>
                        {districts.map(d => (
                            <option key={d} value={d}>{d}</option>
                        ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
            </div>

            {/* Zipcode */}
            <div className="space-y-1">
                <label className="text-sm font-medium text-text-primary dark:text-text-light">
                    {t('profile.address_postal')}
                </label>
                <input
                    type="text"
                    value={selected.zipcode}
                    readOnly
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-500 cursor-not-allowed outline-none"
                    placeholder="Auto-filled"
                />
            </div>

            {loading && provinces.length === 0 && (
                <div className="col-span-2 text-center text-xs text-neon-purple flex items-center justify-center gap-2 py-2">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    กำลังโหลดข้อมูลที่อยู่...
                </div>
            )}
        </div>
    )
}
