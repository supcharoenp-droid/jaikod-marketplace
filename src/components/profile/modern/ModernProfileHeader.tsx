'use client'

import React from 'react'
import { Crown, Sparkles, MapPin, Calendar, Edit3, Eye } from 'lucide-react'

interface ModernProfileHeaderProps {
    profile: any // Using any for flexibility based on SmartUserProfile
    onEdit?: () => void
    onViewAsBuyer?: () => void
}

export default function ModernProfileHeader({ profile, onEdit, onViewAsBuyer }: ModernProfileHeaderProps) {
    const isVerified = profile.role !== 'buyer' // Simplified logic
    const themeColor = profile.theme?.primaryColor || 'blue'

    return (
        <div className="relative mb-20">
            {/* Banner Background */}
            <div className="h-48 md:h-64 w-full rounded-b-[2.5rem] overflow-hidden relative shadow-lg">
                <div className={`absolute inset-0 bg-gradient-to-r ${profile.theme?.gradient || 'from-indigo-500 to-purple-500'}`}></div>
                <div className="absolute inset-0 bg-black/10 backdrop-blur-[2px]"></div>
                {/* Decorative Circles */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/10 rounded-full -ml-10 -mb-10 blur-2xl"></div>

                {profile.storeData?.bannerUrl && (
                    <img src={profile.storeData.bannerUrl} alt="Cover" className="w-full h-full object-cover relative z-0 opacity-80 mix-blend-overlay" />
                )}
            </div>

            {/* Profile Content Container */}
            <div className="container mx-auto px-6 absolute top-28 md:top-40 left-0 right-0">
                <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 md:p-8 shadow-xl border border-white/60 flex flex-col md:flex-row items-center md:items-end gap-6 relative">

                    {/* Glowing Avatar */}
                    <div className="absolute -top-16 md:-top-20 left-1/2 md:left-8 -translate-x-1/2 md:translate-x-0 group">
                        <div className="relative w-32 h-32 md:w-40 md:h-40">
                            {/* Glow Effect */}
                            <div className={`absolute inset-0 rounded-full bg-gradient-to-tr ${profile.theme?.gradient} blur-xl opacity-40 group-hover:opacity-60 transition-opacity duration-500`}></div>
                            <img
                                src={profile.avatar}
                                alt={profile.displayName}
                                className="w-full h-full rounded-full object-cover border-4 border-white shadow-2xl relative z-10"
                            />
                            {isVerified && (
                                <div className="absolute bottom-2 right-2 z-20 bg-blue-500 text-white p-1.5 rounded-full ring-4 ring-white shadow-lg" title="Verified">
                                    <Crown className="w-4 h-4 fill-current" />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Spacer for Avatar on Desktop */}
                    <div className="md:w-48 hidden md:block shrink-0"></div>

                    {/* Info Section */}
                    <div className="flex-1 text-center md:text-left mt-16 md:mt-0">
                        <div className="flex flex-col md:flex-row md:items-center gap-2 mb-2 justify-center md:justify-start">
                            <h1 className="text-3xl font-black text-gray-800 tracking-tight">{profile.displayName}</h1>
                            {profile.persona?.title && (
                                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide bg-gradient-to-r ${profile.theme?.gradient} text-white shadow-md mx-auto md:mx-0 w-fit`}>
                                    {profile.persona.title}
                                </span>
                            )}
                        </div>

                        <p className="text-gray-500 font-medium mb-4 max-w-xl mx-auto md:mx-0 line-clamp-2">
                            {profile.persona?.description || profile.bio || 'Welcome to my profile on JaiKod!'}
                        </p>

                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm text-gray-500 font-medium">
                            <span className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                                <Calendar className="w-4 h-4 text-gray-400" /> {profile.joinDate}
                            </span>
                            <span className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                                <MapPin className="w-4 h-4 text-gray-400" /> Bangkok, Thailand
                            </span>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 shrink-0">
                        <button
                            onClick={onViewAsBuyer}
                            className="bg-white/50 hover:bg-white text-gray-700 font-semibold px-5 py-2.5 rounded-xl border border-gray-200 hover:border-gray-300 shadow-sm transition-all flex items-center gap-2"
                        >
                            <Eye className="w-4 h-4" /> View as Buyer
                        </button>
                        <button
                            onClick={onEdit}
                            className={`bg-gradient-to-r ${profile.theme?.gradient || 'from-blue-600 to-indigo-600'} text-white font-bold px-6 py-2.5 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center gap-2`}
                        >
                            <Edit3 className="w-4 h-4" /> Edit Profile
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
