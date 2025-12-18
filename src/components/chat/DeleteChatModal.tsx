import { X } from 'lucide-react';
import { useEffect, useRef } from 'react';

interface DeleteChatModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

export default function DeleteChatModal({ isOpen, onClose, onConfirm }: DeleteChatModalProps) {
    const modalRef = useRef<HTMLDivElement>(null);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div
                ref={modalRef}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-sm p-6 relative animate-in zoom-in-95 duration-200"
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                {/* Content */}
                <div className="text-center mt-2">
                    <h3 className="text-lg font-bold text-blue-900 dark:text-blue-100 mb-4">
                        ลบการสนทนานี้
                    </h3>

                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-8 leading-relaxed">
                        หลังจากที่กดลบ คุณจะไม่สามารถย้อนดูการ<br />สนทนานี้ได้อีก
                    </p>

                    {/* Buttons */}
                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            className="flex-1 py-2.5 px-4 border border-blue-900 dark:border-blue-400 text-blue-900 dark:text-blue-400 rounded-lg text-sm font-medium hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-colors"
                        >
                            ยกเลิก
                        </button>
                        <button
                            onClick={onConfirm}
                            className="flex-1 py-2.5 px-4 bg-blue-900 hover:bg-blue-800 text-white rounded-lg text-sm font-medium transition-colors shadow-sm"
                        >
                            ลบ
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
