/**
 * EXPERT CATEGORY KEYWORDS - Complete Coverage
 * 
 * Referenced from:
 * - Kaidee.com (Thailand #1 Marketplace)
 * - Shopee Thailand
 * - Lazada Thailand
 * - eBay, Amazon (International standards)
 * 
 * Strategy:
 * 1. Thai + English keywords
 * 2. Brand names (specific to category)
 * 3. Common misspellings
 * 4. Slang/colloquial terms
 * 5. Product models/types
 * 
 * Updated: 2025-12-19 (Fixed Imports for Stability)
 */

import { COMPREHENSIVE_COMPUTER_KEYWORDS } from './comprehensive-computer-keywords'
import { COMPREHENSIVE_AUTOMOTIVE_KEYWORDS } from './comprehensive-automotive-keywords'
import { COMPREHENSIVE_REAL_ESTATE_KEYWORDS } from './comprehensive-real-estate-keywords'
import { COMPREHENSIVE_MOBILE_KEYWORDS } from './comprehensive-mobile-keywords'
import { COMPREHENSIVE_APPLIANCES_KEYWORDS } from './comprehensive-appliances-keywords'
import { COMPREHENSIVE_FASHION_KEYWORDS } from './comprehensive-fashion-keywords'
import { COMPREHENSIVE_GAMING_KEYWORDS } from './comprehensive-gaming-keywords'
import { COMPREHENSIVE_CAMERAS_KEYWORDS } from './comprehensive-camera-keywords'
import { COMPREHENSIVE_AMULET_KEYWORDS } from './comprehensive-amulet-keywords'
import { COMPREHENSIVE_PETS_KEYWORDS } from './comprehensive-pets-keywords'
import { COMPREHENSIVE_SERVICES_KEYWORDS } from './comprehensive-services-keywords'
import { COMPREHENSIVE_SPORTS_KEYWORDS } from './comprehensive-sports-keywords'
import { COMPREHENSIVE_HOME_GARDEN_KEYWORDS } from './comprehensive-home-keywords'
import { COMPREHENSIVE_BEAUTY_KEYWORDS } from './comprehensive-beauty-keywords'
import { COMPREHENSIVE_KIDS_KEYWORDS } from './comprehensive-kids-keywords'
import { COMPREHENSIVE_BOOKS_KEYWORDS } from './comprehensive-books-keywords'
// For category 99, we'll use a simple fallback or empty array if file doesn't exist
// Assuming COMPREHENSIVE_OTHERS_KEYWORDS logic is handled elsewhere or we can define simple one here if needed.
// For now, let's keep the import but ensure the file exists or fallback.
// If 'comprehensive-others-keywords' does not exist, we should remove it. 
// I'll assume it doesn't exist yet and remove it to prevent errors, replacing with empty array.

export const EXPERT_CATEGORY_KEYWORDS: Record<number, string[]> = {
    // 1. ยานยนต์ (Automotive)
    1: COMPREHENSIVE_AUTOMOTIVE_KEYWORDS,

    // 2. อสังหาริมทรัพย์ (Real Estate)
    2: COMPREHENSIVE_REAL_ESTATE_KEYWORDS,

    // 3. มือถือและแท็บเล็ต (Mobiles & Tablets)
    3: COMPREHENSIVE_MOBILE_KEYWORDS,

    // 4. คอมพิวเตอร์และไอที (Computers & IT)
    4: COMPREHENSIVE_COMPUTER_KEYWORDS,

    // 5. เครื่องใช้ไฟฟ้า (Home Appliances)
    5: COMPREHENSIVE_APPLIANCES_KEYWORDS,

    // 6. แฟชั่น (Fashion)
    6: COMPREHENSIVE_FASHION_KEYWORDS,

    // 7. เกมและแก็ดเจ็ต (Gaming & Gadgets)
    7: COMPREHENSIVE_GAMING_KEYWORDS,

    // 8. กล้องถ่ายรูป (Cameras)
    8: COMPREHENSIVE_CAMERAS_KEYWORDS,

    // 9. พระเครื่องและของสะสม (Amulets & Collectibles)
    9: COMPREHENSIVE_AMULET_KEYWORDS,

    // 10. สัตว์เลี้ยง (Pets)
    10: COMPREHENSIVE_PETS_KEYWORDS,

    // 11. บริการ (Services)
    11: COMPREHENSIVE_SERVICES_KEYWORDS,

    // 12. กีฬาและท่องเที่ยว (Sports & Travel)
    12: COMPREHENSIVE_SPORTS_KEYWORDS,

    // 13. บ้านและสวน (Home & Garden)
    13: COMPREHENSIVE_HOME_GARDEN_KEYWORDS,

    // 14. เครื่องสำอางและความงาม (Beauty & Cosmetics)
    14: COMPREHENSIVE_BEAUTY_KEYWORDS,

    // 15. เด็กและทารก (Baby & Kids)
    15: COMPREHENSIVE_KIDS_KEYWORDS,

    // 16. หนังสือและการศึกษา (Books & Education)
    16: COMPREHENSIVE_BOOKS_KEYWORDS,

    // 99. เบ็ดเตล็ด (Others)
    99: ['จิปาถะ', 'อื่นๆ', 'miscellaneous', 'others', 'etc'],
}
