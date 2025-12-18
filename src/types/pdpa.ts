import { Timestamp } from 'firebase/firestore';

/**
 * PDPA & Consent Type Definitions
 * Designed for legal compliance and audit trails.
 */

export type ConsentType = 'COOKIE' | 'MARKETING' | 'TERMS_OF_SERVICE' | 'PRIVACY_POLICY';
export type ConsentStatus = 'ACCEPTED' | 'REJECTED';

export interface ConsentLog {
    id: string;               // Auto-generated ID
    userId: string;           // User ID or "guest_cookie_id"

    // Core Consent Data
    consentType: ConsentType;
    version: string;          // e.g., "1.0", "2024-01-01" (Vital for legal version control)
    status: ConsentStatus;

    // Detailed Preferences (e.g., for Cookie or Marketing granular choices)
    preferences?: {
        necessary?: boolean;
        analytics?: boolean;
        marketing?: boolean;
        email_marketing?: boolean;
        sms_updates?: boolean;
    };

    // Legal Evidence (Context)
    metadata: {
        ip_address: string;     // Must capture IP at moment of consent
        user_agent: string;     // Device info used
        platform: 'web' | 'ios' | 'android';
        location?: string;      // Country/City level only (Minimize PII)
    };

    timestamp: Timestamp;
}

export interface PrivacyPolicyVersion {
    version: string;
    effective_date: string; // ISO Date
    content_url: string;    // Link to the policy document (e.g., PDF/Markdown)
    changes_summary: string;
    is_active: boolean;
}
