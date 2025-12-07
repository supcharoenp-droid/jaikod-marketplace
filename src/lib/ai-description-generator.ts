/**
 * AI Description Generator
 * ระบบสร้างรายละเอียดสินค้าอัจฉริยะโดยใช้ Category Schema และ AI
 */

import { getCategorySchema, getAIDescriptionTemplate, type AIDescriptionTemplate } from '@/config/category-schemas';

export interface GenerateDescriptionInput {
    categoryId: string;
    attributes: Record<string, any>;
    images?: string[];
    sellerNotes?: string; // บันทึกเพิ่มเติมจากผู้ขาย
    tone?: 'casual' | 'professional' | 'enthusiastic'; // โทนการเขียน
}

export interface GeneratedDescription {
    title: string; // หัวข้อสินค้า
    description: string; // รายละเอียดเต็ม
    highlights: string[]; // จุดเด่น (bullet points)
    tags: string[]; // แท็กสำหรับค้นหา
    seoKeywords: string[]; // คำค้นหา SEO
}

/**
 * สร้างรายละเอียดสินค้าโดยใช้ AI
 */
export async function generateProductDescription(
    input: GenerateDescriptionInput
): Promise<GeneratedDescription> {
    const schema = getCategorySchema(input.categoryId);
    const template = getAIDescriptionTemplate(input.categoryId);

    if (!schema || !template) {
        throw new Error(`Schema or template not found for category: ${input.categoryId}`);
    }

    // 1. สร้างหัวข้อสินค้า
    const title = generateTitle(input, schema);

    // 2. สร้างรายละเอียดตาม Template
    const description = await generateDescriptionFromTemplate(input, template);

    // 3. สร้างจุดเด่น
    const highlights = generateHighlights(input, schema);

    // 4. สร้างแท็ก
    const tags = generateTags(input, schema);

    // 5. สร้าง SEO Keywords
    const seoKeywords = generateSEOKeywords(input, schema);

    return {
        title,
        description,
        highlights,
        tags,
        seoKeywords
    };
}

/**
 * สร้างหัวข้อสินค้า
 */
function generateTitle(input: GenerateDescriptionInput, schema: any): string {
    const { categoryId, attributes } = input;

    switch (categoryId) {
        case 'mobiles':
            return `${attributes.brand || ''} ${attributes.model || ''} ${attributes.storage || ''} ${attributes.condition || ''}`.trim();

        case 'computers':
            return `${attributes.brand || ''} ${attributes.model || ''} ${attributes.processor || ''} ${attributes.ram || ''} ${attributes.condition || ''}`.trim();

        case 'pets':
            return `${attributes.petType || ''} ${attributes.breed || ''} ${attributes.age || ''} ${attributes.gender || ''}`.trim();

        case 'cameras':
            return `${attributes.brand || ''} ${attributes.model || ''} ${attributes.sensor || ''} ${attributes.condition || ''}`.trim();

        default:
            return `${attributes.brand || ''} ${attributes.model || ''}`.trim();
    }
}

/**
 * สร้างรายละเอียดจาก Template
 */
async function generateDescriptionFromTemplate(
    input: GenerateDescriptionInput,
    template: AIDescriptionTemplate
): Promise<string> {
    const sections: string[] = [];

    // สร้างแต่ละส่วนตาม Template Structure
    for (const sectionType of template.structure) {
        const sectionContent = generateSection(sectionType, input, template);
        if (sectionContent) {
            sections.push(sectionContent);
        }
    }

    return sections.join('\n\n');
}

/**
 * สร้างเนื้อหาแต่ละส่วน
 */
