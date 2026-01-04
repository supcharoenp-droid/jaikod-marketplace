'use client'

/**
 * REPORT ORPHANED LISTING BUTTON
 * 
 * Allows users (especially admins) to report listings with data issues
 * Admin-only feature for data quality management
 */

import { useState } from 'react'
import { Flag, Loader2, CheckCircle } from 'lucide-react'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { db, auth } from '@/lib/firebase'

interface ReportOrphanedListingProps {
    listingId: string
    sellerId: string
    sellerName?: string
    listingTitle: string
    isAdminView?: boolean
}

export function ReportOrphanedListingButton({
    listingId,
    sellerId,
    sellerName = 'Unknown',
    listingTitle,
    isAdminView = false
}: ReportOrphanedListingProps) {
    const [isReporting, setIsReporting] = useState(false)
    const [reported, setReported] = useState(false)
    const [showModal, setShowModal] = useState(false)
    const [reason, setReason] = useState('')

    const handleReport = async () => {
        if (!auth.currentUser) {
            alert('กรุณาเข้าสู่ระบบเพื่อรายงานปัญหา')
            return
        }

        setIsReporting(true)

        try {
            // Create report in Firestore
            await addDoc(collection(db, 'data_quality_reports'), {
                type: 'orphaned_seller',
                listing_id: listingId,
                seller_id: sellerId,
                seller_name: sellerName,
                listing_title: listingTitle,
                reason: reason || 'Seller data incomplete or missing',
                reported_by: auth.currentUser.uid,
                reported_at: serverTimestamp(),
                status: 'pending',
                severity: 'medium'
            })

            console.log('[Report] Successfully reported orphaned listing:', listingId)
            setReported(true)
            setShowModal(false)

            // Auto-hide success message after 3s
            setTimeout(() => setReported(false), 3000)

        } catch (error) {
            console.error('[Report] Error reporting listing:', error)
            alert('เกิดข้อผิดพลาดในการรายงาน กรุณาลองใหม่อีกครั้ง')
        } finally {
            setIsReporting(false)
        }
    }

    if (reported) {
        return (
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-green-500/10 border border-green-500/30">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span className="text-sm text-green-300">รายงานแล้ว</span>
            </div>
        )
    }

    return (
        <>
            <button
                onClick={() => setShowModal(true)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors ${isAdminView
                        ? 'bg-red-500/10 border-red-500/30 hover:bg-red-500/20 text-red-300'
                        : 'bg-gray-500/10 border-gray-500/30 hover:bg-gray-500/20 text-gray-300'
                    }`}
                title="รายงานข้อมูลไม่ครบถ้วน"
            >
                <Flag className="w-4 h-4" />
                <span className="text-sm">รายงานปัญหา</span>
            </button>

            {/* Report Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-slate-800 rounded-2xl p-6 max-w-md w-full border border-slate-700">
                        <div className="flex items-start gap-3 mb-4">
                            <Flag className="w-6 h-6 text-red-400 flex-shrink-0 mt-0.5" />
                            <div>
                                <h3 className="text-lg font-bold text-white mb-1">
                                    รายงานข้อมูลไม่ครบถ้วน
                                </h3>
                                <p className="text-sm text-gray-400">
                                    รายการนี้มีข้อมูลผู้ขายที่ไม่สมบูรณ์หรือไม่มีในระบบ
                                </p>
                            </div>
                        </div>

                        <div className="space-y-3 mb-4 text-sm">
                            <div className="bg-slate-900/50 rounded-lg p-3">
                                <div className="text-gray-400">รายการ:</div>
                                <div className="text-white font-medium">{listingTitle}</div>
                            </div>
                            <div className="bg-slate-900/50 rounded-lg p-3">
                                <div className="text-gray-400">Seller ID:</div>
                                <div className="text-white font-mono text-xs">{sellerId}</div>
                            </div>
                            <div className="bg-slate-900/50 rounded-lg p-3">
                                <div className="text-gray-400">ชื่อผู้ขาย:</div>
                                <div className="text-white">{sellerName}</div>
                            </div>
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm text-gray-400 mb-2">
                                เหตุผลเพิ่มเติม (ไม่บังคับ):
                            </label>
                            <textarea
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                                className="w-full px-3 py-2 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500"
                                placeholder="เช่น: ข้อมูลผู้ขายไม่ถูกต้อง, ไม่สามารถติดต่อได้, etc."
                                rows={3}
                            />
                        </div>

                        <div className="flex items-center gap-3">
                            <button
                                onClick={handleReport}
                                disabled={isReporting}
                                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-red-500 hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-white font-medium transition-colors"
                            >
                                {isReporting ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        กำลังรายงาน...
                                    </>
                                ) : (
                                    <>
                                        <Flag className="w-4 h-4" />
                                        รายงาน
                                    </>
                                )}
                            </button>
                            <button
                                onClick={() => setShowModal(false)}
                                disabled={isReporting}
                                className="px-4 py-2.5 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 rounded-lg text-white transition-colors"
                            >
                                ยกเลิก
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
