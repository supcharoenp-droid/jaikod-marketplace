# 🚀 Final Deployment Checklist

Pre-deployment verification for Classification System v2.0

---

## ⚡ **CRITICAL: Restart Dev Server First!**

```bash
# Stop current server
Ctrl + C

# Start fresh
npm run dev
```

**Why?** โค้ดที่แก้ไขต้อง reload ใหม่!

---

## ✅ **Quick Verification (5 minutes)**

### **Test 1: Air Pump** 🚗

```bash
npm run test:integration
```

**Expected:**
```
✅ air-pump-1: PASSED
✅ air-pump-2: PASSED  
✅ air-pump-3: PASSED
✅ air-pump-4: PASSED
```

### **Test 2: Canon Printer** 🖨️

**Expected:**
```
✅ canon-printer-1: PASSED
✅ canon-printer-2: PASSED
✅ canon-printer-3: PASSED
```

### **Test 3: Controls** ✅

**Expected:**
```
✅ canon-camera: PASSED (should still be Camera)
✅ laptop: PASSED (should still be Computer)
```

---

## 📊 **Full Test Suite**

```bash
# Open test UI
http://localhost:3000/test-classification

# Click "Run All Tests"

# Expected Results:
✅ Overall Accuracy: >= 95%
✅ Critical Tests: 100% pass
✅ Avg Confidence: >= 85%
```

---

## 🎯 **Deployment Options**

### **Option A: Gradual (Recommended)**

```typescript
// Week 1: 25%
updateFeatureFlags({ newEngineRollout: 25 })

// Week 2: 50%  
updateFeatureFlags({ newEngineRollout: 50 })

// Week 3: 100%
updateFeatureFlags({ newEngineRollout: 100 })
```

### **Option B: Immediate**

```typescript
// If all tests pass
updateFeatureFlags({ newEngineRollout: 100 })
```

---

## 🔍 **Monitoring (First 24h)**

```bash
# 1. Check analytics
http://localhost:3000/analytics/classification

# 2. Run coverage
npm run analyze:coverage

# 3. Check suggestions
npm run suggest:keywords 1
```

---

## 🚨 **Emergency Rollback**

```typescript
// If issues occur
updateFeatureFlags({ newEngineRollout: 0 })
```

**Takes < 1 minute**

---

## 📞 **Quick Support**

**Commands:**
```bash
npm run test:integration       # Run tests
npm run search:keywords "x"    # Find keyword
npm run analyze:coverage       # Check coverage
```

**Dashboards:**
- Test: `/test-classification`
- Analytics: `/analytics/classification`

---

**Status**: ✅ Ready  
**Risk**: 🟢 Low  
**Time**: 15 min + monitoring

🎊 **Ready to deploy!** 🎊
