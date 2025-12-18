# 🧪 ระบบทดสอบ - คู่มือการใช้งาน

## 🎯 Overview

ระบบได้รับการปรับปรุงให้มีความเสถียร แม่นยำ และรองรับอนาคต โดยมีการแก้ไขหลัก 3 ส่วน:

1. **Architecture Refactor** - ใช้ subcategory ID แทนชื่อ
2. **Smart Validation** - ตรวจสอบและเตือนอัตโนมัติ
3. **Auto-Fix System** - แก้ไขด้วยคลิกเดียว

---

## 📋 วิธีทดสอบระบบ

### ✅ Test Case 1: โน๊ตบุ๊ค (Laptop)

**Expected Result:**
- Category: 4 (คอมพิวเตอร์และไอที)
- Subcategory: 401 (โน้ตบุ๊ค)

**Steps:**
```
1. ไปที่ http://localhost:3000/sell-simple
2. อัพโหลดรูปโน๊ตบุ๊ค หรือพิมพ์ "โน๊ตบุ๊ค Acer Aspire 5"
3. ดูว่า AI เลือกหมวดย่อย 401 (โน้ตบุ๊ค) หรือไม่
4. ลองเปลี่ยนเป็น 408 (คีย์บอร์ด)
5. ควรเห็น WARNING สีเหลือง/แดง
6. กดปุ่ม "แก้ไขหมวดให้ถูกต้อง"
7. ควรกลับไปที่ 401 อัตโนมัติ ✅
```

---

### ✅ Test Case 2: คีย์บอร์ด (Keyboard)

**Expected Result:**
- Category: 4
- Subcategory: 408 (คีย์บอร์ด)

**Steps:**
```
1. พิมพ์ "คีย์บอร์ด Razer BlackWidow"
2. AI ควรเลือก 408 (คีย์บอร์ด)
3. ลองเปลี่ยนเป็น 401 (โน้ตบุ๊ค)
4. ควรเห็น WARNING
5. กดปุ่ม auto-fix
6. กลับไปที่ 408 ✅
```

---

### ✅ Test Case 3: เมาส์ (Mouse)

**Expected Result:**
- Category: 4
- Subcategory: 409 (เมาส์)

**Steps:**
```
1. พิมพ์ "เมาส์ Logitech G502"
2. AI ควรเลือก 409 (เมาส์)
3. ลองเปลี่ยนเป็น 404 (Peripherals)
4. ควรเห็น WARNING
5. Auto-fix กลับไป 409 ✅
```

---

### ✅ Test Case 4: Automated Testing

**Steps:**
```
1. เปิด http://localhost:3000/test/keywords
2. กด "Run Tests"
3. รอผลลัพธ์
4. ควรเห็น Success Rate ≥ 95%
5. ดูรายละเอียด failures (ถ้ามี)
6. แก้ keywords ตามที่แนะนำ
```

---

## 🎨 UI Elements

### 1. Validation Warning Colors

- 🔴 **Red:** High confidence error (≥70%) - ต้องแก้
- 🟡 **Yellow:** Medium warning (50-70%) - แนะนำให้แก้
- 🔵 **Blue:** Low info (<50%) - FYI

### 2. Auto-Fix Button

```
[✓ แก้ไขหมวดให้ถูกต้อง]
```
- คลิกครั้งเดียว = แก้อัตโนมัติ
- ไม่ต้องเลือกใหม่เอง

---

## 🔍 What To Look For

### ✅ Should Work:
- AI detects correct category from image
- AI detects correct subcategory from title
- Warnings appear when mismatch
- Auto-fix button changes subcategory
- No errors in console

### ❌ Should NOT Happen:
- Wrong subcategory selected
- No warning when obvious mismatch
- Auto-fix button doesn't work
- TypeScript errors
- Console errors

---

## 📊 Success Criteria

### Minimum (Must Have):
- [ ] 90% accuracy on category
- [ ] 85% accuracy on subcategory
- [ ] Warnings appear correctly
- [ ] Auto-fix works

### Target (Should Have):
- [ ] 95% accuracy on category
- [ ] 90% accuracy on subcategory
- [ ] < 5% user corrections needed
- [ ] No console errors

### Excellent (Nice To Have):
- [ ] 98% accuracy on category
- [ ] 95% accuracy on subcategory
- [ ] < 2% user corrections
- [ ] Automated tests pass 100%

---

## 🐛 Known Issues & Workarounds

### Issue 1: Old hardcoded detection may conflict
**Workaround:** Clear browser cache

### Issue 2: TypeScript may show temporary errors
**Workaround:** Restart dev server

---

## 🧹 Cleanup Steps

After testing, if you find issues:

1. Check browser console for errors
2. verify subcategory ID is string (e.g.,'401')
3. Ensure validation runs on title change
4. Test auto-fix button click
5. Check keywords in comprehensive file

---

## 📞 Support

If issues found:
1. Document exact steps to reproduce
2. Screenshot the error
3. Check console errors
4. Note which test case failed
5. Report with details

---

## 🎯 Next Steps After Testing

### If Tests Pass (≥95%):
1. ✅ Deploy to staging
2. ✅ Monitor for 48 hours
3. ✅ Collect user feedback
4. ✅ Deploy to production

### If Tests Fail (<95%):
1. ❌ Review failed test cases
2. ❌ Add missing keywords
3. ❌ Adjust confidence thresholds
4. ❌ Re-run tests
5. ❌ Repeat until ≥95%

---

**Status:** 🟢 READY FOR TESTING  
**Estimated Testing Time:** 15-30 minutes  
**Required:** Manual + Automated testing
