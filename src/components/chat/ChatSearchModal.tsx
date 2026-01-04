/**
 * Chat Search Modal - V2 Feature
 * Search messages within a chat room
 */

'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, MessageCircle, Image as ImageIcon, MapPin, Banknote } from 'lucide-react';
import { searchMessagesInRoom, type ChatMessage } from '@/lib/chat';

interface ChatSearchModalProps {
    isOpen: boolean;
    onClose: () => void;
    roomId: string;
    onMessageClick?: (messageId: string) => void;
}

export default function ChatSearchModal({
    isOpen,
    onClose,
    roomId,
    onMessageClick
}: ChatSearchModalProps) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<ChatMessage[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    // Focus input when modal opens
    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 100);
        } else {
            setQuery('');
            setResults([]);
            setHasSearched(false);
        }
    }, [isOpen]);

    // Debounced search
    useEffect(() => {
        if (!query.trim()) {
            setResults([]);
            setHasSearched(false);
            return;
        }

        const timer = setTimeout(async () => {
            setIsSearching(true);
            const found = await searchMessagesInRoom(roomId, query);
            setResults(found);
            setIsSearching(false);
            setHasSearched(true);
        }, 300);

        return () => clearTimeout(timer);
    }, [query, roomId]);

    const getMessageTypeIcon = (type?: string) => {
        switch (type) {
            case 'image': return <ImageIcon className="w-4 h-4 text-blue-500" />;
            case 'location': return <MapPin className="w-4 h-4 text-green-500" />;
            case 'offer': return <Banknote className="w-4 h-4 text-purple-500" />;
            default: return <MessageCircle className="w-4 h-4 text-gray-400" />;
        }
    };

    const formatDate = (date: Date) => {
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));

        if (days === 0) {
            return date.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' });
        } else if (days === 1) {
            return 'เมื่อวาน';
        } else if (days < 7) {
            return `${days} วันที่แล้ว`;
        } else {
            return date.toLocaleDateString('th-TH', { day: 'numeric', month: 'short' });
        }
    };

    const highlightMatch = (text: string, searchQuery: string) => {
        if (!searchQuery.trim()) return text;

        const parts = text.split(new RegExp(`(${searchQuery})`, 'gi'));
        return parts.map((part, i) =>
            part.toLowerCase() === searchQuery.toLowerCase()
                ? <mark key={i} className="bg-yellow-200 dark:bg-yellow-900 px-0.5 rounded">{part}</mark>
                : part
        );
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-black/50" onClick={onClose}>
            <motion.div
                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-lg mx-4 shadow-2xl overflow-hidden"
            >
                {/* Search Input */}
                <div className="p-4 border-b border-gray-100 dark:border-gray-800">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            id="message-search-input"
                            name="message-search-input"
                            ref={inputRef}
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="ค้นหาข้อความ..."
                            className="w-full pl-12 pr-10 py-3 bg-gray-100 dark:bg-gray-800 rounded-xl text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                        {query && (
                            <button
                                onClick={() => setQuery('')}
                                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                </div>

                {/* Results */}
                <div className="max-h-96 overflow-y-auto">
                    {isSearching && (
                        <div className="p-8 text-center">
                            <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                            <p className="text-sm text-gray-500">กำลังค้นหา...</p>
                        </div>
                    )}

                    {!isSearching && hasSearched && results.length === 0 && (
                        <div className="p-8 text-center">
                            <Search className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                            <p className="text-gray-500 font-medium">ไม่พบข้อความที่ตรงกัน</p>
                            <p className="text-sm text-gray-400">ลองใช้คำค้นหาอื่น</p>
                        </div>
                    )}

                    {!isSearching && results.length > 0 && (
                        <div className="py-2">
                            <div className="px-4 py-2 text-xs font-bold text-gray-500 uppercase tracking-wider">
                                พบ {results.length} ข้อความ
                            </div>
                            {results.map((msg) => (
                                <button
                                    key={msg.id}
                                    onClick={() => {
                                        onMessageClick?.(msg.id);
                                        onClose();
                                    }}
                                    className="w-full px-4 py-3 flex items-start gap-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-left"
                                >
                                    <div className="mt-1">
                                        {getMessageTypeIcon(msg.type)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-0.5">
                                            <span className="text-sm font-bold text-gray-900 dark:text-white">
                                                {msg.sender_name}
                                            </span>
                                            <span className="text-xs text-gray-400">
                                                {formatDate(msg.created_at)}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                                            {highlightMatch(msg.text || '', query)}
                                        </p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}

                    {!isSearching && !hasSearched && (
                        <div className="p-8 text-center">
                            <Search className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                            <p className="text-gray-500">พิมพ์เพื่อค้นหาข้อความ</p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-3 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
                    <button
                        onClick={onClose}
                        className="w-full py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                    >
                        ปิด
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
