import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Routes that require authentication
const protectedRoutes = [
    '/seller',
    '/profile',
    '/wallet',
    '/chat',
    '/favorites',
    '/notifications',
    '/checkout',
    '/sell',
]

// Routes that should redirect to home if already authenticated
const authRoutes = [
    '/login',
    '/register',
    '/forgot-password',
]

// Admin routes (require admin role check on server)
const adminRoutes = [
    '/admin',
]

// API routes that need rate limiting
const rateLimitedRoutes = [
    '/api/ai/',
    '/api/products/',
]

export function middleware(request: NextRequest) {
    try {
        const response = NextResponse.next()

        // Security headers
        response.headers.set('X-Frame-Options', 'DENY')
        response.headers.set('X-Content-Type-Options', 'nosniff')
        response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')

        // CORS for API routes
        const { pathname } = request.nextUrl
        if (pathname.startsWith('/api/')) {
            response.headers.set('Access-Control-Allow-Origin', '*')
            response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
            response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        }

        return response
    } catch (error) {
        console.error('Middleware error:', error)
        return NextResponse.next()
    }
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public folder
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}
