import { doc, getDoc } from 'firebase/firestore';
import { db } from './firebase';

export interface UserProfile {
    uid: string;
    displayName: string;
    photoURL: string;
    role?: string;
    email?: string;
    phoneNumber?: string;
    isVerified?: boolean;
    createdAt?: any;
    successfulTransactions?: number;
    reportCount?: number;
}

export interface UserTrustStats {
    score: number;
    grade: 'S' | 'A' | 'B' | 'C' | 'F';
    level: string;
    color: string;
    description: string;
}

export function calculateTrustScore(user: UserProfile): UserTrustStats {
    let score = 40; // Base Score for new users

    // 1. Identity Verification (+30)
    if (user.isVerified) score += 30;

    // 2. Contact Info (+10)
    if (user.phoneNumber) score += 10;
    if (user.email) score += 5;

    // 3. Experience & History (Mock logic for now, using role/createdAt in future)
    // If we had transaction data:
    if (user.successfulTransactions && user.successfulTransactions > 0) {
        score += Math.min(15, user.successfulTransactions * 1); // +1 per sale, max 15
    }

    // 4. Penalties
    if (user.reportCount && user.reportCount > 0) {
        score -= (user.reportCount * 20); // -20 per valid report
    }

    // Cap Score
    score = Math.min(100, Math.max(0, score));

    // Grading System
    let grade: UserTrustStats['grade'] = 'C';
    let color = '#fbbf24'; // Warning Yellow
    let level = 'สมาชิกทั่วไป';
    let description = 'ความน่าเชื่อถือระดับปานกลาง';

    if (score >= 90) {
        grade = 'S';
        color = '#8b5cf6'; // JaiKod Purple
        level = 'ผู้ขายระดับตำนาน';
        description = 'ความน่าเชื่อถือสูงสุด';
    }
    else if (score >= 80) {
        grade = 'A';
        color = '#10b981'; // Success Green
        level = 'ผู้ขายมืออาชีพ';
        description = 'ความน่าเชื่อถือสูงมาก';
    }
    else if (score >= 60) {
        grade = 'B';
        color = '#3b82f6'; // Blue
        level = 'สมาชิกยืนยันตัวตน';
        description = 'ผ่านการยืนยันตัวตนแล้ว';
    }
    else if (score < 40) {
        grade = 'F';
        color = '#ef4444'; // Danger Red
        level = 'บัญชีมีความเสี่ยง';
        description = 'ควรระมัดระวังในการซื้อขาย';
    }

    return { score, grade, level, color, description };
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
    try {
        const userDoc = await getDoc(doc(db, 'users', uid));
        if (userDoc.exists()) {
            const data = userDoc.data();
            return {
                uid: userDoc.id,
                displayName: data.displayName || data.firstName + ' ' + data.lastName || 'User',
                photoURL: data.photoURL || data.avatarUrl || '',
                role: data.role,
                email: data.email,
                phoneNumber: data.phoneNumber,
                isVerified: data.emailVerified || data.isVerified,
                createdAt: data.createdAt,
                successfulTransactions: data.successfulTransactions || 0,
                reportCount: data.reportCount || 0
            };
        }
        return null;
    } catch (error) {
        console.error('Error fetching user profile:', error);
        return null;
    }
}
