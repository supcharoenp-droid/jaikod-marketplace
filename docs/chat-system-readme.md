# 💬 JaiKod Chat System - Kaidee Style

ระบบแชท 1:1 แบบ Marketplace ที่ผูกกับสินค้าแต่ละรายการ (listing-based chat)

## ✨ Features

### 🎯 Core Features
- ✅ **1:1 Chat** - แชทระหว่างผู้ซื้อและผู้ขายโดยตรง
- ✅ **Listing-Based** - ห้องแชทผูกกับสินค้าแต่ละรายการ
- ✅ **Real-time Messaging** - ข้อความแบบ real-time ด้วย Firebase
- ✅ **Image Support** - ส่งรูปภาพในแชทได้
- ✅ **Read Receipts** - แสดงสถานะ ส่งแล้ว/อ่านแล้ว (✓/✓✓)
- ✅ **Unread Count** - นับจำนวนข้อความที่ยังไม่ได้อ่าน
- ✅ **Mobile Responsive** - รองรับทั้ง Desktop และ Mobile

### 🔥 User Experience
- **Auto Room Creation** - สร้างห้องแชทอัตโนมัติเมื่อกดปุ่ม "แชทเลย"
- **Room Reuse** - ถ้ามีห้องเดิมอยู่แล้ว จะเปิดห้องเดิม
- **Product Context** - แสดงข้อมูลสินค้าในหัวแชท (รูป, ชื่อ, ราคา)
- **Sorted by Time** - เรียงห้องแชทตามข้อความล่าสุด
- **Unread Badge** - แสดงจำนวนข้อความที่ยังไม่ได้อ่านเป็น badge สีม่วง

## 📊 Database Structure

### Collections

#### 1. `chat_rooms`
```typescript
{
  id: string
  buyer_id: string              // ผู้ซื้อ
  seller_id: string             // ผู้ขาย
  listing_id: string            // ID สินค้า
  listing_title: string         // ชื่อสินค้า
  listing_image?: string        // รูปสินค้า
  listing_price?: number        // ราคาสินค้า
  last_message: string          // ข้อความล่าสุด
  last_message_at: Timestamp    // เวลาข้อความล่าสุด
  last_sender_id: string        // ผู้ส่งข้อความล่าสุด
  unread_count_buyer: number    // จำนวนข้อความที่ buyer ยังไม่ได้อ่าน
  unread_count_seller: number   // จำนวนข้อความที่ seller ยังไม่ได้อ่าน
  created_at: Timestamp
  is_active: boolean            // สถานะห้อง (เปิด/ปิด)
}
```

#### 2. `chat_messages`
```typescript
{
  id: string
  room_id: string               // ID ห้องแชท
  sender_id: string             // ผู้ส่ง
  sender_name: string           // ชื่อผู้ส่ง
  text: string                  // ข้อความ
  image_url?: string            // รูปภาพ (ถ้ามี)
  status: 'sent' | 'delivered' | 'read'  // สถานะข้อความ
  created_at: Timestamp
}
```

## 🚀 How It Works

### 1. เริ่มแชทจากหน้าสินค้า

```typescript
// ผู้ซื้อกดปุ่ม "แชทเลย" จากหน้าสินค้า
<Button onClick={handleChat}>
  <MessageCircle /> ทักแชทผู้ขาย
</Button>

// Function handleChat
const handleChat = () => {
  const params = new URLSearchParams({
    seller: product.seller_id,
    listing: product.id,
    title: product.title,
    price: product.price.toString(),
    image: product.thumbnail_url
  })
  
  router.push(`/chat?${params.toString()}`)
}
```

### 2. ระบบสร้างหรือเปิดห้องแชท

```typescript
// ที่หน้า /chat
const roomId = await getOrCreateChatRoom(
  user.uid,              // buyer_id
  sellerId,              // seller_id
  listingId,             // listing_id
  title,                 // listing_title
  image,                 // listing_image
  price                  // listing_price
)

// ถ้ามีห้องเดิม -> เปิดห้องเดิม
// ถ้าไม่มี -> สร้างห้องใหม่
```

