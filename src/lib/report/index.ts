/**
 * Report System - Main Export
 */

export * from './types'
export * from './reportService'

// Re-export with namespace
import { ReportService } from './reportService'
import {
    REPORT_CATEGORIES,
    getCategoriesForTarget,
    getCategoryConfig,
    getStatusDisplay,
    getPriorityDisplay,
    getActionDisplay
} from './types'

export const Report = {
    // Service
    ...ReportService,

    // Config
    categories: REPORT_CATEGORIES,
    getCategoriesForTarget,
    getCategoryConfig,

    // Display helpers
    getStatusDisplay,
    getPriorityDisplay,
    getActionDisplay
}

export default Report
