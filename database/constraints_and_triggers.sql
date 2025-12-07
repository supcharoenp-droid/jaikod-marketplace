-- =====================================================
-- JaiKod Enhanced Member System
-- Database Constraints & Triggers
-- Version: 1.0
-- Created: 2025-12-07
-- =====================================================

-- =====================================================
-- 1. USER SYSTEM CONSTRAINTS & TRIGGERS
-- =====================================================

-- 1.1 Trust Score Validation
-- =====================================================

-- Constraint: Trust score must be 0-100
ALTER TABLE users ADD CONSTRAINT check_trust_score_range
CHECK (
    (trust_score->>'overall_score')::int >= 0 AND
    (trust_score->>'overall_score')::int <= 100
);

-- Trigger: Auto-update trust level based on score
CREATE OR REPLACE FUNCTION update_trust_level()
RETURNS TRIGGER AS $$
BEGIN
    NEW.trust_score = jsonb_set(
        NEW.trust_score,
        '{level}',
        to_jsonb(
            CASE 
                WHEN (NEW.trust_score->>'overall_score')::int >= 90 THEN 'diamond'
                WHEN (NEW.trust_score->>'overall_score')::int >= 75 THEN 'gold'
                WHEN (NEW.trust_score->>'overall_score')::int >= 50 THEN 'silver'
                ELSE 'bronze'
            END
        )
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trust_level_sync
    BEFORE INSERT OR UPDATE ON users
    FOR EACH ROW
    WHEN (NEW.trust_score IS NOT NULL)
    EXECUTE FUNCTION update_trust_level();

-- 1.2 Gamification Validation
-- =====================================================

-- Constraint: Level must match XP
ALTER TABLE users ADD CONSTRAINT check_level_xp_match
CHECK (
    (gamification->>'level')::int = 
    FLOOR(SQRT((gamification->>'experience_points')::int / 100.0)) + 1
);

-- Constraint: XP must be non-negative
ALTER TABLE users ADD CONSTRAINT check_positive_xp
CHECK ((gamification->>'experience_points')::int >= 0);

-- 1.3 Phone Number Validation
-- =====================================================

-- Constraint: Thai phone number format (0XXXXXXXXX)
ALTER TABLE users ADD CONSTRAINT check_thai_phone_format
CHECK (
    phoneNumber IS NULL OR
    phoneNumber ~ '^0[0-9]{9}$'
);

-- =====================================================
-- 2. SELLER SYSTEM CONSTRAINTS & TRIGGERS
-- =====================================================

-- 2.1 Seller Tier & Commission Rate Sync
-- =====================================================

-- Trigger: Auto-update commission rate when tier changes
CREATE OR REPLACE FUNCTION update_commission_rate()
RETURNS TRIGGER AS $$
BEGIN
    NEW.tier_info = jsonb_set(
        NEW.tier_info,
        '{commission_rate}',
        to_jsonb(
            CASE (NEW.tier_info->>'current_tier')
                WHEN 'top_seller' THEN 3.0
                WHEN 'power_seller' THEN 3.5
                WHEN 'established' THEN 4.0
                WHEN 'rising' THEN 4.5
                ELSE 5.0
            END
        )
    );
    
    -- Update tier_achieved_at if tier changed
    IF OLD.tier_info->>'current_tier' IS DISTINCT FROM NEW.tier_info->>'current_tier' THEN
        NEW.tier_info = jsonb_set(
            NEW.tier_info,
            '{tier_achieved_at}',
            to_jsonb(NOW())
        );
        
        -- Add to tier change history
        NEW.tier_info = jsonb_set(
            NEW.tier_info,
            '{tier_change_history}',
            (NEW.tier_info->'tier_change_history')::jsonb || 
            jsonb_build_array(
                jsonb_build_object(
                    'tier', NEW.tier_info->>'current_tier',
                    'changed_at', NOW(),
                    'reason', 'Auto-update based on performance'
                )
            )
        );
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER commission_rate_sync
    BEFORE INSERT OR UPDATE ON seller_profiles
    FOR EACH ROW
    WHEN (NEW.tier_info IS NOT NULL)
    EXECUTE FUNCTION update_commission_rate();

-- 2.2 Rating Validation
-- =====================================================

-- Constraint: Ratings must be 0-5
ALTER TABLE seller_profiles ADD CONSTRAINT check_rating_range
CHECK (
    (ratings->>'overall')::numeric >= 0 AND
    (ratings->>'overall')::numeric <= 5 AND
    (ratings->>'product_quality')::numeric >= 0 AND
    (ratings->>'product_quality')::numeric <= 5 AND
    (ratings->>'communication')::numeric >= 0 AND
    (ratings->>'communication')::numeric <= 5 AND
    (ratings->>'shipping_speed')::numeric >= 0 AND
    (ratings->>'shipping_speed')::numeric <= 5 AND
    (ratings->>'packaging')::numeric >= 0 AND
    (ratings->>'packaging')::numeric <= 5 AND
    (ratings->>'accuracy')::numeric >= 0 AND
    (ratings->>'accuracy')::numeric <= 5 AND
    (ratings->>'value_for_money')::numeric >= 0 AND
    (ratings->>'value_for_money')::numeric <= 5
);

-- Constraint: Rating distribution must sum to total_reviews
ALTER TABLE seller_profiles ADD CONSTRAINT check_rating_distribution
CHECK (
    (ratings->'rating_distribution'->>'five_star')::int +
    (ratings->'rating_distribution'->>'four_star')::int +
    (ratings->'rating_distribution'->>'three_star')::int +
    (ratings->'rating_distribution'->>'two_star')::int +
    (ratings->'rating_distribution'->>'one_star')::int =
    (ratings->>'total_reviews')::int
);

-- 2.3 Performance Metrics Validation
-- =====================================================

-- Constraint: Non-negative metrics
ALTER TABLE seller_profiles ADD CONSTRAINT check_positive_metrics
CHECK (
    (performance->>'total_sales')::int >= 0 AND
    (performance->>'total_revenue')::numeric >= 0 AND
    (performance->>'avg_order_value')::numeric >= 0 AND
    (performance->>'response_rate')::numeric >= 0 AND
    (performance->>'response_rate')::numeric <= 100
);

-- =====================================================
-- 3. REVIEW SYSTEM CONSTRAINTS & TRIGGERS
-- =====================================================

-- 3.1 Review Ratings Validation
-- =====================================================

-- Constraint: Detailed ratings must be 1-5
ALTER TABLE reviews ADD CONSTRAINT check_review_rating_range
CHECK (
    (detailed_ratings->>'product_quality')::numeric >= 1 AND
    (detailed_ratings->>'product_quality')::numeric <= 5 AND
    (detailed_ratings->>'value_for_money')::numeric >= 1 AND
    (detailed_ratings->>'value_for_money')::numeric <= 5 AND
    (detailed_ratings->>'seller_service')::numeric >= 1 AND
    (detailed_ratings->>'seller_service')::numeric <= 5 AND
    (detailed_ratings->>'shipping_speed')::numeric >= 1 AND
    (detailed_ratings->>'shipping_speed')::numeric <= 5 AND
    (detailed_ratings->>'packaging_quality')::numeric >= 1 AND
    (detailed_ratings->>'packaging_quality')::numeric <= 5 AND
    (detailed_ratings->>'accuracy')::numeric >= 1 AND
    (detailed_ratings->>'accuracy')::numeric <= 5
);

-- Trigger: Auto-calculate overall rating
CREATE OR REPLACE FUNCTION sync_overall_rating()
RETURNS TRIGGER AS $$
BEGIN
    NEW.detailed_ratings = jsonb_set(
        NEW.detailed_ratings,
        '{overall}',
        to_jsonb(
            ROUND(
                (
                    (NEW.detailed_ratings->>'product_quality')::numeric +
                    (NEW.detailed_ratings->>'value_for_money')::numeric +
                    (NEW.detailed_ratings->>'seller_service')::numeric +
                    (NEW.detailed_ratings->>'shipping_speed')::numeric +
                    (NEW.detailed_ratings->>'packaging_quality')::numeric +
                    (NEW.detailed_ratings->>'accuracy')::numeric
                ) / 6.0,
                1
            )
        )
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER overall_rating_sync
    BEFORE INSERT OR UPDATE ON reviews
    FOR EACH ROW
    WHEN (NEW.detailed_ratings IS NOT NULL)
    EXECUTE FUNCTION sync_overall_rating();

-- 3.2 AI Analysis Validation
-- =====================================================

-- Constraint: Sentiment score must be -1 to 1
ALTER TABLE reviews ADD CONSTRAINT check_sentiment_score
CHECK (
    (ai_analysis->>'sentiment_score')::numeric >= -1 AND
    (ai_analysis->>'sentiment_score')::numeric <= 1
);

-- Constraint: Spam score must be 0-100
ALTER TABLE reviews ADD CONSTRAINT check_spam_score
CHECK (
    (ai_analysis->>'spam_score')::numeric >= 0 AND
    (ai_analysis->>'spam_score')::numeric <= 100
);

-- 3.3 Verified Purchase Validation
-- =====================================================

-- Foreign key: Review must reference valid order
ALTER TABLE reviews 
ADD CONSTRAINT fk_review_order 
FOREIGN KEY (order_id) 
REFERENCES orders(id) 
ON DELETE RESTRICT;

-- =====================================================
-- 4. LOYALTY SYSTEM CONSTRAINTS & TRIGGERS
-- =====================================================

-- 4.1 Points Balance Validation
-- =====================================================

-- Constraint: Points balance must be non-negative
ALTER TABLE loyalty_programs 
ADD CONSTRAINT check_positive_balance 
CHECK (points_balance >= 0);

-- Constraint: Lifetime points must be >= current balance
ALTER TABLE loyalty_programs
ADD CONSTRAINT check_lifetime_points
CHECK (points_lifetime >= points_balance);

-- 4.2 Loyalty Tier Sync
-- =====================================================

-- Trigger: Auto-update tier based on points
CREATE OR REPLACE FUNCTION update_loyalty_tier()
RETURNS TRIGGER AS $$
DECLARE
    old_tier VARCHAR(20);
    new_tier VARCHAR(20);
BEGIN
    old_tier := OLD.tier;
    
    new_tier := CASE
        WHEN NEW.points_balance >= 50000 THEN 'diamond'
        WHEN NEW.points_balance >= 15000 THEN 'platinum'
        WHEN NEW.points_balance >= 5000 THEN 'gold'
        WHEN NEW.points_balance >= 1000 THEN 'silver'
        ELSE 'bronze'
    END;
    
    NEW.tier := new_tier;
    
    -- Update tier_achieved_at if tier changed
    IF old_tier IS DISTINCT FROM new_tier THEN
        NEW.tier_achieved_at := NOW();
    END IF;
    
    -- Update tier_points_required
    NEW.tier_points_required := CASE new_tier
        WHEN 'diamond' THEN 50000
        WHEN 'platinum' THEN 15000
        WHEN 'gold' THEN 5000
        WHEN 'silver' THEN 1000
        ELSE 0
    END;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER loyalty_tier_sync
    BEFORE INSERT OR UPDATE ON loyalty_programs
    FOR EACH ROW
    EXECUTE FUNCTION update_loyalty_tier();

-- 4.3 Points Transaction Validation
-- =====================================================

-- Constraint: Balance after must be correct
CREATE OR REPLACE FUNCTION validate_points_transaction()
RETURNS TRIGGER AS $$
DECLARE
    current_balance INT;
BEGIN
    -- Get current balance
    SELECT points_balance INTO current_balance
    FROM loyalty_programs
    WHERE user_id = NEW.user_id;
    
    -- Validate balance_after
    IF NEW.balance_after != current_balance + NEW.amount THEN
        RAISE EXCEPTION 'Invalid balance_after: expected %, got %', 
            current_balance + NEW.amount, NEW.balance_after;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER validate_points_tx
    BEFORE INSERT ON points_transactions
    FOR EACH ROW
    EXECUTE FUNCTION validate_points_transaction();

-- =====================================================
-- 5. REFERRAL SYSTEM CONSTRAINTS
-- =====================================================

-- Constraint: Referral code must be unique
CREATE UNIQUE INDEX idx_referral_code_unique 
ON referral_programs(referral_code);

-- Constraint: Custom code must be unique if set
CREATE UNIQUE INDEX idx_custom_code_unique 
ON referral_programs(custom_code) 
WHERE custom_code IS NOT NULL;

-- Constraint: Successful referrals <= total referrals
ALTER TABLE referral_programs
ADD CONSTRAINT check_successful_referrals
CHECK (successful_referrals <= total_referrals);

-- =====================================================
-- 6. WISHLIST CONSTRAINTS
-- =====================================================

-- Constraint: User can't have duplicate wishlist items
CREATE UNIQUE INDEX idx_wishlist_unique 
ON wishlists(user_id, product_id);

-- Foreign keys
ALTER TABLE wishlists
ADD CONSTRAINT fk_wishlist_user
FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

ALTER TABLE wishlists
ADD CONSTRAINT fk_wishlist_product
FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE;

-- =====================================================
-- 7. ADMIN SYSTEM CONSTRAINTS
-- =====================================================

-- Constraint: Performance metrics must be non-negative
ALTER TABLE admin_users ADD CONSTRAINT check_admin_metrics
CHECK (
    (performance_metrics->>'cases_handled_total')::int >= 0 AND
    (performance_metrics->>'avg_resolution_time_minutes')::numeric >= 0 AND
    (performance_metrics->>'user_satisfaction_score')::numeric >= 0 AND
    (performance_metrics->>'user_satisfaction_score')::numeric <= 5
);

-- =====================================================
-- 8. MODERATION QUEUE CONSTRAINTS
-- =====================================================

-- Constraint: Priority score must be 0-100
ALTER TABLE moderation_queue
ADD CONSTRAINT check_priority_score
CHECK (priority_score >= 0 AND priority_score <= 100);

-- Constraint: AI confidence must be 0-100
ALTER TABLE moderation_queue
ADD CONSTRAINT check_ai_confidence
CHECK (
    ai_confidence IS NULL OR
    (ai_confidence >= 0 AND ai_confidence <= 100)
);

-- =====================================================
-- 9. UTILITY FUNCTIONS
-- =====================================================

-- 9.1 Reconcile Points Balance
-- =====================================================

CREATE OR REPLACE FUNCTION reconcile_points_balance(p_user_id UUID)
RETURNS TABLE(
    user_id UUID,
    old_balance INT,
    calculated_balance INT,
    difference INT,
    fixed BOOLEAN
) AS $$
DECLARE
    v_old_balance INT;
    v_calculated_balance INT;
    v_difference INT;
BEGIN
    -- Get current balance
    SELECT points_balance INTO v_old_balance
    FROM loyalty_programs
    WHERE loyalty_programs.user_id = p_user_id;
    
    -- Calculate from transactions
    SELECT COALESCE(SUM(amount), 0) INTO v_calculated_balance
    FROM points_transactions
    WHERE points_transactions.user_id = p_user_id
    AND status = 'confirmed';
    
    v_difference := v_old_balance - v_calculated_balance;
    
    -- Fix if mismatch
    IF v_difference != 0 THEN
        UPDATE loyalty_programs
        SET points_balance = v_calculated_balance,
            last_updated = NOW()
        WHERE loyalty_programs.user_id = p_user_id;
        
        -- Log the fix
        INSERT INTO audit_logs (
            type, user_id, old_value, new_value, reason, created_at
        ) VALUES (
            'points_reconciliation',
            p_user_id,
            v_old_balance::TEXT,
            v_calculated_balance::TEXT,
            'Auto-reconciliation',
            NOW()
        );
        
        RETURN QUERY SELECT 
            p_user_id, 
            v_old_balance, 
            v_calculated_balance, 
            v_difference,
            TRUE;
    ELSE
        RETURN QUERY SELECT 
            p_user_id, 
            v_old_balance, 
            v_calculated_balance, 
            v_difference,
            FALSE;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- 9.2 Recalculate Seller Performance
-- =====================================================

CREATE OR REPLACE FUNCTION recalculate_seller_performance(p_seller_id UUID)
RETURNS JSONB AS $$
DECLARE
    v_performance JSONB;
BEGIN
    SELECT jsonb_build_object(
        'total_sales', COUNT(*),
        'total_revenue', COALESCE(SUM(net_total), 0),
        'avg_order_value', COALESCE(AVG(net_total), 0),
        'last_calculated', NOW()
    ) INTO v_performance
    FROM orders
    WHERE seller_id = p_seller_id
    AND status = 'completed';
    
    -- Update seller profile
    UPDATE seller_profiles
    SET performance = performance || v_performance,
        updated_at = NOW()
    WHERE id = p_seller_id;
    
    RETURN v_performance;
END;
$$ LANGUAGE plpgsql;

-- 9.3 Validate Data Integrity
-- =====================================================

CREATE OR REPLACE FUNCTION validate_data_integrity()
RETURNS TABLE(
    check_name TEXT,
    status TEXT,
    count INT,
    details TEXT
) AS $$
BEGIN
    -- Check 1: Trust level mismatches
    RETURN QUERY
    SELECT 
        'trust_level_mismatch'::TEXT,
        'warning'::TEXT,
        COUNT(*)::INT,
        'Users with trust level not matching score'::TEXT
    FROM users
    WHERE (trust_score->>'level') != 
        CASE 
            WHEN (trust_score->>'overall_score')::int >= 90 THEN 'diamond'
            WHEN (trust_score->>'overall_score')::int >= 75 THEN 'gold'
            WHEN (trust_score->>'overall_score')::int >= 50 THEN 'silver'
            ELSE 'bronze'
        END;
    
    -- Check 2: Points balance mismatches
    RETURN QUERY
    SELECT 
        'points_balance_mismatch'::TEXT,
        'critical'::TEXT,
        COUNT(*)::INT,
        'Loyalty programs with incorrect balance'::TEXT
    FROM loyalty_programs lp
    WHERE lp.points_balance != (
        SELECT COALESCE(SUM(amount), 0)
        FROM points_transactions pt
        WHERE pt.user_id = lp.user_id
        AND pt.status = 'confirmed'
    );
    
    -- Check 3: Orphaned reviews
    RETURN QUERY
    SELECT 
        'orphaned_reviews'::TEXT,
        'warning'::TEXT,
        COUNT(*)::INT,
        'Reviews without valid orders'::TEXT
    FROM reviews r
    WHERE NOT EXISTS (
        SELECT 1 FROM orders o WHERE o.id = r.order_id
    );
    
    -- Check 4: Negative balances
    RETURN QUERY
    SELECT 
        'negative_balances'::TEXT,
        'critical'::TEXT,
        COUNT(*)::INT,
        'Loyalty programs with negative balance'::TEXT
    FROM loyalty_programs
    WHERE points_balance < 0;
    
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- 10. INDEXES FOR PERFORMANCE
-- =====================================================

-- User indexes
CREATE INDEX IF NOT EXISTS idx_users_trust_level 
ON users((trust_score->>'level'));

CREATE INDEX IF NOT EXISTS idx_users_kyc_status 
ON users(kyc_status);

-- Seller indexes
CREATE INDEX IF NOT EXISTS idx_sellers_tier 
ON seller_profiles((tier_info->>'current_tier'));

CREATE INDEX IF NOT EXISTS idx_sellers_rating 
ON seller_profiles(((ratings->>'overall')::numeric) DESC);

-- Review indexes
CREATE INDEX IF NOT EXISTS idx_reviews_product 
ON reviews(product_id);

CREATE INDEX IF NOT EXISTS idx_reviews_seller 
ON reviews(seller_id);

CREATE INDEX IF NOT EXISTS idx_reviews_verified 
ON reviews((ai_analysis->>'is_verified_purchase')::boolean);

-- Loyalty indexes
CREATE INDEX IF NOT EXISTS idx_loyalty_tier 
ON loyalty_programs(tier);

CREATE INDEX IF NOT EXISTS idx_loyalty_points 
ON loyalty_programs(points_balance DESC);

-- Points transaction indexes
CREATE INDEX IF NOT EXISTS idx_points_tx_user 
ON points_transactions(user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_points_tx_status 
ON points_transactions(status);

-- Wishlist indexes
CREATE INDEX IF NOT EXISTS idx_wishlist_user 
ON wishlists(user_id);

CREATE INDEX IF NOT EXISTS idx_wishlist_product 
ON wishlists(product_id);

-- Moderation queue indexes
CREATE INDEX IF NOT EXISTS idx_moderation_status 
ON moderation_queue(status);

CREATE INDEX IF NOT EXISTS idx_moderation_priority 
ON moderation_queue(priority_score DESC, created_at ASC);

CREATE INDEX IF NOT EXISTS idx_moderation_assigned 
ON moderation_queue(assigned_to) 
WHERE assigned_to IS NOT NULL;

-- =====================================================
-- END OF FILE
-- =====================================================

-- Usage Examples:
-- 
-- 1. Reconcile all points balances:
-- SELECT * FROM reconcile_points_balance(user_id) 
-- FROM users;
--
-- 2. Recalculate seller performance:
-- SELECT recalculate_seller_performance('seller-uuid-here');
--
-- 3. Run data integrity checks:
-- SELECT * FROM validate_data_integrity();
