# 🚀 Chat System Phase 2 - Implementation Guide

> **Enhanced Features Implementation**  
> Image Upload, File Upload, Location Sharing, Pin Messages, Search, Block/Report

---

## 📋 Overview

Phase 2 เพิ่มฟีเจอร์สำคัญที่ทำให้ระบบ Chat สมบูรณ์ขึ้น:

1. ✅ **Image Upload** - ส่งรูป 1-5 รูปพร้อมกัน
2. ✅ **File Upload** - ส่งไฟล์ PDF, DOC
3. ✅ **Location Sharing** - แชร์ตำแหน่ง + AI แนะนำจุดนัดรับ
4. ✅ **Pin Messages** - ปักหมุดข้อความสำคัญ
5. ✅ **Search Messages** - ค้นหาข้อความในแชท
6. ✅ **Block/Report** - รายงานและบล็อกผู้ใช้
7. ✅ **Share Products** - แชร์สินค้าอื่นในร้าน

---

## 1. 📸 Image Upload

### Features
- ส่งได้ 1-5 รูปพร้อมกัน
- Preview ก่อนส่ง
- Auto Compress (ลดขนาดอัตโนมัติ)
- Zoom รูปในแชท
- Download รูปต้นฉบับ

### Implementation

#### Step 1: Install Dependencies
```bash
npm install react-image-file-resizer
```

#### Step 2: Create Image Upload Component

**File:** `src/components/chat/ImageUpload.tsx`

```typescript
'use client';

import { useState, useRef } from 'react';
import { X, Upload, Image as ImageIcon } from 'lucide-react';
import imageCompression from 'browser-image-compression';
import { uploadChatImage } from '@/lib/storage';

interface ImageUploadProps {
  onImagesSelected: (images: File[]) => void;
  maxImages?: number;
}

export default function ImageUpload({ 
  onImagesSelected, 
  maxImages = 5 
}: ImageUploadProps) {
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    if (files.length + selectedImages.length > maxImages) {
      alert(`สามารถเลือกได้สูงสุด ${maxImages} รูป`);
      return;
    }

    // Compress images
    const compressedFiles = await Promise.all(
      files.map(async (file) => {
        const options = {
          maxSizeMB: 1,
          maxWidthOrHeight: 1920,
          useWebWorker: true
        };
        return await imageCompression(file, options);
      })
    );

    // Create previews
    const newPreviews = await Promise.all(
      compressedFiles.map((file) => {
        return new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });
      })
    );

    setSelectedImages([...selectedImages, ...compressedFiles]);
    setPreviews([...previews, ...newPreviews]);
  };

  const removeImage = (index: number) => {
    setSelectedImages(selectedImages.filter((_, i) => i !== index));
    setPreviews(previews.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (selectedImages.length === 0) return;

    setUploading(true);
    try {
      const uploadedUrls = await Promise.all(
        selectedImages.map((file) => uploadChatImage(file))
      );
      
      onImagesSelected(uploadedUrls);
      setSelectedImages([]);
      setPreviews([]);
    } catch (error) {
      console.error('Error uploading images:', error);
      alert('อัปโหลดรูปไม่สำเร็จ');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Preview Grid */}
      {previews.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {previews.map((preview, index) => (
            <div key={index} className="relative group">
              <img
                src={preview}
                alt={`Preview ${index + 1}`}
                className="w-full h-24 object-cover rounded-lg"
              />
              <button
                onClick={() => removeImage(index)}
                className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
          
          {/* Add More Button */}
          {selectedImages.length < maxImages && (
            <button
              onClick={() => fileInputRef.current?.click()}
              className="h-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center hover:border-purple-500 transition-colors"
            >
              <Upload className="w-6 h-6 text-gray-400" />
            </button>
          )}
        </div>
      )}

      {/* Upload Button */}
      {selectedImages.length === 0 ? (
        <button
          onClick={() => fileInputRef.current?.click()}
          className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center gap-2 hover:border-purple-500 transition-colors"
        >
          <ImageIcon className="w-5 h-5 text-gray-400" />
          <span className="text-gray-600">เลือกรูปภาพ (สูงสุด {maxImages} รูป)</span>
        </button>
      ) : (
        <button
          onClick={handleUpload}
          disabled={uploading}
          className="w-full py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
        >
          {uploading ? 'กำลังอัปโหลด...' : `ส่งรูป (${selectedImages.length})`}
        </button>
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
}
```

