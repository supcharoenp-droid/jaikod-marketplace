/**
 * Admin Context - Global State for Admin System
 */
'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { AdminUser, AdminRole } from '@/types/admin'
import { useAuth } from './AuthContext'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'

interface AdminContextType {
    adminUser: AdminUser | null
    loading: boolean
    isAdmin: boolean
    refreshAdminData: () => Promise<void>
}

const AdminContext = createContext<AdminContextType>({
    adminUser: null,
    loading: true,
    isAdmin: false,
    refreshAdminData: async () => { }
})

export const useAdmin = () => useContext(AdminContext)

export function AdminProvider({ children }: { children: ReactNode }) {
    const { user, loading: authLoading } = useAuth()
    const [adminUser, setAdminUser] = useState<AdminUser | null>(null)
    const [loading, setLoading] = useState(true)

    const fetchAdminData = async () => {
        // Wait for auth to initialize
        if (authLoading) return

        if (!user) {
            setAdminUser(null)
            setLoading(false)
            return
        }

        try {
            // Check if user is admin in Firestore
            const adminDoc = await getDoc(doc(db, 'admins', user.uid))

            if (adminDoc.exists()) {
                const data = adminDoc.data()
                setAdminUser({
                    id: adminDoc.id,
                    email: data.email || user.email || '',
                    displayName: data.displayName || user.displayName || 'Admin',
                    role: data.role || 'customer_support',
                    permissions: data.permissions || [],
                    department: data.department,
                    avatar_url: data.avatar_url || user.photoURL || undefined,
                    is_active: data.is_active !== false,
                    last_login: data.last_login?.toDate(),
                    created_at: data.created_at?.toDate() || new Date(),
                    created_by: data.created_by
                })
            } else {
                // [TEMPORARY DEV BACKDOOR] Start
                // Treat any logged-in user as Super Admin for testing
                setAdminUser({
                    id: user.uid,
                    email: user.email || '',
                    displayName: user.displayName || 'Admin Dev',
                    role: 'super_admin',
                    permissions: [], // super_admin performs all
                    is_active: true,
                    created_at: new Date()
                })
                // setAdminUser(null) // Original Logic
                // [TEMPORARY DEV BACKDOOR] End
            }
        } catch (error) {
            console.error('Error fetching admin data:', error)
            setAdminUser(null)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchAdminData()
    }, [user, authLoading])

    const value = {
        adminUser,
        loading,
        isAdmin: !!adminUser && adminUser.is_active,
        refreshAdminData: fetchAdminData
    }

    return (
        <AdminContext.Provider value={value}>
            {children}
        </AdminContext.Provider>
    )
}
