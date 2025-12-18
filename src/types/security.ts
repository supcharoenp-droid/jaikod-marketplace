import { Timestamp } from 'firebase/firestore';

/**
 * Access Log Interface for Security Tracking
 * Designed to be privacy-compliant and performance-optimized.
 */
export interface UserAccessLog {
    id: string;               // Auto-generated ID
    userId: string;           // User Identifier

    // Core Event Data
    action: 'LOGIN' | 'LOGOUT' | 'LOGIN_FAILED' | 'PASSWORD_CHANGE' | 'DEVICE_VERIFY' | 'DATA_EXPORT' | 'ACCOUNT_DELETE';
    status: 'SUCCESS' | 'FAILURE';
    reason?: string;          // e.g., "Wrong password", "Account suspended" (Internal reason code)

    // Security Context (Snapshot at time of event)
    ip_address: string;       // Public IP
    user_agent: string;       // Raw UA string for detailed analysis

    // Device Fingerprinting (Derived from UA)
    device_info: {
        browser: string;      // e.g., "Chrome 120"
        os: string;           // e.g., "Windows 11"
        device_type: 'mobile' | 'desktop' | 'tablet' | 'unknown';
        is_new_device: boolean; // Flag if this device hasn't been seen before for this user
    };

    // Location (Geo-IP) - Optional in Phase 1
    location?: {
        country: string;
        city: string;
        lat?: number;
        lng?: number;
    };

    // Session Metadata
    session_id?: string;      // Correlate with concurrent sessions
    risk_score?: number;      // 0-100 (AI-calculated risk)

    timestamp: Timestamp;
}

// Security Configuration Interface
export interface SecurityConfig {
    max_login_attempts: number;    // e.g., 5
    lockout_duration_minutes: number; // e.g., 15
    require_new_device_verification: boolean;
    notify_on_login: boolean;     // Send email/push on login?
}
