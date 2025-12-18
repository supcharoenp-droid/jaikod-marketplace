# 🎯 Dynamic Product Detail Form - Design Specification

**Version**: 1.0  
**Date**: 2025-12-16  
**Status**: Design Phase

---

## 📋 **Overview**

ระบบฟอร์มรายละเอียดสินค้าแบบ Dynamic ที่เปลี่ยนแปลงตามหมวดหมู่สินค้า พร้อมการ suggest ข้อมูลจาก AI

### **Core Concept:**
```
Category Selection → Dynamic Form Generation → AI-Assisted Suggestions → Validation
```

---

## 🎨 **UX Flow**

### **Step 1: Category Detection**
```
User selects category → System loads category-specific schema
```

### **Step 2: Form Rendering**
```
Show header: "ฟอร์มนี้ออกแบบเฉพาะสำหรับสินค้าประเภท [Category Name]"
Render dynamic fields based on schema
Pre-fill with AI suggestions (if available)
```

### **Step 3: Smart Assistance**
```
AI suggests missing fields
Validates required fields
Shows field importance (critical / recommended / optional)
```

---

## 📊 **Field Type System**

### **Field Types:**
```typescript
type FieldType = 
  | 'text'           // ข้อความสั้น (ชื่อ, ยี่ห้อ)
  | 'textarea'       // ข้อความยาว (คำอธิบาย)
  | 'number'         // ตัวเลข (ปี, ไมล์)
  | 'select'         // เลือกจากตัวเลือก (สภาพ, สี)
  | 'multiselect'    // เลือกหลายรายการ (อุปกรณ์ที่มากับเครื่อง)
  | 'boolean'        // ใช่/ไม่ใช่ (มีกล่อง, มีประกัน)
  | 'range'          // ช่วงตัวเลข (ขนาดที่ดิน)
  | 'date'           // วันที่ (วันหมดประกัน)
  | 'tags'           // ป้ายกำกับ (คุณสมบัติ)
```

### **Field Importance:**
```typescript
type FieldImportance = 
  | 'critical'    // 🔴 จำเป็นต้องกรอก (ส่งผลต่อ trust score)
  | 'recommended' // 🟡 ควรกรอก (เพิ่ม conversion)
  | 'optional'    // ⚪ กรอกหรือไม่ก็ได้
```

---

## 🗂️ **Category Schema Definitions**

### **📱 มือถือและแท็บเล็ต**
```typescript
{
  categoryId: '3',
  categoryName: 'มือถือและแท็บเล็ต',
  icon: '📱',
  description: 'ฟอร์มนี้ออกแบบเฉพาะสำหรับสินค้าประเภทมือถือและแท็บเล็ต',
  
  fields: [
    // Critical Fields
    {
      id: 'brand',
      label: 'ยี่ห้อ',
      type: 'select',
      importance: 'critical',
      options: ['iPhone', 'Samsung', 'Oppo', 'Vivo', 'Xiaomi', 'อื่นๆ'],
      aiPrompt: 'Extract phone brand from title and description'
    },
    {
      id: 'model',
      label: 'รุ่น',
      type: 'text',
      importance: 'critical',
      placeholder: 'เช่น iPhone 15 Pro Max',
      aiPrompt: 'Extract exact model name'
    },
    {
      id: 'storage',
      label: 'ความจุ',
      type: 'select',
      importance: 'critical',
      options: ['64GB', '128GB', '256GB', '512GB', '1TB'],
      aiPrompt: 'Identify storage capacity'
    },
    {
      id: 'condition',
      label: 'สภาพเครื่อง',
      type: 'select',
      importance: 'critical',
      options: [
        'ใหม่ ยังไม่แกะกล่อง',
        'ใหม่ แกะกล่องแล้ว',
        'มือสอง สภาพดีมาก',
        'มือสอง สภาพดี',
        'มือสอง สภาพใช้งานได้'
      ],
      aiPrompt: 'Determine device condition'
    },
    
    // Recommended Fields
    {
      id: 'color',
      label: 'สี',
      type: 'text',
      importance: 'recommended',
      placeholder: 'เช่น Titanium Blue',
      aiPrompt: 'Extract device color'
    },
    {
      id: 'warranty',
      label: 'ประกัน',
      type: 'select',
      importance: 'recommended',
      options: [
        'ยังอยู่ในประกัน (Apple/Samsung)',
        'ยังอยู่ในประกัน (ร้านค้า)',
        'หมดประกันแล้ว',
        'ไม่มีประกัน'
      ],
      aiPrompt: 'Check warranty status'
    },
    {
      id: 'accessories',
      label: 'อุปกรณ์ที่มากับเครื่อง',
      type: 'multiselect',
      importance: 'recommended',
      options: [
        'กล่อง',
        'สายชาร์จ',
        'หัวชาร์จ',
        'คู่มือ',
        'ซิมนีดเดิล',
        'สติ๊กเกอร์
'
      ],
      aiPrompt: 'List included accessories'
    },
    
    // Optional Fields
    {
      id: 'imei',
      label: 'IMEI (ถ้ามี)',
      type: 'text',
      importance: 'optional',
      placeholder: '15 หลัก',
      helper: 'ช่วยเพิ่มความน่าเชื่อถือ'
    },
    {
      id: 'batteryHealth',
      label: 'Battery Health (%)',
      type: 'number',
      importance: 'optional',
      min: 0,
      max: 100,
      placeholder: 'เช่น 95',
      helper: 'สำหรับเครื่องมือสอง'
    }
  ],
  
  aiInstructions: `
