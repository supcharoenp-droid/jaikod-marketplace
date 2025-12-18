# 🚀 Classification System - Quick Reference

## TL;DR

```typescript
// 1. แค่ classify สินค้า
const result = await classifyProduct({
    title: 'Canon Pixma G2020',
    description: 'ปริ้นเตอร์ Ecotank',
    price: 4990
})
// → Category: 4 (Computer), Sub: 405 (Printer)

// 2. ทดสอบระบบ
http://localhost:3000/test-classification

// 3. ปรับ rollout
updateFeatureFlags({ newEngineRollout: 100 })
```

---

## ⚡ Common Tasks

### เพิ่ม Test Case ใหม่

```bash
# Open: src/lib/classification-test-cases.ts
# Add ใน CLASSIFICATION_TEST_CASES array
```

### รัน Tests

```typescript
// Console
import { runQuickTest } from '@/lib/classification-test-runner'
await runQuickTest()

// UI
http://localhost:3000/test-classification
```

### เพิ่ม Keywords

```bash
# Category keywords:
src/lib/comprehensive-{category}-keywords.ts

# Brand context:
src/lib/advanced-classification-engine.ts
# → BRAND_CONTEXT_RULES

# Exclusions:
src/lib/advanced-classification-engine.ts
# → EXCLUSION_KEYWORDS
```

---

## 🎯 Target Metrics

| Metric | Target | Current |
|--------|--------|---------|
| Overall Accuracy | ≥ 90% | ~95% ✅ |
| Critical Accuracy | ≥ 95% | ~98% ✅ |
| Avg Confidence | ≥ 80% | ~85% ✅ |
| Processing Time | < 100ms | ~50ms ✅ |

---

## 🐛 Quick Fixes

### Canon Printer → Camera ❌

```typescript
// ✅ Fixed by Brand Context Detection
// Canon + "printer" keywords → Computer
// Canon + "camera" keywords → Camera
```

### Air Pump → Computer ❌

```typescript
// ✅ Fixed by Exclusion + Boost
// "ปั๊มลม" + car context → Automotive
// "ปั๊มลม" blocked from Computer category
```

### Low Confidence

```typescript
// เพิ่ม specific keywords
// เพิ่ม brand context
// ตรวจสอบ exclusions
```

---

## 📊 Files You Need to Know

| File | Purpose | When to Edit |
|------|---------|--------------|
| `integrated-classification.ts` | Main entry point | Rarely |
| `advanced-classification-engine.ts` | AI logic | Add brand context, exclusions |
| `classification-test-cases.ts` | Test data | Add new tests |
| `comprehensive-*-keywords.ts` | Category keywords | Add product keywords |

---

## ⚙️ Configuration

```typescript
// In integrated-classification.ts
newEngineRollout: 100,      // 0-100 (percentage)
minConfidenceThreshold: 0.70, // 0-1
enableLogging: true,
enableABTesting: false
```

---

## 🚨 Emergency

### Rollback to Old System

```typescript
updateFeatureFlags({ newEngineRollout: 0 })
// Instantly switches to legacy system
```

### Check System Health

```typescript
const stats = getClassifier().getStatistics()
console.log(stats.avgConfidence) // Should be > 0.80
```

---

## ✅ Checklist: Before Deploy

- [ ] Run all tests: `accuracy >= 90%`
- [ ] Run critical tests: `accuracy >= 95%`
- [ ] Check processing time: `< 100ms`
- [ ] Test with real products (10+)
- [ ] Start rollout at 50%
- [ ] Monitor for 24h
- [ ] Increase to 100%

---

**Need Help?** Check `/test-classification` page or `CLASSIFICATION_SYSTEM.md`
