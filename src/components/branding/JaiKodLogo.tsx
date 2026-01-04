'use client'

/**
 * JaiKod Logo Component
 * 
 * Design Philosophy:
 * - ใจ (Jai) = Heart, Care, Warmth → Coral/Orange gradient
 * - โค้ด (Kod) = Code, Technology, AI → Purple/Blue gradient  
 * - AI Sparkle = Intelligence, Innovation → Golden accent
 * - Swoosh = Speed, Connection → Purple flow
 * 
 * Usage:
 * <JaiKodLogo variant="full" size="lg" />
 * <JaiKodLogo variant="icon" size="md" />
 * <JaiKodLogo variant="wordmark" theme="light" />
 * 
 * Note: Uses CSS animations (defined in globals.css) instead of Framer Motion 
 * to avoid hydration errors
 */

interface JaiKodLogoProps {
    variant?: 'full' | 'wordmark' | 'icon'
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
    theme?: 'dark' | 'light' | 'auto'
    animated?: boolean
    className?: string
}

// Size mappings
const sizes = {
    xs: { height: 24, iconSize: 24 },
    sm: { height: 32, iconSize: 32 },
    md: { height: 40, iconSize: 40 },
    lg: { height: 56, iconSize: 56 },
    xl: { height: 72, iconSize: 72 },
    '2xl': { height: 96, iconSize: 96 },
}

export default function JaiKodLogo({
    variant = 'full',
    size = 'md',
    theme = 'auto',
    animated = true,
    className = ''
}: JaiKodLogoProps) {
    const { height, iconSize } = sizes[size]

    // Animation variants
    const sparkleVariants = {
        initial: { scale: 1, opacity: 0.8 },
        animate: {
            scale: [1, 1.2, 1],
            opacity: [0.8, 1, 0.8],
            transition: { duration: 2, repeat: Infinity, ease: 'easeInOut' }
        }
    }

    const swooshVariants = {
        initial: { pathLength: 0, opacity: 0 },
        animate: {
            pathLength: 1,
            opacity: 1,
            transition: { duration: 1.5, ease: 'easeOut' }
        }
    }

    // Full Logo with Icon + Wordmark
    if (variant === 'full') {
        return (
            <div className={`inline-flex items-center gap-2 ${className}`}>
                <JaiKodIcon size={iconSize} animated={animated} />
                <JaiKodWordmark height={height} animated={animated} />
            </div>
        )
    }

    // Icon Only
    if (variant === 'icon') {
        return <JaiKodIcon size={iconSize} animated={animated} className={className} />
    }

    // Wordmark Only
    return <JaiKodWordmark height={height} animated={animated} className={className} />
}

// ============================================
// JAIKOD ICON - Heart + Code + AI
// ============================================

interface IconProps {
    size?: number
    animated?: boolean
    className?: string
}

export function JaiKodIcon({ size = 40, animated = true, className = '' }: IconProps) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 64 64"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            {/* Gradient Definitions */}
            <defs>
                {/* Background Gradient */}
                <linearGradient id="iconBg" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#8B5CF6" />
                    <stop offset="50%" stopColor="#7C3AED" />
                    <stop offset="100%" stopColor="#4F46E5" />
                </linearGradient>

                {/* Coral Heart Gradient */}
                <linearGradient id="heartGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FF6B6B" />
                    <stop offset="100%" stopColor="#F59E0B" />
                </linearGradient>

                {/* AI Sparkle Gradient */}
                <linearGradient id="sparkleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FCD34D" />
                    <stop offset="100%" stopColor="#F59E0B" />
                </linearGradient>

                {/* Glow Filter */}
                <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                    <feMerge>
                        <feMergeNode in="coloredBlur" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
            </defs>

            {/* Background - Rounded Square */}
            <rect x="2" y="2" width="60" height="60" rx="14" fill="url(#iconBg)" />

            {/* Glass Effect Overlay */}
            <rect x="2" y="2" width="60" height="30" rx="14" fill="white" fillOpacity="0.1" />

            {/* Heart + Code Symbol */}
            <g transform="translate(12, 14)">
                {/* Heart Shape */}
                <path
                    d="M20 8C20 4.134 17 0 12 0C7 0 4 4.134 4 8C4 16 20 28 20 28C20 28 36 16 36 8C36 4.134 33 0 28 0C23 0 20 4.134 20 8Z"
                    fill="url(#heartGradient)"
                    opacity="0.9"
                />

                {/* Code Brackets </> inside heart */}
                <g fill="white" fontFamily="monospace" fontSize="12" fontWeight="bold">
                    {/* Left Bracket < */}
                    <text x="10" y="18" opacity="0.95">&lt;</text>
                    {/* Slash / */}
                    <text x="17" y="18" opacity="0.95">/</text>
                    {/* Right Bracket > */}
                    <text x="24" y="18" opacity="0.95">&gt;</text>
                </g>
            </g>

            {/* AI Sparkle Star */}
            <g
                filter="url(#glow)"
            >
                <path
                    d="M50 12L51.5 16L56 17L51.5 18L50 22L48.5 18L44 17L48.5 16L50 12Z"
                    fill="url(#sparkleGradient)"
                />
            </g>

            {/* Small Sparkles */}
            <circle cx="14" cy="50" r="1.5" fill="white" opacity="0.6" />
            <circle cx="50" cy="48" r="1" fill="white" opacity="0.4" />
        </svg>
    )
}

