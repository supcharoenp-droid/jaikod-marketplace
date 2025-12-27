/** @type {import('next').NextConfig} */
const nextConfig = {
    // Disable TypeScript errors during build (temporary)
    typescript: {
        ignoreBuildErrors: true,
    },
    images: {
        unoptimized: true,
    },
}

module.exports = nextConfig