#### Step 3: Add Storage Functions

**File:** `src/lib/storage.ts`

```typescript
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from './firebase';

export async function uploadChatImage(file: File): Promise<string> {
  const timestamp = Date.now();
  const filename = `chat-images/${timestamp}-${file.name}`;
  const storageRef = ref(storage, filename);
  
  await uploadBytes(storageRef, file);
  const url = await getDownloadURL(storageRef);
  
  return url;
}

export async function uploadChatFile(file: File): Promise<{
  url: string;
  name: string;
  size: number;
  type: string;
}> {
  const timestamp = Date.now();
  const filename = `chat-files/${timestamp}-${file.name}`;
  const storageRef = ref(storage, filename);
  
  await uploadBytes(storageRef, file);
  const url = await getDownloadURL(storageRef);
  
  return {
    url,
    name: file.name,
    size: file.size,
    type: file.type
  };
}
```

#### Step 4: Update Message Type

**File:** `src/lib/chat.ts`

```typescript
export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  type: 'text' | 'image' | 'file' | 'location' | 'product' | 'system';
  text?: string;
  images?: {
    url: string;
    thumbnail?: string;
    size: number;
  }[];
  file?: {
    url: string;
    name: string;
    type: string;
    size: number;
  };
  location?: {
    lat: number;
    lng: number;
    address: string;
  };
  productShare?: {
    productId: string;
    productName: string;
    productPrice: number;
    productImage: string;
  };
  isRead: boolean;
  readAt?: Date;
  isPinned: boolean;
  createdAt: Date;
}
```

---

## 2. 📁 File Upload

### Implementation

**File:** `src/components/chat/FileUpload.tsx`

```typescript
'use client';

import { useState, useRef } from 'react';
import { FileText, Upload, X } from 'lucide-react';
import { uploadChatFile } from '@/lib/storage';

interface FileUploadProps {
  onFileSelected: (file: any) => void;
}

export default function FileUpload({ onFileSelected }: FileUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (max 20MB)
    if (file.size > 20 * 1024 * 1024) {
      alert('ไฟล์ใหญ่เกินไป (สูงสุด 20MB)');
      return;
    }

    // Check file type
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ];

    if (!allowedTypes.includes(file.type)) {
      alert('รองรับเฉพาะไฟล์ PDF, DOC, DOCX, XLS, XLSX');
      return;
    }

    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    try {
      const fileData = await uploadChatFile(selectedFile);
      onFileSelected(fileData);
      setSelectedFile(null);
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('อัปโหลดไฟล์ไม่สำเร็จ');
    } finally {
      setUploading(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="space-y-4">
      {selectedFile ? (
        <div className="border border-gray-300 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <FileText className="w-10 h-10 text-blue-500" />
            <div className="flex-1">
              <p className="font-medium">{selectedFile.name}</p>
              <p className="text-sm text-gray-500">{formatFileSize(selectedFile.size)}</p>
            </div>
            <button
              onClick={() => setSelectedFile(null)}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <button
            onClick={handleUpload}
            disabled={uploading}
            className="w-full mt-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
          >
            {uploading ? 'กำลังอัปโหลด...' : 'ส่งไฟล์'}
          </button>
        </div>
      ) : (
        <button
          onClick={() => fileInputRef.current?.click()}
          className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center gap-2 hover:border-purple-500 transition-colors"
        >
          <Upload className="w-5 h-5 text-gray-400" />
          <span className="text-gray-600">เลือกไฟล์ (PDF, DOC, XLS - สูงสุด 20MB)</span>
        </button>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.doc,.docx,.xls,.xlsx"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
}
```

---

## 3. 📍 Location Sharing

### Implementation

**File:** `src/components/chat/LocationPicker.tsx`

