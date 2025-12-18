import type { Config } from 'tailwindcss'

const config: Config = {
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                // Primary Colors
                'neon-purple': '#8B5CF6',
                'coral-orange': '#FF6B6B',
                'electric-blue': '#3B82F6',

                // Neutral Colors
                'bg-light': '#FAFAFA',
                'bg-dark': '#1A1A1A',
                'surface-dark': '#2D2D2D',
                'text-primary': '#1F2937',
                'text-secondary': '#6B7280',
                'text-light': '#E5E5E5',

                // Semantic Colors
                'success': '#10B981',
                'warning': '#F59E0B',
                'error': '#EF4444',
                'info': '#3B82F6',
            },
            fontFamily: {
                primary: ['var(--font-sarabun)', 'Noto Sans Thai', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
                display: ['var(--font-prompt)', 'Sarabun', 'sans-serif'],
                mono: ['JetBrains Mono', 'Courier New', 'monospace'],
            },
            fontSize: {
                'hero': ['3rem', { lineHeight: '1.2', fontWeight: '700' }],
                'section': ['2.25rem', { lineHeight: '1.3', fontWeight: '600' }],
                'card-title': ['1.5rem', { lineHeight: '1.4', fontWeight: '600' }],
            },
            borderRadius: {
                'card': '12px',
            },
            boxShadow: {
                'card': '0 2px 8px rgba(0,0,0,0.08)',
                'card-hover': '0 8px 24px rgba(0,0,0,0.12)',
            },
            animation: {
                'fade-in': 'fadeIn 0.3s ease-out',
                'fade-in-down': 'fadeInDown 0.5s ease-out',
                'slide-up': 'slideUp 0.3s ease-out',
                'shimmer': 'shimmer 2s infinite',
                'gradient-x': 'gradient-x 3s ease infinite',
                'glow': 'glow 2s ease-in-out infinite',
                'pulse-once': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) 1',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                fadeInDown: {
                    '0%': { opacity: '0', transform: 'translateY(-10px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                slideUp: {
                    '0%': { transform: 'translateY(20px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                shimmer: {
                    '0%': { backgroundPosition: '-1000px 0' },
                    '100%': { backgroundPosition: '1000px 0' },
                },
                'gradient-x': {
                    '0%, 100%': { backgroundPosition: '0% 50%' },
                    '50%': { backgroundPosition: '100% 50%' },
                },
                glow: {
                    '0%, 100%': { opacity: '1' },
                    '50%': { opacity: '0.5' },
                },
            },
        },
    },
    plugins: [],
    darkMode: 'class',
}

export default config
