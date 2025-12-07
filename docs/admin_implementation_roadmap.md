# Admin System - Implementation Roadmap

## 🎯 Phase 1: Real Data Integration (1-2 วัน)

### Task 1.1: User Management - Real Data
**File:** `src/app/admin/users/page.tsx`

**Before (Mock):**
```typescript
const [users, setUsers] = useState<User[]>([])

useEffect(() => {
  setTimeout(() => {
    setUsers([/* mock data */])
  }, 500)
}, [])
```

**After (Real):**
```typescript
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore'
import { db } from '@/lib/firebase'

const fetchUsers = async () => {
  setLoading(true)
  try {
    const q = query(
      collection(db, 'users'),
      orderBy('created_at', 'desc')
    )
    const snapshot = await getDocs(q)
    const usersData = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      created_at: doc.data().created_at?.toDate(),
      last_login: doc.data().last_login?.toDate()
    })) as User[]
    
    setUsers(usersData)
  } catch (error) {
    console.error('Error fetching users:', error)
  } finally {
    setLoading(false)
  }
}
```

---

### Task 1.2: Seller Management - Real Data
**File:** `src/app/admin/sellers/page.tsx`

```typescript
const fetchSellers = async () => {
  setLoading(true)
  try {
    const q = query(
      collection(db, 'seller_profiles'),
      orderBy('created_at', 'desc')
    )
    const snapshot = await getDocs(q)
    const sellersData = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Seller[]
    
    setSellers(sellersData)
  } catch (error) {
    console.error('Error fetching sellers:', error)
  } finally {
    setLoading(false)
  }
}
```

---

### Task 1.3: Product Management - Real Data
**File:** `src/app/admin/products/page.tsx`

```typescript
const fetchProducts = async () => {
  setLoading(true)
  try {
    const q = query(
      collection(db, 'products'),
      orderBy('created_at', 'desc'),
      limit(50)
    )
    const snapshot = await getDocs(q)
    const productsData = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Product[]
    
    setProducts(productsData)
  } catch (error) {
    console.error('Error fetching products:', error)
  } finally {
    setLoading(false)
  }
}
```

---

### Task 1.4: Dashboard Stats - Real Data
**File:** `src/app/admin/page.tsx`

```typescript
const fetchStats = async () => {
  setLoading(true)
  try {
    // Count users
    const usersSnapshot = await getDocs(collection(db, 'users'))
    const totalUsers = usersSnapshot.size
    
    // Count sellers
    const sellersSnapshot = await getDocs(collection(db, 'seller_profiles'))
    const totalSellers = sellersSnapshot.size
    
    // Count products
    const productsSnapshot = await getDocs(collection(db, 'products'))
    const totalProducts = productsSnapshot.size
    
    // Count orders
    const ordersSnapshot = await getDocs(collection(db, 'orders'))
    const totalOrders = ordersSnapshot.size
    
    // Calculate GMV
    const orders = ordersSnapshot.docs.map(doc => doc.data())
    const gmv = orders.reduce((sum, order) => sum + (order.total_price || 0), 0)
    
    setStats({
      total_users: totalUsers,
      total_sellers: totalSellers,
      total_products: totalProducts,
      total_orders: totalOrders,
      gmv: gmv,
      // ... other stats
    })
  } catch (error) {
    console.error('Error fetching stats:', error)
  } finally {
    setLoading(false)
  }
}
```

---

## 🔌 Phase 2: API Endpoints (2-3 วัน)

### Task 2.1: Create API Routes Structure
```
src/app/api/admin/
├── users/
│   ├── route.ts           # GET all users
│   ├── [id]/
│   │   ├── route.ts       # GET, PATCH, DELETE user
│   │   ├── ban/route.ts   # POST ban user
│   │   └── unban/route.ts # POST unban user
├── sellers/
│   ├── route.ts
│   ├── [id]/
│   │   ├── kyc/
│   │   │   ├── approve/route.ts
│   │   │   └── reject/route.ts
│   │   └── suspend/route.ts
├── products/
│   ├── route.ts
│   ├── [id]/
│   │   ├── approve/route.ts
│   │   ├── reject/route.ts
│   │   └── suspend/route.ts
└── finance/
    └── withdrawals/
        ├── route.ts
        └── [id]/
            ├── approve/route.ts
            └── reject/route.ts
```

---

### Task 2.2: Authentication Middleware
**File:** `src/middleware/adminAuth.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { getAuth } from 'firebase-admin/auth'
import { getFirestore } from 'firebase-admin/firestore'
import { initAdmin } from '@/lib/firebase-admin'

export async function verifyAdmin(request: NextRequest) {
  try {
    // Get token from header
    const token = request.headers.get('authorization')?.split('Bearer ')[1]
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    // Verify token
    initAdmin()
    const auth = getAuth()
    const decodedToken = await auth.verifyIdToken(token)
    
    // Check if user is admin
    const db = getFirestore()
    const adminDoc = await db.collection('admins').doc(decodedToken.uid).get()
    
    if (!adminDoc.exists || !adminDoc.data()?.is_active) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
    
    // Return admin data
    return {
      uid: decodedToken.uid,
      email: decodedToken.email,
      role: adminDoc.data()?.role,
      permissions: adminDoc.data()?.permissions || []
    }
  } catch (error) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
}
```

---

