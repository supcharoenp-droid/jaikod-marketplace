/**
 * Test Data Hook
 * Hook สำหรับใช้ข้อมูลทดสอบในโหมด Development
 */

'use client';

import { useState, useEffect } from 'react';
import sampleProducts from '@/data/sample-products.json';

export interface Product {
    id: string;
    categoryId: string;
    name: string;
    description: string;
    price: number;
    originalPrice?: number;
    condition: string;
    attributes: Record<string, any>;
    images: string[];
    location: {
        province: string;
        district: string;
        subdistrict: string;
        postalCode: string;
    };
    tags: string[];
}

/**
 * Hook สำหรับดึงข้อมูลสินค้า (รองรับทั้ง Test Mode และ Production)
 */
export function useProducts(options?: {
    categoryId?: string;
    limit?: number;
    testMode?: boolean;
}) {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);

                // ตรวจสอบว่าอยู่ใน Test Mode หรือไม่
                const isTestMode = options?.testMode ?? process.env.NODE_ENV === 'development';

                if (isTestMode) {
                    // ใช้ข้อมูลทดสอบ
                    console.log('🧪 Using test data from sample-products.json');

                    let filteredProducts = sampleProducts.products as Product[];

                    // กรองตามหมวดหมู่ (ถ้ามี)
                    if (options?.categoryId) {
                        filteredProducts = filteredProducts.filter(
                            p => p.categoryId === options.categoryId
                        );
                    }

                    // จำกัดจำนวน (ถ้ามี)
                    if (options?.limit) {
                        filteredProducts = filteredProducts.slice(0, options.limit);
                    }

                    // จำลองการโหลดข้อมูล (300ms)
                    await new Promise(resolve => setTimeout(resolve, 300));

                    setProducts(filteredProducts);
                } else {
                    // TODO: ดึงข้อมูลจาก Firebase จริง
                    console.log('🔥 Fetching from Firebase...');

                    // const response = await fetch('/api/products', {
                    //   method: 'POST',
                    //   body: JSON.stringify({ categoryId: options?.categoryId })
                    // });
                    // const data = await response.json();
                    // setProducts(data.products);

                    setProducts([]);
                }

                setError(null);
            } catch (err) {
                console.error('Error fetching products:', err);
                setError(err as Error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [options?.categoryId, options?.limit, options?.testMode]);

    return { products, loading, error };
}

/**
 * Hook สำหรับดึงสินค้า 1 รายการ
 */
export function useProduct(productId: string, testMode?: boolean) {
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);

                const isTestMode = testMode ?? process.env.NODE_ENV === 'development';

                if (isTestMode) {
                    console.log(`🧪 Loading test product: ${productId}`);

                    const foundProduct = sampleProducts.products.find(
                        p => p.id === productId
                    ) as Product | undefined;

                    // จำลองการโหลด
                    await new Promise(resolve => setTimeout(resolve, 200));

                    setProduct(foundProduct || null);
                } else {
                    // TODO: ดึงจาก Firebase
                    console.log(`🔥 Fetching product ${productId} from Firebase...`);
                    setProduct(null);
                }

                setError(null);
            } catch (err) {
                console.error('Error fetching product:', err);
                setError(err as Error);
            } finally {
                setLoading(false);
            }
        };

        if (productId) {
            fetchProduct();
        }
    }, [productId, testMode]);

    return { product, loading, error };
}

/**
 * Hook สำหรับค้นหาสินค้า
 */
export function useSearchProducts(query: string, testMode?: boolean) {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const searchProducts = async () => {
            if (!query || query.length < 2) {
                setProducts([]);
                return;
            }

            setLoading(true);

            const isTestMode = testMode ?? process.env.NODE_ENV === 'development';

            if (isTestMode) {
                console.log(`🔍 Searching test data: "${query}"`);

                const lowerQuery = query.toLowerCase();
                const results = sampleProducts.products.filter(p => {
                    return (
                        p.name.toLowerCase().includes(lowerQuery) ||
                        p.description.toLowerCase().includes(lowerQuery) ||
                        p.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
                    );
                }) as Product[];

                // จำลองการค้นหา
                await new Promise(resolve => setTimeout(resolve, 300));

                setProducts(results);
            } else {
                // TODO: ค้นหาจาก Firebase
                setProducts([]);
            }

            setLoading(false);
        };

        searchProducts();
    }, [query, testMode]);

    return { products, loading };
}

/**
 * ฟังก์ชันสำหรับดึงสถิติ
 */
export function getProductStats(testMode?: boolean) {
    const isTestMode = testMode ?? process.env.NODE_ENV === 'development';

    if (isTestMode) {
        const products = sampleProducts.products;

        return {
            total: products.length,
            byCategory: {
                mobiles: products.filter(p => p.categoryId === 'mobiles').length,
                computers: products.filter(p => p.categoryId === 'computers').length,
                pets: products.filter(p => p.categoryId === 'pets').length,
                cameras: products.filter(p => p.categoryId === 'cameras').length,
            },
            totalValue: products.reduce((sum, p) => sum + p.price, 0),
            averagePrice: products.reduce((sum, p) => sum + p.price, 0) / products.length,
        };
    }

    return {
        total: 0,
        byCategory: {},
        totalValue: 0,
        averagePrice: 0,
    };
}
