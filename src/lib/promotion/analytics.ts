import { db } from '@/lib/firebase'
import { collection, addDoc, Timestamp, increment, doc, setDoc } from 'firebase/firestore'

export interface PromotionEvent {
    type: 'impression' | 'click'
    promotion_id: string
    listing_id?: string
    seller_id: string
    placement: string
    user_id?: string
    user_agent?: string
    timestamp: Date
}

/**
 * บันทึกเหตุการณ์ (Impression/Click) ลง Firestore
 * และอัปเดตตัวเลขรวม (Counter) เพื่อความรวดเร็วในการแสดงผล
 */
export async function recordPromotionEvent(event: PromotionEvent) {
    try {
        // 1. บันทึก Raw Event
        await addDoc(collection(db, 'promotion_analytics'), {
            ...event,
            timestamp: Timestamp.fromDate(event.timestamp)
        })

        // 2. อัปเดตสถิติรวม (Counter Optimization)
        // เราจะเก็บสถิติรวมไว้ในคอลเลคชัน promotion_stats เพื่อไม่ให้ต้องนับใหม่ทุกครั้ง
        const statsRef = doc(db, 'promotion_stats', `${event.seller_id}_${event.promotion_id}`)

        const updateData: any = {
            last_updated: Timestamp.now(),
            seller_id: event.seller_id,
            promotion_id: event.promotion_id,
            listing_id: event.listing_id || null
        }

        if (event.type === 'impression') {
            updateData.total_impressions = increment(1)
        } else {
            updateData.total_clicks = increment(1)
        }

        // ใช้ setDoc แบบ merge เพื่อสร้างถ้ายังไม่มี
        await setDoc(statsRef, updateData, { merge: true })

    } catch (error) {
        console.error('Failed to record promotion event:', error)
    }
}
