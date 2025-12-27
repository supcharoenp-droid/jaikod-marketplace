import { NextRequest, NextResponse } from 'next/server'
import { moderateContent } from '@/lib/content-moderation'

/**
 * POST /api/products/moderate
 * ตรวจสอบสินค้าด้วย AI Content Moderation
 */
export async function POST(request: NextRequest) {
    try {
        const productData = await request.json()

        // Validate required fields
        if (!productData.title || !productData.description) {
            return NextResponse.json(
                { error: 'Missing required fields: title, description' },
                { status: 400 }
            )
        }

        // Run AI moderation
        const result = await moderateContent(productData.title, productData.description)

        // Convert to moderation result format
        const now = new Date()
        const moderationResult = {
            product_id: productData.id || 'unknown',
            status: result.isApproved ? 'approved' : 'rejected',
            overall_score: result.confidence * 100,
            checks: result.violations.map((v, idx) => ({
                check_id: `check-${idx}`,
                type: 'ai' as const,
                status: 'fail' as const,
                category: v.type || 'content',
                message: v.description || 'Violation detected',
                confidence: result.confidence,
                checked_at: now
            })),
            auto_approved: result.isApproved,
            created_at: now,
            updated_at: now,
        }

        // TODO: Save moderation result to Firestore
        // await saveModerationResult(moderationResult)

        // TODO: If approved, publish product
        // if (moderationResult.status === 'approved') {
        //     await publishProduct(productData)
        // }

        // TODO: If rejected, notify user
        // if (moderationResult.status === 'rejected') {
        //     await notifyUser(productData.seller_id, moderationResult)
        // }

        return NextResponse.json({
            success: true,
            moderation: moderationResult
        })
    } catch (error) {
        console.error('Moderation error:', error)
        return NextResponse.json(
            { error: 'Moderation failed' },
            { status: 500 }
        )
    }
}

/**
 * GET /api/products/moderate?productId=xxx
 * ดึงผลการตรวจสอบ
 */
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const productId = searchParams.get('productId')

        if (!productId) {
            return NextResponse.json(
                { error: 'Missing productId parameter' },
                { status: 400 }
            )
        }

        // TODO: Fetch moderation result from Firestore
        // const moderationResult = await getModerationResult(productId)

        // Mock response
        return NextResponse.json({
            success: true,
            moderation: {
                product_id: productId,
                status: 'approved',
                overall_score: 92,
                checks: [],
                auto_approved: true,
                created_at: new Date(),
                updated_at: new Date(),
            }
        })
    } catch (error) {
        console.error('Get moderation error:', error)
        return NextResponse.json(
            { error: 'Failed to get moderation result' },
            { status: 500 }
        )
    }
}
