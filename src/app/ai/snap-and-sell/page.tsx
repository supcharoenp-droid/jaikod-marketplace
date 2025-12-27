'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { useLanguage } from '@/contexts/LanguageContext'
import {
    Camera, Upload, Sparkles, Zap, Clock, Check, ArrowRight,
    Image as ImageIcon, Edit3, DollarSign, Tag, FileText, Wand2
} from 'lucide-react'
import Button from '@/components/ui/Button'

const translations = {
    th: {
        title: 'Snap & Sell',
        subtitle: 'ถ่ายรูปแล้วลงขายทันที AI ช่วยกรอกข้อมูลให้อัตโนมัติ',
        takePhoto: 'ถ่ายรูป',
        uploadPhoto: 'อัปโหลดรูป',
        orDragDrop: 'หรือ ลากไฟล์มาวาง',
        analyzing: 'AI กำลังวิเคราะห์รูปภาพ...',
        aiDetected: 'AI ตรวจพบ',
        suggestedTitle: 'หัวข้อแนะนำ',
        suggestedCategory: 'หมวดหมู่',
        suggestedPrice: 'ราคาแนะนำ',
        suggestedDesc: 'รายละเอียด',
        editAndPublish: 'แก้ไขและลงขาย',
        publishNow: 'ลงขายเลย',
        howItWorks: 'Snap & Sell ทำงานอย่างไร',
        step1Title: 'ถ่ายรูปสินค้า',
        step1Desc: 'ถ่ายรูปสินค้าที่ต้องการขาย',
        step2Title: 'AI วิเคราะห์',
        step2Desc: 'AI ตรวจจับสินค้าและรายละเอียด',
        step3Title: 'กรอกข้อมูลอัตโนมัติ',
        step3Desc: 'ระบบเติมข้อมูลให้คุณโดยอัตโนมัติ',
        step4Title: 'ยืนยันและลงขาย',
        step4Desc: 'ตรวจสอบและกดลงขายได้ทันที',
        benefits: 'ข้อดีของ Snap & Sell',
        benefit1: 'ลงขายได้ใน 30 วินาที',
        benefit2: 'AI ตั้งราคาให้อัตโนมัติ',
        benefit3: 'ไม่ต้องพิมพ์รายละเอียดเอง',
        benefit4: 'รองรับหลายหมวดหมู่',
        startSelling: 'เริ่มขายเลย',
        aiPowered: 'ขับเคลื่อนด้วย AI',
    },
    en: {
        title: 'Snap & Sell',
        subtitle: 'Take a photo and list instantly. AI fills in details automatically.',
        takePhoto: 'Take Photo',
        uploadPhoto: 'Upload Photo',
        orDragDrop: 'or drag and drop',
        analyzing: 'AI is analyzing the image...',
        aiDetected: 'AI Detected',
        suggestedTitle: 'Suggested Title',
        suggestedCategory: 'Category',
        suggestedPrice: 'Suggested Price',
        suggestedDesc: 'Description',
        editAndPublish: 'Edit & Publish',
        publishNow: 'Publish Now',
        howItWorks: 'How Snap & Sell Works',
        step1Title: 'Take a Photo',
        step1Desc: 'Photograph the item you want to sell',
        step2Title: 'AI Analyzes',
        step2Desc: 'AI detects product and details',
        step3Title: 'Auto-fill Info',
        step3Desc: 'System fills in data automatically',
        step4Title: 'Confirm & List',
        step4Desc: 'Review and publish instantly',
        benefits: 'Benefits of Snap & Sell',
        benefit1: 'List in 30 seconds',
        benefit2: 'AI auto-pricing',
        benefit3: 'No manual typing needed',
        benefit4: 'Multiple categories supported',
        startSelling: 'Start Selling',
        aiPowered: 'AI-Powered',
    }
}