You are analyzing a mobile phone/tablet listing.
Extract and suggest the following information:
1. Brand and exact model name
2. Storage capacity (GB/TB)
3. Device condition
4. Color/variant
5. Warranty status
6. Included accessories
7. IMEI if mentioned
8. Battery health if mentioned

Format as structured JSON matching the field schema.
  `
}
```

---

### **🚗 ยานยนต์**
```typescript
{
  categoryId: '1',
  categoryName: 'ยานยนต์',
  icon: '🚗',
  description: 'ฟอร์มนี้ออกแบบเฉพาะสำหรับสินค้าประเภทยานยนต์',
  
  fields: [
    // Critical Fields
    {
      id: 'vehicleType',
      label: 'ประเภทรถ',
      type: 'select',
      importance: 'critical',
      options: ['รถยนต์', 'มอเตอร์ไซค์', 'รถกระบะ'],
      aiPrompt: 'Identify vehicle type'
    },
    {
      id: 'brand',
      label: 'ยี่ห้อ',
      type: 'text',
      importance: 'critical',
      placeholder: 'เช่น Toyota, Honda, Mazda',
      aiPrompt: 'Extract vehicle brand'
    },
    {
      id: 'model',
      label: 'รุ่น',
      type: 'text',
      importance: 'critical',
      placeholder: 'เช่น Camry, City, CX-5',
      aiPrompt: 'Extract model name'
    },
    {
      id: 'year',
      label: 'ปีรถ',
      type: 'number',
      importance: 'critical',
      min: 1990,
      max: new Date().getFullYear() + 1,
      placeholder: 'พ.ศ.',
      aiPrompt: 'Extract manufacturing year'
    },
    {
      id: 'mileage',
      label: 'เลขไมล์',
      type: 'number',
      importance: 'critical',
      placeholder: 'กม.',
      suffix: 'กม.',
      aiPrompt: 'Extract mileage'
    },
    {
      id: 'transmission',
      label: 'เกียร์',
      type: 'select',
      importance: 'critical',
      options: ['ออโต้', 'ธรรมดา'],
      aiPrompt: 'Identify transmission type'
    },
    
    // Recommended Fields
    {
      id: 'color',
      label: 'สี',
      type: 'text',
      importance: 'recommended',
      aiPrompt: 'Extract vehicle color'
    },
    {
      id: 'engineSize',
      label: 'ขนาดเครื่องยนต์',
      type: 'text',
      importance: 'recommended',
      placeholder: 'ซีซี',
      suffix: 'ซีซี',
      aiPrompt: 'Extract engine size'
    },
    {
      id: 'fuelType',
      label: 'ประเภทเชื้อเพลิง',
      type: 'select',
      importance: 'recommended',
      options: ['เบนซิน', 'ดีเซล', 'ไฮบริด', 'ไฟฟ้า'],
      aiPrompt: 'Identify fuel type'
    },
    {
      id: 'ownership',
      label: 'มือ',
      type: 'select',
      importance: 'recommended',
      options: ['มือแรก', 'มือสอง', 'มือสาม', 'มือสี่+'],
      aiPrompt: 'Extract ownership history'
    },
    {
      id: 'serviceHistory',
      label: 'ประวัติการเซอร์วิส',
      type: 'boolean',
      importance: 'recommended',
      label_true: 'มีประวัติ',
      label_false: 'ไม่มีประวัติ',
      aiPrompt: 'Check if service history mentioned'
    },
    {
      id: 'accidentHistory',
      label: 'ประวัติอุบัติเหตุ',
      type: 'select',
      importance: 'recommended',
      options: [
        'ไม่เคยชน',
        'เคยชนเล็กน้อย (ซ่อมแล้ว)',
        'เคยชนหนัก (ซ่อมแล้ว)'
      ],
      aiPrompt: 'Check accident history'
    },
    
    // Optional Fields
    {
      id: 'licensePlate',
      label: 'ป้ายทะเบียน',
      type: 'text',
      importance: 'optional',
      placeholder: 'เช่น กก 1234',
      helper: 'ไม่จำเป็นต้องระบุ'
    },
    {
      id: 'modifications',
      label: 'การดัดแปลง',
      type: 'tags',
      importance: 'optional',
      placeholder: 'เช่น ล้อแม็ก, ชุดแต่ง',
      aiPrompt: 'List any modifications'
    }
  ],
  
  aiInstructions: `
