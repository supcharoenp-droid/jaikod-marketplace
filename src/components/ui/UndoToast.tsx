'use client'

import toast from 'react-hot-toast'

/**
 * Custom Toast with Undo Button
 * แสดง Toast พร้อมปุ่ม Undo สวยงาม
 */

interface UndoToastProps {
    message: string
    onUndo: () => void
    undoLabel?: string
    toastId: string
}

export function UndoToast({ message, onUndo, undoLabel = 'ย้อนกลับ', toastId }: UndoToastProps) {
    const handleUndo = () => {
        onUndo()
        toast.dismiss(toastId)
        toast.success('กู้คืนสำเร็จ', { icon: '↩️', duration: 2000 })
    }

    return (
        <div className="flex items-center justify-between gap-4 min-w-[280px]">
            <div className="flex items-center gap-2">
                <span className="text-lg">🗑️</span>
                <span className="font-medium text-gray-800">{message}</span>
            </div>
            <button
                onClick={handleUndo}
                className="px-4 py-1.5 bg-white border-2 border-green-500 text-green-700 text-sm font-bold rounded-lg hover:bg-green-50 active:scale-95 transition-all whitespace-nowrap shadow-sm"
            >
                {undoLabel}
            </button>
        </div>
    )
}

/**
 * Show success toast with undo button
 */
export function showUndoToast(
    message: string,
    onUndo: () => void,
    options?: {
        undoLabel?: string
        duration?: number
    }
) {
    const { undoLabel = 'ย้อนกลับ', duration = 5000 } = options || {}

    return toast.custom(
        (t) => (
            <div
                className={`${t.visible ? 'animate-enter' : 'animate-leave'
                    } max-w-md w-full bg-white shadow-lg rounded-xl pointer-events-auto border border-gray-200`}
            >
                <UndoToast
                    message={message}
                    onUndo={onUndo}
                    undoLabel={undoLabel}
                    toastId={t.id}
                />
            </div>
        ),
        {
            duration,
            position: 'top-right',
        }
    )
}