export default function SnapAndSellPage() {
    const { language } = useLanguage()
    const t = translations[language as 'th' | 'en'] || translations.th

    const [selectedImage, setSelectedImage] = useState<string | null>(null)
    const [isAnalyzing, setIsAnalyzing] = useState(false)
    const [result, setResult] = useState<any>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onload = (e) => {
                const base64 = e.target?.result as string
                setSelectedImage(base64)
                analyzeImage(base64)
            }
            reader.readAsDataURL(file)
        }
    }

    const analyzeImage = async (imageBase64: string) => {
        setIsAnalyzing(true)
        setResult(null)

        try {
            // Call the real OpenAI Vision API
            const response = await fetch('/api/ai/analyze-image', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    image: imageBase64,
                    language
                }),
            })

            if (!response.ok) {
                // API failed - show fallback message instead of throwing
                console.warn('AI Analysis API returned error:', response.status)
                setResult({
                    title: language === 'th' ? 'กรุณากรอกข้อมูลด้วยตนเอง' : 'Please fill in details manually',
                    category: language === 'th' ? 'ทั่วไป' : 'General',
                    price: 0,
                    description: language === 'th'
                        ? 'AI ไม่สามารถวิเคราะห์รูปภาพได้ในขณะนี้ กรุณากรอกข้อมูลสินค้าด้วยตนเอง'
                        : 'AI could not analyze this image. Please fill in product details manually.',
                    condition: language === 'th' ? 'ดี' : 'Good',
                    confidence: 0,
                })
                setIsAnalyzing(false)
                return
            }

            const data = await response.json()

            setResult({
                title: data.title || 'สินค้า',
                category: data.category || (language === 'th' ? 'ทั่วไป' : 'General'),
                price: data.price || 0,
                description: data.description || '',
                condition: data.condition || (language === 'th' ? 'ดี' : 'Good'),
                confidence: data.confidence || 85,
            })
        } catch (error) {
            console.error('AI Analysis error:', error)
            // Fallback to basic detection message
            setResult({
                title: language === 'th' ? 'ไม่สามารถวิเคราะห์ได้ กรุณาลองใหม่' : 'Unable to analyze. Please try again.',
                category: language === 'th' ? 'ทั่วไป' : 'General',
                price: 0,
                description: language === 'th' ? 'กรุณากรอกรายละเอียดด้วยตนเอง' : 'Please fill in details manually',
                condition: language === 'th' ? 'ดี' : 'Good',
                confidence: 0,
            })
        } finally {
            setIsAnalyzing(false)
        }
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        const file = e.dataTransfer.files?.[0]
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader()
            reader.onload = (ev) => {
                const base64 = ev.target?.result as string
                setSelectedImage(base64)
                analyzeImage(base64)
            }
            reader.readAsDataURL(file)
        }
    }

    const steps = [
        { icon: Camera, title: t.step1Title, desc: t.step1Desc, color: 'from-purple-500 to-pink-500' },
        { icon: Sparkles, title: t.step2Title, desc: t.step2Desc, color: 'from-blue-500 to-cyan-500' },
        { icon: Edit3, title: t.step3Title, desc: t.step3Desc, color: 'from-green-500 to-emerald-500' },
        { icon: Check, title: t.step4Title, desc: t.step4Desc, color: 'from-orange-500 to-red-500' },
    ]

    const benefits = [
        { icon: Clock, text: t.benefit1 },
        { icon: DollarSign, text: t.benefit2 },
        { icon: FileText, text: t.benefit3 },
        { icon: Tag, text: t.benefit4 },
    ]

    return (
        <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-bg-dark">
            <Header />
            <main className="flex-1">
                {/* Hero */}
                <section className="relative py-16 bg-gradient-to-br from-purple-600 via-pink-600 to-red-600 overflow-hidden">
                    <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
                    <div className="container mx-auto px-4 relative z-10">
                        <div className="text-center mb-8">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-white mb-4">
                                <Wand2 className="w-4 h-4" />
                                <span className="text-sm font-medium">{t.aiPowered}</span>
                            </div>
                            <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
                                📸 {t.title}
                            </h1>
                            <p className="text-lg text-white/80 max-w-2xl mx-auto">
                                {t.subtitle}
                            </p>
                        </div>

                        {/* Upload Area */}
                        <div className="max-w-2xl mx-auto">
                            <div className="bg-white dark:bg-surface-dark rounded-2xl shadow-2xl p-6">
                                {!selectedImage ? (
                                    <div
                                        onDrop={handleDrop}
                                        onDragOver={(e) => e.preventDefault()}
                                        className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-12 text-center hover:border-purple-500 transition-colors cursor-pointer"
                                        onClick={() => fileInputRef.current?.click()}
                                    >
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept="image/*"
                                            capture="environment"
                                            onChange={handleImageSelect}
                                            className="hidden"
                                        />
                                        <div className="w-20 h-20 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mx-auto mb-4">
                                            <Camera className="w-10 h-10 text-purple-600" />
                                        </div>
                                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-4">
                                            <Button className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl flex items-center gap-2">
                                                <Camera className="w-5 h-5" />
                                                {t.takePhoto}
                                            </Button>
                                            <Button variant="outline" className="px-6 py-3 rounded-xl flex items-center gap-2">
                                                <Upload className="w-5 h-5" />
                                                {t.uploadPhoto}
                                            </Button>
                                        </div>
                                        <p className="text-gray-500 text-sm">{t.orDragDrop}</p>
                                    </div>
                                ) : (
                                    <div>
                                        {/* Image Preview */}
                                        <div className="relative rounded-xl overflow-hidden mb-6">
                                            <img src={selectedImage} alt="Product" className="w-full h-64 object-cover" />
                                            {isAnalyzing && (
                                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                                    <div className="text-white text-center">
                                                        <Sparkles className="w-10 h-10 mx-auto mb-2 animate-pulse" />
                                                        <p>{t.analyzing}</p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* AI Results */}
                                        {result && (
                                            <div className="space-y-4">
                                                <div className="flex items-center gap-2 text-emerald-600 font-medium">
                                                    <Check className="w-5 h-5" />
                                                    {t.aiDetected} ({result.confidence}% confidence)
                                                </div>

                                                <div className="space-y-3">
                                                    <div>
                                                        <label className="text-sm text-gray-500">{t.suggestedTitle}</label>
                                                        <p className="font-bold text-lg">{result.title}</p>
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div>
                                                            <label className="text-sm text-gray-500">{t.suggestedCategory}</label>
                                                            <p className="font-medium">{result.category}</p>
                                                        </div>
                                                        <div>
                                                            <label className="text-sm text-gray-500">{t.suggestedPrice}</label>
                                                            <p className="font-bold text-orange-600 text-xl">฿{result.price.toLocaleString()}</p>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <label className="text-sm text-gray-500">{t.suggestedDesc}</label>
                                                        <p className="text-sm text-gray-700 dark:text-gray-300">{result.description}</p>
                                                    </div>
                                                </div>

                                                <div className="flex gap-3 pt-4">
                                                    <Link href="/sell" className="flex-1">
                                                        <Button variant="outline" className="w-full py-3 rounded-xl flex items-center justify-center gap-2">
                                                            <Edit3 className="w-4 h-4" />
                                                            {t.editAndPublish}
                                                        </Button>
                                                    </Link>
                                                    <Link href="/sell" className="flex-1">
                                                        <Button className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl flex items-center justify-center gap-2">
                                                            <Zap className="w-4 h-4" />
                                                            {t.publishNow}
                                                        </Button>
                                                    </Link>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </section>

                {/* How It Works */}
                <section className="py-16">
                    <div className="container mx-auto px-4">
                        <h2 className="text-2xl font-bold text-center mb-12">{t.howItWorks}</h2>
                        <div className="grid md:grid-cols-4 gap-8 max-w-5xl mx-auto">
                            {steps.map((step, idx) => (
                                <div key={idx} className="text-center relative">
                                    {idx < steps.length - 1 && (
                                        <div className="hidden md:block absolute top-8 left-1/2 w-full h-0.5 bg-gray-200 dark:bg-gray-700" />
                                    )}
                                    <div className={`relative w-16 h-16 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center text-white mx-auto mb-4 z-10`}>
                                        <step.icon className="w-8 h-8" />
                                    </div>
                                    <h3 className="font-bold mb-2">{step.title}</h3>
                                    <p className="text-gray-500 text-sm">{step.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Benefits */}
                <section className="py-16 bg-white dark:bg-surface-dark">
                    <div className="container mx-auto px-4">
                        <h2 className="text-2xl font-bold text-center mb-8">{t.benefits}</h2>
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
                            {benefits.map((benefit, idx) => (
                                <div key={idx} className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 dark:bg-gray-800">
                                    <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                                        <benefit.icon className="w-5 h-5 text-purple-600" />
                                    </div>
                                    <span className="font-medium">{benefit.text}</span>
                                </div>
                            ))}
                        </div>
                        <div className="text-center mt-8">
                            <Link href="/sell">
                                <Button className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl flex items-center gap-2 mx-auto">
                                    {t.startSelling}
                                    <ArrowRight className="w-4 h-4" />
                                </Button>
                            </Link>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    )
}
