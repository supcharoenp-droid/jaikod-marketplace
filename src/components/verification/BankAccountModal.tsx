'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    X, Building2, Wallet, CheckCircle, AlertCircle,
    Loader2, Shield, Sparkles, Plus, Trash2, Check,
    CreditCard, Banknote, QrCode
} from 'lucide-react'
import Image from 'next/image'
import { useLanguage } from '@/contexts/LanguageContext'

// ==========================================
// TYPES
// ==========================================

interface BankAccountModalProps {
    isOpen: boolean
    onClose: () => void
    onSuccess: (account: BankAccount) => void
}

interface BankAccount {
    id: string
    bank_code: string
    bank_name: string
    account_number: string
    account_name: string
    is_primary: boolean
    verified: boolean
}

type Step = 'select_bank' | 'enter_details' | 'verify' | 'success'

// ==========================================
// DEMO MODE CONFIG
// ==========================================

const DEMO_MODE = true

// ==========================================
// BANK DATA
// ==========================================

const THAI_BANKS = [
    { code: 'kbank', name: 'ธนาคารกสิกรไทย', name_en: 'Kasikorn Bank', color: '#138F2D', logo: '/banks/kbank.png' },
    { code: 'scb', name: 'ธนาคารไทยพาณิชย์', name_en: 'SCB', color: '#4E2B8E', logo: '/banks/scb.png' },
    { code: 'bbl', name: 'ธนาคารกรุงเทพ', name_en: 'Bangkok Bank', color: '#1E4598', logo: '/banks/bbl.png' },
    { code: 'ktb', name: 'ธนาคารกรุงไทย', name_en: 'Krungthai Bank', color: '#00A4E4', logo: '/banks/ktb.png' },
    { code: 'bay', name: 'ธนาคารกรุงศรีอยุธยา', name_en: 'Bank of Ayudhya', color: '#FEC800', logo: '/banks/bay.png' },
    { code: 'tmb', name: 'ทีทีบี (ttb)', name_en: 'TTB', color: '#FC4C02', logo: '/banks/ttb.png' },
    { code: 'gsb', name: 'ธนาคารออมสิน', name_en: 'GSB', color: '#EB198D', logo: '/banks/gsb.png' },
    { code: 'promptpay', name: 'พร้อมเพย์ (PromptPay)', name_en: 'PromptPay', color: '#003DA5', logo: '/banks/promptpay.png' },
]

// ==========================================
// COMPONENT
// ==========================================

