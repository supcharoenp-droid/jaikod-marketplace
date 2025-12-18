'use client'

import React from 'react'
import { ShieldCheck, ShieldAlert, AlertTriangle, Check } from 'lucide-react'
import { AIComplianceCheck } from '@/services/aiSmartListing'
import { ListingData } from '../AISmartListingFlow'

interface Step7ComplianceProps {
    complianceCheck?: AIComplianceCheck
    listingData: ListingData
    language: 'th' | 'en'
}

export default function Step7Compliance({ complianceCheck, language }: Step7ComplianceProps) {
    const content = {
        th: {
            title: 'ตรวจสอบความถูกต้อง',
            subtitle: 'AI ตรวจสอบประกาศของคุณเพื่อความปลอดภัย',
            checking: 'กำลังตรวจสอบ...',
            passed: 'ผ่านการตรวจสอบ',
            issues: 'พบประเด็นที่ต้องแก้ไข',
            suggestions: 'คำเเนะนำ'
        },
        en: {
            title: 'Safety & Compliance Check',
            subtitle: 'AI is verifying your listing for safety',
            checking: 'Checking...',
            passed: 'Verification Passed',
            issues: 'Issues Found',
            suggestions: 'Suggestions'
        }
    }

    const t = content[language]

    const getSeverityColor = (severity: string) => {
        switch (severity) {
            case 'critical': return 'text-red-600'
            case 'high': return 'text-orange-600'
            case 'medium': return 'text-yellow-600'
            default: return 'text-blue-600'
        }
    }

    return (
        <div className="space-y-6">
            <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                    <ShieldCheck className="w-8 h-8 text-red-600" />
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t.title}</h2>
                </div>
                <p className="text-gray-600 dark:text-gray-400">{t.subtitle}</p>
            </div>

            {complianceCheck ? (
                <div className="space-y-4">
                    {complianceCheck.passed ? (
                        <div className="bg-green-50 dark:bg-green-900/20 border-2 border-green-300 rounded-2xl p-6 text-center">
                            <Check className="w-16 h-16 text-green-600 mx-auto mb-4" />
                            <h3 className="text-xl font-bold text-green-900 dark:text-green-100 mb-2">
                                {t.passed}
                            </h3>
                            <p className="text-green-700 dark:text-green-300">
                                {language === 'th' ? 'ประกาศของคุณปลอดภัยและพร้อมเผยแพร่' : 'Your listing is safe and ready to publish'}
                            </p>
                        </div>
                    ) : (
                        <div className="bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-300 rounded-2xl p-6">
                            <div className="flex items-center gap-2 mb-4">
                                <AlertTriangle className="w-6 h-6 text-yellow-600" />
                                <h3 className="font-bold text-yellow-900 dark:text-yellow-100">{t.issues}</h3>
                            </div>

                            <div className="space-y-3">
                                {complianceCheck.issues.map((issue, idx) => (
                                    <div key={idx} className="bg-white dark:bg-gray-800 rounded-xl p-4">
                                        <p className={`font-medium ${getSeverityColor(issue.severity)} mb-2`}>
                                            {issue.message[language]}
                                        </p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            💡 {issue.suggestion[language]}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {complianceCheck.suggestions[language].length > 0 && (
                        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 rounded-xl p-4">
                            <h4 className="font-bold text-blue-900 dark:text-blue-100 mb-3">{t.suggestions}:</h4>
                            <ul className="space-y-2">
                                {complianceCheck.suggestions[language].map((sug, idx) => (
                                    <li key={idx} className="text-sm text-blue-800 dark:text-blue-200">{sug}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            ) : (
                <div className="text-center py-12">
                    <ShieldAlert className="w-12 h-12 text-gray-400 animate-pulse mx-auto mb-4" />
                    <p className="text-gray-600">{t.checking}</p>
                </div>
            )}
        </div>
    )
}
