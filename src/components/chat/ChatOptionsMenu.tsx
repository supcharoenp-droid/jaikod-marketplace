/**
 * Chat Options Menu - V2 Feature
 * Dropdown menu for chat actions: Mute, Archive, Block, Report
 */

'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    MoreVertical, BellOff, Bell, Archive, ArchiveX,
    UserX, AlertTriangle, Search, Trash2, Check
} from 'lucide-react';
import {
    toggleMuteChat,
    toggleArchiveChat,
    blockUserInChat,
    reportChatUser
} from '@/lib/chat';

interface ChatOptionsMenuProps {
    roomId: string;
    role: 'buyer' | 'seller';
    isMuted?: boolean;
    isArchived?: boolean;
    isBlocked?: boolean;
    onMuteChange?: (muted: boolean) => void;
    onArchiveChange?: (archived: boolean) => void;
    onBlockChange?: (blocked: boolean) => void;
    onSearchClick?: () => void;
    onDeleteClick?: () => void;
}

export default function ChatOptionsMenu({
    roomId,
    role,
    isMuted = false,
    isArchived = false,
    isBlocked = false,
    onMuteChange,
    onArchiveChange,
    onBlockChange,
    onSearchClick,
    onDeleteClick
}: ChatOptionsMenuProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isReportModalOpen, setIsReportModalOpen] = useState(false);
    const [reportReason, setReportReason] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleMute = async () => {
        setIsLoading(true);
        try {
            await toggleMuteChat(roomId, role, !isMuted);
            onMuteChange?.(!isMuted);
        } catch (error) {
            console.error('Error toggling mute:', error);
        }
        setIsLoading(false);
        setIsOpen(false);
    };

    const handleArchive = async () => {
        setIsLoading(true);
        try {
            await toggleArchiveChat(roomId, role, !isArchived);
            onArchiveChange?.(!isArchived);
        } catch (error) {
            console.error('Error toggling archive:', error);
        }
        setIsLoading(false);
        setIsOpen(false);
    };

    const handleBlock = async () => {
        if (!confirm('คุณแน่ใจหรือไม่ที่จะบล็อกผู้ใช้นี้? คุณจะไม่ได้รับข้อความจากผู้ใช้นี้อีก')) {
            return;
        }
        setIsLoading(true);
        try {
            await blockUserInChat(roomId, role === 'buyer' ? 'buyer' : 'seller');
            onBlockChange?.(true);
        } catch (error) {
            console.error('Error blocking user:', error);
        }
        setIsLoading(false);
        setIsOpen(false);
    };

    const handleReport = async () => {
        if (!reportReason.trim()) {
            alert('กรุณาระบุเหตุผลในการรายงาน');
            return;
        }
        setIsLoading(true);
        try {
            // Get current user ID from somewhere (should be passed as prop)
            await reportChatUser(roomId, 'current_user_id', reportReason);
            alert('รายงานสำเร็จ ทีมงานจะตรวจสอบภายใน 24 ชั่วโมง');
            setIsReportModalOpen(false);
            setReportReason('');
        } catch (error) {
            console.error('Error reporting user:', error);
            alert('เกิดข้อผิดพลาด กรุณาลองใหม่');
        }
        setIsLoading(false);
        setIsOpen(false);
    };

    const reportReasons = [
        'ข้อความหยาบคาย/ไม่เหมาะสม',
        'การฉ้อโกง/หลอกลวง',
        'สแปม/โฆษณา',
        'ข้อมูลเท็จ',
        'คุกคาม/ข่มขู่',
        'อื่นๆ'
    ];

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
            >
                <MoreVertical className="w-5 h-5" />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Overlay */}
                        <div
                            className="fixed inset-0 z-40"
                            onClick={() => setIsOpen(false)}
                        />

                        {/* Menu */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: -10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: -10 }}
                            className="absolute right-0 top-full mt-1 w-56 bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 z-50 overflow-hidden"
                        >
                            {/* Search */}
                            <button
                                onClick={() => { onSearchClick?.(); setIsOpen(false); }}
                                className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-left"
                            >
                                <Search className="w-5 h-5 text-gray-400" />
                                <span className="text-sm text-gray-700 dark:text-gray-200">ค้นหาข้อความ</span>
                            </button>

                            <div className="border-t border-gray-100 dark:border-gray-800" />

                            {/* Mute */}
                            <button
                                onClick={handleMute}
                                disabled={isLoading}
                                className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-left"
                            >
                                {isMuted ? (
                                    <>
                                        <Bell className="w-5 h-5 text-green-500" />
                                        <span className="text-sm text-gray-700 dark:text-gray-200">เปิดการแจ้งเตือน</span>
                                    </>
                                ) : (
                                    <>
                                        <BellOff className="w-5 h-5 text-gray-400" />
                                        <span className="text-sm text-gray-700 dark:text-gray-200">ปิดการแจ้งเตือน</span>
                                    </>
                                )}
                            </button>

                            {/* Archive */}
                            <button
                                onClick={handleArchive}
                                disabled={isLoading}
                                className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-left"
                            >
                                {isArchived ? (
                                    <>
                                        <ArchiveX className="w-5 h-5 text-blue-500" />
                                        <span className="text-sm text-gray-700 dark:text-gray-200">ยกเลิกเก็บถาวร</span>
                                    </>
                                ) : (
                                    <>
                                        <Archive className="w-5 h-5 text-gray-400" />
                                        <span className="text-sm text-gray-700 dark:text-gray-200">เก็บถาวร</span>
                                    </>
                                )}
                            </button>

                            <div className="border-t border-gray-100 dark:border-gray-800" />

                            {/* Block */}
                            <button
                                onClick={handleBlock}
                                disabled={isLoading || isBlocked}
                                className="w-full px-4 py-3 flex items-center gap-3 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-left"
                            >
                                <UserX className="w-5 h-5 text-red-500" />
                                <span className="text-sm text-red-600">
                                    {isBlocked ? 'บล็อกแล้ว' : 'บล็อกผู้ใช้'}
                                </span>
                            </button>

                            {/* Report */}
                            <button
                                onClick={() => { setIsReportModalOpen(true); setIsOpen(false); }}
                                className="w-full px-4 py-3 flex items-center gap-3 hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-colors text-left"
                            >
                                <AlertTriangle className="w-5 h-5 text-orange-500" />
                                <span className="text-sm text-orange-600">รายงานผู้ใช้</span>
                            </button>

                            <div className="border-t border-gray-100 dark:border-gray-800" />

                            {/* Delete */}
                            <button
                                onClick={() => { onDeleteClick?.(); setIsOpen(false); }}
                                className="w-full px-4 py-3 flex items-center gap-3 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-left"
                            >
                                <Trash2 className="w-5 h-5 text-red-500" />
                                <span className="text-sm text-red-600">ลบแชท</span>
                            </button>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Report Modal */}
            <AnimatePresence>
                {isReportModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setIsReportModalOpen(false)}>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white dark:bg-gray-900 rounded-2xl p-6 w-full max-w-md mx-4 shadow-2xl"
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                                    <AlertTriangle className="w-5 h-5 text-orange-600" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">รายงานผู้ใช้</h3>
                                    <p className="text-sm text-gray-500">เลือกเหตุผลในการรายงาน</p>
                                </div>
                            </div>

                            <div className="space-y-2 mb-4">
                                {reportReasons.map((reason) => (
                                    <button
                                        key={reason}
                                        onClick={() => setReportReason(reason)}
                                        className={`w-full p-3 rounded-xl text-sm font-medium text-left transition-colors flex items-center justify-between ${reportReason === reason
                                                ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 border-2 border-orange-500'
                                                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                                            }`}
                                    >
                                        {reason}
                                        {reportReason === reason && <Check className="w-4 h-4" />}
                                    </button>
                                ))}
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setIsReportModalOpen(false)}
                                    className="flex-1 py-2.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl font-bold text-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                                >
                                    ยกเลิก
                                </button>
                                <button
                                    onClick={handleReport}
                                    disabled={!reportReason || isLoading}
                                    className="flex-1 py-2.5 bg-orange-500 text-white rounded-xl font-bold text-sm hover:bg-orange-600 transition-colors disabled:opacity-50"
                                >
                                    {isLoading ? 'กำลังส่ง...' : 'ส่งรายงาน'}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