function generateSection(
    sectionType: string,
    input: GenerateDescriptionInput,
    template: AIDescriptionTemplate
): string {
    const { categoryId, attributes, sellerNotes } = input;

    switch (sectionType) {
        case 'intro':
            return generateIntroSection(categoryId, attributes);

        case 'specs':
            return generateSpecsSection(categoryId, attributes);

        case 'condition':
            return generateConditionSection(categoryId, attributes);

        case 'accessories':
            return generateAccessoriesSection(categoryId, attributes);

        case 'highlights':
            return generateHighlightsSection(categoryId, attributes);

        case 'usage':
            return generateUsageSection(categoryId, attributes);

        case 'performance':
            return generatePerformanceSection(categoryId, attributes);

        case 'personality':
            return generatePersonalitySection(categoryId, attributes);

        case 'health':
            return generateHealthSection(categoryId, attributes);

        case 'care_tips':
            return generateCareTipsSection(categoryId, attributes);

        case 'adoption_info':
            return generateAdoptionInfoSection(categoryId, attributes);

        case 'breed_info':
            return generateBreedInfoSection(categoryId, attributes);

        case 'image_quality':
            return generateImageQualitySection(categoryId, attributes);

        default:
            return '';
    }
}

// ========================================
// SECTION GENERATORS - MOBILE PHONES
// ========================================

function generateIntroSection(categoryId: string, attributes: any): string {
    switch (categoryId) {
        case 'mobiles':
            return `🔥 ${attributes.brand} ${attributes.model} ${attributes.storage} สภาพ${attributes.condition || 'ดี'} พร้อมใช้งาน! เครื่องแท้ ไม่มีปัญหา เหมาะสำหรับคนที่กำลังมองหาโทรศัพท์คุณภาพในราคาที่คุ้มค่า`;

        case 'computers':
            return `💻 ${attributes.brand} ${attributes.model} สเปคแรง ${attributes.processor} พร้อม RAM ${attributes.ram} เหมาะสำหรับ${attributes.type === 'Gaming Laptop' ? 'เล่นเกม' : 'ทำงาน'}และใช้งานหนัก`;

        case 'pets':
            return `🐾 ${attributes.petType}${attributes.breed} อายุ ${attributes.age} น่ารักมาก หาบ้านใหม่ที่อบอุ่น พร้อมมอบความรักและความสุขให้กับครอบครัวของคุณ`;

        case 'cameras':
            return `📸 ${attributes.brand} ${attributes.model} กล้อง${attributes.type} คุณภาพระดับมืออาชีพ เหมาะสำหรับช่างภาพที่ต้องการคุณภาพภาพสูง`;

        default:
            return '';
    }
}

function generateSpecsSection(categoryId: string, attributes: any): string {
    switch (categoryId) {
        case 'mobiles':
            return `📱 **สเปค**
- ยี่ห้อ: ${attributes.brand}
- รุ่น: ${attributes.model}
- ความจุ: ${attributes.storage}
- RAM: ${attributes.ram || 'ตามสเปคมาตรฐาน'}
- สี: ${attributes.color || 'ตามรูป'}
${attributes.batteryHealth ? `- สุขภาพแบตเตอรี่: ${attributes.batteryHealth}%` : ''}`;

        case 'computers':
            return `💻 **สเปค**
- ประเภท: ${attributes.type}
- ยี่ห้อ: ${attributes.brand}
- รุ่น: ${attributes.model}
- CPU: ${attributes.processor}
- RAM: ${attributes.ram}
- Storage: ${attributes.storage}
${attributes.gpu ? `- GPU: ${attributes.gpu}` : ''}
${attributes.screenSize ? `- หน้าจอ: ${attributes.screenSize}` : ''}
${attributes.os ? `- OS: ${attributes.os}` : ''}`;

        case 'cameras':
            return `📸 **สเปค**
- ประเภท: ${attributes.type}
- ยี่ห้อ: ${attributes.brand}
- รุ่น: ${attributes.model}
${attributes.megapixels ? `- ความละเอียด: ${attributes.megapixels} MP` : ''}
${attributes.sensor ? `- เซ็นเซอร์: ${attributes.sensor}` : ''}
${attributes.shutterCount ? `- Shutter Count: ${attributes.shutterCount.toLocaleString()} ครั้ง` : ''}`;

        default:
            return '';
    }
}

