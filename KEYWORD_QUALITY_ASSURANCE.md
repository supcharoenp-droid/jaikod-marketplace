# 🔍 Keyword System Quality Assurance Plan

## 👨‍💼 As a System QA Engineer...

**Objective:** Prevent misclassification by implementing automated tests, validation rules, and feedback loops.

---

## 📋 Part 1: Test Cases (100+ Scenarios)

### 🧪 Category 4 (Computers & IT) - Test Matrix

| Test ID | Product Title | Expected Category | Expected Subcategory | Current Result | Status |
|---------|--------------|-------------------|---------------------|----------------|--------|
| TC-001 | โน๊ตบุ๊ค Acer Aspire 5 | 4 (Computers) | 401 (Laptops) | ? | ⏳ Pending |
| TC-002 | คีย์บอร์ด Razer BlackWidow | 4 (Computers) | 408 (Keyboards) | ? | ⏳ Pending |
| TC-003 | เมาส์ Logitech G502 | 4 (Computers) | 409 (Mouse) | ? | ⏳ Pending |
| TC-004 | จอคอม LG 27 นิ้ว 144Hz | 4 (Computers) | 403 (Monitors) | ? | ⏳ Pending |
| TC-005 | ปริ้นเตอร์ HP LaserJet | 4 (Computers) | 405 (Printers) | ? | ⏳ Pending |
| TC-006 | Gaming PC RTX 4090 | 4 (Computers) | 407 (Gaming PC) | ? | ⏳ Pending |
| TC-007 | RAM DDR5 32GB | 4 (Computers) | 410 (PC Parts) | ? | ⏳ Pending |
| TC-008 | Desktop PC i7 | 4 (Computers) | 402 (Desktop) | ? | ⏳ Pending |

### 🚫 Edge Cases - Should **NOT** Match Wrong Subcategory

| Test ID | Product Title | Wrong Subcategory | Reason |
|---------|--------------|-------------------|--------|
| TC-E01 | โน๊ตบุ๊ค MacBook | ❌ 408 (Keyboards) | Title has "laptop" keyword |
| TC-E02 | คีย์บอร์ดเกมมิ่ง | ❌ 401 (Laptops) | Title has "keyboard" keyword |
| TC-E03 | เมาส์ไร้สาย | ❌ 404 (Peripherals) | Should go to 409 (Mouse) |
| TC-E04 | Mechanical Keyboard | ❌ 404 (Peripherals) | Should go to 408 (Keyboards) |
| TC-E05 | Gaming Mouse RGB | ❌ 407 (Gaming PC) | Should go to 409 (Mouse) |

### 🔀 Ambiguous Cases - Multiple Valid Categories

| Test ID | Product Title | Primary Match | Secondary Match | Resolution |
|---------|--------------|---------------|-----------------|------------|
| TC-A01 | Gaming Keyboard RGB | 408 (Keyboards) | 407 (Gaming PC) | Priority: 408 (more specific) |
| TC-A02 | Laptop Keyboard | 408 (Keyboards) | 401 (Laptops) | Priority: 401 (if "laptop" keyword stronger) |
| TC-A03 | USB Hub | 404 (Peripherals) | 406 (Components) | Priority: 404 |

---

## ✅ Part 2: Validation Rules

### Rule 1: **Title-Subcategory Consistency Check**

```typescript
function validateTitleSubcategoryMatch(
    title: string,
    categoryId: number,
    subcategoryId: number
): { isValid: boolean; confidence: number; warnings: string[] } {
    
    const warnings: string[] = []
    
    // Get expected subcategory from title keywords
    const detected = detectSubcategory({
        categoryId,
        title,
        description: '',
    })
    
    // If detected subcategory doesn't match selected
    if (detected && detected.subcategoryId !== String(subcategoryId)) {
        warnings.push(
            `⚠️ Title contains "${detected.matchedKeywords.join(', ')}" ` +
            `which suggests ${detected.subcategoryName}, ` +
            `but you selected subcategory ${subcategoryId}`
        )
    }
    
    // Calculate confidence (0-1)
    const confidence = detected?.confidence || 0
    
    return {
        isValid: confidence >= 0.4,
        confidence,
        warnings
    }
}
```

### Rule 2: **Conflicting Keywords Detection**

