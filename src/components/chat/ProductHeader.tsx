'use client';

import { ExternalLink, Tag } from 'lucide-react';
import Image from 'next/image';

interface ProductHeaderProps {
    title: string;
    price: number;
    image?: string;
    productId: string;
}

export default function ProductHeader({ title, price, image, productId }: ProductHeaderProps) {
    return (
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-3 flex items-center justify-between shadow-sm z-10 sticky top-0">
            <div className="flex items-center gap-3">
                <div
                    onClick={() => window.open(`/products/${productId}`, '_blank')}
                    className="relative w-12 h-12 bg-gray-100 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 cursor-pointer hover:opacity-80 transition"
                >
                    {image ? (
                        <Image
                            src={image}
                            alt={title}
                            fill
                            className="object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <Tag className="w-6 h-6" />
                        </div>
                    )}
                </div>
                <div
                    onClick={() => window.open(`/products/${productId}`, '_blank')}
                    className="cursor-pointer group"
                >
                    <h3 className="font-medium text-gray-900 dark:text-white text-sm line-clamp-1 max-w-[200px] sm:max-w-md group-hover:text-purple-600 transition">
                        {title}
                    </h3>
                    <p className="text-purple-600 dark:text-purple-400 font-bold text-sm">
                        ฿{price.toLocaleString()}
                    </p>
                </div>
            </div>

            {/* Removed "View Product" button as requested */}
        </div>
    );
}