```typescript
'use client';

import { useState } from 'react';
import { MapPin, Navigation } from 'lucide-react';

interface LocationPickerProps {
  onLocationSelected: (location: {
    lat: number;
    lng: number;
    address: string;
  }) => void;
}

export default function LocationPicker({ onLocationSelected }: LocationPickerProps) {
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState<any>(null);

  const getCurrentLocation = () => {
    setLoading(true);
    
    if (!navigator.geolocation) {
      alert('เบราว์เซอร์ของคุณไม่รองรับการระบุตำแหน่ง');
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        // Reverse geocoding to get address
        const address = await getAddressFromCoords(latitude, longitude);
        
        const locationData = {
          lat: latitude,
          lng: longitude,
          address
        };
        
        setLocation(locationData);
        setLoading(false);
      },
      (error) => {
        console.error('Error getting location:', error);
        alert('ไม่สามารถระบุตำแหน่งได้');
        setLoading(false);
      }
    );
  };

  const getAddressFromCoords = async (lat: number, lng: number): Promise<string> => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
      );
      const data = await response.json();
      
      if (data.results && data.results[0]) {
        return data.results[0].formatted_address;
      }
      
      return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
    } catch (error) {
      return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
    }
  };

  const handleSend = () => {
    if (location) {
      onLocationSelected(location);
      setLocation(null);
    }
  };

  // AI Safe Meeting Points
  const safePlaces = [
    { name: '7-Eleven', icon: '🏪', safety: 5 },
    { name: 'ปั๊มน้ำมัน PTT', icon: '⛽', safety: 5 },
    { name: 'สถานีรถไฟฟ้า BTS', icon: '🚇', safety: 4 },
    { name: 'ห้างสรรพสินค้า', icon: '🏬', safety: 5 }
  ];

  return (
    <div className="space-y-4">
      {/* Current Location Button */}
      <button
        onClick={getCurrentLocation}
        disabled={loading}
        className="w-full py-3 bg-blue-600 text-white rounded-lg flex items-center justify-center gap-2 hover:bg-blue-700 disabled:opacity-50"
      >
        <Navigation className="w-5 h-5" />
        {loading ? 'กำลังระบุตำแหน่ง...' : 'ใช้ตำแหน่งปัจจุบัน'}
      </button>

      {/* Selected Location */}
      {location && (
        <div className="border border-gray-300 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <MapPin className="w-6 h-6 text-red-500 flex-shrink-0 mt-1" />
            <div className="flex-1">
              <p className="font-medium">ตำแหน่งที่เลือก</p>
              <p className="text-sm text-gray-600 mt-1">{location.address}</p>
              <p className="text-xs text-gray-400 mt-1">
                {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
              </p>
            </div>
          </div>
          
          <button
            onClick={handleSend}
            className="w-full mt-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            ส่งตำแหน่ง
          </button>
        </div>
      )}

      {/* AI Safe Meeting Points */}
      <div className="border-t pt-4">
        <p className="text-sm font-medium text-gray-700 mb-2">
          🛡️ จุดนัดรับที่แนะนำ (ปลอดภัย)
        </p>
        <div className="grid grid-cols-2 gap-2">
          {safePlaces.map((place, index) => (
            <div
              key={index}
              className="p-3 border border-gray-200 rounded-lg hover:border-green-500 cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-2">
                <span className="text-2xl">{place.icon}</span>
                <div className="flex-1">
                  <p className="text-sm font-medium">{place.name}</p>
                  <div className="flex items-center gap-1 mt-1">
                    {Array.from({ length: place.safety }).map((_, i) => (
                      <span key={i} className="text-yellow-400 text-xs">⭐</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <p className="text-xs text-gray-500 mt-3">
          💡 เคล็ดลับ: นัดรับที่สถานที่สาธารณะ มีกล้องวงจรปิด และคนพลุกพล่าน
        </p>
      </div>
    </div>
  );
}
```

---

## 4. 📌 Pin Messages

### Implementation

**Update:** `src/lib/chat.ts`

