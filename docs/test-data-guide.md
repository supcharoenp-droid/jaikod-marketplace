# 🧪 คู่มือการใช้งาน Test Data

> วิธีใช้ข้อมูลทดสอบสำหรับพัฒนาและทดสอบระบบ

---

## 📦 ไฟล์ที่สร้าง

```
jaikod/
├── test-data/
│   └── sample-products.json          # ข้อมูลสินค้าทดสอบ 10 รายการ
├── src/
│   ├── hooks/
│   │   └── useTestData.ts            # Custom Hooks สำหรับใช้ข้อมูลทดสอบ
│   └── app/
│       └── test-data-example/
│           └── page.tsx              # หน้าตัวอย่างการใช้งาน
```

---

## 🚀 วิธีใช้งาน

### 1. เปิดหน้าตัวอย่าง

```bash
# เปิดเบราว์เซอร์ไปที่
http://localhost:3000/test-data-example
```

คุณจะเห็น:
- ✅ สถิติสินค้า
- ✅ ฟอร์มค้นหา
- ✅ สินค้าตามหมวดหมู่
- ✅ รายละเอียดสินค้า
- ✅ สินค้าทั้งหมด

---

### 2. ใช้ใน Component ของคุณ

#### ตัวอย่าง 1: แสดงสินค้าทั้งหมด

```typescript
'use client';

import { useProducts } from '@/hooks/useTestData';

export default function ProductList() {
  const { products, loading } = useProducts({
    testMode: true // เปิด Test Mode
  });

  if (loading) return <div>กำลังโหลด...</div>;

  return (
    <div className="grid grid-cols-4 gap-4">
      {products.map(product => (
        <div key={product.id} className="border p-4">
          <img src={product.images[0]} alt={product.name} />
          <h3>{product.name}</h3>
          <p>฿{product.price.toLocaleString()}</p>
        </div>
      ))}
    </div>
  );
}
```

---

#### ตัวอย่าง 2: แสดงสินค้าตามหมวดหมู่

```typescript
import { useProducts } from '@/hooks/useTestData';

export default function MobileProducts() {
  const { products, loading } = useProducts({
    categoryId: 'mobiles', // กรองเฉพาะโทรศัพท์
    limit: 5,              // จำกัด 5 รายการ
    testMode: true
  });

  return (
    <div>
      <h2>โทรศัพท์มือถือ</h2>
      {products.map(product => (
        <div key={product.id}>{product.name}</div>
      ))}
    </div>
  );
}
```

---

#### ตัวอย่าง 3: แสดงรายละเอียดสินค้า

```typescript
import { useProduct } from '@/hooks/useTestData';

export default function ProductDetail({ productId }: { productId: string }) {
  const { product, loading } = useProduct(productId, true);

  if (loading) return <div>กำลังโหลด...</div>;
  if (!product) return <div>ไม่พบสินค้า</div>;

  return (
    <div>
      <h1>{product.name}</h1>
      <p>฿{product.price.toLocaleString()}</p>
      <p>{product.description}</p>
      
      <h3>คุณสมบัติ:</h3>
      <ul>
        {Object.entries(product.attributes).map(([key, value]) => (
          <li key={key}>{key}: {value}</li>
        ))}
      </ul>
    </div>
  );
}
```

---

#### ตัวอย่าง 4: ค้นหาสินค้า

```typescript
'use client';

import { useState } from 'react';
import { useSearchProducts } from '@/hooks/useTestData';

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const { products, loading } = useSearchProducts(query, true);

  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="ค้นหาสินค้า..."
      />
      
      {loading && <p>กำลังค้นหา...</p>}
      
      <div>
        {products.map(product => (
          <div key={product.id}>{product.name}</div>
        ))}
      </div>
    </div>
  );
}
```

---

#### ตัวอย่าง 5: แสดงสถิติ

```typescript
import { getProductStats } from '@/hooks/useTestData';

export default function Dashboard() {
  const stats = getProductStats(true);

  return (
    <div className="grid grid-cols-4 gap-4">
      <div>
        <h3>สินค้าทั้งหมด</h3>
        <p>{stats.total}</p>
      </div>
      <div>
        <h3>โทรศัพท์</h3>
        <p>{stats.byCategory.mobiles}</p>
      </div>
      <div>
        <h3>คอมพิวเตอร์</h3>
        <p>{stats.byCategory.computers}</p>
      </div>
      <div>
        <h3>ราคาเฉลี่ย</h3>
        <p>฿{stats.averagePrice.toLocaleString()}</p>
      </div>
    </div>
  );
}
```

---

## 🎛️ การสลับระหว่าง Test Mode และ Production

### วิธีที่ 1: ใช้ Environment Variable

```typescript
// .env.local
NEXT_PUBLIC_TEST_MODE=true
```

```typescript
// ใน Component
const { products } = useProducts({
  testMode: process.env.NEXT_PUBLIC_TEST_MODE === 'true'
});
```

---

### วิธีที่ 2: ใช้ Config

