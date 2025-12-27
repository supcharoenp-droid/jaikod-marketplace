'use client'

/**
 * AI Spec Confirmation Modal - Wrapper for AISpecConfirmation
 * 
 * Modal dialog สำหรับแสดง AISpecConfirmation พร้อม backdrop
 */

import { useEffect, useState } from 'react'
import { X } from 'lucide-react'
import AISpecConfirmation, {
    AIGeneratedData,
    ConfirmedData
} from './AISpecConfirmation'

interface AIConfirmationModalProps {
    isOpen: boolean
    onClose: () => void
    aiData: AIGeneratedData | null
    onConfirm: (data: ConfirmedData) => void
}

export default function AIConfirmationModal({
    isOpen,
    onClose,
    aiData,
    onConfirm
}: AIConfirmationModalProps) {
    const [isVisible, setIsVisible] = useState(false)
    const [isAnimating, setIsAnimating] = useState(false)

    useEffect(() => {
        if (isOpen) {
            setIsVisible(true)
            // Delay animation for smooth entrance
            setTimeout(() => setIsAnimating(true), 10)
        } else {
            setIsAnimating(false)
            // Wait for animation to complete before hiding
            const timer = setTimeout(() => setIsVisible(false), 300)
            return () => clearTimeout(timer)
        }
    }, [isOpen])

    const handleConfirm = (data: ConfirmedData) => {
        onConfirm(data)
        onClose()
    }

    if (!isVisible || !aiData) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${isAnimating ? 'opacity-100' : 'opacity-0'
                    }`}
                onClick={onClose}
            />

            {/* Modal Content */}
            <div
                className={`relative w-full max-w-2xl max-h-[90vh] overflow-auto transform transition-all duration-300 ${isAnimating
                        ? 'opacity-100 scale-100 translate-y-0'
                        : 'opacity-0 scale-95 translate-y-4'
                    }`}
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-10 p-2 bg-white/80 dark:bg-gray-800/80 rounded-full hover:bg-white dark:hover:bg-gray-700 transition-colors"
                >
                    <X className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                </button>

                <AISpecConfirmation
                    aiData={aiData}
                    onConfirm={handleConfirm}
                    onCancel={onClose}
                />
            </div>
        </div>
    )
}

// ===============================================
// HOOK FOR EASY USAGE
// ===============================================

export function useAIConfirmation() {
    const [isOpen, setIsOpen] = useState(false)
    const [aiData, setAIData] = useState<AIGeneratedData | null>(null)
    const [resolvePromise, setResolvePromise] = useState<((data: ConfirmedData | null) => void) | null>(null)

    const openConfirmation = (data: AIGeneratedData): Promise<ConfirmedData | null> => {
        return new Promise((resolve) => {
            setAIData(data)
            setIsOpen(true)
            setResolvePromise(() => resolve)
        })
    }

    const handleConfirm = (data: ConfirmedData) => {
        if (resolvePromise) {
            resolvePromise(data)
            setResolvePromise(null)
        }
        setIsOpen(false)
    }

    const handleClose = () => {
        if (resolvePromise) {
            resolvePromise(null)
            setResolvePromise(null)
        }
        setIsOpen(false)
    }

    const ConfirmationModal = () => (
        <AIConfirmationModal
            isOpen={isOpen}
            onClose={handleClose}
            aiData={aiData}
            onConfirm={handleConfirm}
        />
    )

    return {
        openConfirmation,
        ConfirmationModal
    }
}