### Task 2.3: Example API Route - Ban User
**File:** `src/app/api/admin/users/[id]/ban/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { verifyAdmin } from '@/middleware/adminAuth'
import { getFirestore } from 'firebase-admin/firestore'
import { getAuth } from 'firebase-admin/auth'
import { canPerform } from '@/lib/rbac'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // Verify admin
  const admin = await verifyAdmin(request)
  if (admin instanceof NextResponse) return admin
  
  // Check permission
  if (!canPerform({ role: admin.role } as any, 'users.ban')) {
    return NextResponse.json({ error: 'Permission denied' }, { status: 403 })
  }
  
  try {
    const userId = params.id
    const { reason } = await request.json()
    
    // Update Firestore
    const db = getFirestore()
    await db.collection('users').doc(userId).update({
      is_banned: true,
      banned_at: new Date(),
      banned_by: admin.uid,
      ban_reason: reason
    })
    
    // Disable in Auth
    const auth = getAuth()
    await auth.updateUser(userId, { disabled: true })
    
    // Log activity
    await db.collection('admin_activity_logs').add({
      admin_id: admin.uid,
      admin_email: admin.email,
      action: 'ban_user',
      target_type: 'user',
      target_id: userId,
      details: reason,
      timestamp: new Date()
    })
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error banning user:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
```

---

## 📝 Phase 3: Activity Logging (1 วัน)

### Task 3.1: Create Logging Service
**File:** `src/lib/admin-logger.ts`

```typescript
import { db } from '@/lib/firebase'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'

export interface ActivityLog {
  admin_id: string
  admin_name: string
  admin_email: string
  action: string
  target_type: 'user' | 'seller' | 'product' | 'order' | 'system'
  target_id?: string
  details: string
  ip_address?: string
  user_agent?: string
  timestamp: Date
}

export async function logAdminActivity(log: Omit<ActivityLog, 'timestamp'>) {
  try {
    await addDoc(collection(db, 'admin_activity_logs'), {
      ...log,
      timestamp: serverTimestamp()
    })
  } catch (error) {
    console.error('Error logging activity:', error)
  }
}

// Usage
import { logAdminActivity } from '@/lib/admin-logger'

await logAdminActivity({
  admin_id: adminUser.id,
  admin_name: adminUser.displayName,
  admin_email: adminUser.email,
  action: 'ban_user',
  target_type: 'user',
  target_id: userId,
  details: `Banned user for: ${reason}`
})
```

---

### Task 3.2: Activity Logs Viewer
**File:** `src/app/admin/system/logs/page.tsx`

```typescript
'use client'

import { useState, useEffect } from 'react'
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import AdminLayout from '@/components/admin/AdminLayout'

export default function ActivityLogsPage() {
  const [logs, setLogs] = useState([])
  
  useEffect(() => {
    const fetchLogs = async () => {
      const q = query(
        collection(db, 'admin_activity_logs'),
        orderBy('timestamp', 'desc'),
        limit(100)
      )
      const snapshot = await getDocs(q)
      const logsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate()
      }))
      setLogs(logsData)
    }
    fetchLogs()
  }, [])
  
  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">บันทึกกิจกรรม</h1>
        
        <div className="bg-white rounded-xl border">
          <table className="w-full">
            <thead>
              <tr>
                <th>เวลา</th>
                <th>Admin</th>
                <th>การกระทำ</th>
                <th>เป้าหมาย</th>
                <th>รายละเอียด</th>
              </tr>
            </thead>
            <tbody>
              {logs.map(log => (
                <tr key={log.id}>
                  <td>{log.timestamp?.toLocaleString('th-TH')}</td>
                  <td>{log.admin_name}</td>
                  <td>{log.action}</td>
                  <td>{log.target_type}</td>
                  <td>{log.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  )
}
```

---

## 📊 Summary & Timeline

| Phase | Tasks | Time | Priority |
|-------|-------|------|----------|
| Phase 1: Real Data | 4 tasks | 1-2 วัน | 🔥 High |
| Phase 2: API Endpoints | 10+ routes | 2-3 วัน | 🔥 High |
| Phase 3: Activity Logging | 2 tasks | 1 วัน | ⚠️ Medium |

**Total Estimated Time:** 4-6 วัน

---

## 🎯 Recommended Order

1. **Day 1-2:** Real Data Integration
   - เชื่อมต่อ Firestore ทุกหน้า
   - ทดสอบการแสดงผลข้อมูลจริง

2. **Day 3-5:** API Endpoints
   - สร้าง API Routes
   - เพิ่ม Authentication Middleware
   - ทดสอบ CRUD Operations

3. **Day 6:** Activity Logging
   - สร้าง Logging Service
   - เพิ่ม Logs Viewer
   - ทดสอบการบันทึก

---

## 💡 Quick Wins (ทำได้เลยวันนี้)

### 1. Real Data Integration - Users Page
**Time:** 30 นาที
**Impact:** เห็นข้อมูลจริงทันที

### 2. Simple API Route - Get Users
**Time:** 1 ชั่วโมง
**Impact:** เริ่มใช้ API ได้

### 3. Basic Activity Log
**Time:** 1 ชั่วโมง
**Impact:** เริ่มบันทึกการกระทำ

---

**Ready to implement?** ให้ผมเริ่มทำเลยไหมครับ? 🚀