### 3. ส่งข้อความ

```typescript
await sendChatMessage(
  roomId,
  user.uid,
  user.displayName,
  'สวัสดีครับ สนใจสินค้านี้ครับ',
  imageFile  // optional
)

// ระบบจะ:
// 1. บันทึกข้อความใน chat_messages
// 2. อัปเดต last_message ใน chat_rooms
// 3. เพิ่ม unread_count ของอีกฝ่าย
```

### 4. อ่านข้อความ

```typescript
// เมื่อเปิดห้องแชท
await markMessagesAsRead(roomId, user.uid)

// ระบบจะ:
// 1. รีเซ็ต unread_count ของผู้ใช้เป็น 0
// 2. เปลี่ยนสถานะข้อความเป็น 'read'
```

## 📱 UI Components

### Chat Page Layout

```
┌─────────────────────────────────────────────────────┐
│  แชท                                         3 บทสนทนา │
├─────────────────────────────────────────────────────┤
│ ┌─────────────────┐ │ ┌─────────────────────────┐  │
│ │ [รูปสินค้า]      │ │ │ [รูปสินค้า] iPhone 13   │  │
│ │ iPhone 13 Pro   │ │ │ ฿25,000                 │  │
│ │ ฿25,000         │ │ ├─────────────────────────┤  │
│ │ สนใจครับ...  [2]│ │ │ สวัสดีครับ              │  │
│ ├─────────────────┤ │ │                         │  │
│ │ [รูปสินค้า]      │ │ │ สนใจสินค้านี้ครับ       │  │
│ │ MacBook Pro     │ │ │                         │  │
│ │ ฿35,000         │ │ │ [พิมพ์ข้อความ...]  [ส่ง]│  │
│ │ ยังมีอยู่ไหม...  │ │ └─────────────────────────┘  │
│ └─────────────────┘ │                              │
└─────────────────────────────────────────────────────┘
```

### Features in UI

1. **Left Sidebar (Rooms List)**
   - แสดงรายการห้องแชททั้งหมด
   - เรียงตามข้อความล่าสุด
   - แสดง unread badge
   - แสดงรูปและชื่อสินค้า
   - แสดงราคาสินค้า

2. **Right Panel (Chat Window)**
   - แสดงข้อความแบบ bubble
   - รองรับรูปภาพ
   - แสดงสถานะ ✓ (ส่งแล้ว) / ✓✓ (อ่านแล้ว)
   - แสดงเวลาส่งข้อความ
   - Input box พร้อมปุ่มแนบรูป

3. **Mobile Responsive**
   - แสดง Rooms List เต็มหน้าจอ
   - เมื่อเลือกห้อง จะแสดง Chat Window เต็มหน้าจอ
   - มีปุ่ม Back เพื่อกลับไป Rooms List

## 🔧 API Functions

### Room Management

```typescript
// สร้างหรือเปิดห้องแชท
getOrCreateChatRoom(
  buyerId: string,
  sellerId: string,
  listingId: string,
  listingTitle: string,
  listingImage?: string,
  listingPrice?: number
): Promise<string>

// ดึงห้องแชททั้งหมดของผู้ใช้
getUserChatRooms(userId: string): Promise<ChatRoom[]>

// Subscribe real-time
subscribeToUserChatRooms(
  userId: string,
  callback: (rooms: ChatRoom[]) => void
): Unsubscribe

// ปิดห้องแชท
closeChatRoom(roomId: string): Promise<void>
```

### Messaging

```typescript
// ส่งข้อความ
sendChatMessage(
  roomId: string,
  senderId: string,
  senderName: string,
  text: string,
  imageFile?: File
): Promise<string>

// ดึงข้อความในห้อง
getRoomMessages(roomId: string): Promise<ChatMessage[]>

// Subscribe real-time
subscribeToRoomMessages(
  roomId: string,
  callback: (messages: ChatMessage[]) => void
): Unsubscribe

// Mark as read
markMessagesAsRead(roomId: string, userId: string): Promise<void>

// นับข้อความที่ยังไม่ได้อ่าน
getTotalUnreadCount(userId: string): Promise<number>
```