```typescript
function detectConflictingKeywords(
    title: string,
    categoryId: number
): { conflicts: Array<{ keyword: string; subcategoryId: number }> } {
    
    const conflicts: Array<{ keyword: string; subcategoryId: number }> = []
    
    // Example: If title has both "laptop" and "keyboard"
    const titleLower = title.toLowerCase()
    
    // Check for laptop keywords
    if (titleLower.includes('โน๊ตบุ๊ค') || titleLower.includes('laptop')) {
        // Also check for keyboard keywords
        if (titleLower.includes('คีย์บอร์ด') || titleLower.includes('keyboard')) {
            conflicts.push({
                keyword: 'laptop + keyboard',
                subcategoryId: 0  // Ambiguous
            })
        }
    }
    
    return { conflicts }
}
```

### Rule 3: **Minimum Keyword Match Score**

```typescript
// Require at least 2 keyword matches OR 1 exact model number
const MIN_KEYWORD_MATCHES = 2
const MIN_CONFIDENCE_THRESHOLD = 0.4

function meetsMinimumRequirements(matched: string[]): boolean {
    return matched.length >= MIN_KEYWORD_MATCHES
}
```

---

## 🤖 Part 3: Automated Testing Script

### Test Runner Implementation

```typescript
// test/keyword-quality-test.ts

import { detectSubcategory } from '@/lib/subcategory-intelligence'
import { CATEGORIES } from '@/constants/categories'

interface TestCase {
    id: string
    title: string
    expectedCategory: number
    expectedSubcategory: number
    description?: string
}

const TEST_CASES: TestCase[] = [
    // Laptops (401)
    { id: 'TC-001', title: 'โน๊ตบุ๊ค Acer Aspire 5', expectedCategory: 4, expectedSubcategory: 401 },
    { id: 'TC-002', title: 'MacBook Pro M3 16GB', expectedCategory: 4, expectedSubcategory: 401 },
    { id: 'TC-003', title: 'Gaming Laptop ASUS ROG', expectedCategory: 4, expectedSubcategory: 401 },
    
    // Keyboards (408)
    { id: 'TC-004', title: 'คีย์บอร์ด Razer BlackWidow', expectedCategory: 4, expectedSubcategory: 408 },
    { id: 'TC-005', title: 'Mechanical Keyboard Keychron K2', expectedCategory: 4, expectedSubcategory: 408 },
    { id: 'TC-006', title: 'Gaming Keyboard RGB', expectedCategory: 4, expectedSubcategory: 408 },
    
    // Mouse (409)
    { id: 'TC-007', title: 'เมาส์ Logitech G502', expectedCategory: 4, expectedSubcategory: 409 },
    { id: 'TC-008', title: 'Wireless Mouse', expectedCategory: 4, expectedSubcategory: 409 },
    { id: 'TC-009', title: 'Gaming Mouse Razer Viper', expectedCategory: 4, expectedSubcategory: 409 },
    
    // Monitors (403)
    { id: 'TC-010', title: 'จอคอม LG 27 นิ้ว', expectedCategory: 4, expectedSubcategory: 403 },
    { id: 'TC-011', title: 'Gaming Monitor 144Hz', expectedCategory: 4, expectedSubcategory: 403 },
    { id: 'TC-012', title: '4K Monitor Samsung', expectedCategory: 4, expectedSubcategory: 403 },
    
    // Printers (405)
    { id: 'TC-013', title: 'ปริ้นเตอร์ HP LaserJet', expectedCategory: 4, expectedSubcategory: 405 },
    { id: 'TC-014', title: 'Epson EcoTank L3150', expectedCategory: 4, expectedSubcategory: 405 },
    { id: 'TC-015', title: 'Canon Printer G2010', expectedCategory: 4, expectedSubcategory: 405 },
]

export function runKeywordQualityTests() {
    console.log('🧪 Running Keyword Quality Tests...\n')
    
    let passed = 0
    let failed = 0
    const failures: Array<{ testId: string; reason: string }> = []
    
    TEST_CASES.forEach(test => {
        const result = detectSubcategory({
            categoryId: test.expectedCategory,
            title: test.title,
            description: test.description || '',
        })
        
        const actualSubcategory = result ? parseInt(result.subcategoryId) : null
        const isCorrect = actualSubcategory === test.expectedSubcategory
        
        if (isCorrect) {
            passed++
            console.log(`✅ ${test.id}: PASSED - "${test.title}" → ${result?.subcategoryName}`)
        } else {
            failed++
            const reason = result
                ? `Got ${result.subcategoryName} (${result.subcategoryId}), expected ${test.expectedSubcategory}`
                : `No subcategory detected, expected ${test.expectedSubcategory}`
            
            failures.push({ testId: test.id, reason })
            console.log(`❌ ${test.id}: FAILED - "${test.title}"`)
            console.log(`   ${reason}`)
            console.log(`   Confidence: ${result?.confidence || 0}`)
            console.log(`   Matched: ${result?.matchedKeywords.join(', ') || 'none'}`)
        }
    })
    
    console.log('\n📊 Test Results:')
    console.log(`Total: ${TEST_CASES.length}`)
    console.log(`✅ Passed: ${passed} (${(passed / TEST_CASES.length * 100).toFixed(1)}%)`)
    console.log(`❌ Failed: ${failed} (${(failed / TEST_CASES.length * 100).toFixed(1)}%)`)
    
    if (failures.length > 0) {
        console.log('\n🔍 Failures:')
        failures.forEach(f => console.log(`  - ${f.testId}: ${f.reason}`))
    }
    
    return {
        total: TEST_CASES.length,
        passed,
        failed,
        successRate: (passed / TEST_CASES.length) * 100,
        failures
    }
}
```

