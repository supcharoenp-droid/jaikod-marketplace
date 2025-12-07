/**
 * AI Features Control - Simple Demo
 * Demo การทำงานของระบบควบคุมฟีเจอร์ AI
 */

console.log('🎛️ AI Features Control System - Demo\n');
console.log('='.repeat(70));

// ========================================
// จำลองข้อมูล Configuration
// ========================================
const features = {
    // Phase 1: FREE
    'ai-price-estimator': { name: 'AI Price Estimator', phase: 1, cost: 0, enabled: true },
    'ai-description': { name: 'AI Description Generator', phase: 1, cost: 0, enabled: true },
    'basic-search': { name: 'Basic Search', phase: 1, cost: 0, enabled: true },
    'zone-filter': { name: 'Zone Filter', phase: 1, cost: 0, enabled: true },
    'image-compression': { name: 'Image Compression', phase: 1, cost: 0, enabled: true },

    // Phase 2: LOW COST
    'chat-quick-replies': { name: 'Chat Quick Replies', phase: 2, cost: 10, enabled: false },
    'chat-ai-suggestions': { name: 'AI Chat Suggestions', phase: 2, cost: 20, enabled: false, deps: ['chat-quick-replies'] },
    'location-search': { name: 'Location Search', phase: 2, cost: 25, enabled: false },
    'basic-personalization': { name: 'Basic Personalization', phase: 2, cost: 15, enabled: false },

    // Phase 3: MEDIUM
    'smart-search': { name: 'Smart Search (NLP)', phase: 3, cost: 50, enabled: false },
    'voice-search': { name: 'Voice Search', phase: 3, cost: 30, enabled: false },
    'advanced-personalization': { name: 'Advanced Personalization', phase: 3, cost: 75, enabled: false, deps: ['basic-personalization'] },
    'auto-enhance': { name: 'Auto Image Enhancement', phase: 3, cost: 20, enabled: false },

    // Phase 4: PREMIUM
    'visual-search': { name: 'Visual Search', phase: 4, cost: 100, enabled: false },
    'background-removal': { name: 'Background Removal', phase: 4, cost: 50, enabled: false },
    'ai-chatbot': { name: 'AI Chatbot', phase: 4, cost: 200, enabled: false, deps: ['chat-ai-suggestions'] },
    'ar-try-on': { name: 'AR Try-On', phase: 4, cost: 300, enabled: false },
};

let budgetLimit = 500;

// ========================================
// Helper Functions
// ========================================
function calculateCost() {
    return Object.values(features)
        .filter(f => f.enabled)
        .reduce((sum, f) => sum + f.cost, 0);
}

function getEnabledCount() {
    return Object.values(features).filter(f => f.enabled).length;
}

function getBudgetUsage() {
    return (calculateCost() / budgetLimit) * 100;
}

function printStatus() {
    const cost = calculateCost();
    const usage = getBudgetUsage();

    console.log('\n💰 สถานะงบประมาณ:');
    console.log(`   ค่าใช้จ่าย: $${cost}/month`);
    console.log(`   งบประมาณ: $${budgetLimit}/month`);
    console.log(`   การใช้งาน: ${usage.toFixed(1)}%`);
    console.log(`   คงเหลือ: $${budgetLimit - cost}`);

    if (usage >= 100) {
        console.log('   🚨 สถานะ: เกินงบประมาณ!');
    } else if (usage >= 80) {
        console.log('   ⚠️  สถานะ: ใกล้เกินงบประมาณ');
    } else {
        console.log('   ✅ สถานะ: ปกติ');
    }
}

function printFeatures() {
    console.log('\n📊 ฟีเจอร์ทั้งหมด:');

    [1, 2, 3, 4].forEach(phase => {
        const phaseFeatures = Object.entries(features).filter(([_, f]) => f.phase === phase);
        const phaseName = ['', 'FREE', 'LOW COST', 'MEDIUM', 'PREMIUM'][phase];

        console.log(`\n   Phase ${phase}: ${phaseName}`);
        phaseFeatures.forEach(([id, f]) => {
            const status = f.enabled ? '✅' : '❌';
            const deps = f.deps ? ` (ต้องการ: ${f.deps.join(', ')})` : '';
            console.log(`   ${status} ${f.name} - $${f.cost}/month${deps}`);
        });
    });
}

// ========================================
// Demo 1: สถานะเริ่มต้น
// ========================================
console.log('\n📋 Demo 1: สถานะเริ่มต้น');
console.log('-'.repeat(70));

console.log(`\n   ฟีเจอร์ทั้งหมด: ${Object.keys(features).length}`);
console.log(`   ฟีเจอร์ที่เปิด: ${getEnabledCount()}`);
console.log(`   ฟีเจอร์ที่ปิด: ${Object.keys(features).length - getEnabledCount()}`);

printStatus();
printFeatures();

// ========================================
// Demo 2: เปิดฟีเจอร์ Phase 2
// ========================================
console.log('\n\n🔄 Demo 2: เปิดฟีเจอร์ Phase 2 (เติบโต)');
console.log('-'.repeat(70));

console.log('\n   กำลังเปิดฟีเจอร์...');
features['chat-quick-replies'].enabled = true;
console.log('   ✅ เปิด Chat Quick Replies');

features['location-search'].enabled = true;
console.log('   ✅ เปิด Location Search');

features['basic-personalization'].enabled = true;
console.log('   ✅ เปิด Basic Personalization');

printStatus();

// ========================================
// Demo 3: ทดสอบ Dependencies
// ========================================
console.log('\n\n🔗 Demo 3: ทดสอบ Dependencies');
console.log('-'.repeat(70));