## 🎯 User Flow

### Buyer Flow (ผู้ซื้อ)

1. เข้าหน้าสินค้าที่สนใจ
2. กดปุ่ม "ทักแชทผู้ขาย"
3. ระบบสร้างห้องแชทใหม่ (หรือเปิดห้องเดิม)
4. พิมพ์ข้อความถามผู้ขาย
5. รอผู้ขายตอบกลับ
6. เห็นสถานะ "อ่านแล้ว" เมื่อผู้ขายเปิดแชท

### Seller Flow (ผู้ขาย)

1. เห็น badge แจ้งเตือนข้อความใหม่
2. เข้าหน้าแชท
3. เห็นรายการห้องแชทที่มีข้อความใหม่
4. เปิดห้องแชท
5. อ่านข้อความจากผู้ซื้อ
6. ตอบกลับผู้ซื้อ
7. ผู้ซื้อเห็นสถานะ "อ่านแล้ว"

## 🔐 Security & Privacy

### Firestore Rules

```javascript
// chat_rooms
match /chat_rooms/{roomId} {
  allow read: if request.auth != null && 
    (resource.data.buyer_id == request.auth.uid || 
     resource.data.seller_id == request.auth.uid);
  
  allow create: if request.auth != null;
  
  allow update: if request.auth != null && 
    (resource.data.buyer_id == request.auth.uid || 
     resource.data.seller_id == request.auth.uid);
}

// chat_messages
match /chat_messages/{messageId} {
  allow read: if request.auth != null;
  allow create: if request.auth != null;
  allow update: if request.auth != null && 
    resource.data.sender_id == request.auth.uid;
}
```

## 📈 Performance Optimization

1. **Pagination** - จำกัดข้อความแสดงครั้งละ 100 ข้อความ
2. **Real-time Subscriptions** - ใช้ onSnapshot เฉพาะห้องที่เปิดอยู่
3. **Image Optimization** - บีบอัดรูปก่อนอัปโหลด
4. **Lazy Loading** - โหลดรูปภาพแบบ lazy
5. **Unsubscribe** - ยกเลิก subscription เมื่อออกจากหน้า

## 🐛 Troubleshooting

### ห้องแชทไม่ถูกสร้าง
```typescript
// ตรวจสอบว่า user login แล้วหรือยัง
if (!user) {
  router.push('/login')
  return
}

// ตรวจสอบ parameters
console.log('Seller ID:', sellerId)
console.log('Listing ID:', listingId)
```

### ข้อความไม่แสดง real-time
```typescript
// ตรวจสอบ Firestore index
// ไปที่ Firebase Console > Firestore > Indexes
// สร้าง composite index:
// Collection: chat_messages
// Fields: room_id (Ascending), created_at (Ascending)
```

### รูปภาพอัปโหลดไม่ได้
```typescript
// ตรวจสอบ Firebase Storage rules
service firebase.storage {
  match /b/{bucket}/o {
    match /chat_images/{allPaths=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        request.resource.size < 5 * 1024 * 1024; // 5MB limit
    }
  }
}
```

## 🚀 Deployment

### Required Firebase Indexes

1. **chat_rooms**
   - `buyer_id` (Ascending) + `is_active` (Ascending)
   - `seller_id` (Ascending) + `is_active` (Ascending)

2. **chat_messages**
   - `room_id` (Ascending) + `created_at` (Ascending)

### Environment Variables

```bash
# .env.local
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
```

## 📝 Future Enhancements

### Phase 2 (Planned)
- [ ] Voice messages
- [ ] Video calls
- [ ] Location sharing
- [ ] Quick replies
- [ ] Message search
- [ ] Block user
- [ ] Report abuse
- [ ] Push notifications

### Phase 3 (Future)
- [ ] Group chat
- [ ] Chatbot for FAQs
- [ ] Auto-translate
- [ ] Message reactions
- [ ] Typing indicators
- [ ] Online status

## 📄 License

Proprietary - JaiKod Marketplace © 2025

---

**Version**: 1.0.0  
**Last Updated**: 2025-12-10  
**Status**: ✅ Production Ready
