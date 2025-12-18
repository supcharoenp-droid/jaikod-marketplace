import { db } from './firebase';
import { doc, runTransaction, serverTimestamp, collection, addDoc, getDocs, query, where, orderBy, limit } from 'firebase/firestore';
import { Product } from '@/types';
import { BidLog, AuctionAutoBid, AuctionFraudAlert } from '@/types/auction';

/**
 * JAIDKOD AUCTION ENGINE (JAE) v1.0
 * Handles bidding logic, auto-bids, and anti-snipe protection.
 */

// 1. Calculate Minimum Next Bid
export function getMinimumBidAmount(currentPrice: number, increment: number): number {
    return currentPrice + increment;
}

// 2. Check Anti-Snipe Extension
export function shouldExtendAuction(endTime: Date, triggerWindowSeconds: number = 60): boolean {
    const now = new Date();
    const timeLeft = endTime.getTime() - now.getTime();
    return timeLeft > 0 && timeLeft <= (triggerWindowSeconds * 1000);
}

// 3. Process a New Bid (Main Logic)
// Note: In production, this MUST run in a Firebase Cloud Function for transactional safety.
// Here we simulate the logic for client-side demo use.
export async function placeBid(
    productId: string,
    userId: string,
    amount: number,
    clientIp: string
): Promise<{ success: boolean, message: string }> {

    // Validate Input
    if (amount <= 0) return { success: false, message: 'ยอดเงินไม่ถูกต้อง' };

    try {
        await runTransaction(db, async (transaction) => {
            const productRef = doc(db, 'products', productId);
            const productDoc = await transaction.get(productRef);

            if (!productDoc.exists()) throw "Product not found";

            const product = productDoc.data() as Product;
            const auction = product.auction_config;
            const state = product.auction_state;

            if (!auction || !state) throw "Not an auction item";
            if (state.status !== 'active') throw "Auction is not active";
            if (new Date() > new Date(auction.end_time)) throw "Auction ended";

            // Check Price
            const minBid = state.current_price + auction.bid_increment;
            if (amount < minBid) throw `Bid too low. Minimum is ${minBid}`;

            // --- ALL CHECKS PASSED ---

            // 1. Update Product State
            let newEndTime = new Date(auction.end_time);

            // Anti-Snipe Logic
            if (auction.extend_rule?.is_enabled && shouldExtendAuction(newEndTime, auction.extend_rule.trigger_window_seconds)) {
                newEndTime = new Date(newEndTime.getTime() + (auction.extend_rule.extend_seconds * 1000));
                console.log('🔫 Anti-Snipe Triggered! Extended time.');
            }

            transaction.update(productRef, {
                'auction_state.current_price': amount,
                'auction_state.last_bidder_id': userId,
                'auction_state.total_bids': state.total_bids + 1,
                'auction_config.end_time': newEndTime.toISOString() // Update end time if extended
            });

            // 2. Log Bid
            const bidLogRef = doc(collection(db, 'bid_logs'));
            transaction.set(bidLogRef, {
                product_id: productId,
                bidder_id: userId,
                amount: amount,
                timestamp: serverTimestamp(),
                ip_address: clientIp,
                is_auto_bid: false,
                status: 'valid'
            });

            // 3. Trigger Auto-Bids (Proxy Bidding)
            // (In real world, this calls a separate background function)
            // await processAutoBids(productId, amount); 
        });

        return { success: true, message: 'Bid placed successfully' };

    } catch (e: any) {
        console.error('Bid failed:', e);
        return { success: false, message: typeof e === 'string' ? e : 'System error' };
    }
}

// 4. Auto-Bid Logic (The "eBay" Proxy System)
export async function setAutoBid(productId: string, userId: string, maxAmount: number) {
    // Save user's max ceiling. 
    // The system will keep bidding for them up to this amount.
    await addDoc(collection(db, 'auction_auto_bids'), {
        product_id: productId,
        user_id: userId,
        max_amount: maxAmount,
        created_at: serverTimestamp()
    });
}