function generateConditionSection(categoryId: string, attributes: any): string {
    const condition = attributes.condition || '';
    const warranty = attributes.warranty || '';

    let conditionText = '';

    if (categoryId === 'mobiles' || categoryId === 'computers' || categoryId === 'cameras') {
        conditionText = `✨ **สภาพสินค้า**
- สภาพ: ${condition}`;

        if (condition.includes('มือสอง')) {
            conditionText += `
- ตัวเครื่อง: ${getConditionDetail(condition, 'body')}
- หน้าจอ: ${getConditionDetail(condition, 'screen')}
- การทำงาน: ปกติทุกอย่าง ไม่มีปัญหา`;
        }

        if (warranty) {
            conditionText += `\n- การรับประกัน: ${warranty}`;
        }

        if (categoryId === 'mobiles' && attributes.batteryHealth) {
            const batteryHealth = attributes.batteryHealth;
            let batteryStatus = '';
            if (batteryHealth >= 90) batteryStatus = 'แบตเตอรี่สุขภาพดีมาก';
            else if (batteryHealth >= 80) batteryStatus = 'แบตเตอรี่สุขภาพดี';
            else if (batteryHealth >= 70) batteryStatus = 'แบตเตอรี่สุขภาพปานกลาง';
            else batteryStatus = 'แบตเตอรี่ควรเปลี่ยน';

            conditionText += `\n- ${batteryStatus} (${batteryHealth}%)`;
        }
    }

    return conditionText;
}

function generateAccessoriesSection(categoryId: string, attributes: any): string {
    const accessories = attributes.accessories || [];

    if (accessories.length === 0) {
        return '📦 **อุปกรณ์ที่มาด้วย**\n- ตัวเครื่องอย่างเดียว';
    }

    const accessoryList = accessories.map((item: string) => `- ${item}`).join('\n');
    return `📦 **อุปกรณ์ที่มาด้วย**\n${accessoryList}`;
}

function generateHighlightsSection(categoryId: string, attributes: any): string {
    const highlights: string[] = [];

    switch (categoryId) {
        case 'mobiles':
            if (attributes.warranty === 'ยังไม่หมดประกัน') {
                highlights.push('✅ ยังอยู่ในประกัน');
            }
            if (attributes.batteryHealth >= 85) {
                highlights.push('🔋 แบตเตอรี่สุขภาพดี');
            }
            if (attributes.condition?.includes('ใหม่')) {
                highlights.push('🆕 สภาพใหม่');
            }
            highlights.push('📱 พร้อมใช้งานทันที');
            break;

        case 'computers':
            if (attributes.gpu) {
                highlights.push('🎮 มีการ์ดจอแยก เล่นเกมได้');
            }
            if (attributes.ram >= '16GB') {
                highlights.push('⚡ RAM สูง ทำงานได้หลายโปรแกรม');
            }
            if (attributes.storage?.includes('SSD')) {
                highlights.push('💨 SSD เร็วแรง');
            }
            break;

        case 'cameras':
            if (attributes.sensor === 'Full Frame') {
                highlights.push('📷 Full Frame คุณภาพสูง');
            }
            if (attributes.shutterCount < 10000) {
                highlights.push('✨ Shutter Count ต่ำ');
            }
            if (attributes.lens) {
                highlights.push('🎯 มาพร้อมเลนส์');
            }
            break;
    }

    if (highlights.length === 0) return '';

    return `💎 **จุดเด่น**\n${highlights.map(h => `- ${h}`).join('\n')}`;
}

function generateUsageSection(categoryId: string, attributes: any): string {
    switch (categoryId) {
        case 'mobiles':
            return `👥 **เหมาะสำหรับ**
- ใช้งานทั่วไป โซเชียล ถ่ายรูป
- คนที่ต้องการโทรศัพท์คุณภาพในราคาคุ้มค่า
- อัพเกรดจากเครื่องเก่า`;

        case 'computers':
            if (attributes.type === 'Gaming Laptop') {
                return `👥 **เหมาะสำหรับ**
- เล่นเกม Streaming
- ตัดต่อวิดีโอ ทำงานกราฟิก
- นักศึกษา โปรแกรมเมอร์`;
            }
            return `👥 **เหมาะสำหรับ**
- ทำงาน เรียนออนไลน์
- ใช้งานทั่วไป Office
- พกพาสะดวก`;

        case 'cameras':
            return `👥 **เหมาะสำหรับ**
- ช่างภาพมืออาชีพและกึ่งมืออาชีพ
- ถ่ายงานอีเว้นท์ งานแต่ง
- สายถ่ายรูป ถ่ายวิดีโอ`;

        default:
            return '';
    }
}

