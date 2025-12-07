/** @type {import('next').NextConfig} */
const nextConfig = {
    // Disable TypeScript errors during build (temporary)
    typescript: {
        ignoreBuildErrors: true,
    },
    // Disable ESLint during build (temporary)
    eslint: {
        ignoreDuringBuilds: true,
    },
    images: {
        unoptimized: true,
    },
}

module.exports = nextConfig
