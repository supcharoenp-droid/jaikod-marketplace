/**
 * BOOST DEBUG API
 * 
 * Endpoint สำหรับทดสอบและ debug boost system
 * GET /api/debug/boost
 */

import { NextRequest, NextResponse } from 'next/server'
import { runAllTests, addTestBalance } from '@/lib/boost/debug'

export async function GET(request: NextRequest) {
    try {
        // Run all tests
        const results = await runAllTests()

        return NextResponse.json({
            success: true,
            results,
            timestamp: new Date().toISOString()
        })
    } catch (error) {
        console.error('Debug API error:', error)
        return NextResponse.json({
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 })
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { action, user_id, amount } = body

        if (action === 'add_balance') {
            const result = await addTestBalance(user_id, amount || 1000)
            return NextResponse.json({
                success: result.success,
                new_balance: result.new_balance,
                error: result.error
            })
        }

        return NextResponse.json({
            success: false,
            error: 'Invalid action'
        }, { status: 400 })
    } catch (error) {
        console.error('Debug API POST error:', error)
        return NextResponse.json({
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 })
    }
}
