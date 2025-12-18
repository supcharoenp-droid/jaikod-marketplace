import React from 'react'

export default function ProductDetailPage({ params }: { params: { slug: string } }) {
    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-4">Product Detail: {params.slug}</h1>
            <p className="text-gray-500">Product details will be shown here.</p>
        </div>
    )
}
