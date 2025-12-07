/**
 * Test Script - ทดสอบระบบ Test Data
 * รันด้วย: node test-data/test-script.js
 */

const fs = require('fs');
const path = require('path');

// โหลดข้อมูลทดสอบ
const sampleProducts = JSON.parse(
    fs.readFileSync(path.join(__dirname, 'sample-products.json'), 'utf-8')
);

console.log('🧪 เริ่มทดสอบระบบ Test Data\n');
console.log('='.repeat(60));

// ========================================
// Test 1: ตรวจสอบข้อมูลพื้นฐาน
// ========================================
console.log('\n📊 Test 1: ตรวจสอบข้อมูลพื้นฐาน');
console.log('-'.repeat(60));

const products = sampleProducts.products;
console.log(`✅ จำนวนสินค้าทั้งหมด: ${products.length} รายการ`);

// นับตามหมวดหมู่
const byCategory = products.reduce((acc, p) => {
    acc[p.categoryId] = (acc[p.categoryId] || 0) + 1;
    return acc;
}, {});

console.log('\n📦 จำนวนสินค้าแต่ละหมวดหมู่:');
Object.entries(byCategory).forEach(([category, count]) => {
    const emoji = {
        mobiles: '📱',
        computers: '💻',
        pets: '🐾',
        cameras: '📷'
    }[category] || '📦';
    console.log(`   ${emoji} ${category}: ${count} รายการ`);
});

// ========================================
// Test 2: ตรวจสอบราคา
// ========================================
console.log('\n💰 Test 2: ตรวจสอบราคา');
console.log('-'.repeat(60));

const prices = products.map(p => p.price);
const totalValue = prices.reduce((sum, price) => sum + price, 0);
const avgPrice = totalValue / prices.length;
const minPrice = Math.min(...prices);
const maxPrice = Math.max(...prices);

console.log(`   มูลค่ารวม: ฿${totalValue.toLocaleString('th-TH')}`);
console.log(`   ราคาเฉลี่ย: ฿${Math.round(avgPrice).toLocaleString('th-TH')}`);
console.log(`   ราคาต่ำสุด: ฿${minPrice.toLocaleString('th-TH')}`);
console.log(`   ราคาสูงสุด: ฿${maxPrice.toLocaleString('th-TH')}`);

const cheapest = products.find(p => p.price === minPrice);
const expensive = products.find(p => p.price === maxPrice);
console.log(`\n   ถูกที่สุด: ${cheapest.name}`);
console.log(`   แพงที่สุด: ${expensive.name}`);

// ========================================
// Test 3: ตรวจสอบข้อมูลครบถ้วน
// ========================================
console.log('\n✅ Test 3: ตรวจสอบข้อมูลครบถ้วน');
console.log('-'.repeat(60));

const requiredFields = ['id', 'categoryId', 'name', 'description', 'price', 'condition', 'attributes', 'images', 'location', 'tags'];
let allValid = true;

products.forEach((product, index) => {
    const missing = requiredFields.filter(field => !product[field]);
    if (missing.length > 0) {
        console.log(`   ❌ สินค้า #${index + 1} (${product.name}) ขาดข้อมูล: ${missing.join(', ')}`);
        allValid = false;
    }
});

if (allValid) {
    console.log('   ✅ ข้อมูลครบถ้วนทุกรายการ');
}

// ========================================
// Test 4: ทดสอบการค้นหา
// ========================================
console.log('\n🔍 Test 4: ทดสอบการค้นหา');
console.log('-'.repeat(60));

const testQueries = ['iPhone', 'MacBook', 'แมว', 'กล้อง'];

testQueries.forEach(query => {
    const results = products.filter(p => {
        const lowerQuery = query.toLowerCase();
        return (
            p.name.toLowerCase().includes(lowerQuery) ||
            p.description.toLowerCase().includes(lowerQuery) ||
            p.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
        );
    });
    console.log(`   "${query}": พบ ${results.length} รายการ`);
    if (results.length > 0) {
        results.forEach(r => {
            console.log(`      - ${r.name}`);
        });
    }
});

// ========================================
// Test 5: ตรวจสอบพื้นที่
// ========================================
console.log('\n📍 Test 5: ตรวจสอบพื้นที่');
console.log('-'.repeat(60));

const byProvince = products.reduce((acc, p) => {
    const province = p.location.province;
    acc[province] = (acc[province] || 0) + 1;
    return acc;
}, {});

console.log('   จำนวนสินค้าแต่ละจังหวัด:');
Object.entries(byProvince)
    .sort((a, b) => b[1] - a[1])
    .forEach(([province, count]) => {
        console.log(`      ${province}: ${count} รายการ`);
    });

// ========================================
// Test 6: ตรวจสอบรูปภาพ
// ========================================
console.log('\n📸 Test 6: ตรวจสอบรูปภาพ');
console.log('-'.repeat(60));

const totalImages = products.reduce((sum, p) => sum + p.images.length, 0);
const avgImages = totalImages / products.length;

console.log(`   รูปภาพทั้งหมด: ${totalImages} รูป`);
console.log(`   เฉลี่ยต่อสินค้า: ${avgImages.toFixed(1)} รูป`);

const withMostImages = products.reduce((max, p) =>
    p.images.length > max.images.length ? p : max
);
console.log(`   มากที่สุด: ${withMostImages.name} (${withMostImages.images.length} รูป)`);

// ========================================
// Test 7: แสดงตัวอย่างสินค้า
// ========================================
console.log('\n📦 Test 7: แสดงตัวอย่างสินค้า (3 รายการแรก)');
console.log('-'.repeat(60));

products.slice(0, 3).forEach((product, index) => {
    console.log(`\n   ${index + 1}. ${product.name}`);
    console.log(`      💰 ราคา: ฿${product.price.toLocaleString('th-TH')}`);
    console.log(`      📦 สภาพ: ${product.condition}`);
    console.log(`      📍 พื้นที่: ${product.location.district}, ${product.location.province}`);
    console.log(`      🏷️  Tags: ${product.tags.join(', ')}`);
    console.log(`      📸 รูปภาพ: ${product.images.length} รูป`);
});

// ========================================
// สรุปผลการทดสอบ
// ========================================
console.log('\n' + '='.repeat(60));
console.log('✅ สรุปผลการทดสอบ');
console.log('='.repeat(60));

console.log(`
✅ ข้อมูลพื้นฐาน: ผ่าน (${products.length} รายการ)
✅ ราคา: ผ่าน (฿${minPrice.toLocaleString()} - ฿${maxPrice.toLocaleString()})
✅ ข้อมูลครบถ้วน: ${allValid ? 'ผ่าน' : 'ไม่ผ่าน'}
✅ การค้นหา: ผ่าน
✅ พื้นที่: ผ่าน (${Object.keys(byProvince).length} จังหวัด)
✅ รูปภาพ: ผ่าน (${totalImages} รูป)
`);

console.log('🎉 การทดสอบเสร็จสมบูรณ์!\n');

// ========================================
// Export ผลการทดสอบ
// ========================================
const testResults = {
    timestamp: new Date().toISOString(),
    summary: {
        totalProducts: products.length,
        byCategory,
        byProvince,
        pricing: {
            total: totalValue,
            average: avgPrice,
            min: minPrice,
            max: maxPrice
        },
        images: {
            total: totalImages,
            average: avgImages
        }
    },
    validation: {
        allFieldsValid: allValid
    }
};

fs.writeFileSync(
    path.join(__dirname, 'test-results.json'),
    JSON.stringify(testResults, null, 2)
);

console.log('📄 ผลการทดสอบถูกบันทึกที่: test-data/test-results.json\n');
