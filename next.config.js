/** @type {import('next').NextConfig} */
const nextConfig = {
    // Disable TypeScript errors during build (temporary)
    typescript: {
        ignoreBuildErrors: true,
    },
    eslint: {
        ignoreDuringBuilds: true,
    },
    images: {
        unoptimized: true,
    },
}

module.exports = nextConfig