You are analyzing a vehicle listing (car/motorcycle).
Extract and suggest:
1. Vehicle type, brand, and model
2. Year and mileage
3. Transmission type (auto/manual)
4. Color
5. Engine size
6. Fuel type
7. Ownership (1st owner, 2nd owner, etc.)
8. Service history availability
9. Accident history
10. Any modifications

Be conservative - only fill fields you're confident about.
  `
}
```

---

### **🏠 อสังหาริมทรัพย์**
```typescript
{
  categoryId: '2',
  categoryName: 'อสังหาริมทรัพย์',
  icon: '🏢',
  description: 'ฟอร์มนี้ออกแบบเฉพาะสำหรับสินค้าประเภทอสังหาริมทรัพย์',
  
  fields: [
    // Critical Fields
    {
      id: 'propertyType',
      label: 'ประเภททรัพย์',
      type: 'select',
      importance: 'critical',
      options: [
        'บ้านเดี่ยว',
        'คอนโด',
        'ทาวน์เฮาส์',
        'ที่ดิน',
        'อาคารพาณิชย์'
      ],
      aiPrompt: 'Identify property type'
    },
    {
      id: 'size',
      label: 'ขนาด',
      type: 'number',
      importance: 'critical',
      placeholder: 'ตารางเมตร',
      suffix: 'ตร.ม.',
      aiPrompt: 'Extract property size'
    },
    {
      id: 'bedrooms',
      label: 'ห้องนอน',
      type: 'number',
      importance: 'critical',
      placeholder: 'จำนวน',
      suffix: 'ห้อง',
      min: 0,
      aiPrompt: 'Count bedrooms'
    },
    {
      id: 'bathrooms',
      label: 'ห้องน้ำ',
      type: 'number',
      importance: 'critical',
      placeholder: 'จำนวน',
      suffix: 'ห้อง',
      min: 0,
      aiPrompt: 'Count bathrooms'
    },
    {
      id: 'province',
      label: 'จังหวัด',
      type: 'text',
      importance: 'critical',
      placeholder: 'เช่น กรุงเทพมหานคร',
      aiPrompt: 'Extract province'
    },
    {
      id: 'ownership',
      label: 'กรรมสิทธิ์',
      type: 'select',
      importance: 'critical',
      options: [
        'มีเอกสารสิทธิ์ (โฉนด)',
        'มีเอกสารสิทธิ์ (น.ส.3)',
        'อื่นๆ'
      ],
      aiPrompt: 'Check ownership documentation'
    },
    
    // Recommended Fields
    {
      id: 'floor',
      label: 'ชั้น',
      type: 'number',
      importance: 'recommended',
      placeholder: 'สำหรับคอนโด',
      helper: 'ระบุสำหรับคอนโด',
      condition: { propertyType: 'คอนโด' }
    },
    {
      id: 'parking',
      label: 'ที่จอดรถ',
      type: 'number',
      importance: 'recommended',
      placeholder: 'จำนวนคัน',
      suffix: 'คัน',
      aiPrompt: 'Count parking spaces'
    },
    {
      id: 'furnished',
      label: 'เฟอร์นิเจอร์',
      type: 'select',
      importance: 'recommended',
      options: [
        'เฟอร์นิเจอร์ครบ',
        'บางส่วน',
        'ไม่มีเฟอร์นิเจอร์'
      ],
      aiPrompt: 'Check furniture status'
    },
    {
      id: 'age',
      label: 'อายุอาคาร',
      type: 'number',
      importance: 'recommended',
      placeholder: 'ปี',
      suffix: 'ปี',
      aiPrompt: 'Extract building age'
    },
    
    // Optional Fields
    {
      id: 'facilities',
      label: 'สิ่งอำนวยความสะดวก',
      type: 'multi select',
      importance: 'optional',
      options: [
        'สระว่ายน้ำ',
        'ฟิตเนส',
        'รปภ. 24 ชม.',
        'สวนส่วนกลาง',
        'ลิฟท์',
        'CCTV'
      ],
      aiPrompt: 'List available facilities'
    },
    {
      id: 'nearbyPlaces',
      label: 'สถานที่ใกล้เคียง',
      type: 'tags',
      importance: 'optional',
      placeholder: 'เช่น BTS, โรงพยาบาล, ห้าง',
      aiPrompt: 'List nearby important places'
    }
  ],
  
  aiInstructions: `
