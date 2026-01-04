'use client';

import {
    MoreVertical, Phone, Video,
    ArrowLeft, Shield, AlertTriangle, Trash2, Ban, ChevronRight,
    Search, BellOff, Archive
} from 'lucide-react';
import Image from 'next/image';
import { useState, useRef, useEffect } from 'react';
import ProductStatusBadge from './ProductStatusBadge';

interface ChatRoomHeaderProps {
    // Seller/Buyer Info
    partnerName: string;
    partnerRole?: 'buyer' | 'seller';
    partnerImage?: string;
    isOnline?: boolean;
    trustScore?: number;

    // Product Info
    productTitle: string;
    productPrice: number;
    productImage?: string;
    productId: string;
    productStatus?: 'available' | 'sold' | 'reserved' | 'deleted';

    // V2 Chat state
    isMuted?: boolean;
    isArchived?: boolean;

    // Actions
    onBack?: () => void;
    onDeleteChat?: () => void;
    onReportUser?: () => void;
    onBlockUser?: () => void;
    onViewProduct?: () => void;
    onSearchClick?: () => void;
    onMuteToggle?: () => void;
    onArchiveToggle?: () => void;
}

export default function ChatRoomHeader({
    partnerName,
    partnerRole,
    partnerImage,
    isOnline = true,
    trustScore = 98,
    productTitle,
    productPrice,
    productImage,
    productStatus = 'available',
    isMuted = false,
    isArchived = false,
    onBack,
    onDeleteChat,
    onReportUser,
    onBlockUser,
    onViewProduct,
    onSearchClick,
    onMuteToggle,
    onArchiveToggle
}: ChatRoomHeaderProps) {
    const [showMenu, setShowMenu] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    // Close menu when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setShowMenu(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className="flex flex-col bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm z-30">
            {/* Top Row: Partner Info & Tools */}
            <div className="flex items-center justify-between p-3 px-4">
                <div className="flex items-center gap-3">
                    {/* Back Button (Mobile) */}
                    <button
                        onClick={onBack}
                        className="lg:hidden p-2 -ml-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition"
                    >
                        <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                    </button>

                    {/* Avatar */}
                    <div className="relative">
                        <div className="w-10 h-10 rounded-full overflow-hidden bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center text-white font-bold text-lg">
                            {partnerImage ? (
                                <Image src={partnerImage} alt={partnerName} width={40} height={40} className="object-cover" />
                            ) : (
                                partnerName[0]?.toUpperCase()
                            )}
                        </div>
                        {isOnline && (
                            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-gray-900 rounded-full"></span>
                        )}
                    </div>

                    {/* Name & Status */}
                    <div>
                        <div className="flex items-center gap-2">
                            <h2 className="font-bold text-gray-900 dark:text-white text-base flex items-center gap-2">
                                {partnerName}
                                {partnerRole && (
                                    <span className={`text-[10px] px-1.5 py-0.5 rounded border ${partnerRole === 'seller'
                                        ? 'bg-orange-50 text-orange-600 border-orange-100 dark:bg-orange-900/20 dark:border-orange-900'
                                        : 'bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-900/20 dark:border-blue-900'
                                        }`}>
                                        {partnerRole === 'seller' ? 'ผู้ขาย' : 'ผู้ซื้อ'}
                                    </span>
                                )}
                            </h2>
                            {trustScore >= 80 && (
                                <span className="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-[10px] px-1.5 py-0.5 rounded-md font-medium flex items-center gap-0.5">
                                    <Shield className="w-3 h-3" />
                                    {trustScore}%
                                </span>
                            )}
                        </div>
                        <div className="flex items-center gap-1">
                            <p className="text-xs text-green-600 dark:text-green-400 font-medium">
                                {isOnline ? 'ออนไลน์' : 'ออฟไลน์'}
                            </p>
                            {isMuted && (
                                <BellOff className="w-3 h-3 text-gray-400" />
                            )}
                            {isArchived && (
                                <Archive className="w-3 h-3 text-gray-400" />
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-1">
                    {/* Search Button */}
                    <button
                        onClick={onSearchClick}
                        className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-gray-800 rounded-full transition"
                        title="ค้นหาข้อความ"
                    >
                        <Search className="w-5 h-5" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-gray-800 rounded-full transition hidden sm:block">
                        <Phone className="w-5 h-5" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-gray-800 rounded-full transition hidden sm:block">
                        <Video className="w-5 h-5" />
                    </button>

                    {/* More Menu */}
                    <div className="relative" ref={menuRef}>
                        <button
                            onClick={() => setShowMenu(!showMenu)}
                            className="p-2 text-gray-500 hover:text-gray-800 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition"
                        >
                            <MoreVertical className="w-5 h-5" />
                        </button>

                        {/* Dropdown */}
                        {showMenu && (
                            <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden py-1 animate-in fade-in zoom-in-95 duration-200">
                                <button
                                    onClick={() => { onDeleteChat?.(); setShowMenu(false); }}
                                    className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2"
                                >
                                    <Trash2 className="w-4 h-4" />
                                    ลบแชท
                                </button>
                                <button
                                    onClick={() => { onBlockUser?.(); setShowMenu(false); }}
                                    className="w-full text-left px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2"
                                >
                                    <Ban className="w-4 h-4" />
                                    บล็อคผู้ใช้
                                </button>
                                <button
                                    onClick={() => { onReportUser?.(); setShowMenu(false); }}
                                    className="w-full text-left px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2"
                                >
                                    <AlertTriangle className="w-4 h-4" />
                                    รายงาน
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Bottom Row: Product Context (Compact) */}
            <div
                className="bg-gray-50 dark:bg-gray-800/50 px-4 py-2 flex items-center justify-between border-t border-gray-100 dark:border-gray-800 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                onClick={onViewProduct}
            >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="relative w-10 h-10 bg-white rounded-md overflow-hidden border border-gray-200 dark:border-gray-700 flex-none">
                        {productImage && (
                            <Image src={productImage} alt={productTitle} fill className="object-cover" />
                        )}
                    </div>
                    <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                            <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                {productTitle}
                            </h3>
                            <ProductStatusBadge status={productStatus} size="sm" />
                        </div>
                        <p className="text-xs text-purple-600 dark:text-purple-400 font-bold">
                            ฿{productPrice.toLocaleString()}
                        </p>
                    </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
            </div>
        </div>
    );
}
