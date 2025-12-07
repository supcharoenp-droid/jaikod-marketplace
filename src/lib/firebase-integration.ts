/**
 * Firebase Integration Service
 * บริการเชื่อมต่อ Firebase/Firestore พร้อม Feature Flag
 */

import { db } from './firebase';
import {
    collection,
    doc,
    getDoc,
    getDocs,
    setDoc,
    updateDoc,
    deleteDoc,
    query,
    where,
    orderBy,
    limit,
    Timestamp,
    GeoPoint
} from 'firebase/firestore';

// ========================================
// Feature Flag Configuration
// ========================================

export interface FirebaseFeatureConfig {
    enabled: boolean;
    useRealtime: boolean;  // ใช้ Realtime Database หรือไม่
    cacheEnabled: boolean; // เปิด Cache หรือไม่
    offlineMode: boolean;  // รองรับ Offline หรือไม่
}

export const DEFAULT_FIREBASE_CONFIG: FirebaseFeatureConfig = {
    enabled: true,
    useRealtime: false,
    cacheEnabled: true,
    offlineMode: true
};

// ========================================
// Product Service
// ========================================

export interface Product {
    id: string;
    title: string;
    description: string;
    price: number;
    category: string;
    images: string[];
    location: {
        province: string;
        district: string;
        subdistrict: string;
        latitude?: number;
        longitude?: number;
    };
    seller: {
        id: string;
        name: string;
        rating: number;
    };
    condition: string;
    status: 'active' | 'sold' | 'inactive';
    createdAt: Date;
    updatedAt: Date;
}

/**
 * ดึงสินค้าทั้งหมด
 */
export async function getAllProducts(
    config: FirebaseFeatureConfig = DEFAULT_FIREBASE_CONFIG
): Promise<Product[]> {
    if (!config.enabled) {
        console.warn('Firebase is disabled');
        return [];
    }

    try {
        const productsRef = collection(db, 'products');
        const q = query(productsRef, where('status', '==', 'active'), orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(q);

        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt?.toDate(),
            updatedAt: doc.data().updatedAt?.toDate()
        })) as Product[];
    } catch (error) {
        console.error('Error fetching products:', error);
        return [];
    }
}

/**
 * ดึงสินค้าตาม ID
 */
export async function getProductById(
    productId: string,
    config: FirebaseFeatureConfig = DEFAULT_FIREBASE_CONFIG
): Promise<Product | null> {
    if (!config.enabled) {
        console.warn('Firebase is disabled');
        return null;
    }

    try {
        const productRef = doc(db, 'products', productId);
        const snapshot = await getDoc(productRef);

        if (!snapshot.exists()) {
            return null;
        }

        return {
            id: snapshot.id,
            ...snapshot.data(),
            createdAt: snapshot.data().createdAt?.toDate(),
            updatedAt: snapshot.data().updatedAt?.toDate()
        } as Product;
    } catch (error) {
        console.error('Error fetching product:', error);
        return null;
    }
}

/**
 * สร้างสินค้าใหม่
 */
export async function createProduct(
    product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>,
    config: FirebaseFeatureConfig = DEFAULT_FIREBASE_CONFIG
): Promise<string | null> {
    if (!config.enabled) {
        console.warn('Firebase is disabled');
        return null;
    }

    try {
        const productRef = doc(collection(db, 'products'));
        const now = Timestamp.now();

        await setDoc(productRef, {
            ...product,
            // แปลง location เป็น GeoPoint ถ้ามี
            location: product.location.latitude && product.location.longitude ? {
                ...product.location,
                geopoint: new GeoPoint(product.location.latitude, product.location.longitude)
            } : product.location,
            createdAt: now,
            updatedAt: now
        });

        return productRef.id;
    } catch (error) {
        console.error('Error creating product:', error);
        return null;
    }
}

/**
 * อัพเดทสินค้า
 */
export async function updateProduct(
    productId: string,
    updates: Partial<Product>,
    config: FirebaseFeatureConfig = DEFAULT_FIREBASE_CONFIG
): Promise<boolean> {
    if (!config.enabled) {
        console.warn('Firebase is disabled');
        return false;
    }

    try {
        const productRef = doc(db, 'products', productId);
        await updateDoc(productRef, {
            ...updates,
            updatedAt: Timestamp.now()
        });
        return true;
    } catch (error) {
        console.error('Error updating product:', error);
        return false;
    }
}

/**
 * ลบสินค้า
 */
export async function deleteProduct(
    productId: string,
    config: FirebaseFeatureConfig = DEFAULT_FIREBASE_CONFIG
): Promise<boolean> {
    if (!config.enabled) {
        console.warn('Firebase is disabled');
        return false;
    }

    try {
        const productRef = doc(db, 'products', productId);
        await deleteDoc(productRef);
        return true;
    } catch (error) {
        console.error('Error deleting product:', error);
        return false;
    }
}

/**
 * ค้นหาสินค้าตามพื้นที่
 */
export async function searchProductsByLocation(
    province: string,
    config: FirebaseFeatureConfig = DEFAULT_FIREBASE_CONFIG
): Promise<Product[]> {
    if (!config.enabled) {
        console.warn('Firebase is disabled');
        return [];
    }

    try {
        const productsRef = collection(db, 'products');
        const q = query(
            productsRef,
            where('location.province', '==', province),
            where('status', '==', 'active'),
            orderBy('createdAt', 'desc')
        );
        const snapshot = await getDocs(q);

        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt?.toDate(),
            updatedAt: doc.data().updatedAt?.toDate()
        })) as Product[];
    } catch (error) {
        console.error('Error searching products:', error);
        return [];
    }
}

// ========================================
// Admin Configuration
// ========================================

/**
 * บันทึกการตั้งค่า Firebase
 */
export async function saveFirebaseConfig(
    config: FirebaseFeatureConfig
): Promise<boolean> {
    try {
        const configRef = doc(db, 'system_config', 'firebase');
        await setDoc(configRef, config);
        return true;
    } catch (error) {
        console.error('Error saving Firebase config:', error);
        return false;
    }
}

/**
 * ดึงการตั้งค่า Firebase
 */
export async function getFirebaseConfig(): Promise<FirebaseFeatureConfig> {
    try {
        const configRef = doc(db, 'system_config', 'firebase');
        const snapshot = await getDoc(configRef);

        if (snapshot.exists()) {
            return snapshot.data() as FirebaseFeatureConfig;
        }
    } catch (error) {
        console.error('Error fetching Firebase config:', error);
    }

    return DEFAULT_FIREBASE_CONFIG;
}
