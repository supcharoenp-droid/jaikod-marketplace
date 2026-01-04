/**
 * DESCRIPTION ENGINE MODULE
 * 
 * Exports for description generation system
 * 
 * Usage:
 * import { getTemplateByCategory, StructuredDescription } from '@/lib/description'
 */

// Types
export type {
    AIDescriptionContext,
    StructuredDescription,
    DescriptionSection,
    MissingField,
    CategoryTemplate,
    TemplateSection,
    TemplateField,
    FieldOption,
    FieldImportance,
    FieldType,
    DescriptionGenerationOptions,
    DescriptionBuilderResult,
    SectionBuilder
} from './types'

export { DEFAULT_GENERATION_OPTIONS } from './types'

// Template registry
export {
    getTemplateByCategory,
    getTemplateBySubcategory,
    hasTemplateFor,
    getRegisteredCategories,
    registerTemplate,
    CATEGORY_TEMPLATES,
    DEFAULT_TEMPLATE
} from './templates'

// Individual templates (for direct import if needed)
export { COMPUTER_TEMPLATE } from './templates/computer'
export { MOBILE_TEMPLATE } from './templates/mobile'
