/**
 * Test Category Decision AI
 * 
 * Run in console to test category matching
 */

import { decideCategoryWithAI } from '@/lib/category-decision-ai'

// Test Case 1: iPhone (should match Mobile)
console.log('=== Test 1: iPhone ===')
const test1 = decideCategoryWithAI({
    title: 'iPhone 15 Pro Max 256GB',
    description: 'สมาร์ทโฟน flagship สภาพดี',
    detectedObjects: ['smartphone', 'phone'],
    imageAnalysis: 'mobile phone device'
})
console.log('Result:', test1)
console.log('Top category:', test1.recommended_categories[0])

// Test Case 2: ปั๊มลม (should match Others, NOT Computer)
console.log('\n=== Test 2: Air Pump ===')
const test2 = decideCategoryWithAI({
    title: 'ปั๊มลมพกพา Air Pump',
    description: 'เติมลมยางรถยนต์ รถจักรยานยนต์',
    detectedObjects: ['pump', 'air compressor'],
    imageAnalysis: 'air pump device'
})
console.log('Result:', test2)
console.log('Top category:', test2.recommended_categories[0])

// Test Case 3: รถยนต์ (should match Vehicle)
console.log('\n=== Test 3: Car ===')
const test3 = decideCategoryWithAI({
    title: 'Toyota Camry 2020',
    description: 'รถยนต์มือสอง สภาพดี',
    detectedObjects: ['car', 'vehicle'],
    imageAnalysis: 'car automobile'
})
console.log('Result:', test3)
console.log('Top category:', test3.recommended_categories[0])

// Test Case 4: Empty input (should get fallback)
console.log('\n=== Test 4: Empty ===')
const test4 = decideCategoryWithAI({
    title: '',
    description: '',
    detectedObjects: [],
    imageAnalysis: ''
})
console.log('Result:', test4)
console.log('Has recommendations?', test4.recommended_categories.length > 0)