export default function BankAccountModal({
    isOpen,
    onClose,
    onSuccess
}: BankAccountModalProps) {
    const { language } = useLanguage()

    // State
    const [step, setStep] = useState<Step>('select_bank')
    const [selectedBank, setSelectedBank] = useState<typeof THAI_BANKS[0] | null>(null)
    const [accountNumber, setAccountNumber] = useState('')
    const [accountName, setAccountName] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [verificationAmount, setVerificationAmount] = useState('0.00')
    const [enteredAmount, setEnteredAmount] = useState('')

    // Copy
    const t = {
        th: {
            title: 'เพิ่มบัญชีรับเงิน',
            subtitle: 'เพื่อรับเงินจากการขายสินค้า',
            selectBank: 'เลือกธนาคาร',
            selectBankDesc: 'เลือกธนาคารที่ต้องการรับเงิน',
            accountNumber: 'เลขบัญชี',
            accountNumberPlaceholder: 'XXX-X-XXXXX-X',
            accountName: 'ชื่อบัญชี',
            accountNamePlaceholder: 'ชื่อ-นามสกุล ตามบัญชี',
            accountNameHint: 'ชื่อบัญชีต้องตรงกับชื่อในบัตรประชาชน',
            verifyTitle: 'ยืนยันบัญชี',
            verifyDesc: 'เราได้โอนเงินทดสอบไปยังบัญชีของคุณ กรุณากรอกจำนวนเงินที่ได้รับ',
            amountSent: 'จำนวนเงินที่โอน',
            enterAmount: 'กรอกจำนวนเงินที่ได้รับ',
            amountPlaceholder: '0.XX',
            next: 'ถัดไป',
            back: 'ย้อนกลับ',
            verify: 'ยืนยัน',
            success: 'เพิ่มบัญชีสำเร็จ!',
            successDesc: 'บัญชีของคุณพร้อมรับเงินแล้ว',
            trustGain: 'Trust Score เพิ่มขึ้น',
            continue: 'ดำเนินการต่อ',
            demoNote: '🧪 Demo Mode: กรอก 0.25 เพื่อยืนยัน',
            invalidAccount: 'กรุณากรอกเลขบัญชีให้ถูกต้อง',
            invalidName: 'กรุณากรอกชื่อบัญชี',
            invalidAmount: 'จำนวนเงินไม่ถูกต้อง',
            benefits: [
                '✓ รับเงินจากการขายสินค้า',
                '✓ ถอนเงินได้ทันที',
                '✓ ปลอดภัย 100%'
            ],
            or: 'หรือ',
            promptPayOption: 'เพิ่มพร้อมเพย์แทน'
        },
        en: {
            title: 'Add Bank Account',
            subtitle: 'To receive payment from sales',
            selectBank: 'Select Bank',
            selectBankDesc: 'Choose your bank for receiving payments',
            accountNumber: 'Account Number',
            accountNumberPlaceholder: 'XXX-X-XXXXX-X',
            accountName: 'Account Name',
            accountNamePlaceholder: 'Name as shown on account',
            accountNameHint: 'Name must match your ID card',
            verifyTitle: 'Verify Account',
            verifyDesc: 'We have sent a small amount to your account. Please enter the amount received.',
            amountSent: 'Amount Sent',
            enterAmount: 'Enter amount received',
            amountPlaceholder: '0.XX',
            next: 'Next',
            back: 'Back',
            verify: 'Verify',
            success: 'Account Added!',
            successDesc: 'Your account is ready to receive payments',
            trustGain: 'Trust Score increased by',
            continue: 'Continue',
            demoNote: '🧪 Demo Mode: Enter 0.25 to verify',
            invalidAccount: 'Please enter a valid account number',
            invalidName: 'Please enter account name',
            invalidAmount: 'Invalid amount',
            benefits: [
                '✓ Receive payment from sales',
                '✓ Instant withdrawal',
                '✓ 100% secure'
            ],
            or: 'or',
            promptPayOption: 'Add PromptPay instead'
        }
    }

    const copy = t[language as 'th' | 'en'] || t.th

    // Format account number
    const formatAccountNumber = (value: string) => {
        return value.replace(/\D/g, '').slice(0, 12)
    }

    // Handle bank selection
    const handleSelectBank = (bank: typeof THAI_BANKS[0]) => {
        setSelectedBank(bank)
        setError('')
    }

    // Go to details step
    const goToDetails = () => {
        if (!selectedBank) {
            setError(language === 'th' ? 'กรุณาเลือกธนาคาร' : 'Please select a bank')
            return
        }
        setStep('enter_details')
    }

    // Go to verification step
    const goToVerify = async () => {
        if (accountNumber.length < 10) {
            setError(copy.invalidAccount)
            return
        }
        if (!accountName.trim()) {
            setError(copy.invalidName)
            return
        }

        setLoading(true)
        setError('')

        try {
            if (DEMO_MODE) {
                // Demo: Simulate verification amount
                await new Promise(resolve => setTimeout(resolve, 1500))
                setVerificationAmount('0.25')
            } else {
                // TODO: Call API to send verification amount
                // const result = await sendVerificationAmount(selectedBank.code, accountNumber)
                // setVerificationAmount(result.amount)
            }

            setStep('verify')
        } catch (err) {
            setError('เกิดข้อผิดพลาด กรุณาลองใหม่')
        } finally {
            setLoading(false)
        }
    }

    // Verify amount
    const handleVerify = async () => {
        if (!enteredAmount) {
            setError(copy.invalidAmount)
            return
        }

        setLoading(true)
        setError('')

        try {
            if (DEMO_MODE) {
                await new Promise(resolve => setTimeout(resolve, 1000))

                if (enteredAmount !== verificationAmount) {
                    setError(copy.invalidAmount)
                    setLoading(false)
                    return
                }
            } else {
                // TODO: Call API to verify amount
                // await verifyBankAccount(selectedBank.code, accountNumber, enteredAmount)
            }

            setStep('success')

            // Create account object and call success
            const account: BankAccount = {
                id: Date.now().toString(),
                bank_code: selectedBank!.code,
                bank_name: selectedBank!.name,
                account_number: accountNumber,
                account_name: accountName,
                is_primary: true,
                verified: true
            }

            setTimeout(() => {
                onSuccess(account)
            }, 2000)

        } catch (err) {
            setError(copy.invalidAmount)
        } finally {
            setLoading(false)
        }
    }

    // Reset and close
    const handleClose = () => {
        setStep('select_bank')
        setSelectedBank(null)
        setAccountNumber('')
        setAccountName('')
        setError('')
        setEnteredAmount('')
        onClose()
    }

    if (!isOpen) return null

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
                onClick={handleClose}
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    className="w-full max-w-md bg-white dark:bg-slate-800 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
                    onClick={e => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="relative bg-gradient-to-r from-green-500 to-emerald-500 p-6 text-white">
                        <button
                            onClick={handleClose}
                            className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                                <Wallet className="w-6 h-6" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold">{copy.title}</h2>
                                <p className="text-white/80 text-sm">{copy.subtitle}</p>
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                        <AnimatePresence mode="wait">
                            {/* Step: Select Bank */}
                            {step === 'select_bank' && (
                                <motion.div
                                    key="select_bank"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-6"
                                >
                                    {/* Benefits */}
                                    <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Shield className="w-5 h-5 text-green-500" />
                                            <span className="font-medium text-green-700 dark:text-green-300">
                                                {language === 'th' ? 'สิทธิประโยชน์' : 'Benefits'}
                                            </span>
                                        </div>
                                        <ul className="space-y-1 text-sm text-green-600 dark:text-green-400">
                                            {copy.benefits.map((b, i) => (
                                                <li key={i}>{b}</li>
                                            ))}
                                        </ul>
                                    </div>

                                    {/* Bank Selection */}
                                    <div>
                                        <h3 className="font-bold text-gray-900 dark:text-white mb-3">
                                            {copy.selectBank}
                                        </h3>
                                        <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
                                            {copy.selectBankDesc}
                                        </p>

                                        <div className="grid grid-cols-2 gap-3">
                                            {THAI_BANKS.map(bank => (
                                                <button
                                                    key={bank.code}
                                                    onClick={() => handleSelectBank(bank)}
                                                    className={`p-4 rounded-xl border-2 transition-all text-left ${selectedBank?.code === bank.code
                                                            ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                                                            : 'border-gray-200 dark:border-gray-700 hover:border-green-300'
                                                        }`}
                                                >
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <div
                                                            className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold"
                                                            style={{ backgroundColor: bank.color }}
                                                        >
                                                            {bank.code === 'promptpay' ? (
                                                                <QrCode className="w-4 h-4" />
                                                            ) : (
                                                                <Building2 className="w-4 h-4" />
                                                            )}
                                                        </div>
                                                        {selectedBank?.code === bank.code && (
                                                            <Check className="w-4 h-4 text-green-500 ml-auto" />
                                                        )}
                                                    </div>
                                                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                                        {language === 'th' ? bank.name : bank.name_en}
                                                    </p>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Error */}
                                    {error && (
                                        <div className="flex items-center gap-2 text-red-500 text-sm">
                                            <AlertCircle className="w-4 h-4" />
                                            {error}
                                        </div>
                                    )}

                                    {/* Next Button */}
                                    <button
                                        onClick={goToDetails}
                                        disabled={!selectedBank}
                                        className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-bold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                        {copy.next}
                                    </button>
                                </motion.div>
                            )}

                            {/* Step: Enter Details */}
                            {step === 'enter_details' && (
                                <motion.div
                                    key="enter_details"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-6"
                                >
                                    {/* Selected Bank */}
                                    <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-slate-700/50 rounded-xl">
                                        <div
                                            className="w-10 h-10 rounded-lg flex items-center justify-center text-white"
                                            style={{ backgroundColor: selectedBank?.color }}
                                        >
                                            {selectedBank?.code === 'promptpay' ? (
                                                <QrCode className="w-5 h-5" />
                                            ) : (
                                                <Building2 className="w-5 h-5" />
                                            )}
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900 dark:text-white">
                                                {language === 'th' ? selectedBank?.name : selectedBank?.name_en}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Account Number */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            {copy.accountNumber}
                                        </label>
                                        <input
                                            type="text"
                                            value={accountNumber}
                                            onChange={e => setAccountNumber(formatAccountNumber(e.target.value))}
                                            placeholder={copy.accountNumberPlaceholder}
                                            className="w-full px-4 py-3 bg-gray-100 dark:bg-slate-700 rounded-xl text-lg font-mono focus:outline-none focus:ring-2 focus:ring-green-500"
                                        />
                                    </div>

                                    {/* Account Name */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            {copy.accountName}
                                        </label>
                                        <input
                                            type="text"
                                            value={accountName}
                                            onChange={e => setAccountName(e.target.value)}
                                            placeholder={copy.accountNamePlaceholder}
                                            className="w-full px-4 py-3 bg-gray-100 dark:bg-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                                        />
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                            {copy.accountNameHint}
                                        </p>
                                    </div>

                                    {/* Demo Note */}
                                    {DEMO_MODE && (
                                        <div className="text-center text-sm text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 px-3 py-2 rounded-lg">
                                            {copy.demoNote}
                                        </div>
                                    )}

                                    {/* Error */}
                                    {error && (
                                        <div className="flex items-center gap-2 text-red-500 text-sm">
                                            <AlertCircle className="w-4 h-4" />
                                            {error}
                                        </div>
                                    )}

                                    {/* Navigation */}
                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => setStep('select_bank')}
                                            className="flex-1 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
                                        >
                                            {copy.back}
                                        </button>
                                        <button
                                            onClick={goToVerify}
                                            disabled={loading}
                                            className="flex-1 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-bold hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
                                        >
                                            {loading ? (
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                            ) : (
                                                copy.next
                                            )}
                                        </button>
                                    </div>
                                </motion.div>
                            )}

                            {/* Step: Verify */}
                            {step === 'verify' && (
                                <motion.div
                                    key="verify"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-6"
                                >
                                    <div className="text-center">
                                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                                            {copy.verifyTitle}
                                        </h3>
                                        <p className="text-gray-500 dark:text-gray-400 text-sm">
                                            {copy.verifyDesc}
                                        </p>
                                    </div>

                                    {/* Amount Display */}
                                    <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-6 text-center">
                                        <p className="text-sm text-green-600 dark:text-green-400 mb-1">
                                            {copy.amountSent}
                                        </p>
                                        <p className="text-3xl font-bold text-green-700 dark:text-green-300">
                                            ฿{verificationAmount}
                                        </p>
                                    </div>

                                    {/* Enter Amount */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            {copy.enterAmount}
                                        </label>
                                        <input
                                            type="text"
                                            value={enteredAmount}
                                            onChange={e => setEnteredAmount(e.target.value.replace(/[^0-9.]/g, ''))}
                                            placeholder={copy.amountPlaceholder}
                                            className="w-full px-4 py-3 bg-gray-100 dark:bg-slate-700 rounded-xl text-2xl font-bold text-center focus:outline-none focus:ring-2 focus:ring-green-500"
                                        />
                                    </div>

                                    {/* Demo Note */}
                                    {DEMO_MODE && (
                                        <div className="text-center text-sm text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 px-3 py-2 rounded-lg">
                                            {copy.demoNote}
                                        </div>
                                    )}

                                    {/* Error */}
                                    {error && (
                                        <div className="flex items-center justify-center gap-2 text-red-500 text-sm">
                                            <AlertCircle className="w-4 h-4" />
                                            {error}
                                        </div>
                                    )}

                                    {/* Verify Button */}
                                    <button
                                        onClick={handleVerify}
                                        disabled={loading || !enteredAmount}
                                        className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-bold hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
                                    >
                                        {loading ? (
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                        ) : (
                                            <>
                                                <CheckCircle className="w-5 h-5" />
                                                {copy.verify}
                                            </>
                                        )}
                                    </button>
                                </motion.div>
                            )}

                            {/* Step: Success */}
                            {step === 'success' && (
                                <motion.div
                                    key="success"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    className="text-center py-8"
                                >
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ type: 'spring', delay: 0.2 }}
                                        className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-emerald-400 to-green-500 rounded-full flex items-center justify-center"
                                    >
                                        <CheckCircle className="w-10 h-10 text-white" />
                                    </motion.div>

                                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                        {copy.success}
                                    </h3>

                                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                                        {copy.successDesc}
                                    </p>

                                    {/* Account Info */}
                                    <div className="bg-gray-50 dark:bg-slate-700/50 rounded-xl p-4 mb-4 text-left">
                                        <div className="flex items-center gap-3">
                                            <div
                                                className="w-10 h-10 rounded-lg flex items-center justify-center text-white"
                                                style={{ backgroundColor: selectedBank?.color }}
                                            >
                                                <Building2 className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900 dark:text-white">
                                                    {accountName}
                                                </p>
                                                <p className="text-sm text-gray-500 dark:text-gray-400 font-mono">
                                                    •••• •••• {accountNumber.slice(-4)}
                                                </p>
                                            </div>
                                            <CheckCircle className="w-5 h-5 text-green-500 ml-auto" />
                                        </div>
                                    </div>

                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.4 }}
                                        className="flex items-center justify-center gap-2 text-emerald-600 dark:text-emerald-400 mb-6"
                                    >
                                        <Sparkles className="w-5 h-5" />
                                        <span className="font-medium">
                                            {copy.trustGain} +15
                                        </span>
                                    </motion.div>

                                    <button
                                        onClick={handleClose}
                                        className="px-8 py-3 bg-gradient-to-r from-emerald-500 to-green-500 text-white rounded-xl font-bold hover:opacity-90 transition-opacity"
                                    >
                                        {copy.continue}
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    )
}