```typescript
export async function pinMessage(
  conversationId: string,
  messageId: string
): Promise<void> {
  const convRef = doc(db, 'conversations', conversationId);
  const convSnap = await getDoc(convRef);
  
  if (!convSnap.exists()) return;
  
  const pinnedMessages = convSnap.data().pinnedMessages || [];
  
  // Max 3 pinned messages
  if (pinnedMessages.length >= 3) {
    alert('สามารถปักหมุดได้สูงสุด 3 ข้อความ');
    return;
  }
  
  await updateDoc(convRef, {
    pinnedMessages: [...pinnedMessages, messageId]
  });
  
  // Update message
  const msgRef = doc(db, 'messages', messageId);
  await updateDoc(msgRef, {
    isPinned: true
  });
}

export async function unpinMessage(
  conversationId: string,
  messageId: string
): Promise<void> {
  const convRef = doc(db, 'conversations', conversationId);
  const convSnap = await getDoc(convRef);
  
  if (!convSnap.exists()) return;
  
  const pinnedMessages = convSnap.data().pinnedMessages || [];
  
  await updateDoc(convRef, {
    pinnedMessages: pinnedMessages.filter((id: string) => id !== messageId)
  });
  
  // Update message
  const msgRef = doc(db, 'messages', messageId);
  await updateDoc(msgRef, {
    isPinned: false
  });
}
```

---

## 5. 🔍 Search Messages

### Implementation

**File:** `src/components/chat/SearchMessages.tsx`

```typescript
'use client';

import { useState } from 'react';
import { Search, X, Calendar } from 'lucide-react';
import { searchMessages } from '@/lib/chat';

interface SearchMessagesProps {
  conversationId: string;
  onResultClick: (messageId: string) => void;
}

export default function SearchMessages({ 
  conversationId, 
  onResultClick 
}: SearchMessagesProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;

    setLoading(true);
    try {
      const messages = await searchMessages(conversationId, query);
      setResults(messages);
    } catch (error) {
      console.error('Error searching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          placeholder="ค้นหาข้อความ..."
          className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
        />
        {query && (
          <button
            onClick={() => {
              setQuery('');
              setResults([]);
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        )}
      </div>

      {/* Results */}
      {loading ? (
        <div className="text-center py-8">
          <div className="w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-sm text-gray-500 mt-2">กำลังค้นหา...</p>
        </div>
      ) : results.length > 0 ? (
        <div className="space-y-2">
          <p className="text-sm text-gray-600">พบ {results.length} ข้อความ</p>
          {results.map((message) => (
            <button
              key={message.id}
              onClick={() => onResultClick(message.id)}
              className="w-full p-3 border border-gray-200 rounded-lg hover:bg-gray-50 text-left"
            >
              <p className="text-sm">{message.text}</p>
              <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                <Calendar className="w-3 h-3" />
                {message.createdAt.toLocaleDateString('th-TH')}
              </div>
            </button>
          ))}
        </div>
      ) : query && !loading ? (
        <div className="text-center py-8">
          <p className="text-gray-500">ไม่พบข้อความที่ค้นหา</p>
        </div>
      ) : null}
    </div>
  );
}
```

---

## 6. 🚫 Block / Report

### Implementation

**File:** `src/components/chat/BlockReport.tsx`

