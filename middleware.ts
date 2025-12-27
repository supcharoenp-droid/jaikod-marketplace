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
    const { pathname } = request.nextUrl

    // Get Firebase auth session cookie
    // Note: Firebase Auth uses tokens, not session cookies by default
    // For proper server-side auth, you'd need to implement session management
    const authToken = request.cookies.get('__session')?.value
    const isAuthenticated = !!authToken

    // Check if route requires authentication
    const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))
    const isAuthRoute = authRoutes.some(route => pathname.startsWith(route))
    const isAdminRoute = adminRoutes.some(route => pathname.startsWith(route))
    const isRateLimitedRoute = rateLimitedRoutes.some(route => pathname.startsWith(route))

    // Redirect unauthenticated users from protected routes
    // NOTE: Firebase Auth uses client-side tokens, not session cookies.
    // Authentication is handled client-side in AuthContext.
    // For server-side auth, implement Firebase Admin SDK session management.
    // if (isProtectedRoute && !isAuthenticated) {
    //     const loginUrl = new URL('/login', request.url)
    //     loginUrl.searchParams.set('redirect', pathname)
    //     return NextResponse.redirect(loginUrl)
    // }

    // Redirect authenticated users from auth routes (login, register)
    // Commented out: Firebase handles this client-side
    // if (isAuthRoute && isAuthenticated) {
    //     return NextResponse.redirect(new URL('/', request.url))
    // }

    // Add security headers
    const response = NextResponse.next()

    // Security headers
    response.headers.set('X-Frame-Options', 'DENY')
    response.headers.set('X-Content-Type-Options', 'nosniff')
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
    response.headers.set('X-XSS-Protection', '1; mode=block')

    // CSP Header (Content Security Policy)
    // Note: Adjust based on your actual resource needs
    response.headers.set(
        'Content-Security-Policy',
        [
            "default-src 'self'",
            "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://apis.google.com https://*.firebaseapp.com https://*.gstatic.com",
            "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
            "font-src 'self' https://fonts.gstatic.com",
            "img-src 'self' data: blob: https: http:",
            "connect-src 'self' https://*.googleapis.com https://*.firebaseio.com https://*.firebase.com https://api.openai.com wss://*.firebaseio.com https://api.ipify.org",
            "frame-src 'self' https://*.firebaseapp.com https://accounts.google.com https://www.facebook.com https://access.line.me",
            "worker-src 'self' blob:",
        ].join('; ')
    )

    // CORS for API routes
    if (pathname.startsWith('/api/')) {
        response.headers.set('Access-Control-Allow-Origin', process.env.NEXT_PUBLIC_SITE_URL || '*')
        response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    }

    return response
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
