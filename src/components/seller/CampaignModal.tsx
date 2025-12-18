'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Wand2, Ticket, Users, Calendar, DollarSign } from 'lucide-react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

interface CampaignModalProps {
    isOpen: boolean
    onClose: () => void
    onSave: (data: any) => void
}

export default function CampaignModal({ isOpen, onClose, onSave }: CampaignModalProps) {
    const [step, setStep] = useState(1)
    const [formData, setFormData] = useState({
        name: '',
        type: 'voucher', // voucher, flash_sale
        discountAmount: '',
        minSpend: '',
        targetAudience: 'all',
        copy: { th: '', en: '' }
    })
    const [isGenerating, setIsGenerating] = useState(false)

    if (!isOpen) return null

    const handleGenerateCopy = async () => {
        setIsGenerating(true)
        // Mock AI Generation
        await new Promise(r => setTimeout(r, 1500))
        setFormData(prev => ({
            ...prev,
            copy: {
                th: `🔥 ลดแรงแซงทุกโค้ง! รับส่วนลด ${prev.discountAmount} บาท เมื่อช้อปครบ ${prev.minSpend} บาท เฉพาะวันนี้เท่านั้น!`,
                en: `🔥 Hot Deal! Get ${prev.discountAmount} THB off when spend ${prev.minSpend} THB. Today only!`
            }
        }))
        setIsGenerating(false)
    }

    const segments = [
        { id: 'all', label: 'All Users', icon: Users, desc: 'Everybody visiting your shop' },
        { id: 'loyal', label: 'Loyal Customers', icon: Users, desc: 'Bought > 2 times (AI Selected)' },
        { id: 'new', label: 'New Visitors', icon: Users, desc: 'Never bought before' },
        { id: 'cart', label: 'Abandoned Cart', icon: ShoppingCartIcon, desc: 'Added items but did not pay' }
    ]

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]"
                >
                    <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            <Ticket className="w-5 h-5 text-neon-purple" />
                            Create Campaign
                        </h2>
                        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="p-6 overflow-y-auto space-y-6">
                        {/* Section 1: Basic Info */}
                        <div className="space-y-4">
                            <h3 className="font-bold text-sm text-gray-500 uppercase">1. Optimization Detail</h3>
                            <Input
                                label="Campaign Name"
                                placeholder="e.g. 12.12 Mega Sale"
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                            />

                            <div className="grid grid-cols-2 gap-4">
                                <Input
                                    label="Discount Amount (฿)"
                                    type="number"
                                    placeholder="50"
                                    value={formData.discountAmount}
                                    onChange={e => setFormData({ ...formData, discountAmount: e.target.value })}
                                />
                                <Input
                                    label="Min Spend (฿)"
                                    type="number"
                                    placeholder="300"
                                    value={formData.minSpend}
                                    onChange={e => setFormData({ ...formData, minSpend: e.target.value })}
                                />
                            </div>
                        </div>

                        {/* Section 2: AI Targeting */}
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <h3 className="font-bold text-sm text-gray-500 uppercase">2. AI Target Audience</h3>
                                <span className="text-xs bg-neon-purple text-white px-2 py-0.5 rounded-full">Recommended</span>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {segments.map(seg => (
                                    <div
                                        key={seg.id}
                                        onClick={() => setFormData({ ...formData, targetAudience: seg.id })}
                                        className={`p-3 rounded-lg border cursor-pointer transition-all ${formData.targetAudience === seg.id
                                                ? 'border-neon-purple bg-indigo-50 dark:bg-indigo-900/20 ring-1 ring-neon-purple'
                                                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                                            }`}
                                    >
                                        <div className="flex items-center gap-2 font-bold mb-1">
                                            <seg.icon className="w-4 h-4 text-indigo-500" />
                                            {seg.label}
                                        </div>
                                        <p className="text-xs text-gray-500">{seg.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Section 3: AI Copywriting */}
                        <div className="space-y-4">
                            <div className="flex justify-between items-end">
                                <h3 className="font-bold text-sm text-gray-500 uppercase">3. Smart Content</h3>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    className="text-xs h-8"
                                    onClick={handleGenerateCopy}
                                    isLoading={isGenerating}
                                >
                                    <Wand2 className="w-3 h-3 mr-2" />
                                    Generate Copy
                                </Button>
                            </div>

                            <div className="space-y-3">
                                <div className="relative">
                                    <span className="absolute top-2 right-2 text-xs font-bold text-gray-400">TH</span>
                                    <textarea
                                        className="w-full p-3 border rounded-xl bg-gray-50 dark:bg-gray-800 text-sm min-h-[80px]"
                                        placeholder="คำโฆษณาภาษาไทย..."
                                        value={formData.copy.th}
                                        onChange={e => setFormData({ ...formData, copy: { ...formData.copy, th: e.target.value } })}
                                    />
                                </div>
                                <div className="relative">
                                    <span className="absolute top-2 right-2 text-xs font-bold text-gray-400">EN</span>
                                    <textarea
                                        className="w-full p-3 border rounded-xl bg-gray-50 dark:bg-gray-800 text-sm min-h-[80px]"
                                        placeholder="English ad copy..."
                                        value={formData.copy.en}
                                        onChange={e => setFormData({ ...formData, copy: { ...formData.copy, en: e.target.value } })}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 border-t border-gray-100 dark:border-gray-800 flex justify-end gap-3">
                        <Button variant="ghost" onClick={onClose}>Cancel</Button>
                        <Button onClick={() => onSave(formData)}>Launch Campaign</Button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    )
}

function ShoppingCartIcon(props: any) {
    return (
        <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="21" r="1" /><circle cx="19" cy="21" r="1" /><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" /></svg>
    )
}