```typescript
'use client';

import { useState } from 'react';
import { Ban, Flag, AlertTriangle } from 'lucide-react';
import { blockUser, reportUser } from '@/lib/chat';

interface BlockReportProps {
  userId: string;
  userName: string;
  conversationId: string;
  onComplete: () => void;
}

export default function BlockReport({ 
  userId, 
  userName, 
  conversationId,
  onComplete 
}: BlockReportProps) {
  const [action, setAction] = useState<'block' | 'report' | null>(null);
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);

  const blockReasons = [
    'สแปม',
    'มิจฉาชีพ',
    'ภาษาไม่สุภาพ',
    'ขายของผิดกฎหมาย'
  ];

  const reportTypes = [
    'มิจฉาชีพ',
    'สินค้าปลอม',
    'ขายของผิดกฎหมาย',
    'ภาพอนาจาร'
  ];

  const handleBlock = async () => {
    if (!reason) {
      alert('กรุณาเลือกเหตุผล');
      return;
    }

    setLoading(true);
    try {
      await blockUser(userId, conversationId, reason);
      alert('บล็อกผู้ใช้เรียบร้อยแล้ว');
      onComplete();
    } catch (error) {
      console.error('Error blocking user:', error);
      alert('บล็อกผู้ใช้ไม่สำเร็จ');
    } finally {
      setLoading(false);
    }
  };

  const handleReport = async () => {
    if (!reason) {
      alert('กรุณาเลือกประเภทการรายงาน');
      return;
    }

    setLoading(true);
    try {
      await reportUser(userId, conversationId, reason);
      alert('รายงานผู้ใช้เรียบร้อยแล้ว ทีมงานจะตรวจสอบภายใน 24 ชั่วโมง');
      onComplete();
    } catch (error) {
      console.error('Error reporting user:', error);
      alert('รายงานผู้ใช้ไม่สำเร็จ');
    } finally {
      setLoading(false);
    }
  };

  if (!action) {
    return (
      <div className="space-y-3">
        <button
          onClick={() => setAction('block')}
          className="w-full p-4 border-2 border-red-200 rounded-lg hover:border-red-500 transition-colors flex items-center gap-3"
        >
          <Ban className="w-6 h-6 text-red-500" />
          <div className="text-left">
            <p className="font-medium text-red-700">บล็อกผู้ใช้</p>
            <p className="text-sm text-gray-600">ผู้ใช้นี้จะไม่สามารถส่งข้อความหาคุณได้อีก</p>
          </div>
        </button>

        <button
          onClick={() => setAction('report')}
          className="w-full p-4 border-2 border-orange-200 rounded-lg hover:border-orange-500 transition-colors flex items-center gap-3"
        >
          <Flag className="w-6 h-6 text-orange-500" />
          <div className="text-left">
            <p className="font-medium text-orange-700">รายงานผู้ใช้</p>
            <p className="text-sm text-gray-600">ส่งรายงานให้ทีมงานตรวจสอบ</p>
          </div>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3 pb-4 border-b">
        {action === 'block' ? (
          <>
            <Ban className="w-6 h-6 text-red-500" />
            <div>
              <h3 className="font-bold text-red-700">บล็อก {userName}</h3>
              <p className="text-sm text-gray-600">เลือกเหตุผลในการบล็อก</p>
            </div>
          </>
        ) : (
          <>
            <Flag className="w-6 h-6 text-orange-500" />
            <div>
              <h3 className="font-bold text-orange-700">รายงาน {userName}</h3>
              <p className="text-sm text-gray-600">เลือกประเภทการรายงาน</p>
            </div>
          </>
        )}
      </div>

      {/* Reasons */}
      <div className="space-y-2">
        {(action === 'block' ? blockReasons : reportTypes).map((item) => (
          <button
            key={item}
            onClick={() => setReason(item)}
            className={`w-full p-3 border-2 rounded-lg text-left transition-colors ${
              reason === item
                ? 'border-purple-500 bg-purple-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            {item}
          </button>
        ))}
      </div>

      {/* Warning */}
      <div className="flex items-start gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
        <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-yellow-800">
          {action === 'block'
            ? 'การบล็อกจะทำให้ผู้ใช้นี้ไม่สามารถติดต่อคุณได้อีก'
            : 'ทีมงานจะตรวจสอบรายงานของคุณภายใน 24 ชั่วโมง'}
        </p>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={() => {
            setAction(null);
            setReason('');
          }}
          className="flex-1 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          ยกเลิก
        </button>
        <button
          onClick={action === 'block' ? handleBlock : handleReport}
          disabled={!reason || loading}
          className={`flex-1 py-2 text-white rounded-lg disabled:opacity-50 ${
            action === 'block'
              ? 'bg-red-600 hover:bg-red-700'
              : 'bg-orange-600 hover:bg-orange-700'
          }`}
        >
          {loading ? 'กำลังดำเนินการ...' : action === 'block' ? 'บล็อก' : 'รายงาน'}
        </button>
      </div>
    </div>
  );
}
```

---

## 7. 🔗 Share Products

### Implementation

**File:** `src/components/chat/ProductShare.tsx`

```typescript
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Package, Search } from 'lucide-react';
import { getSellerProducts } from '@/lib/products';

