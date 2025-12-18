'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { type ChatRoom } from '@/lib/chat';
import { getUserProfile, type UserProfile } from '@/lib/user';
import { ImageIcon, User } from 'lucide-react';

interface ChatListItemProps {
    room: ChatRoom;
    currentUserId: string;
    isSelected: boolean;
    onClick: () => void;
}

export default function ChatListItem({ room, currentUserId, isSelected, onClick }: ChatListItemProps) {
    const [partnerProfile, setPartnerProfile] = useState<UserProfile | null>(null);

    const partnerId = room.buyer_id === currentUserId ? room.seller_id : room.buyer_id;
    const isSeller = room.seller_id === partnerId; // Is the partner a seller?

    useEffect(() => {
        let isMounted = true;
        const fetchPartner = async () => {
            if (partnerId) {
                const profile = await getUserProfile(partnerId);
                if (isMounted) setPartnerProfile(profile);
            }
        };
        fetchPartner();
        return () => { isMounted = false; };
    }, [partnerId]);

    const partnerName = partnerProfile?.displayName || (isSeller ? 'ผู้ขาย' : 'ผู้ซื้อ');
    const partnerImage = partnerProfile?.photoURL;

    return (
        <button
            onClick={onClick}
            className={`w-full p-4 flex gap-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors border-b border-gray-100 dark:border-gray-800 relative group text-left ${isSelected ? 'bg-purple-50 dark:bg-purple-900/20' : ''
                }`}
        >
            {isSelected && <div className="absolute left-0 top-0 bottom-0 w-1 bg-purple-600 dark:bg-purple-400" />}

            {/* Left: Partner Avatar */}
            <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 border border-gray-200 dark:border-gray-700 relative">
                    {partnerImage ? (
                        <Image src={partnerImage} alt={partnerName} fill className="object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-500 bg-gray-100 dark:bg-gray-800 font-bold text-lg">
                            {partnerName[0]?.toUpperCase()}
                        </div>
                    )}
                </div>
            </div>

            {/* Middle: Name & Last Message */}
            <div className="flex-1 min-w-0 flex flex-col justify-center gap-0.5">
                <h3 className="font-bold text-base text-blue-900 dark:text-blue-300 truncate">
                    {partnerName}
                </h3>
                <p className={`text-sm truncate ${(room.buyer_id === currentUserId ? room.unread_count_buyer : room.unread_count_seller) > 0
                        ? 'font-bold text-gray-900 dark:text-white'
                        : 'text-gray-500 dark:text-gray-400'
                    }`}>
                    {room.last_message || 'เริ่มบทสนทนา'}
                </p>
                <span className="text-xs text-gray-400">
                    {new Date(room.last_message_at).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })}
                </span>
            </div>

            {/* Right: Product Image */}
            <div className="flex-shrink-0 self-center">
                <div className="w-14 h-14 rounded-md overflow-hidden bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 relative">
                    {room.listing_image ? (
                        <Image src={room.listing_image} alt="Product" fill className="object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <ImageIcon className="w-6 h-6" />
                        </div>
                    )}
                </div>
            </div>

            {/* Unread Badge (Floating) */}
            {(room.buyer_id === currentUserId ? room.unread_count_buyer : room.unread_count_seller) > 0 && (
                <div className="absolute top-3 right-3 w-3 h-3 bg-red-500 rounded-full border-2 border-white dark:border-gray-900 animate-pulse"></div>
            )}
        </button>
    );
}
