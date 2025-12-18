
import { NextResponse } from 'next/server'
import { checkDatabaseHealth } from '@/lib/monitor/system-monitor'

export const dynamic = 'force-dynamic'

export async function GET() {
    const startTime = Date.now()
    const isDbUp = await checkDatabaseHealth()
    const duration = Date.now() - startTime

    if (isDbUp) {
        return NextResponse.json({
            status: 'ok',
            database: 'connected',
            latency: duration,
            timestamp: new Date().toISOString()
        }, { status: 200 })
    } else {
        return NextResponse.json({
            status: 'error',
            database: 'disconnected',
            timestamp: new Date().toISOString()
        }, { status: 503 })
    }
}
