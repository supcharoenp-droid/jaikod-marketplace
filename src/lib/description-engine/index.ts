/**
 * JAIKOD WORLD-CLASS AI DESCRIPTION ENGINE
 * 
 * ระบบสร้างรายละเอียดสินค้าอัจฉริยะระดับโลก
 * 
 * 📁 MODULAR STRUCTURE:
 * └── description-engine/
 *     ├── index.ts          (this file - main exports)
 *     ├── types.ts          (interfaces & types)
 *     ├── legacy.ts         (backward compatibility)
 *     ├── templates/
 *     │   ├── index.ts      (template registry)
 *     │   ├── automotive.ts 
 *     │   ├── computer.ts   
 *     │   ├── electronics.ts
 *     │   ├── fashion.ts    
 *     │   └── general.ts    
 *     └── generators/
 *         ├── index.ts
 *         ├── structured.ts 
 *         ├── marketing.ts  
 *         └── seo.ts        
 */

// Re-export types
export * from './types'

// Re-export templates
export { getTemplateForCategory, hasSpecializedTemplate } from './templates'

// Re-export generators
export {
    generateStructuredDescription,
    generateWorldClassDescription,
    generateMarketingDescription,
    optimizeForSEO
} from './generators'

// Re-export legacy functions for backward compatibility
export {
    generateDescriptionForCategory,
    getCategoryTemplate,
    buildDescription
} from './legacy'

