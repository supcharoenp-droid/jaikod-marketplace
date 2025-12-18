'use client'

import React, { useRef, useCallback } from 'react'

export interface InfiniteScrollProps {
    onLoadMore: () => void
    hasMore: boolean
    isLoading: boolean
    children: React.ReactNode
}

export default function InfiniteScroll({ onLoadMore, hasMore, isLoading, children }: InfiniteScrollProps) {
    const observer = useRef<IntersectionObserver | null>(null)
    const lastElementRef = useCallback(
        (node: HTMLDivElement) => {
            if (isLoading) return
            if (observer.current) observer.current.disconnect()
            observer.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting && hasMore) {
                    onLoadMore()
                }
            })
            if (node) observer.current.observe(node)
        },
        [isLoading, hasMore, onLoadMore]
    )

    return (
        <>
            {children}
            {hasMore ? (
                <div ref={lastElementRef} className="py-8 flex justify-center w-full col-span-full">
                    <div className="flex items-center gap-2 text-gray-400 animate-pulse">
                        <div className="w-2 h-2 bg-purple-500 rounded-full" />
                        <div className="w-2 h-2 bg-purple-500 rounded-full animation-delay-200" />
                        <div className="w-2 h-2 bg-purple-500 rounded-full animation-delay-400" />
                    </div>
                </div>
            ) : (
                <div className="py-8 text-center w-full col-span-full text-gray-300 text-sm">
                    ------- สิ้นสุดผลลัพธ์ -------
                </div>
            )}
        </>
    )
}
