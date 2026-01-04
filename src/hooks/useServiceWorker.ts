'use client'

/**
 * SERVICE WORKER REGISTRATION HOOK
 * 
 * Handles:
 * - Service worker registration
 * - Update notifications
 * - Online/Offline status
 */

import { useState, useEffect, useCallback } from 'react'

interface ServiceWorkerState {
    isSupported: boolean
    isRegistered: boolean
    isOnline: boolean
    hasUpdate: boolean
    registration: ServiceWorkerRegistration | null
}

export function useServiceWorker() {
    const [state, setState] = useState<ServiceWorkerState>({
        isSupported: false,
        isRegistered: false,
        isOnline: true,
        hasUpdate: false,
        registration: null
    })

    // Register service worker
    useEffect(() => {
        if (typeof window === 'undefined') return

        // Check support
        const isSupported = 'serviceWorker' in navigator
        setState(prev => ({ ...prev, isSupported }))

        if (!isSupported) return

        // Set initial online status
        setState(prev => ({ ...prev, isOnline: navigator.onLine }))

        // Register SW
        const registerSW = async () => {
            /* 
            // Temporarily disabled to debug TypeError in hydration
            try {
                const registration = await navigator.serviceWorker.register('/sw.js', {
                    scope: '/'
                })

                console.log('[SW Hook] Service Worker registered:', registration.scope)

                setState(prev => ({
                    ...prev,
                    isRegistered: true,
                    registration
                }))

                // Check for updates
                registration.addEventListener('updatefound', () => {
                    const newWorker = registration.installing
                    if (newWorker) {
                        newWorker.addEventListener('statechange', () => {
                            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                                console.log('[SW Hook] Update available')
                                setState(prev => ({ ...prev, hasUpdate: true }))
                            }
                        })
                    }
                })

            } catch (error) {
                console.error('[SW Hook] Registration failed:', error)
            }
            */
            console.log('[SW Hook] Service Worker registration is temporarily disabled for debugging.')
        }

        registerSW()

        // Listen for online/offline events
        const handleOnline = () => {
            setState(prev => ({ ...prev, isOnline: true }))
        }

        const handleOffline = () => {
            setState(prev => ({ ...prev, isOnline: false }))
        }

        window.addEventListener('online', handleOnline)
        window.addEventListener('offline', handleOffline)

        return () => {
            window.removeEventListener('online', handleOnline)
            window.removeEventListener('offline', handleOffline)
        }
    }, [])

    // Skip waiting and reload
    const updateApp = useCallback(async () => {
        if (!state.registration?.waiting) return

        // Tell waiting SW to take over
        state.registration.waiting.postMessage({ type: 'SKIP_WAITING' })

        // Reload the page
        window.location.reload()
    }, [state.registration])

    // Request background sync
    const requestSync = useCallback(async (tag: string) => {
        if (!state.registration) return false

        try {
            // Background sync API may not be available in all browsers
            const reg = state.registration as any
            if (reg.sync) {
                await reg.sync.register(tag)
                console.log('[SW Hook] Sync registered:', tag)
                return true
            }
            console.log('[SW Hook] Background sync not supported')
            return false
        } catch (error) {
            console.error('[SW Hook] Sync failed:', error)
            return false
        }
    }, [state.registration])

    return {
        ...state,
        updateApp,
        requestSync
    }
}