function generatePerformanceSection(categoryId: string, attributes: any): string {
    if (categoryId !== 'computers') return '';

    return `⚡ **ประสิทธิภาพ**
- ${attributes.processor} ทำงานได้เร็วและลื่นไหล
- RAM ${attributes.ram} รองรับการทำงานหลายโปรแกรมพร้อมกัน
- ${attributes.storage} เพียงพอสำหรับเก็บไฟล์งานและโปรแกรม
${attributes.gpu ? `- ${attributes.gpu} เล่นเกมและทำงานกราฟิกได้ลื่น` : ''}`;
}

// ========================================
// SECTION GENERATORS - PETS
// ========================================

function generatePersonalitySection(categoryId: string, attributes: any): string {
    if (categoryId !== 'pets') return '';

    const personality = attributes.personality || [];
    if (personality.length === 0) return '';

    return `😊 **นิสัย**
${personality.map((trait: string) => `- ${trait}`).join('\n')}`;
}

function generateHealthSection(categoryId: string, attributes: any): string {
    if (categoryId !== 'pets') return '';

    return `🏥 **สุขภาพ**
- สุขภาพ: ${attributes.health || 'แข็งแรงดี'}
- วัคซีน: ${attributes.vaccinated || 'ยังไม่ได้ฉีด'}
${attributes.sterilized ? `- ทำหมัน: ${attributes.sterilized}` : ''}
${attributes.pedigree ? `- ใบเพ็ดดิกรี: ${attributes.pedigree}` : ''}`;
}

function generateCareTipsSection(categoryId: string, attributes: any): string {
    if (categoryId !== 'pets') return '';

    const petType = attributes.petType || '';

    if (petType === 'สุนัข') {
        return `🐕 **การดูแล**
- ควรพาออกกำลังกายทุกวัน
- อาบน้ำสัปดาห์ละ 1-2 ครั้ง
- ให้อาหารคุณภาพดี วันละ 2 มื้อ
- ควรพาไปหาสัตวแพทย์เช็คสุขภาพปีละ 1 ครั้ง`;
    } else if (petType === 'แมว') {
        return `🐱 **การดูแล**
- ทำความสะอาดทรายแมวทุกวัน
- หวีขนสัปดาห์ละ 2-3 ครั้ง
- ให้อาหารคุณภาพดี วันละ 2 มื้อ
- ควรมีของเล่นและที่ลับเล็บ`;
    }

    return '';
}

function generateAdoptionInfoSection(categoryId: string, attributes: any): string {
    if (categoryId !== 'pets') return '';

    return `❤️ **ข้อมูลการรับเลี้ยง**
- พร้อมส่งมอบทันที
- สามารถนัดดูตัวจริงได้
- ให้คำปรึกษาการดูแลฟรี
- หวังเป็นอย่างยิ่งว่าจะได้บ้านที่อบอุ่นและมีความรับผิดชอบ`;
}

function generateBreedInfoSection(categoryId: string, attributes: any): string {
    if (categoryId !== 'pets') return '';

    return `🐾 **ข้อมูลสายพันธุ์**
- สายพันธุ์: ${attributes.breed}
- อายุ: ${attributes.age}
- เพศ: ${attributes.gender}
- สี/ลวดลาย: ${attributes.color || 'ตามรูป'}`;
}

// ========================================
// SECTION GENERATORS - CAMERAS
// ========================================

function generateImageQualitySection(categoryId: string, attributes: any): string {
    if (categoryId !== 'cameras') return '';

    return `🎨 **คุณภาพภาพ**
${attributes.sensor ? `- เซ็นเซอร์ ${attributes.sensor} ให้คุณภาพภาพสูง` : ''}
${attributes.megapixels ? `- ความละเอียด ${attributes.megapixels} MP เพียงพอสำหรับงานพิมพ์ขนาดใหญ่` : ''}
- ช่วงไดนามิกกว้าง ถ่ายในที่แสงน้อยได้ดี
- สีสันสดใส สมจริง`;
}

// ========================================
// HELPER FUNCTIONS
// ========================================