```typescript
// src/config/app.ts
export const appConfig = {
  testMode: process.env.NODE_ENV === 'development'
};
```

```typescript
// ใน Component
import { appConfig } from '@/config/app';

const { products } = useProducts({
  testMode: appConfig.testMode
});
```

---

### วิธีที่ 3: ใช้ Admin Panel

```typescript
// Admin สามารถเปิด/ปิด Test Mode
const [testMode, setTestMode] = useState(false);

const { products } = useProducts({
  testMode: testMode
});
```

---

## 📊 ข้อมูลที่มีใน Test Data

### สินค้าทั้งหมด: 10 รายการ

**📱 โทรศัพท์ (3 รายการ):**
1. iPhone 14 Pro 256GB - ฿36,800
2. Samsung Galaxy S23 Ultra 512GB - ฿38,900
3. Xiaomi 13 Pro 256GB - ฿25,900

**💻 คอมพิวเตอร์ (3 รายการ):**
4. MacBook Air M2 16GB/512GB - ฿42,900
5. ASUS ROG Strix G16 - ฿65,900
6. iPad Pro 12.9" M2 256GB - ฿42,900

**🐾 สัตว์เลี้ยง (2 รายการ):**
7. ลูกแมวเปอร์เซีย - ฿8,500
8. ลูกสุนัขชิบะ - ฿15,000

**📷 กล้อง (2 รายการ):**
9. Canon EOS R6 Mark II - ฿89,900
10. Sony A7 IV + Lens - ฿75,900

---

## 🔧 API Reference

### useProducts()

```typescript
const { products, loading, error } = useProducts(options);
```

**Options:**
- `categoryId?: string` - กรองตามหมวดหมู่
- `limit?: number` - จำกัดจำนวน
- `testMode?: boolean` - เปิด/ปิด Test Mode

**Returns:**
- `products: Product[]` - รายการสินค้า
- `loading: boolean` - สถานะการโหลด
- `error: Error | null` - ข้อผิดพลาด (ถ้ามี)

---

### useProduct()

```typescript
const { product, loading, error } = useProduct(productId, testMode);
```

**Parameters:**
- `productId: string` - ID ของสินค้า
- `testMode?: boolean` - เปิด/ปิด Test Mode

**Returns:**
- `product: Product | null` - ข้อมูลสินค้า
- `loading: boolean` - สถานะการโหลด
- `error: Error | null` - ข้อผิดพลาด (ถ้ามี)

---

### useSearchProducts()

```typescript
const { products, loading } = useSearchProducts(query, testMode);
```

**Parameters:**
- `query: string` - คำค้นหา
- `testMode?: boolean` - เปิด/ปิด Test Mode

**Returns:**
- `products: Product[]` - ผลการค้นหา
- `loading: boolean` - สถานะการค้นหา

---

### getProductStats()

```typescript
const stats = getProductStats(testMode);
```

**Parameters:**
- `testMode?: boolean` - เปิด/ปิด Test Mode

**Returns:**
```typescript
{
  total: number;
  byCategory: {
    mobiles: number;
    computers: number;
    pets: number;
    cameras: number;
  };
  totalValue: number;
  averagePrice: number;
}
```

---

## 💡 Tips & Best Practices

### ✅ ควรทำ

1. **ใช้ Test Mode ใน Development**
   ```typescript
   testMode: process.env.NODE_ENV === 'development'
   ```

2. **เพิ่มข้อมูลทดสอบเพิ่มเติม**
   - แก้ไขไฟล์ `test-data/sample-products.json`
   - เพิ่มสินค้าใหม่ตามต้องการ

3. **ทดสอบทุก Edge Case**
   - สินค้าไม่มีรูป
   - ราคา 0 บาท
   - ข้อมูลไม่ครบ

---

### ❌ ไม่ควรทำ

1. **อย่าใช้ Test Mode ใน Production**
   ```typescript
   // ❌ ไม่ดี
   testMode: true

   // ✅ ดี
   testMode: process.env.NODE_ENV === 'development'
   ```

2. **อย่า Commit ข้อมูลจริงใน Test Data**
   - ใช้ข้อมูลปลอมเท่านั้น
   - ไม่ใส่ข้อมูลส่วนตัว

3. **อย่าลืม Switch เป็น Production**
   - ก่อน Deploy ต้องปิด Test Mode
   - ตรวจสอบ Environment Variables

---

## 🎯 สรุป

### ข้อดีของการใช้ Test Data:

✅ **พัฒนาเร็วขึ้น**
- ไม่ต้องรอ API
- ไม่ต้องโพสข้อมูลจริง

✅ **ทดสอบง่ายขึ้น**
- ข้อมูลคงที่
- Reproducible

✅ **ประหยัดค่าใช้จ่าย**
- ไม่กิน Firebase Quota
- ไม่เสีย API Cost

✅ **ปลอดภัย**
- ไม่มีข้อมูลจริง
- ไม่กระทบ Production

---

**Happy Testing! 🚀**

*Last Updated: 2024-12-07*
