import toast from 'react-hot-toast'

/**
 * Toast Notification Service
 * Wrapper around react-hot-toast with custom styling and features
 */

interface ToastOptions {
    duration?: number
    icon?: string
    action?: {
        label: string
        onClick: () => void
    }
}

/**
 * Toast Service
 */
export const toastService = {
    /**
     * แสดง Success Toast
     */
    success: (message: string, options?: ToastOptions) => {
        const { duration = 3000, icon = '✅' } = options || {}
        return toast.success(message, { duration, icon })
    },

    /**
     * แสดง Error Toast
     */
    error: (message: string, options?: ToastOptions) => {
        const { duration = 5000, icon = '❌' } = options || {}
        return toast.error(message, { duration, icon })
    },

    /**
     * แสดง Info Toast
     */
    info: (message: string, options?: ToastOptions) => {
        const { duration = 4000, icon = 'ℹ️' } = options || {}
        return toast(message, { duration, icon })
    },

    /**
     * แสดง Warning Toast
     */
    warning: (message: string, options?: ToastOptions) => {
        const { duration = 4000, icon = '⚠️' } = options || {}
        return toast(message, {
            duration,
            icon,
            style: {
                background: '#fef3c7',
                color: '#92400e',
            },
        })
    },

    /**
     * แสดง Loading Toast
     */
    loading: (message: string = 'กำลังโหลด...') => {
        return toast.loading(message)
    },

    /**
     * แสดง Promise Toast (Auto success/error)
     */
    promise: <T,>(
        promise: Promise<T>,
        messages: {
            loading: string
            success: string | ((data: T) => string)
            error: string | ((error: any) => string)
        }
    ) => {
        return toast.promise(promise, messages)
    },

    /**
     * Dismiss Toast
     */
    dismiss: (toastId?: string) => {
        toast.dismiss(toastId)
    },

    /**
     * Dismiss All Toasts
     */
    dismissAll: () => {
        toast.dismiss()
    },

    /**
     * Custom Toast with Undo (สำหรับ Delete)
     * แสดง Toast พร้อมปุ่ม Undo ที่คลิกได้
     * ใช้ dynamic import เพื่อหลีกเลี่ยง SSR issues
     */
    successWithUndo: async (
        message: string,
        onUndo: () => void,
        options?: { undoLabel?: string; duration?: number }
    ) => {
        // Dynamic import to avoid SSR issues
        const { showUndoToast } = await import('@/components/ui/UndoToast')
        return showUndoToast(message, onUndo, options)
    },
}

// Export individual functions
export const {
    success: toastSuccess,
    error: toastError,
    info: toastInfo,
    warning: toastWarning,
    loading: toastLoading,
    promise: toastPromise,
    dismiss: toastDismiss,
    successWithUndo: toastSuccessWithUndo,
} = toastService

export default toastService
