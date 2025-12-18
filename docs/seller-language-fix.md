# วิธีแก้ปัญหาหน้า Seller Centre ยังเป็นภาษาอังกฤษ

## ปัญหา
- เมนู Sidebar เป็นภาษาไทย
- แต่เนื้อหาภายในหน้ายังเป็นภาษาอังกฤษ
- หน้าที่มีปัญหา: `/seller/orders`, `/seller/products`, `/seller/marketing`, etc.

## สาเหตุ
หน้าเหล่านี้ไม่ได้ใช้ `useLanguage()` hook และมีข้อความ hardcode เป็นภาษาอังกฤษ

## วิธีแก้ไข

### ขั้นตอนที่ 1: เพิ่มคำแปลใน `src/i18n/locales.ts`

เพิ่มในส่วน `seller_orders`:

```typescript
// ใน translations.en
seller_orders: {
  title: 'Order Management',
  subtitle: 'Manage and track your customer orders',
  generate_demo: 'Generate Demo Orders',
  batch_print: 'Batch Print',
  
  // Tabs
  tab_all: 'All Orders',
  tab_pending: 'Pending Payment',
  tab_paid: 'To Ship',
  tab_shipping: 'Shipping',
  tab_completed: 'Completed',
  tab_cancelled: 'Cancelled',
  
  // Search
  search_placeholder: 'Search by Order ID, Product...',
  filter_date: 'Filter Date',
  
  // Status
  status_pending: 'Waiting Payment',
  status_paid: 'To Ship',
  status_shipping: 'Shipping',
  status_completed: 'Completed',
  status_cancelled: 'Cancelled',
  
  // Actions
  arrange_shipment: 'Arrange Shipment',
  print_label: 'Print Label',
  mark_delivered: 'Mark Delivered',
  view_details: 'View Details',
  
  // Empty state
  no_orders: 'No Orders Found',
  no_orders_desc: 'Try adjusting your filters or wait for new sales!',
  
  // AI
  ai_fulfillment: 'AI Fulfillment Tip',
  ai_recommended_package: 'Recommended Package',
  ai_cod_label: 'Remember to attach COD red label',
  ai_standard_label: 'Standard shipping label ready',
  
  // Order details
  total_amount: 'Total Amount',
  via: 'Via'
},

// ใน translations.th
seller_orders: {
  title: 'จัดการคำสั่งซื้อ',
  subtitle: 'จัดการและติดตามคำสั่งซื้อของลูกค้า',
  generate_demo: 'สร้างคำสั่งซื้อทดสอบ',
  batch_print: 'พิมพ์เป็นชุด',
  
  // Tabs
  tab_all: 'ทั้งหมด',
  tab_pending: 'รอชำระเงิน',
  tab_paid: 'รอจัดส่ง',
  tab_shipping: 'กำลังจัดส่ง',
  tab_completed: 'สำเร็จ',
  tab_cancelled: 'ยกเลิก',
  
  // Search
  search_placeholder: 'ค้นหาด้วยหมายเลขคำสั่งซื้อ, สินค้า...',
  filter_date: 'กรองตามวันที่',
  
  // Status
  status_pending: 'รอชำระเงิน',
  status_paid: 'รอจัดส่ง',
  status_shipping: 'กำลังจัดส่ง',
  status_completed: 'สำเร็จ',
  status_cancelled: 'ยกเลิก',
  
  // Actions
  arrange_shipment: 'จัดส่งสินค้า',
  print_label: 'พิมพ์ใบปะหน้า',
  mark_delivered: 'ยืนยันจัดส่งแล้ว',
  view_details: 'ดูรายละเอียด',
  
  // Empty state
  no_orders: 'ไม่พบคำสั่งซื้อ',
  no_orders_desc: 'ลองปรับตัวกรองหรือรอคำสั่งซื้อใหม่',
  
  // AI
  ai_fulfillment: 'AI แนะนำการจัดส่ง',
  ai_recommended_package: 'ขนาดกล่องแนะนำ',
  ai_cod_label: 'อย่าลืมติดสติกเกอร์ COD สีแดง',
  ai_standard_label: 'ใบปะหน้าพร้อมแล้ว',
  
  // Order details
  total_amount: 'ยอดรวม',
  via: 'ผ่าน'
}
```

### ขั้นตอนที่ 2: แก้ไขหน้า `/seller/orders/page.tsx`

```typescript
'use client'

import { useLanguage } from '@/contexts/LanguageContext'

export default function SellerOrdersPage() {
    const { t } = useLanguage()  // เพิ่มบรรทัดนี้
    
    // แทนที่ข้อความทั้งหมดด้วย t()
    return (
        <div>
            <h1>{t('seller_orders.title')}</h1>
            <p>{t('seller_orders.subtitle')}</p>
            
            {/* Tabs */}
            <button>{t('seller_orders.tab_all')}</button>
            <button>{t('seller_orders.tab_pending')}</button>
            
            {/* Search */}
            <input placeholder={t('seller_orders.search_placeholder')} />
            
            {/* Actions */}
            <Button>{t('seller_orders.arrange_shipment')}</Button>
        </div>
    )
}
```

### ขั้นตอนที่ 3: ทำซ้ำกับหน้าอื่น ๆ

ทำเหมือนกันกับ:
- `/seller/products/page.tsx`
- `/seller/marketing/page.tsx`
- `/seller/finance/page.tsx`
- `/seller/reports/page.tsx`

## ตัวอย่างการใช้งาน

```typescript
// แทนที่
<h1>Order Management</h1>

// ด้วย
<h1>{t('seller_orders.title')}</h1>

// แทนที่
<button>Arrange Shipment</button>

// ด้วย
<button>{t('seller_orders.arrange_shipment')}</button>
```

## เช็คลิสต์

- [ ] เพิ่มคำแปลใน `locales.ts`
- [ ] เพิ่ม `const { t } = useLanguage()` ในทุกหน้า
- [ ] แทนที่ข้อความ hardcode ทั้งหมดด้วย `t()`
- [ ] ทดสอบเปลี่ยนภาษาใน `/profile/settings`
- [ ] ตรวจสอบทุกหน้าว่าเป็นภาษาไทย

## หมายเหตุ

เนื่องจากมีหลายหน้าที่ต้องแก้ไข ผมแนะนำให้:
1. แก้ไขทีละหน้า
2. ทดสอบแต่ละหน้าหลังแก้ไข
3. ใช้ Find & Replace เพื่อความรวดเร็ว

หรือถ้าต้องการให้ผมแก้ไขให้ทั้งหมด กรุณาบอกหน้าไหนก่อนครับ