### Running the Tests

```bash
# Run in Node.js (create test file)
npm run test:keywords

# Or create a test page
# Visit: http://localhost:3000/test/keywords
```

---

## 📊 Part 4: Keyword Quality Metrics

### Metrics to Track

1. **Match Accuracy**
   - % of products correctly categorized
   - Target: ≥ 95%

2. **Confidence Distribution**
   - How many products have confidence ≥ 0.8?
   - Chart: Low (0-0.4), Medium (0.4-0.7), High (0.7-1.0)

3. **Keyword Coverage**
   - % of keywords actually used
   - Identify unused keywords → Remove or improve

4. **Conflict Rate**
   - % of products matching multiple subcategories
   - Target: ≤ 5%

### Quality Dashboard (Concept)

```
╔════════════════════════════════════════════════════╗
║  📊 Keyword Quality Dashboard                     ║
╠════════════════════════════════════════════════════╣
║                                                    ║
║  Overall Accuracy:        ████████░░  87.5%       ║
║  High Confidence (≥0.8):  ██████░░░░  65.2%       ║
║  Conflicts Detected:      █░░░░░░░░░   8.3%       ║
║                                                    ║
║  Top Issues:                                       ║
║  1. ⚠️ Laptop/Keyboard confusion (12 cases)       ║
║  2. ⚠️ Mouse → Peripherals (8 cases)              ║
║  3. ⚠️ Gaming PC vs Components (5 cases)          ║
║                                                    ║
╚════════════════════════════════════════════════════╝
```

---

## 🔄 Part 5: User Feedback Loop

### Capture Misclassifications

```typescript
// When user manually changes category/subcategory
function logCategoryCorrection(data: {
    productId: string
    originalTitle: string
    aiCategory: number
    aiSubcategory: number
    userCategory: number
    userSubcategory: number
    timestamp: Date
}) {
    // Save to database for analysis
    await db.collection('category_corrections').add(data)
    
    // If this is a common pattern, update keywords
    analyzeAndSuggestKeywordUpdates(data)
}
```

### Weekly Report

```typescript
// Generate report of most common corrections
async function generateWeeklyReport() {
    const corrections = await db.collection('category_corrections')
        .where('timestamp', '>=', oneWeekAgo())
        .get()
    
    const analysis = analyzePatterns(corrections)
    
    return {
        totalCorrections: corrections.length,
        topMisclassifications: analysis.top10,
        suggestedKeywordAdditions: analysis.suggestions,
        trendsDetected: analysis.trends
    }
}
```

---

## 🛠️ Part 6: Keyword Maintenance Tools

### Tool 1: Keyword Conflict Detector

