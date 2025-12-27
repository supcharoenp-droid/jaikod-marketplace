---
description: Universal Listing System - ระบบลงประกาศขายแบบ Unified สำหรับทุกหมวดหมู่
---

# 🎯 Universal Listing System Design

## ปัญหาปัจจุบัน

มีระบบลงประกาศ 3 แบบแยกกัน:

| Route | ใช้ทำอะไร | ปัญหา |
|-------|----------|-------|
| `/demo/car-listing` | ลงขายรถ (Demo) | **ดีที่สุด** แต่เป็น Demo |
| `/sell` | ลงขายทั่วไป | AI แต่ไม่มี Split View |
| `/seller/products/create` | ลงขายใน Seller Centre | Form ธรรมดา ไม่มี Preview |

## เป้าหมาย: Unified Smart Listing

รวมเป็นระบบเดียว: `/sell/[category]` หรือ `/listing/create`

**ใช้ car-listing เป็น Blueprint** เพราะมี:
- ✅ Split-View Preview (Real-time)
- ✅ AI Description Generator
- ✅ Section-based Form (Emoji headers)
- ✅ Completion Progress Bar
- ✅ Structured Data (Dropdowns/Toggles)
- ✅ Location Picker Integration

---

## Architecture Design

```
src/
├── app/
│   └── sell/
│       ├── page.tsx              # Entry: เลือกหมวด หรือ AI Detect
│       └── [category]/
│           └── page.tsx          # Universal Form with category template
│
├── components/
│   └── listing/
│       ├── UniversalListingForm.tsx    # Main Component
│       ├── ListingSplitView.tsx        # Left Form + Right Preview
│       ├── ListingFormSection.tsx      # Section with emoji title
│       ├── ListingPreviewCard.tsx      # Real-time preview
│       ├── ListingPhotoUploader.tsx    # Photo component
│       ├── ListingProgressBar.tsx      # Completion tracker
│       └── fields/
│           ├── SelectField.tsx
│           ├── MultiSelectField.tsx
│           ├── TextField.tsx
│           ├── TextAreaField.tsx
│           ├── PriceField.tsx
│           └── LocationField.tsx
│
├── lib/
│   └── listing-templates/
│       ├── index.ts              # Template registry
│       ├── types.ts              # Template interfaces
│       ├── automotive.ts         # 🚗 Cars, Motorcycles
│       ├── electronics.ts        # 📱 Phones, Laptops
│       ├── property.ts           # 🏠 Real Estate
│       ├── fashion.ts            # 👗 Clothing
│       └── general.ts            # 📦 Default
```

---

## Component Design

### 1. UniversalListingForm (Main)

```tsx
interface UniversalListingFormProps {
    categoryId: number
    subcategoryId?: number
    initialData?: Partial<ListingData>
    onSubmit: (data: ListingData) => Promise<void>
}

// Features:
// - Auto-load template based on categoryId
// - Track completion percentage
// - Real-time preview update
// - AI integration hooks
```

### 2. ListingSplitView

```tsx
<ListingSplitView>
    <FormPane>
        <ListingProgressBar percentage={completionScore} />
        <ListingPhotoUploader />
        <AIDescriptionButton />
        
        {template.sections.map(section => (
            <ListingFormSection 
                key={section.id}
                emoji={section.emoji}
                title={t(section.title)}
                fields={section.fields}
                values={formData}
                onChange={handleChange}
            />
        ))}
    </FormPane>
    
    <PreviewPane>
        <ListingPreviewCard 
            data={formData}
            template={template}
        />
    </PreviewPane>
</ListingSplitView>
```

### 3. Template Structure (Per Category)

```typescript
interface CategoryTemplate {
    categoryId: number
    categoryName: { th: string; en: string }
    icon: string
    previewFields: string[]  // Fields to show in preview card
    sections: TemplateSection[]
}

interface TemplateSection {
    id: string
    emoji: string
    title: { th: string; en: string }
    fields: TemplateField[]
}

interface TemplateField {
    key: string
    type: 'text' | 'number' | 'select' | 'multiselect' | 'textarea' | 'toggle'
    label: { th: string; en: string }
    importance: 'required' | 'recommended' | 'optional'
    placeholder?: { th: string; en: string }
    options?: FieldOption[]
    validation?: {
        min?: number
        max?: number
        pattern?: string
    }
    aiDetectable?: boolean  // Can AI fill this from image?
}
```

---

## Migration Plan

### Phase 1: Create Base Components (1-2 days)
1. Create `UniversalListingForm` component
2. Create `ListingSplitView` layout
3. Create reusable field components
4. Port car-listing template to new structure

### Phase 2: Template System (1 day)
1. Create `listing-templates/` folder
2. Port templates from description-engine
3. Add preview field mappings

### Phase 3: Route Integration (1 day)
1. Create `/sell/[category]` route
2. Create category selection entry at `/sell`
3. AI Auto-detect category flow

### Phase 4: Deprecate Old Routes (Later)
1. Redirect `/seller/products/create` → `/sell`
2. Move `/demo/car-listing` → `/sell/car`
3. Update all internal links

---

## URL Structure

```
/sell                    # Entry: Choose category or AI detect
/sell/car                # Car listing form
/sell/motorcycle         # Motorcycle listing form
/sell/phone              # Phone listing form
/sell/laptop             # Laptop listing form
/sell/property           # Property listing form
/sell/fashion            # Fashion listing form
/sell/general            # General listing form (fallback)
```

---

## Key Features to Port from car-listing

### 1. Split View Layout
```tsx
// Fixed right pane for preview, scrollable left pane for form
<div className="flex">
    <div className="w-3/5 overflow-y-auto">{/* Form */}</div>
    <div className="w-2/5 sticky top-0">{/* Preview */}</div>
</div>
```

### 2. Completion Progress
```tsx
const calculateCompletion = (data: FormData, template: Template) => {
    const requiredFields = template.sections
        .flatMap(s => s.fields)
        .filter(f => f.importance === 'required')
    
    const filledCount = requiredFields.filter(f => data[f.key]).length
    return Math.round((filledCount / requiredFields.length) * 100)
}
```

### 3. AI Description Button
```tsx
<Button onClick={generateAIDescription}>
    ✨ สร้างคำบรรยาย
</Button>

// Uses world-class-description-engine
```

### 4. Real-time Preview
```tsx
// Preview updates instantly as user types
useEffect(() => {
    setPreviewData(formData)
}, [formData])
```

---

## Implementation Order

```
1. [x] Create ListingSplitView layout
2. [ ] Create field components (Select, Text, etc.)
3. [ ] Create ListingFormSection
4. [ ] Create ListingPreviewCard
5. [ ] Create UniversalListingForm
6. [ ] Port automotive template
7. [ ] Create /sell/[category] route
8. [ ] Add electronics template
9. [ ] Add property template
10.[ ] Add fashion template
```

---

## Command to Start

```bash
# Step 1: Create the folder structure
mkdir -p src/components/listing/fields
mkdir -p src/lib/listing-templates

# Step 2: Create base files
touch src/components/listing/UniversalListingForm.tsx
touch src/components/listing/ListingSplitView.tsx
touch src/lib/listing-templates/index.ts
```
