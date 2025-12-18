'use client';

import { useState, useEffect } from 'react';
import { Tag, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { getProductsBySeller } from '@/lib/products';
import { type Product } from '@/types';

interface SellerProductsProps {
    sellerId?: string;
}

export default function SellerProducts({ sellerId }: SellerProductsProps) {
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchProducts = async () => {
            if (!sellerId) return;

            setIsLoading(true);
            try {
                // Fetch products (limit 3-5 is usually good for sidebar)
                const allProducts = await getProductsBySeller(sellerId);
                setProducts(allProducts.slice(0, 3));
            } catch (error) {
                console.error("Error fetching seller products:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProducts();
    }, [sellerId]);

    if (!sellerId) return null;

    if (isLoading) {
        return (
            <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-center">
                <Loader2 className="w-5 h-5 text-purple-600 animate-spin" />
            </div>
        );
    }

    if (products.length === 0) return null;

    return (
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2 text-sm">
                <Tag className="w-4 h-4 text-purple-600" />
                สินค้าอื่นของร้านนี้
            </h4>

            <div className="space-y-3">
                {products.map((product) => (
                    <div
                        key={product.id}
                        className="flex gap-3 group cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 p-2 rounded-lg transition"
                        onClick={() => window.open(`/product/${product.id}`, '_blank')}
                    >
                        <div className="relative w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-md overflow-hidden shrink-0">
                            {product.images && product.images.length > 0 ? (
                                <Image
                                    src={typeof product.images[0] === 'string' ? product.images[0] : product.images[0].url}
                                    alt={product.title}
                                    fill
                                    className="object-cover group-hover:scale-105 transition duration-300"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800 text-gray-400">
                                    <Tag className="w-5 h-5 opacity-50" />
                                </div>
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <h5 className="text-sm font-medium text-gray-900 dark:text-white truncate group-hover:text-purple-600 transition">
                                {product.title}
                            </h5>
                            <p className="text-purple-600 dark:text-purple-400 font-bold text-xs mt-0.5">
                                ฿{product.price.toLocaleString()}
                            </p>
                        </div>
                    </div>
                ))}

                <button
                    onClick={() => window.open(`/shop/${sellerId}`, '_blank')}
                    className="w-full mt-2 text-xs text-center text-gray-500 hover:text-purple-600 transition"
                >
                    ดูทั้งหมด
                </button>
            </div>
        </div>
    );
}
