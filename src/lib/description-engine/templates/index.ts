/**
 * Category Template Registry
 * 
 * Maps category IDs to their specific templates
 */

import type { CategoryTemplate } from '../types'

// Import individual category templates
import { AUTOMOTIVE_TEMPLATE } from './automotive'
import { COMPUTER_TEMPLATE } from './computer'
import { ELECTRONICS_TEMPLATE } from './electronics'
import { FASHION_TEMPLATE } from './fashion'
import { GENERAL_TEMPLATE } from './general'

// Template Registry Map
export const CATEGORY_TEMPLATES: Record<number, CategoryTemplate> = {
    // Automotive
    1: AUTOMOTIVE_TEMPLATE,   // Cars
    2: AUTOMOTIVE_TEMPLATE,   // Motorcycles

    // Electronics
    3: ELECTRONICS_TEMPLATE,  // Mobile Phones
    4: COMPUTER_TEMPLATE,     // Computers & IT
    5: ELECTRONICS_TEMPLATE,  // Cameras
    6: ELECTRONICS_TEMPLATE,  // Appliances

    // Fashion
    7: FASHION_TEMPLATE,      // Fashion
    8: FASHION_TEMPLATE,      // Beauty

    // Others use general template
}

/**
 * Get template for a specific category
 */
export function getTemplateForCategory(categoryId: number): CategoryTemplate {
    return CATEGORY_TEMPLATES[categoryId] || GENERAL_TEMPLATE
}

/**
 * Check if category has specialized template
 */
export function hasSpecializedTemplate(categoryId: number): boolean {
    return categoryId in CATEGORY_TEMPLATES
}

// Re-export all templates
export { AUTOMOTIVE_TEMPLATE } from './automotive'
export { COMPUTER_TEMPLATE } from './computer'
export { ELECTRONICS_TEMPLATE } from './electronics'
export { FASHION_TEMPLATE } from './fashion'
export { GENERAL_TEMPLATE } from './general'