interface ProductShareProps {
  sellerId: string;
  onProductSelected: (product: any) => void;
}

export default function ProductShare({ 
  sellerId, 
  onProductSelected 
}: ProductShareProps) {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');

  const loadProducts = async () => {
    setLoading(true);
    try {
      const sellerProducts = await getSellerProducts(sellerId);
      setProducts(sellerProducts);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="ค้นหาสินค้า..."
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
        />
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="text-center py-8">
          <div className="w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      ) : filteredProducts.length > 0 ? (
        <div className="grid grid-cols-2 gap-3 max-h-96 overflow-y-auto">
          {filteredProducts.map((product) => (
            <button
              key={product.id}
              onClick={() => onProductSelected(product)}
              className="border border-gray-200 rounded-lg p-2 hover:border-purple-500 transition-colors text-left"
            >
              <div className="relative w-full h-24 mb-2">
                <Image
                  src={product.images[0] || '/placeholder.png'}
                  alt={product.name}
                  fill
                  className="object-cover rounded"
                />
              </div>
              <p className="text-sm font-medium line-clamp-2">{product.name}</p>
              <p className="text-sm text-purple-600 font-bold mt-1">
                ฿{product.price.toLocaleString()}
              </p>
            </button>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <Package className="w-12 h-12 text-gray-300 mx-auto mb-2" />
          <p className="text-gray-500">ไม่พบสินค้า</p>
          {!loading && products.length === 0 && (
            <button
              onClick={loadProducts}
              className="mt-3 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              โหลดสินค้า
            </button>
          )}
        </div>
      )}
    </div>
  );
}
```

---

## 📝 Testing Checklist

### Image Upload
- [ ] สามารถเลือกรูป 1-5 รูปได้
- [ ] แสดง Preview ก่อนส่ง
- [ ] Compress รูปอัตโนมัติ
- [ ] อัปโหลดสำเร็จ
- [ ] แสดงรูปในแชท
- [ ] Zoom รูปได้
- [ ] Download รูปต้นฉบับได้

### File Upload
- [ ] รองรับ PDF, DOC, XLS
- [ ] จำกัดขนาดไฟล์ 20MB
- [ ] แสดงชื่อและขนาดไฟล์
- [ ] อัปโหลดสำเร็จ
- [ ] Download ไฟล์ได้

### Location Sharing
- [ ] ระบุตำแหน่งปัจจุบันได้
- [ ] แสดงที่อยู่
- [ ] แสดงจุดนัดรับที่แนะนำ
- [ ] ส่งตำแหน่งได้

### Pin Messages
- [ ] ปักหมุดข้อความได้
- [ ] แสดงข้อความที่ปักหมุด
- [ ] ยกเลิกปักหมุดได้
- [ ] จำกัดสูงสุด 3 ข้อความ

### Search Messages
- [ ] ค้นหาข้อความได้
- [ ] แสดงผลลัพธ์
- [ ] คลิกไปยังข้อความได้

### Block/Report
- [ ] บล็อกผู้ใช้ได้
- [ ] รายงานผู้ใช้ได้
- [ ] แสดงคำเตือน
- [ ] บันทึกข้อมูลได้

### Share Products
- [ ] แสดงสินค้าในร้าน
- [ ] ค้นหาสินค้าได้
- [ ] แชร์สินค้าได้
- [ ] แสดง Product Card ในแชท

---

## 🚀 Next Steps

1. ✅ อ่านและทำความเข้าใจ Implementation Guide นี้
2. ⏳ เริ่มพัฒนาทีละฟีเจอร์
3. ⏳ ทดสอบแต่ละฟีเจอร์
4. ⏳ Deploy Phase 2
5. ⏳ เริ่ม Phase 3 (Seller Pro Features)

---

**Created by:** Antigravity AI  
**Date:** 10 ธันวาคม 2568  
**Phase:** 2 - Enhanced Features