```typescript
// Find keywords that appear in multiple subcategories
function detectKeywordConflicts() {
    const allKeywords = new Map<string, number[]>()
    
    Object.entries(COMPUTER_SUBCATEGORY_KEYWORDS).forEach(([subId, keywords]) => {
        keywords.forEach(kw => {
            if (!allKeywords.has(kw)) {
                allKeywords.set(kw, [])
            }
            allKeywords.get(kw)!.push(parseInt(subId))
        })
    })
    
    // Find conflicts
    const conflicts: Array<{ keyword: string; subcategories: number[] }> = []
    
    allKeywords.forEach((subcats, keyword) => {
        if (subcats.length > 1) {
            conflicts.push({ keyword, subcategories: subcats })
        }
    })
    
    return conflicts
}

// Example output:
// [
//   { keyword: 'gaming', subcategories: [407, 408, 409] },
//   { keyword: 'rgb', subcategories: [407, 408, 409] }
// ]
```

### Tool 2: Unused Keyword Finder

```typescript
// Find keywords that never match
async function findUnusedKeywords(logs: ProductLog[]) {
    const usedKeywords = new Set<string>()
    
    logs.forEach(log => {
        log.matchedKeywords?.forEach(kw => usedKeywords.add(kw))
    })
    
    const allKeywords = Object.values(COMPUTER_SUBCATEGORY_KEYWORDS).flat()
    const unused = allKeywords.filter(kw => !usedKeywords.has(kw))
    
    return {
        total: allKeywords.length,
        used: usedKeywords.size,
        unused: unused.length,
        unusedKeywords: unused
    }
}
```

### Tool 3: Keyword Effectiveness Score

```typescript
// Score each keyword by how often it leads to correct classification
function calculateKeywordEffectiveness(history: ProductLog[]) {
    const scores = new Map<string, { correct: number; total: number }>()
    
    history.forEach(log => {
        const isCorrect = log.finalCategory === log.aiCategory
        
        log.matchedKeywords?.forEach(kw => {
            if (!scores.has(kw)) {
                scores.set(kw, { correct: 0, total: 0 })
            }
            const score = scores.get(kw)!
            score.total++
            if (isCorrect) score.correct++
        })
    })
    
    // Calculate accuracy for each keyword
    const ranked = Array.from(scores.entries())
        .map(([kw, stats]) => ({
            keyword: kw,
            accuracy: stats.correct / stats.total,
            usageCount: stats.total
        }))
        .sort((a, b) => b.accuracy - a.accuracy)
    
    return ranked
}
```

---

## 📋 Part 7: Implementation Checklist

### Phase 1: Setup Testing ✅
- [x] Create test case file
- [ ] Implement test runner
- [ ] Create test page at `/test/keywords`
- [ ] Run initial baseline tests
- [ ] Document failures

### Phase 2: Add Validation ✅
- [ ] Add `validateTitleSubcategoryMatch()` to listing form
- [ ] Show warnings to users when mismatch detected
- [ ] Add confidence score display
- [ ] Implement conflict detection

### Phase 3: Monitoring ⏳
- [ ] Add logging for AI decisions
- [ ] Track user corrections
- [ ] Generate weekly reports
- [ ] Create analytics dashboard

### Phase 4: Maintenance ⏳
- [ ] Run keyword conflict detector
- [ ] Review unused keywords
- [ ] Calculate effectiveness scores
- [ ] Update keywords based on data

---

## 🎯 Success Criteria

**Minimum Acceptable:**
✅ 90% accuracy for top 20 products per subcategory  
✅ ≤ 10% conflict rate  
✅ ≤ 5% user corrections per week  

**Target:**
🎯 95% accuracy  
🎯 ≤ 5% conflict rate  
🎯 ≤ 2% user corrections  

**Excellent:**
🌟 98% accuracy  
🌟 ≤ 2% conflict rate  
🌟 ≤ 1% user corrections  

---

## 📝 Immediate Actions (Next 48 Hours)

1. **Create Test Script** (`test/keyword-test.ts`)
2. **Run Baseline Test** on 50 real product titles
3. **Document Current Performance**
4. **Fix Top 3 Issues** (likely: laptop/keyboard, mouse/peripherals, gaming confusion)
5. **Re-run Tests** and measure improvement

---

**Created:** 2025-12-17 18:10  
**Purpose:** Ensure keyword system quality and prevent misclassifications  
**Status:** 🟡 Ready to implement  
**Owner:** QA Team