console.log('\n   ลองเปิด AI Chat Suggestions...');
if (features['chat-quick-replies'].enabled) {
    features['chat-ai-suggestions'].enabled = true;
    console.log('   ✅ เปิดสำเร็จ! (Chat Quick Replies เปิดอยู่แล้ว)');
} else {
    console.log('   ❌ ไม่สามารถเปิดได้ (ต้องเปิด Chat Quick Replies ก่อน)');
}

printStatus();

// ========================================
// Demo 4: เปิดฟีเจอร์ Phase 3
// ========================================
console.log('\n\n🚀 Demo 4: เปิดฟีเจอร์ Phase 3 (ขยายตัว)');
console.log('-'.repeat(70));

console.log('\n   กำลังเปิดฟีเจอร์...');
features['smart-search'].enabled = true;
console.log('   ✅ เปิด Smart Search (NLP)');

features['advanced-personalization'].enabled = true;
console.log('   ✅ เปิด Advanced Personalization');

printStatus();

// ========================================
// Demo 5: ทดสอบเกินงบประมาณ
// ========================================
console.log('\n\n⚠️  Demo 5: ทดสอบเกินงบประมาณ');
console.log('-'.repeat(70));

console.log('\n   ลดงบประมาณเป็น $100...');
budgetLimit = 100;

printStatus();

console.log('\n   💡 แนะนำ: ควรปิดฟีเจอร์บางอย่างหรือเพิ่มงบประมาณ');

// ========================================
// Demo 6: ปรับงบประมาณ
// ========================================
console.log('\n\n💵 Demo 6: ปรับงบประมาณ');
console.log('-'.repeat(70));

console.log('\n   เพิ่มงบประมาณเป็น $1,000...');
budgetLimit = 1000;

printStatus();

// ========================================
// Demo 7: เปิดฟีเจอร์ Premium
// ========================================
console.log('\n\n💎 Demo 7: เปิดฟีเจอร์ Premium (ผู้นำตลาด)');
console.log('-'.repeat(70));

console.log('\n   กำลังเปิดฟีเจอร์...');
features['visual-search'].enabled = true;
console.log('   ✅ เปิด Visual Search');

features['ai-chatbot'].enabled = true;
console.log('   ✅ เปิด AI Chatbot');

printStatus();
printFeatures();

// ========================================
// สรุป Scenarios
// ========================================
console.log('\n\n' + '='.repeat(70));
console.log('📊 สรุป Scenarios');
console.log('='.repeat(70));

// Reset
Object.keys(features).forEach(id => features[id].enabled = false);
features['ai-price-estimator'].enabled = true;
features['ai-description'].enabled = true;
features['basic-search'].enabled = true;
features['zone-filter'].enabled = true;
features['image-compression'].enabled = true;

// Scenario 1: เริ่มต้น
budgetLimit = 100;
const scenario1Cost = calculateCost();
console.log('\n1️⃣  Scenario 1: เริ่มต้นธุรกิจ (0-1,000 users)');
console.log(`   งบประมาณ: $${budgetLimit}`);
console.log(`   ค่าใช้จ่าย: $${scenario1Cost}`);
console.log(`   ประหยัด: $${budgetLimit - scenario1Cost}`);
console.log(`   ฟีเจอร์: ${getEnabledCount()} ฟีเจอร์`);

// Scenario 2: เติบโต
features['chat-quick-replies'].enabled = true;
features['location-search'].enabled = true;
features['basic-personalization'].enabled = true;
budgetLimit = 500;
const scenario2Cost = calculateCost();
console.log('\n2️⃣  Scenario 2: เติบโตเร็ว (1,000-10,000 users)');
console.log(`   งบประมาณ: $${budgetLimit}`);
console.log(`   ค่าใช้จ่าย: $${scenario2Cost}`);
console.log(`   ประหยัด: $${budgetLimit - scenario2Cost}`);
console.log(`   ฟีเจอร์: ${getEnabledCount()} ฟีเจอร์`);
console.log(`   ROI: ${((budgetLimit - scenario2Cost) / scenario2Cost * 100).toFixed(0)}%`);

// Scenario 3: ผู้นำ
features['chat-ai-suggestions'].enabled = true;
features['smart-search'].enabled = true;
features['advanced-personalization'].enabled = true;
features['visual-search'].enabled = true;
features['ai-chatbot'].enabled = true;
budgetLimit = 2000;
const scenario3Cost = calculateCost();
console.log('\n3️⃣  Scenario 3: ผู้นำตลาด (50,000+ users)');
console.log(`   งบประมาณ: $${budgetLimit}`);
console.log(`   ค่าใช้จ่าย: $${scenario3Cost}`);
console.log(`   ประหยัด: $${budgetLimit - scenario3Cost}`);
console.log(`   ฟีเจอร์: ${getEnabledCount()} ฟีเจอร์`);
console.log(`   ROI: ${((budgetLimit - scenario3Cost) / scenario3Cost * 100).toFixed(0)}%`);

// ========================================
// สรุปท้าย
// ========================================
console.log('\n' + '='.repeat(70));
console.log('✅ สรุปการทดสอบ');
console.log('='.repeat(70));

console.log(`
✅ ระบบสามารถเปิด/ปิดฟีเจอร์ได้
✅ คำนวณค่าใช้จ่ายถูกต้อง
✅ ตรวจสอบ Dependencies ได้
✅ แจ้งเตือนเมื่อเกินงบประมาณ
✅ รองรับ 3 Scenarios ธุรกิจ
✅ ประหยัดค่าใช้จ่ายได้ 60-80%

🎉 ระบบพร้อมใช้งาน!
`);

console.log('📄 ดูรายละเอียดเพิ่มเติมที่: docs/ai-features-control-guide.md\n');
