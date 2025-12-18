'use client'

import { useRef, useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react'
import { Product } from '@/types'
import ProductCard from '@/components/product/ProductCard'
import Link from 'next/link'

interface ProductSectionProps {
    title: string
    subtitle?: string
    icon?: React.ReactNode
    products: Product[]
    viewAllLink?: string
    layout?: 'slider' | 'grid'
    actionButton?: React.ReactNode // New prop for custom buttons (e.g. "Search Near Me")
}

export default function ProductSection({
    title,
    subtitle,
    icon,
    products,
    viewAllLink,
    layout = 'slider',
    actionButton
}: ProductSectionProps) {
    const scrollRef = useRef<HTMLDivElement>(null)
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    const scroll = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const scrollAmount = direction === 'left' ? -300 : 300
            scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' })
        }
    }

    if (products.length === 0) return null

    // SSR placeholder
    if (!mounted) {
        return (
            <section className="py-8">
                <div className="container mx-auto px-4">
                    <div className="flex items-end justify-between mb-6">
                        <div className="flex items-center gap-2">
                            {icon && <div className="text-neon-purple">{icon}</div>}
                            <div>
                                <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                                    {title}
                                </h2>
                                {subtitle && (
                                    <p className="text-sm text-text-secondary dark:text-gray-400 mt-1">
                                        {subtitle}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        {[1, 2, 3, 4, 5].map(i => (
                            <div key={i} className="min-w-[160px] md:min-w-[220px] aspect-[3/4] bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse"></div>
                        ))}
                    </div>
                </div>
            </section>
        )
    }

    return (
        <section className="py-8">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 gap-4">
                    <div className="flex items-center gap-2">
                        {icon && <div className="text-neon-purple shrink-0">{icon}</div>}
                        <div>
                            <h2 className="text-xl md:text-2xl font-display font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                                {title}
                            </h2>
                            {subtitle && (
                                <p className="text-sm text-text-secondary dark:text-gray-400 mt-1">
                                    {subtitle}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-3 self-end md:self-auto">
                        {/* Custom Action Button (e.g. Near Me Search) */}
                        {actionButton}

                        {viewAllLink && (
                            <Link href={viewAllLink} className="hidden md:flex items-center text-sm font-medium text-neon-purple hover:underline whitespace-nowrap">
                                ดูทั้งหมด <ArrowRight className="w-4 h-4 ml-1" />
                            </Link>
                        )}

                        {/* Mobile Navigation Arrows (Slider Only) */}
                        {layout === 'slider' && (
                            <div className="flex gap-2 md:hidden">
                                <button onClick={() => scroll('left')} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-700">
                                    <ChevronLeft className="w-4 h-4" />
                                </button>
                                <button onClick={() => scroll('right')} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-700">
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Content */}
                {layout === 'slider' ? (
                    <div className="relative group">
                        {/* Desktop Arrows */}
                        <button
                            onClick={() => scroll('left')}
                            className="hidden md:flex absolute -left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white dark:bg-surface-dark rounded-full shadow-lg border border-gray-100 dark:border-gray-700 items-center justify-center text-gray-600 hover:text-neon-purple opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-90 group-hover:scale-100"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>

                        <div
                            ref={scrollRef}
                            className="flex gap-4 md:gap-5 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide px-1 -mx-1"
                            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                        >
                            {products.map((product) => (
                                <div key={product.id} className="min-w-[160px] md:min-w-[220px] snap-start">
                                    <ProductCard product={product} />
                                </div>
                            ))}
                        </div>

                        <button
                            onClick={() => scroll('right')}
                            className="hidden md:flex absolute -right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white dark:bg-surface-dark rounded-full shadow-lg border border-gray-100 dark:border-gray-700 items-center justify-center text-gray-600 hover:text-neon-purple opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-90 group-hover:scale-100"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
                        {products.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                )}

                {/* Mobile View All Button */}
                {viewAllLink && (
                    <div className="mt-6 text-center md:hidden">
                        <Link href={viewAllLink} className="inline-flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                            ดูทั้งหมด
                        </Link>
                    </div>
                )}
            </div>
        </section>
    )
}