You are analyzing a real estate listing.
Extract:
1. Property type (house, condo, townhouse, land)
2. Size in square meters
3. Number of bedrooms and bathrooms
4. Province/location
5. Ownership documentation status
6. Floor number (for condos)
7. Parking spaces
8. Furniture status
9. Building age
10. Available facilities
11. Nearby places (BTS, hospital, mall, etc.)

Focus on factual information only.
  `
}
```

---

## 🤖 **AI Integration**

### **AI Prompt Template:**
```typescript
const generateDetailFieldsPrompt = (category: string, title: string, description: string) => `
You are a professional product analyst helping to fill detailed product information.

**Category**: ${category}
**Product Title**: ${title}
**Product Description**: ${description}

Based on the category schema, extract and suggest values for ALL applicable fields.

**Instructions**:
1. Only fill fields you're confident about (>80% certainty)
2. Use exact format from field options when available
3. Mark uncertainty with confidence score
4. Suggest additional fields that would improve buyer confidence
5. Flag any missing critical information

Return as structured JSON:
{
  "suggestedFields": {
    "fieldId": {
      "value": "extracted value",
      "confidence": 0.95,
      "source": "title" | "description" | "inferred"
    }
  },
  "missingCritical": ["field1", "field2"],
  "recommendations": [
    "Add battery health percentage for used phones",
    "Include IMEI for trust"
  ]
}
`;
```

---

## 🎨 **UI Components Structure**

### **1. DynamicDetailForm.tsx**
```typescript
interface DynamicDetailFormProps {
  categoryId: string;
  initialData?: Record<string, any>;
  aiSuggestions?: Record<string, any>;
  onChange: (data: Record<string, any>) => void;
}
```

### **2. FieldRenderer.tsx**
```typescript
interface FieldRendererProps {
  field: FieldSchema;
  value: any;
  onChange: (value: any) => void;
  aiSuggestion?: any;
}
```

### **3. AIAssistantPanel.tsx**
```typescript
interface AIAssistantPanelProps {
  suggestions: AISuggestions;
  onAccept: (fieldId: string) => void;
  onReject: (fieldId: string) => void;
}
```

---

## 📋 **Implementation Priority**

### **Phase 1: Core Categories** (Week 1-2)
```
✅ มือถือและแท็บเล็ต
✅ ยานยนต์
✅ อสังหาริมทรัพย์
✅ แฟชั่น
```

### **Phase 2: Popular Categories** (Week 3-4)
```
⏳ เครื่องใช้ไฟฟ้า
⏳ คอมพิวเตอร์
⏳ กล้องถ่ายรูป
⏳ ความงาม
```

### **Phase 3: Remaining Categories** (Week 5-6)
```
⏳ All other categories
```

---

## ✅ **Quality Checklist**

### **For Each Category Schema:**
- [ ] All critical fields defined
- [ ] Field types appropriate
- [ ] Options comprehensive
- [ ] AI prompts clear
- [ ] Validation rules set
- [ ] Helper text provided
- [ ] Mobile-friendly

### **For AI Integration:**
- [ ] Prompts tested
- [ ] Accuracy >85% conf
- [ ] Handles edge cases
- [  ] Graceful fallbacks
- [ ] User can override

---

## 📊 **Success Metrics**

```
- Form completion rate: Target >80%
- A-assisted fill rate: Target >60%
- Time to complete: Target <2 min
- Accuracy of AI suggestions: Target >85%
- User satisfaction: Target >4.5/5
```

---

**Next Steps**:
1. Review & approve schema designs
2. Implement TypeScript types
3. Build core components
4. Integrate AI prompts
5. Test with real data

---

**Design Status**: ✅ READY FOR IMPLEMENTATION