function getConditionDetail(condition: string, part: 'body' | 'screen'): string {
    if (condition.includes('สภาพดีมาก')) {
        return 'สวยมาก ไม่มีรอยขีดข่วน';
    } else if (condition.includes('สภาพดี')) {
        return 'มีรอยใช้งานเล็กน้อย ไม่เด่นชัด';
    } else {
        return 'มีรอยใช้งานปกติ';
    }
}

/**
 * สร้างจุดเด่น (Bullet Points)
 */
function generateHighlights(input: GenerateDescriptionInput, schema: any): string[] {
    const highlights: string[] = [];
    const { categoryId, attributes } = input;

    // ดึง Attributes ที่มีความสำคัญสูง
    const importantAttrs = schema.attributes.filter(
        (attr: any) => attr.aiImportance === 'critical' || attr.aiImportance === 'high'
    );

    importantAttrs.forEach((attr: any) => {
        const value = attributes[attr.key];
        if (value) {
            highlights.push(`${attr.label}: ${value}`);
        }
    });

    return highlights.slice(0, 5); // สูงสุด 5 จุด
}

/**
 * สร้างแท็ก
 */
function generateTags(input: GenerateDescriptionInput, schema: any): string[] {
    const tags: string[] = [];
    const { categoryId, attributes } = input;

    // เพิ่มแท็กจากหมวดหมู่
    tags.push(schema.categoryName);

    // เพิ่มแท็กจาก Attributes
    if (attributes.brand) tags.push(attributes.brand);
    if (attributes.model) tags.push(attributes.model);
    if (attributes.type) tags.push(attributes.type);
    if (attributes.condition) tags.push(attributes.condition);

    // เพิ่มแท็กเฉพาะหมวดหมู่
    switch (categoryId) {
        case 'mobiles':
            if (attributes.storage) tags.push(attributes.storage);
            break;
        case 'computers':
            if (attributes.processor) tags.push('CPU: ' + attributes.processor.split(' ')[0]);
            if (attributes.ram) tags.push(attributes.ram);
            break;
        case 'pets':
            if (attributes.breed) tags.push(attributes.breed);
            if (attributes.petType) tags.push(attributes.petType);
            break;
        case 'cameras':
            if (attributes.sensor) tags.push(attributes.sensor);
            break;
    }

    return [...new Set(tags)]; // ลบแท็กซ้ำ
}

/**
 * สร้าง SEO Keywords
 */
function generateSEOKeywords(input: GenerateDescriptionInput, schema: any): string[] {
    const keywords: string[] = [];
    const { categoryId, attributes } = input;

    // คำค้นหาพื้นฐาน
    keywords.push(schema.categoryName);
    keywords.push(`${schema.categoryName}มือสอง`);
    keywords.push(`ขาย${schema.categoryName}`);

    // คำค้นหาจากแบรนด์และรุ่น
    if (attributes.brand && attributes.model) {
        keywords.push(`${attributes.brand} ${attributes.model}`);
        keywords.push(`${attributes.brand} ${attributes.model} มือสอง`);
        keywords.push(`ขาย ${attributes.brand} ${attributes.model}`);
    }

    // คำค้นหาเฉพาะหมวดหมู่
    switch (categoryId) {
        case 'mobiles':
            keywords.push('โทรศัพท์มือสอง');
            keywords.push('มือถือมือสอง');
            if (attributes.storage) {
                keywords.push(`${attributes.brand} ${attributes.storage}`);
            }
            break;

        case 'computers':
            keywords.push('คอมมือสอง');
            keywords.push('โน้ตบุ๊คมือสอง');
            if (attributes.type === 'Gaming Laptop') {
                keywords.push('Gaming Laptop มือสอง');
            }
            break;

        case 'pets':
            keywords.push('สัตว์เลี้ยง');
            keywords.push(`${attributes.petType}ขาย`);
            if (attributes.breed) {
                keywords.push(`${attributes.petType}${attributes.breed}`);
            }
            break;

        case 'cameras':
            keywords.push('กล้องมือสอง');
            keywords.push(`${attributes.type} มือสอง`);
            break;
    }

    return [...new Set(keywords)]; // ลบคำซ้ำ
}
