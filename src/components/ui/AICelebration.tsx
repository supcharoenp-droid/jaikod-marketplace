/**
 * AI Celebration Component
 * 
 * แสดง confetti และ celebration เมื่อ AI ให้คะแนนดี
 */

'use client'

import { useEffect } from 'react'
import confetti from 'canvas-confetti'

interface AICelebrationProps {
    trigger: boolean
    grade?: string
}

export default function AICelebration({ trigger, grade }: AICelebrationProps) {
    useEffect(() => {
        if (trigger && grade === 'A') {
            // Confetti animation
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#9333EA', '#EC4899', '#3B82F6']
            })

            // Second wave
            setTimeout(() => {
                confetti({
                    particleCount: 50,
                    angle: 60,
                    spread: 55,
                    origin: { x: 0 },
                    colors: ['#9333EA', '#EC4899']
                })
            }, 200)

            setTimeout(() => {
                confetti({
                    particleCount: 50,
                    angle: 120,
                    spread: 55,
                    origin: { x: 1 },
                    colors: ['#9333EA', '#EC4899']
                })
            }, 400)
        } else if (trigger && grade === 'B') {
            // Smaller celebration for B grade
            confetti({
                particleCount: 50,
                spread: 60,
                origin: { y: 0.6 },
                colors: ['#3B82F6', '#8B5CF6']
            })
        }
    }, [trigger, grade])

    return null
}