// ============================================
// JAIKOD WORDMARK - Stylized Text
// ============================================

interface WordmarkProps {
    height?: number
    animated?: boolean
    className?: string
}

export function JaiKodWordmark({ height = 40, animated = true, className = '' }: WordmarkProps) {
    const width = height * 3.5 // Aspect ratio

    return (
        <svg
            width={width}
            height={height}
            viewBox="0 0 180 50"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            <defs>
                {/* Jai Gradient - Warm (Coral to Gold) */}
                <linearGradient id="jaiGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FF6B6B" />
                    <stop offset="50%" stopColor="#F97316" />
                    <stop offset="100%" stopColor="#F59E0B" />
                </linearGradient>

                {/* Kod Gradient - Cool (Purple to Blue) */}
                <linearGradient id="kodGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#8B5CF6" />
                    <stop offset="50%" stopColor="#6366F1" />
                    <stop offset="100%" stopColor="#3B82F6" />
                </linearGradient>

                {/* Swoosh Gradient */}
                <linearGradient id="swooshGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0" />
                    <stop offset="50%" stopColor="#8B5CF6" />
                    <stop offset="100%" stopColor="#F59E0B" />
                </linearGradient>

                {/* Drop Shadow */}
                <filter id="textShadow" x="-10%" y="-10%" width="120%" height="130%">
                    <feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.15" />
                </filter>
            </defs>

            {/* "Jai" Text - Warm Gradient */}
            <text
                x="0"
                y="38"
                fontFamily="'Outfit', 'Poppins', 'Inter', sans-serif"
                fontSize="42"
                fontWeight="800"
                fill="url(#jaiGradient)"
                filter="url(#textShadow)"
            >
                Jai
            </text>

            {/* "Kod" Text - Cool Gradient */}
            <text
                x="68"
                y="38"
                fontFamily="'Outfit', 'Poppins', 'Inter', sans-serif"
                fontSize="42"
                fontWeight="800"
                fill="url(#kodGradient)"
                filter="url(#textShadow)"
            >
                Kod
            </text>

            {/* AI Sparkle on the "i" dot */}
            <g>
                <circle cx="30" cy="8" r="4" fill="#F59E0B" />
                <circle cx="30" cy="8" r="2" fill="#FCD34D" />
            </g>

            {/* Swoosh Line - Amazon-style arrow/smile */}
            <path
                d="M5 46 Q60 52 175 46"
                stroke="url(#swooshGradient)"
                strokeWidth="3"
                strokeLinecap="round"
                fill="none"
            />

            {/* Arrowhead at end of swoosh */}
            <path
                d="M170 43 L178 46 L170 49"
                stroke="#F59E0B"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
            />
        </svg>
    )
}

// ============================================
// LOGO VARIATIONS FOR DIFFERENT USE CASES
// ============================================

// Dark Background Version
export function JaiKodLogoDark(props: Omit<JaiKodLogoProps, 'theme'>) {
    return <JaiKodLogo {...props} theme="dark" />
}

// Light Background Version  
export function JaiKodLogoLight(props: Omit<JaiKodLogoProps, 'theme'>) {
    return <JaiKodLogo {...props} theme="light" />
}

// Static (No Animation) Version
export function JaiKodLogoStatic(props: Omit<JaiKodLogoProps, 'animated'>) {
    return <JaiKodLogo {...props} animated={false} />
}

// App Icon Only
export function JaiKodAppIcon({ size = 64 }: { size?: number }) {
    return <JaiKodIcon size={size} animated={false} />
}
