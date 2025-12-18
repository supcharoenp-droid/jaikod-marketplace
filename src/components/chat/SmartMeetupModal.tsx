'use client'

import React, { useState } from 'react'
import {
    MapPin, Navigation, Shield, Clock,
    Calendar, CheckCircle2, AlertTriangle, X, ChevronLeft
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface MeetupSpot {
    id: string
    name: string
    address: string
    type: 'mall' | 'police' | 'station'
    etaMe: string
    etaOther: string
    safetyScore: number
    badges: string[]
    lat: number
    lng: number
}

const SUGGESTED_SPOTS: MeetupSpot[] = [
    {
        id: '1',
        name: 'Siam Paragon (Main Info Counter)',
        address: '991 Rama I Rd, Pathum Wan',
        type: 'mall',
        etaMe: '15 min (BTS)',
        etaOther: '12 min (Walk)',
        safetyScore: 95,
        badges: ['CCTV Zone', 'Crowded', 'Indoor'],
        lat: 13.7462,
        lng: 100.5347
    },
    {
        id: '2',
        name: 'Pathum Wan Police Station',
        address: '445 Phayathai Rd',
        type: 'police',
        etaMe: '20 min (Drive)',
        etaOther: '18 min (Drive)',
        safetyScore: 99,
        badges: ['Max Security', '24/7'],
        lat: 13.7442,
        lng: 100.5298
    },
    {
        id: '3',
        name: 'BTS Siam Station (Exit 2)',
        address: 'Rama I Rd',
        type: 'station',
        etaMe: '10 min (BTS)',
        etaOther: '15 min (Walk)',
        safetyScore: 85,
        badges: ['Public Area', 'High Traffic'],
        lat: 13.7455,
        lng: 100.5339
    }
]

export default function SmartMeetupModal({ isOpen, onClose, onConfirm }: any) {
    const [selectedSpot, setSelectedSpot] = useState<string | null>(null)
    const [step, setStep] = useState<'selection' | 'time'>('selection')

    const activeSpot = SUGGESTED_SPOTS.find(s => s.id === selectedSpot)

    if (!isOpen) return null

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4"
            >
                <motion.div
                    initial={{ y: '100%' }}
                    animate={{ y: 0 }}
                    exit={{ y: '100%' }}
                    className="bg-white dark:bg-[#1a1a1a] w-full max-w-md rounded-t-2xl sm:rounded-2xl overflow-hidden flex flex-col max-h-[90vh]"
                >
                    {/* Header */}
                    <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-white dark:bg-[#1a1a1a] sticky top-0 z-10">
                        <div>
                            <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                <MapPin className="w-5 h-5 text-violet-600" />
                                Smart Meetup
                            </h2>
                            <p className="text-xs text-green-600 font-medium">Auto-suggested Safe Zones</p>
                        </div>
                        <button onClick={onClose} className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full">
                            <X className="w-5 h-5 text-gray-500" />
                        </button>
                    </div>

                    {/* Step 1: Map & Spot Selection */}
                    {step === 'selection' && (
                        <div className="flex-1 overflow-y-auto bg-gray-50 dark:bg-black p-4 space-y-4">
                            {/* Mock Map Placeholder */}
                            <div className="w-full h-48 bg-gray-200 dark:bg-gray-800 rounded-xl relative overflow-hidden flex items-center justify-center border border-gray-300 dark:border-gray-700">
                                <div className="absolute inset-0 bg-[url('https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/100.5347,13.7462,14,0/600x400?access_token=mock')] bg-cover opacity-50"></div>
                                <div className="z-10 bg-white/90 dark:bg-black/80 px-4 py-2 rounded-full text-xs font-bold shadow-sm flex items-center gap-2">
                                    <Shield className="w-4 h-4 text-green-600" />
                                    Safe Zone Heatmap Verified
                                </div>
                                {/* Mock Markers */}
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-violet-600/30 rounded-full animate-ping"></div>
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-3xl">📍</div>
                            </div>

                            <div className="space-y-3">
                                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Suggested Spots</h3>
                                {SUGGESTED_SPOTS.map((spot) => (
                                    <div
                                        key={spot.id}
                                        onClick={() => setSelectedSpot(spot.id)}
                                        className={`relative p-4 rounded-xl border-2 transition-all cursor-pointer ${selectedSpot === spot.id
                                            ? 'border-violet-600 bg-violet-50 dark:bg-violet-900/20'
                                            : 'border-white dark:border-[#222] bg-white dark:bg-[#222] shadow-sm hover:border-gray-300'
                                            }`}
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <h4 className="font-bold text-gray-900 dark:text-white text-sm">{spot.name}</h4>
                                                <p className="text-xs text-gray-500">{spot.address}</p>
                                            </div>
                                            {spot.type === 'police' && <Shield className="w-5 h-5 text-blue-600" />}
                                            {spot.type === 'mall' && <Shield className="w-5 h-5 text-green-600" />}
                                        </div>

                                        <div className="flex gap-2 mb-3">
                                            {spot.badges.map((badge, i) => (
                                                <span key={i} className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 text-[10px] rounded text-gray-600 dark:text-gray-300 font-medium">
                                                    {badge}
                                                </span>
                                            ))}
                                        </div>

                                        <div className="flex items-center justify-between text-xs border-t border-gray-100 dark:border-gray-700 pt-2">
                                            <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                                                <Navigation className="w-3 h-3" />
                                                You: <b>{spot.etaMe}</b>
                                            </div>
                                            <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                                                <Navigation className="w-3 h-3" />
                                                Seller: <b>{spot.etaOther}</b>
                                            </div>
                                        </div>

                                        {selectedSpot === spot.id && (
                                            <div className="absolute top-2 right-2 w-5 h-5 bg-violet-600 rounded-full flex items-center justify-center">
                                                <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Step 2: Time Selection */}
                    {step === 'time' && (
                        <div className="flex-1 overflow-y-auto bg-gray-50 dark:bg-black p-4 space-y-4">
                            <h3 className="text-gray-900 dark:text-white font-bold flex items-center gap-2 mb-4">
                                <Clock className="w-5 h-5 text-violet-600" />
                                Select Time (Auto-Suggested)
                            </h3>
                            <div className="grid grid-cols-2 gap-3">
                                {['Today, 18:00', 'Today, 19:30', 'Tomorrow, 12:00', 'Tomorrow, 17:00', 'Weekend, 10:00', 'Weekend, 14:00'].map(t => (
                                    <button
                                        key={t}
                                        onClick={onClose}
                                        className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#222] hover:border-violet-500 hover:text-violet-600 font-bold text-sm flex flex-col items-center gap-1 shadow-sm transition-all active:scale-95"
                                    >
                                        <Calendar className="w-4 h-4 text-gray-400" />
                                        {t}
                                    </button>
                                ))}
                            </div>
                            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-xs text-blue-700 dark:text-blue-300 flex gap-2">
                                <Shield className="w-4 h-4 shrink-0" />
                                These times are recommended based on crowd density and CCTV operation hours.
                            </div>
                        </div>
                    )}

                    {/* Footer Actions */}
                    <div className="p-4 bg-white dark:bg-[#1a1a1a] border-t border-gray-200 dark:border-gray-800 shrink-0">
                        {step === 'selection' ? (
                            selectedSpot ? (
                                <button
                                    onClick={() => setStep('time')}
                                    className="w-full bg-violet-600 hover:bg-violet-700 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-transform active:scale-95"
                                >
                                    <Calendar className="w-5 h-5" />
                                    Choose Time
                                </button>
                            ) : (
                                <div className="text-center text-xs text-gray-400 py-2">Select a safe spot to proceed</div>
                            )
                        ) : (
                            <button
                                onClick={() => setStep('selection')}
                                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 dark:bg-gray-800 dark:text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2"
                            >
                                <ChevronLeft className="w-5 h-5" />
                                Back to Spots
                            </button>
                        )}
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    )
}
