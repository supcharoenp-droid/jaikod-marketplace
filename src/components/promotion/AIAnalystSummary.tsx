'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Brain, Sparkles, TrendingUp, AlertCircle, Lightbulb, Zap } from 'lucide-react'
import { SellerInsights } from '@/lib/promotion/insightsService'

interface AIAnalystSummaryProps {
    data: SellerInsights
}

export default function AIAnalystSummary({ data }: AIAnalystSummaryProps) {
    const [summary, setSummary] = useState<{
        title: string
        text: string
        action: string
        type: 'success' | 'warning' | 'info'
    } | null>(null)

    const [displayText, setDisplayText] = useState('')
    const [isTyping, setIsTyping] = useState(false)

    useEffect(() => {
        analyzeData()
    }, [data])

    // ตรรกะวิเคราะห์ข้อมูล (AI Logic simulation)
    const analyzeData = () => {
        const { metrics } = data
        const ctr = metrics.ctr
        const conv = (metrics.total_leads / (metrics.total_clicks || 1)) * 100

        let result: typeof summary = {
            title: 'AI Market Analysis',
            text: 'ระบบกำลังวิเคราะห์แนวโน้มการขายของคุณในปี 2026...',
            action: 'กำลังประมวลผล',
            type: 'info'
        }

        if (metrics.total_impressions < 100) {
            result = {
                title: 'Low Visibility Detected',
                text: 'ประกาศของคุณยังเข้าถึงผู้ซื้อได้น้อยมากในช่วงนี้ ทำให้โอกาสในการขายลดลงอย่างมาก',
                action: 'แนะนำให้ลองใช้ Premium Boost เพื่อดันประกาศขึ้นสู่อันดับ 1 ของหมวดหมู่ครับ',
                type: 'warning'
            }
        } else if (ctr < 2) {
            result = {
                title: 'Product Attraction Gap',
                text: 'คนเห็นสินค้าคุณเยอะมาก แต่ไม่ค่อยมีคนคลิกเข้ามาดู (CTR ต่ำกว่ามาตรฐาน)',
                action: 'ลองเปลี่ยนรูปภาพหน้าปกให้ดูสว่างและพรีเมียมขึ้น หรือลดราคาลง 3-5% จะช่วยเพิ่มยอดคลิกได้ 15-20% ครับ',
                type: 'warning'
            }
        } else if (conv < 5 && metrics.total_clicks > 50) {
            result = {
                title: 'Conversion Opportunity',
                text: 'สินค้าคุณน่าสนใจมาก คนคลิกเยอะ แต่ยังไม่ตัดสินใจทักแชท (Leads ต่ำ)',
                action: 'ลองเพิ่มรายละเอียดสินค้าให้ครบถ้วนมากขึ้น หรือระบุว่า "พร้อมส่งทันที" เพื่อสร้างความมั่นใจให้ผู้ซื้อครับ',
                type: 'info'
            }
        } else if (metrics.total_leads > 10) {
            result = {
                title: 'High Demand Pulse',
                text: 'ยอดเยี่ยมมาก! สินค้าของคุณกำลังเป็นที่ต้องการ อัตราการทักแชทของคุณสูงกว่าค่าเฉลี่ยตลาด 24%',
                action: 'จังหวะนี้ควรใช้ Homepage Boost เพื่อกวาดฐานลูกค้าใหม่ๆ ก่อนคู่แข่งจะเริ่มขยับครับ',
                type: 'success'
            }
        } else {
            result = {
                title: 'Stable Performance',
                text: 'ร้านค้าของคุณมีการเติบโตที่มั่นคง ตัวเลข CTR และ Conversion อยู่ในเกณฑ์มาตรฐาน',
                action: 'รักษามาตรฐานนี้ไว้ครับ และลองทดสอบ Boost ในช่วงวันหยุดสุดสัปดาห์ซึ่งมีคนซื้อหนาแน่นขึ้น',
                type: 'success'
            }
        }

        setSummary(result)

        // Reset typing effect
        setDisplayText('')
        setIsTyping(true)
    }

    // Typewriter effect logic
    useEffect(() => {
        if (summary && isTyping) {
            let i = 0
            const fullText = summary.text
            const interval = setInterval(() => {
                setDisplayText(fullText.slice(0, i))
                i++
                if (i > fullText.length) {
                    clearInterval(interval)
                    setIsTyping(false)
                }
            }, 30)
            return () => clearInterval(interval)
        }
    }, [summary, isTyping])

    if (!summary) return null

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`rounded-3xl p-6 border ${summary.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20' :
                    summary.type === 'warning' ? 'bg-orange-500/10 border-orange-500/20' :
                        'bg-blue-500/10 border-blue-500/20'
                }`}
        >
            <div className="flex items-start gap-4">
                <div className={`p-3 rounded-2xl ${summary.type === 'success' ? 'bg-emerald-500/20 text-emerald-400' :
                        summary.type === 'warning' ? 'bg-orange-500/20 text-orange-400' :
                            'bg-blue-500/20 text-blue-400'
                    }`}>
                    {summary.type === 'success' ? <TrendingUp className="w-5 h-5" /> :
                        summary.type === 'warning' ? <AlertCircle className="w-5 h-5" /> :
                            <Brain className="w-5 h-5" />}
                </div>

                <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                        <h4 className="font-black text-white uppercase tracking-wider text-sm flex items-center gap-2">
                            {summary.title}
                            <Sparkles className="w-3 h-3 text-yellow-400 fill-current" />
                        </h4>
                        <span className="text-[10px] font-bold text-slate-500 uppercase">AI Copilot Analysis v2.4</span>
                    </div>

                    <p className="text-slate-300 text-sm leading-relaxed min-h-[40px]">
                        {displayText}
                        {isTyping && <span className="inline-block w-1.5 h-4 ml-1 bg-purple-500 animate-pulse align-middle" />}
                    </p>

                    <div className="mt-4 pt-4 border-t border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                            <Lightbulb className="w-4 h-4 text-yellow-400" />
                            Next Step: <span className="text-slate-200">{summary.action}</span>
                        </div>

                        <button className="px-4 py-2 bg-slate-900/50 hover:bg-slate-800 text-xs font-black text-white rounded-xl border border-white/10 flex items-center gap-2 transition-all">
                            <Zap className="w-3 h-3 text-yellow-400 fill-current" />
                            GO TO BOOST
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    )
}
