// World-Class Auction System Types

export interface BidLog {
    id: string
    product_id: string
    bidder_id: string
    amount: number
    timestamp: string | Date

    // Fraud Detection Data (Security Layer)
    ip_address: string
    user_agent?: string
    geo_location?: {
        city: string
        country: string
        lat: number
        lng: number
    }
    device_fingerprint?: string

    // Metadata
    is_auto_bid: boolean
    is_winning_bid: boolean
    status: 'valid' | 'retracted' | 'cancelled_fraud'
}

export interface AuctionAutoBid {
    id: string
    product_id: string
    user_id: string
    max_amount: number // The ceiling price
    created_at: string | Date
    last_triggered_at?: string | Date
}

export interface AuctionFraudAlert {
    id: string
    product_id: string
    bidder_id: string
    type: 'shill_bidding' | 'bot_pattern' | 'multi_account' | 'strange_location'
    severity: 'low' | 'medium' | 'high' | 'critical'
    details: string
    detected_at: string | Date
    status: 'investigating' | 'confirmed_ban' | 'false_positive'
}
