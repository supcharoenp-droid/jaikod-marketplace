export interface StoreTheme {
    id: string
    name: string
    primaryColor: string
    secondaryColor: string
    coverLayout: 'full' | 'split' | 'minimal'
    productCardStyle: 'standard' | 'minimal' | 'prominent'
}

export const STORE_THEMES: StoreTheme[] = [
    { id: 'default', name: 'JaiKod Standard', primaryColor: '#7C3AED', secondaryColor: '#DB2777', coverLayout: 'full', productCardStyle: 'standard' },
    { id: 'modern_dark', name: 'Midnight Pro', primaryColor: '#111827', secondaryColor: '#3B82F6', coverLayout: 'minimal', productCardStyle: 'minimal' },
    { id: 'vibrant_sale', name: 'Flash Sale Red', primaryColor: '#EF4444', secondaryColor: '#F59E0B', coverLayout: 'split', productCardStyle: 'prominent' },
    { id: 'eco_green', name: 'Organic Green', primaryColor: '#10B981', secondaryColor: '#059669', coverLayout: 'full', productCardStyle: 'standard' }
]

export interface ShopCoupon {
    id: string
    code: string
    description: string
    discountAmount: number
    discountType: 'percent' | 'fixed'
    minSpend: number
    expiryDate: string
}

export interface OfficialStoreData {
    sellerId: string
    themeId: string
    customCategories: { id: string, name: string }[]
    featuredProductIds: string[]
    banners: { imageUrl: string, link: string }[]
    coupons: ShopCoupon[]
}
