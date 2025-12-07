/**
 * Temporary Test Admin Page (Bypass Auth)
 * For UI Testing Only - Remove in Production
 */
'use client'

import { useState } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import { AdminProvider } from '@/contexts/AdminContext'

// Mock Admin User for Testing
const mockAdminUser = {
    id: 'test-admin-123',
    email: 'test@admin.com',
    displayName: 'Test Admin',
    role: 'super_admin' as const,
    permissions: [],
    is_active: true,
    created_at: new Date(),
}

export default function TestAdminPage() {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Bypass AdminProvider for testing */}
            <div className="p-8">
                <div className="max-w-7xl mx-auto">
                    <div className="bg-yellow-50 border-2 border-yellow-400 rounded-lg p-6 mb-6">
                        <h2 className="text-xl font-bold text-yellow-800 mb-2">
                            ⚠️ Test Mode - Admin UI Preview
                        </h2>
                        <p className="text-yellow-700">
                            This is a UI preview page. To access the real admin panel:
                        </p>
                        <ol className="list-decimal list-inside text-yellow-700 mt-2 space-y-1">
                            <li>Create an admin user in Firebase Authentication</li>
                            <li>Add admin document in Firestore (admins collection)</li>
                            <li>Login and navigate to /admin</li>
                        </ol>
                    </div>

                    {/* Navigation Links */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                        <a
                            href="/test-admin/dashboard"
                            className="block p-6 bg-white rounded-xl border-2 border-purple-200 hover:border-purple-500 transition-colors"
                        >
                            <h3 className="text-lg font-bold text-gray-900 mb-2">📊 Dashboard</h3>
                            <p className="text-sm text-gray-600">View statistics and overview</p>
                        </a>

                        <a
                            href="/test-admin/users"
                            className="block p-6 bg-white rounded-xl border-2 border-blue-200 hover:border-blue-500 transition-colors"
                        >
                            <h3 className="text-lg font-bold text-gray-900 mb-2">👥 Users</h3>
                            <p className="text-sm text-gray-600">Manage users and permissions</p>
                        </a>

                        <a
                            href="/test-admin/sellers"
                            className="block p-6 bg-white rounded-xl border-2 border-green-200 hover:border-green-500 transition-colors"
                        >
                            <h3 className="text-lg font-bold text-gray-900 mb-2">🏪 Sellers</h3>
                            <p className="text-sm text-gray-600">KYC approval and management</p>
                        </a>

                        <a
                            href="/test-admin/products"
                            className="block p-6 bg-white rounded-xl border-2 border-orange-200 hover:border-orange-500 transition-colors"
                        >
                            <h3 className="text-lg font-bold text-gray-900 mb-2">📦 Products</h3>
                            <p className="text-sm text-gray-600">Moderate and manage products</p>
                        </a>

                        <a
                            href="/test-admin/finance"
                            className="block p-6 bg-white rounded-xl border-2 border-amber-200 hover:border-amber-500 transition-colors"
                        >
                            <h3 className="text-lg font-bold text-gray-900 mb-2">💰 Finance</h3>
                            <p className="text-sm text-gray-600">Withdrawals and revenue</p>
                        </a>

                        <a
                            href="/test-admin/config"
                            className="block p-6 bg-white rounded-xl border-2 border-gray-200 hover:border-gray-500 transition-colors"
                        >
                            <h3 className="text-lg font-bold text-gray-900 mb-2">⚙️ System Config</h3>
                            <p className="text-sm text-gray-600">Module toggles and settings</p>
                        </a>
                    </div>

                    {/* Instructions */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                        <h3 className="text-lg font-bold text-blue-900 mb-3">
                            📚 How to Create Real Admin User
                        </h3>
                        <div className="space-y-2 text-blue-800">
                            <p><strong>Step 1:</strong> Firebase Console → Authentication → Add User</p>
                            <p><strong>Step 2:</strong> Firestore → Create collection "admins"</p>
                            <p><strong>Step 3:</strong> Add document with fields:</p>
                            <pre className="bg-blue-100 p-3 rounded mt-2 text-sm overflow-x-auto">
                                {`{
  email: "admin@jaikod.com",
  displayName: "Admin Name",
  role: "super_admin",
  permissions: [],
  is_active: true,
  created_at: [timestamp]
}`}
                            </pre>
                            <p className="mt-3"><strong>Step 4:</strong> Login and go to /admin</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
