## การแก้ปัญหาภาษาไม่ sync

### ปัญหา
หน้า Seller Centre ทั้งหมดยังเป็นภาษาอังกฤษ แม้ว่าจะตั้งค่าเป็นภาษาไทยแล้ว

### สาเหตุ
1. ข้อมูลใน Firebase users collection อาจยังเป็น `language: 'EN'`
2. `LanguageContext` โหลดภาษาจาก Firebase แต่ข้อมูลไม่ถูกต้อง

### วิธีแก้ไข

#### วิธีที่ 1: แก้ไขผ่าน UI (แนะนำ)
1. ไปที่ `/profile/settings`
2. คลิกปุ่ม **ไทย** ในส่วน "ภาษา"
3. หน้าจะรีเฟรชอัตโนมัติ
4. ภาษาจะเปลี่ยนเป็นไทยทุกหน้า

#### วิธีที่ 2: แก้ไขใน Firebase Console
1. เปิด Firebase Console
2. ไปที่ Firestore Database
3. เปิด collection `users`
4. หา document ของ user ที่ต้องการ
5. แก้ไข field `language` จาก `'EN'` เป็น `'TH'`
6. รีเฟรชหน้าเว็บ

#### วิธีที่ 3: ใช้ Browser Console (เร็วที่สุด)
```javascript
// เปิด Browser Console (F12)
// รันคำสั่งนี้
const { db } = await import('./lib/firebase')
const { doc, updateDoc } = await import('firebase/firestore')
const user = firebase.auth().currentUser
if (user) {
  await updateDoc(doc(db, 'users', user.uid), { language: 'TH' })
  window.location.reload()
}
```

### การทำงานของระบบ

```typescript
// 1. โหลดภาษาจาก Firebase
useEffect(() => {
  if (user) {
    const userDoc = await getDoc(doc(db, 'users', user.uid))
    const userData = userDoc.data()
    
    if (userData?.language) {
      const userLang = userData.language.toLowerCase() // 'th' | 'en'
      setLanguage(userLang)
      localStorage.setItem('app-language', userLang)
    }
  }
}, [user])

// 2. เมื่อเปลี่ยนภาษา
const handleLanguageChange = async (newLang) => {
  await setLanguage(newLang)  // บันทึกไป Firebase
  window.location.reload()     // รีเฟรชหน้า
}
```

### ตรวจสอบว่าแก้ไขสำเร็จ

1. ไปที่ `/seller` → ต้องเป็นภาษาไทย
2. ไปที่ `/seller/products` → ต้องเป็นภาษาไทย
3. ไปที่ `/seller/orders` → ต้องเป็นภาษาไทย
4. รีเฟรชหน้า → ยังคงเป็นภาษาไทย

### หมายเหตุ
- ภาษาจะถูกบันทึกใน 2 ที่:
  1. **Firebase** (`users/{uid}.language = 'TH'`)
  2. **localStorage** (`app-language = 'th'`)
- เมื่อ login ใหม่จะโหลดจาก Firebase
- เมื่อรีเฟรชหน้าจะโหลดจาก Firebase ก่อน แล้วค่อย fallback ไป localStorage
